<?php
global $smwgIP, $smwgHaloIP;
require_once( "$smwgIP/includes/storage/SMW_Store.php" );
require_once( "$smwgHaloIP/includes/storage/stompclient/Stomp.php" );


/**
 * Triple store connector class.
 *
 * This class is a wrapper around the default SMWStore class. It delegates all
 * read operations to the default implementation. Write operation, namely:
 *
 *  1. updateData
 *  2. deleteSubject
 *  3. changeTitle
 *  4. setup
 *  5. drop
 *
 * are delegated too, but also sent to a MessageBroker supporting the Stomp protocol.
 * All commands are written in the SPARUL(1) syntax.
 *
 * SPARQL queries are sent to the triple store via webservice (SPARQL endpoint). ASK
 * queries are delgated to default SMWStore.
 *
 * (1) refer to http://jena.hpl.hp.com/~afs/SPARQL-Update.html
 *
 * Configuration in LocalSettings.php:
 *
 *  $smwgMessageBroker: The name or IP of the message broker
 *  $smwgWebserviceEndpoint: The name or IP of the SPARQL endpoint (with port if not 80)
 *
 * @author: Kai
 */

class SMWTripleStore extends SMWStore {

	// W3C namespaces
	protected static $RDF_NS = "http://www.w3.org/1999/02/22-rdf-syntax-ns#";
	protected static $OWL_NS = "http://www.w3.org/2002/07/owl#";
	protected static $RDFS_NS = "http://www.w3.org/2000/01/rdf-schema#";
	protected static $XSD_NS = "http://www.w3.org/2001/XMLSchema#";

	protected static $CAT_NS;
	protected static $PROP_NS;
	protected static $INST_NS;

	// general namespace suffixes for different namespaces
	public static $CAT_NS_SUFFIX = "/category#";
	public static $PROP_NS_SUFFIX = "/property#";
	public static $INST_NS_SUFFIX = "/a#";

	// SPARQL-PREFIX statement with all namespaces
	protected static $ALL_PREFIXES;

	public static $fullSemanticData;
	/**
	 * Creates and initializes Triple store connector.
	 *
	 * @param SMWStore $smwstore All calls are delegated to this implementation.
	 */
	function __construct() {
		global $smwgDefaultStore, $smwgBaseStore;
		$this->smwstore = new $smwgBaseStore;
		global $smwgNamespace;
		self::$CAT_NS = $smwgNamespace.self::$CAT_NS_SUFFIX;
		self::$PROP_NS = $smwgNamespace.self::$PROP_NS_SUFFIX;
		self::$INST_NS = $smwgNamespace.self::$INST_NS_SUFFIX;
		self::$ALL_PREFIXES = 'PREFIX xsd:<'.self::$XSD_NS.'> PREFIX owl:<'.self::$OWL_NS.'> PREFIX rdfs:<'.
		self::$RDFS_NS.'> PREFIX rdf:<'.self::$RDF_NS.'> PREFIX cat:<'.self::$CAT_NS.'> PREFIX prop:<'.
		self::$PROP_NS.'> PREFIX a:<'.self::$INST_NS.'> ';
	}



	///// Reading methods /////
	// delegate to default implementation

	function getSemanticData($subject, $filter = false) {
		return $this->smwstore->getSemanticData($subject, $filter);
	}


	function getPropertyValues($subject, SMWPropertyValue $property, $requestoptions = NULL, $outputformat = '') {
		return $this->smwstore->getPropertyValues($subject, $property, $requestoptions, $outputformat);
	}

	function getPropertySubjects(SMWPropertyValue $property, $value, $requestoptions = NULL) {
		return $this->smwstore->getPropertySubjects($property, $value, $requestoptions);
	}

	function getAllPropertySubjects(SMWPropertyValue $property, $requestoptions = NULL) {
		return $this->smwstore->getAllPropertySubjects($property, $requestoptions);
	}

	function getProperties($subject, $requestoptions = NULL) {
		return $this->smwstore->getProperties($subject, $requestoptions);
	}

	function getInProperties(SMWDataValue $object, $requestoptions = NULL) {
		return $this->smwstore->getInProperties($object, $requestoptions);
	}
	
	function getSMWPropertyID(SMWPropertyValue $property) {
		return $this->smwstore->getSMWPropertyID($property);
	}

	///// Writing methods /////

	function deleteSubject(Title $subject) {
		$this->smwstore->deleteSubject($subject);
		$subj_ns = $this->getNSPrefix($subject->getNamespace());
		if ($subj_ns == NULL) return;

		// clear rules
		global $smwgEnableFlogicRules;
		if (isset($smwgEnableFlogicRules)) {
			$old_rules = SMWRuleStore::getInstance()->getRules($subject->getArticleId());
			SMWRuleStore::getInstance()->clearRules($subject->getArticleId());
		}
		global $smwgMessageBroker, $smwgNamespace;
		try {
			$con = new StompConnection("tcp://$smwgMessageBroker:61613");

			$con->connect();
			$con->send("/topic/WIKI.TS.UPDATE", self::$ALL_PREFIXES."DELETE FROM <$smwgNamespace> { $subj_ns:".$subject->getDBkey()." ?p ?o. }");
			if ($subject->getNamespace() == SMW_NS_PROPERTY) {
			 $con->send("/topic/WIKI.TS.UPDATE", self::$ALL_PREFIXES."DELETE FROM <$smwgNamespace> { ?s owl:onProperty ".$subj_ns.":".$subject->getDBkey().". }");
			}
			if (isset($smwgEnableFlogicRules)) {
				// delete old rules...
				foreach($old_rules as $ruleID) {
					$con->send("/topic/WIKI.TS.UPDATE", "DELETE RULE $ruleID FROM <$smwgNamespace>");
				}
			}
			$con->disconnect();
		} catch(Exception $e) {

		}
	}

	function updateData(SMWSemanticData $data) {
		$this->smwstore->updateData($data);
			
		$triples = array();



		$subject = $data->getSubject();// instanceof SMWPropertyValue ? $data->getSubject()->getWikiPageValue() : $data->getSubject();
		$subj_ns = $this->getNSPrefix($subject->getNamespace());
		if ($subj_ns == NULL) return;
			

		//properties
		foreach($data->getProperties() as $key => $property) {
			$propertyValueArray = $data->getPropertyValues($property);
			$triplesFromHook = array();
			wfRunHooks('TripleStorePropertyUpdate', array(& $data, & $property, & $propertyValueArray, & $triplesFromHook));
			if ($triplesFromHook === false || count($triplesFromHook) > 0) {
				$triples = is_array($triplesFromHook) ? array_merge($triples, $triplesFromHook) : $triples;
				continue; // do not process normal triple generation, if hook provides triples.
			}

			// handle properties with special semantics
			if ($property->getPropertyID() == "_TYPE") {
				// ingore. handeled by SMW_TS_Contributor
				continue;
			} elseif ($property->getPropertyID() == "_INST") {
				// ingore. handeled by category section below
				continue;
			} elseif ($property->getPropertyID() == "_SUBC") {
				// ingore. handeled by category section below
				continue;
			} elseif ($property->getPropertyID() == "_REDI") {
                // ingore. handeled by redirect section below
                continue;
            } elseif ($property->getPropertyID() == "_SUBP") {
				if ( $subject->getNamespace() == SMW_NS_PROPERTY ) {
					foreach($propertyValueArray as $value) {
						$triples[] = array("prop:".$subject->getDBkey(), "rdfs:subPropertyOf", "prop:".$value->getDBkey());
					}

				}
				continue;
			}

			foreach($propertyValueArray as $value) {
				if ($value->isValid()) {
					if ($value->getTypeID() == '_txt') {
						$triples[] = array($subj_ns.":".$subject->getDBkey(), "prop:".$property->getWikiPageValue()->getDBkey(), "\"".$this->escapeQuotes($value->getXSDValue())."\"^^xsd:string");

					} elseif ($value->getTypeID() == '_wpg') {
						$obj_ns = $this->getNSPrefix($value->getNamespace());
						if ($obj_ns == NULL) continue;
						$triples[] = array($subj_ns.":".$subject->getDBkey(), "prop:".$property->getWikiPageValue()->getDBkey(), $obj_ns.":".$value->getDBkey());

					} elseif ($value->getTypeID() == '__nry') {
						continue; // do not add nary properties
					} else {
							
						if ($value->getUnit() != '') {
							$triples[] = array($subj_ns.":".$subject->getDBkey(), "prop:".$property->getWikiPageValue()->getDBkey(), "\"".$value->getXSDValue()." ".$value->getUnit()."\"^^xsd:unit");
						} else {
							if ($value->getXSDValue() != NULL) {
								$xsdType = WikiTypeToXSD::getXSDType($property->getTypeID());
                              	$triples[] = array($subj_ns.":".$subject->getDBkey(), "prop:".$property->getWikiPageValue()->getDBkey(), "\"".$this->escapeQuotes($value->getXSDValue())."\"^^$xsdType");
							} else if ($value->getNumericValue() != NULL) {
								$triples[] = array($subj_ns.":".$subject->getDBkey(), "prop:".$property->getWikiPageValue()->getDBkey(), "\"".$value->getNumericValue()."\"^^xsd:float");
							}
						}
							
					}
				}
			}



		}

		// categories
		$categories = self::$fullSemanticData->getCategories();
		if ($subject->getNamespace() == NS_CATEGORY) {
			foreach($categories as $c) {
				if ($c == NULL) continue;
				$triplesFromHook = array();
				wfRunHooks('TripleStoreCategoryUpdate', array(& $subject, & $c, & $triplesFromHook));
				if ($triplesFromHook === false || count($triplesFromHook) > 0) {
					$triples = is_array($triplesFromHook) ? array_merge($triples, $triplesFromHook) : $triples;
					continue;
				}
				$triples[] = array("cat:".$subject->getDBkey(), "rdfs:subClassOf", "cat:".$c->getDBkey());
			}
		} else {

			foreach($categories as $c) {
				if ($c == NULL) continue;
				$triplesFromHook = array();
				wfRunHooks('TripleStoreCategoryUpdate', array(& $subject, & $c, & $triplesFromHook));
				if ($triplesFromHook === false || count($triplesFromHook) > 0) {
					$triples = is_array($triplesFromHook) ? array_merge($triples, $triplesFromHook) : $triples;
					continue;
				}
				$triples[] = array($subj_ns.":".$subject->getDBkey(), "rdf:type", "cat:".$c->getDBkey());
			}
		}

		// rules
		global $smwgEnableFlogicRules;
		if (isset($smwgEnableFlogicRules)) {
			$new_rules = self::$fullSemanticData->getRules();
			$old_rules = SMWRuleStore::getInstance()->getRules($subject->getArticleId());
			SMWRuleStore::getInstance()->clearRules($subject->getArticleId());
			SMWRuleStore::getInstance()->addRules($subject->getArticleId(), $new_rules);
		}

		// redirects
		$redirects = self::$fullSemanticData->getRedirects();
			
		foreach($redirects as $r) {
			switch($subj_ns) {
				case SMW_NS_PROPERTY: $prop = "owl:equivalentProperty";
				case NS_CATEGORY: $prop = "owl:equivalentClass";
				case NS_MAIN: $prop = "owl:sameAs";
				default: continue;
			}
			$r_ns = $this->getNSPrefix($r->getNamespace());
			$triples[] = array($subj_ns.":".$subject->getDBkey(), $prop, $r_ns.":".$r->getDBkey());
		}
			
		// connect to MessageBroker and send commands
		global $smwgMessageBroker, $smwgNamespace;
		try {
			$con = new StompConnection("tcp://$smwgMessageBroker:61613");

			$con->connect();
			$con->send("/topic/WIKI.TS.UPDATE", self::$ALL_PREFIXES."DELETE FROM <$smwgNamespace> { $subj_ns:".$subject->getDBkey()." ?p ?o. }");
			if ($subject->getNamespace() == SMW_NS_PROPERTY) {
				// delete all property constraints too
				$con->send("/topic/WIKI.TS.UPDATE", self::$ALL_PREFIXES."DELETE FROM <$smwgNamespace> { ?s owl:onProperty ".$subj_ns.":".$subject->getDBkey().". }");
			}
			$con->send("/topic/WIKI.TS.UPDATE", self::$ALL_PREFIXES."INSERT INTO <$smwgNamespace> { ".$this->implodeTriples($triples)." }");

			if (isset($smwgEnableFlogicRules)) {
				// delete old rules...
				foreach($old_rules as $ruleID) {
					$con->send("/topic/WIKI.TS.UPDATE", "DELETE RULE $ruleID FROM <$smwgNamespace>");
				}
				// ...and add new
				foreach($new_rules as $ruleID => $ruleText) {
					$con->send("/topic/WIKI.TS.UPDATE", "INSERT RULE $ruleID INTO <$smwgNamespace> : \"".$this->escapeQuotes($ruleText)."\"");
				}
			}
			$con->disconnect();
		} catch(Exception $e) {
			// print something??
		}
	}


	function changeTitle(Title $oldtitle, Title $newtitle, $pageid, $redirid=0) {
		$this->smwstore->changeTitle($oldtitle, $newtitle, $pageid, $redirid);

		$old_ns = $this->getNSPrefix($oldtitle->getNamespace());
		if ($old_ns == NULL) return;

		$new_ns = $this->getNSPrefix($newtitle->getNamespace());
		if ($new_ns == NULL) return;

		// update local rule store
		global $smwgEnableFlogicRules;
		if (isset($smwgEnableFlogicRules)) {
			SMWRuleStore::getInstance()->updateRules($redirid, $pageid);
		}

		// update triple store
		global $smwgMessageBroker, $smwgNamespace;
		try {
			$con = new StompConnection("tcp://$smwgMessageBroker:61613");

			$con->connect();
			$con->send("/topic/WIKI.TS.UPDATE", self::$ALL_PREFIXES."MODIFY <$smwgNamespace> DELETE { $old_ns:".$oldtitle->getDBkey()." ?p ?o. } INSERT { $new_ns:".$newtitle->getDBkey()." ?p ?o. }");
			$con->send("/topic/WIKI.TS.UPDATE", self::$ALL_PREFIXES."MODIFY <$smwgNamespace> DELETE { ?s $old_ns:".$oldtitle->getDBkey()." ?o. } INSERT { ?s $new_ns:".$newtitle->getDBkey()." ?o. }");
			$con->send("/topic/WIKI.TS.UPDATE", self::$ALL_PREFIXES."MODIFY <$smwgNamespace> DELETE { ?s ?p $old_ns:".$oldtitle->getDBkey().". } INSERT { ?s ?p $new_ns:".$newtitle->getDBkey().". }");
			$con->disconnect();
		} catch(Exception $e) {

		}
	}

	///// Query answering /////

	function getQueryResult(SMWQuery $query) {
		global $wgServer, $wgScript, $smwgWebserviceUser, $smwgWebServicePassword;

		// handle only SPARQL queries and delegate all others
		if ($query instanceof SMWSPARQLQuery) {

			ini_set("soap.wsdl_cache_enabled", "0");  //set for debugging
			$client = new SoapClient("$wgServer$wgScript?action=ajax&rs=smwf_ws_getWSDL&rsargs[]=get_sparql", array('login'=>$smwgWebserviceUser, 'password'=>$smwgWebServicePassword));

			try {
				global $smwgNamespace;
				if (stripos(trim($query->getQueryString()), 'SELECT') === 0 || stripos(trim($query->getQueryString()), 'PREFIX') === 0) {
					// SPARQL, attach common prefixes
					$response = $client->query(self::$ALL_PREFIXES.$query->getQueryString(), $smwgNamespace, $this->serializeParams($query));
				} else {
					// do not attach anything
					$response = $client->query($query->getQueryString(), $smwgNamespace, $this->serializeParams($query));
				}

				$queryResult = $this->parseSPARQLXMLResult($query, $response);


			} catch(Exception $e) {
				return new SMWQueryResult(array(), $query, false);
			}
			return $queryResult;

		} else {
			return $this->smwstore->getQueryResult($query);
		}
	}

	///// Special page functions /////
	// delegate to default implementation
	function getPropertiesSpecial($requestoptions = NULL) {
		return $this->smwstore->getPropertiesSpecial($requestoptions);
	}

	function getUnusedPropertiesSpecial($requestoptions = NULL) {
		return $this->smwstore->getUnusedPropertiesSpecial($requestoptions);
	}

	function getWantedPropertiesSpecial($requestoptions = NULL) {
		return $this->smwstore->getWantedPropertiesSpecial($requestoptions);
	}

	function getStatistics() {
		return $this->smwstore->getStatistics();
	}

	///// Setup store /////

	function setup($verbose = true) {
		$this->smwstore->setup($verbose);

		$this->createTables($verbose);

		global $smwgMessageBroker, $smwgNamespace, $wgDBtype, $wgDBserver, $wgDBname, $wgDBuser, $wgDBpassword, $wgDBprefix, $wgLanguageCode, $smwgBaseStore;
		try {
			$con = new StompConnection("tcp://$smwgMessageBroker:61613");

			$con->connect();
			$con->send("/topic/WIKI.TS.UPDATE", "DROP <$smwgNamespace>"); // drop may fail. don't worry
			$con->send("/topic/WIKI.TS.UPDATE", "CREATE <$smwgNamespace>");
			$con->send("/topic/WIKI.TS.UPDATE", "LOAD $wgDBtype://".urlencode($wgDBuser).":".urlencode($wgDBpassword)."@$wgDBserver/$wgDBname?lang=$wgLanguageCode&smwstore=$smwgBaseStore#".urlencode($wgDBprefix)." INTO <$smwgNamespace>");
			$con->disconnect();
		} catch(Exception $e) {

		}
	}

	function drop($verbose = true) {
		$this->smwstore->drop($verbose);

		global $smwgMessageBroker, $smwgNamespace;
		try {
			$con = new StompConnection("tcp://$smwgMessageBroker:61613");

			$con->connect();
			$con->send("/topic/WIKI.TS.UPDATE", "DROP <$smwgNamespace>");
			$con->disconnect();
		} catch(Exception $e) {

		}
	}
	
	function refreshData(&$index, $count, $namespaces = false, $usejobs = true) {
		$this->smwstore->refreshData($index, $count, $namespaces, $usejobs);
	}


	// Helper methods

	/**
	 * Creates tables in Wiki SQL Database
	 *
	 * @param boolean $verbose
	 */
	private function createTables($verbose) {
		require("SMW_DBHelper.php");
		$db =& wfGetDB( DB_MASTER );

		$ruleTableName = $db->tableName('smw_rules');
		// create rule table
		SMWDBHelper::setupTable($ruleTableName,
		array('subject_id'    => 'INT(8) UNSIGNED NOT NULL',
                            'rule_id'       => 'VARCHAR(255) binary NOT NULL',
                            'rule_text'      => 'TEXT NOT NULL'), $db, $verbose);
	}

	/**
	 * Drops SQL tables.
	 *
	 * @param boolean $verbose
	 */
	private function dropTables($verbose) {
		$db =& wfGetDB( DB_MASTER );

		$ruleTableName = $db->tableName('smw_rules');

		$db->query("DROP TABLE $ruleTableName", 'SMWTripleStore::dropTables');
		SMWDBHelper::reportProgress(" ... dropped table $ruleTableName.\n", $verbose);

	}



	/**
	 * Implodes triples separated by a dot for SPARUL commands.
	 *
	 * @param array of $triples
	 * @return string
	 */
	private function implodeTriples($triples) {
		$result = "";
		foreach($triples as $t) {
			$result .= implode(" ", $t);
			$result .= ". ";
		}
		return $result;
	}

	/**
	 * Returns namespace prefix for SPARUL commands.
	 *
	 * @param int $namespace
	 * @return string
	 */
	private function getNSPrefix($namespace) {
		if ($namespace == SMW_NS_PROPERTY) return "prop";
		elseif ($namespace == NS_CATEGORY) return "cat";
		elseif ($namespace == NS_MAIN) return "a";
		else return NULL;
	}

	/**
	 * Escapes double quotes
	 *
	 * @param string $literal
	 * @return string
	 */
	private function escapeQuotes($literal) {
		return str_replace("\"", "\\\"", $literal);
	}

	/**
	 * Unquotes a string
	 *
	 * @param String $literal
	 * @return String
	 */
	private function unquote($literal) {
		$trimed_lit = trim($literal);
		if (stripos($trimed_lit, "\"") === 0 && strrpos($trimed_lit, "\"") === strlen($trimed_lit)-1) {
			$substr = substr($trimed_lit, 1, strlen($trimed_lit)-2);
			return str_replace("\\\"", "\"", $substr);
		}
		return $trimed_lit;
	}

	/**
	 * Parses a SPARQL XML-Result and returns an SMWQueryResult.
	 *
	 * @param SMWQuery $query
	 * @param xml string $sparqlXMLResult
	 * @return SMWQueryResult
	 */
	private function parseSPARQLXMLResult(& $query, & $sparqlXMLResult) {

		// parse xml results
		$dom = simplexml_load_string($sparqlXMLResult);

		$variables = $dom->xpath('//variable');
		$results = $dom->xpath('//result');

		// if no results return empty result object
		if (count($results) == 0) return new SMWQueryResult(array(), $query);

		$variableSet = array();
		foreach($variables as $var) {
			$variableSet[] = (string) $var->attributes()->name;
		}

		// PrinterRequests to use
		$prs = array();

		// Use PrintRequests to determine which variable denotes what type of entity. If no PrintRequest is given use first result row
		// (which exist!) to determine which variable denotes what type of entity.


		// maps print requests (variable name) to result columns ( var_name => index )
		$mapPRTOColumns = array();

		// use user-given PrintRequests if possible
		$print_requests = $query->getDescription()->getPrintRequests();

		$index = 0;
		if ($query->fromASK) {

			// SPARQL query which was transformed from ASK
			// x variable is handeled specially as main variable
			foreach($print_requests as $pr) {

				$title = $pr->getTitle();
				if ($title == NULL) { // main column

					if (in_array('x', $variableSet)) { // x is missing for INSTANCE queries
						$mapPRTOColumns['X'] = $index;
						$prs[] = $pr;
						$index++;
					}

				} else  {
					// make sure that variables get truncated for SPARQL compatibility when used with ASK.
					preg_match("/[A-Z][\\w_]*/", $title->getDBkey(), $matches);
					$mapPRTOColumns[$matches[0]] = $index;
					$prs[] = $pr;
					$index++;
				}

			}
		} else {

			// native SPARQL query
			foreach($print_requests as $pr) {

				$title = $pr->getTitle();
				if ($title != NULL) {
					$mapPRTOColumns[$title->getDBkey()] = $index;
					$prs[] = $pr;
					$index++;
				}

			}
		}


		// generate PrintRequests for all other variables
		$var_index = 0;
		$bindings = $results[0]->children()->binding;
		foreach ($bindings as $b) {
			$var_name = ucfirst((string) $variables[$var_index]->attributes()->name);
			$var_index++;
			// do not generate new PrintRequest if already given
			if ($this->containsPrintRequest($var_name, $print_requests, $query->fromASK)) continue;
			if (stripos($b, self::$CAT_NS) === 0) {
				$prs[] = new SMWPrintRequest(SMWPrintRequest::PRINT_THIS, $var_name, Title::newFromText($var_name, NS_CATEGORY));
			} else if (stripos($b, self::$PROP_NS) === 0) {
				$prs[] = new SMWPrintRequest(SMWPrintRequest::PRINT_THIS, $var_name, Title::newFromText($var_name, SMW_NS_PROPERTY));
			} else if (stripos($b, self::$INST_NS) === 0) {
				$prs[] = new SMWPrintRequest(SMWPrintRequest::PRINT_THIS, $var_name, Title::newFromText($var_name, NS_MAIN));
			} else {
				$prs[] = new SMWPrintRequest(SMWPrintRequest::PRINT_THIS, $var_name, Title::newFromText($var_name, SMW_NS_PROPERTY));
			}
			$mapPRTOColumns[$var_name] = $index;
			$index++;
		}

		// Query result object
		$queryResult = new SMWQueryResult($prs, $query, (count($results) > $query->getLimit()));

		// create and add result rows
		// iterate result rows and add an SMWResultArray object for each field
		foreach ($results as $r) {
			$row = array();
			$index = 0;
			$children = $r->children(); // $chilren->binding denote all binding nodes
			foreach ($children->binding as $b) {
					
				$var_name = ucfirst((string) $children[$index]->attributes()->name);

				// category result
				if (stripos($b, self::$CAT_NS) === 0) {
					$title = Title::newFromText(substr($b, strlen(self::$CAT_NS)), NS_CATEGORY);
					$v = SMWDataValueFactory::newTypeIDValue('_wpg');
					$v->setValues($title->getDBkey(), NS_CATEGORY, $title->getArticleID());
					$row[$mapPRTOColumns[$var_name]] = new SMWResultArray(array($v), $prs[$index]);

					// property result
				} else if (stripos($b, self::$PROP_NS) === 0) {
					$title = Title::newFromText(substr($b, strlen(self::$PROP_NS)), SMW_NS_PROPERTY);
					$v = SMWDataValueFactory::newTypeIDValue('_wpg');
					$v->setValues($title->getDBkey(), SMW_NS_PROPERTY, $title->getArticleID());
					$row[$mapPRTOColumns[$var_name]] = new SMWResultArray(array($v), $prs[$index]);

					// instance result
				} else if (stripos($b, self::$INST_NS) === 0) {
					$title = Title::newFromText(substr($b, strlen(self::$INST_NS)), NS_MAIN);
					$v = SMWDataValueFactory::newTypeIDValue('_wpg');
					$v->setValues($title, NS_MAIN, $title->getArticleID());
					$row[$mapPRTOColumns[$var_name]] = new SMWResultArray(array($v), $prs[$index]);


					// property value result
				} else {
					$literal = $this->unquote($b);
					$typeID = is_numeric($literal) ? "_num" : "_str"; //TODO: other types??
					$row[$mapPRTOColumns[$var_name]] = new SMWResultArray(array(SMWDataValueFactory::newTypeIDValue($typeID, $literal)), $prs[$index]);

				}
				$index++;

			}
			$queryResult->addRow($row);
		}
			
		return $queryResult;
	}

	/**
	 * Serializes parameters and extraprintouts of SMWQuery.
	 * These informations are needed to generate a correct SPARQL query.
	 *
	 * @param SMWQuery $query
	 * @return String
	 */
	private function serializeParams($query) {
		$result = "";
		$first = true;
		foreach ($query->getExtraPrintouts() as $printout) {
			if (!$first) $result .= "|";
			if ($printout->getTitle() == NULL) {
				$result .= "?=".$printout->getLabel();
			} else {
				$result .= "?".$printout->getTitle()->getDBkey()."=".$printout->getLabel();
			}
			$first = false;
		}
		if ($query->getLimit() != NULL) {
			if (!$first) $result .= "|";
			$result .= "limit=".$query->getLimit();
			$first = false;
		}
		if ($query->getOffset() != NULL) {
			if (!$first) $result .= "|";
			$result .= "offset=".$query->getOffset();
			$first = false;
		}
		if ($query->sort) {
			if (!$first) $result .= "|";
			$first = false;
			$sort = "sort=";
			$order = "order=";
			$firstsort = true;
			foreach($query->sortkeys as $sortkey => $orderkey) {
				if (!$firstsort) { $sort .= ","; $order .= ",";  }
				$sort .= $sortkey;
				$order .= $orderkey;
				$firstsort = false;
			}
			$result .= $sort."|".$order;
		}
		return $result;
	}

	/**
	 * Returns true, if the given variable $var_name is represented by a PrintRequest in $prqs
	 *
	 * @param String $var_name
	 * @param array $prqs
	 * @return boolean
	 */
	private function containsPrintRequest($var_name, array & $prqs, $fromASK) {

		foreach($prqs as $po) {
			if ($fromASK && $po->getTitle() == NULL && $var_name == 'X') {
				return true;
			}
			if ($po->getTitle() != NULL && $po->getTitle()->getDBkey() == $var_name) {
				return true;
			}

		}
		return false;
	}
}

/**
 * Provides access to local rule store.
 *
 */
class SMWRuleStore {
	private static $INSTANCE = NULL;

	public static function getInstance() {
		if (self::$INSTANCE == NULL) {
			self::$INSTANCE = new SMWRuleStore();
		}
		return self::$INSTANCE;
	}

	/**
	 * Returns rule from local rule store for a given page id.
	 *
	 * @param int $page_id
	 * @return array of rule_id
	 */
	public function getRules($page_id) {
		$db =& wfGetDB( DB_SLAVE );

		$ruleTableName = $db->tableName('smw_rules');
		$res = $db->select($ruleTableName, array('rule_id'), array('subject_id' => $page_id));
		$results = array();

		if($db->numRows( $res ) > 0) {
			while($row = $db->fetchObject($res)) {
				$results[] = $row->rule_id;
			}
		}
		$db->freeResult($res);
		return $results;
	}

	/**
	 * Adds new rules to the local rule store.
	 *
	 * @param int $article_id
	 * @param array $new_rules (ruleID => ruleText)
	 */
	public function addRules($article_id, $new_rules) {

		$db =& wfGetDB( DB_MASTER );
		$smw_rules = $db->tableName('smw_rules');
		foreach($new_rules as $rule_id => $ruleText) {
			$db->insert($smw_rules, array('subject_id' => $article_id, 'rule_id' => $rule_id, 'rule_text' => $ruleText));
		}
	}

	/**
	 * Removes rule from given article
	 *
	 * @param int $article_id
	 */
	public function clearRules($article_id) {

		$db =& wfGetDB( DB_MASTER );
		$smw_rules = $db->tableName('smw_rules');
		$db->delete($smw_rules, array('subject_id' => $article_id));
	}

	/**
	 * Updates article IDs. In case of a renaming operation.
	 *
	 * @param int $old_article_id
	 * @param int $new_article_id
	 */
	public function updateRules($old_article_id, $new_article_id) {
		$db =& wfGetDB( DB_MASTER );
		$smw_rules = $db->tableName('smw_rules');
		$db->update($smw_rules, array('subject_id' => $new_article_id), array('subject_id' => $old_article_id));
	}
}


?>
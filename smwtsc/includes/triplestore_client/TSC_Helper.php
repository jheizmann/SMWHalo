<?php
/*
 * Copyright (C) Vulcan Inc.
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along
 * with this program.If not, see <http://www.gnu.org/licenses/>.
 *
 */

/**
 * @file
 * @ingroup SMWHaloTriplestore
 *
 * @author kai
 *
 */
class WikiTypeToXSD {


	public static function getXSDTypeFromTypeID($wikiTypeID) {
		switch($wikiTypeID) {

			// direct supported types
			case SMWDataItem::TYPE_BLOB:
			case SMWDataItem::TYPE_STRING : return 'xsd:string';

			case SMWDataItem::TYPE_NUMBER : return 'xsd:double';
			case SMWDataItem::TYPE_BOOLEAN : return 'xsd:boolean';
			case SMWDataItem::TYPE_TIME : return 'xsd:dateTime';

			// not supported by TS. Take xsd:string
			case SMWDataItem::TYPE_GEO : return 'xsd:string';

			case SMWDataItem::TYPE_URI : return 'xsd:anyURI';

			case SMWDataItem::TYPE_PROPERTY:
			case SMWDataItem::TYPE_WIKIPAGE : return 'tsctype:page' ;

			case SMWDataItem::TYPE_CONTAINER : return 'tsctype:record';

			// unknown or composite type
			default:
				return 'xsd:string';
		}

	}
	/**
	 * Map primitve types or units to XSD values
	 *
	 * @param unknown_type $wikiTypeID
	 * @return unknown
	 */
	public static function getXSDType($wikiTypeID) {
		switch($wikiTypeID) {

			// direct supported types
			case '_str' : return 'xsd:string';
			case '_txt' : return 'xsd:string';
			case '_num' : return 'xsd:double';
			case '_boo' : return 'xsd:boolean';
			case '_dat' : return 'xsd:dateTime';

			// not supported by TS. Take xsd:string
			case '_geo' :
			case '_cod' : return 'xsd:string';

			case '_tel' :
			case '_ema' :
			case '_uri' :
			case '_anu' : return 'xsd:anyURI';

			// single unit type in SMW
			case '_qty' :
			case '_tem' : return 'tsctype:unit';

			//only relevant for schema import
			case '_wpc' :
			case '_wpf' :
			case '_wpp' :
			case '_wpg' : return 'tsctype:page' ;

			case '_rec' : return 'tsctype:record';

			// unknown or composite type
			default:
				if (is_null($wikiTypeID)) return "xsd:string";
				// if builtin (starts with _) then regard it as string
				if (substr($wikiTypeID, 0, 1) == '_') return "xsd:string";
				// if n-ary, regard it as string
				if (preg_match('/\w+(;\w+)+/', $wikiTypeID) > 0) return "xsd:string";
				// otherwise assume a unit
				return 'tsctype:unit';
		}

	}

	/**
	 * Map primitve types or units to XSD values
	 *
	 * @param unknown_type $wikiTypeID
	 * @return unknown
	 */
	public static function getDIType($wikiTypeID) {
		switch($wikiTypeID) {

			// direct supported types
			case '_str' : return SMWDataItem::TYPE_STRING;
			case '_txt' : return SMWDataItem::TYPE_STRING;
			case '_num' : return SMWDataItem::TYPE_NUMBER;
			case '_boo' : return SMWDataItem::TYPE_BOOLEAN;
			case '_dat' : return SMWDataItem::TYPE_TIME;

			// not supported by TS. Take xsd:string
			case '_geo' : return SMWDataItem::TYPE_GEO;

			case '_uri' : return SMWDataItem::TYPE_URI;
			case '_wpg' : return SMWDataItem::TYPE_WIKIPAGE;

			case '_rec' : return SMWDataItem::TYPE_CONTAINER;

			// unknown or composite type
			default:
				return SMWDataItem::TYPE_STRING;
		}

	}


	public static function isPageType($wikiType) {
		switch($wikiType) {
			//only relevant for schema import

			case '__spf':
			case '_wpc' :
			case '_wpf' :
			case '_wpp' :
			case '_wpg' : return true;
		}
		return false;
	}

	/**
	 * Translates XSD-URIs to wiki datatype IDs.
	 * @param $xsdURI
	 * @return unknown_type
	 */
	public static function getWikiType($xsdURI) {
		$hashIndex = strpos($xsdURI, '#');
		if ($hashIndex !== false) {
			$xsdURI = substr($xsdURI, $hashIndex+1);
		}
		switch($xsdURI) {
			case 'string': return "_str";
			case 'float': return "_num";
			case 'double': return "_num";
			case 'boolean': return "_boo";
			case 'dateTime': return "_dat";
			case 'anyURI': return "_uri";
			default: return "_str";

		}
	}


}

class TSHelper {

	public static function serializeDataItem(SMWDataItem $di) {
		switch($di->getDIType()) {
			case SMWDataItem::TYPE_GEO:
				$text = implode(",",$di->getCoordinateSet());
				break;
			case SMWDataItem::TYPE_NUMBER:
				$text = $di->getNumber();
				break;
			case SMWDataItem::TYPE_BLOB:
			case SMWDataItem::TYPE_STRING:
				$text = $di->getString();
				break;
			case SMWDataItem::TYPE_TIME:
				$year = $di->getYear();
				$month = $di->getMonth();
				$day = $di->getDay();
				$hour = $di->getHour();
				$minute = $di->getMinute();
				$second = $di->getSecond();
				$month = $month < 10 ? "0$month" : $month;
				$day = $day < 10 ? "0$day" : $day;
				$hour = $hour < 10 ? "0$hour" : $hour;
				$minute = $minute < 10 ? "0$minute" : $minute;
				$second = $second < 10 ? "0$second" : $second;

				return "$year-$month-$day"."T"."$hour:$minute:$second";
				break;
			case SMWDataItem::TYPE_URI:
				$text = $di->getURI();
				break;

			case SMWDataItem::TYPE_BOOLEAN:
				$text = $di->getBoolean() ? "true" : "false";
				break;
			case SMWDataItem::TYPE_CONTAINER:
				$record = array();
				$sd = $di->getSemanticData();
				$properties = $sd->getProperties();
				foreach($properties as $p) {
					$values = $sd->getPropertyValues($p);
					foreach($values as $v) {
						$record[] = self::serializeDataItem($v);
					}
				}
				$text = implode(";",$record);
				break;

			default:
				// use default serialization if DataItem type is unknown
				$text = $di->getSerialization();
				break;
		}
		return $text;
	}
	/**
	 * Checks via heuristic if the given parameters contain a SPARQL query.
	 *
	 * @param mixed array of string or string $parserFunctionParameters
	 *
	 * @return boolean
	 */
	public static function isSPARQL($parserFunctionParameters) {
		if (is_array($parserFunctionParameters)) {
			$isSparql = false;
			foreach($parserFunctionParameters as $key => $p) {
				$p = trim($p);
				$isSparql |= (stripos($p, "SELECT ") === 0 || stripos($p, "PREFIX ") === 0);
				$isSparql |= (stripos($key, "SELECT ") === 0 || stripos($key, "PREFIX ") === 0);
				if ($isSparql) break;
			}
			return $isSparql;
		} else {
			$p = trim($parserFunctionParameters);
			return (stripos($p, "SELECT ")  === 0 || stripos($p, "PREFIX ") === 0);
		}
	}

	/**
	 * Converts a URI into a Title object.
	 *
	 * If $forceTitle is true, a title object is always returned, even
	 * in cases where the URI could not be converted because it matches no wiki URI
	 * or a localname could not be found.
	 *
	 * If $forceTitle is false, the URI is returned unchanged in these cases.
	 *
	 * @param string $sv URI
	 * @param boolean $forceTitle
	 *
	 * @return mixed Title or string
	 */
	public static function getTitleFromURI($sv, $forceTitle = true) {

		if (is_null($sv)) {
			// URI is null
			if ($forceTitle) {
				return Title::newFromText("empty URI", NS_MAIN);
			}
			return NULL;
		}

		// check if it is a wiki URI
		foreach (TSNamespaces::$ALL_NAMESPACES as $nsIndsex => $ns) {
			if (stripos($sv, $ns) === 0) {
				$local = substr($sv, strlen($ns));
				return Title::makeTitle($nsIndsex, $local);

			}
		}

		// check if it is an unknown namespace (superfluous now?)
		if (stripos($sv, TSNamespaces::$UNKNOWN_NS) === 0) {


			$startNS = strlen(TSNamespaces::$UNKNOWN_NS);
			$length = strrpos($sv, "/") - $startNS;
			$ns = intval(substr($sv, $startNS, $length));

			$local = substr($sv, strrpos($sv, "/")+1);

			return Title::makeTitle($ns, $local);

		} else {

			// any other URI
			if ($forceTitle) {
				$local = self::convertURIToLocalName($sv);
				return Title::newFromText($local, NS_MAIN);
			} else {
				// return URI unchanged.
				return $sv;
			}
		}


	}

	/**
	 * Converts a URI into a localname by guessing the localname.
	 *
	 * @param string $uri
	 * @return string
	 */
	public static function convertURIToLocalName($uri) {
			
		if (self::isFunctionalOBLTerm($uri)) {
			// function term on OBL
			$local = self::convertOBLFunctionalTerm($uri);
			$local = self::eliminateTitleCharacters($local);
			$local .= '_'.md5($uri); // make sure the title is unique
		} else {
			$local = self::guessLocalName($uri);
			if (is_null($local)) {
				// make sure to return a valid Title
				$local = "not interpretable URI";
			}
		}
		return $local;
	}




	public static function isLocalURI($uri) {
		foreach (TSNamespaces::$ALL_NAMESPACES as $nsIndsex => $ns) {
			if (stripos($uri, $ns) === 0) {
				$local = substr($uri, strlen($ns));
				return true;

			}
		}
		if (stripos($uri, TSNamespaces::$UNKNOWN_NS) === 0) return true;

		return false;
	}

	public static function isFunctionalOBLTerm($uri) {
		return strpos($uri, "obl:") === 0;
	}

	/**
	 * Returns a local URL and Title object if the given URI matches the wiki graph.
	 * Otherwise the URI is returned unchanged an its localname is used to create a Title object.
	 *
	 * @param string $uri
	 * @return tuple($url, Title)
	 */
	public static function makeLocalURL($uri) {
		global $smwgHaloTripleStoreGraph;

		$title = self::getTitleFromURI($uri);
		if (stripos($uri, $smwgHaloTripleStoreGraph) === 0) {
			$uri = $title->getFullURL();
		}

		return array($uri, $title);
	}



	/**
	 * Returns a local URI for the wiki graph of a given Title object.
	 *
	 * @param Title $title
	 * @return string $uri
	 */
	public static function getUriFromTitle($title) {
		global $smwgHaloTripleStoreGraph;
		$res= $smwgHaloTripleStoreGraph;
		if (strpos($res, -1) != '/')
		$res .= '/';
		$res .= TSNamespaces::getInstance()->getNSPrefix($title->getNamespace())
		.'/'
		.str_replace(' ', '_', $title->getText());
		return $res;
	}
    
	/**
	 * Returns the ID if the property is internal, otherwise false.
	 * 
	 * @param string $uri
	 * 
	 * @return mixed
	 */
	public static function isInternalProperty($uri) {
		foreach (TSNamespaces::$ALL_NAMESPACES as $nsIndsex => $ns) {
			if (stripos($uri, $ns) === 0) {
				$local = substr($uri, strlen($ns));
				return (strpos($local, "_") === 0) ? $local : false;
			}
		}
		return false;
	}

	/**
	 * Escapes double quotes, backslash and line feeds for a SPARUL string literal.
	 *
	 * @param string $literal
	 * @return string
	 */
	public static function escapeForStringLiteral($literal) {
		return str_replace(array("\\", "\"", "\n", "\r"), array("\\\\", "\\\"", "\\n" ,"\\r"), $literal);
	}

	/**
	 * Set metadata values (if available)
	 *
	 *
	 * @param SMWDataValue $v
	 * @param array of SimpleXMLElement $metadata
	 */
	public static function setMetadata(SMWDataItem $v, $metadata) {
		if (!is_null($metadata) && $metadata !== '') {
			foreach($metadata as $m) {
				$name = (string) $m->attributes()->name;
				$datatype = (string) $m->attributes()->datatype;
				$mdValues = array();
				foreach($m->value as $mdValue) {
					$mdValues[] = (string) $mdValue;
				}
				$v->setMetadata($name, $datatype, $mdValues);
			}
		}
	}

	/**
	 * Converts an OBL function term by translating all contained URIs
	 * into their localnames by guessing them.
	 *
	 * @param string $uri
	 * @return string
	 */
	private static function convertOBLFunctionalTerm($uri) {

		$uri = urldecode($uri);
		$uri = substr($uri, 9);

		preg_match_all("/<([^>]+)>/", $uri, $matches);

		foreach($matches[1] as $match) {
			$t = self::convertURIToLocalName($match);
			if (!is_null($t)) {
				$uri = str_replace("<$match>", $t, $uri);
			}
		}

		return $uri;
	}

	/**
	 * Eliminates some forbidden characters which must not appear in a Title.
	 *
	 *  @param string $str
	 *  @return string
	 */
	private static function eliminateTitleCharacters($str) {

		$str = ucfirst(trim($str));
		$str = str_replace(" ", "_", $str);
		$str = str_replace("%", "_", $str);
		$str = str_replace("/", "_", $str);
		$str = str_replace("[", "_", $str);
		$str = str_replace("]", "_", $str);
		$str = str_replace("?", "_", $str);
		$str = str_replace("#", "_", $str);
		$str = str_replace("\\", "_", $str);
		$str = str_replace("'", "_", $str);
		$str = str_replace("^", "_", $str);
		$str = str_replace("<", "_", $str);
		$str = str_replace(">", "_", $str);
		$str = str_replace(";", "_", $str);
		$str = preg_replace('/__+/', "_", $str);
		return $str;

	}

	/**
	 * Parses a URI and uses several heuristics
	 *
	 * @param string $uri
	 * @return string localname which can be used to create a Title object
	 *
	 */
	private static function guessLocalName($uri) {
		global $wgContLang;
		$parsedURI = parse_url($uri);
		$knowNamespaces = array();
		foreach(TSNamespaces::$ALL_NAMESPACE_KEYS as $nsKey) $knowNamespaces[] = $wgContLang->getNSText($nsKey);
		if (array_key_exists('fragment', $parsedURI)) {
			$local =  $parsedURI['fragment'];
			$local = urldecode($local);
			$local = self::eliminateTitleCharacters($local);
			$parts = explode(":", $local);
			if (count($parts) == 1) return $local;
			if (in_array($parts[0], $knowNamespaces)) return implode("_", $parts);
			return $parts[1];
		}
		if (array_key_exists('path', $parsedURI)) {
			$local =  $parsedURI['path'];
			$lastSlash = strrpos($local, "/");
			$local = $lastSlash !== false ? substr($local, $lastSlash+1) : $local;
			$local = urldecode($local);
			$local = self::eliminateTitleCharacters($local);
			$parts = explode(":", $local);
			if (count($parts) == 1) return $local;
			if (in_array($parts[0], $knowNamespaces)) return implode("_", $parts);
			return $parts[1];
		}

		return NULL;
	}

}


class TSNamespaces {

	// W3C namespaces
	public static $RDF_NS = "http://www.w3.org/1999/02/22-rdf-syntax-ns#";
	public static $OWL_NS = "http://www.w3.org/2002/07/owl#";
	public static $RDFS_NS = "http://www.w3.org/2000/01/rdf-schema#";
	public static $XSD_NS = "http://www.w3.org/2001/XMLSchema#";
	public static $TSCTYPE_NS = "http://www.ontoprise.de/smwplus/tsc/unittype#";
	public static $HALOPROP_NS = "http://www.ontoprise.de/smwplus/tsc/haloprop#";
	public static $LOD_NS = "http://www.example.org/smw-lde/";

	// collections of namespaces
	public static $ALL_NAMESPACES;
	public static function getAllNamespaces() { return self::$ALL_NAMESPACES; }
	public static $ALL_PREFIXES;
	public static function getAllPrefixes() { return self::$ALL_PREFIXES; }
	public static $W3C_PREFIXES;
	public static function getW3CPrefixes() { return self::$W3C_PREFIXES; }
	public static $TSC_PREFIXES;
	public static function getTSCPrefixes() { return self::$TSC_PREFIXES; }


	// general namespace suffixes for different namespaces
	public static $UNKNOWN_NS;
	public static $UNKNOWN_NS_SUFFIX = "ns_"; // only fragment. / is missing!

	// MW + SMW + SF namespaces (including talk namespaces)
	public static $ALL_NAMESPACE_KEYS = array(NS_CATEGORY, SMW_NS_PROPERTY,SF_NS_FORM, SMW_NS_CONCEPT, NS_MAIN ,
	NS_FILE, NS_HELP, NS_TEMPLATE, NS_USER, NS_MEDIAWIKI, NS_PROJECT,	SMW_NS_PROPERTY_TALK,
	SF_NS_FORM_TALK,NS_TALK, NS_USER_TALK, NS_PROJECT_TALK, NS_FILE_TALK, NS_MEDIAWIKI_TALK,
	NS_TEMPLATE_TALK, NS_HELP_TALK, NS_CATEGORY_TALK, SMW_NS_CONCEPT_TALK);

	public static $EMPTY_SPARQL_XML = '<?xml version="1.0"?><sparql></sparql>';
	public static $DEFAULT_VALUE_URI = 'http://__defaultvalue__/doesnotexist';

	public static $initialized = false;
	private static $INSTANCE = NULL;


	public static function getInstance() {
		if (is_null(self::$INSTANCE)) {
			self::$INSTANCE = new TSNamespaces();
		}
		return self::$INSTANCE;
	}

	function __construct() {
		global $smwgHaloTripleStoreGraph, $wgContLang, $wgExtraNamespaces;

		// use initialize flag because PHP classes do not have static initializers.
		if (self::$initialized) return;

		self::$UNKNOWN_NS = $smwgHaloTripleStoreGraph.self::$UNKNOWN_NS_SUFFIX;

		// SET $ALL_PREFIXES constant
		// add W3C namespaces
		self::$ALL_PREFIXES = "PREFIX xsd:<".self::$XSD_NS."> \nPREFIX owl:<".self::$OWL_NS."> \nPREFIX rdfs:<".
		self::$RDFS_NS."> \nPREFIX rdf:<".self::$RDF_NS."> ";

		// add all namespaces (including talk namespaces)
		global $wgContLang;

		$extraNamespaces = array_diff(array_keys($wgExtraNamespaces), self::$ALL_NAMESPACE_KEYS);
		self::$ALL_NAMESPACE_KEYS = array_merge(self::$ALL_NAMESPACE_KEYS, $extraNamespaces);

		foreach(self::$ALL_NAMESPACE_KEYS as $nsKey) {
			$nsText = $wgContLang->getNSText($nsKey);
			if ($nsKey == NS_MAIN) {
				$prefix = "a";
				$nsText = "a";
			} else if ($nsKey == NS_PROJECT) {
				$prefix = "wiki";
			} else if ($nsKey == NS_PROJECT_TALK) {
				$prefix = "wiki_talk";
			} else {
				$prefix = str_replace(" ","_",strtolower($nsText));
			}
			if (empty($prefix)) continue;

			// check for validity of prefix
			preg_match('/\w([\w_0-9-]|\.[\w_0-9-])*/', $prefix, $matches);
			if (isset($matches[0]) && $matches[0] != $prefix) continue;

			$nsText = str_replace(" ","_",strtolower($nsText));
			$uri = $smwgHaloTripleStoreGraph."/$nsText/";
			self::$ALL_PREFIXES .= "\nPREFIX $prefix:<$uri> ";
			self::$ALL_NAMESPACES[$nsKey] = $uri;
		}

		// add special prefixes "cat" and "prop" for compatibility with < SMWHalo 1.5.2
		self::$ALL_PREFIXES .= "\nPREFIX cat:<".$smwgHaloTripleStoreGraph."/".str_replace(" ","_",strtolower($wgContLang->getNSText(NS_CATEGORY))).'/> '.
							   "\nPREFIX prop:<".$smwgHaloTripleStoreGraph."/".str_replace(" ","_",strtolower($wgContLang->getNSText(SMW_NS_PROPERTY))).'/> ';

		// add prefixes defined on Mediawiki:NamespaceMappings
		$allNSMappings = TSCMappingStore::getAllNamespaceMappings();
		foreach($allNSMappings as $prefix => $uri) {
			self::$ALL_PREFIXES .= "\nPREFIX $prefix:<$uri> ";
		}

		// add LOD prefixes
		self::$ALL_PREFIXES .= "\nPREFIX source:<".self::$LOD_NS."smwDatasources/> ";

		// SET $W3C_PREFIXES constant
		self::$W3C_PREFIXES = 'PREFIX xsd:<'.self::$XSD_NS.'> PREFIX owl:<'.self::$OWL_NS.'> PREFIX rdfs:<'.
		self::$RDFS_NS.'> PREFIX rdf:<'.self::$RDF_NS.'> ';

		// SET $TSC_PREFIXES constant
		self::$TSC_PREFIXES = "PREFIX tsctype:<".self::$TSCTYPE_NS."> ";
		self::$TSC_PREFIXES .= "PREFIX haloprop:<".self::$HALOPROP_NS."> ";


	}

	/**
	 * Returns the namespace prefix used by the triplestore.
	 *
	 * @param int $namespace
	 * @return string
	 */
	public function getNSPrefix($namespace) {
		global $wgContLang;
		if ($namespace == NS_MAIN) return "a";
		return str_replace(" ","_",strtolower($wgContLang->getNSText($namespace)));
	}

	/**
	 * Returns the NS URI (without local name)
	 *
	 * @param int $namespace index
	 */
	public function getNSURI($namespace) {
		global $smwgHaloTripleStoreGraph;
		return $smwgHaloTripleStoreGraph."/".$this->getNSPrefix($namespace)."/";
	}

	/**
	 * Returns the full IRI used by the TS for a namespace index and a localname.
	 *
	 * @param int $namespace
	 * @param string $localname
	 */
	public function getFullIRIByName($namespace, $localname) {
		global $smwgHaloTripleStoreGraph;
		$localname = str_replace(" ", "_", $localname);
		return "<".$smwgHaloTripleStoreGraph."/".$this->getNSPrefix($namespace)."/". self::encodeSpecials($localname).">";
	}

	/**
	 * Returns the full IRI used by the TS for $t
	 *
	 * @param Title $t
	 */
	public function getFullIRI(Title $t) {
		global $smwgHaloTripleStoreGraph;
		return "<".$smwgHaloTripleStoreGraph."/".$this->getNSPrefix($t->getNamespace())."/".self::encodeSpecials($t->getDBkey()).">";
	}

	/**
	 * Returns the full URI used by the TS for $t
	 *
	 * @param Title $t
	 */
	public function getFullURI(Title $t) {
		global $smwgHaloTripleStoreGraph;
		return $smwgHaloTripleStoreGraph."/".$this->getNSPrefix($t->getNamespace())."/".self::encodeSpecials($t->getDBkey());
	}

	/**
	 * Returns the full IRI used by the TS for $p
	 *
	 * @param SMWPropertyValue $t
	 */
	public function getFullIRIFromProperty(SMWPropertyValue $p) {
		global $smwgHaloTripleStoreGraph;
		return "<".$smwgHaloTripleStoreGraph."/".$this->getNSPrefix(SMW_NS_PROPERTY)."/".self::encodeSpecials($p->getDBkey()).">";
	}

	/**
	 * Returns the full IRI used by the TS for $p
	 *
	 * @param SMWPropertyValue $t
	 */
	public function getFullIRIFromDIProperty(SMWDIProperty $p) {
		global $smwgHaloTripleStoreGraph;
		return "<".$smwgHaloTripleStoreGraph."/".$this->getNSPrefix(SMW_NS_PROPERTY)."/".self::encodeSpecials($p->getKey()).">";
	}
	
	/**
     * Replaces % by the correct %-escape sequence.
     * 
     * @param $uri
     * @return
     */
	public static function encodeSpecials($localname) {
		return preg_replace('/%$|%.$|%([^2][^5])/', '%25$1', $localname);
	}


	/**
	 * Converts $input from into a prefixed or full URI, if necessary.
	 *
	 *  (1) may be already a full URI, then returned unchanged.
	 *  (2) may be a prefix form a#MyInstance, cat#MyInstance. Then returned as prefix form
	 *      unlesss it is not possible because of forbidden characters.
	 *  (3) may be a title form, e.g. Category:Person
	 *  (4) may be something else, consider as instance and return as
	 *      prefix form (if possible) or as full URI.
	 *
	 * @param string $input
	 * @param string (out) $resultType (prefixURI or fullURI)
	 * @return string URI
	 */
	public function toURI($input, & $resultType) {
		$input = str_replace(" ", "_", $input);
		$parsedURL = parse_url($input);
		if (array_key_exists('scheme', $parsedURL)) {
			// full URI or title form
			foreach(self::$ALL_NAMESPACE_KEYS as $nsKey) {
				$suffix = strtolower($this->getNSPrefix($nsKey));
				$prefix = strtolower($parsedURL['scheme']);
				$local = ucfirst(substr($input, strlen($prefix)+1));
				if ($suffix == $prefix) {
					if (preg_match('/^[\w\d_]+$/', $local, $matches)> 0) {
						$resultType = "prefixURI";
						return $prefix."#".$local;
					} else{
						$resultType = "fullURI";
						return $this->getNSURI($nsKey).$local;
					}
				}
			}

			return $input;
		} else if (array_key_exists('path', $parsedURL) && array_key_exists('fragment', $parsedURL)) {
			// prefix form URI
			$lastSlashIndex = strrpos($input, "#");
			if ( $lastSlashIndex === false) return $this->getNSURI(NS_MAIN).$parsedURL['fragment'];
			$prefix = substr($input, 0, $lastSlashIndex);
			$local = substr($input, $lastSlashIndex+1);

			$local = ucfirst($local);

			foreach(self::$ALL_NAMESPACE_KEYS as $nsKey) {
				$suffix = $this->getNSPrefix($nsKey);
				if ($suffix == $prefix) {
					if (preg_match('/^[\w\d_]+$/', $local, $matches)> 0) {
						$resultType = "prefixURI";
						return $prefix."#".$local;
					} else{
						$resultType = "fullURI";
						return $this->getNSURI($nsKey).$local;
					}
				}
			}

		} else {
			// any other value, consider as instance
			$input = ucfirst($input);
			if (preg_match('/^[\w\d_]+$/', $input) > 0) {
				$resultType = "prefixURI";
				return "a#".$input;
			} else{
				$resultType = "fullURI";
				return $this->getNSURI(NS_MAIN).$input;
			}

		}


	}


}


$smwhgTSNamespaces = TSNamespaces::getInstance();

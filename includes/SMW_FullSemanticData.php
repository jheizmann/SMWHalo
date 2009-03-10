<?php

/**
 * Extends SemanticData for semantic data needed for a triple store.
 *
 *  1. categories
 *  2. rules (optional)
 *  3. redirects
 *
 */
class SMWFullSemanticData {

    protected $categories;
    protected $rules = array();
    protected $redirects;
	
    public function __construct() {
        $this->categories = array();
        $this->rules = array();
        $this->redirects = array();
    }

    public function setCategories($categories) {
    	$this->categories = $categories;
    }

	// set rules (array)
    public function setRules($rules) {
    	foreach ($rules as $ruleid => $ruletext) {
    		// check if ruleId already exists - if so, do not add rule again to parsed array
	    	if (!array_key_exists($ruleid, $this->rules)) {
	    		$this->rules[$ruleid] = $ruletext;
	    	}
    	}
    }

    public function setRedirects($redirects) {
         $this->redirects = $redirects;
    }

    public function getCategories() {
    	return $this->categories;
    }

    public function getRules() {
         return $this->rules;
    }

    public function getRedirects() {
         return $this->redirects;
    }
    	
	/**
	 * Get derived properties.
	 * @param SMWSemanticData $semData
	 * 		Annotated facts of an article
	 * @return SMWSemanticData
	 * 		Derived facts of the article
	 */
 	public static function getDerivedProperties(SMWSemanticData $semData) {
 		
		global $smwgIP, $smwgHaloIP, $smwgTripleStoreGraph;
		require_once($smwgIP . '/includes/SMW_QueryProcessor.php');
        require_once($smwgHaloIP . '/includes/storage/SMW_TripleStore.php');

        $derivedProperties = new SMWSemanticData($semData->getSubject());
        
        $subject = $semData->getSubject()->getDBkey();
        
		$inst = $smwgTripleStoreGraph.SMWTripleStore::$INST_NS_SUFFIX;
//		$queryText = "PREFIX a:<$inst> SELECT ?pred ?obj WHERE { a:$subject ?pred ?obj . }";
//		$queryText = "SELECT ?pred ?obj WHERE { a:$subject ?pred ?obj . }";
		$queryText = "SELECT ?pred ?obj WHERE { <$smwgTripleStoreGraph/a#$subject> ?pred ?obj . }";
		
		// Ask for all properties of the subject (derived and ground facts)
		$q = SMWSPARQLQueryProcessor::createQuery($queryText, new ParserOptions());
		$res = smwfGetStore()->getQueryResult($q); // SMWQueryResult
		
		$propVal = array();
		while ( $row = $res->getNext() ) { //$row: SMWResultArray[]
			$i = 0;
			$valuesForProperty = array();
			$key = false;
			if (count($row) == 2) {
				$properties = array();
				$values = array();
				// There may be several properties with the same values
				$p = $row[0];
				while ( ($object = $p->getNextObject()) !== false ) {
					$properties[] = $object->getDBkey();
				}
				// Retrieve the values of the properties
				$v = $row[1];
				while ( ($object = $v->getNextObject()) !== false ) {
					$values[] = $object;
				}
			}
			
			foreach ($properties as $p) {
				if (array_key_exists($p, $propVal)) {
					// The same property may appear several times
					$propVal[$p] = array_merge($values, $propVal[$p]);
				} else {
					$propVal[$p] = $values;
				}
			}
		}
		
		// Check is a property is derived or directly annotated
        foreach ($propVal as $propName => $derivedValues) {
      	
        	// does the property already exist?
        	$prop = SMWPropertyValue::makeUserProperty($propName);
        	$values = $semData->getPropertyValues($prop);
        	foreach ($derivedValues as $dv) {
	        	$isDerived = true;
	        	$val = null;
	        	foreach ($values as $v) {
	        		if ($dv->getTypeID() == '_wpg' && $v->getTypeID() == '_wpg') {
	        			$vt1 = $dv->getTitle();
	        			$vt2 = $v->getTitle();
	        			if (isset($vt1) 
	        			    && isset($vt2)
	        			    && $vt1->getText() == $vt2->getText()) {
		        			$isDerived = false;
		        			break;
	        			}
	        		} else if ($dv->getTypeID() == '_wpg' && $v->getTypeID() != '_wpg') {
	        			// how can this happen?
	        			$isDerived = false;
	        			break;
	        		} else {
						if ($dv->isNumeric()) {
			        		if ($dv->getNumericValue() == $v->getNumericValue()) {
			        			$isDerived = false;
			        			break;
			        		}
			        	} else {
			        		if ($dv->getXSDValue() == $v->getXSDValue()) {
			        			$isDerived = false;
			        			break;
			        		}
			        	}
	        		}
	        	}
	        	if ($isDerived) {
					$property = SMWPropertyValue::makeUserProperty($propName);
	        		$derivedProperties->addPropertyObjectValue($property, $dv);
	        	}
        	}
        }        
        return $derivedProperties;
	}

}

?>
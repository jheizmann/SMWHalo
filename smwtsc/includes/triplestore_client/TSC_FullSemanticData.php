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
 * Extends SemanticData for semantic data needed for a triple store.
 *
 *  1. categories
 *  2. rules (optional)
 *  3. redirects
 *
 * @author Kai K�hn
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
			
		global $smwgIP, $tscgIP, $smwgHaloTripleStoreGraph;
		require_once($smwgIP . '/includes/SMW_QueryProcessor.php');
		require_once($tscgIP . '/includes/triplestore_client/TSC_TripleStore.php');

		$derivedProperties = new SMWSemanticData($semData->getSubject());

		$subject = $semData->getSubject()->getDBkey();

		global $wgContLang;
		$subject = $semData->getSubject();
		$localName = $subject->getDBkey();

		$tsn = TSNamespaces::getInstance();
		$subject_iri = "<".$smwgHaloTripleStoreGraph."/".$tsn->getNSPrefix($subject->getNamespace())."/".$localName.">";

		$queryText = "SELECT ?pred ?obj WHERE { $subject_iri ?pred ?obj . }";

		wfRunHooks('BeforeDerivedPropertyQuery', array(&$queryText) );
		// Ask for all properties of the subject (derived and ground facts)
		$params = SMWQueryProcessor::getProcessedParams(array(), array());
		$q = SMWSPARQLQueryProcessor::createQuery($queryText, $params);
		$q->setLimit(500, false); // restrict the maximum of inferred facts to 500
		$res = smwfGetStore()->getQueryResult($q); // SMWQueryResult
		wfRunHooks('AfterDerivedPropertyQuery', array() );
		wfRunHooks('FilterQueryResults', array(&$res, array('pred')) );

      
		$propVal = array();
		while ( $row = $res->getNext() ) { //$row: SMWResultArray[]
				
			$i = 0;
			$stopped = false;
			$valuesForProperty = array();
			$key = false;
			if (count($row) == 2) {
				$properties = array();
				$values = array();
				// There may be several properties with the same values
				$p = $row[0];
				while ( ($object = $p->getNextDataItem()) !== false ) {
					 
					if ($object instanceof SMWDIProperty) {
						 
						$properties[] = $object->getKey();
					} else if ($object instanceof SMWDIWikiPage) {
						$properties[] = $object->getTitle()->getDBKey();
					} else if ($object instanceof SMWDIUri) {
						//$properties[] = $object->getTitle()->getDBKey();
					}

				}

				//if ($stopped) continue;

				// Retrieve the values of the properties
				$v = $row[1];
				while ( ($object = $v->getNextDataItem()) !== false ) {
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
        
		$derivedCategories=array();
		// Check is a property is derived or directly annotated
		foreach ($propVal as $propName => $derivedValues) {
 
			// does the property already exist?
			if ($propName[0] == '_') {
				$prop = SMWDIProperty::newFromUserLabel($propName);
			} else {
				$prop = SMWDIProperty::newFromUserLabel(str_replace("_"," ",$propName));
			}
			$values = $semData->getPropertyValues($prop);
				
			// special handling for _INST
			if ($propName == '_INST') {
				$allCategories = $derivedValues;
				$assertCategories = $subject->getTitle()->getParentCategories();
				foreach($allCategories as $c) {
					if ($c instanceof SMWWikiPageValue) {
						$title = $c->getTitle();
						if (!in_array($title->getText(), $assertCategories)) {
							$derivedCategories[] = $title;
						}
					}
				}
					
				continue;
			}
				
			$derivedValuesResult=array();
			self::getDataValueDiff($derivedValues, $values, $derivedValuesResult, $assertedValuesResult);
				
			foreach($derivedValuesResult as $di) {
				$derivedProperties->addPropertyObjectValue($prop, $di);
			}
				
		}
		return array($derivedProperties, $derivedCategories);
	}

	/**
	 * Calculates the differenc of two SMWDataValue sets.
	 *
	 * @param array SMWDataValue $allValues All values.
	 * @param array SMWDataValue $assertedValues assertedValues.
	 * @param SMWPropertyValue $prop
	 * @param (out) array & $derivedValuesResult derived values
	 * @param (out) array & $ $assertedValuesResult asserted values.
	 *
	 *  All property value from $allValues which are not contained in $assertedValues.
	 *
	 *  $allValues does not necessarily be an array of SMWDataValue object but
	 *  can be an array of tuples which contain an SMWDataValue object at first
	 *  place.
	 *
	 * @return
	 */
	public static function getDataValueDiff($allValues, $assertedValues, & $derivedValuesResult, & $assertedValuesResult) {

		foreach ($allValues as $tuple) {
			if (is_array($tuple)) {
				$di = reset($tuple);
			} else {
				$di = $tuple;
			}
			$isDerived = true;
			$val = null;
			foreach ($assertedValues as $di2) {
				if ($di->getDIType() != $di2->getDIType()) continue;

				if ($di->getSortKey() == $di2->getSortKey()) {
					$isDerived = false;
					break;
				}

			}
			if ($isDerived) {
				$derivedValuesResult[] =  $tuple;
			} else {
				$assertedValuesResult[] = $tuple;
			}
		}

	}

}


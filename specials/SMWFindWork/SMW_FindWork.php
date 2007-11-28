<?php
/*
 * Created on 26.11.2007
 *
 * Author: kai
 */
 
 if (!defined('MEDIAWIKI')) die();

 define('SMW_FINDWORK_NUMBEROF_RATINGS', 5); // will be doubled (rated and unrated)
 
global $smwgIP;
include_once( "$smwgIP/specials/QueryPages/SMW_QueryPage.php" );

function smwfDoSpecialFindWorkPage() {
	wfProfileIn('smwfDoSpecialFindWorkPage (SMW Halo)');
	list( $limit, $offset ) = wfCheckLimits();
	$rep = new SMWFindWork();
	$result = $rep->doQuery( $offset, $limit );
	wfProfileOut('smwfDoSpecialFindWorkPage (SMW Halo)');
	return $result;
}
 class SMWFindWork extends SMWQueryPage {
	
	private $workFields;
	private $store;
	
	public function __construct() {
		global $smwgDefaultStore, $smwgHaloIP, $wgUser;
		switch ($smwgDefaultStore) {
			case (SMW_STORE_TESTING):
				$this->store = null; // not implemented yet
				trigger_error('Testing stores not implemented for HALO extension.');
			break;
			case (SMW_STORE_MWDB): default:
				require_once($smwgHaloIP . '/specials/SMWFindWork/SMW_SuggestStatisticsSQL.php');
				$this->store = new SMWSuggestStatisticsSQL();
			break;
		}
		
		$this->workFields = array('Select...',
								  'General consistency problems', 
								  'Missing Annotations', 
								  'Properties without type/domain',
								  'Instances without category', 
								  'Category leafs', 
								  'Subcategory anomalies',
								  'Undefined categories', 
								  'Undefined properties',
								  'Pages with low rated annotations'
								  );
	}
	
		
	
	function getName() {
		return "FindWork";
	}

	function isExpensive() {
		return false;
	}

	function isSyndicated() { return false; }

	function getPageHeader() {
		global $wgRequest;
		$field_val = $wgRequest->getVal("field") != NULL ? intval($wgRequest->getVal("field")) : 0;
		$html = '<p>' . wfMsg('smw_findwork_docu') . "</p>\n";
		$specialPage = Title::newFromText($this->getName(), NS_SPECIAL);
		$html .= "<form action=\"".$specialPage->getFullURL()."\">";
		$html .= "The article list will consider your interests based on your edit history and open gardening issues." .
				" If you don't know what to choose, simply press <input  name=\"gswButton\" type=\"submit\" value=\"Get some work\"/>. " .
				"The system will select something for you.<br>If you want to be more specific you can choose a field where you want to get articles from: ";
		
		$html .= "<select name=\"field\">";
		
		$i = 0;
		foreach($this->workFields as $field) {
			if ($i == $field_val) {
		 		$html .= "<option value=\"".$i."\" selected=\"selected\">".$field."</option>";
			} else {
				$html .= "<option value=\"".$i."\">".$field."</option>";
			}
			$i++;
		}
 		$html .= "</select>" .
 				"<input name=\"goButton\" type=\"submit\" value=\"Go\"/></form>";	
 		if ($field_val !== 0) $html .= '<h2>' . $this->workFields[$field_val] . "</h2>\n";
		return $html;
	}
	
	private function getPageBottom() {
		
		$html = '<h2>Rate annotations</h2>';
		$html .= 'Are these annotations correct? Please take a second and rate them.<br><br>';
		$html .= '<form id="ratingform"><table border="0">';
		
		// get some rated and unrated annotations
		$annotations = $this->store->getAnnotationsForRating(SMW_FINDWORK_NUMBEROF_RATINGS, true);
		$annotations = array_merge($this->store->getAnnotationsForRating(SMW_FINDWORK_NUMBEROF_RATINGS, false), $annotations);
		$i = 0;
		foreach($annotations as $a) {
			$html .= '<tr id="annotation'.$i.'">';
			$html .= '<td>'.str_replace("_", " ", $a[0]).'</td>';
			$html .= '<td>'.str_replace("_", " ", $a[1]).'</td>';
			$html .= '<td>'.str_replace("_", " ", $a[2]).'</td>';
			$html .= '<td><input type="radio" name="rating'.$i.'" value="1">Yes</input>' .
						  '<input type="radio" name="rating'.$i.'" value="-1">No</input>' .
						  '<input type="radio" name="rating'.$i.'" value="0" checked>Don\'t know</input>' .
					 '</td>';
			$html .= '</tr>';
			$i++;
		}
		$html .= '</table></form>';
		$html .= '<br><input type="button" name="rate" id="sendbutton" value="Send ratings" onclick="findwork.sendRatings()"/>';
		return $html;
	}
	
	function doQuery( $offset, $limit, $shownavigation=true ) {
		global $wgRequest, $wgOut;
		if ($wgRequest->getVal('limit') == NULL) $limit = 15;
		parent::doQuery($offset, $limit, $shownavigation);
		$wgOut->addHTML($this->getPageBottom());
	}
	
	function linkParameters() {
		global $wgRequest;
		$field = $wgRequest->getVal("field") == NULL ? '' : $wgRequest->getVal("field");
		$gswButton = $wgRequest->getVal("gswButton") == NULL ? '' : $wgRequest->getVal("gswButton");
		$goButton = $wgRequest->getVal("goButton") == NULL ? '' : $wgRequest->getVal("goButton");
		return array('field' => $field, 'getsomework' => $gswButton, 'go' => $goButton);
	}
	
	function sortDescending() {
		return false;
	}

	function formatResult( $skin, $result ) {
		
	    if ($result instanceof Title) {
	    	return $skin->makeLinkObj($result);
	    }
	    return '__undefined_object__: '.$result;
	}

	function getResults($options) {
		global $wgRequest, $wgUser;
		$loggedIn = $wgUser != NULL && $wgUser->isLoggedIn();
		$somework = $wgRequest->getVal("gswButton");
		$go = $wgRequest->getVal("goButton");
		$field = $wgRequest->getVal("field");
		
		$results = array();
		if ($somework != NULL) {
			// show arbitrary work. Consider edit history if user is logged in
			$results = $this->store->getLastEditedPages(NULL, NULL, NULL, $loggedIn ? $wgUser->getName() : NULL, $options);
			if (count($results) == 0) {
				$results = $this->store->getLastEditedPages(NULL, NULL, NULL, NULL, $options);
			}
			return $results;
		} else if ($go != NULL) {
			list($botID, $gi_class, $gi_type) = $this->getBotClassAndType($field);
			$username = $loggedIn ? $wgUser->getName() : NULL;
			switch($field) {
				case 0: break;
				case 1: // fall through
				case 2: // fall through
				case 3: // fall through
				case 4: // fall through
				case 5:
				case 6: { // show some work of given type. Consider edit history if user is logged in
							$results = $this->store->getLastEditedPages($botID, $gi_class, $gi_type, $username, $options);
							if (count($results) == 0) {
								// show some work of given type. Consider categories of articles of edit history. 
								$results = $this->store->getLastEditedPagesOfSameCategory($botID, $gi_class, $gi_type, $username, $options);
								if (count($results) == 0) {
									 // show some work. Very unspecific
									 $results = $this->store->getLastEditedPages(NULL, NULL, NULL, NULL, $options);
								}
							}	
				 			break;
						}
				case 7: { $results = $this->store->getLastEditPagesOfUndefinedCategories($username, $options);
					 	  if (count($results) == 0) {
							 // show some work. Very unspecific
							 $results = $this->store->getLastEditedPages(NULL, NULL, SMW_GARDISSUE_CATEGORY_UNDEFINED, NULL, $options);
						  } 
						  	break;
						 }
				case 8: { $results = $this->store->getLastEditPagesOfUndefinedProperties($username, $options);
					 	  if (count($results) == 0) {
							 // show some work. Very unspecific
							 $results = $this->store->getLastEditedPages(NULL, NULL, SMW_GARDISSUE_PROPERTY_UNDEFINED, NULL, $options);
						  } 
						  	break;
						 }
				case 9: {
							$results = $this->store->getLowRatedAnnotations($username, $options);
							if (count($results) == 0) {
							 	// show some work. Very unspecific
							 	$results = $this->store->getLowRatedAnnotations(NULL, $options);
						  	} 
						  	break;
						}
			}
			
		}
		return $results;
	}
	
	private function getBotClassAndType($field) {
		switch($field) {
			case 0: return array();
			case 1: return array('smw_consistencybot', NULL, NULL);
			case 2: return array('smw_consistencybot', NULL, SMW_GARDISSUE_TOO_LOW_CARD);
			case 3: return array('smw_consistencybot', SMW_CONSISTENCY_BOT_BASE + 1, NULL);  // SMW_CONSISTENCY_BOT_BASE + 1 is group of undefined domains/ranges/types		
			case 4: return array('smw_undefinedentitiesbot', NULL, SMW_GARDISSUE_INSTANCE_WITHOUT_CAT);
			case 5: return array('smw_anomaliesbot', NULL, SMW_GARDISSUE_CATEGORY_LEAF);
			case 6: return array('smw_anomaliesbot', NULL, SMW_GARDISSUE_SUBCATEGORY_ANOMALY);
			case 7: return array('smw_undefinedentitiesbot', NULL, SMW_GARDISSUE_CATEGORY_UNDEFINED);
			case 8: return array('smw_undefinedentitiesbot', NULL, SMW_GARDISSUE_PROPERTY_UNDEFINED);	
			case 9: return array();
		}
	}
 }
?>

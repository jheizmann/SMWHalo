<?php
/*
 * Created on 18.06.2007
 *
 * Author: kai
 */
 require_once("SMW_GardeningBot.php");
 
 // maximum number of subcategories not regarded as anomaly
 define('MAX_SUBCATEGORY_NUM', 8);
 // minimum number of subcategories not regarded as anomaly
 define('MIN_SUBCATEGORY_NUM', 2);
 
 /**
  * Bot is used to find ontology anomalies
  */
 class AnomaliesBot extends GardeningBot {
 	
 	// global log which contains wiki-markup
 	private $globalLog;
 	
 	function AnomaliesBot() {
 		parent::GardeningBot("smw_anomaliesbot");
 		$this->globalLog = "== ".wfMsg('smw_gard_anomalylog')."! ==\n\n";
 	}
 	
 	public function getHelpText() {
 		return wfMsg('smw_gard_anomaly_docu');
 	}
 	
 	public function getLabel() {
 		return wfMsg($this->id);
 	}
 	
 	public function allowedForUserGroups() {
 		return array(SMW_GARD_GARDENERS, SMW_GARD_SYSOPS, SMW_GARD_ALL_USERS);
 	}
 	
 	/**
 	 * Returns an array of parameter objects
 	 */
 	public function createParameters() {
 		global $wgUser;
 		$params = array();
 		$params[] = new GardeningParamBoolean('CATEGORY_NUMBER_ANOMALY', wfMsg('smw_gard_anomaly_checknumbersubcat'), SMW_GARD_PARAM_OPTIONAL, true);
 		$params[] = new GardeningParamBoolean('CATEGORY_LEAF_ANOMALY', wfMsg('smw_gard_anomaly_checkcatleaves'), SMW_GARD_PARAM_OPTIONAL, true);
 		$resParam = new GardeningParamTitle('CATEGORY_RESTRICTION', wfMsg('smw_gard_anomaly_restrictcat'), SMW_GARD_PARAM_OPTIONAL);
 		$resParam->setAutoCompletion(true);
 		$resParam->setTypeHint(NS_CATEGORY);
 		$params[] = $resParam;
 		// for GARDENERS and SYSOPS, deletion of leaf categories is possible.
 		$userGroups = $wgUser->getGroups();
 		if (in_array('gardener', $userGroups) || in_array('sysop', $userGroups)) { // why do the constants SMW_GARD_SYSOP, SMW_GARD_GARDENERS not work here?
 			$params[] = new GardeningParamBoolean('CATEGORY_LEAF_DELETE', wfMsg('smw_gard_anomaly_deletecatleaves'), SMW_GARD_PARAM_OPTIONAL, false);
 		}
 		return $params;
 	}
 	
 	/**
 	 * Do bot work and return a log as wiki markup.
 	 * Do not use echo when it is not running asynchronously.
 	 */
 	public function run($paramArray, $isAsync, $delay) {
 		global $wgLang;
 		if (!$isAsync) {
 			echo 'Missing annotations bot should not be run synchronously! Abort bot.'; // do not externalize
 			return;
 		}
 		echo $this->getBotID()." started!\n";
 		
       	$catNS = $wgLang->getNsText(NS_CATEGORY);
 		
 		if (array_key_exists('CATEGORY_LEAF_ANOMALY', $paramArray)) {  
 			echo "Checking for category leafs...\n";
 			if ($paramArray['CATEGORY_RESTRICTION'] == '') {
       			$categoryLeaves = $this->getCategoryLeafs();
       	
       			$this->globalLog .= "== ".wfMsg('smw_gard_category_leafs')." ==\n";
       			foreach($categoryLeaves as $cl) {
       				$this->globalLog .= "*[[:$catNS:".$cl->getText()."]]\n";
       				echo $catNS.":".$cl->getText()."\n";
       			} 
 			} else {
 				$categories = explode(";", urldecode($paramArray['CATEGORY_RESTRICTION']));
 				$categoryLeaves = array();
 				$this->globalLog .= "== ".wfMsg('smw_gard_category_leafs')." ==\n";
 				foreach($categories as $c) {
 					$categoryDB = str_replace(" ", "_", trim($c));
 					$categoryLeaves = $this->getCategoryLeafs($categoryDB);
 					$this->globalLog .= '=== '.$catNS.': '.$c." ===\n";
 					foreach($categoryLeaves as $cl) {
       					$this->globalLog .= "*[[:$catNS:".$cl->getText()."]]\n";
       					echo $catNS.":".$cl->getText()."\n";
       				} 
 				}
       			
 			}		
       	 echo "done!\n";
 	   		
 		}
       	
       	if (array_key_exists('CATEGORY_NUMBER_ANOMALY', $paramArray)) {  	
       		echo "\nChecking for number anomalies...\n";
       		if ($paramArray['CATEGORY_RESTRICTION'] == '') {
       			
        		$subCatAnomalies = $this->getCategoryAnomalies();
       			
       	
       			$this->globalLog .= "== ".wfMsg('smw_gard_subcategory_number_anomalies')." ==\n";
       			foreach($subCatAnomalies as $a) {
       				list($title, $subCatNum) = $a;
       				$this->globalLog .= "*[[:$catNS:".$title->getText()."]] has $subCatNum ".($subCatNum == 1 ? wfMsg('smw_gard_subcategory') : wfMsg('smw_gard_subcategories')).".\n";
       				echo $catNS.":".$title->getText()." has $subCatNum ".($subCatNum == 1 ? "subcategory" : "subcategories").".\n";
       			} 
       		} else {
       			
       			$categories = explode(";", urldecode($paramArray['CATEGORY_RESTRICTION']));
 				$categoryLeaves = array();
 				$this->globalLog .= "== ".wfMsg('smw_gard_subcategory_number_anomalies')." ==\n";
 				foreach($categories as $c) {
 					$categoryDB = str_replace(" ", "_", trim($c));
 					$subCatAnomalies = $this->getCategoryAnomalies($categoryDB);
 					foreach($subCatAnomalies as $a) {
       					list($title, $subCatNum) = $a;
       					$this->globalLog .= "*[[:$catNS:".$title->getText()."]] has $subCatNum ".($subCatNum == 1 ? wfMsg('smw_gard_subcategory') : wfMsg('smw_gard_subcategories')).".\n";
       					echo $catNS.":".$title->getText()." has $subCatNum ".($subCatNum == 1 ? "subcategory" : "subcategories").".\n";
       				} 
 				}
       		}
       		echo "done!\n";
       	}
       	
       	if (array_key_exists('CATEGORY_LEAF_DELETE', $paramArray)) {
       		echo "\nRemoving category leaves...\n";
       		if ($paramArray['CATEGORY_RESTRICTION'] == '') {
        		$this->removeCategoryLeaves();
       			$this->globalLog .= "\n".wfMsg('smw_gard_all_category_leaves_deleted');
       		} else {
       			$categories = explode(";", urldecode($paramArray['CATEGORY_RESTRICTION']));
       			foreach($categories as $c) {
       				$categoryDB = str_replace(" ", "_", trim($c));
       				$this->removeCategoryLeaves($categoryDB);
       			}
       			$this->globalLog .= "\n".wfMsg('smw_gard_category_leaves_deleted', $catNS, $c);
       		}
       		echo "done!\n";
       	}
 		return $this->globalLog;
 		
 	}
 	
 	/**
 	 * Returns all categories which have neither instances nor subcategories.
 	 * 
 	 * @param $category as strings (dbkey)
 	 */
 	private function getCategoryLeafs($category = NULL) {
 		$db =& wfGetDB( DB_MASTER );
 		$result = array();
		if ($category == NULL) { 
			$sql = 'SELECT page_title FROM page p LEFT JOIN categorylinks c ON p.page_title = c.cl_to WHERE cl_from IS NULL AND page_namespace = '.NS_CATEGORY. ' LIMIT '.MAX_LOG_LENGTH;
	               
			$res = $db->query($sql);
		
			$result = array();
			if($db->numRows( $res ) > 0) {
				while($row = $db->fetchObject($res)) {
				
					$result[] = Title::newFromText($row->page_title, NS_CATEGORY);
				
				}
			}
			$db->freeResult($res);
		} else {
			
				$categoryTitle = Title::newFromText($category, NS_CATEGORY);
				$subCats = $this->getSubCategories($categoryTitle);
				$subCats[] = $categoryTitle; // add super category title too
			
				foreach($subCats as $subCat) { 
					$sql = 'SELECT page_title FROM page p LEFT JOIN categorylinks c ON p.page_title = c.cl_to WHERE cl_from IS NULL AND page_title = '.$db->addQuotes($subCat->getDBkey()).' AND page_namespace = '.NS_CATEGORY. ' LIMIT '.MAX_LOG_LENGTH;
	                
					$res = $db->query($sql);
		
					$result = array();
					if($db->numRows( $res ) > 0) {
						while($row = $db->fetchObject($res)) {
							$result[] = Title::newFromText($row->page_title, NS_CATEGORY);
						}
					}
					$db->freeResult($res);
				}
			
		}
		
		return $result;
 	}
 	
 	/**
 	 * Returns all categories which have less than MIN_SUBCATEGORY_NUM and more than MAX_SUBCATEGORY_NUM subcategories.
 	 */
 	private function getCategoryAnomalies($category = NULL) {
 		$db =& wfGetDB( DB_MASTER );
		$result = array();

		if ($category == NULL) {  		
			$sql = 'SELECT COUNT(cl_from) AS subCatNum, cl_to FROM page p, categorylinks c WHERE cl_from = page_id AND page_namespace = '.NS_CATEGORY.' GROUP BY cl_to HAVING (COUNT(cl_from) < '.MIN_SUBCATEGORY_NUM.' OR COUNT(cl_from) > '.MAX_SUBCATEGORY_NUM.') LIMIT '.MAX_LOG_LENGTH;
		               
			$res = $db->query($sql);
		
			if($db->numRows( $res ) > 0) {
				while($row = $db->fetchObject($res)) {
				
					$result[] = array(Title::newFromText($row->cl_to, NS_CATEGORY), $row->subCatNum);
					
				}
			}
		
			$db->freeResult($res);
		} else {
			
				$categoryTitle = Title::newFromText($category, NS_CATEGORY);
				$subCats = $this->getSubCategories($categoryTitle);
				$subCats[] = $categoryTitle; // add super category title too
				foreach($subCats as $subCat) { 
					$sql = 'SELECT COUNT(cl_from) AS subCatNum, cl_to FROM page p, categorylinks c WHERE cl_from = page_id AND page_namespace = '.NS_CATEGORY.' AND page_title = '.$db->addQuotes($subCat->getDBkey()).' GROUP BY cl_to HAVING (COUNT(cl_from) < '.MIN_SUBCATEGORY_NUM.' OR COUNT(cl_from) > '.MAX_SUBCATEGORY_NUM.') LIMIT '.MAX_LOG_LENGTH;
		               
					$res = $db->query($sql);
		
					if($db->numRows( $res ) > 0) {
						while($row = $db->fetchObject($res)) {
				
							$result[] = array(Title::newFromText($row->cl_to, NS_CATEGORY), $row->subCatNum);
						
						}
					}
		
					$db->freeResult($res);
				}
			
		}
		return $result;
 	}
 	
 	/**
 	 * Removes all category leaves
 	 */
 	private function removeCategoryLeaves($category = NULL) {
 		$db =& wfGetDB( DB_MASTER );
 		if ($category == NULL) {  		
 				
		$sql = 'SELECT page_title FROM page p LEFT JOIN categorylinks c ON p.page_title = c.cl_to WHERE cl_from IS NULL AND page_namespace = '.NS_CATEGORY;
	               
		$res = $db->query($sql);
		
		
		if($db->numRows( $res ) > 0) {
			while($row = $db->fetchObject($res)) {
				$categoryTitle = Title::newFromText($row->page_title, NS_CATEGORY);
				$categoryArticle = new Article($categoryTitle);
				$categoryArticle->doDeleteArticle(wfMsg('smw_gard_category_leaf_deleted', $row->page_title));
			}
		}
		
		$db->freeResult($res);
 		} else {
 				$categoryTitle = Title::newFromText($category, NS_CATEGORY);
				$subCats = $this->getSubCategories($categoryTitle);
				$subCats[] = $categoryTitle; // add super category title too
				foreach($subCats as $subCat) { 
					$sql = 'SELECT page_title FROM page p LEFT JOIN categorylinks c ON p.page_title = c.cl_to WHERE cl_from IS NULL AND page_title = '.$db->addQuotes($subCat->getDBkey()).' AND page_namespace = '.NS_CATEGORY;
	               
					$res = $db->query($sql);
		
		
					if($db->numRows( $res ) > 0) {
						while($row = $db->fetchObject($res)) {
							$categoryTitle = Title::newFromText($row->page_title, NS_CATEGORY);
							$categoryArticle = new Article($categoryTitle);
							$categoryArticle->doDeleteArticle(wfMsg('smw_gard_category_leaf_deleted', $row->page_title));
						}
					}
		
					$db->freeResult($res);
				}
 		}
		
 	}
 	
 	private function getNamespaceText($page) {
 		global $smwgContLang, $wgLang;
 		$nsArray = $smwgContLang->getNamespaces();
 		if ($page->getNamespace() == NS_TEMPLATE || $page->getNamespace() == NS_CATEGORY) {
 			$ns = $wgLang->getNsText($page->getNamespace());
 				} else { 
 			$ns = $page->getNamespace() != NS_MAIN ? $nsArray[$page->getNamespace()] : "";
 		}
 		return $ns;
 	}
 	
 	private function getDirectSubCategories(Title $categoryTitle, $requestoptions = NULL) {
		$result = "";
		$db =& wfGetDB( DB_MASTER );
		$sql = 'page_namespace=' . NS_CATEGORY .
			   ' AND cl_to =' . $db->addQuotes($categoryTitle->getDBkey()) . ' AND cl_from = page_id';

		$res = $db->select(  array($db->tableName('page'), $db->tableName('categorylinks')), 
		                    'page_title',
		                    $sql, 'SMW::getDirectSubCategories', NULL );
		$result = array();
		if($db->numRows( $res ) > 0) {
			while($row = $db->fetchObject($res)) {
				$result[] = Title::newFromText($row->page_title, NS_CATEGORY);
			}
		}
		$db->freeResult($res);
		return $result;
	}
	
	private function getSubCategories(Title $category) {
		$subCategories = $this->getDirectSubCategories($category);
		$result = array();
		foreach($subCategories as $subCat) {
			$result = array_merge($result, $this->getDirectSubCategories($subCat));
		}
		return array_merge($result, $subCategories);
	}
 }
 
 new AnomaliesBot();
?>
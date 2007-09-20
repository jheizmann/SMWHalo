<?php

global $wgAjaxExportList;
global $smwgIP;
require_once( "$smwgIP/includes/SMW_Datatype.php" );

$wgAjaxExportList[] = 'smwfQIAccess';


function smwfQIAccess($method, $params) {
	$p_array = explode(",", $params);
	global $smwgQEnabled;


	if($method == "getPropertyInformation"){
		$relationName = $p_array[0];
		global $smwgContLang, $smwgHaloContLang;

		$smwSpecialSchemaProperties = $smwgHaloContLang->getSpecialSchemaPropertyArray();

		// get type definition (if it exists)
		$relationTitle = Title::newFromText($relationName, SMW_NS_PROPERTY);
		$type = smwfGetStore()->getSpecialValues($relationTitle, SMW_SP_HAS_TYPE);

		// if no 'has type' annotation => normal binary relation
		if (count($type) == 0) {
			// return binary schema (arity = 2)
			$relSchema = '<relationSchema name="'.$relationName.'" arity="2">'.
							'<param name="Page" isNumeric="false"/>'.
	           	  		 '</relationSchema>';
		} else {
			$typeLabels = $type[0]->getTypeLabels();
			$typeValues = $type[0]->getTypeValues();
			if ($type[0] instanceof SMWTypesValue) {

				// get arity
				$arity = count($typeLabels) + 1;  // +1 because of subject
		   		$relSchema = '<relationSchema name="'.$relationName.'" arity="'.$arity.'">';

		   		for($i = 0, $n = $arity-1; $i < $n; $i++) {
		   			$th = SMWTypeHandlerFactory::getTypeHandlerByLabel($typeLabels[$i]);
		   			$isNum = $th->isNumeric()?"true":"false";
		   			$pvalues = SMWTypeHandlerFactory::getPossibleValues($relationName);
		   			$relSchema .= '<param name="'.$typeLabels[$i].'" isNumeric="' . $isNum . '">';
		   			for($j = 0; $j < sizeof($pvalues); $j++){
		   				$relSchema .= '<allowedValue value="' . $pvalues[$j] . '"/>';
		   			}
					$relSchema .= '</param>';
				}
				$relSchema .= '</relationSchema>';

			} else { // this should never happen, huh?
			$relSchema = '<relationSchema name="'.$relationName.'" arity="2">'.
							'<param name="Page" isNumeric="false"/>'.
	           	  		 '</relationSchema>';
			}
		}
		return $relSchema;
	}

	else if($method == "getNumericTypes"){
		$types = SMWTypeHandlerFactory::getTypeLabels();
		$numtypes = array();
		foreach($types as $name){
			$th = SMWTypeHandlerFactory::getTypeHandlerByLabel($name);
			if ($th->isNumeric()){
				array_push($numtypes, strtolower($name));
			}
		}
		return implode(",", $numtypes);
	}

	else if($method == "getQueryResult"){
		$result="null";
		if ($smwgQEnabled) {
			$params = array('format' => $p_array[1], 'link' => $p_array[2], 'intro' => $p_array[3], 'sort' => $p_array[4], 'limit' => $p_array[5], 'mainlabel' => $p_array[6], 'order' => $p_array[7], 'default' => $p_array[8], 'headers' => $p_array[9]);
			$result = SMWQueryProcessor::getResultHTML($p_array[0], $params, false);
		}
		return $result;
	}
	else if($method == "saveQuery"){
		$title = "Query:" . $p_array[0];
		$query = $p_array[1];
		$wikiTitle = Title::newFromText($title, NS_TEMPLATE);

		if($wikiTitle->exists()){
			return "exists";
		} else {
			$article = new Article($wikiTitle);
			$success = $article->doEdit($query, wfMsg('smw_qi_querySaved'), EDIT_NEW);
			return $success ? "true" : "false";
		}
	}
	else if ($method == "loadQuery"){
		$title =  Title::newFromText($p_array[0], NS_TEMPLATE);
		if($title->exists()){
			$revision = Revision::newFromTitle($title);
			$fullQuery = $revision->getRawText();

			//extract display settings and actual query
			$pattern = '/<ask ([^>]+)>(.*?)<\/ask>/';
			$matches = array();
			if(!preg_match($pattern, $fullQuery, $matches)){
				return "false";
			}
			$display = $matches[1];
			$query = $matches[2];
		} else {
			return "false";
		}
	}
	else {
		return "false";
	}
}
?>
<?php

global $wgAjaxExportList;
$wgAjaxExportList[] = 'smwf_ws_processStep1';
$wgAjaxExportList[] = 'smwf_ws_processStep2';

function smwf_ws_processStep1($uri){
	$wsClient = createWSClient($uri);
	if(is_array($wsClient)){
		return "false";
	} else {
		$operations = $wsClient->getOperations();
		return implode(";", $operations);

	}
}

function smwf_ws_processStep2($uri, $methodName){
	$wsClient = createWSClient($uri);
	$rawParameters = $wsClient->getOperation($methodName);

	$parameters = array();
	$numParam = count($rawParameters);
	for ($i = 1; $i < $numParam; ++$i) {
		$pName = $rawParameters[$i][0];
		$pType = $rawParameters[$i][1];
		$parameters = array_merge($parameters ,flattenParam($wsClient, $pName, $pType));
	}
	
	return implode(";", $parameters);
}

function createWSClient($uri) {
	// include the correct client
	global $smwgHaloIP;

	$wsClient;

	try {
		//todo: also allow other protocols
		$mProtocol = "SOAP";
		include_once($smwgHaloIP . "/specials/SMWWebService/SMW_".
		$mProtocol."Client.php");
		$classname = "SMW".ucfirst(strtolower($mProtocol))."Client";
		if (!class_exists($classname)) {
			return array(wfMsg("smw_wws_invalid_protocol"));
		}
		$wsClient = new $classname($uri);
	} catch (Exception $e) {
		// The wwsd is erroneous
		return array(wfMsg("smw_wws_invalid_wwsd"));
	}
	return $wsClient;

}

function flattenParam($wsClient, $name, $type, &$typePath=null) {
		$flatParams = array();

		if (!$wsClient->isCustomType($type) && substr($type,0, 7) != "ArrayOf") {
			// $type is a simple type
			$flatParams[] = $name;
			return $flatParams;
		}
		$tp = $wsClient->getTypeDefinition($type);
		foreach ($tp as $var => $type) {
			if(substr($type,0, 7) == "ArrayOf"){
				$type = substr($type, 7);
				$fname = empty($name) ? $var."[]" : $name.'.'.$var."[]";
			} else {
				$fname = empty($name) ? $var : $name.'.'.$var;
			}
			if ($wsClient->isCustomType($type)) {
				if (!$typePath) {
					$typePath = array();
				}
				if (in_array($type, $typePath)) {
					// stop recursion
					$flatParams[] = $fname."##overflow##";
					break;
				}
				$typePath[] = $type;
				$names = flattenParam($wsClient, $fname, $type, $typePath);
				$flatParams = array_merge($flatParams,$names);
				array_pop($typePath);
			} else {
				$flatParams[] = $fname.=" (".$type.")";
			}
		}
		return $flatParams;
	}


?>
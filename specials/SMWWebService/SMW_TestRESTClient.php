<?php

global $smwgHaloIP;	
$smwgHaloIP = "D:/devel/workspace-wtp/HaloSMWExtensionSVN/extensions/SMWHalo";

require_once("SMW_RESTClient.php");

$pass = urlencode("f#dg#d");

$client = new SMWRestClient("http://phpwebservices.blogspot.com/feeds/posts/default?alt=rss", "","","");

$result = $client->call("get", array());

echo($result);

?>
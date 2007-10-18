<?php
/*
 * Created on 12.03.2007
 *
 * Author: kai
 */

 //get Parameter
 $wgRequestTime = microtime(true);

/** */
# Abort if called from a web server
if ( isset( $_SERVER ) && array_key_exists( 'REQUEST_METHOD', $_SERVER ) ) {
	print "This script must be run from the command line\n";
	exit();
}

if( version_compare( PHP_VERSION, '5.0.0' ) < 0 ) {
	print "Sorry! This version of MediaWiki requires PHP 5; you are running " .
		PHP_VERSION . ".\n\n" .
		"If you are sure you already have PHP 5 installed, it may be " .
		"installed\n" .
		"in a different path from PHP 4. Check with your system administrator.\n";
	die( -1 );
}

define('MEDIAWIKI',true);

# Process command line arguments
# Parse arguments

echo "Parse arguments...";

$params = array();
for( $arg = reset( $argv ); $arg !== false; $arg = next( $argv ) ) {
	//-b => BotID
	if ($arg == '-b') {
		$botID = next($argv);
		continue;
	} // -t => TaskID
	if ($arg == '-t') {
		$taskid = next($argv);
		continue;
	} // -u => UserID
	if ($arg == '-u') {
		$userId = next($argv);
		continue;
	}
	$params[] = $arg;
}

// include commandLine script which provides some basic
// methodes for maintenance scripts
$mediaWikiLocation = dirname(__FILE__) . '/../../../..';
require_once "$mediaWikiLocation/maintenance/commandLine.inc";

// include bots
require_once("ConsistencyBot/SMW_ConsistencyBot.php");
require_once("Bots/SMW_SimilarityBot.php");
require_once("Bots/SMW_TemplateMaterializerBot.php");
require_once("Bots/SMW_UndefinedEntitiesBot.php");
require_once("Bots/SMW_MissingAnnotationsBot.php");
require_once("Bots/SMW_AnomaliesBot.php");
require_once("Bots/SMW_ImportOntologyBot.php");

require_once("SMW_GardeningLog.php");


// run bot

  array_shift($params); // get rid of path
  
  global $registeredBots, $wgUser; 
  $bot = $registeredBots[$botID];
  
  
 if ($bot != null) { 
 	echo ("Starting bot: $botID\n");
 	// run bot
 	global $wgGardeningBotDelay;
 	try { 
 		$bot->setTaskID($taskid);
 		$log = $bot->run(GardeningBot::convertParamStringToArray(implode($params,"")), true, isset($wgGardeningBotDelay) ? $wgGardeningBotDelay : 0);
 		
 		$log .= "\n[[category:GardeningLog]]";
 
 		// mark as finished
 		$title = SMW_Gardening::getGardeningLog()->markGardeningTaskAsFinished($taskid, $log);
 		echo "Log saved at: ".$title->getLocalURL()."\n";
 		
 	} catch(Exception $e) {
 		$log = 'Something bad happened during execution of "'.$botID.'": '.$e->getMessage();
 		$log .= "\n[[category:GardeningLog]]";
 		$title = SMW_Gardening::getGardeningLog()->markGardeningTaskAsFinished($taskid, $log);
 		echo $log;
 		echo "\nLog saved at: ".$title->getLocalURL();
 	} 
 }
 
 // get user email to send a message to him.
 $userEmail = getEmailFromUserId($userId);
 
 if ($smtpServerIP && $userEmail != null && $userEmail != '') { 
 	// send email when finished.
 	echo "Sending email to: ".$userEmail;
 	sendmail($userEmail, $bot);
 }
 
 /**
  * Sends a mail to $to using server $smtpServerIP as SMTP server
  * $bot is the bot which has finished.
  */
 function sendmail($to, $bot) {
 	$header = "From: $to" . "\r\n" .
   	"Reply-To: $to" . "\r\n" .
   	"X-Mailer: PHP/" . phpversion();
  	
 	mail($to, $bot->getLabel()." has finished", wfMsg('smw_autogen_mail'), $header);
 
 }
 
 /**
  * Returns user email from user id.
  */
 function getEmailFromUserId($userId) {
 	$db =& wfGetDB( DB_MASTER );
 	$res = $db->select( $db->tableName('user'), 
		                    'user_email',
		                    'user_id = '.$db->addQuotes($userId), 'SMW::getEmailFromUserId', NULL );
	if($db->numRows( $res ) > 0) {
		$row = $db->fetchObject($res);
		return $row->user_email;
		
	}
	return NULL;
 }

?>

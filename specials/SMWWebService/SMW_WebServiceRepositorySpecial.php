<?php
/*  Copyright 2008, ontoprise GmbH
 *  This file is part of the halo-Extension.
 *
 *   The halo-Extension is free software; you can redistribute it and/or modify
 *   it under the terms of the GNU General Public License as published by
 *   the Free Software Foundation; either version 3 of the License, or
 *   (at your option) any later version.
 *
 *   The halo-Extension is distributed in the hope that it will be useful,
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *   GNU General Public License for more details.
 *
 *   You should have received a copy of the GNU General Public License
 *   along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */


if ( !defined( 'MEDIAWIKI' ) ) die;
define('SMW_WS_SYSOP' , 'sysop');

global $IP;
require_once( $IP . "/includes/SpecialPage.php" );

global $smwgHaloIP;
require_once("$smwgHaloIP/specials/SMWWebService/SMW_WSUpdateBot.php");

/**
 * This class represents the special page webservice repository
 *
 * @author Ingo Steinbauer
 *
 */
class SMWWebServiceRepositorySpecial extends SpecialPage {

	public function __construct() {
		parent::__construct('WebServicerepository');
	}

	/**
	 * this methods constructs the special page webservice repository
	 *
	 */
	public function execute() {
		global $wgRequest, $wgOut;

		$wgOut->setPageTitle("Web Service Repository");

		global $wgCookiePrefix;
		 
		$allowed = false;
		global $wgUser;
		$user = $wgUser;
		if($user != null){
			$groupsOfUser = $user->getGroups();
			foreach($groupsOfUser as $key => $group) {
				if($group == SMW_WS_SYSOP){
					$allowed = true;
				}
			}
		}
		 
		$html = "";


		global $smwgHaloIP;
		require_once($smwgHaloIP . '/specials/SMWWebService/SMW_WSStorage.php');

		$webServices = WSStorage::getDatabase()->getWebServices();
		ksort($webServices);

		$html .= "<h2><span class=\"mw-headline\">Available Wiki Web Service Definitions</span></h2>";

		if($allowed){
			$html .= "<table width=\"100%\" class=\"smwtable\"><tr><th>Name</th><th>Last Updates</th><th>Update</th><th>Confirm</th></tr>";
		} else {
			$html .= "<p>If you do not see the buttons for updating and confirming WebServices, you might not be logged in or you do not have any rights to use these functions.</p>";
			$html .= "<table width=\"100%\" class=\"smwtable\"><tr><th>Name</th><th>Last Updates</th></tr>";
		}
		foreach($webServices as $ws){
			$wsUrl = Title::newFromID($ws->getArticleID())->getInternalURL();
			$wsName = substr($ws->getName(), 11, strlen($ws->getName()));
			$html .= "<tr><td><a href=\"".$wsUrl."\">".$wsName."</a></td>";

			$cacheResults = WSStorage::getDatabase()->getResultsFromCache($ws->getArticleID());
			$oldestUpdate = "";
			if(count($cacheResults) >0){
				$oldestUpdate = $cacheResults[0]["lastUpdate"];
				if(strlen($oldestUpdate) > 0){
					$oldestUpdate = wfTimestamp(TS_DB, $oldestUpdate);
				}
			}

			$latestUpdate = "";
			if(sizeof($cacheResults) > 1){
				$latestUpdate = $cacheResults[(sizeof($cacheResults)-1)]["lastUpdate"];
				if(strlen($latestUpdate) > 0){
					$latestUpdate = wfTimestamp(TS_DB, $cacheResults[(sizeof($cacheResults)-1)]["lastUpdate"]);
					if(strlen($oldestUpdate) > 0){
						$latestUpdate = " - ".$latestUpdate;
					}
				}
			}

			$html .= "<td>".$oldestUpdate.$latestUpdate."</td>";

			if($allowed){
				$wsUpdateBot = new WSUpdateBot();
				$html .= "<td><button id=\"update".$ws->getArticleID()."\" type=\"button\" name=\"update\" onclick=\"webServiceSpecial.updateCache('".$wsUpdateBot->getBotID()."', 'WS_WSID=".$ws->getArticleID()."')\">Update</button>";
				$html .= "<div id=\"updating".$ws->getArticleID()."\" style=\"display: none\">Updating</div></td>";

				if($ws->getConfirmationStatus() != "true"){
					$html .= "<td id=\"confirmText".$ws->getArticleID()."\">  <button type=\"button\" id=\"confirmButton".$ws->getArticleID()."\" onclick=\"webServiceSpecial.confirmWWSD(".$ws->getArticleID().")\">Confirm</button></td></tr>";
				} else {
					$html .= "<td>confirmed</td></tr>";
				}
			} else {
				$html .= "</tr>";
			}
		}

		$html .= "</table>";

		$wgOut->addHTML($html);
	}
}

?>
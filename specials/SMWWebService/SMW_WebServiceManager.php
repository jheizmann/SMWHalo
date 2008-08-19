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

/**
 * This is the main entry file for the semantic Wiki Web Service extension.
 *
 * @author Thomas Schweitzer
 *
 */
if ( !defined( 'MEDIAWIKI' ) ) die;
// Include the settings file for the configuration of the Web Service extension.
global $smwgHaloIP;

require_once("$smwgHaloIP/specials/SMWWebService/SMW_WebServiceSettings.php");

// include the web service syntax parser
require_once("$smwgHaloIP/specials/SMWWebService/SMW_WebServiceUsage.php");

require_once("$smwgHaloIP/specials/SMWWebService/SMW_WebServiceRepositoryAjaxAccess.php");

require_once("$smwgHaloIP/specials/SMWWebService/SMW_DefineWebServiceAjaxAccess.php");


###
# If you already have custom namespaces on your site, insert
# $smwgWWSNamespaceIndex = ???;
# into your LocalSettings.php *before* including this file.
# The number ??? must be the smallest even namespace number
# that is not in use yet. However, it must not be smaller
# than 100. Semantic MediaWiki normally uses namespace numbers from 100 upwards.
##

// Register additional namespaces
if (!isset($smwgWWSNamespaceIndex)) {
	WebServiceManager::initWWSNamespaces(200);
} else {
	WebServiceManager::initWWSNamespaces();
}

global $wgLanguageCode;

smwfHaloInitContentLanguage($wgLanguageCode);
WebServiceManager::registerWWSNamespaces();

/**
 * This class contains the top level functionality of the Wiki Web Service
 * extensions. It
 * - provides access to the database
 * - creates instances of class WebService
 * - registers namespaces
 *
 */

class WebServiceManager {

	private static $mNewWebService = null;
	private static $mOldWebservice = null; // the webserve in its state before the wwsd is changed


	/**
	 * Register the WebServicePage for articles in the namespace 'WebService'.
	 *
	 * @return boolean
	 * 		Returns always <true>.
	 */
	static function showWebServicePage(&$title, &$article) {
		global $smwgHaloIP;
		if ($title->getNamespace() == SMW_NS_WEB_SERVICE) {
			require_once("$smwgHaloIP/specials/SMWWebService/SMW_WebServicePage.php");
			$article = new SMWWebServicePage($title);
		}
		return true;
	}

	/**
	 * Initializes the namespaces that are used by the Wiki Web Service extension.
	 * Normally the base index starts at 200. It must be an even number greater than
	 * than 100. However, by default Semantic MediaWiki uses the namespace indexes
	 * from 100 upwards.
	 *
	 * @param int $baseIndex
	 * 		Optional base index for all Wiki Web Service namespaces. The default is 200.
	 */
	static function initWWSNamespaces($baseIndex = 200) {
		global $smwgWWSNamespaceIndex;

		if (!isset($smwgWWSNamespaceIndex)) {
			$smwgWWSNamespaceIndex = $baseIndex;
		}
		
		if (!defined('SMW_NS_WEB_SERVICE')) { 
			define('SMW_NS_WEB_SERVICE',       $smwgWWSNamespaceIndex);
			define('SMW_NS_WEB_SERVICE_TALK',  $smwgWWSNamespaceIndex+1);
		}
	}

	/**
	 * Registers the new namespaces. Must be called after the language dependent
	 * messages have been installed.
	 *
	 */
	static function registerWWSNamespaces() {
		global $wgExtraNamespaces, $wgNamespaceAliases, $smwgHaloContLang;

		// Register namespace identifiers
		if (!is_array($wgExtraNamespaces)) {
			$wgExtraNamespaces = array();
		}
		$wgExtraNamespaces = $wgExtraNamespaces + $smwgHaloContLang->getNamespaces();
		$wgNamespaceAliases = $wgNamespaceAliases + $smwgHaloContLang->getNamespaceAliases();

	}

	/**
	 * Initialized the wiki web service extension:
	 * - installs the extended representation of articles in the namespace
	 *   'WebService'.
	 *
	 */
	static function initWikiWebServiceExtension() {
		global $wgRequest, $wgHooks, $wgParser;
		$action = $wgRequest->getVal('action');

		if ($action == 'ajax') {
			// Do not install the extension for ajax calls
			return;
		}
			
		// Install the extended representation of articles in the namespace 'WebService'.
		$wgHooks['ArticleFromTitle'][] = 'WebServiceManager::showWebServicePage';

		$wgParser->setHook('WebService', 'WebServiceManager::wwsdParserHook');
		$wgHooks['ArticleSaveComplete'][] = 'WebServiceManager::articleSavedHook';
		$wgHooks['ArticleDelete'][] = 'WebServiceManager::articleDeleteHook';


		//--- TEST
/*
		 global $smwgHaloIP;
		 require_once("$smwgHaloIP/specials/SMWWebService/SMW_WebService.php");
		 $wwsd = 
<<<WWSD
<WebService>
<uri name="http://webservices.amazon.com/AWSECommerceService/AWSECommerceService.wsdl" />
<protocol>SOAP</protocol>
<method name="ItemSearch" />
<parameter name="MarketplaceDomain"  optional="false"  path="body.MarketplaceDomain" />
<parameter name="AWSAccessKeyId"  optional="false"  path="body.AWSAccessKeyId" />
<parameter name="Manufacturer"  optional="false"  path="body.Request.Manufacturer" />
<parameter name="SearchIndex"  optional="false"  path="body.Request.SearchIndex" />
<parameter name="Title"  optional="true"  path="body.Request.Title" />
<result name="result" >
<part name="Name"  path="OperationRequest.HTTPHeaders.Header.Name" />
<part name="Value"  path="OperationRequest.HTTPHeaders.Header.Value" />
<part name="RequestId"  path="OperationRequest.RequestId" />
<part name="Name-1"  path="OperationRequest.Arguments.Argument.Name" />
<part name="Value-1"  path="OperationRequest.Arguments.Argument.Value" />
<part name="Code"  path="OperationRequest.Errors.Error.Code" />
<part name="Message"  path="OperationRequest.Errors.Error.Message" />
<part name="RequestProcessingTime"  path="OperationRequest.RequestProcessingTime" />
<part name="ASIN"  path="Items.Item.ASIN" />
<part name="Manufacturer"  path="Items.Item.ItemAttributes.Manufacturer" />
<part name="ProductGroup"  path="Items.Item.ItemAttributes.ProductGroup" />
<part name="Title"  path="Items.Item.ItemAttributes.Title" />
<part name="Price"  path="Items.Item.ItemAttributes.ListPrice.FormattedPrice" />

<part name="Code-1"  path="Items.Item.Errors.Error.Code" />
<part name="ErrorMessage"  path="Items.Item.Errors.Error.Message" />
<part name="DetailPageURL"  path="Items.Item.DetailPageURL" />
<part name="Description"  path="Items.Item.ItemLinks.ItemLink.Description" />
<part name="URL"  path="Items.Item.ItemLinks.ItemLink.URL" />
<part name="SalesRank"  path="Items.Item.SalesRank" />
<part name="ImageUrl"  path="Items.Item.SmallImage.URL" />

</result>

<displayPolicy>
<maxAge value="0"></maxAge>
</displayPolicy>
<queryPolicy>
<maxAge value="60"></maxAge>
<delay value="1"/>
</queryPolicy>
<spanOfLife value="90" expiresAfterUpdate="true" />
</WebService>
WWSD;
		 $ws = WebService::newFromWWSD("Amazon",$wwsd);
		 $ws->store();
 */
		/*
		 $wwsd = '<WebService>'.
		 '<uri name="http://www.currencyserver.de/webservice/currencyserverwebservice.asmx?WSDL" />'.
		 '<protocol>SOAP</protocol>'.
		 '<method name="getCurrencyValue" />'.
		 '<parameter name="provider" path="parameters.provider" />'.
		 '<parameter name="in" path="parameters.srcCurrency" />'.
		 '<parameter name="out" path="parameters.dstCurrency" />'.
		 '<result name="mode">'.
		 '</result>'.
		 '<displayPolicy>'.
		 '<once />'.
		 '</displayPolicy>'.
		 '<queryPolicy>'.
		 '<maxAge value="1440"/>'.
		 '<delay value="1"/>'.
		 '</queryPolicy>'.
		 '<spanOfLife value="180" expiresAfterUpdate="true"/>'.
		 '</WebService>'
		 $wwsd = '<WebService>'.
		 '<uri name="http://www.currencyserver.de/webservice/currencyserverwebservice.asmx?WSDL" />'.
		 '<protocol>SOAP</protocol>'.
		 '<method name="getCurrencyValue" />'.
		 '<parameter name="provider" path="parameters.provider" />'.
		 '<parameter name="in" path="parameters.srcCurrency" />'.
		 '<parameter name="out" path="parameters.dstCurrency" />'.
		 '<result name="mode">'.
		 '</result>'.
		 '<displayPolicy>'.
		 '<once />'.
		 '</displayPolicy>'.
		 '<queryPolicy>'.
		 '<maxAge value="1440"/>'.
		 '<delay value="1"/>'.
		 '</queryPolicy>'.
		 '<spanOfLife value="180" expiresAfterUpdate="true"/>'.
		 '</WebService>';

		 $ws = WebService::newFromWWSD("CurrencyCalculator",$wwsd);
		 $ws->validateWithWSDL();
		 $ws = new WebService('MySecondWebService', 'http://some.uri.com', 'SOAP', 'getValue',
		 '<parameters> </parameters>', '<result> </result>',
		 1000, 2000, 0, 90, false, true);
		 $ws->store();
		 $ws = WebService::newFromName('MySecondWebService');
		 $id = $ws->getArticleID();
		 $ws = WebService::newFromID($id);

		 for ($i = 1900; $i < 2000; ++$i) {
			WSStorage::getDatabase()->addWSArticle($id, 142, $i);
			}
			for ($i = 2000; $i < 2100; ++$i) {
			WSStorage::getDatabase()->addWSProperty($i ,$id, 142, $i);
			}
			*/
		//--- TEST

	}


	/**
	 * This function is called, when a <WebService>-tag for a WWSD has been
	 * found in an article. If the content of the definition is correct, and
	 * if the namespace of the article is the WebService namespace, the WWSD
	 * will be stored in the database.
	 *
	 * @param string $input
	 * 		The content of the tag
	 * @param array $args
	 * 		Array of attributes in the tag
	 * @param Parser $parser
	 * 		The wiki text parser
	 * @return string
	 * 		The text to be rendered
	 */
	public static function wwsdParserHook($input, $args, $parser) {

		global $smwgHaloIP;
		require_once("$smwgHaloIP/specials/SMWWebService/SMW_WebService.php");

		self::rememberWWSD(WebService::newFromID($parser->getTitle()->getArticleID()));

		$attr = "";
		foreach ($args as $k => $v) {
			$attr .= " ". $k . '="' . $v . '"';
		}
		$completeWWSD =
			"<WebService$attr>".
		$input.
			"</WebService>\n";
			
		$notice = '';
		$name = $parser->mTitle->getText();
		$id = $parser->mTitle->getArticleID();
		$ws = WebService::newFromWWSD($name, $completeWWSD);
		$errors = null;
		$warnings = null;
		if (is_array($ws)) {
			$errors = $ws;
		} else {
			// A web service object was returned. Validate the definition
			// with respect to the WSDL.
			$res = $ws->validateWithWSDL();
			if (is_array($res)) {
				// Warnings were returned
				$warnings = $res;
			}
		}
		$msg = "";
		if ($errors != null || $warnings != null) {
			// Errors within the WWSD => show them as a bullet list
			$ew = $errors ? $errors : $warnings;
			$msg = '<b>'.wfMsg('smw_wws_wwsd_errors').'</b><ul>';
			foreach ($ew as $err) {
				$msg .= '<li>'.$err.'</li>';
			}
			$msg .= '</ul>';
			if ($errors) {
				return "<pre>\n".htmlspecialchars($completeWWSD)."\n</pre><br />". $msg;
			}
		}
		if ($parser->mTitle->getNamespace() == SMW_NS_WEB_SERVICE) {
			// store the WWSD in the database in the hook function <articleSavedHook>.
			self::$mNewWebService = $ws;
		} else {
			// add message: namespace webService needed.
			$notice = "<b>".wfMsg('smw_wws_wwsd_needs_namespace')."</b>";
		}
		return  "<pre>\n".htmlspecialchars($completeWWSD)."\n</pre>".$notice.$msg;
	}

	/**
	 * Stores the previously parsed WWSD in the database. This function is a hook for
	 * 'ArticleSaveComplete.'
	 *
	 * This function also deletes wwsd and cache entries from the db
	 * that are no longer needed.
	 *
	 * @param Article $article
	 * @param User $user
	 * @param string $text
	 * @return boolean true
	 */
	public static function articleSavedHook(&$article, &$user, &$text) {
		// check if an wwsd was change and delete the old wwsd and the
		// related cache entries from the db
		if(WebServiceManager::detectModifiedWWSD(self::$mNewWebService)){
			WebServiceCache::removeWS(self::$mOldWebservice->getArticleID());
			self::$mOldWebservice->removeFromDB();
		}

		if (self::$mNewWebService) {
			self::$mNewWebService->store();
		}
		return true;
	}

	/*
	 * Removes a deleted wwsd and its related cache entries from the database.
	 * This function is a hook for 'ArticleDelete'
	 */
	function articleDeleteHook(&$article, &$user, $reason){
		WebServiceCache::removeWS($article->getID());
		$ws = WebService::newFromID($article->getID());
		if ($ws) {
			$ws->removeFromDB();
		}
		return true;
	}

	/**
	 * Creates the database tables that are used by the web service extension.
	 *
	 */
	public static function initDatabaseTables() {
		global $smwgHaloIP;
		require_once("$smwgHaloIP/specials/SMWWebService/SMW_WSStorage.php");
		WSStorage::getDatabase()->initDatabaseTables();
	}

	/**
	 * this method checks if a wwsd was deleted or modified
	 * and therefore has to be removed from the database
	 *
	 * @param WebService $mNewWebService
	 * @return boolean
	 */
	public static function detectModifiedWWSD($mNewWebService){
		if(self::$mOldWebservice){
			$remove = false;
			if(!$mNewWebService){
				return true;
			}
			if(self::$mOldWebservice->getArticleID() != $mNewWebService->getArticleID()){
				$remove = true;
			} else if(self::$mOldWebservice->getMethod() != $mNewWebService->getMethod()){
				$remove = true;
			} else if(self::$mOldWebservice->getName() != $mNewWebService->getName()){
				$remove = true;
			} else if(self::$mOldWebservice->getParameters() != $mNewWebService->getParameters()){
				$remove = true;
			} else if(self::$mOldWebservice->getProtocol() != $mNewWebService->getProtocol()){
				$remove = true;
			} else if(self::$mOldWebservice->getResult() != $mNewWebService->getResult()){
				$remove = true;
			} else if(self::$mOldWebservice->getURI() != $mNewWebService->getURI()){
				$remove = true;
			}
			return $remove;
		}
		return false;
	}

	public static function rememberWWSD($ws){
		self::$mOldWebservice = $ws;
	}
}

?>
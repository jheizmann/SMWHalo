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
 * Created on 01.03.2007
 *
 * @file
 * @ingroup SMWHaloDataExplorer
 *
 * @defgroup SMWHaloDataExplorer SMWHalo Data Explorer
 * @ingroup SMWHaloSpecials
 *
 * @author Kai K�hn
 */
if (!defined('MEDIAWIKI')) die();


global $IP;
require_once( "$IP/includes/SpecialPage.php" );

define('SMW_OB_COMMAND_ADDSUBCATEGORY', 1);
define('SMW_OB_COMMAND_ADDSUBCATEGORY_SAMELEVEL', 2);
define('SMW_OB_COMMAND_CATEGORY_RENAME', 3);

define('SMW_OB_COMMAND_ADDSUBPROPERTY', 4);
define('SMW_OB_COMMAND_ADDSUBPROPERTY_SAMELEVEL', 5);
define('SMW_OB_COMMAND_PROPERTY_RENAME', 6);

define('SMW_OB_COMMAND_INSTANCE_DELETE', 7);
define('SMW_OB_COMMAND_INSTANCE_CREATE', 10);
define('SMW_OB_COMMAND_INSTANCE_RENAME', 8);

define('SMW_OB_COMMAND_ADD_SCHEMAPROPERTY', 9);
define('SMW_OB_COMMAND_EDITPROPERTY', 10);

define('SMW_OB_COMMAND_CATEGORY_DELETE', 11);
define('SMW_OB_COMMAND_PROPERTY_DELETE', 12);

// standard functions for creating a new special
//function doSMW_OntologyBrowser() {
//		SMW_OntologyBrowser::execute();
//}

//SpecialPage::addPage( new SpecialPage(wfMsg('ontologybrowser'),'',true,'doSMW_OntologyBrowser',false) );


class SMW_OntologyBrowser extends SpecialPage {

	public function __construct() {
		parent::__construct('DataExplorer');
	}
	public function execute($par) {
		global $wgRequest, $wgOut, $wgScriptPath, $wgUser;
		//$skin = $wgUser->getSkin();
		$wgOut->setPageTitle(wfMsg('dataexplorer'));
	
		
		/*ENDLOG*/
		$showMenuBar = $wgUser->isAllowed("ontologyediting");
		// display query browser
		//$spectitle = Title::makeTitle( NS_SPECIAL, wfMsg('ontologybrowser') );
		$refactorstatstitle = Title::makeTitle( NS_SPECIAL, "RefactorStatistics" );
			
		// add another container
		$treeContainer = "";
		$menu = "";
		$switch = "";
		wfRunHooks('smw_ob_add', array(& $treeContainer, & $boxContainer, & $menu, & $switch));

		$html = "<span id=\"OBHelp\">".wfMsg('smw_ob_help')."</span><br>";
		$html .= "<span id=\"OBHint\">".wfMsg('smw_ac_hint') . "</span>\n";
		$html .= "<br><input type=\"text\" size=\"32\" id=\"FilterBrowserInput\" name=\"prefix\" class=\"wickEnabled\" constraints=\"all\"/>";

		$html .= "<button type=\"button\" id=\"filterBrowseButton\" name=\"filterBrowsing\" onclick=\"globalActionListener.filterBrowsing(event, true)\">".wfMsg('smw_ob_filterbrowsing')."</button>";
		$html .= "<button type=\"button\" name=\"refresh\" onclick=\"globalActionListener.reset(event)\">".wfMsg('smw_ob_reset')."</button>";
		$html .= "<button type=\"button\" id=\"hideInstancesButton\" name=\"hideInstances\" onclick=\"instanceActionListener.toggleInstanceBox(event)\">".wfMsg('smw_ob_hideinstances')."</button>";//  <a href=\"".$refactorstatstitle->getFullURL()."\">".wfMsg('smw_ob_link_stats')."</a>";

		$html .= "<div id=\"ontologybrowser\">";

		//TODO: Add the following code to a hook. However, the problem is, that
		// advancedOption.js should also be moved to the Linked Data Extension, but it
		// is used for getting parameters for the ajax calls to smwf_ob_OntologyBrowserAccess().
		$sourceOptions = "";
		$connectionError = "";
		if (defined('LOD_LINKEDDATA_VERSION')) {
			// Check if the triples store is propertly connected.
			$tsa = new LODTripleStoreAccess();
			if (!$tsa->isConnected()) {
				$connectionError = "<div class=\"aoConnectionError\">".wfMsg("smw_ob_ts_not_connected")."</div>";
			}
				
			$ids = LODAdministrationStore::getInstance()->getAllSourceDefinitionIDsAndLabels();
			$sourceOptions = "";
			foreach ($ids as $tuple) {
				list($sourceID, $sourceLabel) = $tuple;
				$sourceOptions .= "<option sourceid=\"$sourceID\" title=\"$sourceID\">$sourceLabel</option>";
			}
		}
		
		// add content bundles
		global $dfgLang;
		$bundleOptions="";
		$contentBundles = smwfGetSemanticStore()->getDirectInstances(Title::newFromText($dfgLang->getLanguageString('df_contentbundle'), NS_CATEGORY));
		foreach($contentBundles as $cb) {
			$bundleOptions .= "<option bundleid=\"".strtolower($cb->getDBkey())."\" title=\"".strtolower($cb->getDBkey())."\">".$cb->getText()."</option>";
		}		
		
		$advancedOptions  = wfMsg("smw_ob_advanced_options");
		$fromWiki         = wfMsg("smw_ob_source_wiki");
		$selectDatasource = wfMsg("smw_ob_select_datasource");
		$selectBundle = wfMsg("smw_ob_select_bundle");
		$selectMultiHint  = wfMsg("smw_ob_select_multiple");

	   $dataSourcesHtml = "";
if (!empty($sourceOptions)) {
$dataSourcesHtml = <<<TEXT
<div style="float: left;">
        <div><b>$selectDatasource</b></div>
        <select id="dataSourceSelector" name="DataSource" size="5" multiple="multiple" class="aoDataSourceSelector">
            <option sourceid="" selected="selected">$fromWiki</option>
            $sourceOptions
        </select>
        </div>
        <div class="OBStaticHint">$selectMultiHint</div>
TEXT;
}

$bundlesHtml = <<<TEXT
<div><div><b>$selectBundle</b></div>
        <select id="bundleSelector" name="Bundles" size="5" class="aoDataSourceSelector">
            <option bundleid="" selected="selected">$fromWiki</option>
            $bundleOptions
        </select>
        </div>
TEXT;

$html .= <<<TEXT
<div id="advancedOptions" class="advancedOptions">
	<div id="aoFoldIcon" class="aoFoldClosed"> </div>
	<span id="aoTitle" class="aoTitle"><b>$advancedOptions</b> </span>
	<div id="aoContent" class="aoContent">
	$connectionError
	    $dataSourcesHtml
		$bundlesHtml
		
	</div>
</div>
TEXT;

// show switch for asserted categories only when TSC is available
$showAssertedCategoriesSwitch="";
if(!smwfIsTripleStoreConfigured()) {
	$showAssertedCategoriesSwitch = 'style="display:none"';
}


			$html .= "
		<!-- Categore Tree hook -->	" .
		"<div id=\"treeContainer\"><span class=\"OB-header\">	
			<img src=\"$wgScriptPath/extensions/SMWHalo/skins/concept.gif\" style=\"margin-bottom: -1px\"></img><a class=\"selectedSwitch treeSwitch\" id=\"categoryTreeSwitch\" onclick=\"globalActionListener.switchTreeComponent(event,'categoryTree')\">".wfMsg('smw_ob_categoryTree')."</a>
			<img src=\"$wgScriptPath/extensions/SMWHalo/skins/property.gif\" style=\"margin-bottom: -1px\"></img><a class=\"treeSwitch\" id=\"propertyTreeSwitch\" onclick=\"globalActionListener.switchTreeComponent(event,'propertyTree')\">".wfMsg('smw_ob_attributeTree')."</a>";
			$html .= $switch;

			$html .= "</span>";
			if ($showMenuBar)
			{
				$html .= "<span class=\"menuBar menuBarTree menuBarcategoryTree\" id=\"menuBarcategoryTree\"><a onclick=\"categoryActionListener.showSubMenu(".SMW_OB_COMMAND_ADDSUBCATEGORY_SAMELEVEL.")\">".wfMsg('smw_ob_cmd_createsubcategorysamelevel')."</a> | <a onclick=\"categoryActionListener.showSubMenu(".SMW_OB_COMMAND_CATEGORY_RENAME.")\">".wfMsg('smw_ob_cmd_editcategory')."</a> | <a onclick=\"categoryActionListener.executeCommand(".SMW_OB_COMMAND_CATEGORY_DELETE.")\">".wfMsg('smw_ob_cmd_deletecategory')."</a><div id=\"categoryTreeMenu\"></div></span>
			<span style=\"display:none;\" class=\"menuBar menuBarTree menuBarpropertyTree\" id=\"menuBarpropertyTree\"><a onclick=\"propertyActionListener.showSubMenu(".SMW_OB_COMMAND_ADDSUBPROPERTY_SAMELEVEL.")\">".wfMsg('smw_ob_cmd_createsubpropertysamelevel')."</a> 
                        | <a onclick=\"propertyActionListener.showSubMenu(".SMW_OB_COMMAND_PROPERTY_RENAME.")\">".wfMsg('smw_ob_cmd_editproperty')."</a>| <a onclick=\"propertyActionListener.executeCommand(".SMW_OB_COMMAND_PROPERTY_DELETE.")\">".wfMsg('smw_ob_cmd_deleteproperty')."</a><div id=\"propertyTreeMenu\"></div></span>";
				$html .= $menu;
			}

			// add containers
			$html .= "<div id=\"categoryTree\" class=\"categoryTreeColors treeContainer\">
		   </div>		
		   <div id=\"propertyTree\" style=\"display:none\" class=\"propertyTreeListColors treeContainer\">
		   </div>";
			$html .= $treeContainer;

			$html .= "<span class=\"OB-filters\"><span>".wfMsg('smw_ob_filter')."</span><input type=\"text\" id=\"treeFilter\"><button type=\"button\" name=\"filterCategories\" onclick=\"globalActionListener.filterTree(event)\">".wfMsg('smw_ob_filter')."</button></span>
		</div>
		
		<!-- Attribute Tree hook -->
				
		<div id=\"leftArrow\" class=\"pfeil\">
			<img src=\"$wgScriptPath/extensions/SMWHalo/skins/OntologyBrowser/images/bigarrow.gif\" onclick=\"globalActionListener.toogleCatInstArrow(event)\" />
		</div>";

			$html .= $boxContainer;

			$html .= "<!-- Instance List hook -->
		<div id=\"instanceContainer\">
		  <span class=\"OB-header\"><img style=\"margin-bottom: -3px\" src=\"$wgScriptPath/extensions/SMWHalo/skins/instance.gif\"></img> ".wfMsg('smw_ob_instanceList')."</span>
		  ".($showMenuBar ? "<span class=\"menuBar menuBarInstance\" id=\"menuBarInstance\"><a onclick=\"instanceActionListener.showSubMenu(".SMW_OB_COMMAND_INSTANCE_CREATE.")\">".wfMsg('smw_ob_cmd_createinstance')."</a> | <a onclick=\"instanceActionListener.showSubMenu(".SMW_OB_COMMAND_INSTANCE_RENAME.")\">".wfMsg('smw_ob_cmd_editinstance')."</a><div id=\"instanceListMenu\"></div></span>" : "")."			
		  <div id=\"instanceList\" class=\"instanceListColors\">
		  </div>
		  <span class=\"OB-filters\"><span>".wfMsg('smw_ob_filter')."</span><input type=\"text\" id=\"instanceFilter\"><button type=\"button\" name=\"filterInstances\" onclick=\"globalActionListener.filterInstances(event)\">".wfMsg('smw_ob_filter')."</button>
		  <div $showAssertedCategoriesSwitch><input type=\"checkbox\" id=\"assertedCategoriesSwitch\" checked=\"true\" $showAssertedCategoriesSwitch/>".wfMsg('smw_ob_onlyAssertedCategories')."</input></div></span>
		</div>
			
		<div id=\"rightArrow\" class=\"pfeil\">
			<img src=\"$wgScriptPath/extensions/SMWHalo/skins/OntologyBrowser/images/bigarrow.gif\" onclick=\"globalActionListener.toogleInstPropArrow(event)\" />
		</div>
				
		<!-- Relation/Attribute Annotation level hook -->
		<div id=\"relattributesContainer\"><span class=\"OB-header\">
			<span><img style=\"margin-bottom: -3px\" src=\"$wgScriptPath/extensions/SMWHalo/skins/property.gif\"></img> ".wfMsg('smw_ob_att')."</span>
			<span id=\"relattValues\">".wfMsg('smw_ob_relattValues')."</span><span id=\"relattRangeType\" style=\"display:none;\">".wfMsg('smw_ob_relattRangeType')."</span></span>
			".($showMenuBar ? "<span class=\"menuBar menuBarProperties\" id=\"menuBarProperties\"><a onclick=\"schemaActionPropertyListener.showSubMenu(".SMW_OB_COMMAND_ADD_SCHEMAPROPERTY.")\">".wfMsg('smw_ob_cmd_addpropertytodomain')."<span id=\"currentSelectedCategory\">...</span>".
			"</a> | <a onclick=\"schemaEditPropertyListener.editSelectedProperty(".SMW_OB_COMMAND_EDITPROPERTY.", this)\">".wfMsg('smw_ob_cmd_editproperty')."</a><div id=\"schemaPropertiesMenu\"></div></span>" : "" )."	
			<div id=\"relattributes\" class=\"propertyTreeListColors\"></div>
			<span class=\"OB-filters\"><span>".wfMsg('smw_ob_filter')."</span><input type=\"text\" size=\"22\" id=\"propertyFilter\"><button type=\"button\" name=\"filterProperties\" onclick=\"globalActionListener.filterProperties(event)\">".wfMsg('smw_ob_filter')."</button>
			<div id=\"propertyRangeSpan\"><div><input type=\"checkbox\" id=\"directPropertySwitch\" checked=\"true\"/>".wfMsg('smw_ob_onlyDirect')."</input></div><div><input type=\"checkbox\" id=\"showForRange\" />".wfMsg('smw_ob_showRange')."</input></div></div></span>		
		</div>		
		<div id=\"OB-filters\">
		
		</div>" .
		"<div id=\"OB-footer\">".wfMsg('smw_ob_footer')."
			
		</div>
		</div>
		";
			$wgOut->addHTML($html);
	}

}


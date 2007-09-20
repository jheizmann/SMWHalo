<?php
/*
 * Created on 20.09.2007
 *
 * Author: kai
 */
 
 if (!defined('MEDIAWIKI')) die();

global $smwgIP;
include_once( "$smwgIP/specials/QueryPages/SMW_QueryPage.php" );

// replace SMW Properties SpecialPage with advanced HALO Properties SpecialPage.
SpecialPage::removePage(wfMsg('properties'));
SpecialPage::addPage(new SpecialPage(wfMsg('properties'),'',true,'smwfDoSpecialProperties',false));

function smwfDoSpecialProperties() {
	wfProfileIn('smwfDoSpecialProperties (SMW)');
	list( $limit, $offset ) = wfCheckLimits();
	$rep = new SMWPropertiesPage();
	$result = $rep->doQuery( $offset, $limit );
	wfProfileOut('smwfDoSpecialProperties (SMW)');
	return $result;
}

class SMWPropertiesPage extends SMWQueryPage {

	function getName() {
		return "Properties";
	}

	function isExpensive() {
		return false;
	}

	function isSyndicated() { return false; }

	function getPageHeader() {
		$html = '<p>' . wfMsg('smw_properties_docu') . "</p><br />\n";
		$specialAttPage = Title::newFromText("Properties", NS_SPECIAL);
		global $wgRequest;
		$sort = $wgRequest->getVal("sort") == NULL ? 0 : $wgRequest->getVal("sort") + 0;
		$type = $wgRequest->getVal("type") == NULL ? 0 : $wgRequest->getVal("type") + 0;
		
		$sortOptions = array(wfMsg('smw_properties_sortalpha'), wfMsg('smw_properties_sortmoddate'),wfMsg('smw_properties_sorttyperange'));
		$propertyType = array(wfMsg('smw_properties_sortdatatype'), wfMsg('smw_properties_sortwikipage'), wfMsg('smw_properties_sortnary'));
		
		$html .= "<form action=\"".$specialAttPage->getFullURL()."\">";
		
		// type of property
 		$html .= 	"<select name=\"type\">";
		$i = 0;
		foreach($propertyType as $option) {
			if ($i == $type) {
		 		$html .= "<option value=\"$i\" selected=\"selected\">$option</option>";
			} else {
				$html .= "<option value=\"$i\">$option</option>";
			}
			$i++;		
		}
 		$html .= 	"</select>";
 		
		// sort options
		$html .= 	"<select name=\"sort\">";
		$i = 0;
		foreach($sortOptions as $option) {
			if ($i == $sort) {
		 		$html .= "<option value=\"$i\" selected=\"selected\">$option</option>";
			} else {
				$html .= "<option value=\"$i\">$option</option>";
			}
			$i++;		
		}
 		$html .= 	"</select>";
 		
 		$html .= 	"<input type=\"submit\" value=\" Go \">";
 		$html .= "</form>";
 		return $html;
	}
	function getSQL() {
		
		// QueryPage uses the value from this SQL in an ORDER clause,
		// so return attribute title in value, and its type in title.
		global $wgRequest;
		$sort = $wgRequest->getVal("sort") == NULL ? 0 : $wgRequest->getVal("sort") + 0;
		$type = $wgRequest->getVal("type") == NULL ? 0 : $wgRequest->getVal("type") + 0;
		
		switch($type) {
			case 0: return $this->getDatatypeProperties($sort);
			case 1: return $this->getWikiPageProperties($sort);
			case 2: return $this->getNaryProperties($sort);
		}
		
	}
	
	function getDatatypeProperties($sort) {
		$NSatt = SMW_NS_PROPERTY;
		$dbr =& wfGetDB( DB_SLAVE );
		$attributes = $dbr->tableName( 'smw_attributes' );
		$pages = $dbr->tableName( 'page' );
		switch($sort) {
			case 0: return "SELECT 'Attributes' as type, 
					{$NSatt} as namespace,
					value_datatype as value,
					attribute_title as title,
					COUNT(*) as count
					FROM $attributes
					GROUP BY attribute_title, value_datatype";
					
			case 1: return "SELECT 'Attributes' as type, 
					{$NSatt} as namespace,
					value_datatype as value,
					attribute_title as title,
					COUNT(*) as count
					FROM $attributes,$pages WHERE attribute_title = page_title
					GROUP BY attribute_title, value_datatype";
					
			case 2: return "SELECT 'Attributes' as type, 
					{$NSatt} as namespace,
					value_datatype as value,
					attribute_title as title,
					COUNT(*) as count
					FROM $attributes
					GROUP BY attribute_title, value_datatype";
		}
	}
	
	function getWikiPageProperties($sort) {
		$NSrel = SMW_NS_PROPERTY;
		$dbr =& wfGetDB( DB_SLAVE );
		$relations = $dbr->tableName( 'smw_relations' );
		$pages = $dbr->tableName( 'page' );
		switch($sort) {
			
			case 0: //fall through
					
			case 1: //fall through
					
			case 2: return "SELECT 'Relations' as type,
					{$NSrel} as namespace,
					r1.relation_title as title,
					r2.object_title as value,
					r2.object_namespace as obns,		
					COUNT(*) as count
					FROM $relations r1,$relations r2,$pages WHERE r1.relation_title = page_title AND r1.relation_title = r2.subject_title and r2.relation_title = 'Has_range_hint'
					GROUP BY r1.relation_title";
		}
	}
	
	function getNaryProperties($sort) {
		$NSrel = SMW_NS_PROPERTY;
		$dbr =& wfGetDB( DB_SLAVE );
		$nary = $dbr->tableName( 'smw_nary' );
		$pages = $dbr->tableName( 'page' );
		switch($sort) {
			case 2: // fall through cause filtering for type makes no sense here
			case 0: return "SELECT 'Nary' as type,
					{$NSrel} as namespace,
					attribute_title as title,
					
					COUNT(*) as count
					FROM $nary
					GROUP BY attribute_title";
					
			case 1: return "SELECT 'Nary' as type,
					{$NSrel} as namespace,
					attribute_title as title,
					
					COUNT(*) as count
					FROM $nary,$pages WHERE attribute_title = page_title
					GROUP BY attribute_title";
					
			
		}
	}
	
	function getOrder() {
		global $wgRequest;
		$sort = $wgRequest->getVal("sort") == NULL ? 0 : $wgRequest->getVal("sort") + 0;
		$type = $wgRequest->getVal("type") == NULL ? 0 : $wgRequest->getVal("type") + 0;
		switch($type) {
			case 0: { switch($sort) {
							case 0: return '';
							case 1: return ' ORDER BY page_touched';
							case 2: return ' ORDER BY value_datatype';
					  } 
					  break;
					}
			case 1: { switch($sort) {
							
							case 0: return '';
							case 1: return ' ORDER BY page_touched';
							case 2: return ' ORDER BY r2.object_title';
					  } 
					  break;
					 }
			case 2: { switch($sort) {
							case 2: // fall through cause filtering for type makes no sense here
							case 0: return '';
							case 1: return ' ORDER BY page_touched';
					  } 
					  break;
					 }
		}
		
	}
	
	function linkParameters() {
		global $wgRequest;
		$sort = $wgRequest->getVal("sort") == NULL ? 0 : $wgRequest->getVal("sort") + 0;
		$type = $wgRequest->getVal("type") == NULL ? 0 : $wgRequest->getVal("type") + 0;
		return array('sort' => $sort, 'type' => $type);
	}
	
	function sortDescending() {
		return false;
	}

	function formatResult( $skin, $result ) {
		global $wgLang, $wgExtraNamespaces, $wgRequest;
		$type = $wgRequest->getVal("type") == NULL ? 0 : $wgRequest->getVal("type") + 0;
		// The attribute title is in value, see getSQL().
		
		// The value_datatype is in title, see getSQL().
		$errors = array();
		if ($result[5]<=5) {
			$errors[] = wfMsg('smw_propertyhardlyused');
		}
		if ($type == 2) { // n-ary
			$attrtitle = Title::makeTitle( SMW_NS_PROPERTY, $result[2] );
			if (!$attrtitle->exists()) {
				$errors[] = wfMsg('smw_propertylackspage');
			}
			$attrlink = $skin->makeLinkObj( $attrtitle, $attrtitle->getText() );
			
			$store = smwfGetStore();
			$typeValues = $store->getSpecialValues($attrtitle, SMW_SP_HAS_TYPE);
			
			$typelink = array();			
			foreach($typeValues as $tv) {
				$typelink[] = $tv->getLongHTMLText($skin);
			}
			
			if (count($typelink) == 0) { // no type defined
				$errors[] = wfMsg('smw_propertylackstype', "Type:Page");
				$typelink[] = "Page"; // default
			}

			return "$attrlink (".$result[5].")" . wfMsg('smw_attr_type_join', implode(";", $typelink)). ' ' . smwfEncodeMessages($errors);
		} if ($type == 1) { 
			$attrtitle = Title::makeTitle( SMW_NS_PROPERTY, $result[2] );
			if (!$attrtitle->exists()) {
				$errors[] = wfMsg('smw_propertylackspage');
			}
			$attrlink = $skin->makeLinkObj( $attrtitle, $attrtitle->getText() );
			$objecttitle = Title::newFromText($result[3]); 
			$objectlink = $skin->makeLinkObj( $objecttitle);
			return "$attrlink (".$result[5].")" . wfMsg('smw_attr_type_join', $objectlink). ' ' . smwfEncodeMessages($errors);
		}else {
			$attrtitle = Title::makeTitle( SMW_NS_PROPERTY, $result[2] );
			if (!$attrtitle->exists()) {
				$errors[] = wfMsg('smw_propertylackspage');
			}
			$attrlink = $skin->makeLinkObj( $attrtitle, $attrtitle->getText() );
			
			$typetitle = smwfGetStore()->getSpecialValues($attrtitle, SMW_SP_HAS_TYPE);
			if (count($typetitle) == 0) {
				$typelink = "Page"; // default
			} else { 
				$typelink = $typetitle[0]->getLongHTMLText($skin);
			}
			return "$attrlink (".$result[5].")" . wfMsg('smw_attr_type_join', $typelink). ' ' . smwfEncodeMessages($errors);
		}
	}

	function getResults($options) {
		$db =& wfGetDB( DB_SLAVE );
		$res = $db->query($this->getSQL().$this->getOrder());
		$result = array();
		while($row = $db->fetchObject($res)) {
			
			$result[] = array($row->type, $row->namespace, $row->title, $row->value, $row->obns, $row->count);
		}
		$db->freeResult($res);
		return $result;
	}
}
?>

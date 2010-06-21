<?php
/**
 * @file
 * @ingroup SMWHaloQueryInterface
 * 
 * @defgroup SMWHaloQueryInterface SMWHalo Query Interface
 * @ingroup SMWHaloSpecials
 * @author Markus Nitsche
 */
if (!defined('MEDIAWIKI')) die();



global $IP;
require_once( $IP . "/includes/SpecialPage.php" );
require_once( "SMW_QIAjaxAccess.php" );

/*
 * Standard class that is resopnsible for the creation of the Special Page
 */
class SMWQueryInterface extends SpecialPage {
    private $imagepath;     // image path for all QI icons
    
	public function __construct() {
		parent::__construct('QueryInterface');
	}
	/*
	 * Overloaded function that is responsible for the creation of the Special Page
	 */
	public function execute() {

		global $wgRequest, $wgOut, $smwgHaloScriptPath;

		$this->imagepath = $smwgHaloScriptPath . '/skins/QueryInterface/images/';

		$wgOut->setPageTitle(wfMsg('smw_queryinterface'));

		$html = '<div id="qicontent">' .
				'<div id="shade" style="display:none"></div>';

		$html .= $this->addQueryDefinition();

        $html .= $this->addResultPart();

		$html .= $this->addAdditionalStuff();

		$html .= '<script type="text/javascript" src="' . $smwgHaloScriptPath .  '/scripts/QueryInterface/qi_tooltip.js"></script>';
		$html .= '</div>';
		$wgOut->addHTML($html);
	}

    private function addQueryDefinition() {
        /*
         * <span class="'.(($collapsed) ? 'qiSectionClosed' : 'qiSectionOpen').'"
                      onclick="qihelper.sectionCollapse(\'querylayout\')>'.wfMsg('smw_qi_layout_manager').'</span>
         */
		$html = '<div id="definitiontitle" onclick="qihelper.switchDefinition()" onmouseover="Tip(\'' . wfMsg('smw_qi_tt_qlm') . '\')"><a id="definitiontitle-link" class="minusplus" href="javascript:void(0)"></a>' . wfMsg('smw_qi_section_definition') . '</div>
                 <div id="qiquerydefinition">
                 <div id="qiaddbuttons" class="qiaddbuttons">' .
					'<button onclick="qihelper.newCategoryDialogue(true)" onmouseover="Tip(\'' . wfMsg('smw_qi_tt_addCategory') . '\')">' . wfMsg('smw_qi_add_category') . '</button>'.
					'<button onclick="qihelper.newPropertyDialogue(true)" onmouseover="Tip(\'' . wfMsg('smw_qi_tt_addProperty') . '\')">' . wfMsg('smw_qi_add_property') . '</button>'.
                    '<button onclick="qihelper.newInstanceDialogue(true)" onmouseover="Tip(\'' . wfMsg('smw_qi_tt_addInstance') . '\')">' . wfMsg('smw_qi_add_instance') . '</button>'.
                '</div><br/<br/>'.
                $this->addDragbox().
                $this->addTabHeaderForQIDefinition().
                '</div>';
        return $html;
    }

    private function addTabHeaderForQIDefinition() {
        $html = '<div id="qiDefTab"><table>
                 <tr>
                 <td id="qiDefTab1" class="qiDefTabActive" onclick="qihelper.switchTab(1);"
                     onmouseover="Tip(\'' . wfMsg('smw_qi_tt_treeview') . '\')">'.wfMsg('smw_qi_queryastree').'</td>
                 <td class="qiDefTabSpacer"> </td>'.
                 /*
                 <td id="qiDefTab2" class="qiDefTabInactive" onclick="qihelper.switchTab(2);"
                     onmouseover="Tip(\'' . wfMsg('smw_qi_tt_textview') . '\')">'.wfMsg('smw_qi_queryastext').'</td>
                 <td class="qiDefTabSpacer" width="100%">&nbsp;</td> */
                 '
                 <td id="qiDefTab3" class="qiDefTabInactive" onclick="qihelper.switchTab(3);"
                     onmouseover="Tip(\'' . wfMsg('smw_qi_tt_showAsk') . '\')">'.wfMsg('smw_qi_querysource').'</td>
                 <td class="qiDefTabSpacer" width="100%">&nbsp;</td>
                 </tr>
                 <tr>
                 <td class="qiDefTabContent" colspan="5" style="height:100%">'.
                 $this->addTreeView().
                '<div id="qitextview">Query as text</div>
                 <div id="qisource"><textarea id="fullAskText" onchange="qihelper.sourceChanged=1"></textarea>'.
                '<button onclick="qihelper.updatePreview(true)" onmouseover="Tip(\'' . wfMsg('smw_qi_tt_update') . '\')">' . wfMsg('smw_qi_update') . '</button>'.
                '&nbsp;<span class="qibutton" onclick="qihelper.showFullAsk(\'parser\', false);">' . wfMsg('smw_qi_discard_changes') . '</span>&nbsp;' .
                '</div>
                 </td></tr></table></div>
        ';
        return $html;
    }
    /**
     * Return html code for treeview of query.
     * 
     * @return string html
     */
	private function addTreeView() {
		return '<div id="treeview">' .
                    '<div id="treeanchor">' .
                        '<div id="qitreedummy"></div>' .
                    '</div>' .
				'</div>';		
	}

	private function addDragbox() {
		global $smwgHaloScriptPath;

		return '<div id="dragbox" class="dragbox">' .
					'<div id="boxcontent" class="boxcontent">' .
                        '<div id="treeviewbreadcrumbs"></div>' .
                        '<div id="qistatus"></div>' .
                        '<div style="height:80%; overflow:auto">' .
                            '<table><tbody id="dialoguecontent"></tbody></table>' .
                        '</div>' .
						'<div id="dialoguebuttons" style="display:none; width: 100%">' .
							'<button onclick="qihelper.add()">' . wfMsg('smw_qi_add') . '</button>&nbsp;' .
                            '<span style="text-align:right">' .
                                '<span class="qibutton" onclick="qihelper.emptyDialogue()">' . wfMsg('smw_qi_cancel') . '</span>&nbsp;' .
                                '<span id="qidelete" style="display:none" class="qibutton" onclick="qihelper.deleteActivePart()">' . wfMsg('smw_qi_delete') . '</span>' .
                            '</span>' .
						'</div>' .
					'</div>' .
				'</div>';
	}

    private function addResultPart() {
        $html = '<div id="qiresulttitle" onclick="qihelper.switchResult()" onmouseover="Tip(\'' . wfMsg('smw_qi_tt_qlm') . '\')"><a id="qiresulttitle-link" class="minusplus" href="javascript:void(0)"></a>' . wfMsg('smw_qi_section_result') . '</div>'.
                '<div id="qiresultcontent">'.
                $this->addPreviewResults().
                $this->addQueryLayout().
                '</div>';
        return $html;
    }

	private function addQueryLayout() {

		global $smwgResultFormats;

		$blacklist = array("rss", "json", "exceltable", "icalendar", "vcard", "calendar", "ofc", "exhibit", "debug", "template", "aggregation");

		$resultoptionshtml = "";
        
		reset($smwgResultFormats);
		while (current($smwgResultFormats)) {
			if (!in_array(key($smwgResultFormats), $blacklist)) {
				$resultoptionshtml .= '<option value="'.key($smwgResultFormats).'">'.key($smwgResultFormats).'</option>';
			}
			next($smwgResultFormats);
		}

		return '<div id="querylayout">
					<div id="layouttitle" onclick="qihelper.switchlayout()" onmouseover="Tip(\'' . wfMsg('smw_qi_tt_qlm') . '\')"><a id="layouttitle-link" class="plusminus" href="javascript:void(0)"></a>' . wfMsg('smw_qi_layout_manager') . '</div>
					<div id="layoutcontent" style="display:none">
                        <table summary="Layout Manager for query">
                            <tr>
        						<td width="50%" onmouseover="Tip(\'' . wfMsg('smw_qi_tt_format') . '\')">
                					Format: <select id="layout_format" onchange="qihelper.checkFormat()">
                                    '. $resultoptionshtml .'
                                    </select>
                                </td>
                                <td onmouseover="Tip(\'' . wfMsg('smw_qi_tt_sort') . '\') ">
                                    Sort by: <select id="layout_sort" onchange="qihelper.updatePreview()">
                                    </select>
                                </td>
                            </tr>
                        </table>
                    </div>
                    <div id="queryprinteroptions" style="display:none"></div>
                </div>';
	}

	private function addPreviewResults() {
		return '<div id="previewlayout">
					<div id="previewtitle" onclick="qihelper.switchpreview()" onmouseover="Tip(\'' . wfMsg('smw_qi_tt_prp') . '\')"><a id="previewtitle-link" class="minusplus" href="javascript:void(0)"></a>' . wfMsg('smw_qi_preview_result') . '</div>
					<div id="previewcontent"></div>
                </div>';
	}

	private function addAdditionalStuff() {
		global $smwgHaloScriptPath, $smwgWebserviceEndpoint;
		wfRunHooks("QI_AddButtons", array (&$buttons));

		$imagepath = $smwgHaloScriptPath . '/skins/QueryInterface/images/';
		$useTS = "";
		if (isset($smwgWebserviceEndpoint)) {
			$useTS = '<input class="btn" type="checkbox" id="usetriplestore">' . wfMsg('smw_qi_usetriplestore') . '</input>';
		}
		return '<div id="qimenubar">' .
		//'<span class="qibutton" onclick="qihelper.showLoadDialogue()">' . wfMsg('smw_qi_load') . '</span><span style="color:#C0C0C0">&nbsp;|&nbsp;</span>' .
		//'<span class="qibutton" onclick="qihelper.showSaveDialogue()">' . wfMsg('smw_qi_save') . '</span><span style="color:#C0C0C0">&nbsp;|&nbsp;</span>' .
		//'<span class="qibutton" onclick="qihelper.exportToXLS()">' . wfMsg('smw_qi_exportXLS') . '</span>' .
		//'<button class="btn" onclick="qihelper.previewQuery()" onmouseover="this.className=\'btn btnhov\'; Tip(\'' . wfMsg('smw_qi_tt_preview') . '\')" onmouseout="this.className=\'btn\'">' . wfMsg('smw_qi_preview') . '</button>'.
						'<button class="btn" onclick="qihelper.copyToClipboard()" onmouseover="this.className=\'btn btnhov\'; Tip(\'' . wfMsg('smw_qi_tt_clipboard') . '\')" onmouseout="this.className=\'btn\'">' . wfMsg('smw_qi_clipboard') . '</button>'.
		$buttons.
		$useTS.
						'<span><button class="btn" onclick="qihelper.resetQuery()" onmouseover="this.className=\'btn btnhov\'; Tip(\'' . wfMsg('smw_qi_tt_reset') . '\')" onmouseout="this.className=\'btn\'">' . wfMsg('smw_qi_reset') . '</button></span>'.
					'</div>'.

				'<div id="fullpreviewbox" style="display:none">'.
				'<div id="fullpreview"></div>'.
				'<span class="qibutton" onclick="$(\'fullpreviewbox\', \'shade\').invoke(\'toggle\')"><img src="'. $imagepath. 'delete.png"/>' . wfMsg('smw_qi_close_preview') . '</span></div>'.
				'</div>'.

				'<div id="resetdialogue" class="topDialogue" style="display:none">' .
						'Do you really want to reset your query?<br/>' .
						'<span class="qibutton" onclick="qihelper.doReset()">' . wfMsg('smw_qi_confirm') . '</span>&nbsp;<span class="qibutton" onclick="$(\'resetdialogue\', \'shade\').invoke(\'toggle\')">' . wfMsg('smw_qi_cancel') . '</span>' .
						'</div>'.

				'<div id="showAsk" class="topDialogue" style="display:none;">' .
						'<span id="showParserAskButton" class="qibutton">' . wfMsg('smw_qi_parserask') . '</span><br/><hr/>' .
						'<div><textarea id="fullAskTextOld" rows="10" readonly></textarea></div>' .
						'<span class="qibutton" onclick="$(\'showAsk\', \'shade\').invoke(\'toggle\')">' . wfMsg('smw_qi_close') . '</span>' .
						'</div>'.

				'<div id="savedialogue" class="topDialogue" style="display:none">' .
						'Please enter a query name:<br/>' .
						'<input type="text" id="saveName"/><br/>' .
						'<span class="qibutton" onclick="qihelper.doSave()">' . wfMsg('smw_qi_confirm') . '</span>&nbsp;<span class="qibutton" onclick="$(\'savedialogue\', \'shade\').invoke(\'toggle\')">' . wfMsg('smw_qi_cancel') . '</span>' .
						'</div>';		
	}

}


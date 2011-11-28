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
 * obSemToolContribution.js
 * @file
 * @ingroup SMWHaloSpecials
 * @ingroup SMWHaloDataExplorer
 * 
 * @author Kai K�hn
 *
 * Contributions from OntologyBrowser for Semantic Toolbar
 */


var OBSemanticToolbarContributor = Class.create();
OBSemanticToolbarContributor.prototype = {
	initialize: function() {

		this.textArea = null; // will be initialized properly in registerContributor method.
		this.l1 = this.selectionListener.bindAsEventListener(this);
		this.l2 = this.selectionListener.bindAsEventListener(this);
		this.l3 = this.selectionListener.bindAsEventListener(this);
		this.editInterface = null;
		if(!document.gEditInterface)
			gEditInterface = new SMWEditInterface();
	},

	/**
	 * Register the contributor and puts a button in the semantic toolbar.
	 */
	initToolbox: function() {
		if (!stb_control.isToolbarAvailable() ||
			(wgAction != 'edit' && wgAction != 'formedit' && wgAction != 'submit' &&
			 wgCanonicalSpecialPageName != 'AddData' &&
			 wgCanonicalSpecialPageName != 'EditData' &&
			 wgCanonicalSpecialPageName != 'FormEdit') ||
			(typeof FCKeditor != 'undefined' || typeof CKEDITOR != 'undefined')
			) {
			return;
		}
		this.comsrchontainer = stb_control.createDivContainer(CBSRCHCONTAINER, 0);
		this.comsrchontainer.setHeadline(gLanguage.getMessage('ONTOLOGY_BROWSER'));

		this.comsrchontainer.setContent(this.getOBLink(false));
		this.comsrchontainer.contentChanged();

		// register standard wiki edit textarea (advanced editor registers by itself)
		if (typeof FCKeditor == 'undefined')
		    this.activateTextArea("wpTextbox1");

	},


	activateTextArea: function(id) {
		if (this.textArea) {
			Event.stopObserving(this.textArea, 'select', this.l1);
			Event.stopObserving(this.textArea, 'mouseup', this.l2);
			Event.stopObserving(this.textArea, 'keyup', this.l3);
		}
		this.textArea = (typeof FCKeditor == 'undefined') ? $(id) : id;
		if (this.textArea) {
			Event.observe(this.textArea, 'select', this.l1);
			Event.observe(this.textArea, 'mouseup', this.l2);
			Event.observe(this.textArea, 'keyup', this.l3);
			// intially disabled
			//if ($("openEntityInOB") != null) Field.disable("openEntityInOB");
			if (this.comsrchontainer) {
				this.comsrchontainer.setContent(this.getOBLink(false));
				this.comsrchontainer.contentChanged();
			}
		}
	},

	/**
	 * Called when the selection changes
	 */
	selectionListener: function(event) {
		if ($("openEntityInOB") == null) return;
		//if (!GeneralBrowserTools.isTextSelected(this.textArea)) {
		if (! gEditInterface.getSelectedText() ||
		    gEditInterface.getSelectedText().length == 0){
			// unselected
			this.comsrchontainer.setContent(this.getOBLink(false));
			this.comsrchontainer.contentChanged();
			//Field.disable("openEntityInOB");
			//$("openEntityInOB").innerHTML = "" + gLanguage.getMessage('MARK_A_WORD');
			gEditInterface.focus();
		} else {
			// selected
			this.comsrchontainer.setContent(this.getOBLink(true));
			this.comsrchontainer.contentChanged();
			//Field.enable("openEntityInOB");
			//$("openEntityInOB").innerHTML = "" + gLanguage.getMessage('OPEN_IN_OB');
			gEditInterface.focus();
		}
	},

	/**
	 * Navigates to the OntologyBrowser with ns and title
	 */
	navigateToOB: function(path, newWindow) {
		//var selectedText = GeneralBrowserTools.getSelectedText(this.textArea);
		var selectedText = gEditInterface.getSelectedText();
		if (selectedText == '') {
			return;
		}
		var localURL = selectedText.split(":");
		if (localURL.length == 1) {
			// no namespace
			var queryString = 'searchTerm='+encodeURI(localURL[0]);
		} else {
			var queryString = 'ns='+localURL[0]+'&title='+encodeURI(localURL[1]);
		}

		
		var ontoBrowserSpecialPage = wgArticlePath.replace(/\$1/, path+'?'+queryString);
		if (newWindow == true)
			window.open(wgServer + ontoBrowserSpecialPage, "");
		else
			window.location.href = wgServer + ontoBrowserSpecialPage;
	},

	getOBLink: function(active) {
		if (active) {
			return '<a ' +
				'id="openEntityInOB" class="menulink"' +
				'href="javascript:obContributor.navigateToOB(\''
				     + gLanguage.getMessage('NS_SPECIAL') 
				     + ":"
				     + gLanguage.getMessage('OB_ID')
				     +'\', false)">' +
				gLanguage.getMessage('OPEN_IN_OB') +
				'</a>' +
				'<a ' +
				'id="openEntityInOB" class="menulink"' +
				'href="javascript:obContributor.navigateToOB(\''
				     + gLanguage.getMessage('NS_SPECIAL') 
				     + ":"
				     + gLanguage.getMessage('OB_ID')
				     +'\', true)">' +
				gLanguage.getMessage('OPEN_IN_OB_NEW_TAB') +
				'</a>';
		} else {
			return '<span ' +
				'id="openEntityInOB">' +
				gLanguage.getMessage('MARK_A_WORD') +
				'</span>';
		}
	}


}

// create instance of contributor and register on load event so that the complete document is available
// when registerContributor is executed.
window.obContributor = new OBSemanticToolbarContributor();
stb_control.registerToolbox(obContributor);

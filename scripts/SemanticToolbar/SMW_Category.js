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
 * @file
 * @ingroup SMWHaloSemanticToolbar
 * @author: Thomas Schweitzer
 */


var SMW_CAT_VALID_CATEGORY_NAME =
	'smwValidValue="^[^<>\|!&$%&=\?]{1,255}$: valid ' +
		'? (color: white, hideMessage, valid:true) ' +
	 	': (color: red, showMessage:CATEGORY_NAME_TOO_LONG, valid:false)" ';

var SMW_CAT_CHECK_CATEGORY = 
	'smwCheckType="category: exists ' +
		'? (color: lightgreen, hideMessage, valid:true, attribute:catExists=true) ' +
	 	': (color: orange, showMessage:CATEGORY_DOES_NOT_EXIST, valid:true, attribute:catExists=false)" ';

var SMW_CAT_CHECK_CATEGORY_CREATE = 
	'smwCheckType="category: exists ' +
		'? (color: lightgreen, hideMessage, valid:true, attribute:catExists=true, hide:cat-addandcreate, show:cat-confirm) ' +
	 	': (color: orange, showMessage:CATEGORY_DOES_NOT_EXIST, valid:true, attribute:catExists=false, show:cat-confirm, show:cat-addandcreate)" ';

var SMW_CAT_CHECK_CATEGORY_IIE = // Invalid if exists
	'smwCheckType="category:exists ' +
		'? (color: red, showMessage:CATEGORY_ALREADY_EXISTS, valid:false) ' +
	 	': (color: lightgreen, hideMessage, valid:true)" ';

var SMW_CAT_CHECK_EMPTY = 
	'smwCheckEmpty="empty' +
		'? (color:red, showMessage:MUST_NOT_BE_EMPTY, valid:false) ' +
		': (color:white, hideMessage)"';

var SMW_CAT_CHECK_EMPTY_CM = 
	'smwCheckEmpty="empty' +
		'? (color:red, showMessage:MUST_NOT_BE_EMPTY, valid:false, hide:cat-confirm, hide:cat-addandcreate) ' +
		': (color:white, hideMessage)"';

var SMW_CAT_ALL_VALID =	
	'smwAllValid="allValid ' +
 		'? (show:cat-confirm, hide:cat-invalid) ' +
 		': (show:cat-invalid, hide:cat-confirm, hide:cat-addandcreate)"';
 		
var SMW_CAT_ALL_VALID_ANNOTATED =	
	'smwAllValid="allValid ' +
 		'? (show:cat-confirm, call:catToolBar.finalCategoryCheck) ' +
 		': (hide:cat-confirm, hide:cat-addandcreate, call:catToolBar.finalCategoryCheck)"';

var SMW_CAT_HINT_CATEGORY =
	'constraints = "namespace:' + SMW_CATEGORY_NS + '" position="fixed"';

var SMW_CAT_SUB_SUPER_CHECK_CATEGORY = 
	'smwCheckType="category: exists ' +
		'? (color: lightgreen, hideMessage, valid:true, attribute:catExists=true) ' +
	 	': (color: orange, hideMessage, valid:true, attribute:catExists=false)" ';

var SMW_CAT_SUB_SUPER_ALL_VALID =	
	'smwAllValid="allValid ' +
 		'? (call:catToolBar.createSubSuperLinks) ' +
 		': (call:catToolBar.createSubSuperLinks)"';
 		

var CategoryToolBar = Class.create();

CategoryToolBar.prototype = {

initialize: function() {
    //Reference
    this.genTB = new GenericToolBar();
	this.toolbarContainer = null;
	this.showList = true;
	this.currentAction = "";
},

showToolbar: function(){
	this.categorycontainer.setHeadline(gLanguage.getMessage('CATEGORIES'));
	if (wgAction == 'edit' || wgAction == 'formedit' || wgAction == 'submit' ||
            wgCanonicalSpecialPageName == 'AddData' || wgCanonicalSpecialPageName == 'EditData' ||
            wgCanonicalSpecialPageName == 'FormEdit' ) {
		// Create a wiki text parser for the edit mode. In annotation mode,
		// the mode's own parser is used.
		this.wtp = new WikiTextParser();
	}
	this.om = new OntologyModifier();
	this.fillList(true);
},

initToolbox: function(){
	if ((wgAction == "edit" || wgAction == "annotate" || wgAction == 'formedit' || wgAction == 'submit' ||
             wgCanonicalSpecialPageName == 'AddData' || wgCanonicalSpecialPageName == 'EditData' ||
             wgCanonicalSpecialPageName == 'FormEdit' )
	    && typeof stb_control != 'undefined' && stb_control.isToolbarAvailable()){
		this.categorycontainer = stb_control.createDivContainer(CATEGORYCONTAINER,0);
		this.showToolbar();
	}
},

fillList: function(forceShowList) {
	if (forceShowList == true) {
		this.showList = true;
	}
	if (!this.showList) {
		return;
	}
	if (this.wtp) {
		this.wtp.initialize();
		var categories = this.wtp.getCategories();
		var cats = '';
		var delim = '';
		for (var i = 0; i < categories.length; ++i) {
			cats += gLanguage.getMessage('CATEGORY_NS') + categories[i].getName()+',';
		}
		cats = cats.substr(0, cats.length-1);

		if (cats.length > 0 && cats != this.categoriesForExistenceCheck) {
			// Check if categories are already defined
			this.categoriesForExistenceCheck = cats;
			this.recommendedRelsNeedRefresh = true;
			sajax_do_call('smwf_om_ExistsArticleMultiple',
						[cats],
						checkCategoryExistCallback.bind(this),
						categories);
		}
		if (this.categoryExists
			&& this.categoryExists.length == categories.length) {
			for (var i = 0; i < categories.length; ++i) {
				categories[i].exists = this.categoryExists[i][1];
			}
		}
		if( wgNamespaceNumber === 14 ) {
			// special handling for category pages
			if( cats.length > 0 ) {
				delim = ', ';
			}
			cats += delim + gLanguage.getMessage( 'CATEGORY_NS' ) + 'Category';
			this.recommendedRelsNeedRefresh = true;
		}
		if( cats.length > 0 && this.recommendedRelsNeedRefresh ) {
			this.recommendedRelsNeedRefresh = false;
			// Get all properties with that have one of the annotated categories as domain
			sajax_do_call('smwf_om_getDomainProperties',
						[cats],
						getDomainPropertiesCallback.bind(this),
						'');
		}
		if ( cats.length == 0 ) {
			// reset rec relations when there's no cat annotation left
			this.recommendedRels = new Array();
			this.recommendedRelsNeedRefresh = true;
		}

		this.categorycontainer.setContent(this.genTB.createList(categories,"category"));
		this.categorycontainer.contentChanged();
	}
	

	/**
	 * Closure:
	 * Callback function that gets the results of the check for existence of categories.
	 */
	function checkCategoryExistCallback(request) {
	
		if (request.status != 200) {
			// call for schema data failed, do nothing.
			return;
		}
	
		var existence = request.responseText.evalJSON(true);
		this.categoryExists = existence;

		for (var i = 0; i < categories.length; ++i) {
			categories[i].exists = existence[i][1];
		}
		this.categorycontainer.setContent(this.genTB.createList(categories,"category"));
		this.categorycontainer.contentChanged();
		refreshSTB.refreshToolBar();
	};
	
	/**
	 * Closure:
	 * Callback function that gets the results of the domain properties request.
	 */
	function getDomainPropertiesCallback(request) {
	
		if (request.status != 200) {
			// call for domain properties data failed, do nothing.
			return;
		}
		// {propText, inherited?, [inheritChain]}
		var recRels = request.responseText.evalJSON(true);

		this.recommendedRels = new Array();
		for( var i = 0, n = recRels.length-1; i <= n; i++ ) {
			var val = '';
			if( recRels[i].inherited == 'true' ) {
				var val = recRels[i].inheritLink.join(' >> ');
			}
			var recRel = new WtpRelation( '', 0, 0, this.wtp, '',
				recRels[i].propText, val, '', '', null );
			recRel.inherited = recRels[i].inherited == 'true' ? true : false;
			this.recommendedRels.push(recRel);
		}
		relToolBar.fillList()
	};
},

/**
 * @public 
 * 
 * Sets the wiki text parser <wtp>.
 * @param WikiTextParser wtp 
 * 		The parser that is used for this toolbar container.	
 * 
 */
setWikiTextParser: function(wtp) {
	this.wtp = wtp;
},

cancel: function(){
	/*STARTLOG*/
    smwhgLogger.log("","STB-Categories",this.currentAction+"_canceled");
	/*ENDLOG*/
	this.currentAction = "";
	this.toolbarContainer.hideSandglass();
	this.toolbarContainer.release();
	this.toolbarContainer = null;
	this.fillList(true);
},

enableAnnotation: function(enable) {
	if ($('cat-menu-annotate')) {
		var enabled = $('cat-menu-annotate').readAttribute('enabled') == 'true';
		if (enable == enabled) {
			return;
		}
		if (enable) {
//		$('cat-menu-annotate').show();
			$('cat-menu-annotate').replace(
				'<a id="cat-menu-annotate" enabled="true" href="javascript:catToolBar.newItem()" class="menulink">'
				+ gLanguage.getMessage('ANNOTATE')
				+ '</a>');
		} else {
//			$('cat-menu-annotate').hide();
			$('cat-menu-annotate').replace(
				'<span id="cat-menu-annotate" enabled="false" class="menulink" style="color:grey">&nbsp;'
				+ gLanguage.getMessage('ANNOTATE')
				+ '</span>');
		}
	}
},

/**
 * Creates a new toolbar for the category container with the standard menu.
 * Further elements can be added to the toolbar. Call <finishCreation> after the
 * last element has been added.
 * 
 * @param string attributes
 * 		Attributes for the new container
 * @return 
 * 		A new toolbar container
 */
createToolbar: function(attributes) {
	if (this.toolbarContainer) {
		this.toolbarContainer.release();
	}
	
	this.toolbarContainer = new ContainerToolBar('category-content',600,this.categorycontainer);
	var tb = this.toolbarContainer;
	tb.createContainerBody(attributes);
	
	return tb;
},

/**
 * Creates the content of a <contextMenuContainer> for annotating a category.
 * 
 * @param ContextMenuFramework contextMenuContainer
 * 		The container of the context menu.
 * @param {string} name
 * 		Name of the category. If not specified, the current selection in the
 * 		editor will be used.
 * @param bool editCategory
 * 		If true, an existing category is to be edited
 * @param {function} confirmFunction
 * 		An optional function that is called after the operation of the toolbar
 * 		was completed
 */
createContextMenu: function(contextMenuContainer, name, editCategory, confirmFunction) {
	if (this.toolbarContainer) {
		this.toolbarContainer.release();
	}
	this.confirmFunction = confirmFunction ? confirmFunction : null;
	this.toolbarContainer = new ContainerToolBar('category-content',600,contextMenuContainer);
	var tb = this.toolbarContainer;
	tb.createContainerBody(SMW_CAT_ALL_VALID_ANNOTATED, CATEGORYCONTAINER, gLanguage.getMessage('ANNOTATE_CATEGORY'));

	this.currentAction = "annotate";
	
	this.wtp.initialize();
	var selection = name ? name : this.wtp.getSelection(true);
	selection = selection.replace(/'''''/g,''); // replace bold&italic
	selection = selection.replace(/'''/g,'');   // replace bold
	selection = selection.replace(/''/g,'');    // replace italic
	
	/*STARTLOG*/
        if (smwhgLogger) smwhgLogger.log(selection,"STB-Categories","annotate_clicked");
	/*ENDLOG*/

	tb.append(tb.createInput('cat-name', 
							 gLanguage.getMessage('CATEGORY'), '', '',
	                         SMW_CAT_CHECK_CATEGORY_CREATE +
	                         SMW_CAT_CHECK_EMPTY_CM +
	                         SMW_CAT_VALID_CATEGORY_NAME +
	                         SMW_CAT_HINT_CATEGORY,
	                         true));
	tb.setInputValue('cat-name',selection);	                         
	tb.append(tb.createText('cat-name-msg', 
							gLanguage.getMessage('ENTER_NAME'), '' , true));
					
	var label = gLanguage.getMessage(editCategory ? 'CHANGE' : 'ADD');
	var append = editCategory ? 'false' : 'true';
	var links = 
		[
			['catToolBar.addItem(false,'+append+')',
			 label, 'cat-confirm',
			 gLanguage.getMessage('INVALID_VALUES'), 'cat-invalid'
			],
			['catToolBar.addItem(true,'+append+')',
			 gLanguage.getMessage('ADD_AND_CREATE_CAT'), 
			 'cat-addandcreate'
			]
		];
	tb.append(tb.createLink('cat-links', links, '', true));
				
	tb.finishCreation();
	$('cat-addandcreate').hide();
	gSTBEventActions.initialCheck($("category-content-box"));
},

/**
 * This method is called, when the name of a category has been changed in the
 * input field of the context menu. If the category is already annotated in the
 * wiki text, the links for adding the category are hidden.
 * 
 * @param string target
 * 		ID of the element, on which the change event occurred.
 */
finalCategoryCheck: function(target) {
	var catName = $('cat-name').value;
	var cat = this.wtp.getCategory(catName);
	if (cat) {
		gSTBEventActions.performSingleAction('showmessage', 
                                                     'CATEGORY_ALREADY_ANNOTATED',
					             $('cat-name'));
		gSTBEventActions.performSingleAction('hide', 'cat-confirm');			
		gSTBEventActions.performSingleAction('hide', 'cat-addandcreate');			
	}
},

/**
 * Annotate a category in the article as specified in the input field with id 
 * 'cat-name'.
 * 
 * @param boolean create
 * 		If <true>, the category is created, if it does not already exist.
 * @param boolean append
 * 		If <true>, the category annotation is appended to the wiki text, otherwise
 * 		the current selection is replaced.
 */
addItem: function(create, append) {
	var catName = $("cat-name");
	/*STARTLOG*/
    smwhgLogger.log(catName.value,"STB-Categories","annotate_added");
	/*ENDLOG*/
	this.wtp.initialize();
	var name = catName.value;
	this.wtp.addCategory(name, append);
	this.fillList(true);
	
	// Create the category, if it does not exist.
	if (create && catName.getAttribute("catexists") == "false") {
		this.om.createCategory(name, "");
		/*STARTLOG*/
	    smwhgLogger.log(name,"STB-Categories","create_added");
		/*ENDLOG*/
	}
	if (this.confirmFunction) {
		this.confirmFunction();
		this.confirmFunction = null;
	}
},

newItem: function() {

	this.showList = false;
	this.currentAction = "annotate";
	
    this.wtp.initialize();
	var selection = this.wtp.getSelection(true);
	
	/*STARTLOG*/
    smwhgLogger.log(selection,"STB-Categories","annotate_clicked");
	/*ENDLOG*/

	var tb = this.createToolbar(SMW_CAT_ALL_VALID_ANNOTATED);	
	if (wgAction == 'edit') {
		tb.append(tb.createText('cat-help-msg', 
		                        gLanguage.getMessage('ANNOTATE_CATEGORY'),
		                        '' , true));
	}
	tb.append(tb.createInput('cat-name', 
							 gLanguage.getMessage('CATEGORY'), '', '',
	                         SMW_CAT_CHECK_CATEGORY_CREATE +
	                         SMW_CAT_CHECK_EMPTY_CM +
	                         SMW_CAT_VALID_CATEGORY_NAME +
	                         SMW_CAT_HINT_CATEGORY,
	                         true));
	tb.setInputValue('cat-name',selection);	                         
	tb.append(tb.createText('cat-name-msg', 
							gLanguage.getMessage('ENTER_NAME'), '' , true));
	var links = [['catToolBar.addItem(false)',gLanguage.getMessage('ADD'), 'cat-confirm',
	                                     gLanguage.getMessage('INVALID_VALUES'), 'cat-invalid'],
				 ['catToolBar.addItem(true)',gLanguage.getMessage('ADD_AND_CREATE_CAT'), 'cat-addandcreate'],
				 ['catToolBar.cancel()', gLanguage.getMessage('CANCEL')]
				];
	tb.append(tb.createLink('cat-links', links, '', true));
				
	tb.finishCreation();
	$('cat-addandcreate').hide();
	gSTBEventActions.initialCheck($("category-content-box"));
	//Sets Focus on first Element
	setTimeout("$('cat-name').focus();",50);
},


CreateSubSup: function() {
	this.currentAction = "sub/super-category";
	this.showList = false;
	
    this.wtp.initialize();
	var selection = this.wtp.getSelection(true);
	
	/*STARTLOG*/
    smwhgLogger.log(selection,"STB-Categories","sub/super-category_clicked");
	/*ENDLOG*/

	var tb = this.createToolbar(SMW_CAT_SUB_SUPER_ALL_VALID);	
	tb.append(tb.createText('cat-help-msg', gLanguage.getMessage('DEFINE_SUB_SUPER_CAT'), '' , true));
	tb.append(tb.createInput('cat-subsuper', gLanguage.getMessage('CATEGORY'),
	                         '', '',
	                         SMW_CAT_SUB_SUPER_CHECK_CATEGORY +
	                         SMW_CAT_CHECK_EMPTY +
	                         SMW_CAT_HINT_CATEGORY,
	                         true));
	tb.setInputValue('cat-subsuper',selection);	                         
	tb.append(tb.createText('cat-subsuper-msg', gLanguage.getMessage('ENTER_NAME'), '' , true));
	
	tb.append(tb.createLink('cat-make-sub-link', 
	                        [['catToolBar.createSubItem()', gLanguage.getMessage('CREATE_SUB'), 'cat-make-sub']], 
	                        '', false));
	tb.append(tb.createLink('cat-make-super-link', 
	                        [['catToolBar.createSuperItem()', gLanguage.getMessage('CREATE_SUPER'), 'cat-make-super']],
	                        '', false));
	
	var links = [['catToolBar.cancel()', gLanguage.getMessage('CANCEL')]];
	tb.append(tb.createLink('cat-links', links, '', true));
				
	tb.finishCreation();
	gSTBEventActions.initialCheck($("category-content-box"));

	//Sets Focus on first Element
	setTimeout("$('cat-subsuper').focus();",50);
},

createSubSuperLinks: function(elementID) {
	
	var exists = $("cat-subsuper").getAttribute("catExists");
	exists = (exists && exists == 'true');
	var tb = this.toolbarContainer;
	
	var title = $("cat-subsuper").value;
	
	if (title == '') {
		$('cat-make-sub').hide();
		$('cat-make-super').hide();
		return;
	}
	
	var superContent;
	var sub;
	if (!exists) {
		sub = gLanguage.getMessage('CREATE_SUB_CATEGORY');
		superContent = gLanguage.getMessage('CREATE_SUPER_CATEGORY');
	} else {
		sub = gLanguage.getMessage('MAKE_SUB_CATEGORY');
		superContent = gLanguage.getMessage('MAKE_SUPER_CATEGORY');
	}
	sub = sub.replace(/\$-title/g, title);
	superContent = superContent.replace(/\$-title/g, title);			                          
	if($('cat-make-sub').innerHTML != sub){
		var lnk = tb.createLink('cat-make-sub-link', 
								[['catToolBar.createSuperItem('+(exists?'false':'true')+')', sub, 'cat-make-sub']],
								'', true);
		tb.replace('cat-make-sub-link', lnk);
		lnk = tb.createLink('cat-make-super-link', 
							[['catToolBar.createSubItem()', superContent, 'cat-make-super']],
							'', true);
		tb.replace('cat-make-super-link', lnk);
	}
},

createSubItem: function() {
	var name = $("cat-subsuper").value;
	/*STARTLOG*/
    smwhgLogger.log(wgTitle+":"+name,"STB-Categories","sub-category_created");
	/*ENDLOG*/
	//Check if Inputbox is empty
	if(name=="" || name == null ){
		alert(gLanguage.getMessage('INPUT_BOX_EMPTY'));
		return;
	}
 	this.om.createSubCategory(name, "");
 	this.fillList(true);
},

createSuperItem: function(openTargetArticle) {
	if (openTargetArticle == undefined) {
		openTargetArticle = false;
	}
	var name = $("cat-subsuper").value;
	/*STARTLOG*/
    smwhgLogger.log(name+":"+wgTitle,"STB-Categories","super-category_created");
	/*ENDLOG*/
	//Check if Inputbox is empty
	if(name=="" || name == null ){
		alert(gLanguage.getMessage('INPUT_BOX_EMPTY'));
		return;
	}
 	this.om.createSuperCategory(name, "", openTargetArticle, this.wtp);
 	this.fillList(true);
},


changeItem: function(selindex) {
	this.wtp.initialize();
	//Get new values
	var name = $("cat-name").value;
	//Get category
	var annotatedElements = this.wtp.getCategories();
	//change category
	if(   (selindex!=null) 
	   && ( selindex >=0) 
	   && (selindex <= annotatedElements.length)  ){
		/*STARTLOG*/
		var oldName = annotatedElements[selindex].getName();
	    smwhgLogger.log(oldName+"->"+name,"STB-Categories","edit_category_change");
		/*ENDLOG*/
		annotatedElements[selindex].changeCategory(name);
	}
	
	//show list
	this.fillList(true);
},

deleteItem: function(selindex) {
	this.wtp.initialize();
	//Get relations
	var annotatedElements = this.wtp.getCategories();

	//delete category
	if (   (selindex!=null)
	    && (selindex >=0)
	    && (selindex <= annotatedElements.length)  ){
		var anno = annotatedElements[selindex];
		/*STARTLOG*/
	    smwhgLogger.log(anno.getName(),"STB-Categories","edit_category_delete");
		/*ENDLOG*/
		anno.remove("");
	}
	//show list
	this.fillList(true);
},


newCategory: function() {

	this.currentAction = "create";
	this.showList = false;
 
    this.wtp.initialize();
	var selection = this.wtp.getSelection(true);
   
	/*STARTLOG*/
    smwhgLogger.log(selection,"STB-Categories","create_clicked");
	/*ENDLOG*/
    
	var tb = this.createToolbar(SMW_CAT_ALL_VALID);	
	tb.append(tb.createText('cat-help-msg', gLanguage.getMessage('CREATE_NEW_CATEGORY'), '' , true));
	tb.append(tb.createInput('cat-name', gLanguage.getMessage('CATEGORY'), 
							 '', '',
	                         SMW_CAT_CHECK_CATEGORY_IIE +
	                         SMW_CAT_CHECK_EMPTY +
	                         SMW_CAT_VALID_CATEGORY_NAME +
	                         SMW_CAT_HINT_CATEGORY,
	                         true));
	tb.setInputValue('cat-name',selection);	                         
	tb.append(tb.createText('cat-name-msg', gLanguage.getMessage('ENTER_NAME'), '' , true));
		
	var links = [['catToolBar.createNewCategory()',gLanguage.getMessage('CREATE'), 'cat-confirm', 
	                                               gLanguage.getMessage('INVALID_NAME'), 'cat-invalid'],
				 ['catToolBar.cancel()', gLanguage.getMessage('CANCEL')]
				];
	tb.append(tb.createLink('cat-links', links, '', true));
				
	tb.finishCreation();
	gSTBEventActions.initialCheck($("category-content-box"));
	//Sets Focus on first Element
	setTimeout("$('cat-name').focus();",50);
},

createNewCategory: function() {
	var catName = $("cat-name").value;
	/*STARTLOG*/
    smwhgLogger.log(catName,"STB-Categories","create_added");
	/*ENDLOG*/
	// Create the new category
	this.om.createCategory(catName, "");

	//show list
	this.fillList(true);

},

getselectedItem: function(selindex) {
	this.wtp.initialize();
	var annotatedElements = this.wtp.getCategories();
	if (   selindex == null
	    || selindex < 0
	    || selindex >= annotatedElements.length) {
		// Invalid index
		return;
	}

	this.currentAction = "edit_category";
	this.showList = false;

	/*STARTLOG*/
    smwhgLogger.log(annotatedElements[selindex].getName(),"STB-Categories","edit_category_clicked");
	/*ENDLOG*/
	
	var tb = this.createToolbar(SMW_CAT_ALL_VALID);	
	tb.append(tb.createText('cat-help-msg', gLanguage.getMessage('CHANGE_ANNO_OF_CAT'), '' , true));
	
	tb.append(tb.createInput('cat-name', gLanguage.getMessage('CATEGORY'), '', '',
	                         SMW_CAT_CHECK_CATEGORY +
	                         SMW_CAT_CHECK_EMPTY +
	                         SMW_CAT_VALID_CATEGORY_NAME +
	                         SMW_CAT_HINT_CATEGORY,
	                         true));
	tb.setInputValue('cat-name',annotatedElements[selindex].getName());	                         
	                         
	tb.append(tb.createText('cat-name-msg', gLanguage.getMessage('ENTER_NAME'), '' , true));
		
	var links = [['catToolBar.changeItem(' + selindex +')', gLanguage.getMessage('CHANGE'), 'cat-confirm', 
	                                                        gLanguage.getMessage('INVALID_NAME'), 'cat-invalid'],
				 ['catToolBar.deleteItem(' + selindex +')', gLanguage.getMessage('DELETE')],
				 ['catToolBar.cancel()', gLanguage.getMessage('CANCEL')]
				];
	tb.append(tb.createLink('cat-links', links, '', true));
				
	tb.finishCreation();
	gSTBEventActions.initialCheck($("category-content-box"));
	annotatedElements[selindex].select();
	//Sets Focus on first Element
	setTimeout("$('cat-name').focus();",50);
}
};// End of Class

window.catToolBar = new CategoryToolBar();
//    Event.observe(window, 'load', catToolBar.callme.bindAsEventListener(catToolBar));
stb_control.registerToolbox(catToolBar);

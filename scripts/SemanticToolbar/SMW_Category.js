var SMW_CAT_CHECK_CATEGORY = 
	'smwCheckType="category: exists ' +
		'? (color: lightgreen, hideMessage, valid:true) ' +
	 	': (color: orange, showMessage:CATEGORY_DOES_NOT_EXIST, valid:true)" ';

var SMW_CAT_CHECK_CATEGORY_IIE = // Invalid if exists
	'smwCheckType="category:exists ' +
		'? (color: red, showMessage:CATEGORY_ALREADY_EXISTS, valid:false) ' +
	 	': (color: lightgreen, hideMessage, valid:true)" ';

var SMW_CAT_CHECK_EMPTY = 
	'smwCheckEmpty="empty' +
		'? (color:red, showMessage:MUST_NOT_BE_EMPTY, valid:false) ' +
		': (color:white, hideMessage)"';

var SMW_CAT_ALL_VALID =	
	'smwAllValid="allValid ' +
 		'? (show:cat-confirm, hide:cat-invalid) ' +
 		': (show:cat-invalid, hide:cat-confirm)"';

var SMW_CAT_HINT_CATEGORY =
	'typeHint = "' + SMW_CATEGORY_NS + '" ';

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

showToolbar: function(request){
	this.categorycontainer.setHeadline(gLanguage.getMessage('CATEGORIES'));
	this.wtp = new WikiTextParser();
	this.om = new OntologyModifier();
	this.fillList(true);
},

callme: function(event){
	if(wgAction == "edit" && stb_control.isToolbarAvailable()){
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
	this.wtp.initialize();
	this.categorycontainer.setContent(this.genTB.createList(this.wtp.getCategories(),"category"));
	this.categorycontainer.contentChanged();
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


addItem: function() {
	/*STARTLOG*/
    smwhgLogger.log($("cat-name").value,"STB-Categories","annotate_added");
	/*ENDLOG*/
	this.wtp.initialize();
	var name = $("cat-name").value;
	this.wtp.addCategory(name, true);
	this.fillList(true);
},

newItem: function() {
	var html;
	
	this.showList = false;
	this.currentAction = "annotate";
	
    this.wtp.initialize();
	var selection = this.wtp.getSelection();
	
	/*STARTLOG*/
    smwhgLogger.log(selection,"STB-Categories","annotate_clicked");
	/*ENDLOG*/

	var tb = this.createToolbar(SMW_CAT_ALL_VALID);	
	tb.append(tb.createText('cat-help-msg', 
	                        gLanguage.getMessage('ANNOTATE_CATEGORY'),
	                        '' , true));
	tb.append(tb.createInput('cat-name', 
							 gLanguage.getMessage('CATEGORY'), selection, '',
	                         SMW_CAT_CHECK_CATEGORY +
	                         SMW_CAT_CHECK_EMPTY +
	                         SMW_CAT_HINT_CATEGORY,
	                         true));
	tb.append(tb.createText('cat-name-msg', 
							gLanguage.getMessage('ENTER_NAME'), '' , true));
	var links = [['catToolBar.addItem()',gLanguage.getMessage('ADD'), 'cat-confirm',
	                                     gLanguage.getMessage('INVALID_VALUES'), 'cat-invalid'],
				 ['catToolBar.cancel()', gLanguage.getMessage('CANCEL')]
				];
	tb.append(tb.createLink('cat-links', links, '', true));
				
	tb.finishCreation();
	gSTBEventActions.initialCheck($("category-content-box"));
	//Sets Focus on first Element
	setTimeout("$('cat-name').focus();",50);
},


CreateSubSup: function() {
    var html;

	this.currentAction = "sub/super-category";
	this.showList = false;
	
    this.wtp.initialize();
	var selection = this.wtp.getSelection();
	
	/*STARTLOG*/
    smwhgLogger.log(selection,"STB-Categories","sub/super-category_clicked");
	/*ENDLOG*/

	var tb = this.createToolbar(SMW_CAT_SUB_SUPER_ALL_VALID);	
	tb.append(tb.createText('cat-help-msg', gLanguage.getMessage('DEFINE_SUB_SUPER_CAT'), '' , true));
	tb.append(tb.createInput('cat-subsuper', gLanguage.getMessage('CATEGORY'),
	                         selection, '',
	                         SMW_CAT_SUB_SUPER_CHECK_CATEGORY +
	                         SMW_CAT_CHECK_EMPTY +
	                         SMW_CAT_HINT_CATEGORY,
	                         true));
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
		openTargetArticle = true;
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
 	this.om.createSuperCategory(name, "", openTargetArticle);
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

    var html;
    
	this.currentAction = "create";
	this.showList = false;
 
    this.wtp.initialize();
	var selection = this.wtp.getSelection();
   
	/*STARTLOG*/
    smwhgLogger.log(selection,"STB-Categories","create_clicked");
	/*ENDLOG*/
    
	var tb = this.createToolbar(SMW_CAT_ALL_VALID);	
	tb.append(tb.createText('cat-help-msg', gLanguage.getMessage('CREATE_NEW_CATEGORY'), '' , true));
	tb.append(tb.createInput('cat-name', gLanguage.getMessage('CATEGORY'), 
							 selection, '',
	                         SMW_CAT_CHECK_CATEGORY_IIE+SMW_CAT_CHECK_EMPTY+
	                         SMW_CAT_HINT_CATEGORY,
	                         true));
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
	// Create an ontology modifier instance
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
	
	tb.append(tb.createInput('cat-name', gLanguage.getMessage('CATEGORY'), annotatedElements[selindex].getName(), '',
	                         SMW_CAT_CHECK_CATEGORY +
	                         SMW_CAT_CHECK_EMPTY +
	                         SMW_CAT_HINT_CATEGORY,
	                         true));
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

var catToolBar = new CategoryToolBar();
Event.observe(window, 'load', catToolBar.callme.bindAsEventListener(catToolBar));



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
 * @author Thomas Schweitzer
 */
var RelationToolBar = Class.create();

var SMW_REL_VALID_PROPERTY_NAME =
	'smwValidValue="^[^<>\\|&$=\\?\\{\\}\\[\\]]{1,255}$: valid ' +
		'? (color: white, hideMessage, valid:true) ' +
	 	': (color: red, showMessage:PROPERTY_NAME_TOO_LONG, valid:false)" ';

var SMW_REL_VALID_PROPERTY_VALUE =
	'smwValidValue="^.{1,255}$: valid ' +
		'? (color: white, hideMessage, valid:true) ' +
	 	': (color: orange, showMessage:PROPERTY_VALUE_TOO_LONG, valid:true)" ';

var SMW_REL_CHECK_PROPERTY = 
	'smwCheckType="property: exists ' +
		'? (color: lightgreen, hideMessage, valid:true) ' +
	 	': (color: orange, showMessage:PROPERTY_DOES_NOT_EXIST, valid:true)" ';

var SMW_REL_CHECK_PROPERTY_ACCESS = 
	'smwAccessControl="property: propertyedit ' +
		'? (color: lightgreen, hideMessage, valid:true) ' +
	 	': (color: red, showMessage:PROPERTY_ACCESS_DENIED, valid:false)" ';

var SMW_REL_CHECK_PROPERTY_UPDATE_SCHEMA = 
	'smwCheckType="property: exists ' +
		'? (color: lightgreen, hideMessage, valid:true, call:relToolBar.updateSchema) ' +
	 	': (color: orange, showMessage:PROPERTY_DOES_NOT_EXIST, valid:true, call:relToolBar.resetInstanceTypeHint)" ';

var SMW_REL_SUB_SUPER_CHECK_PROPERTY = 
	'smwCheckType="property: exists ' +
		'? (color: lightgreen, hideMessage, valid:true, attribute:propExists=true) ' +
	 	': (color: orange, hideMessage, valid:true, attribute:propExists=false)" ';

var SMW_REL_CHECK_PROPERTY_IIE = // Invalid if exists
	'smwCheckType="property: exists ' +
		'? (color: red, showMessage:PROPERTY_ALREADY_EXISTS, valid:false) ' +
	 	': (color: lightgreen, hideMessage, valid:true)" ';

var SMW_REL_VALID_CATEGORY_NAME =
	'smwValidValue="^[^<>\\|!&$%&=\\?]{1,255}$: valid ' +
		'? (color: white, hideMessage, valid:true) ' +
	 	': (color: red, showMessage:CATEGORY_NAME_TOO_LONG, valid:false)" ';

var SMW_REL_CHECK_CATEGORY = 
	'smwCheckType="category: exists ' +
		'? (color: lightgreen, hideMessage, valid:true) ' +
	 	': (color: orange, showMessage:CATEGORY_DOES_NOT_EXIST, valid:true)" ';

var SMW_REL_CHECK_EMPTY = 
	'smwCheckEmpty="empty' +
		'? (color:red, showMessage:MUST_NOT_BE_EMPTY, valid:false) ' +
		': (color:white, hideMessage)"';

var SMW_REL_CHECK_EMPTY_NEV =   // NEV = Not Empty Valid i.e. valid if not empty
	'smwCheckEmpty="empty' +
		'? (color:red, showMessage:MUST_NOT_BE_EMPTY, valid:false, call:relToolBar.updateTypeHint) ' +
		': (color:white, hideMessage, valid:true, call:relToolBar.updateTypeHint)"';

var SMW_REL_CHECK_EMPTY_WIE =   // WIE = Warning if empty but still valid
	'smwCheckEmpty="empty' +
		'? (color:orange, showMessage:VALUE_IMPROVES_QUALITY) ' +
		': (color:white, hideMessage)"';

var SMW_REL_NO_EMPTY_SELECTION =
	'smwCheckEmpty="empty' +
	'? (color:red, showMessage:SELECTION_MUST_NOT_BE_EMPTY, valid:false) ' +
	': (color:white, hideMessage, valid:true)"';		

var SMW_REL_ALL_VALID =	
	'smwAllValid="allValid ' +
 		'? (show:rel-confirm, hide:rel-invalid) ' +
 		': (show:rel-invalid, hide:rel-confirm)"';

var SMW_REL_SUB_SUPER_ALL_VALID =	
	'smwAllValid="allValid ' +
 		'? (call:relToolBar.createSubSuperLinks) ' +
 		': (call:relToolBar.createSubSuperLinks)"';
 		
//var positionFixed = (wgAction == 'annotate' || typeof FCKeditor != 'undefined' || typeof CKEDITOR != 'undefined') ? '" position="fixed"' : ''
var positionFixed = '" position="fixed"';

var SMW_REL_HINT_CATEGORY =
	'constraints = "namespace:' + SMW_CATEGORY_NS + '"' + positionFixed;

var SMW_REL_HINT_PROPERTY =
	'constraints = "namespace:' + SMW_PROPERTY_NS + '"' + positionFixed;

var SMW_REL_HINT_INSTANCE =
	'constraints = "namespace:' + SMW_INSTANCE_NS + '"' + positionFixed;

var SMW_REL_TYPE_CHANGED =
	'smwChanged="(call:relToolBar.relTypeChanged)"';

RelationToolBar.prototype = {

initialize: function() {
	this.genTB = new GenericToolBar();
	this.toolbarContainer = null;
	this.showList = true;
	this.currentAction = "";
	this.relationsForAccessCheck = "";
	this.relationsForExistenceCheck = "";
},

showToolbar: function(){
	this.relationcontainer.setHeadline(gLanguage.getMessage('PROPERTIES'));
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

initToolbox: function(event){
	if((wgAction == "edit" || wgAction == "annotate" || wgAction == 'formedit' || wgAction == 'submit' ||
            wgCanonicalSpecialPageName == 'AddData' || wgCanonicalSpecialPageName == 'EditData' ||
            wgCanonicalSpecialPageName == 'FormEdit' )
	    && typeof stb_control != 'undefined' && stb_control.isToolbarAvailable()){
		this.relationcontainer = stb_control.createDivContainer(RELATIONCONTAINER, 0);
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
		var relations = this.wtp.getRelations();
		var rels = '';
		var recRels = window.catToolBar.recommendedRels !== undefined ? 
			window.catToolBar.recommendedRels.clone() : new Array();
		for (var i = 0; i < relations.length; ++i) {
			rels += gLanguage.getMessage('PROPERTY_NS') + relations[i].getName()+',';
			// check if recommended relation is already set
			if( recRels !== undefined ) {
				for (var j = 0; j < recRels.length; ++j) {
					if( recRels[i] !== 'undefined' &&
						relations[i].getName().toLowerCase() === recRels[j].getName().toLowerCase()){
						// Annotaion already made. Ignore this recommendation
						recRels.splice( j, 1 );
					}
				}
			}
		}
		
		var relationInfo = [];
		for (var i = 0; i < relations.length; ++i) {
			relationInfo[i] = {
				name  : gLanguage.getMessage('PROPERTY_NS') + relations[i].name,
				values: relations[i].getSplitValues(),
				accessRequest: "propertyedit"
			};
		}

		var riJSON = JSON.stringify(relationInfo);
		if (riJSON.length > 0 && riJSON != this.relationInfoRequest) {
			this.relationInfoRequest = riJSON;
			sajax_do_call('smwf_om_MultipleRelationInfo',
			              [riJSON],
			              relationInfoCallback.bind(this),
			              relations);
		}
		
		if (this.propertyRights
			&& this.propertyRights.length == relations.length) {
			for (var i = 0; i < relations.length; ++i) {
				relations[i].accessAllowed = this.propertyRights[i];
			}
		}
		if (this.propertyExists
			&& this.propertyExists.length == relations.length) {
			for (var i = 0; i < relations.length; ++i) {
				relations[i].exists = this.propertyExists[i];
			}
		}
		if (this.valuePageInfo
			&& this.valuePageInfo.length == relations.length) {
			for (var i = 0; i < relations.length; ++i) {
				relations[i].valuePageInfo = this.valuePageInfo[i];
			}
		}
		if (this.categoryInfo
			&& this.categoryInfo.length == relations.length) {
			for (var i = 0; i < relations.length; ++i) {
				relations[i].categoryInfo = this.categoryInfo[i];
			}
		}
		if (this.recordProperties
			&& this.recordProperties.length == relations.length) {
			for (var i = 0; i < relations.length; ++i) {
				relations[i].recordProperties = this.recordProperties[i];
			}
		}

		if( wgAction !== "annotate" ) {
			// no recommended properties for "Annotation Mode"
			this.relationcontainer.setContent(
				this.genTB.createList(relations,"relation") +
				this.genTB.createList(recRels, "rec-relation")
			);
		} else {
			this.relationcontainer.setContent(
				this.genTB.createList(relations,"relation")
			);
		}
		this.relationcontainer.contentChanged();
	}
	
	
	/**
	 * 
	 * @param {Object} request
	 */
	function relationInfoCallback(request) {
	
		if (request.status != 200) {
			// call for schema data failed, do nothing.
			return;
		}
	
		var relationInfo = request.responseText.evalJSON(true);
		this.propertyExists = [];
		this.valuePageInfo = [];
		this.categoryInfo = [];
		this.recordProperties = [];

		var containsForbiddenProperties = false;
		for (var i = 0; i < relationInfo.length; ++i) {
			relations[i].exists = relationInfo[i].relationExists;
			this.propertyExists.push(relationInfo[i].relationExists);
			
			relations[i].accessAllowed = relationInfo[i].accessGranted;
			if (relationInfo[i].accessGranted == "false") {
				containsForbiddenProperties = true;
			}
			
			relations[i].valuePageInfo = relationInfo[i].valuePageInfo;
			this.valuePageInfo.push(relationInfo[i].valuePageInfo);
			
			relations[i].categoryInfo = relationInfo[i].rangeCategories;
			this.categoryInfo.push(relationInfo[i].rangeCategories);

			relations[i].recordProperties = relationInfo[i].recordProperties;
			this.recordProperties.push(relationInfo[i].recordProperties);
		}
		
		refreshSTB.containsForbiddenProperties = containsForbiddenProperties;

		this.relationcontainer.setContent(this.genTB.createList(relations,"relation"));
		this.relationcontainer.contentChanged();
		refreshSTB.refreshToolBar();
		
	}	
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
    smwhgLogger.log("","STB-Properties",this.currentAction+"_canceled");
	/*ENDLOG*/
	this.currentAction = "";

        this.toolbarContainer.hideSandglass();
        this.toolbarContainer.release();
        this.toolbarContainer = null;
	this.fillList(true);
},

/**
 * Creates a new toolbar for the relation container with the standard menu.
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
	
	this.toolbarContainer = new ContainerToolBar('relation-content',700,this.relationcontainer);
	var tb = this.toolbarContainer;
	tb.createContainerBody(attributes);
	return tb;
},

/**
 * Creates the content of a <contextMenuContainer> for annotating a property.
 * 
 * @param ContextMenuFramework contextMenuContainer
 * 		The container of the context menu.
 * @param string value (optional)
 * 		The default value for the property. If it is not given, the current 
 * 		selection of the wiki text parser is used.
 * @param string repr (optional)
 * 		The default representation for the property. If it is not given, the current 
 * 		selection of the wiki text parser is used.
  * @param {function} confirmFunction
 * 		An optional function that is called after the operation of the toolbar
 * 		was completed
* 
 */
createContextMenu: function(contextMenuContainer, value, repr, name, confirmFunction) {
	if (this.toolbarContainer) {
		this.toolbarContainer.release();
	}
	this.confirmFunction = confirmFunction ? confirmFunction : null;
	
	this.toolbarContainer = new ContainerToolBar('relation-content',500,contextMenuContainer);
	var tb = this.toolbarContainer;
	tb.createContainerBody(SMW_REL_ALL_VALID, RELATIONCONTAINER, gLanguage.getMessage('SPECIFY_PROPERTY'));

    this.wtp.initialize();
	this.currentAction = "annotate";

	var valueEditable = false;
	if (!value) {
		value = this.wtp.getSelection(true);
		repr = value;
		//replace newlines by spaces
		value = value.replace(/\n/g,' ');
		value = value.replace(/'''''/g,''); // replace bold&italic
		value = value.replace(/'''/g,'');   // replace bold
		value = value.replace(/''/g,'');    // replace italic
		
		valueEditable = true;
	}
	
	/*STARTLOG*/
    smwhgLogger.log(value,"AAM-Properties","annotate_clicked");
	/*ENDLOG*/
	
	tb.append(tb.createInput('rel-name', gLanguage.getMessage('PROPERTY'), '', '',
	                         SMW_REL_CHECK_PROPERTY_UPDATE_SCHEMA +
	                         SMW_REL_CHECK_PROPERTY_ACCESS +
	                         SMW_REL_CHECK_EMPTY +
	                         SMW_REL_VALID_PROPERTY_NAME +
	                         SMW_REL_HINT_PROPERTY,
	                         true));
	tb.setInputValue('rel-name', (name) ? name : '');
	tb.append(tb.createText('rel-name-msg', gLanguage.getMessage('ENTER_NAME'), '' , true));
	
	tb.append(tb.createInput('rel-value-0', gLanguage.getMessage('PAGE'), '', '',
							 SMW_REL_CHECK_EMPTY_NEV + 
							 SMW_REL_HINT_INSTANCE +
							 SMW_REL_VALID_PROPERTY_VALUE,
	                         true));
	tb.setInputValue('rel-value-0', value);
		                         
	tb.append(tb.createText('rel-value-0-msg', gLanguage.getMessage('ANNO_PAGE_VALUE'), '' , true));
	
	tb.append(tb.createInput('rel-show', gLanguage.getMessage('SHOW'), '', '', '', true));
	tb.setInputValue('rel-show', repr);

        // cancel and delete links dont work yet, disable it at the moment and change the link message for the addItem()

        // the property is selected and therefore exists already, get index of property in page
        /* var selindex = (name) ? this.wtp.getRelationIndex(name, value) : -1; */
        // idx != -1 -> property found, show change and delete links
        /*
        if (selindex != -1) {
		var links = [['relToolBar.changeItem('+selindex+')',gLanguage.getMessage('CHANGE'), 'rel-confirm',
		                                                    gLanguage.getMessage('INVALID_VALUES'), 'rel-invalid'],
					 ['relToolBar.deleteItem(' + selindex +')', gLanguage.getMessage('DELETE')],
					 ['relToolBar.cancel()', gLanguage.getMessage('CANCEL')]
					];
        // Property name is not set or index was not found -> new annotation. Show the link add only
        } else { */
            var links = [['relToolBar.addItem()',
                          (name) ? gLanguage.getMessage('CHANGE') : gLanguage.getMessage('ADD'), 'rel-confirm',
                          gLanguage.getMessage('INVALID_VALUES'), 'rel-invalid']];

        //}
	
	tb.append(tb.createLink('rel-links', links, '', true));
				
	tb.finishCreation();
	
	if (wgAction == 'annotate') {
		$('rel-show').disable();
		if (!valueEditable) {
			$('rel-value-0').disable();
		}
	}
	
//	$('relation-content-table-rel-show').hide();
	gSTBEventActions.initialCheck($("relation-content-box"));
	
	//Sets Focus on first Element
	setTimeout("if ($('rel-name')) $('rel-name').focus();",250);  
	
},

addItem: function() {
	this.wtp.initialize();
	var name = $("rel-name").value;
	var value = this.getRelationValue();
	var text = $("rel-show").value;
	/*STARTLOG*/
    smwhgLogger.log(name+':'+value,"STB-Properties","annotate_added");
	/*ENDLOG*/
	//Check if Inputbox is empty
	if (name=="" || name == null ){
		alert(gLanguage.getMessage('INPUT_BOX_EMPTY'));
		return;
	}
	this.wtp.addRelation(name, value, text);
	this.fillList(true);
	if (this.confirmFunction) {
		this.confirmFunction();
		this.confirmFunction = null;
	}
	
},

getRelationValue: function() {
	var i = 0;
	var value = "";
	while($("rel-value-"+i) != null) {
		value += $("rel-value-"+i).value + ";"
		i++;
	}
	value = value.substr(0, value.length-1); // remove last semicolon
	return value;
},

newItem: function() {
    this.wtp.initialize();
	this.showList = false;
	this.currentAction = "annotate";

	var selection = this.wtp.getSelection(true);
	/*STARTLOG*/
    smwhgLogger.log(selection,"STB-Properties","annotate_clicked");
	/*ENDLOG*/
	
	var tb = this.createToolbar(SMW_REL_ALL_VALID);	
	tb.append(tb.createText('rel-help_msg', gLanguage.getMessage('ANNOTATE_PROPERTY'), '' , true));
	tb.append(tb.createInput('rel-name', gLanguage.getMessage('PROPERTY'), '', '',
	                         SMW_REL_CHECK_PROPERTY_UPDATE_SCHEMA +
	                         SMW_REL_CHECK_PROPERTY_ACCESS +
	                         SMW_REL_CHECK_EMPTY +
	                         SMW_REL_VALID_PROPERTY_NAME +
	                         SMW_REL_HINT_PROPERTY,
	                         true));
	tb.setInputValue('rel-name','');
	tb.append(tb.createText('rel-name-msg', gLanguage.getMessage('ENTER_NAME'), '' , true));
	tb.append(tb.createInput('rel-value-0', gLanguage.getMessage('PAGE'), '', '', 
							 SMW_REL_CHECK_EMPTY_NEV +
							 SMW_REL_HINT_INSTANCE +
							 SMW_REL_VALID_PROPERTY_VALUE,
	                         true));
	tb.setInputValue('rel-value-0', selection);	                         
	                         
	tb.append(tb.createText('rel-value-0-msg', gLanguage.getMessage('ANNO_PAGE_VALUE'), '' , true));
	
	tb.append(tb.createInput('rel-show', gLanguage.getMessage('SHOW'), '', '', '', true));
	tb.setInputValue('rel-show','');
	
	var links = [['relToolBar.addItem()',gLanguage.getMessage('ADD'), 'rel-confirm', gLanguage.getMessage('INVALID_VALUES'), 'rel-invalid'],
				 ['relToolBar.cancel()', gLanguage.getMessage('CANCEL')]
				];
	
	tb.append(tb.createLink('rel-links', links, '', true));
				
	tb.finishCreation();
	gSTBEventActions.initialCheck($("relation-content-box"));
	
	//Sets Focus on first Element
	setTimeout("$('rel-name').focus();",50);
},

/* new function (derived from newItem) to add recommended properties */
recProp: function(propName) {
	this.wtp.initialize();
	this.showList = false;
	this.currentAction = "annotate";

//	var selection = this.wtp.getSelection(true);
	/*STARTLOG*/
	smwhgLogger.log(propName,"STB-Properties","rec_prop_clicked");
	/*ENDLOG*/
	
	var tb = this.createToolbar(SMW_REL_ALL_VALID);	
	tb.append(tb.createText('rel-help_msg', gLanguage.getMessage('ANNOTATE_PROPERTY'), '' , true));
	tb.append(tb.createInput('rel-name', gLanguage.getMessage('PROPERTY'), propName, '',
	                         SMW_REL_CHECK_PROPERTY_UPDATE_SCHEMA +
	                         SMW_REL_CHECK_PROPERTY_ACCESS +
	                         SMW_REL_CHECK_EMPTY +
	                         SMW_REL_VALID_PROPERTY_NAME +
	                         SMW_REL_HINT_PROPERTY,
	                         true));
	tb.setInputValue('rel-name', propName);
	tb.append(tb.createText('rel-name-msg', gLanguage.getMessage('ENTER_NAME'), '' , true));
	tb.append(tb.createInput('rel-value-0', gLanguage.getMessage('PAGE'), '', '', 
							 SMW_REL_CHECK_EMPTY_NEV +
							 SMW_REL_HINT_INSTANCE +
							 SMW_REL_VALID_PROPERTY_VALUE,
	                         true));
//	tb.setInputValue('rel-value-0', selection);
	                         
	tb.append(tb.createText('rel-value-0-msg', gLanguage.getMessage('ANNO_PAGE_VALUE'), '' , true));
	
	tb.append(tb.createInput('rel-show', gLanguage.getMessage('SHOW'), '', '', '', true));
	tb.setInputValue('rel-show','');
	
	var links = [['relToolBar.addItem()',gLanguage.getMessage('ADD'), 'rel-confirm', gLanguage.getMessage('INVALID_VALUES'), 'rel-invalid'],
				 ['relToolBar.cancel()', gLanguage.getMessage('CANCEL')]
				];
	
	tb.append(tb.createLink('rel-links', links, '', true));

	tb.finishCreation();
	gSTBEventActions.initialCheck($("relation-content-box"));
	
	//Sets Focus on first Element
	setTimeout("$('rel-value-0').focus();",50);
},

updateSchema: function(elementID) {
	var toolbar = relToolBar;
	if (!relToolBar.toolbarContainer) {
		// The relation toolbar is running in the context menu of the
		// WYSIWYG editor
		toolbar = window.contextMenuRelToolBar;
	}
	toolbar.toolbarContainer.showSandglass(elementID);
	sajax_do_call('smwf_om_RelationSchemaData',
	              [$('rel-name').value],
	              toolbar.updateNewItem.bind(toolbar));
},

updateNewItem: function(request) {
	
	this.toolbarContainer.hideSandglass();
	if (request.status != 200) {
		// call for schema data failed, do nothing.
		return;
	}

	// defaults
	var arity = 2;
	var parameterNames = ["Page"];

	if (request.responseText != 'noSchemaData') {
		//TODO: activate annotate button
		var schemaData = GeneralXMLTools.createDocumentFromString(request.responseText);

		// read arity and parameter names
		var a = parseInt(schemaData.documentElement.getAttribute("arity"));
		if (a > 0) {
			arity = a;
			parameterNames = [];
			for (var i = 0, n = schemaData.documentElement.childNodes.length; i < n; i++) {
				parameterNames.push(schemaData.documentElement.childNodes[i].getAttribute("name"));
			}
		}
	}
	// build new INPUT tags
	var selection = this.wtp.getSelection(true);
	var tb = this.toolbarContainer;
	
	// remove old input fields	
	var i = 0;
	var removeElements = new Array();
	var found = true;
	var oldValues = [];
	while (found) {
		found = false;
		var elem = $('rel-value-'+i);
		if (elem) {
			oldValues.push($('rel-value-'+i).value);
			removeElements.push('rel-value-'+i);
			found = true;
		}
		elem = $('rel-value-'+i+'-msg');
		if (elem) {
			removeElements.push('rel-value-'+i+'-msg');
			found = true;
		}
		++i;
	}
	tb.remove(removeElements);
	
	// The initially assumed arity may be wrong. Check if the oldValues contains
	// a number of values that match the actual arity.
	if (oldValues.length === 1 && arity > 1) {
		var rel = new WtpRelation('', 0, 0, null, '', '', oldValues[0], '');
		oldValues = rel.getSplitValues();
	}
	
	// create new input fields
	for (var i = 0; i < arity-1; i++) {
		insertAfter = (i==0) 
			? ($('rel-replace-all') 
				? 'rel-replace-all'
				: 'rel-name-msg' )
			: 'rel-value-'+(i-1)+'-msg';
		var value = (i == 0)
			? ((oldValues.length > 0)
				? oldValues[0]
				: selection)
			: ((oldValues.length > i)
				? oldValues[i]
				: '');
		var pasteNamespace = "";
		var pageIdx = parameterNames[i].indexOf("|Page");
		if (pageIdx > 0) {
			parameterNames[i] = parameterNames[i].substr(0, pageIdx);
		}
		var relation = $('rel-name');
		var hint = 'namespace:' + SMW_INSTANCE_NS;
		if (relation.value.length > 0) { 
			if (relation.value == gLanguage.getMessage('SUBPROPERTY_OF', 'cont')) {
				hint = 'namespace:' + SMW_PROPERTY_NS;
			} else {
				hint = 'instance-property-range:' +
						gLanguage.getMessage('PROPERTY_NS') +
						parameterNames[i] +
						'| ' + hint;
			}
		}
		hint = 'constraints="'+hint+'"';
		pasteNamespace = 'pastens="true"';
		
		tb.insert(insertAfter,
				  tb.createInput('rel-value-'+ i, parameterNames[i], '', '', 
								 SMW_REL_CHECK_EMPTY_NEV +
							     SMW_REL_VALID_PROPERTY_VALUE + 
								 hint + pasteNamespace,
		                         true));
		                         
		tb.setInputValue('rel-value-'+ i, value);    
		                         
		tb.insert('rel-value-'+ i,
				  tb.createText('rel-value-'+i+'-msg', gLanguage.getMessage('ANNO_PAGE_VALUE'), '' , true));
		selection = "";
	}
	
	tb.finishCreation();
	gSTBEventActions.initialCheck($("relation-content-box"));
},

CreateSubSup: function() {

	this.showList = false;
	this.currentAction = "sub/super-category";

	this.wtp.initialize();
	var selection = this.wtp.getSelection(true);
	/*STARTLOG*/
    smwhgLogger.log(selection,"STB-Properties","sub/super-property_clicked");
	/*ENDLOG*/

	var tb = this.createToolbar(SMW_REL_SUB_SUPER_ALL_VALID);	
	tb.append(tb.createText('rel-help-msg', gLanguage.getMessage('DEFINE_SUB_SUPER_PROPERTY'), '' , true));
	tb.append(tb.createInput('rel-subsuper', 
							 gLanguage.getMessage('PROPERTY'), '', '',
	                         SMW_REL_SUB_SUPER_CHECK_PROPERTY +
	                         SMW_REL_CHECK_EMPTY +
	                         SMW_REL_VALID_PROPERTY_NAME +
	                         SMW_REL_HINT_PROPERTY,
	                         true));
	tb.setInputValue('rel-subsuper', selection);	                         
	tb.append(tb.createText('rel-subsuper-msg', gLanguage.getMessage('ENTER_NAME'), '' , true));
	
	tb.append(tb.createLink('rel-make-sub-link', 
	                        [['relToolBar.createSubItem()', gLanguage.getMessage('CREATE_SUB'), 'rel-make-sub']], 
	                        '', false));
	tb.append(tb.createLink('rel-make-super-link', 
	                        [['relToolBar.createSuperItem()', gLanguage.getMessage('CREATE_SUPER'), 'rel-make-super']],
	                        '', false));
	
	var links = [['relToolBar.cancel()', gLanguage.getMessage('CANCEL')]];
	tb.append(tb.createLink('rel-links', links, '', true));
				
	tb.finishCreation();
	gSTBEventActions.initialCheck($("relation-content-box"));
    
	//Sets Focus on first Element
	setTimeout("$('rel-subsuper').focus();",50);
},

createSubSuperLinks: function(elementID) {
	
	var exists = $("rel-subsuper").getAttribute("propExists");
	exists = (exists && exists == 'true');
	var tb = this.toolbarContainer;
	
	var title = $("rel-subsuper").value;
	
	if (title == '') {
		$('rel-make-sub').hide();
		$('rel-make-super').hide();
		return;
	}
	
	var superContent;
	var sub;
	if (!exists) {
		sub = gLanguage.getMessage('CREATE_SUB_PROPERTY');
		superContent = gLanguage.getMessage('CREATE_SUPER_PROPERTY');
	} else {
		sub = gLanguage.getMessage('MAKE_SUB_PROPERTY');
		superContent = gLanguage.getMessage('MAKE_SUPER_PROPERTY');
	}
	sub = sub.replace(/\$-title/g, title);
	superContent = superContent.replace(/\$-title/g, title);			                          
	if($('rel-make-sub').innerHTML != sub){
		var lnk = tb.createLink('rel-make-sub-link', 
								[['relToolBar.createSuperItem('+ (exists ? 'false' : 'true') + ')', sub, 'rel-make-sub']],
								'', true);
		tb.replace('rel-make-sub-link', lnk);
		lnk = tb.createLink('rel-make-super-link', 
							[['relToolBar.createSubItem()', superContent, 'rel-make-super']],
							'', true);
		tb.replace('rel-make-super-link', lnk);
	}
},
	
createSubItem: function(openTargetArticle) {
	
	if (openTargetArticle == undefined) {
		openTargetArticle = false;
	}
	var name = $("rel-subsuper").value;
	/*STARTLOG*/
    smwhgLogger.log(wgTitle+":"+name,"STB-Properties","sub-property_created");
	/*ENDLOG*/
	//Check if Inputbox is empty
	if(name=="" || name == null ){
		alert(gLanguage.getMessage('INPUT_BOX_EMPTY'));
		return;
	}
 	this.om.createSubProperty(name, "", openTargetArticle);
 	this.fillList(true);
},

createSuperItem: function(openTargetArticle) {
	if (openTargetArticle == undefined) {
		openTargetArticle = false;
	}
	var name = $("rel-subsuper").value;
	/*STARTLOG*/
    smwhgLogger.log(name+":"+wgTitle,"STB-Properties","super-property_created");
	/*ENDLOG*/
	//Check if Inputbox is empty
	if(name=="" || name == null ){
		alert(gLanguage.getMessage('INPUT_BOX_EMPTY'));
		return;
	}

 	this.om.createSuperProperty(name, "", openTargetArticle, this.wtp);
 	this.fillList(true);
},

/**
 * Sets the auto completion type hint of the relation name field depending on the
 * value of the element with ID <elementID>.
 * The following formats are supported:
 * - Dates (yyyy-mm-dd and dd-mm-yyyy, separator can be "-" , "/" and ".")
 * - Email addresses
 * - Numerical values with units of measurement
 * - Floats, integers
 * - Instances that belong to a category.
 * If no properties with these restrictions are found, all properties that match
 * a part of the entered property name are listed.  
 */
updateTypeHint: function(elementID) {
	var elem = $(elementID);
	var value = elem.value;
	var relation = $('rel-name');
	
	var hint = 'namespace:'+SMW_PROPERTY_NS;
	
	// Date: yyyy-mm-dd
	var date = value.match(/\d{1,5}[- \/.](0[1-9]|1[012])[- \/.](0[1-9]|[12][0-9]|3[01])/);
	if (!date) {
		// Date: dd-mm-yyyy
		date = value.match(/(0[1-9]|[12][0-9]|3[01])[- \/.](0[1-9]|1[012])[- \/.]\d{1,5}/);
	} 
	var email = value.match(/^([A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4})$/i);
	var numeric = value.match(/([+-]?\d*(\.\d+([eE][+-]?\d*)?)?)\s*(.*)/);
	
	if (date) {
//		hint = '_dat;'+SMW_PROPERTY_NS;
		hint = 'schema-property-type:_dat|namespace:'+SMW_PROPERTY_NS;
	} else if (email) {
		hint = 'schema-property-type:_ema|namespace:'+SMW_PROPERTY_NS;
	} else if (numeric) {
		var number = numeric[1];
		var unit = numeric[4];
		var mantissa = numeric[2];
		if (number && unit) {
			var c = unit.charCodeAt(0);
			if (unit === "K" || unit === '°C' || unit === '°F' ||
				(c == 176 && unit.length == 2 && 
				 (unit.charAt(1) == 'C' || unit.charAt(1) == 'F'))) {
				hint = "schema-property-type:_tem|namespace:"+SMW_PROPERTY_NS;
			} else {
				hint = 'schema-property-type:'+unit+'|namespace:'+SMW_PROPERTY_NS;
			}
		} else if (number && mantissa) {
			hint = 'schema-property-type:_flt|namespace:'+SMW_PROPERTY_NS;
		} else if (number) {
			hint = 'schema-property-type:_num,_int,_flt|namespace:'+SMW_PROPERTY_NS;
		} else if (unit) {
			hint = 'schema-property-type:'+unit+'|namespace:'+SMW_PROPERTY_NS;
		}
	}
	
	// Prefer properties that belong to the categories that are currently annotated
	var categories = this.wtp.getCategories();
	var numCats = categories.length;
	if (numCats > 0) {
		var cats = "";
		var catNs = gLanguage.getMessage('CATEGORY_NS');
		for (var i = 0; i < numCats; ++i) {
			cats += 'schema-property-domain:'+catNs+categories[i].getName() + '|';
		}
		hint = cats + hint;
	}
	
	relation.setAttribute('constraints', hint);
//	console.log("updateTypeHint: "+hint);
	
},


resetInstanceTypeHint: function(elementID) {
	var instance = $('rel-value-0');
	var hint = 'namespace:' + SMW_INSTANCE_NS;
	instance.setAttribute('constraints', hint);
	instance.setAttribute('pastens', "true");
//	console.log("resetInstanceTypeHint: "+hint);
},

newRelation: function() {
    gDataTypes.refresh();
    
	this.showList = false;
	this.currentAction = "create";
	
    this.wtp.initialize();
	var selection = this.wtp.getSelection(true);
   
	/*STARTLOG*/
    smwhgLogger.log(selection,"STB-Properties","create_clicked");
	/*ENDLOG*/

	var domain = (wgNamespaceNumber == 14)
					? wgTitle  // current page is a category
					: "";
	var tb = this.createToolbar(SMW_REL_ALL_VALID);	
	
	tb.append(tb.createText('rel-help-msg', gLanguage.getMessage('CREATE_NEW_PROPERTY'), '' , true));
	tb.append(tb.createInput('rel-name', 
							 gLanguage.getMessage('PROPERTY'), '', '',
	                         SMW_REL_CHECK_PROPERTY_IIE +
	                         SMW_REL_CHECK_EMPTY+
	                         SMW_REL_VALID_PROPERTY_NAME +
	                         SMW_REL_HINT_PROPERTY,
	                         true));
	tb.setInputValue('rel-name', selection);	                         
	tb.append(tb.createText('rel-name-msg', gLanguage.getMessage('ENTER_NAME'), '' , true));

	var page = gLanguage.getMessage('TYPE_PAGE_WONS');
	var dataTypes = gDataTypes.getBuiltinTypes();
	var pIdx = dataTypes.indexOf(page);
	tb.append(tb.createDropDown('rel-type-0', gLanguage.getMessage('TYPE'), 
	                            dataTypes, 
	                            null,
	                            pIdx, 
	                            SMW_REL_NO_EMPTY_SELECTION +
	                            SMW_REL_TYPE_CHANGED, true));
	tb.append(tb.createText('rel-type-0-msg', gLanguage.getMessage('ENTER_TYPE'), '' , true));
			
	tb.append(tb.createInput('rel-domain', gLanguage.getMessage('DOMAIN'), '', '', 
						     SMW_REL_CHECK_CATEGORY +
						     SMW_REL_VALID_CATEGORY_NAME + 
						     SMW_REL_CHECK_EMPTY_WIE +
						     SMW_REL_HINT_CATEGORY,
	                         true));
	tb.setInputValue('rel-domain', domain);	                         
	tb.append(tb.createText('rel-domain-msg', gLanguage.getMessage('ENTER_DOMAIN'), '' , true));

	tb.append(tb.createInput('rel-range-0', gLanguage.getMessage('RANGE'), '', '',
						     SMW_REL_CHECK_CATEGORY + SMW_REL_CHECK_EMPTY_WIE +
						     SMW_REL_VALID_CATEGORY_NAME + SMW_REL_HINT_CATEGORY,
	                         true));
	tb.setInputValue('rel-range-0', '');
	tb.append(tb.createText('rel-range-0-msg', gLanguage.getMessage('ENTER_RANGE'), '' , true));
	
	tb.append(tb.createCheckBox('rel-mandatory', '', [gLanguage.getMessage('Mandatory')], [-1], 'name="mandatory"', true));

			
	var links = [['relToolBar.createNewRelation()',
			     gLanguage.getMessage('CREATE'), 'rel-confirm', 
			     gLanguage.getMessage('INVALID_VALUES'), 'rel-invalid'],
			     ['relToolBar.cancel()', gLanguage.getMessage('CANCEL')]
			    ];
	tb.append(tb.createLink('rel-links', links, '', true));
	
	tb.finishCreation();
	gSTBEventActions.initialCheck($("relation-content-box"));

	//Sets Focus on first Element
	setTimeout("$('rel-name').focus();",50);

},

relTypeChanged: function(target) {
	var target = $(target);
	
	var typeIdx = target.id.substring(9);
	var rangeId = "rel-range-"+typeIdx;
	
	var attrType = target[target.selectedIndex].text;
	
	var isPage = attrType == gLanguage.getMessage('TYPE_PAGE_WONS');
	var tb = relToolBar.toolbarContainer;
	tb.show(rangeId, isPage);
	if (!isPage) {
		tb.show(rangeId+'-msg', false);
	}
	gSTBEventActions.initialCheck($("relation-content-box"));
	
},

createNewRelation: function() {
	var relName = $("rel-name").value;
	//Check if Inputbox is empty
	if(relName=="" || relName == null ){
		alert(gLanguage.getMessage('INPUT_BOX_EMPTY'));
		return;
    }
	// Create an ontology modifier instance
	var obj = $('rel-type-0');
	var type = obj.options[obj.selectedIndex].text;
	var domain = $("rel-domain").value;
	var range  = (type === gLanguage.getMessage('TYPE_PAGE_WONS'))
					? $("rel-range-0").value : '';

	var minCard = null;
	var mandatory = $("rel-mandatory") || false;
	if (mandatory) {
		mandatory = mandatory.down('input').checked;
		if (mandatory) {
			minCard = 1;
		}
	}
	
	this.om.createRelation(relName,
					       gLanguage.getMessage('CREATE_PROPERTY'),
	                       type, domain, range, minCard);
	//show list
	this.fillList(true);
},


changeItem: function(selindex) {
	this.wtp.initialize();
	//Get new values
	var relName = $("rel-name").value;
	var value = this.getRelationValue();
	var text = $("rel-show").value;

   	//Check if Inputbox is empty
	if(relName=="" || relName == null ){
		alert(gLanguage.getMessage('INPUT_BOX_EMPTY'));
		return;
	}

        //Get relations
        var annotatedElements = this.wtp.getRelations();

	if ((selindex!=null) && ( selindex >=0) && (selindex <= annotatedElements.length)  ){
		var relation = annotatedElements[selindex];
		/*STARTLOG*/
		var oldName = relation.getName();
		var oldValues = relation.getValue();
	    smwhgLogger.log(oldName+":"+oldValues+"->"+relName+":"+value,"STB-Properties","edit_annotation_change");
		/*ENDLOG*/
		if ($("rel-replace-all") && $("rel-replace-all").down('input').checked == true) {
			// rename all occurrences of the relation
			var relations = this.wtp.getRelation(relation.getName());
			for (var i = 0, len = relations.length; i < len; i++) {
				relations[i].rename(relName);
			}
		}
 		//change relation
 		if (relName == gLanguage.getMessage('SUBPROPERTY_OF', 'cont')) {
 			// Property is "Subproperty of" 
 			// => check if the value has the property namespace
 			var propNs = gLanguage.getMessage('PROPERTY_NS', 'cont');
 			if (value.indexOf(propNs) != 0) {
 				value = propNs + value;
 			}
 		}
		relation.update(relName, value, text);
	}

	//show list
	this.fillList(true);
},

deleteItem: function(selindex) {
	this.wtp.initialize();
	//Get relations
	var annotatedElements = this.wtp.getRelations();

	//delete relation
	if (   (selindex!=null)
	    && (selindex >=0)
	    && (selindex <= annotatedElements.length)  ){
		var anno = annotatedElements[selindex];
		var replText = (anno.getRepresentation() != "")
		               ? anno.getRepresentation()
		               : (anno.getValue() != ""
		                  ? anno.getValue()
		                  : "");
		/*STARTLOG*/
	    smwhgLogger.log(anno.getName()+":"+anno.getValue(),"STB-Properties","edit_annotation_delete");
		/*ENDLOG*/
		anno.remove(replText);
	}
	//show list
	this.fillList(true);
},

getselectedItem: function(selindex) {
	this.wtp.initialize();
    var renameAll = "";

	var annotatedElements = this.wtp.getRelations();
	if (   selindex == null
	    || selindex < 0
	    || selindex >= annotatedElements.length) {
		// Invalid index
		return;
	}
	this.showList = false;
	this.currentAction = "editannotation";
	
	var relation = annotatedElements[selindex];
	
	/*STARTLOG*/
    smwhgLogger.log(relation.getName()+":"+relation.getValue(),"STB-Properties","editannotation_clicked");
	/*ENDLOG*/
	
	var tb = this.createToolbar(SMW_REL_ALL_VALID);

	var relations = this.wtp.getRelation(relation.getName());
	if (relations.length > 1) {
	    renameAll = tb.createCheckBox('rel-replace-all', '', [gLanguage.getMessage('RENAME_ALL_IN_ARTICLE')], [], '', true);
	}

	function getSchemaCallback(request) {
		tb.hideSandglass();
		if (request.status != 200) {
			// call for schema data failed, do nothing.
			alert(gLanguage.getMessage('RETRIEVE_SCHEMA_DATA'));
			return;
		}

		var parameterNames = [];

		if (request.responseText != 'noSchemaData') {

			var schemaData = GeneralXMLTools.createDocumentFromString(request.responseText);
			if (schemaData.documentElement.tagName != 'parsererror') {
				// read parameter names
				for (var i = 0, n = schemaData.documentElement.childNodes.length; i < n; i++) {
					parameterNames.push(schemaData.documentElement.childNodes[i].getAttribute("name"));
				}
			}
		}
		if (parameterNames.size() == 0) {
			// schema data could not be retrieved for some reason (property may 
			// not yet exist). Show "Value" as default.
			for (var i = 0; i < relation.getArity()-1; i++) {
		 		parameterNames.push("Value");
			}
		}

		var valueInputs = new Array();
		var inputNames = new Array();
		for (var i = 0; i < relation.getArity()-1; i++) {
			var parName = (parameterNames.length > i) 
							? parameterNames[i]
							: "Page";
			var typeCheck = 'smwCheckType="' + 
			                parName.toLowerCase() + 
			                ': valid' +
	 						'? (color: lightgreen, hideMessage, valid:true)' +
			                ': (color: red, showMessage:INVALID_FORMAT_OF_VALUE, valid:false)" ';

			var obj = tb.createInput('rel-value-'+i, parName, 
									 relation.getSplitValues()[i], '', 
									 typeCheck +
							 		 SMW_REL_VALID_PROPERTY_VALUE +
									 (parName == "Page" ? SMW_REL_HINT_INSTANCE : "") ,true);

			valueInputs.push(obj);
			obj = tb.createText('rel-value-'+i+'-msg', '', '', true);
			valueInputs.push(obj);
			inputNames.push(['rel-value-'+i,relation.getSplitValues()[i]]);
		}
		tb.append(tb.createInput('rel-name', 
								 gLanguage.getMessage('PROPERTY'), '', '', 
								 SMW_REL_CHECK_PROPERTY_UPDATE_SCHEMA +
		                         SMW_REL_CHECK_PROPERTY_ACCESS +
		 						 SMW_REL_CHECK_EMPTY +
		                         SMW_REL_VALID_PROPERTY_NAME +
		 						 SMW_REL_HINT_PROPERTY,
		 						 true));
		tb.setInputValue('rel-name', relation.getName());	                         
		 						 
		tb.append(tb.createText('rel-name-msg', '', '' , true));
		if (renameAll !='') {
			tb.append(renameAll);
		}
		tb.append(valueInputs);
		for (var i = 0; i < inputNames.length; i++) {
			tb.setInputValue(inputNames[i][0],inputNames[i][1]);
		}
		
		// In the Advanced Annotation Mode the representation can not be changed
		var repr = relation.getRepresentation(); 
		if (wgAction == 'annotate') {
			if (repr == '') {
				// embrace further values
				var values = relation.getSplitValues();
				repr = values[0];
				if (values.size() > 1) {
					repr += ' (';
					for (var i = 1; i < values.size(); ++i) {
						repr += values[i];
						if (i < values.size()-1) {
							repr += ","
						}
					}
					repr += ')';
				}
			}
		}
		tb.append(tb.createInput('rel-show', gLanguage.getMessage('SHOW'), repr, '', '', true));
		tb.setInputValue('rel-show', repr);	                         

		var links = [['relToolBar.changeItem('+selindex+')',gLanguage.getMessage('CHANGE'), 'rel-confirm', 
		                                                    gLanguage.getMessage('INVALID_VALUES'), 'rel-invalid'],
					 ['relToolBar.deleteItem(' + selindex +')', gLanguage.getMessage('DELETE')],
					 ['relToolBar.cancel()', gLanguage.getMessage('CANCEL')]
					];
		tb.append(tb.createLink('rel-links', links, '', true));
		
		tb.finishCreation();
		if (wgAction == 'annotate') {
			$('rel-show').disable();
			$('rel-value-0').disable();
		}
		gSTBEventActions.initialCheck($("relation-content-box"));

		//Sets Focus on first Element
		setTimeout("$('rel-name').focus();",50);
	}
	tb.append(tb.createText('rel-help-msg', gLanguage.getMessage('CHANGE_PROPERTY'), '' , true));
	if(relation.getName().strip()!=""){
		this.toolbarContainer.showSandglass('rel-help-msg');
		sajax_do_call('smwf_om_RelationSchemaData', [relation.getName()], getSchemaCallback.bind(this));
	}
}

};// End of Class

window.relToolBar = new RelationToolBar();
stb_control.registerToolbox(relToolBar);	


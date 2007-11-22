/*  Copyright 2007, ontoprise GmbH
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
* 
* @author Thomas Schweitzer
*/
//Constants
var AA_RELATION = 0;
var AA_CATEGORY = 1;
	
var AdvancedAnnotation = Class.create();

/**
 * This class handles selections in the rendered wiki page. It loads the 
 * corresponding wiki text from the server and tries to match HTML and wiki text.
 * Annotations can be added to the wiki text and are highlighted in the rendered
 * page.
 */
AdvancedAnnotation.prototype = {
	
	
	/**
	 * Initializes an instance of this class.
	 */
	initialize: function() {
		// Selection information
		this.annotatedNode = null;
		this.annoOffset = null;
		this.selectedText = '';
		
		// The wiki text parser manages the wiki text and adds annotations 
		this.wikiTextParser = null;
		
		// Load the wiki text for the current page and store it in the parser.
		this.loadWikiText();
		this.annoCount = 10000;
	},
	
	/**
	 * This method is called, when the mouse button is released. The current
	 * selection is retrieved and used as annotation. Only events in div#bodyContent 
	 * are processed
	 */
	onMouseUp: function(event) {
		var target = event.target;
		while (target) {
			if (target.id && target.id == 'bodyContent') {
				break;
			}
			target = target.up('div');
		}
		if (!target) {
			return;
		}
		var annoSelection = this.getSel();
		if (annoSelection != '') {
			// store details of the selection
			this.selectedText = annoSelection.toString();
			//trim selection
			this.selectedText = this.selectedText.replace(/^\s*(.*?)\s*$/,'$1');
			this.annotatedNode = annoSelection.anchorNode;
			this.annoOffset = annoSelection.anchorOffset;
			
			this.performAnnotation();
		}
	},
	
	/**
	 * Tries to find the current selection in the wiki text. If successful, the
	 * corresponding wiki text is augmented with an annotation.
	 */
	performAnnotation: function() {
		var anchor = null;
		var firstAnchor = null;
		var secondAnchor = null;
		
		firstAnchor = this.searchBackwards(this.annotatedNode, this.searchWtoAnchor.bind(this));
		secondAnchor = this.searchForward(this.annotatedNode, this.searchWtoAnchor.bind(this));
		// Check if the marked text is part of a template
		var template = this.searchBackwards(this.annotatedNode, this.searchTemplate.bind(this));
		if (template && $(template).getAttribute('type') == "template"){
			msg = gLanguage.getMessage('WTP_NOT_IN_TEMPLATE');
			msg = msg.replace(/\$1/g, this.selectedText);
			
			alert(msg);
			alert("Name of template: "+ $(template).getAttribute('tmplname'));
			return;
		}
		if (firstAnchor) {
			var start = firstAnchor.getAttribute('name')*1;
			var end = (secondAnchor != null)
						? secondAnchor.getAttribute('name')*1
						: -1;
			var res = this.wikiTextParser.findText(this.selectedText, start, end);
			if (res != true) {
				this.toolbarEnableAnnotation(false);
				smwhgAnnotationHints.showMessageAndWikiText("(e)"+res,
															this.wikiTextParser.text.substring(start,end));
			} else {
				this.toolbarEnableAnnotation(true);
				smwhgAnnotationHints.showMessageAndWikiText(
					"(i)Wikitext found for selection:<br><b>"+this.selectedText+"</b>",
					this.wikiTextParser.text.substring(start,end));
			}
		} else {
			this.toolbarEnableAnnotation(false);
			smwhgAnnotationHints.showMessageAndWikiText("(e)No wiki text found for selection:",
			                                            "<b>"+this.selectedText+"</b>");

		}
	
	},
	
	/**
	 * Enables or disables the annotation actions in the semantic toolbar.
	 * 
	 * @param boolean enable
	 * 		true  => enable actions
	 * 		false => disable actions
	 */
	toolbarEnableAnnotation: function(enable) {
		catToolBar.enableAnnotation(enable);
		relToolBar.enableAnnotation(enable);
	},
	
	searchTemplate: function(node) {
		if (node.tagName == 'A' 
		    && (node.type == "template" || node.type == "templateend")) {
			return node;
		} 
	},
	
	searchWtoAnchor: function(node) {
		if (node.tagName == 'A' 
		    && node.type == "wikiTextOffset"
		    && node.getAttribute('annoType') != 'category') {
			return node;
		} 
	},
		
	/**
	 * Searches recursively backwards from the given node <startNode> to the top
	 * of the document. The document order is traversed in reverse order, visiting
	 * all nodes.
	 */
	searchBackwards: function(startNode, cbFnc, diveDeeper) {
		var node = startNode;
		if (!diveDeeper) {
			// go to the previous sibling or the sibling of a parent node
			while (node) {
				if (node.previousSibling) {
					node = node.previousSibling;
					break;
				}
				node = node.parentNode;
			}
		}	
		while (node) {
			// process all siblings and their children
			if (node.lastChild) {
				var result = this.searchBackwards(node.lastChild, cbFnc, true);
				if (result) {
					return result;
				}
			}
			var result = cbFnc(node);
			if (result) {
				return result;
			} 
			if (node.previousSibling) {
				node = node.previousSibling;
			} else {
				break;
			}
		}
		if (!diveDeeper && node) {
			node = node.parentNode;
			if (node) {
				var result = this.searchBackwards(node, cbFnc);
				if (result) {
					return result;
				}
			}
		}
		return null;
		
	},
	

	/**
	 * Searches recursively forward from the given node <startNode> to the end
	 * of the document. The document order is traversed in normal order, visiting
	 * all nodes.
	 * 
	 * @param DomNode startNode
	 * 		Traversal starts at this node. The callback is not called for it.
	 * @param function cbFnc
	 * 		This callback function is called at each node. Traversal stops,
	 * 		if it returns a value. Signature:
	 * 		returnValue function(DomNode node)
	 * @param boolean diveDeeper
	 * 		Only uses internally. Don't specify this value.
	 */
	searchForward: function(startNode, cbFnc, diveDeeper) {
		var node = startNode;
		if (!diveDeeper) {
			// go to the next sibling or the sibling of a parent node
			while (node) {
				if (node.nextSibling) {
					node = node.nextSibling;
					break;
				}
				node = node.parentNode;
			}
		}	
		while (node) {
			// process all siblings and their children
			if (node.firstChild) {
				var result = this.searchForward(node.firstChild, cbFnc, true);
				if (result) {
					return result;
				}
			}
			var result = cbFnc(node);
			if (result) {
				return result;
			} 
			if (node.nextSibling) {
				node = node.nextSibling;
			} else {
				break;
			}
		}
		if (!diveDeeper && node) {
			node = node.parentNode;
			if (node) {
				var result = this.searchForward(node, cbFnc);
				if (result) {
					return result;
				}
			}
		}
		return null;
		
	},
	
	/**
	 * Gets the current selection from the browser.
	 */
	getSel: function() {
		var txt = '';
		if (window.getSelection) {
			txt = window.getSelection();
		} else if (document.getSelection) {
			txt = document.getSelection();
		} else if (document.selection) {
			txt = document.selection.createRange().text;
		}
		return txt;
	},
	
	/**
	 * @public
	 * 
	 * Loads the current wiki text via an ajax call. The wiki text is stored in
	 * the wiki text parser <this.wikiTextParser>.
	 * 
	 */
	loadWikiText : function() {
		function ajaxResponseLoadWikiText(request) {
			if (request.status == 200) {
				// success => store wikitext
				this.wikiTextParser = new WikiTextParser(request.responseText);
				this.wikiTextParser.addTextChangedHook(this.updateAnchors.bind(this));
				this.wikiTextParser.addCategoryAddedHook(this.categoryAdded.bind(this));
				this.wikiTextParser.addRelationAddedHook(this.relationAdded.bind(this));
				catToolBar.setWikiTextParser(this.wikiTextParser);
				relToolBar.setWikiTextParser(this.wikiTextParser);
				catToolBar.fillList(true);
				relToolBar.fillList(true);
				this.toolbarEnableAnnotation(false);
			} else {
				this.wikiTextParser = null;
			}
		};
		
		sajax_do_call('smwfGetWikiText', 
		              [wgPageName], 
		              ajaxResponseLoadWikiText.bind(this));
		              
		              
	},
	
	/**
	 * This function is a hook for the wiki text parser. It is called after a
	 * category has been added to the wiki text.
	 * The currently selected text is highlighted with a background specific for
	 * categories. The selection is reset.
	 * 
	 * @param int startPos
	 * 		Start position of the new annotation
	 * @param int endPos
	 * 		End position of the new annotation
	 * @param string name
	 * 		Name of the new category.
	 */
	categoryAdded: function(startPos, endPos, name) {
		this.markSelection(AA_CATEGORY, 'aam_new_category_highlight', startPos, endPos);
		catToolBar.fillList();
	},
	
	/**
	 * This function is a hook for the wiki text parser. It is called after a
	 * relation has been added to the wiki text.
	 * The currently selected text is highlighted with a background specific for
	 * relations. The selection is reset.
	 * 
	 * @param int startPos
	 * 		Start position of the new annotation
	 * @param int endPos
	 * 		End position of the new annotation
	 * @param string name
	 * 		Name of the new relation.
	 */
	relationAdded: function(startPos, endPos, name) {
		this.markSelection(AA_RELATION, 'aam_new_anno_prop_highlight', startPos, endPos);
		relToolBar.fillList();
	},

	/**
	 * Embraces the currently selected text with a <span> tag with the css style
	 * <cssClass>.
	 * @param int type
	 * 		The selection is either AA_RELATION or AA_CATEGORY
	 * @param string cssClass
	 * 		Name of the css style that is added as class to the <span> tag.
	 * @param int startPos
	 * 		Wikitextoffset of the new annotation's start that has been created 
	 * 		for the	selection.
	 * @param int endPos
	 * 		Wikitextoffset of the new annotation's end.
	 */
	markSelection: function(type, cssClass, startPos, endPos) {
		var imgPath = wgScriptPath + "/extensions/SMWHalo/skins/Annotation/images/"
		var annoDeco =
			'<a href="javascript:AdvancedAnnotation.smwhfEditAnno('+this.annoCount+')">'+
			((type == AA_RELATION) 
				? '<img src="' + imgPath + 'edit.gif"/>'
				: "" ) +
			'</a>' +
			'<span id="anno'+this.annoCount+'" class="'+cssClass+'">'+this.selectedText+'</span>'+
			'<a href="javascript:AdvancedAnnotation.smwhfDeleteAnno('+this.annoCount+')">'+
   			'<img src="' + imgPath + 'delete.png"/></a>';
   		if (this.selectedText.length <= 20) {
			annoDeco = '<span id="anno'+this.annoCount+'w" style="white-space:nowrap">'+
						annoDeco +
						'</span>';
   		} else {
			annoDeco = '<span id="anno'+this.annoCount+'w">'+
						annoDeco +
						'</span>';   			
   		}
   		
   		var annoType = (type == AA_RELATION) 
   						? 'annoType="relation"'
   						: 'annoType="category"';
   						
   		annoDeco = '<a type="wikiTextOffset" name="'+startPos+'" '+annoType+'></a>' 
   		           + annoDeco
   		           + '<a type="wikiTextOffset" name="'+endPos+'" '+annoType+'></a>';
   		
		var parentNode = this.annotatedNode.parentNode;
		var node = this.annotatedNode; // node is probably a text node 
		var origText = node.textContent;
		if (origText.indexOf(this.selectedText) < 0) {
			// node is not a text node i.e. it does not contain the selected
			// text => the parent node should contain the selection
			node = parentNode;
			origText = node.innerHTML;
			var newText = origText.replace(this.selectedText, annoDeco);
			node.innerHTML = newText;
		} else {
			// find the selected text in the text node after the position specified
			// by the selection
			var newText = origText.substring(0, this.annoOffset);
			newText += origText.substring(this.annoOffset)
			                   .replace(this.selectedText, annoDeco);
			// create a DOM structure for the text that is now surrounded by a <span>
			newText = Object.toHTML(newText);
			var range = parentNode.ownerDocument.createRange();
			range.selectNode(parentNode);
			newText.evalScripts.bind(newText).defer();
			newText = range.createContextualFragment(newText.stripScripts());
			// replace the original text node with the highlighted node
			parentNode.replaceChild(newText, node);
		}
		// reset selection information
		this.annotatedNode = null;
		this.annoOffset = 0;
		
		this.annoCount++;
		
	},
	
	/**
	 * This function is a hook for changed text in the wiki text parser. 
	 * It updates the anchors with the wiki text offsets in the DOM after text
	 * has been added or removed.
	 * 
	 * @param array<int>[3] textModifications
	 * 			[0]: start index of replacement in original text
	 * 			[1]: end index of replacement in original text
	 * 			[2]: length of inserted text 
	 */
	updateAnchors: function(textModifications) {
								
//		alert("Added at: "+textModifications.toString());
		if (textModifications) {
			// update anchors
			var start = textModifications[0];
			var end = textModifications[1];
			var len = textModifications[2];
			
			var offset = len - (end-start);
			// get all anchors of type "wikiTextOffset"			
			var anchors = $('bodyContent').getElementsBySelector('a[type="wikiTextOffset"]')
			for (var i = 0; i < anchors.size(); ++i) {
				var val = anchors[i].getAttribute('name')*1;
				if (val > start) {
					anchors[i].setAttribute('name', val+offset);
				}
			}
		}
	},
	
	/**
	 * Deletes an annotation. The <span> that highlights the text and annotation in 
	 * the wiki text are removed.
	 * 
	 * @param int id
	 * 		Each <span> has a unique id that is composed of "anno" and this counter.
	 * 
	 */
	deleteAnnotation: function(id) {
		// The highlighted text is embedded in a span with the given id
		var span = $('anno'+id);
		if (!span) {
			return alert("Corresponding annotation not found.");
		}
		// There is always a wrapper span around the span.
		var wrapper = span.up();
		
		var htmlContent = "";
		var content = "";
		var link = span.down();
		if (link && link.tagName == 'A') {
			// the span contains a link => remove the link as well
			htmlContent = link.innerHTML
			content = link.textContent;
		} else {
			htmlContent = span.innerHTML
			content = span.textContent;
		}
		
		// There is a wiki text offset anchor before the wrapper span.
		var wtoAnchor = wrapper.previous('a[type="wikiTextOffset"]');
		var nextWtoAnchor = wtoAnchor.next('a[type="wikiTextOffset"]');
		var annotationStart = wtoAnchor.getAttribute("name")*1;
		
		// replace the wrapper by the content i.e. create normal text
		wrapper.replace(htmlContent);
		
		// remove the wiki text offset anchor around the annotation
		var type = wtoAnchor.getAttribute("annoType");
		
		if (wtoAnchor.getAttribute("name") != "0") {
			// do not remove the very first anchor
			wtoAnchor.remove();
		}
		nextWtoAnchor.remove();
		
		// Remove the annotation from the wiki text
		var annotations = (type && type == 'category')
							? this.wikiTextParser.getCategories()
							: this.wikiTextParser.getRelations();
		for (var i = 0; i < annotations.length; ++i) {
			var anno = annotations[i];
			if (anno.getStart() == annotationStart) {
				anno.remove(content);
				break;
			}
		}
		
		if (type && type == 'category') {
			catToolBar.fillList();
		} else {
			relToolBar.fillList();
		}

	}
};// End of Class

AdvancedAnnotation.create = function() {
	if (wgAction == "annotate") {
		smwhgAdvancedAnnotation = new AdvancedAnnotation();
			new PeriodicalExecuter(function(pe) {
				var content = $('content');
				Event.observe(content, 'mouseup', 
				              smwhgAdvancedAnnotation.onMouseUp.bindAsEventListener(smwhgAdvancedAnnotation));
				pe.stop();
		}, 2);
	}
	
};

AdvancedAnnotation.smwhfEditAnno = function(id) {
	alert(id);
};

/**
 * Deletes an annotation. The <span> that highlights the text and annotation in 
 * the wiki text are removed.
 * 
 * @param int id
 * 		Each <span> has a unique id that is composed of "anno" and this counter.
 * 
 */
AdvancedAnnotation.smwhfDeleteAnno = function(id) {
	smwhgAdvancedAnnotation.deleteAnnotation(id);
};

AdvancedAnnotation.smwhfEditLink = function(id) {
	alert(id);
	
};


var smwhgAdvancedAnnotation = null;
Event.observe(window, 'load', AdvancedAnnotation.create);

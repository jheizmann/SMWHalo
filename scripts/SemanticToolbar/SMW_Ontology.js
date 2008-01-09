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
*/
/**
* SMW_Ontology.js
* 
* Helper functions for the creation/modification of ontologies.
* 
* @author Thomas Schweitzer
*
*/

var OntologyModifier = Class.create();

/**
 * Class for modifying the ontology. It supports
 * - creating new articles
 * - creating sub-attributes and sub-relations of the current article
 * - creating super-attributes and super-relations of the current article
 * 
 */
OntologyModifier.prototype = {

	/**
	 * @public
	 * 
	 * Constructor.
	 */
	initialize: function() {
		this.redirect = false;
		
		// Array of hooks that are called, when the ajax call in <editArticle>
		// returns
		this.editArticleHooks = new Array();
	},

	/**
	 * @public
	 * 
	 * Adds a hook function that is called, when the ajax call in <editArticle>
	 * returns.
	 * 
	 * @param function hook
	 * 		The hook function. It must have this signature:
	 * 		hook(boolean success, boolean created, string title)
	 * 			success: <true> if the article was successfully edited
	 * 			created: <true> if the article has been created
	 * 			title: Title of the article		
	 */
	addEditArticleHook: function(hook) {
		this.editArticleHooks.push(hook);
	},

	/**
	 * @public
	 * 
	 * Checks if an article exists in the wiki. This is an asynchronous ajax call.
	 * When the result is returned, the function <callback> will be called.
	 * The existence will not be checked, if the page name is too long.
	 * 
	 * @param string pageName 
	 * 			Full page name of the article.
	 * @param function callback
	 * 			This function will be called, when the ajax call returns. Its
	 * 			signature must be:
	 * 			callback(string title, bool articleExists)
	 * @param string title
	 * 			Title of the Page without Namespace  
	 * @param string optparam
	 * 			An optional parameter which will be passed through to the
	 *  		callbackfunktion 
	 * @param string domElementID
	 * 			Id of the DOM element that started the query. Will be passed
	 * 			through to the callbackfunktion.
	 * @return boolean
	 * 		true, if the existence of the article will be checked
	 * 		false, if the <pageName> is longer than 254 characters.
	 */
	existsArticle : function(pageName, callback, title, optparam, domElementID) {
		function ajaxResponseExistsArticle(request) {
			var answer = request.responseText;
			var regex = /(true|false)/;
			var parts = answer.match(regex);
			
			if (parts == null) {
				// Error while querying existence of article, probably due to 
				// invalid article name => article does not exist
				callback(pageName, false, title, optparam, domElementID);
/*				var errMsg = gLanguage.getMessage('ERR_QUERY_EXISTS_ARTICLE');
				errMsg = errMsg.replace(/\$-page/g, pageName);
				alert(errMsg);
*/ 
				return;
			}
			callback(pageName, parts[1] == 'true' ? true : false, title, optparam, domElementID);
			
		};
		
		if (pageName.length < 255) {
			sajax_do_call('smwfExistsArticle', 
			              [pageName], 
			              ajaxResponseExistsArticle.bind(this));
			return true;
		} else {
			return false;
		}
		              
		              
	},

	/**
	 * @public
	 * 
	 * Creates a new article in the wiki or appends some text if it already 
	 * exists.
	 * 
	 * @param string title 
	 * 			Title of the article.
	 * @param string initialContent 
	 * 			Initial content of the article. This is only set, if the article
	 * 			is newly created.
	 * @param string optionalText 
	 * 			This text is appended to the article, if it is not already part
	 * 			of it. The text may contain variables of the PHP-language files 
	 * 			that are replaced by their representation.
	 * @param string creationComment
	 * 			This text describes why the article has been created. 
	 * @param bool redirect If <true>, the system asks the user, if he he wants 
	 * 			to be redirected to the new article after its creation.
	 */
	createArticle : function(title, content, optionalText, creationComment,
	                         redirect) {
		this.redirect = redirect;
		sajax_do_call('smwfCreateArticle', 
		              [title, content, optionalText, creationComment], 
		              this.ajaxResponseCreateArticle.bind(this));
		              
	},
	
	/**
	 * @public
	 * 
	 * Replaces the complete content of an article in the wiki. If the article
	 * does not exist, it will be created.
	 * 
	 * @param string title 
	 * 			Title of the article.
	 * @param string content 
	 * 			New content of the article.
	 * @param string editComment
	 * 			This text describes why the article has been edited. 
	 * @param bool redirect If <true>, the system asks the user, if he he wants 
	 * 			to be redirected to the new article after its creation.
	 */
	editArticle : function(title, content, editComment, redirect) {
		this.redirect = redirect;
		sajax_do_call('smwfEditArticle', 
		              [title, content, editComment], 
		              this.ajaxResponseEditArticle.bind(this));
	},

	/**
	 * @public
	 * 
	 * Touches the article with the given title, i.e. the article's HTML-cache is
 	 * invalidated.
	 * 
	 * @param string title 
	 * 			Title of the article.
	 */
	touchArticle : function(title) {
		function touchArticleCallback(request) {
			
		};
		
		sajax_do_call('smwfTouchArticle', [title], touchArticleCallback.bind(this));
	},
	
	/**
	 * @public
	 * 
	 * Creates a new article that defines an attribute.
	 * 
	 * @param string title 
	 * 			Name of the new article/attribute without the namespace.
	 * @param string initialContent
	 * 			Initial content of the article.
	 * @param string domain
	 * 			Domain of the attribute.
	 * @param string type
	 * 			Type of the attribute.
	 */
	createAttribute : function(title, initialContent, domain, type) {
		var schema = "";
		if (domain != null && domain != "") {
			schema += "\n[[SMW_SSP_HAS_DOMAIN_HINT::"+gLanguage.getMessage('CATEGORY')+domain+"]]";
		}
		if (type != null && type != "") {
			schema += "\n[[SMW_SP_HAS_TYPE::"+gLanguage.getMessage('TYPE')+type+"]]";
		}
		this.createArticle(gLanguage.getMessage('PROPERTY')+title, 
						   initialContent, schema,
						   "Create a property for category " + domain, true);
	},
	
	/**
	 * @public
	 * 
	 * Creates a new article that defines a relation.
	 * 
	 * @param string title 
	 * 			Name of the new article/relation without the namespace.
	 * @param string initialContent
	 * 			Initial content of the article.
	 * @param string domain
	 * 			Domain of the relation.
	 * @param string range
	 * 			Range of the relation.
	 */
	createRelation : function(title, initialContent, domain, ranges) {
		var schema = "";
		if (domain != null && domain != "") {
			schema += "\n[[SMW_SSP_HAS_DOMAIN_HINT::"+gLanguage.getMessage('CATEGORY')+domain+"]]";
		}
		if (ranges != null) {
			if (ranges.length >= 1) {
				var rangeStr = "\n[[SMW_SP_HAS_TYPE:="
				for(var i = 0, n = ranges.length; i < n; i++) {
					if (ranges[i].indexOf(gLanguage.getMessage('TYPE')) == 0) {
						rangeStr += ranges[i];
					} else {
						rangeStr += gLanguage.getMessage('TYPE_PAGE');
						if (ranges[i]) {
							// Range hint is not empty
							schema += "\n[[SMW_SSP_HAS_RANGE_HINT::"+ranges[i]+"]]";
						} else {
							// no range hint. Anyway a hint must be given.
							schema += "\n[[SMW_SSP_HAS_RANGE_HINT::" +
							          gLanguage.getMessage('CATEGORY') +
							          gLanguage.getMessage('DEFAULT_ROOT_CONCEPT') +
							          "]]";
						}
					}
					if (i < n-1) {
						rangeStr += ';';
					}
			 	}
			 	schema += rangeStr+"]]";
			} 
		}
		
		this.createArticle(gLanguage.getMessage('PROPERTY')+title, 
						   initialContent, schema,
						   gLanguage.getMessage('CREATE_PROP_FOR_CAT').replace(/\$cat/g, domain),
						   true);
	},
	
	/**
	 * @public
	 * 
	 * Creates a new article that defines a category.
	 * 
	 * @param string title 
	 * 			Name of the new article/category without the namespace.
	 * @param string initialContent
	 * 			Initial content of the article.
	 */
	createCategory : function(title, initialContent) {
		this.createArticle(gLanguage.getMessage('CATEGORY')+title, 
						   initialContent, "",
						   gLanguage.getMessage('CREATE_CATEGORY'), true);
	},
	
	/**
	 * @public
	 * 
	 * Creates a sub-property of the current article, which must be an attribute
	 * or a relation. If not, an alert box is presented.
	 * 
	 * @param string title 
	 * 			Name of the new article (sub-property) without the namespace.
	 * @param string initialContent
	 * 			Initial content of the article for the sub-property.
	 * @param boolean openNewArticle
	 * 			If <true> or not specified, the newly created article is opened
	 *          in a new tab.
	 */
	createSubProperty : function(title, initialContent, openNewArticle) {
		if (openNewArticle == undefined) {
			openNewArticle = true;
		}
		var schemaProp = this.getSchemaProperties();
		if (   wgNamespaceNumber == 102    // SMW_NS_PROPERTY
		    || wgNamespaceNumber == 100) { // SMW_NS_RELATION
			this.createArticle(gLanguage.getMessage('PROPERTY')+title, 
							 initialContent, 
							 schemaProp + 
							 "\n[[SMW_SP_SUBPROPERTY_OF::"+wgPageName+"]]",
							 gLanguage.getMessage('CREATE_SUB_PROPERTY'), 
							 openNewArticle);
			
		} else {
			alert(gLanguage.getMessage('NOT_A_PROPERTY'))
		}
		
	},
	
	/**
	 * @public
	 * 
	 * Creates a super-property of the current article, which must be an attribute
	 * or a relation. If not, an alert box is presented. The current article is 
	 * augmented with the corresponding annotation.
	 * 
	 * @param string title 
	 * 			Name of the new article (super-property) without the namespace.
	 * @param string initialContent
	 * 			Initial content of the article for the super-property.
	 * @param boolean openNewArticle
	 * 			If <true> or not specified, the newly created article is opened
	 *          in a new tab.
	 * @param WikiTextParser wtp
	 * 			If given, this parser is used to annotate the current article.
	 * 			Otherwise a new one is created.
	 */
	createSuperProperty : function(title, initialContent, openNewArticle, wtp) {
		if (openNewArticle == undefined) {
			openNewArticle = true;
		}
		var schemaProp = this.getSchemaProperties();
		if (!wtp) {
			wtp = new WikiTextParser();
		}
		if (   wgNamespaceNumber == 102 // SMW_NS_PROPERTY
		    || wgNamespaceNumber == 100) {  // SMW_NS_RELATION
			this.createArticle(gLanguage.getMessage('PROPERTY')+title, 
							 initialContent, 
							 schemaProp,
							 gLanguage.getMessage('CREATE_SUPER_PROPERTY'), 
							 openNewArticle);
							 
			// append the sub-property annotation to the current article
			wtp.addRelation("subproperty of", gLanguage.getMessage('PROPERTY')+title, "", true);
			
		} else {
			alert(gLanguage.getMessage('NOT_A_PROPERTY'));
		}
				
	},
	
	/**
	 * @public
	 * 
	 * Creates a super-category of the current article, which must be category. 
	 * If not, an alert box is presented. The current article is 
	 * augmented with the corresponding annotation.
	 * 
	 * @param string title 
	 * 			Name of the new article (super-category) without the namespace.
	 * @param string initialContent
	 * 			Initial content of the article for the super-category.
	 * @param boolean openNewArticle
	 * 			If <true> or not specified, the newly created article is opened
	 *          in a new tab.
	 * @param WikiTextParser wtp
	 * 			If given, this parser is used to annotate the current article.
	 * 			Otherwise a new one is created.
	 */
	createSuperCategory : function(title, initialContent, openNewArticle, wtp) {
		if (openNewArticle == undefined) {
			openNewArticle = true;
		}
		if (!wtp) {
			wtp = new WikiTextParser();
		}
		if (wgNamespaceNumber == 14) {
			this.createArticle(gLanguage.getMessage('CATEGORY')+title, initialContent, "",
							   gLanguage.getMessage('CREATE_SUPER_CATEGORY'), 
							   openNewArticle);
							 
			// append the sub-category annotation to the current article
			wtp.addCategory(title, "", true);
		} else {
			alert(gLanguage.getMessage('NOT_A_CATEGORY'))
		}
				
	},
	
	/**
	 * @public
	 * 
	 * Creates a sub-category of the current article, which must be category. 
	 * If not, an alert box is presented. The new article is 
	 * augmented with the corresponding annotation.
	 * 
	 * @param string title 
	 * 			Name of the new article (sub-category) without the namespace.
	 * @param string initialContent
	 * 			Initial content of the article for the sub-category.
	 */
	createSubCategory : function(title, initialContent) {
		if (wgNamespaceNumber == 14) {
			this.createArticle(gLanguage.getMessage('CATEGORY')+title, initialContent, 
			                   "[["+gLanguage.getMessage('CATEGORY')+wgTitle+"]]",
							   gLanguage.getMessage('CREATE_SUB_CATEGORY'), true);			
		} else {
			alert(gLanguage.getMessage('NOT_A_CATEGORY'))
		}
				
	},
	
	
	/**
	 * @private
	 * 
	 * Retrieves all relevant schema properties of the current article and
	 * collects all their wiki text representations in one string. 
	 * 
	 * @return string A string with all schema properties of the current article.
	 */
	getSchemaProperties : function() {
		var wtp = new WikiTextParser();
		var props = new Array();
		props.push(wtp.getRelation("has type"));
		props.push(wtp.getRelation("Has domain hint"));
		props.push(wtp.getRelation("Has range hint"));
		props.push(wtp.getRelation("Has max cardinality"));
		props.push(wtp.getRelation("Has min cardinality"));
		
		var schemaAnnotations = "";
		for (var typeIdx = 0, nt = props.length; typeIdx < nt; ++typeIdx) {
			var type = props[typeIdx];
			if (type != null) {
				for (var annoIdx = 0, na = type.length; annoIdx < na; ++annoIdx) {
					var anno = type[annoIdx];
					schemaAnnotations += anno.getAnnotation() + "\n";
				}
			}
		}
		var transitive = wtp.getCategory("Transitive relations");
		var symmetric = wtp.getCategory("Symmetrical relations");
		
		if (transitive) {
			schemaAnnotations += transitive.getAnnotation() + "\n";
		}
		if (symmetric) {
			schemaAnnotations += symmetric.getAnnotation() + "\n";
		}

		return schemaAnnotations;
	},

	/**
	 * This function is called when the ajax request for the creation of a new
	 * article returns. The answer has the following format:
	 * bool, bool, string
	 * - The first boolean signals success (true) of the operation.
	 * - The second boolean signals that a new article has been created (true), or
	 *   that it already existed(false).
	 * - The string contains the name of the (new) article.
	 * 
	 * @param request Created by the framework. Contains the ajax request and
	 *                its result.
	 * 
	 */
	ajaxResponseCreateArticle: function(request) {
		if (request.status != 200) {
			alert(gLanguage.getMessage('ERROR_CREATING_ARTICLE'));
			return;
		}
		
		var answer = request.responseText;
		var regex = /(true|false),(true|false),(.*)/;
		var parts = answer.match(regex);
		
		if (parts == null) {
			alert(gLanguage.getMessage('ERROR_CREATING_ARTICLE'));
			return;
		}
		
		var success = parts[1];
		var created = parts[2];
		var title = parts[3];
		
		if (success == "true") {
			if (this.redirect) {
				// open the new article in another tab.
				window.open("index.php?title="+title,"_blank");
			}
		}
	},
	
	/**
	 * This function is called when the ajax request for changing an
	 * article returns. The answer has the following format:
	 * bool, bool, string
	 * - The first boolean signals success (true) of the operation.
	 * - The second boolean signals that a new article has been created (true), or
	 *   that it already existed(false).
	 * - The string contains the name of the (new) article.
	 * 
	 * @param request Created by the framework. Contains the ajax request and
	 *                its result.
	 * 
	 */
	ajaxResponseEditArticle: function(request) {
		if (request.status != 200) {
			alert(gLanguage.getMessage('ERROR_EDITING_ARTICLE'));
			return;
		}
		
		var answer = request.responseText;
		var regex = /(true|false),(true|false),(.*)/;
		var parts = answer.match(regex);
		
		if (parts == null) {
			alert(gLanguage.getMessage('ERROR_EDITING_ARTICLE'));
			return;
		}
		
		var success = parts[1];
		var created = parts[2];
		var title = parts[3];
		
		if (success == "true") {
			if (this.redirect) {
				// open the new article in another tab.
				window.open("index.php?title="+title,"_blank");
			}
		}
		
		success = (success == 'true');
		created = (created == 'true');
		for (var i = 0; i < this.editArticleHooks.length; ++i) {
			this.editArticleHooks[i](success, created, title);
		}
	}
	

}

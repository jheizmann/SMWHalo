/*
 * Copyright (C) Vulcan Inc.
*
 * This program is free software; you can redistribute it and/or modify
*   it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
*   (at your option) any later version.
*
 * This program is distributed in the hope that it will be useful,
*   but WITHOUT ANY WARRANTY; without even the implied warranty of
*   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
*   GNU General Public License for more details.
*
 * You should have received a copy of the GNU General Public License along
 * with this program.If not, see <http://www.gnu.org/licenses/>.
 *
*/
/**
*  @file
* 
*  @ingroup SMWHaloLanguage
*/

window.wgUserLanguageStrings = {
	'MUST_NOT_BE_EMPTY'       : '(e)This input field must not be empty.',
	'VALUE_IMPROVES_QUALITY'  : '(i)A value in this input field improves the quality of the knowledge base.',
	'SELECTION_MUST_NOT_BE_EMPTY' : '(e)The selection must not be empty!',
	'INVALID_FORMAT_OF_VALUE' : '(e)The value has an invalid format.',
	'INVALID_VALUES'          : 'Invalid values.',
	'EditProperty'            : 'Edit property :',
	'NAME'                    : 'Name:',
	'SUBCATEGORYOF'           : 'Subcategory of: (comma-separated)',
	'ANNOTATED_CATEGORIES'     : 'Annotated categories: (comma-separated)',
	'AddCategory'             : 'Add',
	'ENTER_NAME'              : 'Please enter a name.',
	'ADD'                     : 'Add',
	'INVALID_VALUES'          : 'Invalid values.',
	'CANCEL'                  : 'Cancel',
	'CREATE'                  : 'Create',
	'EDIT'                    : 'Edit',
	'ANNOTATE'                : 'Annotate',
	'SUB_SUPER'               : 'Sub/Super',
	'INVALID_NAME'            : 'Invalid name.',
	'CHANGE'                  : 'Change',
	'DELETE'                  : 'Delete',
	'INPUT_BOX_EMPTY'         : 'Error! Input box is empty.',
	'ERR_QUERY_EXISTS_ARTICLE' : 'Error while querying existence of article <$-page>.',
	'CREATE_PROP_FOR_CAT'     : 'This property was created for category <$cat>. Please enter meaningful content.',
	'NOT_A_CATEGORY'          : 'The current article is not a category.',
	'CREATE_CATEGORY'         : 'This category has been created but not edited. Please enter meaningful content.',
	'CREATE_SUPER_CATEGORY'   : 'This category has been created as super-category but not edited. Please enter meaningful content.',
	'CREATE_SUB_CATEGORY'     : 'This category has been created as sub-category but not edited. Please enter meaningful content.',
	'NOT_A_PROPERTY'          : 'The current article is not a property.',
	'CREATE_PROPERTY'         : 'This property has been created but not edited. Please enter meaningful content.',
	'CREATE_SUB_PROPERTY'     : 'This article has been created as sub-property. Please enter meaningful content.',
	'CREATE_SUPER_PROPERTY'   : 'This article has been created as super-property. Please enter meaningful content.',
	'ERROR_CREATING_ARTICLE'  : "Error while creating article.",
	'ERROR_EDITING_ARTICLE'   : "Error while editing article.",
	'UNMATCHED_BRACKETS'      : 'Warning! The article contains syntax errors ("]]" missing)',
	'MAX_CARD_MUST_NOT_BE_0'  : "(e)Max. cardinality must not be 0 or less!",
	'SPECIFY_CARDINALITY'     : "(e)Please specify this cardinality!",
	'MIN_CARD_INVALID'        : "(e)Min. cardinality must be smaller than max. cardinality!",
	'ASSUME_CARDINALITY_0'    : "(i) Min. cardinality is assumed to be 0.",
	'ASSUME_CARDINALITY_INF'  : "(i) Max. cardinality is assumed to be ∞.",

	// Namespaces
	'NS_SPECIAL' 			  : 'Special',

	// Relation toolbar
	'ANNOTATE_PROPERTY'       : 'Annotate a property.',
	'PAGE'                    : 'Page:',
	'ANNO_PAGE_VALUE'         : 'Annotated page/value',
	'SHOW'                    : 'Show:',
	'DEFINE_SUB_SUPER_PROPERTY' : 'Define a sub- or super-property.',
	'CREATE_NEW_PROPERTY'     : 'Create a new property.',
	'ENTER_DOMAIN'            : 'Enter a domain.',
	'ENTER_RANGE'             : 'Enter a range.',
	'ENTER_TYPE'              : 'Select a type.',
	'RENAME_ALL_IN_ARTICLE'   : 'Rename all in this article.',
	'CHANGE_PROPERTY'         : 'Change a property.',
	'PROPERTIES'              : 'Properties',
	'RETRIEVE_SCHEMA_DATA'    : 'Failed to retrieve schema Data!',
	'RECPROP'                 : "Recommended properties",
	

	// Property characteristics toolbar
	'PROPERTY_DOES_NOT_EXIST' : '(w)This property does not exist.',
	'PROPERTY_ALREADY_EXISTS' : '(w)This property already exists.',
	'PROPERTY_NAME_TOO_LONG'  : '(e)The name of this property is too long or contains invalid characters.',
	'PROPERTY_VALUE_TOO_LONG' : '(w)This value is very long. It will only be stored by properties of type "Type:Text".',
	'PROPERTY_ACCESS_DENIED'  : '(e)You are not authorized to annotate this property.',	
	'PROPERTY_ACCESS_DENIED_TT': 'You are not authorized to annotate this property.',	
	'CANT_SAVE_FORBIDDEN_PROPERTIES': 'The article contains write protected properties and can not be saved.',
	'CREATE_SUPER_PROPERTY'   : 'Create "$-title" and make "$sftt" super-property of "$-title"',
	'CREATE_SUB_PROPERTY'     : 'Create "$-title" and make "$sftt" sub-property of "$-title"',
	'MAKE_SUPER_PROPERTY'     : 'Make "$sftt" super-property of "$-title"',
	'MAKE_SUB_PROPERTY'       : 'Make "$sftt" sub-property of "$-title"',
	'ADD_RECORD_FIELD'        : 'Add property to record',
	'ADD_DOMAIN_RANGE'        : 'Add domain and range',
	'DOMAIN'                  : 'Domain:',
	'RANGE'                   : 'Range:',
	'INVERSE_OF'              : 'Inverse of:',
	'Mandatory'               : 'Mandatory:',
	'TRANSITIVE'              : 'Transitive',
	'SYMMETRIC'               : 'Symmetric',
	'RETRIEVING_DATATYPES'    : 'Retrieving data types...',
	'NARY_ADD_TYPES'		  : '(e) Please add types or ranges.',
	'REMOVE_DOMAIN_RANGE'	  : 'Remove this domain and range',
	'DUPLICATE_RECORD_FIELD'  : '(w)This property appears several times in the record. The order of annotated values will not be deterministic.',
	
	'PROPERTY_PROPERTIES'     : "Property Characteristics",
	
	
	'PAGE_TYPE'               : "page",		// name of the page data type
	'NARY_TYPE'               : "n-ary",       // name of the n-ary data type
	'SPECIFY_PROPERTY'		  : "Annotate a property",
	'PC_DUPLICATE'			  : "At least one property is specified several times. Please remove the duplicates.",
	'PC_HAS_TYPE'			  : "has type", 
	'PC_HAS_FIELDS'			  : "Property", 
	'PC_MIN_CARD'			  : "Min. cardinality",
	'PC_MAX_CARD'			  : "Max. cardinality",
	'PC_INVERSE_OF'			  : "Is inverse of", 
	'PC_INVERSE'			  : "inverse", 
	'PC_TRANSITIVE'			  : "transitive", 
	'PC_SYMMETRICAL'		  : "symmetrical", 
	'PC_AND'			 	  : "and", 
	'PC_UNSUPPORTED'		  : "This wiki does not support $1 properties.",
	

	// Category toolbar
	'ANNOTATE_CATEGORY'       : 'Annotate a category',
	'CATEGORY_DOES_NOT_EXIST' : '(w)This category does not exist.',
	'CATEGORY_ALREADY_EXISTS' : '(w)This category already exists.',
	'CATEGORY_NAME_TOO_LONG'  : '(e)The name of this category is too long or contains invalid characters.',
	'CREATE_SUPER_CATEGORY'   : 'Create "$-title" and make "$sftt" super-category of "$-title"',
	'CREATE_SUB_CATEGORY'     : 'Create "$-title" and make "$sftt" sub-category of "$-title"',
	'MAKE_SUPER_CATEGORY'     : 'Make "$sftt" super-category of "$-title"',
	'MAKE_SUB_CATEGORY'       : 'Make "$sftt" sub-category of "$-title"',
	'DEFINE_SUB_SUPER_CAT'    : 'Define a sub- or super-category.',
	'CREATE_SUB'              : 'Create sub',
	'CREATE_SUPER'            : 'Create super',
	'CREATE_NEW_CATEGORY'     : 'Create a new category.',
	'CHANGE_ANNO_OF_CAT'      : 'Change the annotation of a category.',
	'CATEGORIES'              : 'Categories',
	'ADD_AND_CREATE_CAT'      : 'Add and create',
	'CATEGORY_ALREADY_ANNOTATED': '(w)This category is already annotated.',

	// Annotation hints
	'ANNOTATION_HINTS'        : 'Annotation hints',
	'ANNOTATION_ERRORS'       : 'Annotation errors',
	'AH_NO_HINTS'			  : '(i)No hints for this article.',
	'AH_SAVE_COMMENT'		  : 'Annotations added in the Advanced Annotation Mode.',
	'AAM_SAVE_ANNOTATIONS' 	  : 'Do you want to save the annotations of the current session?',
	'CAN_NOT_ANNOTATE_SELECTION' : 'You can not annotate the selection. It already contains annotations or paragraphs or ends in a link.',
	'AAM_DELETE_ANNOTATIONS'  : 'Do you really want to delete this annotation?',
	
	// Save annotations
	'SA_SAVE_ANNOTATION_HINTS': "Don't forget to save your work!",
	'SA_SAVE_ANNOTATIONS'	  : 'Save annotations',
	'SA_SAVE_ANNOTATIONS_AND_EXIT' : 'Save & exit',
	'SA_ANNOTATIONS_SAVED'	  : '(i) The annotations were successfully saved.',
	'SA_SAVING_ANNOTATIONS_FAILED' : '(e) An error occurred while saving the annotations.',
	'SA_SAVING_ANNOTATIONS'   : '(i) Saving annotations...',

	// Queries in STB
	'QUERY_HINTS'			  : 'Inline queries',
	'NO_QUERIES_FOUND'		  : '(i) No queries found in this article',

	// Autocompletion
	'AUTOCOMPLETION_HINT'     : 'Press Ctrl+Alt+Space to use auto-completion. (Ctrl+Space in IE)',
	'WW_AUTOCOMPLETION_HINT'  : '- supported in the Wiki text mode only.',
	'AC_CLICK_TO_DRAG'        : 'Auto-Completion',
	'AC_MORE_RESULTS_AVAILABLE' : 'Too many results...',
	'AC_MORE_RESULTS_TOOLTIP' : 'Too many results. Please expand your search term to get less results.',
	'AC_NO_RESULTS': 'No results',
	'AC_ALL' : 'Auto-completion for all pages',
	'AC_QUERY' : 'ASK-Query',
	'AC_SCHEMA_PROPERTY_DOMAIN' : 'All properties with domain: ',
	'AC_SCHEMA_PROPERTY_WITHSAME_DOMAIN' : 'All properties with same domain',
	'AC_SCHEMA_PROPERTY_RANGE_INSTANCE' : 'All properties which have a range-instance of: ',
	'AC_DOMAINLESS_PROPERTY' : 'All properties without domain',
	'AC_ANNOTATION_PROPERTY' : 'Properties which are used on pages of category: ',
	'AC_ANNOTATION_VALUE' : 'All properties with value annotated: ',
	'AC_INSTANCE_PROPERTY_RANGE' : 'All instances which are member of range: ',
	'AC_NAMESPACE' : 'All pages in namespace(s): ',
	'AC_LEXICAL' : 'All pages containing: ',
	'AC_SCHEMA_PROPERTY_TYPE' : 'All properties of type: ',
	'AC_ASF' : 'Categories for which automatic semantic forms can be created',
	'AC_FROM_BUNDLE' : 'Pages coming from bundle: ',
	

	// Combined search
	'ADD_COMB_SEARCH_RES'     : 'Additional Combined Search results.',
	'COMBINED_SEARCH'         : 'Combined Search',

	'INVALID_GARDENING_ACCESS' : 'You are not allowed to cancel bots. Only sysops and gardeners can do so.',
	'GARDENING_LOG_COLLAPSE_ALL' : 'Collapse All',
	'GARDENING_LOG_EXPAND_ALL'   : 'Expand All',
	'BOT_WAS_STARTED'			: 'The bot has been started!',
	
	// Data Explorer
	'OB_ID'					  : 'DataExplorer',
	'ONTOLOGY_BROWSER'        : 'Data Explorer',
	
	'KS_NOT_SUPPORTED'        : 'Konqueror is not supported currently!',
	'SHOW_INSTANCES'          : 'Show instances',
	'HIDE_INSTANCES'          : 'Hide instances',
	'ENTER_MORE_LETTERS'      : "Please enter at least two letters. You will otherwise receive too many results.",
	'MARK_A_WORD'             : 'Mark a word...',
	'OPEN_IN_OB'              : 'Open in Data Explorer',
	'OPEN_IN_OB_NEW_TAB'      : '... new tab',
	'OB_CREATE'	  			  : 'Create',
	'OB_RENAME'	  			  : 'Rename',
	'OB_DELETE'	  			  : 'Delete',
	'OB_PREVIEW' 			  : 'Preview',
	'OB_TITLE_EXISTS'		  : 'Element exists!',
	'OB_CATEGORY_EXISTS'              : 'does not exist!',
	'OB_SUP_NOT_VALID'                : 'can not be a subcategory of:',
	'OB_TITLE_NOTEXISTS'		  : 'Element does not exist!',
	'OB_ENTER_TITLE'		  : 'Enter title',
	'OB_SAVE_CHANGES'         : 'Save changes',
	'SAVE_CHANGES'            : 'Save',
	'OB_ENTER_RANGE'          : 'Enter Range',
	'OB_SELECT_CATEGORY'	  : 'Select category first',
	'OB_SELECT_PROPERTY'	  : 'Select property first',
	'OB_SELECT_INSTANCE'	  : 'Select instance first',
	'OB_WRONG_MAXCARD'		  : 'Wrong max cardinality',
	'OB_WRONG_MINCARD'		  : 'Wrong min cardinality',
	'OB_CONFIRM_INSTANCE_DELETION' : 'Do you really want to remove this article?',
	'SMW_OB_OPEN' 			  : 'open',
	'SMW_OB_EDIT' 			  : 'edit',
	'SMW_OB_DELETE'                   : 'delete',
	'SMW_OB_ADDSOME'		  : '(add some)',
	'OB_CONTAINS_FURTHER_PROBLEMS' : 'Contains further problems',
	'SMW_OB_MODIFIED'		  : 'The page was modified. The following Gardening issues might have already been fixed:',
	'ADD_ANNOTATION'          : 'Add Annotation',
	'ADD_TYPE'          	  : 'Set type',
	'ADD_RANGE'          	  : 'Set range',
	'SUBPROPERTYOF'           : 'Subproperty of: (comma-separated)',
	'ADDPROPERTY' 			  : 'Add',	
	
	'ERROR_RENAMING_ARTICLE'  : 'Error at renaming',
	'OB_RENAME_WARNING' 	  : 'Renaming operations do not touch the instance data in any way.\nThat means queries with the TSC may not work as expected after the operation.\n\nWould you like to proceed?',
	'OB_TOOLTIP_ANNOTATED_CATEGORY' : 'If ticked, the data-explorer will only display facts that are actually annotated. Inherited instances or results of applying rules, such as definition rules, will not be shown.',
	
	// Data Explorer metadata
	'SMW_OB_META_PROPERTY'	  : 'Meta property',
	'SMW_OB_META_PROPERTY_VALUE' : 'Value',
	'SMW_OB_META_COMMAND_SHOW'  : 'Show meta-data',
	'SMW_OB_META_COMMAND_RATE'  : 'Rate this fact',
	
	// metaproperties
	'SMW_OB_META_SWP2_AUTHORITY'   : 'Authority',
	'SMW_OB_META_SWP2_KEYINFO'   : 'Key info',
	'SMW_OB_META_SWP2_SIGNATURE'   : 'Signature',
	'SMW_OB_META_SWP2_SIGNATURE_METHOD'   : 'Signature method',
	'SMW_OB_META_SWP2_VALID_FROM'   : 'Valid from',
	'SMW_OB_META_SWP2_VALID_UNTIL'   : 'Valid until',
	
	'SMW_OB_META_DATA_DUMP_LOCATION_FROM'   : 'Dump location',
	'SMW_OB_META_HOMEPAGE_FROM'   : 'Homepage',
	'SMW_OB_META_SAMPLE_URI_FROM'   : 'Sample URI',
	'SMW_OB_META_SPARQL_ENDPOINT_LOCATION_FROM'   : 'SPARQL Endpoint',
	'SMW_OB_META_DATASOURCE_VOCABULARY_FROM'   : 'Vocabulary',
	'SMW_OB_META_DATASOURCE_ID_FROM'   : 'ID',
	'SMW_OB_META_DATASOURCE_CHANGEFREQ_FROM'   : 'Change frequency',
	'SMW_OB_META_DATASOURCE_DESCRIPTION_FROM'   : 'Description',
	'SMW_OB_META_DATASOURCE_LABEL_FROM'   : 'Label',
	'SMW_OB_META_DATASOURCE_LASTMOD_FROM'   : 'Last change',
	'SMW_OB_META_DATASOURCE_LINKEDDATA_PREFIX_FROM'   : 'LinkedData prefix',
	'SMW_OB_META_DATASOURCE_URIREGEXPATTERN_FROM'   : 'URI pattern',

	'SMW_OB_META_DATA_DUMP_LOCATION_TO'   : 'Dump location',
	'SMW_OB_META_HOMEPAGE_TO'   : 'Homepage',
	'SMW_OB_META_SAMPLE_URI_TO'   : 'Sample URI',
	'SMW_OB_META_SPARQL_ENDPOINT_LOCATION_TO'   : 'SPARQL Endpoint',
	'SMW_OB_META_DATASOURCE_VOCABULARY_TO'   : 'Vocabulary',
	'SMW_OB_META_DATASOURCE_ID_TO'   : 'ID',
	'SMW_OB_META_DATASOURCE_CHANGEFREQ_TO'   : 'Change frequency',
	'SMW_OB_META_DATASOURCE_DESCRIPTION_TO'   : 'Description',
	'SMW_OB_META_DATASOURCE_LABEL_TO'   : 'Label',
	'SMW_OB_META_DATASOURCE_LASTMOD_TO'   : 'Last change',
	'SMW_OB_META_DATASOURCE_LINKEDDATA_PREFIX_TO'   : 'LinkedData prefix',
	'SMW_OB_META_DATASOURCE_URIREGEXPATTERN_TO'   : 'URI pattern',
	
	'SMW_OB_META_IMPORT_GRAPH_CREATED'   : 'Graph was created on',
	'SMW_OB_META_IMPORT_GRAPH_REVISION_NO'   : 'Revision number',
	'SMW_OB_META_IMPORT_GRAPH_LAST_CHANGED_BY'   : 'Last change',
	'SMW_OB_META_RATING_VALUE'   : 'Rating value',
	'SMW_OB_META_RATING_USER'   : 'Rated from user',
	'SMW_OB_META_RATING_CREATED'   : 'Rating was created on',
	'SMW_OB_META_RATING_ASSESSMENT'   : 'Assessment',
	

	// Query Interface
	'QUERY_INTERFACE'         : 'Query Interface',
	'QI_MAIN_QUERY_NAME'	  : 'Main Query',
	'QI_ARTICLE_TITLE'        : 'Article title',
	'QI_EMPTY_QUERY'       	  : 'Your Query is empty.',
	'QI_INSTANCE'       	  : 'Instance:',
	'QI_PROPERTYNAME'         : 'Property:',
    'QI_PROPERTYVALUE'        : 'Property value:',
	'QI_SHOW_PROPERTY'        : 'Show in results',
	'QI_PROPERTY_MUST_BE_SET' : 'Value must be set',
	'QI_USE_SUBQUERY'         : 'Insert subquery',
	'QI_PAGE'				  : 'Page',
	'QI_OR'        			  : 'or',
	'QI_ENTER_CATEGORY'       : 'Please enter a category',
	'QI_ENTER_INSTANCE'       : 'Please enter an instance',
	'QI_ENTER_PROPERTY_NAME'  : 'Please enter a property name',
	'QI_CLIPBOARD_SUCCESS'    : 'The query text was successfully copied to your clipboard',
	'QI_CLIPBOARD_FAIL'    	  : 'Your browser does not allow clipboard access.\nThe query text could not be copied to your clipboard.\nPlease use function "Show full query" and copy the query manually.',
	'QI_SUBQUERY'    	  	  : "Subquery",
	'QI_CATEGORIES'    	  	  : " Categories:",
	'QI_INSTANCES'    	  	  : " Instances:",
	'QI_QUERY_EXISTS'		  : "A query with this name already exists. Please choose another name.",
	'QI_QUERY_SAVED'		  : "Your query has been successfully saved.",
	'QI_SAVE_ERROR'		  	  : "An unknown error occured. Your query could not be saved.",
	'QI_EMPTY_TEMPLATE'		  : "In order to use the format 'template', you have to enter a template name.",
	'QI_SPECIAL_QP_PARAMS'    : 'Options for',
    'QI_START_CREATING_QUERY' : 'Click on<ul><li>Add Category</li><li>Add Property</li><li>Add Instance</li></ul>to start creating your query.',
    'QI_BC_ADD_CATEGORY'      : 'Add category',
    'QI_BC_ADD_PROPERTY'      : 'Add property',
    'QI_BC_ADD_INSTANCE'      : 'Add instance',
    'QI_BC_EDIT_CATEGORY'     : 'Edit category',
    'QI_BC_EDIT_PROPERTY'     : 'Edit property',
    'QI_BC_EDIT_INSTANCE'     : 'Edit instance',
    'QI_BC_ADD_OTHER_CATEGORY': 'Add another category (OR)',
    'QI_BC_ADD_OTHER_INSTANCE': 'Add another instance (OR)',
    'QI_DC_ADD_OTHER_RESTRICT': 'Add another restriction (OR)',
    'QI_DC_ADD_NEW_FILTER'    : 'Add new filter (AND)',
    'QI_CAT_ADDED_SUCCESSFUL' : 'Category successfully added to the query',
    'QI_PROP_ADDED_SUCCESSFUL': 'Property successfully added to the query',
    'QI_INST_ADDED_SUCCESSFUL': 'Instance successfully added to the query',
    'QI_CREATE_PROPERTY_CHAIN': 'Create a property chain by adding another property',
    'QI_ADD_PROPERTY_CHAIN'   : 'Add another property to property chain',
    'QI_PROP_VALUES_RESTRICT' : 'Restriction',
    'QI_SPECIFIC_VALUE'       : 'Specific value',
    'QI_NONE'                 : 'None',
    'QI_PROPERTY_TYPE'        : 'Type',
    'QI_PROPERTY_RANGE'       : 'Range',
    'QI_COLUMN_LABEL'         : 'Column label',
    'QI_SHOWUNIT'             : 'Unit',
    'QI_EQUAL'                : 'equal',
    'QI_LT'                   : 'less',
    'QI_GT'                   : 'greater',
    'QI_NOT'                  : 'not',
    'QI_LIKE'                 : 'like',
    'QI_BUTTON_ADD'           : 'Add',
    'QI_BUTTON_UPDATE'        : 'Update',
    'QI_ALL_VALUES'           : 'all values',
    'QI_SUBQUERY_TEXT'        : 'A new empty subquery will be created after you press the "Add" or "Update" button, where you can define specific restrictions.',
    'QI_TT_SHOW_IN_RES'       : 'The property value will be shown in the result.',
    'QI_TT_MUST_BE_SET'       : 'Only results where the property value is  set will included in the query.',
    'QI_TT_NO_RESTRICTION'    : 'No property value restrictions. All property values will be included in the query.',
    'QI_TT_VALUE_RESTRICTION' : 'Property values must fulfil specifc criterias.',
    'QI_TT_SUBQUERY'          : 'Restrictions for the property values will be defined in an  extra query.',
    'QI_TT_ADD_CHAIN'         : 'You can construct a chain of properties to easy connect properties which can be linked together. For example, you can create a property chain with the property &quot;Located In&quot; and &quot;Member of&quot;, where the property value is restricted to &quot;EU&quot;, to find things which are located in something which is a member of the EU.',
    'QI_QP_PARAM_intro'       : 'header',
    'QI_QP_PARAM_outro'       : 'footer',
    'QI_NOT_SPECIFIED'        : 'Not specified',
    'QI_NO_QUERIES_FOUND'     : 'Your search did not match any queries in the wiki',
    'QI_SPARQL_NOT_SUPPORTED' : 'SPARQL queries cannot be edited in Query Interface.',
    
    //SPARQL query interface
    'QI_SWITCH_TO_SPARQL'     : 'Switch to SPARQL',
    'QI_SHOW_IN_RESULTS_MUST_BE_SET': 'At least one variable must have a "Show in results" option selected',
    'QI_INVALID_QUERY' : 'The query is invalid',
    'QI_CLOSE'  :  'Close',
    'QI_QUERY_RESULT' : 'Query result',
    'QI_OK'   : 'OK',
    'QI_CANCEL'  : 'Cancel',
    'QI_SWITCH_TO_SPARQL_WARNING' : 'Your ASK query is now going to be converted to SPARQL.<br/>This is not reversible because SPARQL is much more expressive than ASK.<br/>This also requires that TSC is up and running and synchronized with your wiki.<br/>Are you sure you want to proceed?',
    'QI_CONFIRMATION' : 'Confirmation',
	
	// Find work
	'FW_SEND_ANNOTATIONS'	  : 'Thank you for evaluating annotations, ',
	'FW_MY_FRIEND'	  		  : 'my friend!',
	
	// Wiki text parser
	'WTP_TEXT_NOT_FOUND'		  : "Could not find '$1' in the wiki text.",
	'WTP_NOT_IN_NOWIKI'			  : "'$1' is part of a &lt;nowiki&gt;-section.\nIt can not be annotated.",
	'WTP_NOT_IN_TEMPLATE'		  : "'$1' is part of a template.\nIt can not be annotated.",
	'WTP_NOT_IN_ANNOTATION'		  : "'$1' is part of an annotation.\nIt can not be annotated.",
	'WTP_NOT_IN_QUERY'            : "'$1' is part of a query.\nIt can not be annotated.",
        'WTP_NOT_IN_TAG'                  : "'$1' is inside the tag $2.\nIt can not be annotated.",
	'WTP_NOT_IN_PREFORMATTED'	  : "'$1' is part of a preformatted text.\nIt can not be annotated.",
	'WTP_SELECTION_OVER_FORMATS'  : "The selection spans different formats:\n$1",
	
	// ACL extension
	'smw_acl_*' : '*',
	'smw_acl_read' : 'read',
	'smw_acl_edit' : 'edit',
	'smw_acl_create' : 'create',
	'smw_acl_move' : 'move',
	'smw_acl_permit' : 'permit',
	'smw_acl_deny' : 'deny',
	'smw_acl_create_denied' : 'You have no right to create the article "$1".',
	'smw_acl_edit_denied' : 'You have no right to edit the article "$1".',
	'smw_acl_delete_denied' : 'You have no right to delete the article "$1".',
	
	
	// Treeview
    'smw_stv_browse' : 'browse',
    
	// former content
	'PROPERTY_NS_WOC'         : 'Property', // Property namespace without colon
	'RELATION_NS_WOC'         : 'Relation', // Relation namespace without colon
	'CATEGORY_NS_WOC'         : 'Category', // Category namespace without colon
	'PROPERTY_TYPE'           : 'Type',
	
	'CATEGORY'                : "Category:",
	'PROPERTY'                : "Property:",
	'TEMPLATE'                : "Template:",	
	'TYPE'                    : 'Type:',

	
	
	'smw_wwsu_addwscall'			:	'Add web service call',
	'smw_wwsu_headline'			:	'Web Service',
	'Help'			:	'Help',
	
	// Derived facts
	'DF_REQUEST_FAILED' : 'Error! Could not retrieve derived facts.',
	
	// Semantic Toolbar General
	'STB_LINKS'				: 'Links to other pages',
	'STB_TOOLS'				: 'Semantic tools', 
	'STB_FACTS'				: 'Facts about this Article',
	'STB_ANNOTATION_HELP' 	: 'Semantic tools',
	'STB_TITLE'				: 'Data toolbar'
};

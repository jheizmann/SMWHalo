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

var wgUserLanguageStrings = {
	'MUST_NOT_BE_EMPTY'       : '(e)Ce champ ne doit pas être vide.',
	'VALUE_IMPROVES_QUALITY'  : '(i)Une valeur dans ce champ améliore la qualité de la base de connaissance.',
	'SELECTION_MUST_NOT_BE_EMPTY' : '(e)La sélection ne doit pas être vide !',
	'INVALID_FORMAT_OF_VALUE' : '(e)Le format de la valeur est invalide.',
	'INVALID_VALUES'          : 'Valeurs invalides.',
	'NAME'                    : 'Nom:',
	'ENTER_NAME'              : 'Veuillez saisir un nom.',
	'ADD'                     : 'Ajouter',
	'INVALID_VALUES'          : 'Valeurs invalides.',
	'CANCEL'                  : 'Annuler',
	'CREATE'                  : 'Créer',
	'EDIT'                    : 'Editer',
	'ANNOTATE'                : 'Annoter',
	'SUB_SUPER'               : 'Sous/Super',
	'MHAS_PART'               : 'A la part',
	'INVALID_NAME'            : 'Nom invalide.',
	'CHANGE'                  : 'Modifier',
	'DELETE'                  : 'Supprimer',
	'INPUT_BOX_EMPTY'         : 'Erreur! Le champ est vide.',
	'ERR_QUERY_EXISTS_ARTICLE' : 'Une erreur est survenue lors de la vérification de l\'existence de l\'article <$-page>.',
	'CREATE_PROP_FOR_CAT'     : 'Cette propriété a été créée pour la catégorie <$cat>. Veuillez saisir un contenu significatif.',
	'NOT_A_CATEGORY'          : 'L\'article courant n\'est pas une catégorie.',
	'CREATE_CATEGORY'         : 'Cette catégorie a été créée mais n\'a pas été éditée. Veuillez saisir un contenu significatif.',
	'CREATE_SUPER_CATEGORY'   : 'Cette catégorie a été créée en tant que sur-catégorie mais n\'a pas été éditée. Veuillez saisir un contenu significatif.',
	'CREATE_SUB_CATEGORY'     : 'Cette catégorie a été créée en tant que sous-catégorie mais n\'a pas été éditée. Veuillez saisir un contenu significatif.',
	'NOT_A_PROPERTY'          : 'L\'article courant n\'est pas une propriété.',
	'CREATE_PROPERTY'         : 'Cette propriété a été créée mais n\'a pas été éditée. Veuillez saisir un contenu significatif.',
	'CREATE_SUB_PROPERTY'     : 'Cet article a été créé en tant que sous-propriété. Veuillez saisir un contenu significatif.',
	'CREATE_SUPER_PROPERTY'   : 'Cet article a été créé en tant que sur-propriété. Veuillez saisir un contenu significatif.',
	'ERROR_CREATING_ARTICLE'  : "Une erreur est survenue lors de la création de l\'article.",
	'ERROR_EDITING_ARTICLE'   : "Une erreur est survenue lors de l\'édition de l\'article.",
	'UNMATCHED_BRACKETS'      : 'Attention! L\'article contient des erreurs de syntaxe ("]]" manquant)',
	'MAX_CARD_MUST_NOT_BE_0'  : "(e)La cardinalité maximale ne doit pas être inférieur ou égale à 0 !",
	'SPECIFY_CARDINALITY'     : "(e)Veuillez spécifier cette cardinalité !",
	'MIN_CARD_INVALID'        : "(e)La cardinalité minimale doit être inférieure à la cardinalité maximale !",
	'ASSUME_CARDINALITY_0'    : "(i) La cardinalité minimale est supposée être 0.",
	'ASSUME_CARDINALITY_INF'  : "(i) La cardinalité maximale est supposée être ∞.",

	// Namespaces
	'NS_SPECIAL' 			  : 'Spécial',

	// Relation toolbar
	'ANNOTATE_PROPERTY'       : 'Annoter une propriété.',
	'PAGE'                    : 'Page:',
	'ANNO_PAGE_VALUE'         : 'Page/Valeur annotée',
	'SHOW'                    : 'Afficher:',
	'DEFINE_SUB_SUPER_PROPERTY' : 'Définir une sous- ou super-propriété.',
	'CREATE_NEW_PROPERTY'     : 'Créer une nouvelle propriété.',
	'ENTER_DOMAIN'            : 'Saisir un domaine.',
	'ENTER_RANGE'             : 'Saisir un champ de valeurs.',
	'ENTER_TYPE'              : 'Sélectionner un type.',
	'PROP_HAS_PART'           : 'Propriété:A la part', 
	'HAS_PART'                : 'A la part',
	'PROP_HBSU'               : 'Propriété:a comme unité structurelle de base', // name of the property
	'HBSU'                    : 'a comme unité structurelle de base',
	'DEFINE_PART_OF'          : 'Définir une relation "est une partie de".',
	'OBJECT'                  : 'Objet:',
	'RENAME_ALL_IN_ARTICLE'   : 'Tout renommer dans cet article.',
	'CHANGE_PROPERTY'         : 'Modifier une propriété.',
	'PROPERTIES'              : 'Propriétés',
	'NO_OBJECT_FOR_POR'       : 'Aucun objet pour la relation "est une partie de" n\'a été donné.',
	'RETRIEVE_SCHEMA_DATA'    : 'Echec lors de la récupération du schéma de données !',

	// Property characteristics toolbar
	'PROPERTY_DOES_NOT_EXIST' : '(w)Cette propriété n\'existe pas.',
	'PROPERTY_ALREADY_EXISTS' : '(w)Cette propriété existe déjà.',
	'PROPERTY_NAME_TOO_LONG'  : '(e)Le nom de cette propriété est trop long ou contient des caractères invalides.',
	'PROPERTY_VALUE_TOO_LONG' : '(w)Cette valeur est très longue. Elle sera sauvegardée parmi les propriétés de type "Type:Text".',
	'CREATE_SUPER_PROPERTY'   : 'Créer "$-title" et faire de "$t" une sur-propriété de "$-title"',
	'CREATE_SUB_PROPERTY'     : 'Créer "$-title" et faire de "$t" une sous-propriété de "$-title"',
	'MAKE_SUPER_PROPERTY'     : 'Faire de "$t" une sur-propriété de  "$-title"',
	'MAKE_SUB_PROPERTY'       : 'Faire de "$t" une sous-propriété de "$-title"',
	'ADD_TYPE'                : 'Ajouter un type',
	'ADD_RANGE'               : 'Ajouter un champ de valeurs',
	'DOMAIN'                  : 'Domaine:',
	'RANGE'                   : 'Champ de valeurs:',
	'INVERSE_OF'              : 'Inverse de:',
	'MIN_CARD'                : 'Cardinalité min:',
	'MAX_CARD'                : 'Cardinalité max:',
	'TRANSITIVE'              : 'Transitif',
	'SYMMETRIC'               : 'Symétrique',
	'RETRIEVING_DATATYPES'    : 'Récupération des types de données...',
	'NARY_ADD_TYPES'		  : '(e) Veuillez ajouter des types ou des champs de valeurs',
	
	'PROPERTY_PROPERTIES'     : "Charactéristiques de la propriété",
	
	
	'PAGE_TYPE'               : "page",		// name of the page data type
	'NARY_TYPE'               : "arité n",       // name of the n-ary data type
	'SPECIFY_PROPERTY'		  : "Spécifier cette porpriété.",
	'PC_DUPLICATE'			  : "Au moins une propriété est spécifiée plusieurs fois. Veuillez supprimer les doublons.",
	'PC_HAS_TYPE'			  : "A pour type", 
	'PC_MAX_CARD'			  : "A pour cardinalité max",
	'PC_MIN_CARD'			  : "A pour cardinalité min",
	'PC_INVERSE_OF'			  : "Est l\'inverse de", 
	'PC_INVERSE'			  : "inverse", 
	'PC_TRANSITIVE'			  : "transitif", 
	'PC_SYMMETRICAL'		  : "symétrique", 
	'PC_AND'			 	  : "et", 
	'PC_UNSUPPORTED'		  : "Ce wiki ne supporte pas les propriétés de $1.",
	

	// Category toolbar
	'ANNOTATE_CATEGORY'       : 'Annoter une catégorie.',
	'CATEGORY_DOES_NOT_EXIST' : '(w)Cette catégorie n\'existe pas.',
	'CATEGORY_ALREADY_EXISTS' : '(w)Cette catégorie existe déjà.',
	'CATEGORY_NAME_TOO_LONG'  : '(e)Le nom de cette catégorie est trop long ou contient des caractères invalides.',
	'CREATE_SUPER_CATEGORY'   : 'Créer "$-title" et faire de "$t" une sur-catégorie de "$-title"',
	'CREATE_SUB_CATEGORY'     : 'Créer "$-title" et faire de "$t" une sous-catégorie de "$-title"',
	'MAKE_SUPER_CATEGORY'     : 'Faire de "$t" une sur-catégorie de  "$-title"',
	'MAKE_SUB_CATEGORY'       : 'Faire de "$t" une sous-catégorie de  "$-title"',
	'DEFINE_SUB_SUPER_CAT'    : 'Définir une sous- ou sur-catégorie.',
	'CREATE_SUB'              : 'Créer une sous',
	'CREATE_SUPER'            : 'Créer une sur',
	'CREATE_NEW_CATEGORY'     : 'Créer une nouvelle catégorie.',
	'CHANGE_ANNO_OF_CAT'      : 'Changer l\'annotation d\'une catégorie.',
	'CATEGORIES'              : 'Catégories',
	'ADD_AND_CREATE_CAT'      : 'Ajouter et créer',
	'CATEGORY_ALREADY_ANNOTATED': '(w)Cette catégorie est déjà annotée.',
	
	// Annotation hints
	'ANNOTATION_HINTS'        : 'Indications d\'annotation',
	'ANNOTATION_ERRORS'       : 'Erreurs d\'annotation',
	'AH_NO_HINTS'			  : '(i)Aucune indication pour cet article.',
	'AH_SAVE_COMMENT'		  : 'Les annotations ont été ajoutées dans le Mode d\'Annotation Avancé.',
	'AAM_SAVE_ANNOTATIONS' 	  : 'Voulez-vous enregistrer les annotations de la session courante ?',
	'CAN_NOT_ANNOTATE_SELECTION' : 'Il est impossible d\'annoter la sélection. Elle contient déjà des annotations ou des paragraphes ou finit dans un lien.',
	'AAM_DELETE_ANNOTATIONS'  : 'Êtes-vous sûrs de vouloir supprimer cette annotation?',
	
	// Save annotations
	'SA_SAVE_ANNOTATION_HINTS': "N\'oubliez pas d\'enregistrer votre travail!",
	'SA_SAVE_ANNOTATIONS'	  : 'Enregistrer les annotations',
	'SA_SAVE_ANNOTATIONS_AND_EXIT' : 'Enregistrer & quitter',
	'SA_ANNOTATIONS_SAVED'	  : '(i) Les annotations ont été enregistrées avec succès.',
	'SA_SAVING_ANNOTATIONS_FAILED' : '(e) Une erreur est survenue lors de l\'enregistrement des annotations.',
	'SA_SAVING_ANNOTATIONS'   : '(i) Enregistrement des annotations en cours...',

	// Autocompletion
	'AUTOCOMPLETION_HINT'     : 'Appuyez sur Ctrl+Alt+Espace pour utiliser l\'autocomplétion. (Ctrl+Espace in IE)',
	'WW_AUTOCOMPLETION_HINT'  : 'L\'éditeur WYSIWYG ("What you see is what you get", i.e. "Ce que vous voyez est ce que vous obtenez") ne supporte ni l\'autocomplétion, ni la barre d\'outils sémantique.',
	'AC_CLICK_TO_DRAG'        : 'Autocomplétion - Cliquez ici pour glisser/déposer',

	// Combined search
	'ADD_COMB_SEARCH_RES'     : 'Résultats additionnels de la recherche combinée.',
	'COMBINED_SEARCH'         : 'Recherche combinée',

	'INVALID_GARDENING_ACCESS' : 'Vous n\'êtes pas autorisés à annuler bots. Seuls sysops et gardeners y sont autorisés.',
	'GARDENING_LOG_COLLAPSE_ALL' : 'Tout réduire',
	'GARDENING_LOG_EXPAND_ALL'   : 'Tout agrandir',
	'BOT_WAS_STARTED'			: 'Le bot a été démarré!',
	
	// Ontology browser
	'OB_ID'					  : 'NavigateurOntologies',
	'ONTOLOGY_BROWSER'        : 'Navigateur d\'ontologies',
	
	'KS_NOT_SUPPORTED'        : 'Konqueror n\'est actuellement pas supporté!',
	'SHOW_INSTANCES'          : 'Afficher les instances',
	'HIDE_INSTANCES'          : 'Cacher les instances',
	'ENTER_MORE_LETTERS'      : "Veuillez saisir au moins deux lettres. Sinon vous allez obtenir trop de résultats.",
	'MARK_A_WORD'             : 'Marquer un mot...',
	'OPEN_IN_OB'              : 'Ouvrir dans le navigateur d\'ontologies',
	'OB_CREATE'	  			  : 'Créer',
	'OB_RENAME'	  			  : 'Renommer',
	'OB_DELETE'	  			  : 'Supprimer',
	'OB_PREVIEW' 			  : 'Aperçu',
	'OB_TITLE_EXISTS'		  : 'Le titre existe!',
	'OB_ENTER_TITLE'		  : 'Saisir le titre',
	'OB_SELECT_CATEGORY'	  : 'Sélectionner la catégorie en premier',
	'OB_SELECT_PROPERTY'	  : 'Sélectionner la propriété en premier',
	'OB_SELECT_INSTANCE'	  : 'Sélectionner l\'instance en premier',
	'OB_WRONG_MAXCARD'		  : 'Cardinalité max invalide',
	'OB_WRONG_MINCARD'		  : 'Cardinalité min invalide',
	'OB_CONFIRM_INSTANCE_DELETION' : 'Êtes-vous sûrs de vouloir supprimer cet article?',
	'SMW_OB_OPEN' 			  : '(ouvrir)',
	'SMW_OB_EDIT' 			  : '(éditer)',
	'SMW_OB_ADDSOME'		  : '(ajouter)',
	'OB_CONTAINS_FURTHER_PROBLEMS' : 'Contient des problèmes supplémentaires',
	'SMW_OB_MODIFIED'		  : 'La page a été modifiée. Les problèmes suivants de Gardening auraient déjà dûs être résolus:',

	// Query Interface
	'QUERY_INTERFACE'         : 'Interface de requêtes',
	'QI_MAIN_QUERY_NAME'	  : 'Requête principale',
	'QI_ARTICLE_TITLE'        : 'Titre de l\'article',
	'QI_EMPTY_QUERY'       	  : 'Votre requête est vide.',
	'QI_INSTANCE'       	  : 'Instance:',
	'QI_PROPERTYNAME'         : 'Nom de la propriété:',
	'QI_SHOW_PROPERTY'        : 'Afficher dans les résultats:',
	'QI_PROPERTY_MUST_BE_SET' : 'La valeur doit être fixée:',
	'QI_USE_SUBQUERY'         : 'Insérer une sous-requête',
	'QI_PAGE'				  : 'Page',
	'QI_OR'        			  : 'ou',
	'QI_ENTER_CATEGORY'       : 'Veuillez saisir une catégorie',
	'QI_ENTER_INSTANCE'       : 'Veuillez saisir une instance',
	'QI_ENTER_PROPERTY_NAME'  : 'Veuillez saisir un nom de propriété',
	'QI_CLIPBOARD_SUCCESS'    : 'La requête a été copiée avec succès dans votre presse-papier',
	'QI_CLIPBOARD_FAIL'    	  : 'Votre navigateur n\'autorise pas l\'accès au presse-papier.\nLa requête ne peut pas être copiée dans votre presse-papier.\nVeuillez utiliser la fonction "Afficher la requête dans son intégralité" et copiez la requête manuellement.',
	'QI_SUBQUERY'    	  	  : "Sous-requête",
	'QI_CATEGORIES'    	  	  : " Catégories:",
	'QI_INSTANCES'    	  	  : " Instances:",
	'QI_QUERY_EXISTS'		  : "Une requête portant se nom existe déjà. Veuillez choisir un autre nom.",
	'QI_QUERY_SAVED'		  : "Votre requête a été enregistrée avec succès.",
	'QI_SAVE_ERROR'		  	  : "Une erreur inconnue est survenue. Votre requête ne peut pas être enregistrée.",
	'QI_EMPTY_TEMPLATE'		  : "Afin d'utiliser le format 'template', vous devez saisir un nom de template.",
	
	// Find work
	'FW_SEND_ANNOTATIONS'	  : 'Merci d\'évaluer les annotations, ',
	'FW_MY_FRIEND'	  		  : 'mon ami!',
	
	// Wiki text parser
	'WTP_TEXT_NOT_FOUND'		  : "'$1' n'a pas été trouvé dans le texte wiki.",
	'WTP_NOT_IN_NOWIKI'			  : "'$1' est une partie de la section &lt;nowiki&gt;.\nCeci ne peut donc pas être annoté.",
	'WTP_NOT_IN_TEMPLATE'		  : "'$1' est une partie d'un template.\nCeci ne peut donc pas être annoté.",
	'WTP_NOT_IN_ANNOTATION'		  : "'$1' est une partie d'une annotation.\nCeci ne peut donc pas être annoté.",
	'WTP_NOT_IN_QUERY'            : "'$1' est une partie d'une requête.\nCeci ne peut donc pas être annoté.",
	'WTP_NOT_IN_PREFORMATTED'	  : "'$1' est une partie d'un texte préformaté.\nCeci ne peut donc pas être annoté.",
	'WTP_SELECTION_OVER_FORMATS'  : "´La sélection comprend différents formats:\n$1",
	
	// ACL extension
	'smw_acl_*' : '*',
	'smw_acl_read' : 'lire',
	'smw_acl_edit' : 'éditer',
	'smw_acl_create' : 'créer',
	'smw_acl_move' : 'déplacer',
	'smw_acl_permit' : 'autoriser',
	'smw_acl_deny' : 'interdire',
	'smw_acl_create_denied' : 'Il vous est interdit de créer l\'article "$1".',
	'smw_acl_edit_denied' : 'Il vous est interdit d\'éditer l\'article "$1".',
	'smw_acl_delete_denied' : 'Il vous est interdit de supprimer l\'article "$1".',
	
	// Rule toolbar
	'RULE_RULES' 		: 'Règles',
	'RULE_CREATE'		: 'Créer une nouvelle règle.',
	'RULE_EDIT'			: 'Editer une règle.',
	'RULE_NAME_TOO_LONG': '(e)Le nom de cette règle est trop long ou contient des caractères invalides.',
	'RULE_TYPE'			: 'Type de la règle:',
	'RULE_TYPE_DEFINITION'    : 'Définition',
	'RULE_TYPE_PROP_CHAINING' : 'Lien entre les propriété',
	'RULE_TYPE_CALCULATION'   : 'Calcul',
	
	// Treeview
    'smw_stv_browse' : 'naviguer',
    
	// former content
	'PROPERTY_NS_WOC'         : 'Propriété', // Property namespace without colon
	'RELATION_NS_WOC'         : 'Relation', // Relation namespace without colon
	'CATEGORY_NS_WOC'         : 'Catégorie', // Category namespace without colon
	
	'CATEGORY'                : "Catégorie:",
	'PROPERTY'                : "Propriété:",
	'TEMPLATE'                : "Template:",	
	'TYPE'                    : 'Type:',

	// Simple rules
	
	'SR_DERIVE_BY'		: 'Dériver $1 $2 par une règle complexe',
	'SR_HEAD'			: 'En-tête',
	'SR_BODY'			: 'Corp',
	'SR_CAT_HEAD_TEXT'  : 'Tous les articles $1 appartennant à $2 $3 sont définis par',
	'SR_PROP_HEAD_TEXT' : 'Tous les articles $1 ont pour propriété $2 avec la valeur $3, si',
	'SR_MCATPROP'		: 'Etant membre d\'une certaine $1catégorie$2 ou $3propriété$4',
	'SR_RULE_IMPLIES'	: 'Cette règle implique ce qui suit :',
	'SR_SAVE_RULE'		: 'Générer une règle',
	'SR_ALL_ARTICLES'	: 'Tous les articles',
	'SR_BELONG_TO_CAT'	: 'appartiennent à la catégorie',
	'SR_AND'			: 'ET',
	'SR_HAVE_PROP'		: 'ont la propriété',
	'SR_WITH_VALUE'		: 'avec la valeur',
	'SR_SIMPLE_VALUE'	: 'une certaine valeur',
	
	'SR_ENTER_FORMULA'	: 'Veuillez saisir une formule pour calculer la valeur de "$1"',
	'SR_SUBMIT'			: 'Soumettre...',
	'SR_SPECIFY_VARIABLES' : 'Veuillez spécifier les valeurs des variables suivantes dans votre formule :',
	'SR_DERIVED_FACTS'	: 'Faits actuellement dérivés (l\'actualisation peut prendre du temps)',
	'SR_SYNTAX_CHECKED' : '(syntaxe vérifiée)',
	'SR_EDIT_FORMULA'	: 'éditer la formule',
	'SR_NO_VARIABLE'	: 'La formaule ne comporte aucune variable. De telles formules sont dépourvues de sens.',
	'SR_IS_A'			: 'est un/une',
	'SR_PROPERTY_VALUE' : 'valeur de propriété',
	'SR_ABSOLUTE_TERM'	: 'terme absolu',
	'SR_ENTER_VALUE'	: 'Saisir une valeur...',
	'SR_ENTER_PROPERTY'	: 'Saisir une propriété...',
	
	'SR_OP_HELP_ENTER'	: 'Saisir une formule mathématique en utilisant les opérateurs suivants :',
	'SR_OP_ADDITION'	: 'Addition',
	'SR_OP_SQUARE_ROOT'	: 'Racine carrée',
	'SR_OP_SUBTRACTION'	: 'Soustraction',
	'SR_OP_EXPONENTIATE': 'Exponentielle',
	'SR_OP_MULTIPLY'	: 'Multiplication',
	'SR_OP_SINE'		: 'Sinus',
	'SR_OP_DIVIDE'		: 'Division',
	'SR_OP_COSINE'		: 'Cosinus',
	'SR_OP_MODULO'		: 'Modulo',
	'SR_OP_TANGENT'		: 'Tangente',

	//Term Import
	'smw_ti_sourceinfo'		: 'L\'information suivante est nécessaire afin de démarrer l\'importation',
	'smw_ti_source'			: 'Source',
	'smw_ti_edit'			: 'éditer',
	'smw_ti_attributes'		: '<b>Attributs disponibles dans cette source de données</b><br/>Les attributs suivants peuvent être extraits de la source de données définie :',
	'smw_ti_articles1'		: '<b>Articles à importer à partir de cette source de données</b><br/>Les articles suivants',
	'smw_ti_noa'			: 'nomArticle',
	'smw_ti_articles2'		: ' vont être générés dans le wiki:',

	'PC_enter_prop'		: 'Saisir une propriété',
	'PC_headline'		: 'La valeur de la propriété $1 de $2 est $3, si',
	'PC_DERIVE_BY'		: 'Dériver la propriété $1 par une règle liant les propriétés',
	
	'smw_wwsu_addwscall'			:	'Ajouter un appel de service web'
};
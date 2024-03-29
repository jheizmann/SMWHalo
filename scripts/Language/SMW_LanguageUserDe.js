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
	'MUST_NOT_BE_EMPTY'       : '(e)Dieses Eingabefeld darf nicht leer sein.',
	'VALUE_IMPROVES_QUALITY'  : '(i)Ein Wert in diesem Eingabefeld verbessert die Qualität der Wissensbasis.',
	'SELECTION_MUST_NOT_BE_EMPTY' : '(e)Die Auswahl darf nicht leer sein!',
	'INVALID_FORMAT_OF_VALUE' : '(e)Der Wert hat ein ungültiges Format.',
	'INVALID_VALUES'          : 'Ungültige Werte.',
	'EditProperty'            : 'Property editieren :',
	'NAME'                    : 'Name:',
	'SUBCATEGORYOF'           : 'Subcategorie von: (komma-getrennt)',
	'ANNOTATED_CATEGORIES'     : 'Annotatierte Kategorien: (komma-getrennt)',
	'ENTER_NAME'              : 'Bitte Name eingeben.',
	'ADD'                     : 'Hinzufügen',
	'CANCEL'                  : 'Abbrechen',
	'CREATE'                  : 'Erzeugen',
	'EDIT'                    : 'Editieren',
	'ANNOTATE'                : 'Annotieren',
	'SUB_SUPER'               : 'Sub/Super',
	'INVALID_NAME'            : 'Ungültiger Name.',
	'CHANGE'                  : 'ändern',
	'DELETE'                  : 'Löschen',
	'INPUT_BOX_EMPTY'         : 'Fehler! Das Eingabefeld ist leer.',
	'ERR_QUERY_EXISTS_ARTICLE' : 'Fehler bei der Existenzabfrage des Artikels <$-page>.',
	'CREATE_PROP_FOR_CAT'     : 'Dieses Attribut wurde für die Kategorie <$cat> erzeugt. Bitte geben Sie sinnvollen Inhalt ein.',
	'NOT_A_CATEGORY'          : 'Der aktuelle Artikel ist keine Kategorie.',
	'CREATE_CATEGORY'         : 'Diese Kategorie wurde erzeugt aber nicht editiert. Bitte geben Sie sinnvollen Inhalt ein.',
	'CREATE_SUPER_CATEGORY'   : 'Diese Kategorie wurde als Superkategorie erzeugt aber nicht editiert. Bitte geben Sie sinnvollen Inhalt ein.',
	'CREATE_SUB_CATEGORY'     : 'Diese Kategorie wurde als Subkategorie erzeugt aber nicht editiert. Bitte geben Sie sinnvollen Inhalt ein.',
	'NOT_A_PROPERTY'          : 'Der aktuelle Artikel ist kein Attribut.',
	'CREATE_PROPERTY'         : 'Dieses Attribut wurde erzeugt aber nicht editiert. Bitte geben Sie sinnvollen Inhalt ein.',
	'CREATE_SUB_PROPERTY'     : 'Dieser Artikel wurde als Sub-Attribut erzeugt aber nicht editiert. Bitte geben Sie sinnvollen Inhalt ein.',
	'CREATE_SUPER_PROPERTY'   : 'Dieser Artikel wurde als Super-Attribut erzeugt aber nicht editiert. Bitte geben Sie sinnvollen Inhalt ein.',
	'ERROR_CREATING_ARTICLE'  : "Fehler beim Erzeugen des Artikels.",
	'ERROR_EDITING_ARTICLE'   : "Fehler beim Editieren des Artikels.",
	'UNMATCHED_BRACKETS'      : 'Warnung! Dieser Artikel ist syntaktisch nicht korrekt ("]]" fehlen)',
	'MAX_CARD_MUST_NOT_BE_0'  : "(e)Max. Kardinalität darf nicht 0 oder kleiner sein.",
	'SPECIFY_CARDINALITY'     : "(e)Bitte geben Sie eine Kardinalität ein!",
	'MIN_CARD_INVALID'        : "(e)Min. Kardinalität darf nicht kleiner als die max. Kardinalität sein!",
	'ASSUME_CARDINALITY_0'    : "(i) Die min. Kardinalität wird als 0 angenommen.",
	'ASSUME_CARDINALITY_INF'  : "(i) Max. Kardinalität wird als ∞ angenommen.",
	'ANNOTATED_CATEGORIES'     : 'Annotierte Kategorien:',

	// Namespaces
	'NS_SPECIAL' 			  : 'Special',

	// Relation toolbar
	'ANNOTATE_PROPERTY'       : 'Annotatieren Sie ein Attribut.',
	'PAGE'                    : 'Seite:',
	'ANNO_PAGE_VALUE'         : 'Annotierte Seite/Wert',
	'SHOW'                    : 'Zeige:',
	'DEFINE_SUB_SUPER_PROPERTY' : 'Definieren Sie ein Sub-/Super-Attribut.',
	'CREATE_NEW_PROPERTY'     : 'Erzeugen Sie ein neues Attribut.',
	'ENTER_DOMAIN'            : 'Geben Sie einen Domain ein..',
	'ENTER_RANGE'             : 'Geben Sie eine Range ein.',
	'ENTER_TYPE'              : 'Wählen Sie einen Typ.',
	'RENAME_ALL_IN_ARTICLE'   : 'Alle im Artikel umbenennen.',
	'CHANGE_PROPERTY'         : 'Ändern Sie ein Attribut.',
	'PROPERTIES'              : 'Attribute',
	'RETRIEVE_SCHEMA_DATA'    : 'Die Schema-Daten konnten nicht ermittelt werden!',
	'RECPROP'                 : "Empfohlene Attribute",
	

	// Property characteristics toolbar
	'PROPERTY_DOES_NOT_EXIST' : '(w)Dieses Attribut existiert nicht.',
	'PROPERTY_ALREADY_EXISTS' : '(w)Dieses Attribut existiert bereits.',
	'PROPERTY_NAME_TOO_LONG'  : '(e)Der Name des Attributs ist zu lang oder enthält ungültige Zeichen.',
	'PROPERTY_VALUE_TOO_LONG' : '(w)Dieser Wert ist sehr lang. Er kann nur in Attributs mit dem Typ "Typ:Text" gespeichert werden.',
	'PROPERTY_ACCESS_DENIED'  : '(e)Sie sind nicht berechtigt, dieses Attribut zu annotieren.',
	'PROPERTY_ACCESS_DENIED_TT'  : 'Sie sind nicht berechtigt, dieses Attribut zu annotieren.',
	'CANT_SAVE_FORBIDDEN_PROPERTIES': 'Der Artikel enthält schreibgeschützte Attribute und kann nicht gespeichert werden.',
	'CREATE_SUPER_PROPERTY'   : 'Erzeuge "$-title" und mache "$sftt" Super-Attribut von "$-title"',
	'CREATE_SUB_PROPERTY'     : 'Erzeuge "$-title" und mache "$sftt" Sub-Attribut von "$-title"',
	'MAKE_SUPER_PROPERTY'     : 'Mache "$sftt" Super-Attribut von "$-title"',
	'MAKE_SUB_PROPERTY'       : 'Mache "$sftt" Sub-Attribut von "$-title"',
	'ADD_RECORD_FIELD'        : 'Attribut zum Verbund hinzufügen',
	'ADD_DOMAIN_RANGE'        : 'Domain und Range hinzufügen',
	'DOMAIN'                  : 'Domain:',
	'RANGE'                   : 'Range:',
	'INVERSE_OF'              : 'Inverse von:',
    'Mandatory'               : 'Pflicht:',
	'TRANSITIVE'              : 'Transitiv',
	'SYMMETRIC'               : 'Symmetrisch',
	'RETRIEVING_DATATYPES'    : 'Ermittele Datentypen...',
	'NARY_ADD_TYPES'		  : '(e) Bitte fügen Sie Typen oder Ranges hinzu.',
	'REMOVE_DOMAIN_RANGE'	  : 'Diesen Domain und Range entfernen',
	'DUPLICATE_RECORD_FIELD'  : '(w)Das Attribut erscheint mehrfach im Verbund. Die Reihenfolge von annotieren Werten wird zufällig sein.',
	
	'PROPERTY_PROPERTIES'     : "Attribut Characteristik",
	
	'PAGE_TYPE'               : "page",		// name of the page data type
	'NARY_TYPE'               : "n-ary",       // name of the n-ary data type
	'SPECIFY_PROPERTY'		  : "Spezifizieren Sie dieses Attribut.",
	'PC_DUPLICATE'			  : "Mindestens ein Attribut wird mehrfach spezifiziert. Entfernen Sie bitte die Duplikate.",
	'PC_HAS_TYPE'			  : "Hat Datentyp", 
	'PC_HAS_FIELDS'			  : "Attribut",
	'PC_MAX_CARD'			  : "Max. Kardinalität",
	'PC_MIN_CARD'			  : "Min. Kardinalität",
	'PC_INVERSE_OF'			  : "ist invers zu", 
	'PC_INVERSE'			  : "inverse", 
	'PC_TRANSITIVE'			  : "transitive", 
	'PC_SYMMETRICAL'		  : "symmetrische", 
	'PC_AND'			 	  : "und ", 
	'PC_UNSUPPORTED'		  : "Dieses Wiki unterstützt keine $1 Attribute.",

	// Category toolbar
	'ANNOTATE_CATEGORY'       : 'Annotieren Sie eine Kategorie.',
	'CATEGORY_DOES_NOT_EXIST' : '(w)Diese Kategorie existiert nicht.',
	'CATEGORY_ALREADY_EXISTS' : '(w)Diese Kategorie existiert bereits.',
	'CATEGORY_NAME_TOO_LONG'  : '(e)Der Name dieser Kategorie ist zu lang oder enthält ungültige Zeichen.',
	'CREATE_SUPER_CATEGORY'   : 'Erzeuge "$-title" und mache "$sftt" Super-Kategorie von "$-title"',
	'CREATE_SUB_CATEGORY'     : 'Erzeuge "$-title" und mache "$sftt" Sub-Kategorie von "$-title"',
	'MAKE_SUPER_CATEGORY'     : 'Mache "$sftt" Super-Kategorie von "$-title"',
	'MAKE_SUB_CATEGORY'       : 'Mache "$sftt" Super-Kategorie von "$-title"',
	'DEFINE_SUB_SUPER_CAT'    : 'Definieren Sie eine Sub- oder Super-Kategorie.',
	'CREATE_SUB'              : 'Erzeuge Sub',
	'CREATE_SUPER'            : 'Erzeuge Super',
	'CREATE_NEW_CATEGORY'     : 'Erzeugen Sie eine neue Kategorie',
	'CHANGE_ANNO_OF_CAT'      : 'Ändern Sie die Annotation einer Kategorie',
	'CATEGORIES'              : 'Kategorien',
	'ADD_AND_CREATE_CAT'      : 'Hinzufügen und erzeugen',
	'CATEGORY_ALREADY_ANNOTATED': '(w)Diese Kategorie ist bereits annotiert.',

	// Annotation hints
	'ANNOTATION_HINTS'        : 'Annotationshinweise',
	'ANNOTATION_ERRORS'       : 'Annotationsfehler',
	'AH_NO_HINTS'			  : '(i)Keine Hinweise für diesen Artikel.',
	'AH_SAVE_COMMENT'		  : 'Annotationen wurden im Advanced Annotation Mode hinzugefügt.',
	'AAM_SAVE_ANNOTATIONS' 	  : 'Möchten Sie die Annotationen der aktuellen Sitzung speichern?',
	'CAN_NOT_ANNOTATE_SELECTION' : 'Sie können die Auswahl nicht annotieren. Sie enthält bereits Annotationen oder Abschnitte oder endet in einem Link.',
	'AAM_DELETE_ANNOTATIONS'  : 'Möchten Sie diese Annotation wirklich löschen?',
	
	// Save annotations
	'SA_SAVE_ANNOTATION_HINTS': "Vergessen Sie nicht, Ihre Arbeit zu speichern!",
	'SA_SAVE_ANNOTATIONS'	  : 'Speichere Annotationen',
	'SA_SAVE_ANNOTATIONS_AND_EXIT' : 'Speichern & verlassen',
	'SA_ANNOTATIONS_SAVED'	  : '(i) Die Annotationen wurden gespeichert.',
	'SA_SAVING_ANNOTATIONS_FAILED' : '(e) Ein Fehler trat beim Speichern der Annotationen auf.',
	'SA_SAVING_ANNOTATIONS'   : '(i) Speichere Annotationen...',
	
	// Queries in STB
	'QUERY_HINTS'			  : 'Inline queries',
	'NO_QUERIES_FOUND'		  : '(i) Kein Queries in diesem Artikel gefunden.',

	// Autocompletion
	'AUTOCOMPLETION_HINT'     : 'Drücken Sie Ctrl+Alt+Space um die Auto-completion zu benutzen. (Ctrl+Space im IE)',
	'WW_AUTOCOMPLETION_HINT'  : '- wird nur im Wikitext Modus unterstützt.',
	'AC_CLICK_TO_DRAG'        : 'Auto-Completion',
    'AC_MORE_RESULTS_AVAILABLE' : 'Zuviele Treffer gefunden...',
    'AC_MORE_RESULTS_TOOLTIP' : 'Zuviele Treffer. Bitte erweitern Sie die Suchanfrage.',
    'AC_NO_RESULTS': 'Keine Treffer',
    'AC_ALL' : 'Auto-completion für alle Seiten',
	'AC_QUERY' : 'ASK-Query',
	'AC_SCHEMA_PROPERTY_DOMAIN' : 'Alle Attribute mit der Domäne: ',
	'AC_SCHEMA_PROPERTY_WITHSAME_DOMAIN' : 'Alle Attribute mit der gleichen Domäne: ',
	'AC_SCHEMA_PROPERTY_RANGE_INSTANCE' : 'Alle Attribute mit einem Wertebereich dieser Instanz: ',
	'AC_DOMAINLESS_PROPERTY' : 'Alle Attribute ohne Domäne',
	'AC_ANNOTATION_PROPERTY' : 'Alle Attribute, die auf Seiten dieser Kategorie verwendet werden: ',
	'AC_ANNOTATION_VALUE' : 'Alle Attribute mit folgenden annotierten Werten: ',
	'AC_INSTANCE_PROPERTY_RANGE' : 'Alle Instanzen der Range-Kategorie von: ',
	'AC_NAMESPACE' : 'Alle Seiten im Namensraum: ',
	'AC_LEXICAL' : 'Alle Seiten die folgenden Text im Titel enthalten: ',
	'AC_SCHEMA_PROPERTY_TYPE' : 'Alle Attribute dieses Typs: ',
	'AC_ASF' : 'Kategorien für die Automatic Semantic Forms generiert werden können',
	'AC_FROM_BUNDLE' : 'Seiten aus dem Bundle: ',


	// Combined search
	'ADD_COMB_SEARCH_RES'     : 'Zusätzliche Ergebnisse der Combined-Search.',
	'COMBINED_SEARCH'         : 'Combined-Search',

	'INVALID_GARDENING_ACCESS' : 'Sie dürfen Gardening Bots nicht abbrechen. Das dürfen nur Sysops und Gardener.',
	'GARDENING_LOG_COLLAPSE_ALL' : 'Alles einklappen',
	'GARDENING_LOG_EXPAND_ALL'   : 'Alles ausklappen',
	'BOT_WAS_STARTED'			: 'Der Bot wurde gestartet.',
	
	// Data Explorer
	'OB_ID'					  : 'DataExplorer',
	'ONTOLOGY_BROWSER'        : 'Data Explorer',
	
	'KS_NOT_SUPPORTED'        : 'Konqueror wird momentan nicht unterstützt.',
	'SHOW_INSTANCES'          : 'Zeige Instanzen',
	'HIDE_INSTANCES'          : 'Verstecke Instanzen',
	'ENTER_MORE_LETTERS'      : "Bitte geben Sie mindestens zwei Buchstaben ein. Sonst erhalten Sie wahrscheinlich zu viele Ergebnisse.",
	'MARK_A_WORD'             : 'Selektieren Sie etwas...',
	'OPEN_IN_OB'              : 'Im Data Explorer öffnen',
	'OPEN_IN_OB_NEW_TAB'      : '... neuer Tab',
	'OB_CREATE'	  			  : 'Erzeugen',
	'OB_RENAME'	  			  : 'Umbenennen',
	'OB_DELETE'	  			  : 'Löschen',
	'OB_PREVIEW' 			  : 'Preview',
	'OB_TITLE_EXISTS'		  : 'Existiert bereits',
	'OB_SAVE_CHANGES'         : 'Save changes',
	'OB_TITLE_NOTEXISTS'		  : 'Existiert noch nicht!',
	'OB_ENTER_TITLE'		  : 'Seitennamen eingeben',
	'OB_SELECT_CATEGORY'	  : 'Erst Kategorie auswählen',
	'OB_SAVE_CHANGES'         : 'Änderungen speichern',
	'OB_SELECT_PROPERTY'	  : 'Erst Property auswählen',
	'OB_SELECT_INSTANCE'	  : 'Erst Instanz auswählen',
	'OB_WRONG_MAXCARD'		  : 'Falsche Max-Kardinalität',
	'OB_WRONG_MINCARD'		  : 'Falsche Min-Kardinalität',
	'OB_CONFIRM_INSTANCE_DELETION' : 'Wollen Sie den Artikel wirklich löschen?',
	'SMW_OB_OPEN' 			  : '(öffne)',
	'SMW_OB_EDIT' 		  	  : '(editiere)',
	'SMW_OB_ADDSOME'		  : '(Füge hinzu)',
	'OB_CONTAINS_FURTHER_PROBLEMS' : 'Contains further problems',
	'SMW_OB_MODIFIED'		  : 'Artikel wurde gespeichert. Das Problem wurde möglicherweise bereits behoben.',
	'ADD_ANNOTATION'          : 'Annotation hinzufügen',
	'ADD_TYPE'          	  : 'Type setzen',
	'ADD_RANGE'          	  : 'Range-Kategorie setzen',
	'SUBPROPERTYOF'           : 'Subproperty von: (komma-getrennt)',
	'ADDPROPERTY' 			  : 'Property hinzufügen',
	'SAVE_CHANGES'            : 'Speichern',
	
	'ERROR_RENAMING_ARTICLE'  : 'Fehler beim Umbennenen',
	'OB_RENAME_WARNING' 	  : 'Das Umbenennen von Artikeln verändert keine Annotationen.\nDas bedeutet Queries an den TSC könnten nach dem Umbenennen unerwartete Ergebnisse liefern.\n\nMöchten Sie fortfahren?',
	'OB_TOOLTIP_ANNOTATED_CATEGORY' : 'Zeigt nur explizit annotierte Instanzen der ausgewählten Kategorie (oder einer ihrer Subkategorien). Zeigt keine Instanzen, die durch Regeln generiert werden. ',
	
	// Data Explorer metadata
	'SMW_OB_META_PROPERTY'	  : 'Meta-Property',
	'SMW_OB_META_PROPERTY_VALUE' : 'Wert',
	'SMW_OB_META_COMMAND_SHOW'  : 'Zeige Metadata',
	'SMW_OB_META_COMMAND_RATE'  : 'Bewerte dieses Faktum',
	
	
	// metaproperties
	'SMW_OB_META_SWP2_AUTHORITY'   : 'Herausgeber',
	'SMW_OB_META_SWP2_KEYINFO'   : 'Kurzinfo',
	'SMW_OB_META_SWP2_SIGNATURE'   : 'Signatur',
	'SMW_OB_META_SWP2_SIGNATURE_METHOD'   : 'Signaturmethode',
	'SMW_OB_META_SWP2_VALID_FROM'   : 'Gültig von',
	'SMW_OB_META_SWP2_VALID_UNTIL'   : 'Gültig bis',
	
	'SMW_OB_META_DATA_DUMP_LOCATION_FROM'   : 'Datenbasis von Quelle',
	'SMW_OB_META_HOMEPAGE_FROM'   : 'Homepage',
	'SMW_OB_META_SAMPLE_URI_FROM'   : 'Beispiel URI',
	'SMW_OB_META_SPARQL_ENDPOINT_LOCATION_FROM'   : 'SPARQL Endpunkt',
	'SMW_OB_META_DATASOURCE_VOCABULARY_FROM'   : 'Vokabular',
	'SMW_OB_META_DATASOURCE_ID_FROM'   : 'ID',
	'SMW_OB_META_DATASOURCE_CHANGEFREQ_FROM'   : 'Änderungsfrequenz',
	'SMW_OB_META_DATASOURCE_DESCRIPTION_FROM'   : 'Beschreibung',
	'SMW_OB_META_DATASOURCE_LABEL_FROM'   : 'Bezeichnung',
	'SMW_OB_META_DATASOURCE_LASTMOD_FROM'   : 'Letzte Änderung',
	'SMW_OB_META_DATASOURCE_LINKEDDATA_PREFIX_FROM'   : 'LinkedData Präfix',
	'SMW_OB_META_DATASOURCE_URIREGEXPATTERN_FROM'   : 'URI Pattern',

	'SMW_OB_META_DATA_DUMP_LOCATION_TO'   : 'Datenbasis von Quelle',
	'SMW_OB_META_HOMEPAGE_TO'   : 'Homepage',
	'SMW_OB_META_SAMPLE_URI_TO'   : 'Beispiel URI',
	'SMW_OB_META_SPARQL_ENDPOINT_LOCATION_TO'   : 'SPARQL Endpunkt',
	'SMW_OB_META_DATASOURCE_VOCABULARY_TO'   : 'Vokabular',
	'SMW_OB_META_DATASOURCE_ID_TO'   : 'ID',
	'SMW_OB_META_DATASOURCE_CHANGEFREQ_TO'   : 'Änderungsfrequenz',
	'SMW_OB_META_DATASOURCE_DESCRIPTION_TO'   : 'Beschreibung',
	'SMW_OB_META_DATASOURCE_LABEL_TO'   : 'Bezeichnung',
	'SMW_OB_META_DATASOURCE_LASTMOD_TO'   : 'Letzte Änderung',
	'SMW_OB_META_DATASOURCE_LINKEDDATA_PREFIX_TO'   : 'LinkedData Präfix',
	'SMW_OB_META_DATASOURCE_URIREGEXPATTERN_TO'   : 'URI Pattern',
	
	'SMW_OB_META_IMPORT_GRAPH_CREATED'   : 'Graph wurde erzeugt am',
	'SMW_OB_META_IMPORT_GRAPH_REVISION_NO'   : 'Revisionsnummer',
	'SMW_OB_META_IMPORT_GRAPH_LAST_CHANGED_BY'   : 'Letzte Änderung',
	'SMW_OB_META_RATING_VALUE'   : 'Bewertung',
	'SMW_OB_META_RATING_USER'   : 'Rating von Benutzer',
	'SMW_OB_META_RATING_CREATED'   : 'Rating erzeugt am',
	'SMW_OB_META_RATING_ASSESSMENT'   : 'Beurteilung',
	

	// Find work
	'FW_SEND_ANNOTATIONS'	  : 'Danke für das Bewerten der Annotationen, ',
	'FW_MY_FRIEND'	  		  : 'mein Freund!',
	
	// Query Interface
	'QUERY_INTERFACE'         : 'Query Interface',
	'QI_MAIN_QUERY_NAME'	  : 'Hauptquery',
	'QI_ARTICLE_TITLE'        : 'Artikel',
	'QI_EMPTY_QUERY'       	  : 'Ihr Query ist leer.',
	'QI_INSTANCE'       	  : 'Instanz:',
	'QI_PROPERTYNAME'         : 'Attribut:',
    'QI_PROPERTYVALUE'        : 'Attributwert:',
	'QI_SHOW_PROPERTY'        : 'In Ergebnissen zeigen',
	'QI_PROPERTY_MUST_BE_SET' : 'Wert muss gesetzt sein',
	'QI_USE_SUBQUERY'         : 'Subquery einfügen',
	'QI_PAGE'				  : 'Page', // has to be the same as the Type:Page in your language
	'QI_OR'        			  : 'oder',
	'QI_ENTER_CATEGORY'       : 'Bitte geben Sie eine Kategorie ein',
	'QI_ENTER_INSTANCE'       : 'Bitte geben Sie eine Instanz ein',
	'QI_ENTER_PROPERTY_NAME'  : 'Bitte geben Sie einen Attributnamen ein',
	'QI_CLIPBOARD_SUCCESS'    : 'Der Query wurde in Ihre Zwischenablage kopiert',
	'QI_CLIPBOARD_FAIL'    	  : 'Ihr Browser erlaubt keinen Zugriff auf die Zwischenablage\nDer Query konnte nicht in Ihre Zwischenablage kopiert werden.\n Bitte verwenden Sie die Funktion "Kompletten Query anzeigen" und kopieren Sie den Query manuell.',
	'QI_SUBQUERY'    	  	  : "Subquery",
	'QI_CATEGORIES'    	  	  : " Kategorien:",
	'QI_INSTANCES'    	  	  : " Instanzen:",
	'QI_QUERY_EXISTS'		  : "Ein Query mit diesem Namen existiert bereits. Bitte wählen sie einen neuen Namen.",
	'QI_QUERY_SAVED'		  : "Ihr Query wurde erfolgreich gespeichert",
	'QI_SAVE_ERROR'		  	  : "Ein unbekannter Fehler ist aufgetreten. Ihr Query konnte nicht gespeichert werden.",
	'QI_EMPTY_TEMPLATE'		  : "Um das Ausgabeformat 'template' benutzen zu können, müssen Sie einen Templatenamen angeben.",
	'QI_SPECIAL_QP_PARAMS'    : 'Spezielle Parameter für',
    'QI_START_CREATING_QUERY' : 'Klicke auf<ul><li>Kategorie hinzuf&uuml;gen</li><li>Attribut hinzuf&uuml;gen</li><li>Instanz hinzuf&uuml;gen</li></ul>um eine neue Query zu bauen.',
    'QI_BC_ADD_CATEGORY'      : 'Kategorie hinzuf&uuml;gen',
    'QI_BC_ADD_PROPERTY'      : 'Attribut hinzuf&uuml;gen',
    'QI_BC_ADD_INSTANCE'      : 'Instanz hinzuf&uuml;gen',
    'QI_BC_EDIT_CATEGORY'     : 'Kategorie bearbeiten',
    'QI_BC_EDIT_PROPERTY'     : 'Attribut bearbeiten',
    'QI_BC_EDIT_INSTANCE'     : 'Instanz bearbeiten',
    'QI_BC_ADD_OTHER_CATEGORY': 'weitere Kategorie hinzuf&uuml;gen (ODER)',
    'QI_BC_ADD_OTHER_INSTANCE': 'weitere Instanz hinzuf&uuml;gen (ODER)',
    'QI_DC_ADD_OTHER_RESTRICT': 'weitere Werteinschr&auml;nkung hinzuf&uuml;gen (ODER)',
    'QI_DC_ADD_NEW_FILTER'    : 'Add new filter (AND)',
    'QI_CAT_ADDED_SUCCESSFUL' : 'Kategorie erfolgreich zum Query hinzugef&uuml;gt',
    'QI_PROP_ADDED_SUCCESSFUL': 'Attribut erfolgreich zum Query hinzugef&uuml;gt',
    'QI_INST_ADDED_SUCCESSFUL': 'Instanz erfolgreich zum Query hinzugef&uuml;gt',
    'QI_CREATE_PROPERTY_CHAIN': 'neue Attributkette anlegen durch hinzu&uumlgen eines Attributs',
    'QI_ADD_PROPERTY_CHAIN'   : 'weiteres Attribut zur Attributkette hinzuf&uuml;gen',
    'QI_PROP_VALUES_RESTRICT' : 'Einschr&auml;nkung',
    'QI_SPECIFIC_VALUE'       : 'bestimmter Wert',
    'QI_NONE'                 : 'keine',
    'QI_PROPERTY_TYPE'        : 'Typ',
    'QI_PROPERTY_RANGE'       : 'Range',
    'QI_COLUMN_LABEL'         : 'Spalten&uuml;berschrift',
    'QI_SHOWUNIT'             : 'Einheit',
    'QI_EQUAL'                : 'gleich',
    'QI_LT'                   : 'kleiner',
    'QI_GT'                   : 'gr&ouml;&szlig;er',
    'QI_NOT'                  : 'nicht',
    'QI_LIKE'                 : '&auml;hnlich',
    'QI_BUTTON_ADD'           : 'Hinzuf&uuml;gen',
    'QI_BUTTON_UPDATE'        : 'Aktualisieren',
    'QI_ALL_VALUES'           : 'alle Werte',
    'QI_SUBQUERY_TEXT'        : 'Ein neuer Query wird erstellt wenn Sie die Schaltfl&auml;che "Hinzuf&uuml;gen" oder "Aktualisieren" bet&auml;tigen, in welcher Sie Einschr&auml;nkungen vornehmen k&ouml;nnen.',
    'QI_TT_SHOW_IN_RES'       : 'Die Attributwerte werden im Ergebnis angezeigt.',
    'QI_TT_MUST_BE_SET'       : 'Es werden nur Ergebnisse angezeigt, bei denen das Attribut gesetzt ist.',
    'QI_TT_NO_RESTRICTION'    : 'Keine Einsch&auml;nkungen bei den Attributwerten. Alle Attributwerte werden im Ergebnis benutzt.',
    'QI_TT_VALUE_RESTRICTION' : 'Die Attributwerte m&uuml;ssen bestimmte Kriterien erf&uuml;llen.',
    'QI_TT_SUBQUERY'          : 'Die Einschr&auml;nkung der Attributwerte wird in einem eigenen Query bestimmt.',
    'QI_TT_ADD_CHAIN'         : 'Sie k&ouml;nnen eine Verkettung von Attributen erzeugen indem Sie einfach Attribute miteinander verbinden. Ein Beispiel: Sie k&ouml;nnen eine Attributkette aus den Attributen &quot;Liegt in&quot; und &quot;Mitglied von&quot; bilden, in welcher eine Werteeinschr&auml;nkung auf &quot;EU&quot; vorgenommen wird, um alle Dinge zu finden die in einer Sache liegen, welche Mitglied von der EU ist.',
    'QI_QP_PARAM_intro'       : 'Kopfzeile',
    'QI_QP_PARAM_outro'       : 'Fu&szlig;note',
    'QI_NOT_SPECIFIED'        : 'Nicht definiert',
    'QI_NO_QUERIES_FOUND'     : 'Die Suche hat keine Queries im Wiki gefunden',
    'QI_SPARQL_NOT_SUPPORTED' : 'SPARQL queries k&ouml;nen nicht im Query Interface bearbeitet werden.',

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
    
	
	// Wiki text parser
	'WTP_TEXT_NOT_FOUND'		  : "Konnte '$1' nicht im Wikitext finden.",
	'WTP_NOT_IN_NOWIKI'			  : "'$1' ist Teil eines &lt;nowiki&gt;-Abschnitts.\nEr kann nicht annotiert werden.",
	'WTP_NOT_IN_TEMPLATE'		  : "'$1' ist Teil einer Vorlage.\nEr kann nicht annotiert werden.",
	'WTP_NOT_IN_ANNOTATION'		  : "'$1' ist Teil einer Annotation.\nEr kann nicht annotiert werden.",
	'WTP_NOT_IN_QUERY'            : "'$1' ist Teil einer Query.\nEr kann nicht annotiert werden.",
        'WTP_NOT_IN_TAG'                  : "'$1' ist innerhalb eines Tags $2.\nEr kann nicht annotiert werden.",
	'WTP_NOT_IN_PREFORMATTED'	  : "'$1' ist Teil eines vorformatierten Textes.\nEr kann nicht annotiert werden.",
	'WTP_SELECTION_OVER_FORMATS'  : "Die Auswahl erstreckt sich über verschiedene Formate:\n$1",
	
	// ACL extension
	'smw_acl_*' : '*',
	'smw_acl_read' : 'lesen',
	'smw_acl_edit' : 'editieren',
	'smw_acl_create' : 'erzeugen',
	'smw_acl_move' : 'umbenennen',
	'smw_acl_permit' : 'erlauben',
	'smw_acl_deny' : 'verbieten',
	'smw_acl_create_denied' : 'Sie sind nicht berechtigt, den Artikel "$1" zu erzeugen.',
	'smw_acl_edit_denied'   : 'Sie sind nicht berechtigt, den Artikel "$1" zu bearbeiten.',
	'smw_acl_delete_denied' : 'Sie sind nicht berechtigt, den Artikel "$1" zu löschen.',

	
	
	// Treeview
    'smw_stv_browse' : 'browsen',
    
	// former content
	'PROPERTY_NS_WOC'         : 'Attribut', // Property namespace without colon
	'RELATION_NS_WOC'         : 'Relation', // Relation namespace without colon
	'CATEGORY_NS_WOC'         : 'Kategorie', // Category namespace without colon
	
	'CATEGORY'                : "Kategorie:",
	'PROPERTY'                : "Attribut:",
	'TEMPLATE'                : "Vorlage:",
	'TYPE'                    : 'Typ:',

	
	
	'smw_wwsu_addwscall'			:	'Web Service Aufruf hinzufügen',
	'smw_wwsu_headline'			:	'Web Service',
	'Help'			:	'Hilfe',
	
	// Derived facts
	'DF_REQUEST_FAILED' : 'Fehler! Die abgeleiteten Fakten konnten nicht ermittelt werden.',

	// Semantic Toolbar General
	'STB_LINKS'		: 'Links zu anderen Seiten',
	'STB_TOOLS'		: 'Semantische Werkzeuge', 
	'STB_FACTS'		: 'Fakten zu diesem Artikel',
	'STB_ANNOTATION_HELP' 	: 'Semantische Werkzeuge',
	'STB_TITLE'				: 'Data toolbar'
	
};

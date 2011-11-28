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
 * @ingroup OntologyBrowser
 * @author Thomas Schweitzer
 */

var OBAdvancedOptions = Class.create();

/**
 * The class OBAdvancedOptions stores all advanced options for the ontology
 * browser and provides the callbacks for user interface.
 */
OBAdvancedOptions.prototype = {

	/**
	 * Constructor of class OBAdvancedOptions
	 */
	initialize : function() {
		this.dataSource = "";
		this.bundle = "";
	},

	/**
	 * Returns the name of the currently selected data source.
	 */
	getDataSource : function() {
		return this.dataSource;
	},

	/**
	 * Returns the name of the currently selected data source.
	 */
	getBundle : function() {
		return this.bundle;
	},

	/**
	 * Sets the name of the current data source.
	 */
	setDataSource : function(dataSource) {
		this.dataSource = dataSource;
	},

	/**
	 * List of requested metadata properties. Uses same syntax as metadata
	 * request in ASK queries.
	 */
	requestedMetaproperties : function() {
		return "(SWP2_AUTHORITY)";
	},

	/**
	 * Retrieves the current list of currently selected data sources and stores
	 * them in <this.dataSource>
	 */
	updateDataSources : function() {
		var dss = $('dataSourceSelector');
		var value = "";
		dss.descendants().each(function(opt) {
			if (opt.selected == true) {
				value += "," + opt.getAttribute("sourceid");
			}
		});
		if (value.length > 0) {
			value = value.substr(1);
		}
		this.dataSource = value;

	},

	/**
	 * Retrieves the current list of currently selected data sources and stores
	 * them in <this.dataSource>
	 */
	updateBundles : function() {
		var dss = $('bundleSelector');
		var value = "";
		dss.descendants().each(function(opt) {
			if (opt.selected == true) {
				value += "," + opt.getAttribute("bundleid");
			}
		});
		if (value.length > 0) {
			value = value.substr(1);
		}
		this.bundle = value;

	},

	/**
	 * Opens or closes the box of advanced option depending on its current
	 * state.
	 */
	foldAdvancedOptionsBox : function() {
		var obj = $('aoFoldIcon');
		var classes = obj.classNames().toArray();
		var addClass = 'aoFoldOpen';
		var removeClass = 'aoFoldClosed';

		if (classes.indexOf('aoFoldOpen') != -1) {
			// The option box is open => close it
			addClass = 'aoFoldClosed';
			removeClass = 'aoFoldOpen';
			doOpen = false;
			$('aoContent').hide();
		} else {
			$('aoContent').show();
		}
		obj.addClassName(addClass);
		obj.removeClassName(removeClass);
	},

	

	/**
	 * Initializes the callbacks for the UI after the window was loaded.
	 */
	onLoad : function(event) {
		
		if ($('dataSourceSelector') != null) {
			obAdvancedOptions.updateDataSources();
			Event.observe('dataSourceSelector', 'change', function(event) {
				obAdvancedOptions.updateDataSources();
				resetOntologyBrowser();
			});
		}

		obAdvancedOptions.updateBundles();
		Event.observe('bundleSelector', 'change', function(event) {
			obAdvancedOptions.updateBundles();
			resetOntologyBrowser();
		});

		Event.observe('aoFoldIcon', 'click', function(event) {
			obAdvancedOptions.foldAdvancedOptionsBox();
		});

		Event.observe('aoTitle', 'click', function(event) {
			obAdvancedOptions.foldAdvancedOptionsBox();
		});

		$('aoContent').hide();
	}
}
window.obAdvancedOptions = new OBAdvancedOptions();
Event.observe(window, 'load', obAdvancedOptions.onLoad
		.bindAsEventListener(obAdvancedOptions));

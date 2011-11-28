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
 * 
 * @file
 * @ingroup SMWHaloSemanticToolbar
 * @author: Thomas Schweitzer
 *  framework for menu container handling of STB++
 */

window.DivContainer = Class.create();

DivContainer.prototype = {


	/**
	 * @public
	 *
	 * Constructor. set container number and tab number.
	 */
	initialize: function() {
		this.visibility = true;
		this.plusminus = STBIMGMINUS;
	},

	createContainer: function(contnum, tabnr) {
		this.contnum = contnum;
		this.tabnr = tabnr;
	},

	/**
	 * fire content changed event to notify the framework
	 */
	contentChanged : function() {
		stb_control.contentChanged(this.getContainerNr());
	},
    
    // @abstract
    showContainerEvent: function() {
        // no impl
    },
    
    // @abstract
    showTabEvent: function(tabnum) {
        // no impl
    },
        
	// tab
	setTab : function(tabnr) {
		this.tabnr = tabnr;
	},

	getTab : function() {
		return this.tabnr;
	},

	setContainerNr : function(contnum) {
		this.contnum = contnum;
	},

	getContainerNr : function() {
		return this.contnum;
	},

	setVisibility : function(visibility) {
		this.visibility = visibility;
	},

	isVisible : function() {
		return this.visibility;
	},

	setHeadline : function(headline) {
		this.headline = headline;
		var imgsrc = wgScriptPath + (this.visibility ? STBIMGMINUS : STBIMGPLUS)
        try {
            $("stb_cont"+this.getContainerNr()+"-headline").update("<div style=\"cursor:pointer;cursor:hand;\" onclick=\"stb_control.contarray["+this.getContainerNr()+"].switchVisibility()\"><a id=\"stb_cont" + this.getContainerNr() + "-link\" class=\"minusplus\" href=\"javascript:void(0)\"><img id=\"stb_cont" + this.getContainerNr() + "-icon\" src=\""+imgsrc+"\" border=\"0\"/></a>" + headline);
        } catch (e) {}
	},

	setContent : function(content) {
		this.content = content;
        try {
			var obj = $("stb_cont"+this.getContainerNr()+"-content");
			if (obj) {
	            obj.update(content);
			} 
        } catch (e) {}
	},

	setContentStyle : function(style) {
        try {
            $("stb_cont"+this.getContainerNr()+"-content").setStyle(style);
        } catch (e) {}
	},

	switchVisibility : function(container) {
		if (this.isVisible()) {
			if (this.getContainerNr() == HELPCONTAINER) {
				stb_control.setHelpCookie(0);
			}
			this.setVisibility(0);
		} else {
			if (this.getContainerNr() == HELPCONTAINER) {
				stb_control.setHelpCookie(1);
			}
			this.setVisibility(1);
		}
		// inform framework to hide
		stb_control.contentChanged(this.getContainerNr());
	},

	getVisibleHeight : function() {
        try {
            return $('stb_cont'+this.getContainerNr()+"-content").offsetHeight;
        } catch(e) {
            return 0;
        }
	},

	getNeededHeight : function() {
        try {
    		return $('stb_cont'+this.getContainerNr()+"-content").scrollHeight;
        } catch(e) {
            return 0;
        }
	}
}

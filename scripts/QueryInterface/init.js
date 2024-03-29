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

var isInit = false;

jQuery(document).ready(function(){
  //initialize QI script objects and vars
  isInit || init();
  //if displayed in dialog hide everything except <div id='qicontent'>
  var ckeParam = jQuery.query.get('rsargs');
  var ckeFound = false;
  jQuery.each(ckeParam, function(index, value){
    if(value.indexOf('CKE') === 0){
      ckeFound = true;
      return false; //break out of jQuery.each loop
    }
  });

  if(ckeFound){
    var qiContentDiv = jQuery('#qicontent');
    qiContentDiv.siblings().not('[id^="stb-qi"]').each(function(){
      jQuery(this).css('display', 'none');
    });
    qiContentDiv.parents().not('body, html').each(function(){
      jQuery(this).siblings().not('[id^="stb-qi"]').each(function(){
        jQuery(this).css('display', 'none');
      });
    });

    //put qihelper in parent window so is can be used in the dialog script
    window.parent.qihelper = qihelper;
  }
});

//document ready somehow is not fired in Special:QueryInterface
isInit || init();


function initToolTips(){
  var qtipConfig = {
    content: {text: ''},
    overwrite: false,
    show: {
      solo: true,
      when: {
        event: 'mouseover'
      },
      delay: 100
    },
    hide: {
      when: {
        event: 'mouseout'
      },
      delay: 0
    },
    style: {
      classes: 'ui-tooltip-blue ui-tooltip-shadow ui-tooltip-qiQtip'
    },
    position: {
      my: 'top left',
      at: 'bottom center',
      target: 'mouse',
      viewport: $(window),
      adjust: {
        y: 0,
        x: 20
      }
    }
  };

//get all elements with onmouseover="Tip('...')" attribute or title attribute and attach qTip tooltip to them
  jQuery('[onmouseover^="Tip("]').not('#qiLoadConditionTerm').each(function(){
    var element = jQuery(this);
    var toolTip = element.attr('onmouseover').toString();
    toolTip = /[.\n\r\s]+Tip\(\"([^\"]*?)\"|\'([^\']*?)\'\)[.\n\r\s]*/i.exec(toolTip);
    if ( toolTip && toolTip.length ){
      if( jQuery.client.profile().name == 'msie' ) {
        toolTip = toolTip[toolTip.length - 1];
      }
      else{
        toolTip = toolTip[1] ? toolTip[1] : toolTip[2];
      }
    }
    element.attr('title', toolTip);
    element.removeAttr('onmouseover');
  });

  jQuery('#qicontent [title]').each(function(){
    qtipConfig.content.text = jQuery(this).attr('title');
    jQuery(this).qtip(qtipConfig).mouseover(function(e){
      e.stopPropagation();
    });
  });
}


function init(){
  isInit = true; 
  initialize_qi();
  initToolTips();
}
  

 


window.LiveQuery = {
    helper : {
        getResultPrinter:function(id, query, frequency){
        	var target = function(x) {
                if (x.status == 200) jQuery('#'+id).html(x.responseText);
                else jQuery('#'+id).html("<div class='error'>Error: " + x.status + " " + x.statusText + " (" + x.responseText + ")</div>");
                
                if(frequency*1 > 0){
                	window.setTimeout('LiveQuery.helper.getResultPrinter("' + id + '", "' + query + '", "' + frequency + '")', frequency*1000);
        		}
             };
             sajax_do_call('smwf_lq_refresh', [id, query], target);
        }
    }
};

jQuery(document).ready( function($) {
	jQuery('.lq-container').each(function(){
		LiveQuery.helper.getResultPrinter(
			jQuery(this).attr('id'),
			jQuery('.lq-query', this).html(),
			jQuery(this).attr('lq-frequency'));
	});
});
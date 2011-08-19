var CREATENEWARTICLE = {
	EMPTY_IN_WIKITEXT : 'Empty Article in WikiText editor',
	EMPTY_IN_WYSIWYG : 'Empty Article in WYSIWYG editor',
	ADD_AND_EDIT_CATEGORY : 'Add and edit Category',
	ADD_AND_EDIT_PROPERTY : 'Add and edit Property',
	ADD_AND_EDIT_TEMPLATE : 'Add and edit Template',
	ADD_AND_EDIT_FORM : 'Add and edit Form',
	CATEGORY_STR : '(Category)',
	FORM_STR : '(Form)',
	BIND_CONTROL_ID : '#createNewArticleCtrl',
	imgPath : wgScriptPath + '/extensions/SMWHalo/skins/CreateNewArticle/',
	articleExists : false,
        articleTimeoutId : 0,
        categoryTimeoutId : 0,
	fancyBoxContent : function(){
		return '<form action=\"\" method=\"get\">\
			<table id=\"fancyboxTable\">\<tr>\<td colspan=\"2\" class=\"fancyboxTitleTd\">Create New Article</td></tr>\
		<tr><td colspan=\"2\" class=\"userInstructionTd\"><span>Enter the name for the new article:</span></td></tr>\
		<tr><td colspan=\"2\"><input type=\"text\" id=\"newArticleName\" class=\"articleNameInput\"/></td></tr>\
		<tr><td id=\"articleExistTableTd\"><table id=\"articleExistTable\"><tr>\
			<td id=\"errorImgTd\"></td><td class=\"articleExistsErrorTd\"><span id=\"errorMsg\"></span><span id=\"errorLink\"></span></td>\
		</tr></table></td></tr>\
		<tr><td colspan=\"2\" class=\"userInstructionTd\"><span>Select the layout of the new article:</span></td></tr>\
		<tr><td colspan=\"2\"><select id=\"listOfTemplatesAndCategories\" size=\"10\" class=\"templatesAndCategoriesSelect\">\
					<option>' + this.EMPTY_IN_WYSIWYG + '</option>\
					<option>' + this.EMPTY_IN_WIKITEXT + '</option>\
					</select></td>\
		</tr>\
		<tr>\
			<td colspan=\"2\" class=\"layoutDescriptionTd\">\
			<table><tr>\
			<td rowspan=\"2\" id=\"selectedDescImgTd\"></td><td id=\"selectedTitleTd\"></td></tr>\
			<tr><td id=\"selectedDescTd\" class=\"layoutDescriptionTd\"></td>\
			</tr></table>\
			</td>\
		</tr>\
		<tr>\
			<td colspan=\"2\" class=\"btnTableTd\">\
				<table id=\"btnTable\" class=\"btnTable\">\
					<tr>\
						<td><input type=\"submit\" value=\"OK\" id=\"cna_submitBtn\"/></td>\
						<td>|</td>\
						<td><a id=\"cna_cancelBtn\">Cancel</a></td>\
					</tr>\
				</table>\
			</td>\
		</tr>\
	</table>\
	</form>';
	},
	
	initForm : function(form, articleTitle, creationMathod){
		form.remove(':hidden');
		switch(creationMathod){
			case this.EMPTY_IN_WIKITEXT:
				form.attr('action', wgServer + wgScriptPath + '/index.php');
				form.append('<input type="hidden" name="title" value="' + articleTitle + '">');
				form.append('<input type="hidden" name="action" value="edit">');
				break;
				
			case this.EMPTY_IN_WYSIWYG:
				form.attr('action', wgServer + wgScriptPath + '/index.php');
				form.append('<input type="hidden" name="title" value="' + articleTitle + '">');
				form.append('<input type="hidden" name="action" value="edit">');
				form.append('<input type="hidden" name="mode" value="wysiwyg">');
				break;
				
			default:
				if(creationMathod.indexOf(this.CATEGORY_STR) > 0){
					var category = jQuery("#listOfTemplatesAndCategories option:selected").val();
					category = category.substring(0, category.indexOf(this.CATEGORY_STR));
					form.attr('action', wgServer + wgScriptPath + '/index.php/Special:FormEdit');
					form.append('<input type="hidden" name="target" value="' + articleTitle + '">');
					form.append('<input type="hidden" name="categories" value="' + category + '">');
				}
				else if(creationMathod.indexOf(this.FORM_STR) > 0){
					var formName = jQuery("#listOfTemplatesAndCategories option:selected").val();
					formName = formName.substring(0, formName.indexOf(this.FORM_STR));
					form.attr('action', wgServer + wgScriptPath + '/index.php/Special:FormStart');
					form.append('<input type="hidden" name="page_name" value="' + articleTitle + '">');
					form.append('<input type="hidden" name="form" value="' + formName + '">');
				}
				break;
		}
	},
	
	articleTitleChange : function(){
		var articleExistsErrorMsgSpan = jQuery('#errorMsg');
		var articleExistsErrorLinkSpan = jQuery('#errorLink');
		var articleExistsErrorImgTd = jQuery('#errorImgTd');
		var articleTitleTextBox = jQuery('#newArticleName');
//			var keycode = event.which;
			CREATENEWARTICLE.validate();
			var articleTitle = articleTitleTextBox.val();
			if(!articleTitle){
				articleExistsErrorImgTd.empty();
				articleExistsErrorMsgSpan.empty();
				articleExistsErrorLinkSpan.empty();
				articleTitleTextBox.removeClass('redInputBox');
				articleTitleTextBox.removeClass('greenInputBox');
				articleTitleTextBox.addClass('whiteInputBox');						
			}
//			else if(keycode !== 37 && keycode !== 39){
			else{
				CREATENEWARTICLE.showActivity();
                                if(CREATENEWARTICLE.articleTimeoutId){
                                    window.clearTimeout(CREATENEWARTICLE.articleTimeoutId);
                                }
                                CREATENEWARTICLE.articleTimeoutId = window.setTimeout(function(){
                                    sajax_do_call('smwf_na_articleExists', [articleTitle], function(request){
					var articleExists = request.responseText;
					articleExists = articleExists.split(';');
					if(jQuery('#newArticleName').val() === articleExists[1]){
						if(articleExists[0] !== 'false'){
							CREATENEWARTICLE.articleExists = true;
							articleExistsErrorImgTd.html('<img src=\"' + CREATENEWARTICLE.imgPath + 'warning.png\"/>');
							articleExistsErrorMsgSpan.html('This page name already exists. You can enter a different article name or open this article: ');
							articleExistsErrorLinkSpan.html('<a href=\"' + wgServer + wgScriptPath + '/index.php/' + articleTitle + '\">' + CREATENEWARTICLE.shorterString(articleTitle, 20) + '</a>');
							articleTitleTextBox.removeClass('greenInputBox');
							articleTitleTextBox.removeClass('whiteInputBox');			
							articleTitleTextBox.addClass('redInputBox');
						}
						else{
							CREATENEWARTICLE.articleExists = false;
							articleExistsErrorImgTd.empty();
							articleExistsErrorMsgSpan.empty();
							articleExistsErrorLinkSpan.empty();
							articleTitleTextBox.removeClass('redInputBox');
							articleTitleTextBox.removeClass('whiteInputBox');	
							articleTitleTextBox.addClass('greenInputBox');
						}
				
						CREATENEWARTICLE.hideActivity();
					}
				})}, 500);
			}
	},
	
	setRationaleDescription : function(selectedValue){
		switch(selectedValue){
			case this.EMPTY_IN_WIKITEXT:
				jQuery('#selectedTitleTd').html(this.selectedValue + ':');
				jQuery('#selectedDescTd').text('Create an empty article in WikiText editor');
				jQuery('#selectedDescImgTd').html('<img src="' + this.imgPath + 'info.png"/>');
				jQuery('#listOfTemplatesAndCategories').focus();
				CREATENEWARTICLE.hideActivity();
				jQuery('#newArticleName').removeAttr('disabled');
				break;
				
			case this.EMPTY_IN_WYSIWYG:
				jQuery('#selectedTitleTd').html(this.selectedValue + ':');
				jQuery('#selectedDescTd').text('Create an empty article in WYSIWYG editor');
				jQuery('#selectedDescImgTd').html('<img src="' + this.imgPath + 'info.png"/>');
				jQuery('#listOfTemplatesAndCategories').focus();
				CREATENEWARTICLE.hideActivity();
				jQuery('#newArticleName').removeAttr('disabled');
				break;
				
			default:
				var titleString;
				var categoryIndex = selectedValue.indexOf(this.CATEGORY_STR);
				var formIndex = selectedValue.indexOf(this.FORM_STR);
				var formStr = 'Form:';
				var categoryStr = 'Category:';
				if(categoryIndex > 0){
					titleString = categoryStr + selectedValue.substr(0, categoryIndex);
				}
				else if(formIndex > 0){
					titleString = formStr + selectedValue.substr(0, formIndex);
				}
				CREATENEWARTICLE.showActivity();
				jQuery('#newArticleName').attr('disabled', 'disabled');
                                if(CREATENEWARTICLE.categoryTimeoutId){
                                    window.clearTimeout(CREATENEWARTICLE.categoryTimeoutId);
                                }
                                CREATENEWARTICLE.categoryTimeoutId = window.setTimeout(function(){
                                    sajax_do_call('smwf_na_getPropertyValue', [titleString, 'Rationale'], function(request){
					var responseText = request.responseText.split(';');
					var title = responseText[1];
					var formIndex = title.indexOf(formStr);
					var categoryIndex = title.indexOf(categoryStr);
					if(formIndex === 0)
						title = title.substr(formStr.length, title.length - 1);
					else if(categoryIndex === 0)
						title = title.substr(categoryStr.length, title.length - 1);
					
					if(jQuery('#listOfTemplatesAndCategories option:selected').val().indexOf(title) == 0){
						jQuery('#selectedTitleTd').html(CREATENEWARTICLE.shorterString(selectedValue, 55) + ':');
						jQuery('#selectedDescTd').html(responseText[0]);
						jQuery('#selectedDescImgTd').html('<img src="' + CREATENEWARTICLE.imgPath + 'info.png"/>');
	//					jQuery.fancybox.resize();
						CREATENEWARTICLE.hideActivity();
						jQuery('#newArticleName').removeAttr('disabled');
					}
					CREATENEWARTICLE.validate();
					jQuery('#listOfTemplatesAndCategories').focus();
					
				})}, 500);
				break;
			}
	},
						
						
	buildListOfFormsAndCategories : function(){
		var forms;
		var categories;
		var listBox = jQuery('#listOfTemplatesAndCategories');
		
		//ajax call to get a list of forms
		CREATENEWARTICLE.showActivity();	
		sajax_do_call('smwf_na_getForms', [''], function(request){
			forms = request.responseText;
			forms = forms.split(',');
			forms = jQuery.grep(forms, function(element, index){
				  return (element);
				});
			for(i = 0; forms && i < forms.length; i++){
				forms[i] += '  (Form)';
			}
			//ajax call to get a list of categories
			sajax_do_call('smwf_na_getCategories', [''], function(request){
				categories = request.responseText;
				categories = categories.split('Category:');
				categories = jQuery.grep(categories, function(element, index){
					  return (element);
					});
				for(i = 0; categories && i < categories.length; i++){
					categories[i] += '  (Category)';
				}
				var mergedArray = jQuery.merge(forms, categories);
				mergedArray.sort(function(a, b) {
					   var compA = a.toUpperCase();
					   var compB = b.toUpperCase();
					   return (compA < compB) ? -1 : (compA > compB) ? 1 : 0;
					});

				for(i = 0; mergedArray && i < mergedArray.length; i++){
					listBox.append('<option>' + mergedArray[i] + '</option>')
				}
				CREATENEWARTICLE.hideActivity();
			});
		});
		
		
	},
	
	shorterString : function(theString, numOfLetters){
		if(theString && jQuery.trim(theString).length > numOfLetters){                    
                    if(theString.indexOf(this.CATEGORY_STR) == theString.length - this.CATEGORY_STR.length){
                        theString = theString.substr(0, numOfLetters - 3 - this.CATEGORY_STR.length);
                        theString += '...';
                        theString += this.CATEGORY_STR;
                    }
                    else if(theString.indexOf(this.FORM_STR) == theString.length - this.FORM_STR.length){
                        theString = theString.substr(0, numOfLetters - 3 - this.FORM_STR.length);
                        theString += '...';
                        theString += this.FORM_STR;
                    }	
                    
		}
		return theString;
	},
	
	validate : function(){
		if(jQuery('#newArticleName').val() && jQuery('#listOfTemplatesAndCategories option:selected').val() &&
				!CREATENEWARTICLE.articleExists){
			jQuery('#cna_submitBtn').removeAttr('disabled');
		}
		else{
			jQuery('#cna_submitBtn').attr('disabled', 'disabled');
		}
	},
	
	showActivity : function(){
		jQuery('#cna_submitBtn').attr('disabled', 'disabled');
		jQuery.fancybox.showActivity();	
	},
	
	hideActivity : function(){
		CREATENEWARTICLE.validate();
		jQuery.fancybox.hideActivity();	
	}
}



jQuery(document).ready(function() {
	if(jQuery.query.get('todo').toLowerCase() === 'createnewarticle'){
            jQuery.fancybox({ 
			'content'  : CREATENEWARTICLE.fancyBoxContent(),
			'modal'  : true,
			'width'		: '75%',
			'height'	: '75%',
			'autoScale'	: false,
			'overlayColor'  : '#222',
			'overlayOpacity' : '0.8',
			'scrolling' : 'no',
			'titleShow'  : false,
			'onCleanup'  : function(){
				document.location.search = jQuery.query.remove('todo');
			},
			'onComplete'  : function(){
				jQuery('#fancybox-close').css('background-image','url("' + CREATENEWARTICLE.imgPath + 'fancy_close.png")').css('display', 'inline');
				
				var articleTitleTextBox = jQuery('#newArticleName');
				//build list of forms and categories
				CREATENEWARTICLE.buildListOfFormsAndCategories();
				//set article title from url parameter
				articleTitleTextBox.val(jQuery.query.get('newarticletitle'));
				
				articleTitleTextBox.change(function(){
					articleTitleTextBox.trigger('keyup');
				});
				
				articleTitleTextBox.keyup(function() {
					CREATENEWARTICLE.articleTitleChange();
				});
				
				articleTitleTextBox.trigger('keyup');
				
				jQuery('#cna_cancelBtn').click(function() {
					jQuery.fancybox.close();
				});
				
				jQuery('#cna_submitBtn').click(function() {
					CREATENEWARTICLE.initForm(jQuery('form'), jQuery('#newArticleName').val(), jQuery('#listOfTemplatesAndCategories option:selected').val());
					return true;
				});
				
				jQuery('#listOfTemplatesAndCategories').change(function()
				{
					CREATENEWARTICLE.setRationaleDescription(jQuery('#listOfTemplatesAndCategories option:selected').val());
				});
				
				jQuery('#fancyboxTitleTable img').click(function()
				{
					jQuery.fancybox.close();
				});
                                
                                jQuery('#newArticleName').keypress(function(event) {
                                    if (event.which == 13 && !jQuery('#cna_submitBtn').attr('disabled')) {
                                        jQuery('#cna_submitBtn').click();
                                    }
                                });

                                jQuery('#listOfTemplatesAndCategories').keypress(function(event) {
                                    if (event.which == 13 && !jQuery('#cna_submitBtn').attr('disabled')) {
                                        jQuery('#cna_submitBtn').click();
                                    }
                                });
				
				jQuery.fancybox.resize();
				jQuery.fancybox.center();
				
				articleTitleTextBox.trigger('focus');                               
                                
				}
		}).click();
	}
		
	

	jQuery(CREATENEWARTICLE.BIND_CONTROL_ID).click(function(event) {
		document.location.search = jQuery.query.set('todo', 'createnewarticle');
		event.preventDefault();
	});
        
        
});
//If you want to create a plugin (see at the bottom arround the line 50), you will have to add the below line
if(typeof RedactorPlugins == 'undefined') var RedactorPlugins = {};

!function($, window, document, undefined)
{
	var enableDemoPlugin = true; //if you don't want to enable the demo plugin (for test purpose), set it to false

	$(document).on('EditorInit', function(e, data){
		console.info('The XenForo EditorInit event is called');
	
		var editorFramework = data.editor,	//You can access the XenForo editor framework functions here
			config = data.config; 		//You can modify the XenForo editor config here

		var demoButtonCallback = function(ed)
		{
      			/*If you want to insert immediately some html, uncomment the below line*/
      				//ed.execCommand('inserthtml', 'Your Html'); return false;

      			/*If you want to open an overlay*/
      			ed.saveSelection();
      			
      			ed.modalInit(editorFramework.getText('custom_demo_title'), { url: editorFramework.dialogUrl + '&dialog=demo' }, 600, $.proxy(function()
      			{
      				/***
      					Note that above the dialog name is called "demo", so the targeted template will be "editor_dialog_demo"
      					The getText function allows the text to be translated provided you reference it in the "editor_js_setup" template inside the "RELANG.xf" object
      				**/
      				$('#redactor_insert_demo_btn').click(function(e) {
      					e.preventDefault();
      					
      					var output = $('#redactor_demo_text').val();
      					output = XenForo.htmlspecialchars(output);
      						//XenForo doesn't have a full escapeHtml function, so let's tweak it a little
      						output = output
      							.replace(/\t/g, '	')
      							.replace(/ /g, '&nbsp;')
      							.replace(/\n/g, '</p>\n<p>');
      		
      					ed.restoreSelection();
      					ed.execCommand('inserthtml', '[DEMO]'+output+'[/DEMO]');
      					//editorFramework.wrapSelectionInHtml(ed, '[DEMO]', '[/DEMO]', true);
      					ed.modalClose();
      				});
	
      				ed.$editor.trigger('demoBtnModalReady'); //ignore this
      			}, ed));
		};

		/*Let's tweak the demo Bb Code button by registering the above callback*/
		if(typeof config.buttonsCustom != undefined && typeof config.buttonsCustom.custom_demo != undefined){
			var demoButton = config.buttonsCustom.custom_demo;

			demoButton.callback = demoButtonCallback;
		}

		/***
		* For those who need to write a plugin, here's the optional code
		* If you don't need, just delete this part.
		* The plugin id here is "myPlugin"
		**/	
		RedactorPlugins.myPlugin = {
			init: function()
			{
				if(!enableDemoPlugin) return false;
				
				console.info('The Redactor Plugin init event is called');
				
				/**
				* If you want to listen an event
				***/
				this.$editor.on('keyup', $.proxy(function(e)
				{
					console.info('The Key up event has been called in the editor');
					var html = this.$editor.html();
					//console.log(html);
				}, this));

				/**
				* If you want to add programmatically a new extra button
				* Disclaimer: the Redactor adding button function doesn't update some elements in its objets,
				*             so it might be difficult for other developers to check if your button has been added or not
				***/
				var extraBtnId = 'my_extra_btn_id';
				
				this.addBtn(
					extraBtnId,						//id
					'My extra programmatically Button Title',		//title
					this.extraBtnCallback					//callback when click
					// a fourth parameter can be used to build a dropdown (check the redactor source for this)
				);
				
				//Let's modify the added button to match the default html structure 
				this.extraBtnFormatLayout(extraBtnId);
			},
			extraBtnCallback: function(ed)
			{
				console.log('The extra button have been called');
				
				//Let's plug this callback on the above callback "demoButtonCallback"
				demoButtonCallback(ed);
				
				//Let's modify the modal title to make a difference
				ed.$editor.on('demoBtnModalReady', function(e){
					$('#redactor_modal_header').text($('#redactor_modal_header').text() + ' - trigger from the programmatically button');
				});
			},
			extraBtnFormatLayout: function(id)
			{
				var $toolbar = this.$toolbar,
					$extraBtn = $toolbar.find('.redactor_btn_' + id),
					$wrapper = $('<li class="redactor_btn_container_' + id + '">');

				$extraBtn
					// the button will be added to the last buttons group
					.appendTo($toolbar.find('> .redactor_btn_group:last > ul')) 
					// the button needs a wrapper to match the default html structure
					.wrap($wrapper);
					
				/**
				* You just need now to set a css for this button in your extra template for example. Ie:
				*
				*	html .redactor_toolbar li a.redactor_btn_my_extra_btn_id {
				*		background-position: 3px -2845px;
				*	}
				***/
			}
		};
	
		if(typeof config.plugins === undefined || !$.isArray(config.plugins)){
			config.plugins = [];
		}
		
		config.plugins.push('myPlugin');
	});
}
(jQuery, this, document, 'undefined');
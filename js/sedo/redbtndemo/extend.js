!function($, window, document, undefined)
{
	$(document).on('EditorInit', function(e, data){
		console.info('The XenForo EditorInit event is called');
	
		var editorFramework = data.editor,	//You can access the XenForo editor framework functions here
			config = data.config; 		//You can modify the XenForo editor config here

		/*Let's tweak the demo Bb Code button callback*/
		if(typeof config.buttonsCustom != undefined && typeof config.buttonsCustom.custom_demo != undefined){
			var demoButton = config.buttonsCustom.custom_demo;

			demoButton.callback = function(ed){
				/*If you want to insert immediately some html, uncomment the below line*/
					//ed.execCommand('inserthtml', 'Your Html');

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
				}, ed));
			};
		}

		/*For those who need to write a plugin, here's the optional code*/	
		if(typeof RedactorPlugins == undefined) var RedactorPlugins = {};
		
		RedactorPlugins.myPlugin = {
			init: function()
			{
				console.info('The Redactor Plugin init event is called');
				
				this.$editor.on('keyup', $.proxy(function(e)
				{
					console.info('The Key up event has been called in the editor');
					var html = this.$editor.html();
					//console.log(html);
				}, this));   
			}
		};
	
		if(typeof config.plugins === undefined || !$.isArray(config.plugins)){
			config.plugins = ['myPlugin'];
		}else{
			config.plugins.push('myPlugin');
		}
	});
}
(jQuery, this, document, 'undefined');
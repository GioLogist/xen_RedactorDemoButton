<?php
class Sedo_RedBtnDemo_Listener_AllInOne
{
	public static function EditorSetup(XenForo_View $view, $formCtrlName, &$message, array &$editorOptions, &$showWysiwyg)
	{
		$bbCodes = isset($editorOptions['json'], $editorOptions['json']['bbCodes']) ? $editorOptions['json']['bbCodes'] : array();
		//For people who needs to access to Bb Codes by php 
	}
	
	public static function RedactorBtnCallback(array $tag, array $rendererStates, XenForo_BbCode_Formatter_Base $formatter)
	{
		//For people who needs a callback for the Button
		$content = $formatter->renderSubTree($tag['children'], $rendererStates);
		$option = $tag['option'];
		$htmlOption = ($tag['option'] == 'color') ? 'style="color:red"' : '';
		
		return "<div {$htmlOption}>Demo Bb Code: {$content}</div>";
	}
}
//Zend_Debug::dump($variable);
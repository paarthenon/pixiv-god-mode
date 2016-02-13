declare var $: JQueryStatic;
import {Action} from '../actionModel'

import Config from './config'

import {Dictionary} from './dict'

import {DictionaryEditor} from '../dom/dictEditor'
import {generateFontTemplate, fontString} from '../dom/fontSetup'

import {renderComponent} from '../dom/component'
import {Sidebar} from '../dom/sidebar'

export function initialize() {
	let configEditorCss = `
		#pa-assistant-raw-configuration-editor {
			position: fixed;
			bottom:10px;
			width: 80%;
			height: 30%;
			left:50%;
			transform: translateX(-50%);
			background-color: rgba(0, 0, 0, 0.2);
		}
	`;


	GM_addStyle(configEditorCss);
	GM_addStyle(generateFontTemplate(fontString.icomoon));
}

export function createSidebar(actions:Action[]){
	return renderComponent(new Sidebar(actions));
}

export function createRawConfigEditor() {
	let inputs = Config.Keys.map(key => {
		console.log(Config.get(key)); return $(`
			<div class="config-entry-container">
				<label for="pa-config-key-${key}">${key}"</label>
				<input name="pa-config-key-${key}" value="${Config.get(key)}" />
			</div>
		`)
	});

	let container = $('<div id="pa-assistant-raw-configuration-editor"></div>');
	inputs.forEach(jQInput => {
		container.append(jQInput);
	});
	return container;
}

let dictEditor:DictionaryEditor = undefined;
export function createDictionaryEditor(dict:Dictionary):JQuery {
	let editor = new DictionaryEditor(dict);
	dictEditor = editor;
	return renderComponent(editor);
	// return createDictionaryEditor(dict);
}
export function toggleEditor():void {
	dictEditor.toggleVisibility();
}
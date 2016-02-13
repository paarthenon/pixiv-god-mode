declare var $: JQueryStatic;
import {Action} from '../actionModel'

import Config from './config'

import {Dictionary} from './dict'

import {DictionaryEditor} from '../dom/dictEditor'
import {generateFontTemplate, fontString} from '../dom/fontSetup'

import {renderComponent} from '../dom/component'
import {SidebarButton} from '../dom/sidebar'

export function initialize() {
	let sidebarCss = `
		#pixiv-assistant-sidebar {
			position: fixed;
			left: 10px;
		}
		#pixiv-assistant-sidebar.open {
			top: 50%;
			transform: translateY(-50%);
		}
		#pixiv-assistant-sidebar.closed {
			bottom: 10px;
		}

		li.pa-sidebar-entry {
		    transition: opacity 0.3s;
		    opacity: 0.6;
		    display: block;
		    margin-top: 10px;
		    background-color: #000;
	    	border-radius: 24px;
		    cursor: pointer;
		    color: white;
		}
		li.pa-sidebar-entry:hover {
		    opacity: 1;
		}
		.pa-icon {
			display: inline-block;
			height: 24px;
			width: 24px;
			padding:12px;
			font-size:1.7em;
		}

	`;

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


	GM_addStyle(sidebarCss);
	GM_addStyle(configEditorCss);
	GM_addStyle(generateFontTemplate(fontString.icomoon));
}

export function createImage(b64Image:string) {
	return $(`<img src="data:image/png;base64,${b64Image}" />`);
}

export function createButton(action:Action) {
	return renderComponent(new SidebarButton(action));
}

export function createSidebar() {
	return $('<ul id="pixiv-assistant-sidebar"></ul>');
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
export function hideEditor():void {
	dictEditor.hide();
}
export function showEditor():void {
	dictEditor.show();
}
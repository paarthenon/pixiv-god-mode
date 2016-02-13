declare var $: JQueryStatic;
import {Action} from '../actionModel'

import Config from './config'

import {Dictionary} from './dict'

export var fontString = {
	icomoon: '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'
}

function generateFontTemplate(b64String:string){
	return `@font-face {
			font-family:"customicomoon";
			src: url(data:application/x-font-woff;charset=utf-8;base64,${b64String}) format('woff');
			font-style:normal;
			font-weight:normal;
		}

		[class^="pa-icon-"], [class*=" pa-icon-"] {
		    /* use !important to prevent issues with browser extensions that change fonts */
		    font-family: 'customicomoon' !important;
		    speak: none;
		    font-style: normal;
		    font-weight: normal;
		    font-variant: normal;
		    text-transform: none;
		    line-height: 1;

		    /* Better Font Rendering =========== */
		    -webkit-font-smoothing: antialiased;
		    -moz-osx-font-smoothing: grayscale;
		}

		.pa-icon-images:before {
		    content: "\\e900";
		}
		.pa-icon-stack:before {
		    content: "\\e902";
		}
		.pa-icon-mug:before {
		    content: "\\e903";
		}
		.pa-icon-menu4:before {
		    content: "\\e904";
		}
		.pa-icon-exit:before {
		    content: "\\e905";
		}
		.pa-icon-share:before {
		    content: "\\e901";
		}
		`;
}

export function initialize() {
	let tooltipCSS = `
		a.pa-tooltip {outline:none; }
		a.pa-tooltip strong {line-height:30px;}
		a.pa-tooltip:hover {text-decoration:none;}
		a.pa-tooltip span.pa-tooltip-body {
		    z-index:10;
		    display:none; 
		    padding:5px 5px; 
		    margin-left:10px;
		    margin-top:10px;
		    line-height:16px;
		    white-space: nowrap;
		}
		a.pa-tooltip:hover span.pa-tooltip-body {
		    display:inline; 
		    position:absolute; 
		    color:#111;
		    border:1px solid #888; 
		    background:#dfdfdf;
		    opacity: 100%;
		}

		a.pa-tooltip span.pa-tooltip-body
		{
		    border-radius:4px;
		    box-shadow: 5px 5px 8px #CCC;
		}`;

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

	let dictionaryEditorCss = `
		#pa-assistant-dictionary-config-editor {
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
	GM_addStyle(tooltipCSS);
	GM_addStyle(configEditorCss);
	GM_addStyle(dictionaryEditorCss);
	GM_addStyle(generateFontTemplate(fontString.icomoon));
}

export function createImage(b64Image:string) {
	return $(`<img src="data:image/png;base64,${b64Image}" />`);
}

export function createButton(action:Action) {
	console.log(action);
	return $(`<li id="pa-button-${action.id}" class="pa-sidebar-entry"></li>`)
		.css('background-color', action.color || '#000')
		.on('click', action.execute)
		// .append(createImage(imageStrings.arrow))
		.append($(`<a class="pa-tooltip"><span class="pa-icon pa-icon-${action.icon || 'images'}"></span><span class="pa-tooltip-body">${action.label}</span></span></a>'`))
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

export function createAddNewButton(callback:(key:string, value:string) => void) {
	let keyInput = $('<input placeholder="japanese">');
	let valueInput = $('<input placeholder="english">');
	let button = $('<button>Add</button>').click((event) => { console.log(keyInput); callback(keyInput.val(), valueInput.val()) });
	return $('<div class="pa-assistant-add-dictionary-item-container"></div>')
		.append(keyInput)
		.append(valueInput)
		.append(button)
}

export function createDictionaryEntryEditor(dict:Dictionary, key:string){
	let keyLabel = $(`<label>${key}</label>`);
	let valueInput = $(`<input data-dict-key="${key}" value="${dict.get(key)}" />`);
	let updateButton = $('<button>Update</button>').click(event => dict.set(key, valueInput.val()));
	let deleteButton = $('<button>Delete</button>').click(event => dict.set(key, undefined));
	return $('<div class="dictionary-config-container">')
		.append(keyLabel)
		.append(valueInput)
		.append(updateButton)
		.append(deleteButton)
}
export function createDictionaryEditor(dict:Dictionary) {
	let inputs = dict.keys.map(key => createDictionaryEntryEditor(dict, key));

	let addNewArea = createAddNewButton((key, value) => { unsafeWindow.console.log(key, value); dict.set(key, value) });

	let container = $('<div id="pa-assistant-dictionary-config-editor"></div>');

	container.append(addNewArea);

	inputs.forEach(input => {
		container.append(input);
	});
	return container;
}
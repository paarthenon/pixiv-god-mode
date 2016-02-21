
import * as DomUtils from './utils/dom'
import * as PathUtils from './utils/path'

import {dispatch} from './dispatch'
import {log} from './utils/log'

import ConfigKeys from './configKeys'
import {DictionaryService} from './utils/dict'

import * as ghUtils from './utils/github'

let page = dispatch(unsafeWindow.location.href, $);

DomUtils.initialize();

let actions = page.actionCache.slice(0);

let toggleEditor = {
	id: 'pa_toggle_dict_editor',
	label: 'Toggle Dictionary',
	color: 'green',
	execute: () => DomUtils.toggleEditor()
};

function updateDictionary(){
	let ghPath:string = 'pixiv-assistant/dictionary';
	ghUtils.getMasterCommit(ghPath, (hash) => {
		ghUtils.getDictionaryObject(ghPath, hash, (object) => {
			console.log(JSON.stringify(object));
		})
	});
}

let getDictionaryFromGH = {
	id: 'pa_get_github_dict',
	label: 'Download Dictionary',
	color: 'brown',
	execute: () => updateDictionary()
}

actions.push(toggleEditor);
actions.push(getDictionaryFromGH);

let sidebar = DomUtils.createSidebar(actions);

let editor = DomUtils.createDictionaryEditor(DictionaryService.userDictionary);
$('body').append(sidebar);
$('body').append(editor);

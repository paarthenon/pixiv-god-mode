
import * as DomUtils from './utils/dom'
import * as PathUtils from './utils/path'

import {dispatch} from './dispatch'
import {log} from './utils/log'

import ConfigKeys from './configKeys'
import {DictionaryService} from './utils/dict'

let page = dispatch(unsafeWindow.location.href, $);

DomUtils.initialize();

let actions = page.actionCache.slice(0);

let toggleEditor = {
	id: 'pa_toggle_dict_editor',
	label: 'Toggle Dictionary',
	color: 'green',
	execute: () => DomUtils.toggleEditor()
};

actions.push(toggleEditor);

let sidebar = DomUtils.createSidebar(actions);

let editor = DomUtils.createDictionaryEditor(DictionaryService.userDictionary);
$('body').append(sidebar);
$('body').append(editor);

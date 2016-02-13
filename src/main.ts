
import * as DomUtils from './utils/dom'
import * as PathUtils from './utils/path'

import {dispatch} from './dispatch'
import {log} from './utils/log'

import ConfigKeys from './configKeys'
import {DictionaryService} from './utils/dict'

let page = dispatch(unsafeWindow.location.href, $);

DomUtils.initialize();

let actions = page.actionCache.slice(0);

let hideEditor = {
	id: 'pa_hide_dict_editor',
	label: 'Hide Dictionary',
	color: 'green',
	execute: () => DomUtils.hideEditor()
};

let showEditor = {
	id: 'pa_show_dict_editor',
	label: 'Show Dictionary',
	color: 'green',
	execute: () => DomUtils.showEditor()
};

actions.push(hideEditor);
actions.push(showEditor);

let sidebar = DomUtils.createSidebar(actions);

let editor = DomUtils.createDictionaryEditor(DictionaryService.userDictionary);
$('body').append(sidebar);
$('body').append(editor);

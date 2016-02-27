import * as DomUtils from './utils/dom'
import * as PathUtils from './utils/path'

import {dispatch} from './dispatch'
import {log} from './utils/log'

import {DictionaryService} from './utils/dict'

import {Sidebar} from './dom/sidebar'
import {ControlPanel} from './dom/controlPanel'

DomUtils.initialize();

let page = dispatch(unsafeWindow.location.href, $);

let controlPanel = new ControlPanel({
	userDictionary: DictionaryService.userDictionary,
	rootDictionary: DictionaryService.baseDictionary,
	page: page
});

let togglePanel = {
	id: 'pa_toggle_control Panel',
	label: 'Control Panel',
	color: 'green',
	icon: 'equalizer',
	execute: () => controlPanel.toggleVisibility()
};

let sidebar = new Sidebar(page.actionCache.concat(togglePanel));

DomUtils.render([sidebar, controlPanel]);
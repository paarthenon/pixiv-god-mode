import * as DomUtils from './utils/dom'
import * as PathUtils from './utils/path'

import {dispatch} from './dispatch'
import {log} from './utils/log'

import {DictionaryService} from './utils/dict'

import {Sidebar} from './dom/sidebar'
import {ControlPanel} from './dom/controlPanel'
import {MiniTranslationModal} from './dom/miniTranslationModal'

import Debug from './debug'
import Config from './utils/config'
import ConfigKeys from './configKeys'

import * as appServices from './services'

DomUtils.initialize();

let page = dispatch(unsafeWindow.location.href, $);

let controlPanel = new ControlPanel({
	userDictionary: DictionaryService.userDictionary,
	rootDictionary: DictionaryService.baseDictionary,
	page: page
});

let potentialTag = PathUtils.getPotentialTag(unsafeWindow.location.href);
let translationModal = new MiniTranslationModal(DictionaryService.userDictionary, potentialTag);
translationModal.listen(MiniTranslationModal.events.addedTranslation, () => {
	page.translateTagsOnPage();
	translationModal.toggleVisibility();
});

let togglePanel = {
	id: 'pa_toggle_control_panel',
	label: 'Control Panel',
	color: 'green',
	icon: 'equalizer',
	execute: () => controlPanel.toggleVisibility()
};

let toggleTranslationModal = {
	id: 'pa_toggle_translation_modal',
	label: 'Add Translation',
	color: 'green',
	icon: 'plus',
	execute: () => translationModal.toggleVisibility()
};

let sidebar = new Sidebar(page.actionCache.concat([toggleTranslationModal, togglePanel]));

DomUtils.render([sidebar, controlPanel, translationModal]);

if (Config.get(ConfigKeys.debug_mode)) {
	Debug.page = page;
	(<any>unsafeWindow).paDebug = Debug;
	(<any>unsafeWindow).paServices = appServices;
}
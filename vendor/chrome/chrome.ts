import * as DomUtils from '../../src/utils/dom'
import * as PathUtils from '../../src/utils/path'

import {dispatch} from '../../src/dispatch'
import {log} from '../../src/utils/log'

import {DictionaryService} from '../../src/utils/dict'

import {Sidebar} from '../../src/dom/sidebar'
import {ControlPanel} from '../../src/dom/controlPanel'
import {MiniTranslationModal} from '../../src/dom/miniTranslationModal'

import Debug from '../../src/debug'
import Config from '../../src/utils/config'
import ConfigKeys from '../../src/configKeys'

import * as appServices from '../../src/services'
import * as Deps from '../../src/deps'

import * as log4js from 'log4js'

log4js.configure({
	appenders: [
		{ type: 'console' }
	]
});
let logger = log4js.getLogger('Startup');
logger.setLevel(log4js.levels.ALL);

let jQ: JQueryStatic = $;

DomUtils.initialize();

log('PA | dispatching on page');
let page = dispatch(unsafeWindow.location.href, jQ);
unsafeWindow.console.log(page);

log('PA | creating Control Panel');
let controlPanel = new ControlPanel({
	userDictionary: DictionaryService.userDictionary,
	rootDictionary: DictionaryService.baseDictionary,
	page: page
});

log('PA | creating translation modal');
let potentialTag = PathUtils.getPotentialTag(unsafeWindow.location.href);
let translationModal = new MiniTranslationModal(DictionaryService.userDictionary, potentialTag);
translationModal.listen(MiniTranslationModal.events.addedTranslation, () => {
	page.translateTagsOnPage();
	translationModal.toggleVisibility();
});

log('PA | creating action buttons');
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

log('PA | creating sidebar');
let sidebar = new Sidebar(page.actionCache.concat([toggleTranslationModal, togglePanel]));

log('PA | rendering components');
DomUtils.render((<any>unsafeWindow).$, [sidebar, controlPanel, translationModal]);

log('PA | attaching debug objects');
if (Config.get(ConfigKeys.debug_mode)) {
	Debug.page = page;
	(<any>unsafeWindow).paDebug = Debug;
	(<any>unsafeWindow).paServices = appServices;
} else {
	(<any>unsafeWindow).paEnableDebugMode = Deps.inject(function() {
		setTimeout(function() { Config.set(ConfigKeys.debug_mode, true) }, 0);
	});
}

log('PA | DebugObjects attached');

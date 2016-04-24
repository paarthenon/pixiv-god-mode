import * as DomUtils from './utils/dom'
import * as PathUtils from './utils/path'

import {dispatch} from './dispatch'
import {BasePage} from './pages/base'

import {DictionaryService} from './utils/dict'

// import {Sidebar} from './dom/sidebar'
// import {ControlPanel} from './dom/controlPanel'
// import {MiniTranslationModal} from './dom/miniTranslationModal'

import Debug from './debug'
import ConfigKeys from './configKeys'
import * as appServices from './services'

import * as log4js from 'log4js'
import * as Dependencies from './deps'

export default function Bootstrap(depsContent: Dependencies.IDependencyContainer):BasePage {
	let logger = log4js.getLogger('Startup');
	logger.info('Bootstrapping');
	Dependencies.load(depsContent);
	return dispatch(document.location.href, depsContent.jQ);
}
// logger.trace('creating Control Panel');
// let controlPanel = new ControlPanel({
// 	userDictionary: DictionaryService.userDictionary,
// 	rootDictionary: DictionaryService.baseDictionary,
// 	page: page
// });

// logger.trace('creating translation modal');
// let potentialTag = PathUtils.getPotentialTag(unsafeWindow.location.href);
// let translationModal = new MiniTranslationModal(DictionaryService.userDictionary, potentialTag);
// translationModal.listen(MiniTranslationModal.events.addedTranslation, () => {
// 	page.translateTagsOnPage();
// 	translationModal.toggleVisibility();
// });

// logger.trace('creating action buttons');
// let togglePanel = {
// 	id: 'pa_toggle_control_panel',
// 	label: 'Control Panel',
// 	color: 'green',
// 	icon: 'equalizer',
// 	execute: () => controlPanel.toggleVisibility()
// };

// let toggleTranslationModal = {
// 	id: 'pa_toggle_translation_modal',
// 	label: 'Add Translation',
// 	color: 'green',
// 	icon: 'plus',
// 	execute: () => translationModal.toggleVisibility()
// };

// logger.trace('creating sidebar');
// let sidebar = new Sidebar(page.actionCache.concat([toggleTranslationModal, togglePanel]));

// logger.trace('rendering components');
// DomUtils.render((<any>unsafeWindow).$, [sidebar, controlPanel, translationModal]);

// logger.trace('attaching debug objects');
// if (Config.get(ConfigKeys.debug_mode)) {
// 	Debug.page = page;
// 	(<any>unsafeWindow).paDebug = Debug;
// 	(<any>unsafeWindow).paServices = appServices;
// } else {
// 	(<any>unsafeWindow).paEnableDebugMode = Dependencies.inject(function() {
// 		setTimeout(function() { Config.set(ConfigKeys.debug_mode, true) }, 0);
// 	});
// }

// logger.trace('DebugObjects attached');

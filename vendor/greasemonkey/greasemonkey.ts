import {IDependencyContainer} from '../../src/deps'

import Config from './config'

let deps : IDependencyContainer = {
	jQ: $,
	config: new Config(),
	openInTab: GM_openInTab,
	execOnPixiv: undefined, //TODO: fill with lambda involving unsafeWindow
	ajaxCall: undefined //TODO: fill in with GM_XMLHTTPyada
}
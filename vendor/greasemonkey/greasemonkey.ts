import {IDependencyContainer} from '../../src/deps'

import Config from './config'

let deps : IDependencyContainer = {
	jQ: $,
	config: new Config(),
	openInTab: GM_openInTab
}
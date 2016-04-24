import {IDependencyContainer} from '../../src/deps'

import * as Q from 'q'
import * as log4js from 'log4js'

import Config from './config'

import Bootstrap from '../../src/main'

log4js.configure({
	appenders: [
		{ type: 'console' }
	]
});

function openInTab(url:string) {
	chrome.runtime.sendMessage({ type: 'openTab', url });
}

let deps: IDependencyContainer = {
	jQ: $,
	config: new Config(),
	openInTab: (url:string)=>{}
}

let page = Bootstrap(deps);
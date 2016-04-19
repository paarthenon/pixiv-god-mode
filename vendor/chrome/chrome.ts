import {IDependencyContainer} from '../../src/deps'

import * as Q from 'q'

import Config from './config'

function openInTab(url:string) {
	chrome.runtime.sendMessage({ type: 'openTab', url });
}

let deps: IDependencyContainer = {
	jQ: $,
	config: new Config(),
	openInTab: (url:string)=>{}
}
import {IDependencyContainer} from '../../src/deps'

import * as log4js from 'log4js'

import Config from './config'

import Bootstrap from '../../src/main'

log4js.configure({
	appenders: [
		{ 
			type: 'console',
			layout: {
				type: 'basic'
			}
		 }
	]
});

log4js.setGlobalLogLevel(log4js.levels.ALL);

let logger = log4js.getLogger('Chrome specific init');

logger.fatal('test');

function openInTab(url:string) {
	chrome.runtime.sendMessage({ type: 'openTab', url });
}

let deps: IDependencyContainer = {
	jQ: $,
	config: new Config(),
	openInTab: (url:string)=>{}
}

deps.config.get('test').then(content => {
	logger.fatal('tttttt', content);
}).catch(text => {
	logger.fatal('uuuuuu', text);
})

// let page = Bootstrap(deps);


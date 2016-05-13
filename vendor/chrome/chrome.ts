import {IDependencyContainer} from '../../src/deps'

import * as log4js from 'log4js'

import Config from './config'

import Bootstrap from '../../src/main'

import * as hook from './pageHook'

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

document.addEventListener('pixivExpose', function(event) {
	logger.fatal('expose', (<any>event).detail);
});

hook.inject(hook.pixivExpose);
hook.inject(hook.pixivExec);

let func1 = function(pixiv: any) {
	return pixiv.context.type;
};

// let page = Bootstrap(deps);
class ExecBroker {
	protected resolvers: { [id: number]: Function } = {};
	public nonce = 4;

	public constructor(){
		document.addEventListener('pixivExecResponse', (event) => {
			let detail: { id: number, response: any } = (<any>event).detail;
			logger.info('Broker get response', detail);

			logger.info('this', this.resolvers, this);
			let resolveFunc = this.resolvers[detail.id];
			logger.info('resolveFunc', resolveFunc, resolveFunc.toString());
			resolveFunc(detail.response);
		})
	}

	private createEvent(id:number, func:Function) {
		return new CustomEvent('pixivExec', {
			detail: JSON.stringify({
				id,
				func: func.toString()
			})
		});
	}

	public queueExecution(func:Function) {
		return new Promise(resolve => {
			let id = 4;
			this.resolvers[id] = resolve;
			document.dispatchEvent(this.createEvent(id, func));
		});
	}
}

let broker = new ExecBroker;
broker.queueExecution(func1)
	.then(result => logger.info('CS result', result));
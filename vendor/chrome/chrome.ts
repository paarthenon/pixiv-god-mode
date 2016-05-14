import {IDependencyContainer, load as depsLoad} from '../../src/deps'
import {AjaxRequest} from '../../src/IAjax'

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

hook.inject(hook.pixivExec);

class ExecBroker {
	protected resolvers: { [id: number]: Function } = {};
	protected currentIndex = 0;

	public constructor(){
		document.addEventListener('pixivExecResponse', (event) => {
			let detail: { id: number, response: any } = (<any>event).detail;
			this.resolvers[detail.id](detail.response);
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
			let id = this.currentIndex++;
			this.resolvers[id] = resolve;
			document.dispatchEvent(this.createEvent(id, func));
		});
	}
}

let broker = new ExecBroker();

import Mailman from './mailman'

let deps: IDependencyContainer = {
	jQ: $,
	config: new Config(),
	openInTab: (url: string) => { },
	execOnPixiv: (func: Function) => broker.queueExecution(func),
	ajaxCall: (req: AjaxRequest<any>) => 
		Mailman.ajax(req)
}

let page = Bootstrap(deps);
import * as log4js from 'log4js'

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

import {IDependencyContainer, load as depsLoad} from '../../src/deps'
import {AjaxRequest} from '../../src/core/IAjax'
import {Action} from '../../src/actionModel'
import * as Msg from './messages'



import Config from './config'

import Bootstrap from '../../src/main'

import * as hook from './pageHook'



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

import {default as Mailman, defineImplementation} from './mailman'

let deps: IDependencyContainer = {
	jQ: $,
	config: new Config(),
	openInTab: (url: string) => Mailman.Background.newTab({url}),
	execOnPixiv: (func: Function) => broker.queueExecution(func),
	ajaxCall: (req: AjaxRequest<any>) => 
		Mailman.Background.ajax(req)
}

let page = Bootstrap(deps);

defineImplementation<Msg.ContentScriptProtocol>("CONTENT_SCRIPT", {
	getActions: () => Promise.resolve({actions: page.actionCache}),
	performAction: msg => {
		let item = page.actionCache.find(action => action.id == msg.actionId);
		if (item) {
			item.execute();
			return Promise.resolve();
		} else {
			return Promise.reject("Action not found");
		}
	}
});


import * as Msg from './messages'
import * as ChromeUtils from './utils'
import * as log4js from 'log4js';

import {AjaxRequest} from '../../src/IAjax'

let logger = log4js.getLogger('Background');

let protocolImplementation : Msg.Protocol = {
	getConfig: msg => {
		return ChromeUtils.getFromConfig(msg.key)
			.then(contents => {
				if (msg.key in contents) {
					return contents[msg.key];
				} else {
					return Promise.reject('Key not found in data store');
				}
			})
			.then(contents => ChromeUtils.handleError(contents))
			.then<Msg.ConfigGetResponse>(value => ({ value }));
	},
	setConfig: msg => {
		return ChromeUtils.setConfig(msg.key, msg.value)
			.then(ChromeUtils.handleError)
	},
	listConfig: () => {
		return ChromeUtils.listConfigKeys()
			.then(ChromeUtils.handleError)
	},
	ajax: req => {
		return new Promise((resolve, reject) => {
			let xhr = new XMLHttpRequest();
			xhr.open(req.type, req.url, true);
			xhr.setRequestHeader("Content-Type", "application/json");
			xhr.send(JSON.stringify(req.data));
			xhr.onreadystatechange = () => {
				console.log('xhr state changed', xhr);
				if (xhr.readyState == XMLHttpRequest.DONE) {
					resolve(xhr.response);
				}
			}
		});
	}
}

function dispatch(implementation: Msg.Protocol, message: Msg.RequestWrapper<any>) : Promise<any> {
	return Promise.resolve((<any>implementation)[message.name](message.body));
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
	let message: Msg.RequestWrapper<any> = msg;

	dispatch(protocolImplementation, msg)
		.then(content => sendResponse({ success: true, data: content }))
		.catch(reason => sendResponse({ success: false, errors: reason}));
		
	return true;
});

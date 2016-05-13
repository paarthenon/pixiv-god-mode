import * as Msg from './messages'
import * as ChromeUtils from './utils'
import * as log4js from 'log4js';

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

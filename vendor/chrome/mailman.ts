import * as Msg from './messages'

export type Target = "BACKGROUND_PAGE" | "CONTENT_SCRIPT" | "RESPONSE";

function send<T, V>(target: Target, name:string, msg: T): Promise<V> {
	return new Promise((resolve, reject) => {

		function responseHandler (response: Msg.ResponseMessage) {
			if (response == undefined) {
				reject('No valid response received')
			} else {
				if (Msg.isSuccessfulResponse(response)) {
					resolve(response.data);
				}
				if (Msg.isFailedResponse(response)) {
					reject(response.errors);
				}
			}
		}

		if (target === "CONTENT_SCRIPT") {
			chrome.tabs.query({active: true, currentWindow: true}, tabs => {
				chrome.tabs.sendMessage(tabs[0].id, { target, name, body: msg }, responseHandler);
			});
		} else {
			chrome.runtime.sendMessage({ target, name, body: msg }, responseHandler);
		}
	})
} 

function generateMailman<T>(target:Target) {
	return new Proxy(<T>{}, {
		get: (_, name) => (msg: any) => send(target, name.toString(), msg)
	});
}

var mailMan = {
	Background: generateMailman<Msg.Protocol>("BACKGROUND_PAGE"),
	ContentScript: generateMailman<Msg.ContentScriptProtocol>("CONTENT_SCRIPT")
}

export default mailMan;


export function defineImplementation<T>(target:Target, implementation:T) {
	function dispatch(implementation: T, message: Msg.RequestWrapper<any>) : Promise<any> {
		return Promise.resolve((<any>implementation)[message.name](message.body));
	}

	chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
		let message: Msg.RequestWrapper<any> = msg;

		if (message.target === target) {
			dispatch(implementation, msg)
				.then(content => sendResponse({ target: "RESPONSE", success: true, data: content }))
				.catch(reason => sendResponse({ target: "RESPONSE", success: false, errors: reason}));
		}

		return true;
	});
}
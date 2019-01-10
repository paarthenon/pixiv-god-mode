import * as Msg from 'vendor/chrome/messages'

/**
 * Mailman is a quickly hacked together message bus I built to communicate across
 * the various parts of a chrome extension (the content script, the background page,
 * the popup, the options page) while retaining type information. Each page defines 
 * its respective implementation using the defineImplementation function and can be 
 * referenced through mailman.[section]. However, a chrome extension page's onMessage 
 * is not triggered by messages it sends, so the background page attempting to access
 * mailman.Background will fail.
 * 
 * TODO: Consider improving and splitting into separate package.
 */
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
	return <T> new Proxy({}, {
		get: (_, name) => (msg: any) => send(target, name.toString(), msg)
	});
}

var mailMan = {
	Background: generateMailman<Msg.Protocol>("BACKGROUND_PAGE")
}

export default mailMan;


/**
 * This is vaguely cool, it enforces that the object used to define the protocol meets the appropriate
 * criteria. The event listener registered shucks the message wrappers.
 */
export function defineImplementation<T>(target:Target, implementation:T) {
	function dispatch(implementation: T, message: Msg.RequestWrapper<any>) : Promise<any> {
		return Promise.resolve((<any>implementation)[message.name](message.body));
	}
	chrome.runtime.onMessage.addListener((msg, _, sendResponse) => {
		let message: Msg.RequestWrapper<any> = msg;
		if (message.target === target) {
			dispatch(implementation, msg)
				.then(content => sendResponse({ target: "RESPONSE", success: true, data: content }))
				.catch(reason => sendResponse({ target: "RESPONSE", success: false, errors: reason}));
		}

		return true;
	});

	return implementation;
}
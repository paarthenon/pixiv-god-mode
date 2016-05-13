import * as Msg from './messages'

function send<T, V>(name:string, msg: T): Promise<V> {
	return new Promise((resolve, reject) => {
		chrome.runtime.sendMessage({ name, body: msg }, (response: Msg.ResponseMessage) => {
			if (Msg.isSuccessfulResponse(response)) {
				resolve(response.data);
			}
			if (Msg.isFailedResponse(response)) {
				reject(response.errors);
			}
		});
	})
} 

let mailMan: Msg.Protocol = new Proxy(<Msg.Protocol>{}, {
	get: (_, name) => (msg: any) => send(name.toString(), msg)
});

export default mailMan;

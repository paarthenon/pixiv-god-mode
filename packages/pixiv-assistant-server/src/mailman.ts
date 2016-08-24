import * as Msg from './ipcMessages'
import {IServerConfigProtocol} from './proto'
import {ipcRenderer} from 'electron'

function send<T, V>(target: Msg.BackendTarget, name:string, msg: T): Promise<V> {
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
		
		ipcRenderer.send(target, {name, body: msg});
	})
} 

function generateMailman<T>(target:Msg.BackendTarget) {
	return new Proxy(<T>{}, {
		get: (_, name) => (msg: any) => send(target, name.toString(), msg)
	});
}

var mailMan = {
	ServerConfig: generateMailman<IServerConfigProtocol>("ServerConfiguration"),
}

export default mailMan;
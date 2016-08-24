import * as Msg from './ipcMessages'
import {ipcMain} from 'electron'

export function defineService <T>(target:Msg.BackendTarget, implementation:T) {
	function dispatch(implementation: T, message: Msg.RequestWrapper<any>) : Promise<any> {
		return Promise.resolve((<any>implementation)[message.name](message.body));
	}
	ipcMain.on(target, ((event, msg) => {
		let message: Msg.RequestWrapper<any> = msg;
		dispatch(implementation, msg)
			.then(content => event.sender.send(target, { success: true, data: content }))
			.catch(reason => event.sender.send(target, { success: false, errors: reason}));

		return true;
	}));

	return implementation;
}
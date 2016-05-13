import * as Msg from './messages'
import * as ChromeUtils from './utils'

import * as log4js from 'log4js';
let logger = log4js.getLogger('Background');

class DispatchMap {
	public map: { [id: string]: (msg: Msg.Message<any>) => any } = {};

	public register<T extends Msg.Message<V>,V>(msg: new (...args:any[]) => T, func:(msg:T) => any) {
		logger.info('registering', msg.name, '\'s function');
		this.map[msg.name] = func;
	}
	public dispatch<T extends Msg.Message<V>,V>(msg: T) {

		logger.info('dispatching on', msg.type);
		this.map[msg.type](msg);
	}

}

let dispatcher = new DispatchMap();



console.log('test test');
logger.fatal('test test');
dispatcher.register(Msg.ConfigGetMessage, msg => {
	return ChromeUtils.getFromConfig(msg.data.key)
		.then(contents => {
			console.log('ddddd', contents);
			console.log('dddddd', msg);
			logger.error('dddd', contents, msg);
			let d = JSON.parse(contents[msg.data.key]).data;
			return d;
		})
		.then(ChromeUtils.handleError)
		.then(value => {
			return new Msg.ConfigGetResponse({ value });
		});
});

console.log(dispatcher.map);

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
	console.log('msg sent', msg);
	sendResponse(dispatcher.dispatch(msg));
});

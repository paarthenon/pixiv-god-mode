import {IServerConfigProtocol} from './proto'

import {dialog} from 'electron'
// import * as log4js from 'log4js'

import {defineService} from './defineService'
import {PixivAssistantServer} from './server'
// import * as electronAppender from './utils/electronAppender'

// (<any>log4js).loadAppender(
//     'electron', electronAppender
// );

// log4js.configure({
// 	appenders: [
// 		{ type: 'console' }
// 	]
// });
// log4js.addAppender(log4js.appenders['electron']({}));

console.log('test');

let server :PixivAssistantServer | null = null;

let defaultConfig = {
	path: 'pixivRepository',
	port: 50415,
	verboseLogging: false
}

export function init() {
	defineService<IServerConfigProtocol>('ServerConfiguration', {
		initialize: config => {
			console.log('init');
			let mergedConfig = Object.assign(defaultConfig, config);
			server = new PixivAssistantServer(mergedConfig);
			return server.start();
		},
		close: () => {
			let localInstance = server;
			server = null;
			return localInstance.close();
		},
		openFolderDialog: () => {
			console.log('open');
			return new Promise(resolve => {
				dialog.showOpenDialog({properties: ['openDirectory']}, (fileNames) => resolve(fileNames[0]));
			});
		}

	});
}

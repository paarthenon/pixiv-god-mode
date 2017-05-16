import {dialog} from 'electron'
import {prefix} from 'daslog'

import {IServerConfigProtocol} from './proto'
import {defineService} from './defineService'
import {PixivAssistantServer} from './server'

let console = prefix('Startup');
console.log('Starting application');

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
			return (localInstance) ? localInstance.close() : Promise.reject('Server null');
		},
		openFolderDialog: () => {
			console.log('open');
			return new Promise<string>(resolve => {
				dialog.showOpenDialog({properties: ['openDirectory']}, (fileNames) => resolve(fileNames[0]));
			});
		}

	});
}

import {dialog} from 'electron'
import log from 'daslog'

import {IServerConfigProtocol} from './proto'
import {defineService} from './defineService'
import {PixivAssistantServer} from './server'

let logger = log.prefix('Startup');
logger.debug('Starting application');

let server :PixivAssistantServer | null = null;

let defaultConfig = {
	path: 'pixivRepository',
	port: 50415,
	verboseLogging: false
}

export function init() {
	defineService<IServerConfigProtocol>('ServerConfiguration', {
		initialize: config => {
			logger.debug('init');
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
			logger.debug('open');
			return new Promise<string>(resolve => {
				dialog.showOpenDialog({properties: ['openDirectory']}, (fileNames) => resolve(fileNames[0]));
			});
		}

	});
}

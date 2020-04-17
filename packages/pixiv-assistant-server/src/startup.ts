import {dialog} from 'electron'
import log from 'daslog'

import {IServerConfigProtocol} from './proto'
import {defineService} from './defineService'
import {PixivAssistantServer} from './server'

import tasker from './srv/utils/task'

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

tasker.subscribe(x => console.log('New task!', x));

tasker.spawn('Init Task')
	.queue('Testing', () => 4)
	.queue('Testing2', num => {
		tasker.spawn('sub task default')
			.queue('sub 1', () => 4)
			.queue('sub 2', num => num.toString())
			.queue('sub 3', () => num)
			.complete();
	})
	.complete();



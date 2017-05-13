import * as express from 'express'
import * as bodyParser from 'body-parser'
import * as Proto from 'pixiv-assistant-common'
import * as http from 'http'
import {prefix} from 'daslog'

import {IServerConfig} from './proto'
import * as fiRepo from './srv/repo/flatImageRepo'

const console = prefix('Server');

export class PixivAssistantServer {
	protected serverInstance :http.Server;
	protected repoInstance :fiRepo.ImageRepo;

	constructor(protected config:IServerConfig) { }

	public start() : Promise<void> {
		console.info('Initializing Server');
		console.info('\tRepository Root:', this.config.path);
		console.info('\tPort Number:', this.config.port);
		console.info('\tLogging:', (this.config.verboseLogging) ? 'VERBOSE' : 'STANDARD');

		this.repoInstance = new fiRepo.ImageRepo({
			path: this.config.path,
			mangaFormat: fiRepo.MangaDownloadFormat.LOOSE,
			downloadLocation: fiRepo.DownloadLocation.ARTIST,
		});

		return this.repoInstance.initialize().then(() => {
			const console = prefix('App');
			let app = express();

			app.use(bodyParser.json({limit: '1gb'}));

			app.all('/ping', (_req, res) => {
				console.trace('Message Received | Ping');
				res.json({success: true, data:true});
			});

			app.all('/supports/:action', (req, res) => {
				let action: string = req.params.action;
				console.trace('Message Received | Supports action [', action, ']');
				res.json({success: true, data: this.repoInstance.supports(action)});
			});

			app.post('/:action', (req, res) => {
				let action: string = req.params.action;
				let message: any = req.body;
				console.trace('Message Received | Perform action [', action, ']');

				Promise.resolve(this.repoInstance.dispatch(action, message))
					.then<Proto.Messages.Response>(returnValue => ({ success: true, data: returnValue }))
					.catch(failureReason => ({ success: false, errors: failureReason }))
					.then(result => res.json(result));
			});

			return new Promise<void>(resolve => {
				this.serverInstance = app.listen(this.config.port, resolve);
			});
		});
	}

	public close() : Promise<void> {
		console.info('Closing Server');
		return new Promise<void>(resolve => this.serverInstance.close(resolve)) //shut down http server
			.then(() => this.repoInstance.teardown()); //safely tear down repo once we're no longer answering requests.
	}
}

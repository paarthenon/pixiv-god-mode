import * as express from "express"
import * as bodyParser from "body-parser"

import * as Proto from '../common/proto'
import {IServerConfig} from './proto'

import * as log4js from 'log4js'
import * as yargs from 'yargs'
import * as http from 'http'

import * as fiRepo from './repo/flatImageRepo'
import {PixivRepo} from './repo/model'

let logger = log4js.getLogger('Startup');

export class PixivAssistantServer {
	protected serverInstance :http.Server;
	protected repoInstance :fiRepo.ImageRepo;

	constructor(protected config:IServerConfig) { }

	public start() : Promise<void> {
		logger.info('Initializing Server');
		logger.info('\tRepository Root:',this.config.path);
		logger.info('\tPort Number:',this.config.port);
		logger.info('\tLogging:', (this.config.verboseLogging) ? 'VERBOSE' : 'STANDARD');

		if (this.config.verboseLogging) {
			log4js.setGlobalLogLevel(log4js.levels.ALL);
		} else {
			log4js.setGlobalLogLevel(log4js.levels.INFO);
		}

		this.repoInstance = new fiRepo.ImageRepo({
			path: this.config.path,
			mangaFormat: fiRepo.MangaDownloadFormat.LOOSE,
			downloadLocation: fiRepo.DownloadLocation.ARTIST,
		});

		return this.repoInstance.initialize().then(() => {
			let appLogger = log4js.getLogger('App');
			let app = express();

			app.use(bodyParser.json({limit: '1gb'}));

			app.all('/ping', (req, res) => {
				appLogger.trace('Message Received | Ping');
				res.json({success: true, data:true});
			});

			app.all('/supports/:action', (req, res) => {
				let action: string = req.params.action;
				appLogger.trace('Message Received | Supports action [', action, ']');
				res.json({success: true, data: this.repoInstance.supports(action)});
			});

			app.post('/:action', (req, res) => {
				let action: string = req.params.action;
				let message: any = req.body;
				appLogger.trace('Message Received | Perform action [', action, ']');

				Promise.resolve(this.repoInstance.dispatch(action, message))
					.then<Proto.Messages.Response>(
						returnValue => ({ success: true, data: returnValue }),
						failureReason => ({ success: false, errors: failureReason }))
					.then(result => res.json(result));
			});

			return new Promise<void>((resolve, reject) => {
				this.serverInstance = app.listen(this.config.port, resolve);
			});
		});
	}

	public close() : Promise<void> {
		logger.info('Closing Server');
		return new Promise<void>(resolve => this.serverInstance.close(resolve)) //shut down http server
			.then(() => this.repoInstance.teardown());
	}
}

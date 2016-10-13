import * as express from "express"
import * as bodyParser from "body-parser"

import * as Proto from '../common/proto'
import {IServerConfig} from './proto'

import * as log4js from 'log4js'
import * as yargs from 'yargs'
import * as http from 'http'

import * as aiRepo from './repo/artistImageRepo'
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

		this.repoInstance = new fiRepo.ImageRepo(this.config.path);

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

			return new Promise((resolve, reject) => {
				this.serverInstance = app.listen(this.config.port, resolve);
			});
		});
	}

	public close() : Promise<void> {
		return new Promise(resolve => this.serverInstance.close(resolve)) //shut down http server
			.then(() => this.repoInstance.teardown());
	}
}

// function initServer(config:IServerConfig) {
// 	let verboseLogging = (config.verboseLogging !== undefined)? config.verboseLogging : defaults.verboseLogging;
// 	if (verboseLogging) {
// 		log4js.setGlobalLogLevel(log4js.levels.ALL);
// 		logger.warn('Setting to verbose mode');
// 	} else {
// 		log4js.setGlobalLogLevel(log4js.levels.INFO);
// 	}

// 	let path = config.path || defaults.path;
// 	logger.info(`Setting repo to path [${path}]`);

// 	let pas = new fiRepo.ImageRepo(path);

// 	pas.initialize().then(() => {
// 		let appLogger = log4js.getLogger('App');
// 		let app = express();

// 		app.use(bodyParser.json({limit: '1gb'}));

// 		app.all('/ping', (req, res) => {
// 			appLogger.debug('Message Received | Ping');
// 			res.json({success: true, data:true});
// 		});

// 		app.all('/supports/:action', (req, res) => {
// 			let action: string = req.params.action;
// 			appLogger.debug('Message Received | Supports action [', action, ']');
// 			res.json({success: true, data: pas.supports(action)});
// 		});

// 		app.post('/:action', (req, res) => {
// 			let action: string = req.params.action;
// 			let message: any = req.body;
// 			appLogger.debug('Message Received | Perform action [', action, ']');

// 			Promise.resolve(pas.dispatch(action, message))
// 				.then<Proto.Messages.Response>(
// 					returnValue => ({ success: true, data: returnValue }),
// 					failureReason => ({ success: false, errors: failureReason }))
// 				.then(result => res.json(result));
// 		});

// 		let listeningPort = config.port || defaults.port;

// 		let appServer = app.listen(listeningPort, () => {
// 			let mainLogger = log4js.getLogger('Main');
// 			mainLogger.info('listening on port',listeningPort);
// 		});
// 	})
// }
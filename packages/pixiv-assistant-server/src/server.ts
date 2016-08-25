import * as express from "express"
import * as bodyParser from "body-parser"

import * as aiRepo from './repo/artistImageRepo'
import * as fiRepo from './repo/flatImageRepo'
import {PixivRepo} from './repo/model'

import * as Proto from '../common/proto'

import * as q from 'q'
import * as yargs from 'yargs'
import * as log4js from 'log4js'

import {IServerConfig, RepositoryType} from './proto'
import * as electronAppender from './utils/electronAppender'

console.log('loaded appender', electronAppender);
(<any>log4js).loadAppender(
    'electron', electronAppender
);

log4js.configure({
	appenders: [
		{ type: 'console' }
	]
});
log4js.addAppender(log4js.appenders['electron']());


let logger = log4js.getLogger('Startup');

let defaults :IServerConfig = {
	path: 'pixivRepository',
	repoType: RepositoryType.ArtistBreakdown,
	port: 50415,
	verboseLogging: false
}

export function initServer(config:IServerConfig) {

	if (config.verboseLogging) {
		log4js.setGlobalLogLevel(log4js.levels.ALL);
		logger.warn('Setting to verbose mode');
	} else {
		log4js.setGlobalLogLevel(log4js.levels.INFO);
	}

	let path = config.path || defaults.path;
	logger.info(`Setting repo to path [${path}]`);

	function decideRepo() : PixivRepo {
		switch (config.repoType) {
			case RepositoryType.ArtistBreakdown:
				logger.info('Using [root/artist/images*] repo format');
				return new aiRepo.ArtistImageRepo(path);
			case RepositoryType.LooseImages:
				logger.info('Using [root/images*] repo format');
				return new fiRepo.ImageRepo(path);
			default:
				logger.warn('No repository format specified, using default');
				logger.info('Using [root/artist/images*] repo format');
				return new aiRepo.ArtistImageRepo(path);
		}
	}
	// pixiv assistant repo
	let pas = decideRepo();

	let appLogger = log4js.getLogger('App');
	let app = express();

	app.use(bodyParser.urlencoded({ extended: false }));
	app.use(bodyParser.json());

	app.all('/ping', (req, res) => {
		appLogger.debug('Message Received | Ping');
		res.json({success: true, data:true});
	});

	app.all('/supports/:action', (req, res) => {
		let action: string = req.params.action;
		appLogger.debug('Message Received | Supports action [', action, ']');
		res.json({success: true, data: pas.supports(action)});
	});

	app.post('/:action', (req, res) => {
		let action: string = req.params.action;
		let message: any = req.body;
		appLogger.debug('Message Received | Perform action [', action, ']');
		q(message)
			.then(msg => pas.dispatch(action, msg))
			.then<Proto.Messages.Response>(
				successfulResponse => ({ success: true, data: successfulResponse }),
				failedResponse => ({ success: false, errors: failedResponse }))
			.then(result => res.json(result));
	});

	return app.listen('50415', () => {
		let mainLogger = log4js.getLogger('Main');
		mainLogger.info('listening on port 50415');
	});
}
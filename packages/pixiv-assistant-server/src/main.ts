import * as express from "express"
import * as bodyParser from "body-parser"

import * as aiRepo from './repo/artistImageRepo'
import * as fiRepo from './repo/flatImageRepo'
import {PixivRepo} from './repo/model'

import * as Proto from '../common/proto'

import * as q from 'q'
import * as yargs from 'yargs'
import * as log4js from 'log4js'

log4js.configure({
	appenders: [
		{ type: 'console' }
	]
});
let logger = log4js.getLogger('Startup');
logger.setLevel(log4js.levels.ALL);

let cliArgs = yargs
				.usage('Usage: $0 --repo artist|flat --path <path_string>')
				.argv;

let defaultPath = 'pixivRepository';
if (!cliArgs.path) {
	logger.warn('No path specified, using default');
}
let path = cliArgs.path || defaultPath;
logger.info(`Setting repo to path [${path}]`);

function decideRepo() : PixivRepo {
	switch (cliArgs.repo) {
		case "artist":
			logger.info('Using [root/artist/images*] repo format');
			return new aiRepo.ArtistImageRepo(path);
		case "flat":
			logger.info('Using [root/images*] repo format');
			return new fiRepo.ImageRepo(path);
		default:
			logger.warn('No repository format specified, using default');
			logger.info('Using [root/artist/images*] repo format');
			return new aiRepo.ArtistImageRepo(path);
	}
}
let pas = decideRepo();

process.on('SIGINT', function() {
	let mainLogger = log4js.getLogger('Main');
	mainLogger.warn('Closing server');
	pas.teardown();
    process.exit();
});

let appLogger = log4js.getLogger('App');
let app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/ping', (req, res) => {
	appLogger.debug('Message Received | Ping');
	res.json(true);
});

app.get('/supports/:action', (req, res) => {
	let action: string = req.params.action;
	appLogger.debug('Message Received | Supports action [', action, ']');
	res.json(pas.supports(action));
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

app.listen('9002', () => {
	let mainLogger = log4js.getLogger('Main');
	mainLogger.info('listening on port 9002');
})

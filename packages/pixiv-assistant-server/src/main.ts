import * as express from "express"
import * as bodyParser from "body-parser"

import * as aiRepo from './repo/artistImageRepo'
import * as fiRepo from './repo/flatImageRepo'
import {PixivRepo} from './repo/model'

import * as q from 'q'

import * as Proto from '../common/proto'


let path = process.argv[2] || 'pixivRepository';
console.log(`Setting repo to path [${path}]`);

//TODO: Actual logic with flags
function decideRepo() : PixivRepo {
	// return new aiRepo.ArtistImageRepo(path);
	return new fiRepo.ImageRepo(path);
}
let pas = decideRepo();


process.on('SIGINT', function() {
	console.log('Closing server');
	pas.teardown();
    process.exit();
});

let app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/ping', (req, res) => {
	res.json(true);
});

app.get('/supports/:action', (req, res) => {
	let action: string = req.params.action;
	res.json(pas.supports(action));
});

app.post('/:action', (req, res) => {
	let action: string = req.params.action;
	let message: any = req.body;
	console.log('Action\n', action, '\nMessage\n', message, '\n\n');
	q(message)
		.then(msg => pas.dispatch(action, msg))
		.then<Proto.Messages.Response<any>>(
			successfulResponse => ({ success: true, data: successfulResponse }), 
			failedResponse => ({ success: false, errors: failedResponse }))
		.then(result => res.json(result));
});

app.listen('9002', () => {
	console.log('listening on port 9002');
})

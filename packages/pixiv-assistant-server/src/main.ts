import {ArtistImageDatabase} from './db'
import {PixivAssistantApp} from './app'

import * as express from "express"
import * as bodyParser from "body-parser"

import * as aiRepo from './repo/artistImageRepo'

let path = process.argv[2] || 'pixivRepository';
console.log(`Setting repo to path [${path}]`);

let db = new ArtistImageDatabase(path);

let pas = new aiRepo.ArtistImageRepo();

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

app.get('/:action', (req, res) => {
	res.json('meh');
});

app.listen('9002', () => {
	console.log('listening on port 9002');
})

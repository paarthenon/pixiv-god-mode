import {ArtistImageDatabase} from './db'
import {PixivAssistantApp} from './app'

import * as express from "express"
import * as bodyParser from "body-parser"

var config = require('./config');

let path = config.db.path;

let db = new ArtistImageDatabase(path);
let pa = new PixivAssistantApp(db);

let app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/list', (req, res) => {
	res.json(pa.getArtists());
});

app.get('/artist/:id', (req, res) => {
	res.json(pa.getImagesForArtistId(parseInt(req.params.id)));
});

app.post('/openFolder/:id', (req, res) => {
	let id: number = parseInt(req.params.id);
	let name: string = req.body.name;

	pa.openFolder({ id, name });
});

app.post('/download', (req, res) => {
	let id: number = parseInt(req.body.id);
	let name: string = req.body.name;

	let url: string = req.body.url;

	pa.download({ id, name }, url, (success) => {
		return res.json({ success });
	});
});

interface MultiDownloadStatus {
	success: boolean
	failures?: string[]
}

app.post('/downloadMulti', (req, res) => {
	let artist: Model.Artist = req.body.artist;
	let urls: string[] = req.body.urls;

	pa.downloadMulti(artist, urls, (errors) => {
		if (errors.length > 0) {
			return { success: true }
		} else {
			return { success: false, failures: errors }
		}
	});
});

app.listen('9002', () => {
	console.log('listening on port 9002');
})

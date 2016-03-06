import {ArtistImageDatabase} from './db'
import {PixivAssistantApp} from './app'

import * as express from "express"
import * as bodyParser from "body-parser"


let path = process.argv[2] || 'pixivRepository';
console.log(`Setting repo to path [${path}]`);

let db = new ArtistImageDatabase(path);
let pa = new PixivAssistantApp(db);

let app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/ping', (req, res) => {
	res.json(true);
});

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
	res.json(true);
});

app.post('/download', (req, res) => {
	let id: number = parseInt(req.body.id);
	let name: string = req.body.name;

	let url: string = req.body.url;

	pa.download({ id, name }, url, (success) => {
		res.json({ success });
	});
});

app.post('/downloadZip', (req, res) => {
	let id: number = parseInt(req.body.id);
	let name: string = req.body.name;

	let url: string = req.body.url;

	pa.downloadZip({ id, name }, url, (success) => {
		res.json({ success });
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
			res.json({ success: true });
		} else {
			res.json({ success: false, failures: errors });
		}
	});
});

app.post('/imageExists', (req, res) => {
	let artist: Model.Artist = req.body.artist;
	let image: Model.Image = req.body.image;

	let result = pa.imageExists(artist, image);
	res.json({ exists: result });
});

app.listen('9002', () => {
	console.log('listening on port 9002');
})

import {Features, Model, Messages} from '../../common/proto'
import * as http from 'http'
import * as urllib from 'url'
import * as path from 'path'
import * as mkdirp from 'mkdirp'
import * as fs from 'fs'

import * as Q from 'q'

interface DownloadMessage {
	url: string
	path: string
}

export function downloadFromPixiv(msg:DownloadMessage):Q.IPromise<boolean> {
	let makeDerp = Q.denodeify(mkdirp);

	return Q(msg)
		.then(msg => makeDerp(path.dirname(msg.path)).then(succ => msg, err => Q.reject(`Directory creation failed with err [${err}]`)))
		.then((msg: DownloadMessage) => {
			let referer = urllib.resolve(msg.url, '/');
			let url = urllib.parse(msg.url);

			let q = Q.defer();
			http.get({
				protocol: url.protocol,
				hostname: url.hostname,
				port: url.port,
				path: url.path,
				headers: {
					referer: referer
				}
			}, (response) => {
				response.pipe(fs.createWriteStream(msg.path))
					.on('finish', () => q.resolve(msg))
					.on('error', () => q.reject('error while writing to file'));
			});

			return q;
		})
		.then(msg => true, msg => false);
}
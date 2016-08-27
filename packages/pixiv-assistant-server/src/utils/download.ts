import {Features, Model, Messages} from '../../common/proto'
import * as http from 'http'
import * as urllib from 'url'
import * as path from 'path'
import * as fs from 'fs'

import {makederp} from './makederp'

interface DownloadMessage {
	url: string
	path: string
}

export function downloadFromPixiv(msg:DownloadMessage):Promise<boolean> {
	return makederp(path.dirname(msg.path))
		.then(() => {
			let referer = urllib.resolve(msg.url, '/');
			let url = urllib.parse(msg.url);

			return new Promise((resolve, reject) => {
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
						.on('finish', () => resolve(msg))
						.on('error', () => reject('error while writing to file'));
				});
			});
		})
}
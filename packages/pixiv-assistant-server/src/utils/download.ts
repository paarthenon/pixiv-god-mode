import {Features, Model, Messages} from '../../common/proto'

import * as fs from 'fs'
import * as http from 'http'
import * as path from 'path'
import * as urllib from 'url'

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

export function getDataUrlDetails(dataUrl:string) {
	const rx = /^data:([^/]+)\/([^;]+);base64,(.+)$/;
	let match = rx.exec(dataUrl);
	if (match != null) {
		return {
			mime: {
				type: match[1],
				subtype: match[2],
			},
			content: match[3],
		}
	}
	return undefined;
}

export function writeBase64(filename:string, content:string) :Promise<void> {
	return new Promise<void>((resolve, reject) => {
		fs.writeFile(filename, new Buffer(content, 'base64'), err => {
			if (err) {
				reject(err);
			} else {
				resolve();
			}
		})
	})
}
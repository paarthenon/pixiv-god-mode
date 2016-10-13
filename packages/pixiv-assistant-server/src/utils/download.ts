import {Features, Model, Messages} from '../../common/proto'

import * as fs from 'fs'
import * as http from 'http'
import * as path from 'path'
import * as urllib from 'url'

const archiver = require('archiver');

import {makederp} from './makederp'

interface DownloadMessage {
	url: string
	path: string
}

function pixivGet(pixivUrl:string) {
	let referer = urllib.resolve(pixivUrl, '/');
	let url = urllib.parse(pixivUrl);

	return new Promise((resolve, reject) => {
		http.get({
			protocol: url.protocol,
			hostname: url.hostname,
			port: url.port,
			path: url.path,
			headers: {
				referer: referer
			}
		}, response => resolve(response))
	});
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

export function downloadMangaToZip(files: string[], zipPath:string) {
	let archive = archiver.create('zip', {});
	return makederp(path.dirname(zipPath))
		.then(() => Promise.all(files.map(fileUrl => {
			let referer = urllib.resolve(fileUrl, '/');
			let url = urllib.parse(fileUrl);

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
					archive.append(response, {name:path.basename(fileUrl)});
					resolve();
				});
			});
		}))).then(() => {
			return new Promise((resolve, reject) => {
				let outputStream = fs.createWriteStream(zipPath)
					.on('finish', resolve)
					.on('error', () => reject('error while writing to file'));
				archive.pipe(outputStream);
				archive.finalize();
			});
		});
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
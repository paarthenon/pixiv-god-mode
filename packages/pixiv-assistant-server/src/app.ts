import {Database} from './dbModel'
import {log} from './utils/log'
const opn = require('opn')

import * as mkdirp from 'mkdirp'
import * as underscore from 'underscore'

import * as http from 'http'
import * as urllib from 'url'
import * as fs from 'fs'
import * as path from 'path'


var spawn = require('child_process').spawn;

export class PixivAssistantApp {
	constructor(protected db:Database) { }

	public getArtists():Model.Artist[] {
		return this.db.Artists;
	}

	public getImagesForArtistId(artistId:number):Model.Image[] {
		let artist = this.db.getArtistById(artistId)
		if (artist) {
			return this.db.getImagesForArtist(artist);
		} else {
			return [];
		}
	}

	public openFolder(artist:Model.Artist) {
		let dbArtist = this.db.getArtistById(artist.id);
		if (dbArtist) {
			let artistFolder = this.db.getPathForArtist(dbArtist);
			log(`opening folder ${artistFolder}`);

			opn(artistFolder);
		} else {
			let artistFolder = this.db.getPathForArtist(artist);
			log(`opening folder ${artistFolder}`);
			mkdirp(artistFolder, (err) => {
				if (err) {
					log(`Error creating folder [${artistFolder}], err: [${err}]`);
				} else {
					// spawn('explorer.exe', [artistFolder]);
					opn(artistFolder);
				}
			});
		}
	}

	// This is intentionally duplicated from db.ts. While this code is the same,
	// there are actually two different intentions. The database is concerned with
	// converting between the filename stored on disk and the file object. This is
	// concerned with converting the filename that pixiv uses and the file object.
	// The fact that these are the same is only incidental and may change.
	protected baseNameToImage(fileName: string): Model.Image {
		// This intentionally breaks on _master1200. I don't want these images,
		// I want full resolution. This may change in the future.
		var match = fileName.match(/^([0-9]+)_p([0-9]+)\.(.*)/);
		if (match && match.length === 4) {
			return {
				id: parseInt(match[1]),
				page: parseInt(match[2]),
				ext: match[3]
			}
		} else {
			log(`filename ${fileName} failed to match regex`);
		}
		return undefined;
	}

	protected downloadFromPixiv(urlString:string, pathString:string, callback:(success:boolean)=>any) {
		let dir = path.dirname(pathString);
		mkdirp(dir, err => {
			if (err) {
				log(`Error creating folder [${dir}], err: [${err}]`);
				callback(false);
				return;
			}
		});
		
		let referer = urllib.resolve(urlString, '/');
		let url = urllib.parse(urlString);

		http.get({
			protocol: url.protocol,
			hostname: url.hostname,
			port: url.port,
			path: url.path,
			headers: {
				referer: referer
			}
		}, (response) => {
			response.pipe(fs.createWriteStream(pathString));
		});
	}

	public downloadZip(artist: Model.Artist, zipUrl: string, callback: (success: boolean) => any) {
		let zipName = path.basename(zipUrl);
		let zipPath = path.join(this.db.getPathForArtist(artist), 'zip', zipName);

		log(`writing image from [${zipUrl}] to [${zipPath}]`);
		this.downloadFromPixiv(zipUrl, zipPath, callback);
	}

	public download(artist: Model.Artist, imageUrl: string, callback: (success: boolean) => any) {
		let imageName = path.basename(imageUrl);
		let image = this.baseNameToImage(imageName);

		let imagePath = this.db.getPathForImage(artist, image);

		log(`writing image from [${imageUrl}] to [${imagePath}]`);
		this.downloadFromPixiv(imageUrl, imagePath, callback);
	}

	public downloadMulti(artist: Model.Artist, imageUrls: string[], callback: (failures: string[]) => any) {
		let errors:string[] = [];

		let delayedReturn = underscore.after(imageUrls.length, returnErrors);

		imageUrls.forEach(imageUrl => {
			this.download(artist, imageUrl, success => {
				if (!success) {
					errors.push(imageUrl);
				}
				delayedReturn();
			});
		})

		function returnErrors(){
			return errors;
		}
	}
}

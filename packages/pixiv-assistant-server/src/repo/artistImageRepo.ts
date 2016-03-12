import {BaseRepo} from './baseRepo'
import {ActionCache} from '../utils/ActionCache'

import {Model, Messages, Features} from '../../common/proto'

/* Copied and pasted from previous file */
import {log} from '../utils/log'

import * as mkdirp from 'mkdirp'
import * as underscore from 'underscore'

import * as http from 'http'
import * as urllib from 'url'
import * as fs from 'fs'
import * as path from 'path'

import * as XRegExp from "xregexp"

import * as pathUtils from '../utils/path'

const opn = require('opn');

class ArtistImageDatabase {
	constructor(protected path:string) { }

	protected artistToFolderName(artist:Model.Artist):string {
		return pathUtils.avoidTrailingDot(`[${artist.id}] - ${artist.name}`);
	}
	protected folderNameToArtist(folderName:string):Model.Artist {
		let match = XRegExp('^\\[([0-9]+)\\]\\ -\\ (.*)$').exec(folderName);
		if(match && match.length === 3) {
			return {
				id: parseInt(match[1]),
				name: match[2]
			};
		} else {
			log(`filename ${folderName} failed to match regex`);
		}
		return undefined;
	}

	protected fileNameToImage(fileName:string):Model.Image {
		var match = fileName.match(/^([0-9]+)(?:_p([0-9]+))?(?:_master[0-9]+)?\.(.*)/);
		if(match && match.length === 4) {
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
	protected imageToFileName(image:Model.Image):string {
		return pathUtils.avoidTrailingDot(`${image.id}_p${image.page || 0}.${image.ext || '.jpg'}`);
	}
	
	public get Artists():Model.Artist[] {
		return fs.readdirSync(this.path).map(name => this.folderNameToArtist(name));
	}

	public getArtistById(artistId:number):Model.Artist {
		return _.find(this.Artists, artist => artist.id === artistId);
	}

	public getImagesForArtist(artist:Model.Artist):Model.Image[] {
		try {
			return fs.readdirSync(this.getPathForArtist(artist))
			.map(name => this.fileNameToImage(name))
			.filter(image => image != undefined);
		}catch(e){
			return [];
		}
	}

	public getPathForArtist(artist:Model.Artist):string {
		return path.join(this.path, this.artistToFolderName(artist));
	}
	
	public getPathForImage(artist:Model.Artist, image:Model.Image):string {
		return path.join(this.path, this.artistToFolderName(artist), this.imageToFileName(image));
	}
}



export class ArtistImageRepo extends BaseRepo {
	private static actions = new ActionCache();

	protected db:ArtistImageDatabase;

	public getCache() {
		return ArtistImageRepo.actions;
	}

	constructor(protected path:string) {
		super(path);
		this.db = new ArtistImageDatabase(path);
	}

	@ArtistImageRepo.actions.register('five')
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

	@ArtistImageRepo.actions.register('four')
	public returnFour(){
		return 4;
	}

	@ArtistImageRepo.actions.register(Features.OpenToArtist)
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
					opn(artistFolder);
				}
			});
		}
	}


	@ArtistImageRepo.actions.register(Features.ImageExistsForArtist)
	public imageExists(artist:Model.Artist, image: Model.Image) {
		return this.db.getImagesForArtist(artist).filter(img => img.id === image.id).length > 0;
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
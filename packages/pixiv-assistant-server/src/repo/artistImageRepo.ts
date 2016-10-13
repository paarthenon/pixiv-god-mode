import {Model, Messages, Features} from '../../common/proto'

import * as log4js from 'log4js'
import * as fs from 'fs'
import * as http from 'http'
import * as path from 'path'
import * as underscore from 'underscore'
import * as urllib from 'url'
import * as XRegExp from "xregexp"
import * as sanitize from 'sanitize-filename'

import {BaseRepo} from './baseRepo'
import {ActionCache} from '../utils/ActionCache'
import * as pathUtils from '../utils/path'
import * as downloadUtils from '../utils/download'
import {makederp} from '../utils/makederp'
import {promisePool} from '../utils/promise'

const opn = require('opn');

let logger = log4js.getLogger('ArtistRepo');

class ArtistImageDatabase {
	constructor(protected path:string) { }

	protected artistToFolderName(artist:Model.Artist):string {
		return sanitize(pathUtils.avoidTrailingDot(`[${artist.id}] - ${artist.name}`));
	}
	protected folderNameToArtist(folderName:string):Model.Artist {
		let match = XRegExp('^\\[([0-9]+)\\]\\ -\\ (.*)$').exec(folderName);
		if(match && match.length === 3) {
			return {
				id: parseInt(match[1]),
				name: match[2]
			};
		} else {
			logger.warn(`filename ${folderName} failed to match regex`);
		}
		return undefined;
	}
	
	public get Artists():Model.Artist[] {
		return fs.readdirSync(this.path).map(name => this.folderNameToArtist(name));
	}

	public getArtistById(artistId:number):Model.Artist {
		let artist = underscore.find(this.Artists, artist => artist.id === artistId);
		return artist;
	}

	public getImagesForArtist(artist:Model.Artist):Model.Image[] {
		try {
			let actualArtist = this.getArtistById(artist.id) || artist;
			let artistFolder = this.getPathForArtist(actualArtist);
			return fs.readdirSync(artistFolder)
			.filter(name => fs.statSync(path.join(artistFolder, name)).isFile())
			.map(name => pathUtils.fileNameToImage(name))
			.filter(image => image != undefined);
		}catch(e){
			return [];
		}
	}

	public getPathForArtist(artist:Model.Artist):string {
		let localArtist = this.getArtistById(artist.id);
		if (localArtist) {
			return path.join(this.path, this.artistToFolderName(localArtist));
		} else {
			return path.join(this.path, this.artistToFolderName(artist));
		}
	}
	
	public getPathForImage(artist:Model.Artist, image:Model.Image):string {
		return path.join(this.getPathForArtist(artist), pathUtils.imageToFileName(image));
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

	public getImagesForArtistId(artistId:number):Model.Image[] {
		let artist = this.db.getArtistById(artistId)
		if (artist) {
			return this.db.getImagesForArtist(artist);
		} else {
			return [];
		}
	}

	@ArtistImageRepo.actions.register(Features.OpenToArtist)
	public openFolder(artist:Model.Artist) {
		let dbArtist = this.db.getArtistById(artist.id);
		if (dbArtist) {
			let artistFolder = this.db.getPathForArtist(dbArtist);
			logger.info(`opening folder ${artistFolder}`);

			opn(artistFolder);
		} else {
			let artistFolder = this.db.getPathForArtist(artist);
			logger.info(`opening folder ${artistFolder}`);
			makederp(artistFolder)
				.then(opn)
				.catch(err => logger.error(`Error creating folder [${artistFolder}], err: [${err}]`));
		}
	}


	@ArtistImageRepo.actions.register(Features.ImageExists)
	public imageExists(message:Messages.ArtistImageRequest) {
		logger.trace('imageExists entered for image [', message.image.id, ']');
		let exists = this.db.getImagesForArtist(message.artist).filter(img => img.id === message.image.id).length > 0;
		logger.debug(`Image [${message.image.id}] exists? [${exists}]`);
		return exists;
	}

	@ArtistImageRepo.actions.register(Features.ImagesExist)
	public imagesExist(images:Messages.BulkRequest<Messages.ArtistImageRequest>) {
		return images.items.filter(x => this.imageExists(x));
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
			logger.warn(`filename ${fileName} failed to match regex`);
		}
		return undefined;
	}

	public downloadZip(request: Messages.ArtistUrlRequest):Promise<boolean> {
		let zipName = path.basename(request.url);
		let zipPath = path.join(this.db.getPathForArtist(request.artist), 'zip', zipName);

		logger.debug(`writing image from [${request.url}] to [${zipPath}]`);
		return downloadUtils.downloadFromPixiv({ url: request.url, path: zipPath });
	}

	@ArtistImageRepo.actions.register(Features.DownloadImage)
	public download(request: Messages.ArtistUrlRequest):Promise<boolean> {
		let imageName = path.basename(request.url);

		logger.info(`Downloading image [${imageName}]`);
		let image = this.baseNameToImage(imageName);

		let imagePath = this.db.getPathForImage(request.artist, image);

		logger.debug(`writing image from [${request.url}] to [${imagePath}]`);
		return downloadUtils.downloadFromPixiv({ url: request.url, path: imagePath })
			.then(x => {
				logger.debug('completed download of ['+imageName+'])');
				return x;
			});
	}

	@ArtistImageRepo.actions.register(Features.DownloadManga)
	public downloadMulti(request: Messages.BulkRequest<Messages.ArtistUrlRequest>) {
		logger.info('Beginning bulk download of', request.items.length, 'items');
		let tasks = request.items.map(msg => (() => this.download(msg)));
		promisePool(tasks, 8)
			.then(x => {
				logger.info('Completed download of',x.length,'files');
				return x;
			})
	}


	@ArtistImageRepo.actions.register(Features.DownloadAnimation)
	public downloadAnimation(msg:Messages.ArtistImageRequest & {content:string}) {
		let details = downloadUtils.getDataUrlDetails(msg.content);
		if (details) {
			let location = this.db.getPathForImage(msg.artist, msg.image);

			makederp(path.dirname(location))
				.then(() => downloadUtils.writeBase64(location, details.content))
				.catch(err => console.log(err));
		}
	}
}

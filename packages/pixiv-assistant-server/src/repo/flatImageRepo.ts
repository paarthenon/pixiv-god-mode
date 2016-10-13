import {Features, Model, Messages} from '../../common/proto'

import * as log4js from 'log4js'
import * as path from 'path'
import * as fs from 'fs'
import * as sanitize from 'sanitize-filename'

import {ActionCache} from '../utils/actionCache'
import {BaseRepo} from './baseRepo'
import {makederp} from '../utils/makederp'
import * as pathUtils from '../utils/path'
import * as downloadUtils from '../utils/download'
import * as promiseUtils from '../utils/promise'
import * as discoveryUtils from '../utils/discovery'
import * as dataStoreUtils from '../utils/dataStore'

import {FileRegistry} from './registry'

const opn = require('opn');

let logger = log4js.getLogger('ImageRepo');

interface RegistryMetaInfo {
	lastExecution: Date
}

export enum DownloadLocation {
	ROOT,
	ARTIST,
	DROP,
}
export enum MangaDownloadFormat {
	LOOSE,
	FOLDER,
	ARCHIVE,
}
export interface RepoConfig {
	path :string
	downloadLocation :DownloadLocation
	dropPath? :string
	mangaFormat :MangaDownloadFormat
}

export class ImageRepo extends BaseRepo {
	private static actions = new ActionCache();
	public getCache() {
		return ImageRepo.actions;
	}

	protected registry : FileRegistry;

	public constructor(protected config : RepoConfig) {
		super();
		this.registry = new FileRegistry(config.path);
	}
	
	protected get metaInfoPath() :string {
		return path.resolve(this.config.path, 'metadb.json');
	}

	public initialize() :Promise<void> {
		logger.info('Initializing repository');
		return this.registry.initialize()
			.then(() => {
				// load meta info
				logger.trace('Loading repository information');
				dataStoreUtils.load<RegistryMetaInfo>(this.metaInfoPath)
					.catch(() => null as RegistryMetaInfo) // swallow errors.
					.then(dbInfo => {
						let count = 0; // If there's a large amount of content to be loaded offering some user feedback is helpful.
						let predicate :discoveryUtils.FinderFilter = () => true;
						if (dbInfo) {
							logger.info('Finding files since last load on', dbInfo.lastExecution);
							predicate = (path, stats) => stats.mtime > dbInfo.lastExecution;
						} else {
							logger.info('Finding all files in repo to build initial registry');
						}
						return discoveryUtils.findFilesAddedSince(this.config.path, predicate, 
							path => {
								logger.trace('Found file at',path);
								count++;
								if (count % 1000 == 0) {
									logger.info('Found',count,'files so far');
								}
								this.registry.addFromPath(path)
							})
				})
				
			})
			.then(() => {
				logger.info('Initializing file watcher')
				return discoveryUtils.initializeFileWatcher(this.config.path, path => {
					logger.trace('while watching, found a new file',path)
					this.registry.addFromPath(path)
				})
			})
	}

	public teardown() : Promise<void> {
		logger.info('Shutting down repo');
		logger.info('Saving metadata');
		return dataStoreUtils.save<RegistryMetaInfo>(this.metaInfoPath, {lastExecution: new Date()})
			.then(() => {
				logger.info('Saving registry');
				return this.registry.teardown();
			})
	}

	/**
	 * Open to root folder of repository
	 */
	@ImageRepo.actions.register(Features.OpenToRepo)
	public openRepo(){
		return makederp(this.config.path).then(opn);
	}

	protected genArtistFolderName(artist:Model.Artist):string {
		return sanitize(pathUtils.avoidTrailingDot(`[${artist.id}] - ${artist.name}`));
	}
	protected getArtistFolderById(artistId:number) {
		return fs.readdirSync(this.config.path).find(name => name.startsWith(`[${artistId}]`));
	}
	protected getEnsuredArtistFolder(artist:Model.Artist) {
		return this.getArtistFolderById(artist.id) || this.genArtistFolderName(artist);
	}
	
	@ImageRepo.actions.register(Features.OpenToArtist)
	public openArtistFolder(artist:Model.Artist) {
		return makederp(path.resolve(this.config.path, this.getEnsuredArtistFolder(artist))).then(opn);
	}

	/**
	 * Open the folder containing the requested image
	 */
	@ImageRepo.actions.register(Features.OpenToImage)
	public openImageFolder(msg:Messages.ImageRequest) {
		return this.registry.getImagePath(msg.image.id).then(path.dirname).then(opn);
	}

	/**
	 * Determine whether or not the image is in the repository
	 */
	@ImageRepo.actions.register(Features.ImageExists)
	public imageExists(msg:Messages.ImageRequest):Promise<boolean> {
		return this.registry.getImagePath(msg.image.id)
			.then(() => true, () => false);
	}

	/**
	 * Bulk version of imageExists. Given a number of artistImages, return an array of
	 * image IDs that are stored here.
	 */
	@ImageRepo.actions.register(Features.ImagesExist)
	public imagesExist(images: Messages.BulkRequest<Messages.ArtistImageRequest>) {
		return Promise.all(images.items.map(x => this.imageExists(x))).then(results => {
			let imagesFound = [] as Array<Messages.ArtistImageRequest>;
			results.forEach((exists, index) => {
				if (exists) {
					imagesFound.push(images.items[index]);
				}
			})
			return imagesFound;
		})
	}

	protected getDownloadFolder(artist:Model.Artist) {
		switch (this.config.downloadLocation) {
			case DownloadLocation.ARTIST:
				return this.getEnsuredArtistFolder(artist);
			case DownloadLocation.ROOT:
				return '';
			case DownloadLocation.DROP:
				return this.config.dropPath || ''
		}
	}
	
	/**
	 * Download a single image.
	 */
	@ImageRepo.actions.register(Features.DownloadImage)
	public downloadImage(msg:Messages.ArtistUrlRequest) {
		// return downloadUtils.downloadToZip({url:msg.url, path: path.join(this.config.path, this.getDownloadFolder(msg.artist), path.basename(msg.url) + '.zip')});
		return downloadUtils.downloadFromPixiv({ url: msg.url, path: path.join(this.config.path, this.getDownloadFolder(msg.artist), path.basename(msg.url)) });
	}
	/**
	 * Download a manga. This will dispatch depending on user configuration.
	 * 
	 * Options: 
	 * 	- Download loose images (id_p0.jpg...id_pN.jpg)
	 *  - Download to a subdirectory (id/id_p0.jpg...id/id_pN.jpg)
	 *  - Download as a zip (id.zip)
	 */
	@ImageRepo.actions.register(Features.DownloadManga)
	public downloadManga(msg: Messages.BulkRequest<Messages.ArtistUrlRequest>) : Promise<void> {
		logger.info('Beginning bulk download of', msg.items.length, 'items');

		switch (this.config.mangaFormat) {
			case MangaDownloadFormat.LOOSE:
				return this.downloadMangaAsLooseFiles(msg);
			case MangaDownloadFormat.FOLDER:
				return this.downloadMangaInFolder(msg);
			case MangaDownloadFormat.ARCHIVE:
				return this.downloadMangaAsArchive(msg);
		}
		
	}
	protected downloadMangaAsLooseFiles(msg: Messages.BulkRequest<Messages.ArtistUrlRequest>) {
		let tasks = msg.items.map(msg => (() => this.downloadImage(msg)));
		return promiseUtils.promisePool(tasks, 8)
			.then(x => {
				logger.info('Completed download of',x.length,'files');
				return x;
			})

	}
	protected downloadMangaInFolder(msg: Messages.BulkRequest<Messages.ArtistUrlRequest>) {
		let tasks = msg.items.map(msg => (() => {
			let imageId = pathUtils.getImageIdFromFileName(path.basename(msg.url));
			return downloadUtils.downloadFromPixiv({
				url: msg.url,
				path: path.join(this.config.path, this.getDownloadFolder(msg.artist), imageId, path.basename(msg.url)),
			})
		}));
		return promiseUtils.promisePool(tasks, 8)
			.then(x => {
				logger.info('Completed download of',x.length,'files');
				return x;
			})
	}
	protected downloadMangaAsArchive(msg: Messages.BulkRequest<Messages.ArtistUrlRequest>) : Promise<void>  {
		let artist = msg.items[0].artist;
		let imageId = pathUtils.getImageIdFromFilePath(msg.items[0].url);

		return downloadUtils.downloadMangaToZip(
			msg.items.map(item => item.url),
			path.join(this.config.path, this.getDownloadFolder(artist), imageId + '.zip')
		);
	}

	@ImageRepo.actions.register(Features.DownloadAnimation)
	public downloadAnimation(msg:Messages.ArtistImageRequest & {content:string}) {
		let details = downloadUtils.getDataUrlDetails(msg.content);
		if (details) {
			let location = path.join(this.config.path, `${msg.image.id}.${details.mime.subtype}`);

			return makederp(path.dirname(location))
				.then(() => downloadUtils.writeBase64(location, details.content))
				.catch(err => console.log(err));
		}
	}
}

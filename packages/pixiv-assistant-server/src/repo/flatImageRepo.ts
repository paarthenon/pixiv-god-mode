import {Features, Model, Messages} from '../../common/proto'

import * as chokidar from 'chokidar'
import * as fs from 'fs'
import * as log4js from 'log4js'
import * as pathLib from 'path'

import {ActionCache} from '../utils/actionCache'
import {RootRepo} from './rootRepo'
import * as pathUtils from '../utils/path'
import * as downloadUtils from '../utils/download'
import {makederp} from '../utils/makederp'
import * as promiseUtils from '../utils/promise'

const opn = require('opn');
const rrs = require('recursive-readdir-sync');
const fileFinder = require('node-find-files');

type IdSet = { [id: string]: boolean };

let logger = log4js.getLogger('ImageRepo');

interface ImageDb {
	date :Date
	ids :IdSet
}

export class ImageRepo extends RootRepo {
	private static actions = new ActionCache();

	protected imageCache :IdSet= {};

	public getCache() {
		return ImageRepo.actions;
	}

	protected loadImageCache() :ImageDb {
		logger.info("Loading saved image cache");
		return JSON.parse(fs.readFileSync('db.json', 'utf-8'));
	}
	protected filesInPath(repoPath:string):IdSet {
		logger.info("Initializing file registry, manually reading all files in directory");
		let cache: IdSet = {};

		try {
			let fileNames: string[] = rrs(repoPath);

			logger.debug('Filenames loaded. Processing...');
			fileNames
				.map(x => pathLib.basename(x))
				.map(x => pathUtils.fileNameToImage(x).id.toString())
				.filter(x => !!x)
				.forEach(x => cache[x] = true);

			logger.info("Image cache constructed");
		} catch (e) {
			logger.error("Could not find files in the specified path, does the folder exist?");
		}

		return cache;
	}

	protected findFilesAddedSince(repoPath:string, date: Date):Promise<IdSet> {
		logger.info("Finding files added since last execution on", date);
		return new Promise((resolve, reject) => {
			let cache :IdSet = {};

			let finder = new fileFinder({
				rootFolder: repoPath,
				fileModifiedDate: date
			});

			finder.on("match", (path: string, stats: fs.Stats) => {
				logger.trace('File found:', path);
				let image = pathUtils.fileNameToImage(pathLib.basename(path));
				if (image) {
					cache[image.id.toString()] = true;
				}
			});

			finder.on("patherror", function(err:Error, strPath:string) {
				logger.error('Error accessing path:',strPath);
				logger.error('Error Details:',err.message);
			})

			finder.on("error", function(err:Error) {
				let errorStr = 'Error while finding updated files';
				logger.error(errorStr, err.message);
				reject(`${errorStr} [${err.message}]`);
			})

			finder.on("complete", function() {
				logger.info("Found all files added while server offline");
				resolve(cache);
			});

			finder.startSearch();
		});
	}

	protected initializeFileWatcher(path:string) {
		chokidar.watch(path, { persistent: true })
			.on('add', (filePath: string) => {
				let baseName: string = pathLib.basename(filePath);
				let image = pathUtils.fileNameToImage(baseName);
				if (image) {
					this.imageCache[image.id.toString()] = true;
				} else {
					logger.warn(`Discovered a new file [${filePath}] but it does not register as a valid pixiv image. Please contact the developer if this is an error`);
				}
			});
	}

	public constructor(path:string) {
		super(path);

		makederp(path).then(() => {
			let savedObj:ImageDb
		})
		let date: Date = undefined;

		try {
			logger.info("Loading saved image cache");
			let savedObj:ImageDb = JSON.parse(fs.readFileSync('db.json', 'utf-8'));
			date = savedObj.date;
			this.imageCache = savedObj.ids || {} ;
			logger.info("Completed loading saved image cache");
		} catch (e) {
			logger.warn("No saved cache found");

			makederp(path).then(() => {
				this.imageCache = this.filesInPath(path);
			});
		}

		makederp(path).then(() => this.findFilesAddedSince(path, date).then(() => {
			logger.info("Watching for new files");
			this.initializeFileWatcher(path);
			logger.info("Repository initialized. Application ready");
		}));
	}

	public teardown() {
		logger.info("Tearing down repository. Saving in-memory repo DB to disk");
		try {
			fs.writeFileSync('db.json', JSON.stringify({ date: new Date(), ids: this.imageCache }), 'utf-8');
			logger.info("Saved repo database");
		} catch (e) {
			logger.fatal("Error saving repo database");
		}
	}

	@ImageRepo.actions.register(Features.OpenToRepo)
	public openRepo(){
		return makederp(this.repoPath).then(opn);
	}

	@ImageRepo.actions.register(Features.ImageExists)
	public imageExists(msg:Messages.ImageRequest):boolean {
		return msg.image.id.toString() in this.imageCache;
	}

	@ImageRepo.actions.register(Features.ImagesExist)
	public imagesExist(images: Messages.BulkRequest<Messages.ArtistImageRequest>) {
		return images.items.filter(x => this.imageExists(x));
	}
	
	@ImageRepo.actions.register(Features.DownloadImage)
	public downloadImage(msg:Messages.UrlRequest) {
		return downloadUtils.downloadFromPixiv({ url: msg.url, path: pathLib.join(this.repoPath, pathLib.basename(msg.url)) });
	}
	@ImageRepo.actions.register(Features.DownloadManga)
	public downloadManga(msg: Messages.BulkRequest<Messages.UrlRequest>) {
		logger.info('msg bulk download of', msg.items.length, 'items');
		let tasks = msg.items.map(msg => (() => this.downloadImage(msg)));
		return promiseUtils.promisePool(tasks, 8)
			.then(x => {
				logger.info('Completed download of',x.length,'files');
				return x;
			})
	}

	@ImageRepo.actions.register(Features.DownloadAnimation)
	public downloadAnimation(msg:Messages.ArtistImageRequest & {content:string}) {
		let details = downloadUtils.getDataUrlDetails(msg.content);
		if (details) {
			let location = pathLib.join(this.repoPath, `${msg.image.id}.${details.mime.subtype}`);

			return makederp(pathLib.dirname(location))
				.then(() => downloadUtils.writeBase64(location, details.content))
				.catch(err => console.log(err));
		}
	}
}

import {ActionCache} from '../utils/actionCache'
import {BaseRepo} from './baseRepo'

import * as chokidar from 'chokidar'
import * as pathUtils from '../utils/path'
import * as fs from 'fs'

import * as pathLib from 'path'

import * as downloadUtils from '../utils/download'

import {Features, Model, Messages} from '../../common/proto'

import * as log4js from 'log4js'

const opn = require('opn');
const rrs = require('recursive-readdir-sync');
const fileFinder = require('node-find-files');

type IdSet = { [id: string]: boolean };

let logger = log4js.getLogger('Repo');

interface ImageDb {
	date :Date
	ids :IdSet
}

export class ImageRepo extends BaseRepo {
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
	public constructor(path:string) {
		super(path);
		let date: Date = undefined;

		try {
			logger.info("Loading saved image cache");
			let savedObj:ImageDb = JSON.parse(fs.readFileSync('db.json', 'utf-8'));
			date = savedObj.date;
			this.imageCache = savedObj.ids || {} ;
			logger.info("Completed loading saved image cache");
		} catch (e) {
			logger.warn("No saved cache found");
			this.imageCache = this.filesInPath(path);
		}

		logger.info("Finding files added since last execution");
		let finder = new fileFinder({
			rootFolder: path,
			fileModifiedDate: date
		});

		finder.on("match", (path: string, stats: fs.Stats) => {
			let image = pathUtils.fileNameToImage(pathLib.basename(path));
			if (image) {
				this.imageCache[image.id.toString()] = true;
			}
		});
		finder.on("complete", function() {
			logger.info("Found all files added while server offline");
		});

		logger.info("Watching for new files");
		chokidar.watch(path, { persistent: true })
			.on('add', (filePath: string) => {
				let baseName: string = pathLib.basename(filePath);
				let imageId: string = pathUtils.fileNameToImage(baseName).id.toString();
				this.imageCache[imageId] = true;
			});
		logger.info("Repository initialized. Application ready");
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
		opn(this.repoPath);
	}

	@ImageRepo.actions.register(Features.ImageExists)
	public imageExists(msg:Messages.ImageRequest):boolean {
		return msg.image.id.toString() in this.imageCache;
	}

	@ImageRepo.actions.register(Features.ImagesExistForArtist)
	public imagesExist(images: Messages.BulkRequest<Messages.ArtistImageRequest>) {
		return images.items.filter(x => this.imageExists(x));
	}
	
	@ImageRepo.actions.register(Features.DownloadImage)
	public downloadImage(msg:Messages.UrlRequest) {
		return downloadUtils.downloadFromPixiv({ url: msg.url, path: pathLib.basename(msg.url) });
	}
	@ImageRepo.actions.register(Features.DownloadManga)
	public downloadManga(msg: Messages.BulkRequest<Messages.UrlRequest>) {
		return Q.all(msg.items.map(x => this.downloadImage(x)));
	}
	@ImageRepo.actions.register(Features.DownloadAnimation)
	public downloadAnimation(msg: Messages.UrlRequest) {
		return this.downloadImage(msg);
	}
}

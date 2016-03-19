import {ActionCache} from '../utils/actionCache'
import {BaseRepo} from './baseRepo'

import * as chokidar from 'chokidar'
import * as pathUtils from '../utils/path'
import * as fs from 'fs'

import * as pathLib from 'path'

const rrs = require('recursive-readdir-sync');
const fileFinder = require('node-find-files');

type IdSet = { [id: string]: boolean };

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

	public constructor(path:string) {
		super(path);
		let date: Date = undefined;

		try {
			let savedObj:ImageDb = JSON.parse(fs.readFileSync('db.json', 'utf-8'));
			date = savedObj.date;
			this.imageCache = savedObj.ids || {} ;
		} catch (e) {
			try {
				let files: string[] = rrs(path);

				files
					.map(x => pathLib.basename(x))
					.map(x => pathUtils.fileNameToImage(x).id.toString())
					.filter(x => !!x)
					.forEach(x => this.imageCache[x] = true);

			} catch (e) {
				console.log('Error occurred, does repo exist?');
			}
		}

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
			console.log("Finished loading files since last update.")
		});

		chokidar.watch(path, { persistent: true })
			.on('add', (filePath: string) => {
				let baseName: string = pathLib.basename(filePath);
				let imageId: string = pathUtils.fileNameToImage(baseName).id.toString();
				this.imageCache[imageId] = true;
			});
	}

	public teardown() {
		fs.writeFileSync('db.json', JSON.stringify({ date: new Date(), ids: this.imageCache }), 'utf-8');
	}
}

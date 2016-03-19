import {ActionCache} from '../utils/actionCache'
import {BaseRepo} from './baseRepo'

import * as chokidar from 'chokidar'
import * as pathUtils from '../utils/path'
import * as fs from 'fs'

import * as pathLib from 'path'

const rrs = require('recursive-readdir-sync');

type IdSet = { [id: string]: boolean };

export class ImageRepo extends BaseRepo {
	private static actions = new ActionCache();

	protected imageCache :IdSet= {};

	public getCache() {
		return ImageRepo.actions;
	}

	public constructor(path:string) {
		super(path);
		
		try {
			this.imageCache = JSON.parse(fs.readFileSync('db.json', 'utf-8'));
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

		chokidar.watch(path, { persistent: true })
			.on('add', (filePath: string) => {
				let baseName: string = pathLib.basename(filePath);
				let imageId: string = pathUtils.fileNameToImage(baseName).id.toString();
				this.imageCache[imageId] = true;
			});
	}

	public teardown() {
		fs.writeFileSync('db.json', JSON.stringify(this.imageCache), 'utf-8');
	}
}

import * as path from 'path'
import * as log4js from 'log4js'

import * as pathUtils from '../utils/path'
import * as dataStoreUtils from '../utils/dataStore'

type filesById = { [id:number]: string[] };

export abstract class Registry {
	constructor(protected repoPath:string) { }
	
	public initialize() :Promise<void> {
		return Promise.resolve();
	}
	public teardown() :Promise<void> {
		return Promise.resolve();
	}

	public abstract addFromPath(filePath:string) : Promise<void>

	public addFromPaths(filePaths:string[]) : Promise<void> {
		return Promise.all(filePaths.map(fPath => this.addFromPath(fPath))).then<void>(() => Promise.resolve());;
	}

	public abstract findImage(imageId:number) : Promise<string[]>
	public findImages(imageIds:number[]) : Promise<filesById> {
		return Promise.all(imageIds.map(id => this.findImage(id).then(files => ({id, files}))))
			.then(items => items.reduce<filesById>((acc, cur) => { 
				if (cur.files.length > 0) {
					acc[cur.id] = cur.files;
				}
				return acc; 
			}, {}));
	}
}

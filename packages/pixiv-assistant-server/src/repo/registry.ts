import * as path from 'path'
import * as log4js from 'log4js'

import * as pathUtils from '../utils/path'
import * as dataStoreUtils from '../utils/dataStore'


export class Registry {
	protected cache : { [id:number] : string } = {};

	constructor(protected repoPath:string) { }

    public initialize() {}
    public teardown() {}

	public addFromPath(filePath:string) : Promise<void> {
        let imageId = pathUtils.getImageIdFromFilePath(filePath);
        if (imageId !== undefined) {
            this.cache[imageId] = filePath;
            return Promise.resolve();
        } else {
            return Promise.reject(`file ${filePath} failed to match regex`);
        }
	}

    public getImagePath(imageId:number) : Promise<string> {
        return new Promise((resolve, reject) => {
            if (imageId in this.cache) {
                resolve(this.cache[imageId]);
            } else {
                reject(`imageId ${imageId} not found in registry`);
            }
        })
    }
}

interface SerializedDatabase {
	[id:number] : string
}

let logger = log4js.getLogger('FileRegistry')

export class FileRegistry extends Registry {
    protected get dbFilePath() : string {
        return path.resolve(this.repoPath, 'db.json')
    }

    public initialize() : Promise<void> {
        return dataStoreUtils.load<SerializedDatabase>(this.dbFilePath)
            .then(fileDB => Object.assign(this.cache, fileDB))
            .catch(() => Promise.resolve()); // swallow the error of no db.json. It's not really an error. 
    }

    public teardown() : Promise<void> {
        return dataStoreUtils.save(this.dbFilePath, this.cache);
    }
}
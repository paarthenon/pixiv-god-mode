import {Registry} from './registry'
import * as pathUtils from '../utils/path'
import * as dataStoreUtils from '../utils/dataStore'
import * as path from 'path'
// import * as log4js from 'log4js'

import * as Loki from 'lokijs'

// let logger = log4js.getLogger('Registry')

interface Image {
    id :number
    locations :string[]
}

const idColumn = 'id';

export class LokiRegistry extends Registry {
    protected db : Loki;
    protected images : LokiCollection<Image>

    public initialize() {
        return new Promise<void>((resolve, reject) => {
            let dbPath = path.resolve(this.repoPath, 'loki.json');
            this.db = new Loki(dbPath, {
                autosave: true,
                autosaveInterval: 10000,
                autoload: true,
                autoloadCallback: () => {
                    if (!this.db.getCollection('images')) {
                        this.db.addCollection('images', {unique: [idColumn]});
                    }
                    this.images = this.db.getCollection<Image>('images');
                    resolve();
                }
            });
        })
    }
    public findImage(imageId:number, pageNum?:number) {
        let image = this.images.by(idColumn, imageId.toString());
        if (image) {
            return Promise.resolve(image.locations || []);
        } else {
            return Promise.resolve([]);
        }
    }
    public addFromPath(filePath:string) {
        let imageId = pathUtils.getImageIdFromFilePath(filePath);
        // logger.trace('Found id [',imageId,'] for path [',filePath,']');
        if (!imageId) {
            return Promise.resolve();
        }
        let image = this.images.by(idColumn, imageId.toString());
        if (image) {
            image.locations.push(filePath);
            this.images.update(image);
        } else {
            this.images.insert({
                id: imageId,
                locations: [filePath],
            });
        }
        return Promise.resolve();
    }
    public teardown() {
        console.log(this.images.count());
        this.images.flushChanges();
        return super.teardown().then(() => new Promise<void>((resolve, reject) => {
            this.db.saveDatabase(err => {
                // logger.warn('db should be saved');
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        }));
    }
    
}
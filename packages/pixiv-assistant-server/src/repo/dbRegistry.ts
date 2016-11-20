import {createConnection, Connection, Repository} from 'typeorm'
import {Illustration} from '../db/illustration'
import {File} from '../db/file'
import * as promiseUtils from '../utils/promise'
import * as underscore from 'underscore'
import * as pathUtils from '../utils/path'
import * as log4js from 'log4js'
import * as path from 'path'
let logger = log4js.getLogger('Registry')

import {Registry} from './registry'

export class DBRegistry extends Registry {
	protected connection :Connection
	protected illustRepo :Repository<Illustration>
	protected fileRepo :Repository<File>

	public initialize() {
		logger.trace('Initializing');
		let indexPath = path.resolve(this.repoPath, 'index.sqlite');
		logger.trace('Connecting to',indexPath);
		return createConnection({
			driver: {
				type: 'sqlite',
				storage: indexPath,
			},
			entities: [
				Illustration,
				File,
			],
			logging: {
				logQueries: true,
			},
			autoSchemaSync: true,
		}).then(connection => {
			console.log('test');
			this.connection = connection;
			this.illustRepo = connection.getRepository(Illustration);
			this.fileRepo = connection.getRepository(File);
		}).catch(err => {
			logger.fatal('Unable to load database', err);
			console.log(err);
		})
	}
	protected isIllustRegistered(imageId:number) : Promise<boolean> {
		return this.illustRepo.findOne(undefined, {alias: 'illust', whereConditions: {illustration_id: imageId}})
			.then(found => !!found)
	}
	public addFromPath(filePath:string) : Promise<void> {
		return this.addFromPaths([filePath]);
	}
	protected shardify<T, V>(arr:T[], size:number, shardF: (x:T[]) => Promise<V>) : Array<() => Promise<V>> {
		let indices = [...Array(Math.floor(arr.length / size)).keys()].map(i => i * size);
		return indices.map(i => () => shardF(arr.slice(i, i+size)));
	}
	public bulkAdd(filePaths:string[]) : Promise<void> {
		logger.info('BULK ADD');

		let imageMap = underscore.chain(filePaths)
			.groupBy(pathUtils.getImageIdFromFilePath)
			.omit(undefined)
			.value();

		let imageIds = Object.keys(imageMap);

		return this.illustRepo.transaction(repo => {
			let shards = this.shardify(imageIds, 500, subset => {
				return repo.createQueryBuilder('illust')
					.where('illustration_id in (:array)', {array: subset})
					.getResults()
			});

			let count = 1;
			return Promise.all(shards.map(shard => shard()))
				.then(results => {
					let cache : {[id:number]:Illustration} = {};
					results.forEach(result => result.forEach(illust => cache[illust.illustration_id] = illust));
					logger.info('Cache built with', Object.keys(cache).length, 'keys');
					return cache;
				})
		}).then((cache:{[id:number]:Illustration}) => {
			imageIds.forEach(id => {
				if (!(id in cache)) {
					let illust = this.illustRepo.create();
					illust.illustration_id = parseInt(id);
					illust.page = 0;
					cache[parseInt(id)] = illust;
				}
				let illust = cache[parseInt(id)];
				illust.files = illust.files || [];
				illust.files.push(...imageMap[parseInt(id)].map(fPath => {
					let file = new File();
					file.path = fPath;
					return file;
				}))
			});
			return Object.keys(cache).map(key => cache[parseInt(key)]);
		}).then(illusts => {
			logger.info('Trying to save',illusts.length,'files');

			return this.illustRepo.transaction(repo => repo.persist(illusts))
				.then(() => logger.info('completed'))
				.catch(logger.error);
		})
		
	}
	public addFromPaths(filePaths:string[]) : Promise<void> {
		if (filePaths.length > 1) {
			return this.bulkAdd(filePaths);
		}
		let imageIds = filePaths.map(fPath => ({id: pathUtils.getImageIdFromFilePath(fPath), path: fPath})).filter(x => !!x.id);
		return this.illustRepo.createQueryBuilder('illust')
			.where('illustration_id in (:array)', {array: imageIds.map(x => x.id)})
			.getResults() // get images that match the set of ids.
			.catch(err => { logger.error(err); return <Illustration[]>[] })
			.then(results => {
				logger.debug('found',results);

				return results.reduce<{[id:number]:Illustration}>((acc, cur) => { acc[cur.illustration_id] = cur; return acc; }, {})
			}) // generate illust cache
			.then(illustMap =>
				imageIds.map(entry => { // generate models.
					let file = new File();
					file.path = entry.path;
					if (entry.id in illustMap) {
						file.illustration = illustMap[entry.id];
					} else {
						let illust = new Illustration();
						illust.illustration_id = entry.id;
						illust.page = 0; //TODO: Update this when supporting different pages.
						file.illustration = illust;
					}
					return file;
				}))
			.then(files => {
				logger.info('saving',files.length,'file objects to db');
				this.fileRepo.transaction(repo => repo.persist(files).catch(logger.error));
			})
			.catch(logger.error);
	}
	public findImage(imageId:number) :Promise<string[]> {
		return this.findImages([imageId])
			.then(result => result[imageId]);
	}
	public findImages(imageIds:number[]) : Promise<{[id:number]:string[]}> {
		return this.illustRepo.transaction(repo => {
			return repo.createQueryBuilder('illust')
				.where('illustration_id in (:array)', {array: imageIds})
				.innerJoinAndSelect('illust.files', 'files')
				.getResults()
				.catch(err => {
					logger.error('Error while finding images', err);
					return <Illustration[]>[];
				})
				.then(illusts => {
					logger.info('Retrieved illustrations', illusts);
					let cache : {[id:number]:string[]} = {};
					illusts.forEach(illust => {
						cache[illust.illustration_id] = illust.files.map(file => file.path)
					})

					logger.info('constructed obj',cache);
					return cache;
				})
		}).catch(err => {
			logger.error('Error while doing things');
			logger.error(err);
		})
	}
}

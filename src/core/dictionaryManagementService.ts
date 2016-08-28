import * as log4js from 'log4js'

import IConfig from './IConfig'
import IDictionary from './IDictionary'

import SingleConfigDict from './singleConfigDictionary'
import DictBroker from './dictBroker'

import {GithubDictionaryUtil} from './githubDictionaryUtil'

import ConfigKeys from '../configKeys'

let logger = log4js.getLogger('Dictionary');

interface AppKeys {
	global :string
	local :string
	cache :string
}

export type naiveDictionary = { [id:string]:string };

export type cachedDictionary = { cache: {key:string, value:string, local:boolean, hasGlobalDef?:boolean}[] };

export class CachedDictionaryService {
	constructor(
		protected config:IConfig,
		protected keys:AppKeys
	) {	}

	protected generateCachedDictionary(global:naiveDictionary, local:naiveDictionary) :cachedDictionary {
		let keySet = new Set(Object.keys(global).concat(Object.keys(local)));
		
		let cache = [...keySet].map(key => {
				if (key in local) {
					let hasGlobalDef = key in global;
					return {key, value: local[key], local:true, hasGlobalDef};
				} else {
					return {key, value: global[key], local:false};
				}
			})
			.sort((a,b) => a.value.localeCompare(b.value) || a.key.localeCompare(b.key));

		return {cache};
	}

	protected recalculateCache() {
		return this.local.then(localDict => 
			this.global.then(globalDict =>
				this.config.set(this.keys.cache, this.generateCachedDictionary(globalDict, localDict))));
	}

	public get cache() :Promise<cachedDictionary> {
		return this.config.get(this.keys.cache)
			.catch(() => this.recalculateCache());
	}
	public get local() :Promise<naiveDictionary> {
		return this.config.get(this.keys.local)
			.catch(() => this.config.set(this.keys.local, {}).then(() => ({})));
	}
	public get global() :Promise<naiveDictionary> {
		return this.config.get(this.keys.global)
			.catch(() =>this.config.set(this.keys.global, {}).then(() => ({})));
	}

	public update(key:string, value:string) {
		return this.local.then(localDict => {
			localDict[key] = value;
			return this.config.set(this.keys.local, localDict)
		}).then(() => this.recalculateCache());
	}

	protected deleteMultiple(keys: string[]) {
		return this.local.then(localDict => {
			keys.forEach(key => delete localDict[key]);
			return this.config.set(this.keys.local, localDict);
		}).then(() => this.recalculateCache());
	}
	public delete(key:string) {
		return this.deleteMultiple([key]);
	}

	public getLocalDuplicates() :Promise<Array<string>> {
		return this.local.then(localDict =>
			this.global.then(globalDict => {
				return Object.keys(localDict).filter(key => 
					key in globalDict && localDict[key] === globalDict[key]);
			}));
	}
	public deleteLocalDuplicates() :Promise<void> {
		return this.getLocalDuplicates().then(dupes => this.deleteMultiple(dupes));
	}

}

export class DictionaryManagementService extends CachedDictionaryService {
	constructor(
		protected config:IConfig,
		protected ghUtils:GithubDictionaryUtil,
		protected keys:AppKeys
	) {	super(config, keys); }

	public get globalUpdateAvailable() : Promise<boolean> {
		logger.debug('DictionaryService.updateAvailable | entered');
		return this.ghUtils.masterCommit.then(commitHash => {
			return this.config.get(ConfigKeys.official_dict_hash).then(currentHash => {
				let isNewer: boolean = !currentHash || currentHash !== commitHash;
				logger.debug(`DictionaryService.updateAvailable | commit has been received: [${commitHash}] is ${(isNewer) ? '' : 'not '} newer than [${currentHash}]`);
				return isNewer;
			}).catch(() => true);
		});
	}

	public updateGlobalDictionary() : Promise<void> {
		logger.debug('DictionaryService.updateDictionary | entered');
		return this.ghUtils.masterCommit.then(commitHash => 
			this.ghUtils.newestDictionary.then(obj => 
				Promise.all([
					this.config.set(ConfigKeys.official_dict, obj),
					this.config.set(ConfigKeys.official_dict_hash, commitHash)
				]).then(() => this.recalculateCache())
			)
		);
	}
}
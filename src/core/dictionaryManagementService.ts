import IConfig from 'src/core/IConfig'

import {GithubDictionaryUtil} from 'src/core/githubDictionaryUtil'

import ConfigKeys from 'src/configKeys'
import {prefix} from 'src/utils/log'
let console = prefix('Dictionary Management Service');

interface AppKeys {
	global :string
	local :string
	cache :string
}

export type naiveDictionary = { [id:string]:string };

export enum EntryType {
	GLOBAL,
	LOCAL,
	BOTH,
}
export interface cachedDictionaryEntry {
	key:string
	value:string
	type:EntryType
}

export type cachedDictionary = { cache: cachedDictionaryEntry[] };

/**
 * An implementation of the dictionary service that provides basic CRUD operations and updates and
 * internal cache alongside them.
 */
export class CachedDictionaryService {
	constructor(
		protected config:IConfig,
		protected keys:AppKeys
	) {	}

	// Performance could be improved by modifying the cache in place instead of constructing it every time
	// but this is logically simpler and hasn't been an issue. 
	protected generateCachedDictionary(global:naiveDictionary, local:naiveDictionary) :cachedDictionary {
		let keySet = new Set(Object.keys(global).concat(Object.keys(local)));
		
		let cache = [...keySet].map(key => {
			if (key in local) {
				return {key, value: local[key], type: (key in global)? EntryType.BOTH : EntryType.LOCAL};
			} else {
				return {key, value: global[key], type: EntryType.GLOBAL};
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
	public getTranslation(key:string) {
		return this.local.then(localDict => {
			if (key in localDict) {
				return localDict[key];
			} else {
				return this.global.then(globalDict => (key in globalDict) ? globalDict[key] : undefined);
			}
		})
	}

	public update(key:string, value:string) {
		console.debug(`setting translation for [${key}] to [${value}]`);
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
		console.debug(`deleting entry with key [${key}]`)
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

/**
 * An extended form of the CachedDictionaryService that includes update logic.
 */
export class DictionaryManagementService extends CachedDictionaryService {
	constructor(
		protected config:IConfig,
		protected ghUtils:GithubDictionaryUtil,
		protected keys:AppKeys
	) {	super(config, keys); }

	public get globalUpdateAvailable() : Promise<boolean> {
		let methodConsole = prefix('globalUpdateAvailable', console);
		methodConsole.debug('checking if there is a global dictionary update available');
		return this.ghUtils.masterCommit.then(commitHash => {
			return this.config.get(ConfigKeys.official_dict_hash).then(currentHash => {
				let isNewer: boolean = !currentHash || currentHash !== commitHash;
				methodConsole.debug(`commit has been received: [${commitHash}] is ${(isNewer) ? '' : 'not '} newer than [${currentHash}]`);
				return isNewer;
			}).catch(() => true);
		});
	}

	public updateGlobalDictionary() : Promise<void> {
		console.debug('updating global dictionary');
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
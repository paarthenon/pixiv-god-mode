import * as log4js from 'log4js'

import IConfig from './IConfig'
import IDictionary from './IDictionary'

import SingleConfigDict from './singleConfigDictionary'
import DictBroker from './dictBroker'

let logger = log4js.getLogger('Dictionary');

interface AppKeys {
	global :string
	local :string
	cache :string
}

export type naiveDictionary = { [id:string]:string };

export type cachedDictionary = { cache: {key:string, value:string, local:boolean}[] };

export class CachedDictionaryService {
	constructor(
		protected config:IConfig,
		protected keys:AppKeys
	) {
		// If the cache doesn't exist, generate it.
		this.cache
			.then(() => console.log('successfully loaded cache'))
			.catch(() => { console.log('failed to load cache'); this.recalculateCache() })
	}

	protected generateCachedDictionary(global:naiveDictionary, local:naiveDictionary) :cachedDictionary {
		let cache = Object.keys(global).concat(Object.keys(local))
			.map(key => {
				if (key in local) {
					return {key, value: local[key], local:true};
				} else {
					return {key, value: global[key], local:false};
				}
			})
			.sort((a,b) => a.value.localeCompare(b.value));

		return {cache};
	}

	protected recalculateCache() {
		return this.local.then(localDict => 
			this.global.then(globalDict =>
				this.config.set(this.keys.cache, this.generateCachedDictionary(globalDict, localDict))));
	}

	public get cache() :Promise<cachedDictionary> {
		return this.config.get(this.keys.cache)
	}
	public get local() :Promise<naiveDictionary> {
		return this.config.get(this.keys.local);
	}
	public get global() :Promise<naiveDictionary> {
		return this.config.get(this.keys.global);
	}

	public update(key:string, value:string) {
		return this.local.then(localDict => {
			localDict[key] = value;
			return this.config.set(this.keys.local, localDict)
		}).then(() => this.recalculateCache());
	}

	public delete(key:string) {
		return this.local.then(localDict => {
			delete localDict[key];
			return this.config.set(this.keys.local, localDict);
		}).then(() => this.recalculateCache());
	}

	// public getTranslation(tag:string):Promise<string> {
	// 	return this.broker.get(tag)
	// 		.then(translation => {
	// 			logger.debug(`DictionaryService.getTranslation | for [${tag}] found [${translation}]`);
	// 			return translation;
	// 		}).catch(() => undefined);
	// }
}

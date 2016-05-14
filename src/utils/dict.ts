import * as Deps from '../deps'
import IConfig from '../IConfig'
import ConfigKeys from '../configKeys'
import * as ghUtils from './github'

import * as log4js from 'log4js'

type stringMap = { [id: string]: string }

export interface Dictionary {
	keys: Promise<string[]>
	get: (key:string) => Promise<string>
	set: (key:string, value:string) => void
}

class SingleConfigDict implements Dictionary {
	protected dict: Promise<stringMap>;
	constructor(protected config:IConfig, protected configKey:string) {
		// creates and sets default dict on initialization
		this.dict = config.get(configKey)
			.then(dict => dict || {})
			.catch(error => {
				logger.warn('Unable to get dictionary. Creating');
				return {};
			});
	}
	public get keys(){
		return this.dict.then(dict => Object.keys(dict));
	}
	public get(key:string):Promise<string> {
		return this.dict.then(dict => dict[key]);
	}
	public set(key:string, value:string):void {
		this.dict = this.dict.then(dict => {
			if (value) {
				dict[key] = value;
			} else {
				delete dict[key];
			}

			return Promise.resolve(dict).then(dict => { 
				this.config.set(this.configKey, dict); 
				return dict; 
			});
		});
	}
}

class DictBroker {
	constructor(protected dictionaries: Dictionary[]) { }
	get(key: string): Promise<string> {
		return this.dictionaries.reduce(
			(acc, current) => acc.then(null, reject => current.get(key)), 
			Promise.reject<string>(undefined));
	}
}

let logger = log4js.getLogger('Dictionary');
export module DictionaryService {
	let cachedConfig :IConfig = undefined;

	export let userDictionary :SingleConfigDict = undefined;
	export let baseDictionary :SingleConfigDict = undefined;

	let broker :DictBroker = undefined;

	export function initialize(config:IConfig){
		cachedConfig = config;

		userDictionary = new SingleConfigDict(config, ConfigKeys.user_dict);
		baseDictionary = new SingleConfigDict(config, ConfigKeys.official_dict);

		broker = new DictBroker([
			userDictionary,
			baseDictionary
		]);
	}

	export function getTranslation(tag:string):Promise<string> {
		return Promise.resolve(broker.get(tag))
			.then(translation => {
				logger.debug(`DictionaryService.getTranslation | for [${tag}] found [${translation}]`);
				return translation;
			});
	}

	let ghPath = 'pixiv-assistant/dictionary'
	export function updateAvailable() : Promise<boolean> {
		logger.debug('DictionaryService.updateAvailable | entered');
		return ghUtils.getMasterCommit(ghPath).then(commitHash => {
			return cachedConfig.get(ConfigKeys.official_dict_hash).then(currentHash => {
				let isNewer: boolean = !currentHash || currentHash !== commitHash;
				logger.debug(`DictionaryService.updateAvailable | commit has been received: [${commitHash}] is ${(isNewer) ? '' : 'not '} newer than [${currentHash}]`);
				return isNewer;
			});
		});
	}

	export function updateDictionary() : Promise<void> {
		logger.debug('DictionaryService.updateDictionary | entered');
		return ghUtils.getMasterCommit(ghPath).then(commitHash => {
			return ghUtils.getDictionaryObject(ghPath, commitHash).then(obj => {
				logger.debug(`DictionaryService.updateAvailable | commit has been received: [${commitHash}]`);
				cachedConfig.set(ConfigKeys.official_dict, obj);
				cachedConfig.set(ConfigKeys.official_dict_hash, commitHash);
			});
		});
	}
}

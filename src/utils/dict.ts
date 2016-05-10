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
		this.dict = config.get(configKey).then(dict => dict || {});
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

			return Q(dict).tap(dict => this.config.set(this.configKey, dict));
		});
	}
}

class DictBroker {
	constructor(protected dictionaries: Dictionary[]) { }
	get(key: string): Q.IPromise<string> {
		let q = Q.defer<string>();
		q.reject(undefined);
		return this.dictionaries.reduce((acc, current) => acc.then(null, reject => current.get(key)), q.promise)
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

		let broker = new DictBroker([
			userDictionary,
			baseDictionary
		]);
	}

	export function getTranslation(tag:string):Q.IPromise<string> {
		return Q(broker.get(tag))
			.tap(translation => logger.debug(`DictionaryService.getTranslation | for [${tag}] found [${translation}]`));
	}

	let ghPath = 'pixiv-assistant/dictionary'
	export function updateAvailable(callback:(available:boolean) => any) {
		logger.debug('DictionaryService.updateAvailable | entered');
		ghUtils.getMasterCommit(ghPath, commitHash => {
			cachedConfig.get(ConfigKeys.official_dict_hash).then(currentHash => {
				let isNewer: boolean = !currentHash || currentHash !== commitHash;
				logger.debug(`DictionaryService.updateAvailable | commit has been received: [${commitHash}] is ${(isNewer) ? '' : 'not '} newer than [${currentHash}]`);
				callback(isNewer);
			});
		});
	}

	export function updateDictionary(onComplete?:()=>any) {
		logger.debug('DictionaryService.updateDictionary | entered');
		ghUtils.getMasterCommit(ghPath, commitHash => {
			ghUtils.getDictionaryObject(ghPath, commitHash, obj => {
				logger.debug(`DictionaryService.updateAvailable | commit has been received: [${commitHash}]`);
				cachedConfig.set(ConfigKeys.official_dict, obj);
				cachedConfig.set(ConfigKeys.official_dict_hash, commitHash);
				if(onComplete){
					onComplete();
				}
			})
		});
	}
}

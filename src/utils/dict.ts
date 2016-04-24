import * as Deps from '../deps'
let Config = Deps.Container.config;
import ConfigKeys from '../configKeys'

import * as ghUtils from './github'

import * as log4js from 'log4js'

type stringMap = { [id: string]: string }

export interface Dictionary {
	keys: Q.IPromise<string[]>
	get: (key:string) => Q.IPromise<string>
	set: (key:string, value:string) => void
}

class SingleConfigDict implements Dictionary {
	protected dict: Q.IPromise<stringMap>;
	constructor(protected configKey:string) {
		// creates and sets default dict on initialization
		this.dict = Config.get(configKey).then(dict => dict || {});
	}
	public get keys(){
		return this.dict.then(dict => Object.keys(dict));
	}
	public get(key:string):Q.IPromise<string> {
		return this.dict.then(dict => dict[key]);
	}
	public set(key:string, value:string):void {
		this.dict = this.dict.then(dict => {
			if (value) {
				dict[key] = value;
			} else {
				delete dict[key];
			}

			return Q(dict).tap(dict => Config.set(this.configKey, dict));
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
	export let userDictionary :SingleConfigDict = undefined;
	export let baseDictionary :SingleConfigDict = undefined;

	let broker :DictBroker = undefined;

	export function initialize(){
		userDictionary = new SingleConfigDict(ConfigKeys.user_dict);
		baseDictionary = new SingleConfigDict(ConfigKeys.official_dict);

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
			Config.get(ConfigKeys.official_dict_hash).then(currentHash => {
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
				Config.set(ConfigKeys.official_dict, obj);
				Config.set(ConfigKeys.official_dict_hash, commitHash);
				if(onComplete){
					onComplete();
				}
			})
		});
	}
}

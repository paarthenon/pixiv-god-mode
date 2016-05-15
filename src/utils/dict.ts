import * as Deps from '../deps'
import IConfig from '../core/IConfig'
import ConfigKeys from '../configKeys'
import * as ghUtils from './github'
import IDictionary from '../core/IDictionary'
import * as log4js from 'log4js'

import SingleConfigDict from '../core/singleConfigDictionary'

let logger = log4js.getLogger('Dictionary');

class DictBroker {
	constructor(protected dictionaries: IDictionary[]) { }
	get(key: string): Promise<string> {
		return this.dictionaries.reduce(
			(acc, current) => 
				acc.then(null, reject => 
						current.get(key).then(value => value || Promise.reject<string>('Not found'))),
			Promise.reject<string>(undefined));
	}
}

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
		return broker.get(tag)
			.then(translation => {
				logger.debug(`DictionaryService.getTranslation | for [${tag}] found [${translation}]`);
				return translation;
			}).catch(() => undefined);
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

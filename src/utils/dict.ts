import * as Deps from '../deps'
import IConfig from '../core/IConfig'
import ConfigKeys from '../configKeys'
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
}

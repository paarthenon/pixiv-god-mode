import * as log4js from 'log4js'

import IConfig from './IConfig'
import IDictionary from './IDictionary'

import SingleConfigDict from './singleConfigDictionary'
import DictBroker from './dictBroker'

let logger = log4js.getLogger('Dictionary');

export class DictionaryService {
	protected broker:DictBroker = undefined;

	constructor(
		protected config:IConfig,
		protected dictKeys:string[]
	) {
		this.broker = new DictBroker(dictKeys.map(key => new SingleConfigDict(config, key)))
	}

	public getTranslation(tag:string):Promise<string> {
		return this.broker.get(tag)
			.then(translation => {
				logger.debug(`DictionaryService.getTranslation | for [${tag}] found [${translation}]`);
				return translation;
			}).catch(() => undefined);
	}
}

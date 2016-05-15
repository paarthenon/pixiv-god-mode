import * as log4js from 'log4js'

import IDictionary from './IDictionary'
import IConfig from './IConfig'

type stringMap = { [id: string]: string }

let logger = log4js.getLogger('Dictionary');

export class SingleConfigDictionary implements IDictionary {
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

export default SingleConfigDictionary;
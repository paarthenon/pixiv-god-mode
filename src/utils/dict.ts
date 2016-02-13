import Config from './config'
import ConfigKeys from '../configKeys'

type stringMap = { [id: string]: string }

export interface Dictionary {
	keys: string[]
	get: (key:string) => string
	set: (key:string, value:string) => void
}

class NaiveDictionary implements Dictionary {
	constructor(protected dict: stringMap) { }

	public get keys() {
		return Object.keys(this.dict);
	}
	public get(key: string): string {
		return this.dict[key];
	}
	public set(key: string, value: string): void {
		this.dict[key] = value;
	}
}

export class SingleConfigDict implements Dictionary {
	protected dict: stringMap;
	constructor(protected configKey:string) {
		this.dict = <stringMap>Config.get(configKey);
	}
	public get keys(){
		return (this.dict) ? Object.keys(this.dict) : [];
	}
	public get(key:string):string {
		return (this.dict) ? this.dict[key] : undefined;
	}
	public set(key:string, value:string):void {
		if (!this.dict) {
			this.dict = {};
		}
		if (value){
			this.dict[key] = value;
		}else{
			delete this.dict[key];
		}
		Config.set(this.configKey, this.dict);
	}
}

class SpreadConfigDict implements Dictionary {
	constructor(protected configKey:string) { }

	protected getConfigKeyForWord(word:string):string {
		return `${this.configKey}::${word}`;
	}

	public get keys() {
		//return GM_listValues().filter(key => key.match(new RegExp(`${this.configKey}::`)) != undefined);
		// TODO: Code this properly if this class ends up being used.
		return <string[]>[];
	}
	public get(key: string):string {
		return <string>Config.get(this.getConfigKeyForWord(key));
	}
	public set(key:string, value:string):void {
		Config.set(this.getConfigKeyForWord(key), value);
	}
}

let localDict: stringMap = {
	'眼鏡': 'glasses'
}

class DictBroker {
	constructor(protected dictionaries:Dictionary[]) { }
	get (key:string):string {
		for(let dict of this.dictionaries) {
			let value = dict.get(key);
			if(value){
				return value;
			}
		}
		return undefined;
	}
}

let broker = new DictBroker([
	new SingleConfigDict(ConfigKeys.user_dict),
	new SingleConfigDict(ConfigKeys.official_dict),
	new NaiveDictionary(localDict)
]);

export function getTranslation(tag:string):string {
	return broker.get(tag);
}
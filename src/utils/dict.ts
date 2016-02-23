import Config from './config'
import ConfigKeys from '../configKeys'

import * as ghUtils from './github'

type stringMap = { [id: string]: string }

export interface Dictionary {
	keys: string[]
	get: (key:string) => string
	set: (key:string, value:string) => void
}

class SingleConfigDict implements Dictionary {
	protected dict: stringMap;
	constructor(protected configKey:string) {
		this.dict = <stringMap>Config.get(configKey);
	}
	public get keys(){
		return (this.dict) ? Object.keys(this.dict) : [];
	}
	public get(key:string):string {
		console.log(this.keys);
		return (this.dict) ? this.dict[key] : undefined;
	}
	public set(key:string, value:string):void {
		console.log(this.keys);
		if (!this.dict) {
			this.dict = {};
		}
		if (value){
			this.dict[key] = value;
		}else{
			delete this.dict[key];
		}
		Config.set(this.configKey, this.dict);
		console.log(this.keys);
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

class DictBroker {
	constructor(protected dictionaries: Dictionary[]) { }
	get(key: string): string {
		for (let dict of this.dictionaries) {
			let value = dict.get(key);
			if (value) {
				return value;
			}
		}
		return undefined;
	}
}

export module DictionaryService {
	export let userDictionary = new SingleConfigDict(ConfigKeys.user_dict);
	export let baseDictionary = new SingleConfigDict(ConfigKeys.official_dict);

	let broker = new DictBroker([
		userDictionary,
		baseDictionary
	]);

	export function getTranslation(tag:string):string {
		return broker.get(tag);
	}

	let ghPath = 'pixiv-assistant/dictionary'
	export function updateAvailable(callback:(available:boolean) => any) {
		ghUtils.getMasterCommit(ghPath, commitHash => {
			let currentHash = Config.get(ConfigKeys.official_dict_hash);
			callback(!currentHash || currentHash !== commitHash);
		});
	}

	export function updateDictionary(onComplete?:()=>any) {
		ghUtils.getMasterCommit(ghPath, commitHash => {
			ghUtils.getDictionaryObject(ghPath, commitHash, obj => {
				Config.set(ConfigKeys.official_dict, obj);
				if(onComplete){
					onComplete();
				}
			})
		});
	}
}

import IConfig from '../../src/IConfig'

type potentialData = boolean|string|number|Object

interface configValue {
	data: potentialData
}

export default class Config implements IConfig {
	public keys():string[] {
		return GM_listValues();
	}

	public get(key:string):potentialData {
		let value = GM_getValue(key);
		if(value){
			return JSON.parse(value).data;
		}
		return undefined;
	}

	public set(key:string, value:potentialData) {
		GM_setValue(key, JSON.stringify({data: value})); 
	}
}

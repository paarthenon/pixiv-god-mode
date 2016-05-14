import IConfig from '../../src/core/IConfig'

type potentialData = boolean|string|number|Object

interface configValue {
	data: potentialData
}

export default class Config implements IConfig {
	public keys():Promise<string[]> {
		return Promise.resolve(GM_listValues());
	}

	public get(key:string):Promise<potentialData> {
		let value = GM_getValue(key);
		if(value){
			return Promise.resolve(JSON.parse(value).data);
		}
		return Promise.resolve(undefined);
	}

	public set(key:string, value:potentialData) {
		GM_setValue(key, JSON.stringify({data: value}));
		return Promise.resolve();
	}
}

type potentialData = string|number|Object

interface configValue {
	data: potentialData
}

export default class Config {
	public static get Keys():string[] {
		return GM_listValues();
	}

	public static get(key:string):potentialData {
		let value = GM_getValue(key);
		if(value){
			return JSON.parse(value).data;
		}
		return undefined;
	}

	public static set(key:string, value:potentialData) {
		GM_setValue(key, JSON.stringify({data: value})); 
	}
}

import IConfig from '../../src/IConfig'

type potentialData = boolean|string|number|Object

interface configValue {
	data: potentialData
}

export default class Config implements IConfig {
	public keys():Q.IPromise<string[]> {
		return Q(GM_listValues());
	}

	public get(key:string):Q.IPromise<potentialData> {
		let value = GM_getValue(key);
		if(value){
			return Q(JSON.parse(value).data);
		}
		return Q(undefined);
	}

	public set(key:string, value:potentialData) {
		GM_setValue(key, JSON.stringify({data: value}));
		let q = Q.defer<void>();
		q.resolve();
		return q.promise;
	}
}

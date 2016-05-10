import IConfig from '../../src/IConfig'

type potentialData = boolean|string|number|Object

interface configValue {
	data: potentialData
}

function handleError<T>(value: T) {
	return new Promise((resolve, reject) => {
		if (!chrome.runtime.lastError) {
			resolve(value);
		} else {
			reject(chrome.runtime.lastError.message);
		}
	});
	
}

export default class Config implements IConfig {
	public keys():Promise<string[]> {
		return new Promise(resolve => {
			chrome.storage.local.get(null, contents => resolve(handleError(Object.keys(contents))));
		});
	}

	public get(key:string):Promise<potentialData> {
		return new Promise(resolve => 
			chrome.storage.local.get(key, contents => resolve(handleError(JSON.parse(contents[key]).data)))
		);
	}

	public set(key:string, value:potentialData) {
		return new Promise<void>(resolve => 
			chrome.storage.local.set({ [key]: value }, () => resolve(
				handleError(undefined).then(()=>Promise.resolve())) // necessary to return Promise<void>
			)
		);
	}
}

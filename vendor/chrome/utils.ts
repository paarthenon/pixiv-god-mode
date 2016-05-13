import {potentialData as IConfigValue} from '../../src/IConfig'

export function getFromConfig(key: string): Promise<{[key:string]:IConfigValue}> {
	return new Promise(resolve =>
		chrome.storage.local.get(key, contents => resolve(contents)));
}
export function handleError<T>(value: T):Promise<T> {
	return new Promise((resolve, reject) => {
		if (!chrome.runtime.lastError) {
			resolve(value);
		} else {
			reject(chrome.runtime.lastError.message);
		}
	});
}
import {potentialData as IConfigValue} from '../../src/core/IConfig'

export function getFromConfig(key: string): Promise<{[key:string]:IConfigValue}> {
	return new Promise(resolve =>
		chrome.storage.local.get(key, contents => resolve(contents)));
}

export function setConfig(key:string, value: any): Promise<void> {
	return new Promise<void>(resolve =>
		chrome.storage.local.set({ [key]: value }, () => resolve()));
}

export function listConfigKeys() : Promise<string[]> {
	return new Promise(resolve =>
		chrome.storage.local.get(null, contents => resolve(Object.keys(contents))));
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

export function queryTabs(obj:chrome.tabs.QueryInfo) : Promise<chrome.tabs.Tab[]> {
	return new Promise((resolve, reject) => {
		chrome.tabs.query(obj, result => resolve(result));
	});
}

export function getCurrentTab() {
	return queryTabs({ active: true, currentWindow: true })
		.then(tabs => tabs[0]);
}

export function newTab(url:string) {
	return new Promise<void>(resolve => chrome.tabs.create({url}, tab => resolve()));
}
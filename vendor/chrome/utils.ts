import {potentialData as IConfigValue} from 'src/core/IConfig'

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
		chrome.storage.local.get({}, contents => resolve(Object.keys(contents))));
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
	return new Promise(resolve => {
		chrome.tabs.query(obj, result => resolve(result));
	});
}

export function getCurrentTab() {
	return queryTabs({ active: true, currentWindow: true })
		.then(tabs => tabs[0]);
}

export function newTab(url:string, background?:boolean) {
	return new Promise(resolve => chrome.tabs.create({url, active: !background}, resolve));
}

export function isPageBookmarked(url:string) {
	return new Promise<boolean>(resolve => chrome.bookmarks.search({url}, results => resolve(results.length > 0)));
}
export function download(data:string, filename:string) {
	chrome.downloads.download({url:data, filename, saveAs: true});
	return Promise.resolve(true);
}
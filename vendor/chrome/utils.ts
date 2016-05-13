export function getFromConfig(key: string): Promise<{[key:string]:any}> {
	return new Promise(resolve =>
		chrome.storage.local.get(key, contents => resolve(contents)));
}
export function handleError<T>(value: T) {
	return new Promise((resolve, reject) => {
		if (!chrome.runtime.lastError) {
			resolve(value);
		} else {
			reject(chrome.runtime.lastError.message);
		}
	});
}
import {Action, OnLoadFunc} from '../actionModel'

//TODO: Do away with the global cache registry and instead adopt the model from pixiv-assistant-server
export module CacheRegistry {
	export var registeredActionCache: { [id: string]: Action[] } = {};
	export var onLoadFunctionCache: { [id: string]: OnLoadFunc[] } = {};
}

export function pushToArrayCache<T>(cache: { [id: string]: T[] }, key: string, value: T) {
	let arr = cache[key];
	if (arr) {
		arr.push(value);
	} else {
		arr = [value];
	}
	cache[key] = arr;
}

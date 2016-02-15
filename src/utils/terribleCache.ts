import {Action} from '../actionModel'

export module CacheRegistry {
	export var registeredActionCache: { [id: string]: Action[] } = {};
	export var onLoadFunctionCache: { [id: string]: (() => void)[] } = {};
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

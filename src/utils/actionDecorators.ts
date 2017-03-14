import {OnLoadFunc} from 'src/core/IAction'
import {BasePage} from 'src/pages/base'

import {CacheRegistry, pushToArrayCache} from 'src/utils/terribleCache'

import {Container as Deps} from 'src/deps'

export function ExecuteIf(predicate:() => boolean | Promise<boolean>) {
	return (target: BasePage, _propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => {
		let name = (<any>target)['constructor']['name'];
		
		let onload = {
			'if': predicate,
			execute: descriptor.value
		};
		
		pushToArrayCache<OnLoadFunc>(CacheRegistry.onLoadFunctionCache, name, onload);
		return descriptor;
	}
}

export var ExecuteOnLoad = ExecuteIf(() => true);
export var ExecuteIfSetting = (key:string) => ExecuteIf(() => Deps.getSetting(key));
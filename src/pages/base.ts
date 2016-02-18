import {log} from '../utils/log'
import {Action, ActionDescriptor, OnLoadFunc} from '../actionModel'

import {CacheRegistry} from '../utils/terribleCache'

export class BasePage {
	public get actionCache():Action[] {
		let name = (<any>this)['constructor']['name'];
		let cache = CacheRegistry.registeredActionCache[name] || [];
		return cache.filter(action => (!action.if) || action.if.call(this));
	}
	protected get onLoadFunctions():OnLoadFunc[] {
		let name = (<any>this)['constructor']['name'];
		let cache = CacheRegistry.onLoadFunctionCache[name] || [];
		return cache.filter(func => func.if.call(this));
	}

	constructor(
		protected path:string,
		protected jQuery:JQueryStatic
	) {
		// Need to bind these functions to the 'this' object, they were stored at design time
		// when no instance existed
		this.actionCache.forEach(action => action.execute = action.execute.bind(this));
		this.onLoadFunctions.forEach(f => f.execute.call(this));
	}
}


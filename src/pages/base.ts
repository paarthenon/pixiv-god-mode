import {log} from '../utils/log'
import {Action, ActionDescriptor} from '../actionModel'

import {CacheRegistry} from '../utils/terribleCache'

export class BasePage {
	public get actionCache():Action[] {
		let name = (<any>this)['constructor']['name'];
		return CacheRegistry.registeredActionCache[name] || [];
	}
	protected get onLoadFunctions():(()=>void)[] {
		let name = (<any>this)['constructor']['name'];
		return CacheRegistry.onLoadFunctionCache[name] || [];
	}

	constructor(
		protected path:string,
		protected jQuery:JQueryStatic
	) {
		// Need to bind these functions to the 'this' object, they were stored at design time
		// when no instance existed
		this.actionCache.forEach(action => action.execute = action.execute.bind(this));
		this.onLoadFunctions.forEach(func => func.call(this));
	}
}


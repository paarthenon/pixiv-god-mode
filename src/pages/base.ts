import {Action, ActionDescriptor, OnLoadFunc} from 'src/core/IAction'

import {CacheRegistry} from 'src/utils/terribleCache'

export class BasePage {
	public get actionCache():Action[] {
		let name = (<any>this)['constructor']['name'];
		let cache = CacheRegistry.registeredActionCache[name] || [];
		// return cache.filter(action => (!action.if) || action.if.call(this));
		return cache;
	}
	protected get onLoadFunctions():OnLoadFunc[] {
		let name = (<any>this)['constructor']['name'];
		let cache = CacheRegistry.onLoadFunctionCache[name] || [];
		// return cache.filter(func => func.if.call(this));
		return cache;
	}

	constructor(
		protected path:string,
	) {
		// Need to bind these functions to the 'this' object, they were stored at design time
		// when no instance existed

		//TODO: Does this make sense for action cache?
		this.actionCache.forEach(action => {
			Promise.resolve(action.if).then((predicateResult) => {
				if(predicateResult) {
					action.execute = action.execute.bind(this);
				}
			})
		});
		this.onLoadFunctions.forEach(f => {
			Promise.resolve(f.if.call(this)).then((predicateResult) => {
				if(predicateResult){
					f.execute.call(this);
				}
			});
		});
	}
}


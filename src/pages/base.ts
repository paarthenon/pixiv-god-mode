import 'reflect-metadata'
import {log} from '../utils/log'
import {Action, ActionDescriptor} from '../actionModel'

export class BasePage {
	public get actionCache():Action[] {
		return Reflect.getMetadata('custom:page-action-cache', this) || [];
	}
	protected get onLoadFunctions():(()=>void)[] {
		return Reflect.getMetadata('custom:page-on-load-functions', this) || [];
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


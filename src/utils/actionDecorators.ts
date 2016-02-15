import {ActionDescriptor, Action} from '../actionModel'
import {BasePage} from '../pages/base'

import {CacheRegistry, pushToArrayCache} from './terribleCache'

export function RegisteredAction(desc:ActionDescriptor) {
	return (target: BasePage, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => {
		let newDesc = <any>desc;
		newDesc.execute = descriptor.value;

		let name = (<any>target)['constructor']['name'];

		pushToArrayCache(CacheRegistry.registeredActionCache, name, <Action>newDesc);
		return descriptor;
	}
}

export function ExecuteOnLoad(target: BasePage, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) {
	let name = (<any>target)['constructor']['name'];

	pushToArrayCache(CacheRegistry.onLoadFunctionCache, name, descriptor.value);
	return descriptor;
}

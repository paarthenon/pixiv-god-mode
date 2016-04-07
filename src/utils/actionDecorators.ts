import {ActionDescriptor, Action, OnLoadFunc} from '../actionModel'
import {BasePage} from '../pages/base'

import {CacheRegistry, pushToArrayCache} from './terribleCache'

import * as log4js from 'log4js'
let logger = log4js.getLogger('Decorators');

export function RegisteredAction(desc:ActionDescriptor) {
	return (target: BasePage, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => {
		let newDesc = <any>desc;
		newDesc.execute = descriptor.value;

		let name = (<any>target)['constructor']['name'];

		logger.trace(`Registered Action | registering function ${propertyKey} for ${name}`);
		pushToArrayCache(CacheRegistry.registeredActionCache, name, <Action>newDesc);
		return descriptor;
	}
}

export function ExecuteIf(predicate:() => boolean) {
	return (target: BasePage, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => {
		let name = (<any>target)['constructor']['name'];
		
		let onload = {
			'if': predicate,
			execute: descriptor.value
		};
		
		logger.trace(`ExecuteIf | registering function ${propertyKey} for ${name}`);
		pushToArrayCache<OnLoadFunc>(CacheRegistry.onLoadFunctionCache, name, onload);
		return descriptor;
	}
}

export var ExecuteOnLoad = ExecuteIf(() => true);

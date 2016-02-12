import {ActionDescriptor, Action} from '../actionModel'
import {BasePage} from '../pages/base'
import * as ReflectExt from './reflect'


export function RegisteredAction(desc:ActionDescriptor) {
	return (target: BasePage, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => {
		let newDesc = <any>desc;
		newDesc.execute = descriptor.value;

		ReflectExt.pushToMetadata('custom:page-action-cache', <Action>newDesc, target);
		return descriptor;
	}
}

export function ExecuteOnLoad(target: BasePage, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) {
	ReflectExt.pushToMetadata('custom:page-on-load-functions', descriptor.value, target);
	return descriptor;
}

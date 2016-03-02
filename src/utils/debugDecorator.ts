import {BasePage} from '../pages/base'
import {addToDebug} from '../debug'

export function Debug (target: BasePage, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) {
	let name = (<any>target)['constructor']['name'];
	addToDebug(name, descriptor.value);
}
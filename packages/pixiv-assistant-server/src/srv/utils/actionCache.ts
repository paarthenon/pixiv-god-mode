import * as underscore from 'underscore'

type FunctionMap = { [id: string]: Function };

export class ActionCache {
	protected actions :FunctionMap = {};

	public get registry() {
		return this.actions;
	}

	public bind(actualThis: Object) {
		this.actions = underscore.mapObject(this.actions, val => val.bind(actualThis));
	}

	public register(name: string) {
		return (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => {
			this.actions[name] = descriptor.value;
			return descriptor;
		}
	}
}

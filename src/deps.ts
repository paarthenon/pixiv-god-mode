import IConfig from './IConfig'

export interface IDependencyContainer {
	jQ: JQueryStatic
	config: IConfig
}

export var Container: IDependencyContainer = {
	jQ: $,
	config: undefined
}

declare var cloneInto: Function;
export function inject(f: Function){
	return cloneInto(f, unsafeWindow, { cloneFunctions: true });
}
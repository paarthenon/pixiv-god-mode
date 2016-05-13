import IConfig from './IConfig'

export interface IDependencyContainer {
	jQ: JQueryStatic
	config: IConfig
	openInTab: (url: string) => void
	execOnPixiv: (func:Function) => Promise<any>
}

export var Container: IDependencyContainer = {
	jQ: $,
	config: undefined,
	openInTab: undefined,
	execOnPixiv: undefined
}

export function load(deps:IDependencyContainer) {
	Container = deps;
}

declare var cloneInto: Function;
export function inject(f: Function){
	return cloneInto(f, unsafeWindow, { cloneFunctions: true });
}
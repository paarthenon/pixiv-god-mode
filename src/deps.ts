import IConfig from './IConfig'

export interface IDependencyContainer {
	jQ: JQueryStatic
	config: IConfig
	openInTab: (url: string) => void
}

export var Container: IDependencyContainer = {
	jQ: $,
	config: undefined,
	openInTab: undefined
}

declare var cloneInto: Function;
export function inject(f: Function){
	return cloneInto(f, unsafeWindow, { cloneFunctions: true });
}
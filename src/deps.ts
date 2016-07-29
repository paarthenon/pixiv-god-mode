import IConfig from './core/IConfig'
import {AjaxRequest} from './core/IAjax'

export interface IDependencyContainer {
	jQ: JQueryStatic
	config: IConfig
	openInTab: (url: string) => void
	execOnPixiv: (func:(pixiv:any, props:any)=>any, props?:any) => Promise<any>
	ajaxCall: <T, V> (req: AjaxRequest<T>) => Promise<V>
}

export var Container: IDependencyContainer = {
	jQ: $,
	config: undefined,
	openInTab: undefined,
	execOnPixiv: undefined,
	ajaxCall: undefined
}

export function load(deps:IDependencyContainer) {
	Container = deps;
}

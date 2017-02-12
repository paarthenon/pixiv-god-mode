import IConfig from 'src/core/IConfig'
import {AjaxRequest} from 'src/core/IAjax'

/**
 * Another instance of something kind of stupid that works well enough for now. Abstracts out any browser-specific
 * functionality in case we decide on ~world domination~ multi-browser support.
 */
export interface IDependencyContainer {
	config: IConfig
	openInTab: (url: string) => void
	execOnPixiv: <T> (func:(pixiv:any, props:T)=>any, props?:T) => Promise<any>
	ajaxCall: <T, V> (req: AjaxRequest<T>) => Promise<V>
	getSetting: (settingKey: string) => Promise<boolean>
	isPageBookmarked: (url:string) => Promise<boolean>
	download: (url:string, filename:string) => Promise<boolean>
}

export var Container: IDependencyContainer = {
	config: undefined,
	openInTab: undefined,
	execOnPixiv: undefined,
	ajaxCall: undefined,
	getSetting: undefined,
	isPageBookmarked: undefined,
	download: undefined,
}

export function load(deps:IDependencyContainer) {
	Container = deps;
}

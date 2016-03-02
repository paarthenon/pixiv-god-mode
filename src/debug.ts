import {BasePage} from './pages/base'

/* This hosts the debug module, this object will be attached wholesale to the window object */

export function addToDebug(page:string, f:Function) {
	if (!Debug.pageFunctions[page]) {
		Debug.pageFunctions[page] = [];
	}
	Debug.pageFunctions[page].push(f);
}

module Debug {
	export var pageFunctions: {[id:string]:Function[]} = {}

	export var page:BasePage = undefined;
}

export default Debug;
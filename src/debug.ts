import {BasePage} from './pages/base'
import * as services from './services'

/* This hosts the debug module, this object will be attached wholesale to the window object */

module Debug {
	export var page:BasePage = undefined;
	export var services: any = services;
}

export default Debug;
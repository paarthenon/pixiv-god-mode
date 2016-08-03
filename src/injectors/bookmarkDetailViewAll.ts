import * as React from 'react'
import * as ReactDOM from 'react-dom'

import * as services from '../services'
import {Model} from '../../common/proto'
import {BookmarkDetailViewButton} from '../components/bookmarkDetailViewButton'
import {GenerateElement} from './utils'
import * as log4js from 'log4js'

let logger = log4js.getLogger("Navbar Right Button")

export function injectViewAllButton($:JQueryStatic, text:string, clickAction:Function) {
	logger.debug('Injecting view all button');

	let component = GenerateElement(React.createElement(BookmarkDetailViewButton, {text, clickAction}), $);
	
	$(component).insertBefore('#enable-auto-view');
}

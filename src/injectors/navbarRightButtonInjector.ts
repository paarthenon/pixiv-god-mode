import * as React from 'react'
import * as ReactDOM from 'react-dom'

import * as services from '../services'
import {Model} from '../../common/proto'
import {WorksNavbarRightButton} from '../components/openInTabs'

import * as log4js from 'log4js'

let logger = log4js.getLogger("Navbar Right Button")

export function injectNavbarRightButton($:JQueryStatic, text:string, clickAction:Function) {
	logger.debug('Injecting open tabs button');
	
	let elem = $('<div></div>')[0];
	ReactDOM.render(React.createElement(WorksNavbarRightButton, {text, clickAction}), elem);
	let component = $(elem).children().first()[0];
	$('nav.column-menu').append(component);
}

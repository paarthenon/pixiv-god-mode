import * as React from 'react'
import * as ReactDOM from 'react-dom'

import * as services from '../services'
import {Model} from '../../common/proto'
import {WorksNavbarRightButton} from '../components/worksNavigationRightButton'
import {GenerateElement} from './utils'
import * as log4js from 'log4js'

let logger = log4js.getLogger("Open In Tabs")

export function injectOpenInTabs($:JQueryStatic, text:string, clickAction:Function) {
	logger.debug('Injecting open tabs button');

	let component = GenerateElement(React.createElement(WorksNavbarRightButton, {text, clickAction}), $);
	
	$('nav.column-menu').append(component);
}

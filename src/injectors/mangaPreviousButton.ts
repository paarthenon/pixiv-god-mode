import * as React from 'react'
import * as ReactDOM from 'react-dom'

import * as services from '../services'
import {Model} from '../../common/proto'
import {ToolmenuButton} from '../components/toolmenuButton'
import {GenerateElement} from './utils'
import * as log4js from 'log4js'

let logger = log4js.getLogger("Manga Previous Button")

export function injectMangaPreviousButton($:JQueryStatic, clickAction:Function) {
	logger.debug('Injecting previous button');

	let component = GenerateElement(React.createElement(ToolmenuButton, {text: '⯇', tooltip: 'Previous Page', clickAction}), $);
	
	$(component).insertBefore($('#back-to-top'));
}

import * as React from 'react'
import * as ReactDOM from 'react-dom'

import * as services from '../services'
import {Model} from '../../common/proto'
import {TagTrigger} from '../components/tagAugment'
import {GenerateElement} from './utils'
import * as log4js from 'log4js'

let logger = log4js.getLogger("Navbar Right Button")

export function injectTagAugmentation($:JQueryStatic, elem:JQuery) {
	logger.debug('Injecting tag augment');

	let component = GenerateElement(React.createElement(TagTrigger), $);
	
	$(elem).append(component);
}

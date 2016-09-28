import * as React from 'react'
import * as ReactDOM from 'react-dom'

import * as services from 'src/services'
import {Model} from 'common/proto'
import {ToolmenuButton} from 'src/components/toolmenuButton'
import {GenerateElement} from 'src/injectors/utils'
import * as log4js from 'log4js'

let logger = log4js.getLogger("Manga Previous Button")

export function injectMangaPreviousButton($:JQueryStatic, clickAction:Function) {
	logger.debug('Injecting previous button');

	let component = GenerateElement(React.createElement(ToolmenuButton, {text: '⯇', tooltip: 'Previous Page', clickAction}), $);
	
	$(component).insertBefore($('#back-to-top'));
}

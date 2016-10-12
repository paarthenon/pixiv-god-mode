import * as $ from 'jquery'
import * as React from 'react'
import * as ReactDOM from 'react-dom'

import * as services from 'src/services'
import {Model} from 'common/proto'
import {ToolmenuButton} from 'src/components/toolmenuButton'
import {GenerateElement} from 'src/injectors/utils'

export function injectMangaPreviousButton(clickAction:Function) {
	let component = GenerateElement(React.createElement(ToolmenuButton, {icon: 'glyphicon-chevron-left', tooltip: 'Previous Page', clickAction}));
	$(component).insertBefore($('#back-to-top'));
}

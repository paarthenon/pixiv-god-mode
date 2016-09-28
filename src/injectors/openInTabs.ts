import * as React from 'react'
import * as ReactDOM from 'react-dom'

import * as services from 'src/services'
import {Model} from 'common/proto'
import {WorksNavbarRightButton} from 'src/components/worksNavigationRightButton'
import {GenerateElement} from 'src/injectors/utils'

export function injectOpenInTabs($:JQueryStatic, text:string, clickAction:Function) {
	let component = GenerateElement(React.createElement(WorksNavbarRightButton, {text, clickAction}), $);
	$('nav.column-menu').append(component);
}

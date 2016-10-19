import * as $ from 'jquery'
import * as React from 'react'

import {WorksNavbarRightButton} from 'src/components/worksNavigationRightButton'
import {GenerateElement} from 'src/injectors/utils'

export function injectOpenInTabs(clickAction:Function) {
	let component = GenerateElement(React.createElement(WorksNavbarRightButton, {text: 'Open in Tabs', clickAction}));
	$('nav.column-menu').append(component);
}

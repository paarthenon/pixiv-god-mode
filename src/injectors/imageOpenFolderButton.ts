import * as $ from 'jquery'
import * as React from 'react'
import * as ReactDOM from 'react-dom'

import * as services from 'src/services'
import {ImageOpenFolderButton} from 'src/components/imageOpenFolderButton'
import {GenerateElement} from 'src/injectors/utils'

export function injectImageOpenFolderButton(openFunc:() => Promise<void>)  {
	let component = GenerateElement(React.createElement(ImageOpenFolderButton, {openFunc}));
	$(component).insertAfter('.works_display');
}

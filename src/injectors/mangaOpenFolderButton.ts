import * as $ from 'jquery'
import * as React from 'react'

import {ToolmenuButton} from 'src/components/toolmenuButton'
import {GenerateElement} from 'src/injectors/utils'

export function injectMangaOpenFolderButton(clickAction:Function) {
	let component = GenerateElement(React.createElement(ToolmenuButton, {icon: 'glyphicon-folder-open', tooltip: 'Open Folder', clickAction}));
	$(component).insertBefore($('#back-to-top'));
}

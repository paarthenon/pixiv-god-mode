import * as $ from 'jquery'
import * as React from 'react'

import {ToolmenuButton} from 'src/components/toolmenuButton'
import {GenerateElement} from 'src/injectors/utils'

export function injectMangaDownloadLocalButton(clickAction:Function) {
	let component = GenerateElement(React.createElement(ToolmenuButton, {icon: 'glyphicon-floppy-disk', tooltip: 'Download Manga (browser)', clickAction}));
	$(component).insertBefore($('#back-to-top'));
}

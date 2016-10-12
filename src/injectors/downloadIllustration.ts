import * as React from 'react'
import * as ReactDOM from 'react-dom'

import * as services from 'src/services'
import {Model} from 'common/proto'
import {DownloadButtonContainer} from 'src/components/downloadButton'
import {GenerateElement} from 'src/injectors/utils'

export function injectDownloadIllustrationButton($:JQueryStatic, existsFunc: () => Promise<boolean>, downloadFunc:() => Promise<void>)  {
	let component = GenerateElement(React.createElement(DownloadButtonContainer, {existsFunc, downloadFunc}), $);
	$(component).insertAfter('.works_display');
}

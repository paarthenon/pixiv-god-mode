import * as React from 'react'
import * as ReactDOM from 'react-dom'

import * as services from '../services'
import {Model} from '../../common/proto'
import {DownloadButtonContainer} from '../components/downloadButton'
import {GenerateElement} from './utils'
import * as log4js from 'log4js'

let logger = log4js.getLogger("Download Illustration Button")

export function injectDownloadIllustrationButton($:JQueryStatic, existsFunc: () => Promise<boolean>, downloadFunc:() => Promise<void>)  {
	logger.debug('Injecting download illustration button');

	let component = GenerateElement(React.createElement(DownloadButtonContainer, {existsFunc, downloadFunc}), $);

	$('div.bookmark-container').append(component);
}

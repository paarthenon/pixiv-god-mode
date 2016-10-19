import * as $ from 'jquery'
import * as React from 'react'
import * as ReactDOM from 'react-dom'

import * as services from 'src/services'
import {Model} from 'common/proto'
import {IllustrationToolbarContainer, IllustrationToolbarContainerProps} from 'src/components/illustrationToolbar'
import {GenerateElement} from 'src/injectors/utils'

export function injectIllustrationToolbar(props:IllustrationToolbarContainerProps) {
	let component = GenerateElement(React.createElement(IllustrationToolbarContainer, props));
	$(component).insertAfter('.works_display');
}

import * as React from 'react'
import * as ReactDOM from 'react-dom'

import * as services from 'src/services'
import {Model} from 'common/proto'
import {BookmarkDetailViewButton} from 'src/components/bookmarkDetailViewButton'
import {GenerateElement} from 'src/injectors/utils'

export const ViewAllButtonElementId = 'pixiv-assistant-view-all-button';
export function injectViewAllButton($:JQueryStatic, text:string, clickAction:Function) {
	let component = GenerateElement(React.createElement(BookmarkDetailViewButton, {text, clickAction, id: ViewAllButtonElementId}), $);
	$(component).insertBefore('#enable-auto-view');
}

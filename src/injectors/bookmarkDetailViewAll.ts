import * as $ from 'jquery'
import * as React from 'react'

import {BookmarkDetailViewButton} from 'src/components/bookmarkDetailViewButton'
import {GenerateElement} from 'src/injectors/utils'

export const ViewAllButtonElementId = 'pixiv-assistant-view-all-button';
export function injectViewAllButton(text:string, clickAction:Function) {
	let component = GenerateElement(React.createElement(BookmarkDetailViewButton, {text, clickAction, id: ViewAllButtonElementId}));
	$(component).insertBefore('#enable-auto-view');
}

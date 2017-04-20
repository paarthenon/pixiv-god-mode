import * as $ from 'jquery'
import * as React from 'react'
import * as ReactDOM from 'react-dom'

import {PixivAssistantServer} from 'src/services'
import {Model} from 'pixiv-assistant-common'
import {UserRelationButton} from 'src/components/userRelationButton'

export function injectUserRelationshipButton(artist:Model.Artist) {
	let elem = $('<li></li>')[0];
	ReactDOM.render(React.createElement(UserRelationButton, {text: 'Open Folder', clickAction: () => PixivAssistantServer.openFolder(artist)}), elem);
	$('ul.user-relation').append(elem);
}

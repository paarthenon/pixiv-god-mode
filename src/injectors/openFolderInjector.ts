import * as React from 'react'
import * as ReactDOM from 'react-dom'

import * as services from '../services'
import {Model} from '../../common/proto'
import {UserRelationButton} from '../components/userRelationButton'

export function injectUserRelationshipButton($:JQueryStatic, artist:Model.Artist) {
	let elem = $('<li></li>')[0];
	ReactDOM.render(React.createElement(UserRelationButton, {text: 'Open Folder', clickAction: () => services.openFolder(artist)}), elem);
	$('ul.user-relation').append(elem);
}

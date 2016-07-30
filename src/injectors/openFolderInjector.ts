import * as React from 'react'
import * as ReactDOM from 'react-dom'

import * as services from '../services'
import {Model} from '../../common/proto'
import {UserRelationButton} from '../components/userRelationButton'

import * as log4js from 'log4js'

let logger = log4js.getLogger("Open Folder Injector")

export function injectUserRelationshipButton($:JQueryStatic, artist:Model.Artist) {
	logger.debug('Injecting open folder button');
	
	let elem = $('<li></li>')[0];
	ReactDOM.render(React.createElement(UserRelationButton, {text: 'Open Folder', clickAction: () => services.openFolder(artist)}), elem);
	$('ul.user-relation').append(elem);
}

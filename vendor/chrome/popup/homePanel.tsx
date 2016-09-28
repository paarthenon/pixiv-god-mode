import * as React from 'react'
import * as Bootstrap from 'react-bootstrap'
import * as log4js from 'log4js'

import {DictionaryAdd} from 'vendor/chrome/popup/components/DictionaryAdd'
import {ActionContainer} from 'vendor/chrome/popup/pageActions'
import {AlertsDisplay} from 'vendor/chrome/popup/alerts'
import {DictionaryService} from 'vendor/chrome/popup/services'

let logger = log4js.getLogger('HomePanel');

export class HomePanel extends React.Component<any,any> {
	public render() {
		let style = {
			flex: 1,
			display: 'flex',
			'flex-direction': 'column',
		}
		let mainStyle = {
			flex: 1,
		}
		return (
			<div style={style}>
				<main style={mainStyle}>
					<DictionaryAdd 
						onAdd={(key,value) => DictionaryService.update(key, value)}
						getTranslation={key => DictionaryService.getTranslation(key)}
					/>
					<ActionContainer />
				</main>
				<footer><AlertsDisplay /></footer>
			</div>
			);
	}
}

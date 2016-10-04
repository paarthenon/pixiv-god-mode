import * as React from 'react'
import * as Bootstrap from 'react-bootstrap'

import {DictionaryAdd} from 'vendor/chrome/popup/components/DictionaryAdd'
import {ActionContainer} from 'vendor/chrome/popup/pageActions'
import {AlertsDisplay} from 'vendor/chrome/popup/alerts'
import {DictionaryService} from 'vendor/chrome/popup/services'
import {PageBasedSettings} from 'vendor/chrome/popup/settingsPanel'

import Mailman from 'vendor/chrome/mailman'

export class HomePanel extends React.Component<any,{pageName:string}> {
	state = {pageName: ''};
	public componentWillMount() {
		Mailman.ContentScript.getName().then(pageName => {
			this.setState({pageName});
		})
	}
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
					<Bootstrap.Row>
						<Bootstrap.Col xs={6}>
							<ActionContainer/>
						</Bootstrap.Col>
						<Bootstrap.Col xs={6}>
							<Bootstrap.Panel>
								<PageBasedSettings pageName={this.state.pageName} />
							</Bootstrap.Panel>
						</Bootstrap.Col>
					</Bootstrap.Row>
				</main>
				<footer><AlertsDisplay /></footer>
			</div>
			);
	}
}

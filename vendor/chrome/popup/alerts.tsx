import * as React from 'react'
import * as Bootstrap from 'react-bootstrap'

import {ConditionalRender} from './components/conditionalRender'
import {Config, PixivAssistantServer} from './services'
import ConfigKeys from '../../../src/configKeys'
import {getSetting} from '../userSettings'
import SettingKeys from '../../../src/settingKeys'

let stackedAlertStyle = {
	'margin-bottom': '0px',
	'margin-top': '10px'
}
export class AlertsDisplay extends React.Component<void, any> {
	public render() {
		return <div>
			<ConditionalRender predicate={() => 
				Config.get(ConfigKeys.server_url)
					.then(url => !url)
					.catch(() => true)
			}>
				<ServerAlert />
			</ConditionalRender>
			<ConditionalRender default={true} predicate={() =>
				getSetting(SettingKeys.general.disableServerConnectionAlert)
					.then(disable => {
						if (!disable) {
							return PixivAssistantServer.ping().then(() => false).catch(() => true)
						}
					})
			}>
				<ServerConnectionAlert />
			</ConditionalRender>
			<ConditionalRender predicate={() =>
				PixivAssistantServer.ping().then(() => true).catch(() => false)
			}>
				<ServerConnectionSuccessAlert />
			</ConditionalRender>
			<ConditionalRender predicate={() =>
				Config.get(ConfigKeys.official_dict)
					.then(dict => !dict || Object.keys(dict).length === 0)
					.catch(() => true)
			}>
				<GlobalDictionaryEmptyAlert />
			</ConditionalRender>
		</div>;
	}
}


export class ServerAlert extends React.Component<void, void> {
	public render() {
		return <Bootstrap.Alert bsStyle="warning" style={stackedAlertStyle}>
			There is no server url registered.
		</Bootstrap.Alert>
	}
}

export class ServerConnectionAlert extends React.Component<void, void> {
	public render() {
		return <Bootstrap.Alert bsStyle="warning" style={stackedAlertStyle}>
			Unable to connect to server.
		</Bootstrap.Alert>
	}
}

export class ServerConnectionSuccessAlert extends React.Component<void, void> {
	public render() {
		return <Bootstrap.Alert bsStyle="success" style={stackedAlertStyle}>
			Connected to Server
		</Bootstrap.Alert>
	}
}

export class GlobalDictionaryEmptyAlert extends React.Component<void, void> {
	public render() {
		return <Bootstrap.Alert bsStyle="warning" style={stackedAlertStyle}>
			Your global dictionary is empty. Please go to the settings and update it.
		</Bootstrap.Alert>
	}
}

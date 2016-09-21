import * as React from 'react'
import * as Bootstrap from 'react-bootstrap'
import * as log4js from 'log4js'

import {PixivAssistantServer} from './services'

let logger = log4js.getLogger('Server Status Panel');


interface ServerStatus {
	connected? :boolean
	features :string[]
}

export class ServerStatusPanel extends React.Component<any,ServerStatus> {
	state :ServerStatus = { connected: undefined, features: [] };
	componentDidMount() {
		PixivAssistantServer.ping()
			.then(() => true)
			.catch(() => false)
			.then(pingResponse => {
				PixivAssistantServer.supportedFeatures().then(features => {
					this.setState({connected: pingResponse, features});
				})
			});
	}
	public render() {
		return <ServerStatusView connected={this.state.connected} features={this.state.features} />
	}
}

export class ServerStatusView extends React.Component<ServerStatus, void> {
	public handleExecute() {
	}
	public render() {
		return <div>
				<p>Connected: {(this.props.connected == undefined)? 'loading' : this.props.connected.toString()}</p>
				<p>Features</p>
				<ul>
					{this.props.features.map(feature => <li key={feature}>{feature}</li>)}
				</ul>
			</div>;
	}
}

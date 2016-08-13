import * as React from 'react'
import * as Bootstrap from 'react-bootstrap'
import * as log4js from 'log4js'

import Mailman from '../mailman'
import Config from '../config'
import {Action} from '../../../src/core/IAction'
import {PAServer} from '../../../src/core/paServer'

let logger = log4js.getLogger('ActionPanel');

export class ServerStatusPanel extends React.Component<any,ServerStatus> {
	constructor() {
		super();
		this.state = { connected: undefined, features: []};

		let server = new PAServer(new Config(), Mailman.Background.ajax);
		server.ping()
			.then(() => true)
			.catch(() => false)
			.then(pingResponse => {
				server.supportedFeatures().then(features => {
					this.setState({connected: pingResponse, features});
				})
			});
	}
	public render() {
		return <ServerStatusView connected={this.state.connected} features={this.state.features} />
	}
}

interface ServerStatus {
	connected? :boolean
	features :string[]
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

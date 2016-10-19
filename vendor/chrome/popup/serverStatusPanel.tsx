import * as React from 'react'

import {PixivAssistantServer} from 'vendor/chrome/services'

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

export const ServerStatusView : React.StatelessComponent<ServerStatus> = props =>
	<div>
		<p>Connected: {(props.connected == undefined)? 'loading' : props.connected.toString()}</p>
		<p>Features</p>
		<ul>
			{props.features.map(feature => <li key={feature}>{feature}</li>)}
		</ul>
	</div>;

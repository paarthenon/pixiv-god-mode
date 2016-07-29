import * as React from 'react'

import Mailman from '../mailman'

export class ConfigPanel extends React.Component<any,{items: {key:string, value:string}[]}> {
	constructor() {
		super();
		this.state = { items: [] };
		Mailman.Background.listConfig()
			.then(configKeys => Promise.all<{key:string;value:string}>(configKeys.map(key =>
				Mailman.Background.getConfig({ key })
					.then(resp => JSON.stringify(resp.value))
					.then(value => ({ key, value }))
			)))
			.then(entries => {
				this.setState({ items: entries })
			});
	}
	public render() {
		return (
			<div>
				<p> Config keys: {this.state.items.length}</p>
				{this.state.items.map(item => <ConfigEntry key={item.key} configKey={item.key} configValue={item.value} />)}
			</div>
			);
	}
}

export class ConfigEntry extends React.Component<{configKey:string, configValue:string}, void> {
	public render() {
		return <div>
				<span>{this.props.configKey}|</span>
				<span>{this.props.configValue}</span>
			</div>;
	}
}

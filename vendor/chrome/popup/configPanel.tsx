import * as React from 'react'

import Mailman from '../mailman'

export class ConfigPanel extends React.Component<any,{items: {key:string, value:string}[]}> {
	protected style = {
		width: '700px',
		height: '500px',
		background: '#eeee',
		zIndex: 100
	};

	constructor() {
		super();
		this.state = { items: [] };

		// Need to do this absurd reduce instead of Promise.all because the definition seems to be broken.
		Mailman.listConfig()
			.then(configKeys => configKeys.reduce((acc,key, x, y) =>
				acc.then((arr:any[]) => arr.concat([Mailman.getConfig({ key })
					.then(resp => resp.value.toString())
					.then(value => ({ key, value }))]
				)), Promise.resolve([])
			))
			.then(entries => {
				console.log(entries);
				this.setState({ items: entries })
			});

	}
	public render() {
		return (
			<div style={this.style}>
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
				<span>{this.props.configValue.toString()}</span>
			</div>;
	}
}

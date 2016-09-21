import * as React from 'react'

import {Config} from './services'

interface ConfigEntries {
	items: Array<{key:string, value:string}>
}
export class ConfigPanel extends React.Component<any,ConfigEntries> {
	state :ConfigEntries = { items: [] };
	componentDidMount() {
		Config.keys()
			.then(configKeys => Promise.all<{key:string;value:string}>(configKeys.map(key =>
				Config.get(key)
					.then(resp => JSON.stringify(resp))
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

class ConfigEntry extends React.Component<{configKey:string, configValue:string}, void> {
	public render() {
		return <div>
				<span>{this.props.configKey}|</span>
				<span>{this.props.configValue}</span>
			</div>;
	}
}

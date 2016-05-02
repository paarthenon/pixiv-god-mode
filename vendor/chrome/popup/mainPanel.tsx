import * as React from 'react'

export class MainPanel extends React.Component<any,any> {
	protected style = {
		width: '400px',
		height: '300px',
		background: '#ddd',
		zIndex: 100
	};
	public render() {
		return (
			<div style={this.style}></div>
			);
	}
}
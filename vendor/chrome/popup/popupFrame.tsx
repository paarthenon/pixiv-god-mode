import * as React from 'react'

export class PopupWindowFrame extends React.Component<void, void> {
	protected style = {
		width: '800px',
		height: '600px',
		display: 'flex',
		'flex-direction': 'column',
	};

	public render() {
		return <div style={this.style}>{this.props.children}</div>
	}
}

export class PopupContentFrame extends React.Component<void, void> {
	public render() {
		let contentStyle = {
			flex: 1,
			background: '#f5f5f5',
			padding: '15px',
			display: 'flex',
			'flex-direction': 'column',
		};
		let innerStyle = {
			flex: 1,
			display: 'flex',
			'flex-direction': 'column',
		}

		return <div style={contentStyle}>
			<div style={innerStyle}>{this.props.children}</div>
		</div>;
	}
}
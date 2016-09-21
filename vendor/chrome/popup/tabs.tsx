import * as React from 'react'
import * as Bootstrap from 'react-bootstrap'

export class Tabs extends React.Component<{tabs: {[name:string]:JSX.Element}, initialTab: string},{active:string}> {
	state = {active: this.props.initialTab};

	protected style = {
		width: '800px',
		height: '600px',
		display: 'flex',
		'flex-direction': 'column',
	};

	componentDidMount() {
		let active = this.props.initialTab || Object.keys(this.props.tabs)[0] || '';
		this.state = { active };
	}

	public handleSelect(active:string) {
		this.setState({ active });
	}
	public render() {
		let navStyle = {
			flex: 1,
		}
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

		return (
			<div style={this.style}>
				<Bootstrap.Nav bsStyle="tabs" activeKey={this.state.active} onSelect={this.handleSelect.bind(this)}>
				{Object.keys(this.props.tabs).map(key => 
						<Bootstrap.NavItem eventKey={key} key={key}>{key}</Bootstrap.NavItem>) }
				</Bootstrap.Nav>
				<div style={contentStyle}>
					<div style={innerStyle}>{this.props.tabs[this.state.active]}</div>
				</div>
			</div>
			);
	}
}

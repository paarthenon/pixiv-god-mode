import * as React from 'react'
import * as Bootstrap from 'react-bootstrap'

export class Tabs extends React.Component<{tabs: {[name:string]:JSX.Element}, initialTab: string},{active:string}> {
	protected style = {
		width: '700px',
		height: '500px',
		background: '#eeee',
		zIndex: 100
	};

	constructor(props:any) {
		super(props);
		let active = this.props.initialTab || Object.keys(this.props.tabs)[0] || '';
		this.state = { active };
	}

	public handleSelect(active:string) {
		this.setState({ active });
	}
	public render() {
		return (
			<div style={this.style}>
				<Bootstrap.Nav bsStyle="tabs" activeKey={this.state.active} onSelect={this.handleSelect.bind(this)}>
				{Object.keys(this.props.tabs).map(key => 
						<Bootstrap.NavItem eventKey={key} key={key}>{key}</Bootstrap.NavItem>) }
				</Bootstrap.Nav>
				<div>{this.props.tabs[this.state.active]}</div>
			</div>
			);
	}
}

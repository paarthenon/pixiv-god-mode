import * as React from 'react'

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

	public handleClick(active:string) {
		this.setState({ active });
	}
	public render() {
		return (
			<div style={this.style}>
				{Object.keys(this.props.tabs).map(key => <span onClick={()=>this.handleClick(key)}key={key}>{key}</span>) }
				{this.props.tabs[this.state.active]}
			</div>
			);
	}
}

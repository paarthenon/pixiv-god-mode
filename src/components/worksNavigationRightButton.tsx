import * as React from 'react'

export class WorksNavbarRightButton extends React.Component<{text:string,clickAction:Function},any> {
	public ulStyle = {
		float: 'right'
	};

	public aStyle = {
		cursor: 'pointer'
	}
	
	public render() {
		return (
			<ul style={this.ulStyle}>
				<li>
					<a onClick={() => this.props.clickAction} style={this.aStyle}>
						{this.props.text}
					</a>
				</li>
			</ul>
		);
	}
}
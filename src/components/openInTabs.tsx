import * as React from 'react'
import * as log4js from 'log4js'

let logger = log4js.getLogger('Button');

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
					<a onClick={this.props.clickAction.bind(this)} style={this.aStyle}>
						{this.props.text}
					</a>
				</li>
			</ul>
		);
	}
}
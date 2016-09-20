import * as React from 'react'

export class ToolmenuButton extends React.Component<{text:string, tooltip?:string, clickAction:Function},any> {
	public render() {
		return (
			<li className="item">
				<span className="_icon-12" title={this.props.tooltip} onClick={this.props.clickAction}>
					{this.props.text}
				</span>
			</li>
			);
	}
}
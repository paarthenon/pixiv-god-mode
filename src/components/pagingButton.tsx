import * as React from 'react'

export class PagingButton extends React.Component<{className:string, tooltip:string, rel:string, href:string},any> {
	public render() {
		let fontSize = {
			fontSize: '.8em'
		};
		return (
			<a href={this.props.href} rel={this.props.rel} className="_button" title={this.props.tooltip} style={fontSize}>
				<span className={'pixiv-assistant'}><span className={`glyphicon ${this.props.className}`}></span></span>
			</a>
			);
	}
}

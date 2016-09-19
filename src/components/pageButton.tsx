import * as React from 'react'
import * as log4js from 'log4js'

let logger = log4js.getLogger('Button');

export class PageButton extends React.Component<{text:string, tooltip:string, rel:string, href:string},any> {
	public render() {
		return (
			<a href={this.props.href} rel={this.props.rel} className="_button" title={this.props.tooltip}>
				{this.props.text}
			</a>
			);
	}
}
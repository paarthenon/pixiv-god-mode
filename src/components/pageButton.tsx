import * as React from 'react'
import * as log4js from 'log4js'

let logger = log4js.getLogger('Button');

export class PageButton extends React.Component<{clickAction:Function},any> {
	public render() {
		return (
			<a onClick={this.props.clickAction.bind(this)} rel="prev" className="_button" title="First">
				<i className="_icon sprites-prev-linked"></i>
			</a>
			);
	}
}
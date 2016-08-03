import * as React from 'react'
import * as log4js from 'log4js'

let logger = log4js.getLogger('Button');

export class BookmarkDetailViewButton extends React.Component<{text:string,clickAction:Function},any> {
	public render() {
		return (
			<div className="_button-lite-large" onClick={this.props.clickAction}>{this.props.text}</div>
			);
	}
}

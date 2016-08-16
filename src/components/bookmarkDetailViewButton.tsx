import * as React from 'react'
import * as log4js from 'log4js'

let logger = log4js.getLogger('Button');

export class BookmarkDetailViewButton extends React.Component<{text:string,clickAction:Function, id?:string},any> {
	public render() {
		return (
			<div id={this.props.id} className="_button-lite-large" onClick={this.props.clickAction}>{this.props.text}</div>
			);
	}
}

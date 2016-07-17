import * as React from 'react'
import * as log4js from 'log4js'

let logger = log4js.getLogger('Button');

export class UserRelationButton extends React.Component<{text:string,clickAction:Function},any> {
	public render() {
		return (
			<a onClick={this.props.clickAction.bind(this)}  className="follow">{this.props.text}</a>
			);
	}
}
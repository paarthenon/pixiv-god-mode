import * as React from 'react'

export class UserRelationButton extends React.Component<{text:string,clickAction:Function},any> {
	public render() {
		return (
			<a onClick={this.props.clickAction.bind(this)}  className="follow">{this.props.text}</a>
			);
	}
}
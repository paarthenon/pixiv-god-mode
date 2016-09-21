import * as React from 'react'

export class UserRelationButton extends React.Component<{text:string,clickAction:Function},any> {
	public render() {
		return (
			<a onClick={() => this.props.clickAction()}  className="follow">{this.props.text}</a>
			);
	}
}
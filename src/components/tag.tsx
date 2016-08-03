import * as React from 'react'
import * as log4js from 'log4js'

let logger = log4js.getLogger('Button');

class TagDropdown extends React.Component<{text:string,clickAction:Function},any> {
	public render() {
		return (
			<a onClick={this.props.clickAction.bind(this)}  className="follow">{this.props.text}</a>
			);
	}
}

class TagTrigger extends React.Component<any, any> {
	public render() {
		return (
			<OverlayTrigger trigger="click" rootClose placement="bottom" overlay={popoverClickRootClose}>
				<Button>Click w/rootClose</Button>
			</OverlayTrigger>
			);
	}
}
import * as React from 'react'

var Popover = require('react-popover');

import * as log4js from 'log4js'

let logger = log4js.getLogger('Button');

class TagDropdown extends React.Component<any,any> {
	public render() {
		return (
			<div>
				Test
			</div>
			);
	}
}

export class TagTrigger extends React.Component<any, {isOpen:boolean}> {
	state = {isOpen:false};
	public toggle(){
		this.setState({isOpen: !this.state.isOpen});
	}
	public popoverStyle = {
		border: '1px solid black',
		'transform': '',
		'transitionProperty': '',
		'transitionDuration': '',
		'transitionTimingFunction': ''
	};
	public render() {
		return (
			<Popover isOpen={this.state.isOpen} body={<TagDropdown />} preferPlace="below" style={this.popoverStyle}>
				<a onClick={this.toggle.bind(this)}>Click</a>
			</Popover>
			);
	}
}
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import * as Bootstrap from 'react-bootstrap'

export class TextSetting extends React.Component<{label:string, text:string, onUpdate:(val:string)=>any},{editOpen:boolean}> {
	state = { editOpen: false };
	public handleUpdate() {
		let translationInput :any = ReactDOM.findDOMNode(this.refs['translation']);
		this.props.onUpdate(translationInput.value);
	}
	public render() {
		return (
			<tr>
				<label> {this.props.label} </label>
				<input defaultValue={this.props.text} ref="translation"></input>
				<Bootstrap.Button bsSize="xsmall" onClick={this.handleUpdate.bind(this)}>update</Bootstrap.Button>
			</tr>
		);
	}
}

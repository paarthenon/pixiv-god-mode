import * as React from 'react'
import * as ReactDOM from 'react-dom'
import * as Bootstrap from 'react-bootstrap'

export class DictionaryAdd extends React.Component<{onAdd:(key:string,value:string)=>any},void> {
	public handleAdd(){
		let japaneseInput: any = ReactDOM.findDOMNode(this.refs['japanese']);
		let translationInput: any = ReactDOM.findDOMNode(this.refs['translation']);
		this.props.onAdd(japaneseInput.value, translationInput.value)

		// Clear the form now that the entry has been saved.
		japaneseInput.value = '';
		translationInput.value = '';
	}
	public render() {
		return <Bootstrap.Panel header="Add Translation">
			<Bootstrap.Form inline>
					<Bootstrap.FormControl type="text" placeholder="japanese" ref="japanese" />
					<Bootstrap.FormControl type="text" placeholder="translation" ref="translation" />
					<Bootstrap.Button onClick={this.handleAdd.bind(this)}>add</Bootstrap.Button>
			</Bootstrap.Form>
		</Bootstrap.Panel>
	}
}
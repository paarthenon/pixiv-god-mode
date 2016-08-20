import * as React from 'react'
import * as ReactDOM from 'react-dom'
import * as Bootstrap from 'react-bootstrap'


import * as pathUtils from '../../../../src/utils/path'

import * as chromeUtils from '../../utils'

export class DictionaryAdd extends React.Component<{onAdd:(key:string,value:string)=>any},void> {
	componentDidMount() {
		chromeUtils.getCurrentTab().then(tab => {
			let potentialTag = pathUtils.getPotentialTag(tab.url);
			if (potentialTag !== '' && this.japaneseInput.value === '') {
				this.japaneseInput.value = potentialTag;

				this.translationInput.focus();
			} else {
				this.japaneseInput.focus();
			}
		})
	}
	public get japaneseInput() {
		return ReactDOM.findDOMNode(this.refs['japanese']) as HTMLInputElement;
	}
	public get translationInput() {
		return ReactDOM.findDOMNode(this.refs['translation']) as HTMLInputElement;
	}
	public handleAdd(event:Event){
		// Necessary to prevent page refresh from onSubmit
		event.preventDefault();

		this.props.onAdd(this.japaneseInput.value, this.translationInput.value)

		// Clear the form now that the entry has been saved.
		this.japaneseInput.value = '';
		this.translationInput.value = '';
	}
	public render() {
		return <Bootstrap.Panel header="Add Translation">
			<Bootstrap.Form inline onSubmit={this.handleAdd.bind(this)}>
					<Bootstrap.FormControl type="text" placeholder="japanese" ref="japanese" />
					<Bootstrap.FormControl type="text" placeholder="translation" ref="translation" />
					<Bootstrap.Button type="submit" onClick={this.handleAdd.bind(this)}>add</Bootstrap.Button>
			</Bootstrap.Form>
		</Bootstrap.Panel>
	}
}
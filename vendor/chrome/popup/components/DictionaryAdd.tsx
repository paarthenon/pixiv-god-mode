import * as React from 'react'
import * as ReactDOM from 'react-dom'
import * as Bootstrap from 'react-bootstrap'


import * as pathUtils from '../../../../src/utils/path'

import * as chromeUtils from '../../utils'

export class DictionaryAdd extends React.Component<{onAdd:(key:string,value:string)=>any},void> {
	constructor(props:any){
		super(props);

		chromeUtils.getCurrentTab().then(tab => {
			let potentialTag = pathUtils.getPotentialTag(tab.url);
			console.log('found potentialTag', potentialTag);
			if (potentialTag !== '' && this.japaneseInput.value === '') {
				this.japaneseInput.value = potentialTag;
			}
		})
		
	}
	public get japaneseInput() {
		return ReactDOM.findDOMNode(this.refs['japanese']) as HTMLInputElement;
	}
	public get translationInput() {
		return ReactDOM.findDOMNode(this.refs['translation']) as HTMLInputElement;
	}
	public handleAdd(){
		this.props.onAdd(this.japaneseInput.value, this.translationInput.value)

		// Clear the form now that the entry has been saved.
		this.japaneseInput.value = '';
		this.translationInput.value = '';
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
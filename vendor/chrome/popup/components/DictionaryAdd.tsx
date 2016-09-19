import * as React from 'react'
import * as ReactDOM from 'react-dom'
import * as Bootstrap from 'react-bootstrap'


import * as pathUtils from '../../../../src/utils/path'

import * as chromeUtils from '../../utils'

interface DictionaryAddProps {
	onAdd :(key:string,value:string) => any
	getTranslation :(key:string) => Promise<string>
}
export class DictionaryAdd extends React.Component<DictionaryAddProps,{updating?:boolean}> {
	state = {updating: false};
	componentDidMount() {
		chromeUtils.getCurrentTab().then(tab => {
			if (tab.url) {
				let potentialTag = pathUtils.getPotentialTag(tab.url);
				if (potentialTag !== '' && this.japaneseInput.value === '') {
					this.japaneseInput.value = potentialTag;

					this.translationInput.focus();

					this.props.getTranslation(potentialTag)
						.then(translation => {
							if (translation !== undefined) {
								this.translationInput.value = translation
								this.setState({updating: true});
							}
						})
				} else {
					this.japaneseInput.focus();
				}
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
		let buttonText = (this.state.updating) ? 'update':'add';
		let gap = {margin: '0px 5px'};

		let BootstrapFormLabel = (Bootstrap as any).ControlLabel;
		return <Bootstrap.Panel bsSize="small">
			<big>Add Translation</big>
			<Bootstrap.Form inline onSubmit={this.handleAdd.bind(this)} bsSize="small">
				<Bootstrap.FormGroup bsSize="small">
					<Bootstrap.FormControl type="text" placeholder="japanese" ref="japanese" />
					<Bootstrap.FormControl type="text" placeholder="translation" ref="translation" style={gap}/>
					<Bootstrap.Button bsSize="small" type="submit" onClick={this.handleAdd.bind(this)}>{buttonText}</Bootstrap.Button>
				</Bootstrap.FormGroup>
			</Bootstrap.Form>
		</Bootstrap.Panel>
	}
}


import * as React from 'react'
import * as ReactDOM from 'react-dom'
import * as Bootstrap from 'react-bootstrap'

import * as pathUtils from '../../../../src/utils/path'
import * as chromeUtils from '../../utils'

import vars from '../staticVars'

export interface DictionaryAddProps {
	onAdd :(key:string,value:string) => any
	getTranslation :(key:string) => Promise<string>
}
export class DictionaryAdd extends React.Component<DictionaryAddProps,{updating?:boolean}> {
	state = {updating: false};

	// Attempt to populate the fields with content based on page and dict
	componentDidMount() {
		this.translationInput.focus();
		
		chromeUtils.getCurrentTab().then(tab => {
			if (tab.url) {
				let potentialTag = pathUtils.getPotentialTag(tab.url);
				if (potentialTag !== '' && this.originalInput.value === '') {
					this.originalInput.value = potentialTag;
					this.props.getTranslation(potentialTag).then(translation => {
						if (translation !== undefined) {
							this.translationInput.value = translation
							// If we did find a translation we are updating, not adding.
							this.setState({updating: true});
						}
					})
				}
			}
		})
	}

	public get originalInput() {
		return ReactDOM.findDOMNode(this.refs['original']) as HTMLInputElement;
	}

	public get translationInput() {
		return ReactDOM.findDOMNode(this.refs['translation']) as HTMLInputElement;
	}

	public handleAdd(event:Event){
		// Necessary to prevent page refresh from onSubmit
		event.preventDefault();

		this.props.onAdd(this.originalInput.value, this.translationInput.value)

		// Clear the form now that the entry has been saved.
		this.originalInput.value = '';
		this.translationInput.value = '';
	}

	public render() {
		let buttonText = (this.state.updating) ? 'Update Translation':'Add Translation';
		let gap = {margin: '0px 5px'};

		let noBottomMargin = {
			marginBottom: '0px'
		}

		//setting widths manually. Potentially evil, but it's not quite order of the blackened denarius bad in react.
		let inputWidth={width:'289px'};
		let buttonStyle={width:'150px'};

		return <Bootstrap.Panel>
			<Bootstrap.Form inline onSubmit={this.handleAdd.bind(this)} style={noBottomMargin}>
				<Bootstrap.FormGroup bsSize="small">
					<Bootstrap.FormControl type="text" placeholder="Translation" ref="translation" style={inputWidth}/>
					<Bootstrap.FormControl type="text" placeholder="Original" ref="original" style={Object.assign(gap, inputWidth)}/>
					<Bootstrap.Button type="submit" onClick={this.handleAdd.bind(this)} style={buttonStyle} bsStyle={vars.buttonStyle}>{buttonText}</Bootstrap.Button>
				</Bootstrap.FormGroup>
			</Bootstrap.Form>
		</Bootstrap.Panel>
	}
}

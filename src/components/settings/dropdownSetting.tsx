import * as React from 'react'
import * as Bootstrap from 'react-bootstrap'

interface DropdownSettingProps {
	label :string
    options :{[label:string]:any}
	selected :any
	onChange :(value:any) => any
}

/**
 * A simple dropdown with label
 */
export class DropdownSetting extends React.Component<DropdownSettingProps, void> {
	private inputElement : HTMLInputElement;
	
	handleExecute(event:React.FormEvent) {
        console.log('ev',(event.target as any).value);
		this.props.onChange((event.target as any).value);
	}

	initializeElement(ref:HTMLInputElement){
        console.log('ref',ref);
		if(ref) {
			ref.value = this.props.selected;
			this.inputElement = ref;
		}
	}

	public render() {
		return <div>
            <Bootstrap.FormGroup controlId="formControlsSelect">
                <Bootstrap.ControlLabel>{this.props.label}</Bootstrap.ControlLabel>
                <Bootstrap.FormControl 
                    componentClass="select"
                    inputRef={this.initializeElement.bind(this)}
                    onChange={this.handleExecute.bind(this)}
                    value={this.props.selected}
                >
                {
                    Object.keys(this.props.options).map(key => 
                        <option value={this.props.options[key]}>{key}</option>
                    )
                }
                </Bootstrap.FormControl>
            </Bootstrap.FormGroup>
        </div>;
	}
}
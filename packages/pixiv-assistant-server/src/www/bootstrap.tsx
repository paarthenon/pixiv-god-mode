import * as React from 'react'
import * as ReactDOM from 'react-dom'
import * as Bootstrap from 'react-bootstrap'
import * as log4js from 'log4js'

import Mailman from '../mailman'

let logger = log4js.getLogger('Bootstrap');

export interface IServerConfig {
	path? :string
	// repoType? :repotype
	port? :number
	verboseLogging? :boolean
}

/*
<FormGroup controlId="formControlsSelect">
      <ControlLabel>Select</ControlLabel>
      <FormControl componentClass="select" placeholder="select">
        <option value="select">select</option>
        <option value="other">...</option>
      </FormControl>
    </FormGroup>
*/

class ServerStatus extends React.Component<void, any> {
	state = {started: false};
	public handleStart(path:string){
		Mailman.ServerConfig.initialize({path}).then(() => {
			this.setState({started: true});
		})
	}
	public handleClose(){
		Mailman.ServerConfig.close().then(() => {
			this.setState({started: false});
		})
	}
	public render() {
		if (!this.state.started) {
			return <ServerConfigurationForm clickAction={this.handleStart.bind(this)} />
		} else {
			return <CloseServerForm clickAction={this.handleClose.bind(this)}/>;
		}
	}
}

class ServerConfigurationForm extends React.Component<{clickAction:Function}, void> {
	public get repoPathInput() {
		return ReactDOM.findDOMNode(this.refs['repoPath']) as HTMLInputElement;
	}
	public handleSubmit(){
		this.props.clickAction(this.repoPathInput.value);
	}
	public render() {
		return (
			<Bootstrap.Form>
				<Bootstrap.FormControl type="text" placeholder="pixivRepository" ref="repoPath" />
				<Bootstrap.ControlLabel>Repository Type</Bootstrap.ControlLabel>
				<Bootstrap.FormControl componentClass="select" placeholder="Repository Type">
					<option value="artist">artist</option>
					<option value="image">image</option>
				</Bootstrap.FormControl>
				<Bootstrap.FormControl type="text" placeholder="50415" ref="port" />
				<Bootstrap.Button onClick={this.handleSubmit.bind(this)}>Start Server</Bootstrap.Button>
			</Bootstrap.Form>
		)
	}
}

class CloseServerForm extends React.Component<{clickAction:Function}, void> {
	public render() {
		return <Bootstrap.Button onClick={this.props.clickAction}>Close Server</Bootstrap.Button>
	}
}

ReactDOM.render(<ServerStatus />, document.getElementById('content'));


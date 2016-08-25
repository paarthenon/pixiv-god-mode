import * as React from 'react'
import * as ReactDOM from 'react-dom'
import * as Bootstrap from 'react-bootstrap'
import * as log4js from 'log4js'

import Mailman from '../mailman'
import * as proto from '../proto'

let logger = log4js.getLogger('Bootstrap');

class ServerStatus extends React.Component<void, any> {
	state = {started: false};
	public handleStart(props:proto.IServerConfig){
		Mailman.ServerConfig.initialize(props).then(() => {
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

class ServerConfigurationForm extends React.Component<{clickAction:(props:proto.IServerConfig) => any}, void> {
	public get repoPathInput() {
		return ReactDOM.findDOMNode(this.refs['repoPath']) as HTMLInputElement;
	}
	public get repoTypeInput() {
		return ReactDOM.findDOMNode(this.refs['repoType']) as HTMLInputElement;
	}
	public get portInput() {
		return ReactDOM.findDOMNode(this.refs['port']) as HTMLInputElement;
	}
	public handleSubmit(){
		this.props.clickAction({
			path: this.repoPathInput.value,
			repoType: parseInt(this.repoTypeInput.value) as proto.RepositoryType,
			port: parseInt(this.portInput.value),
		});
	}
	public handleBrowse(){
		Mailman.ServerConfig.openFolderDialog().then(str => this.repoPathInput.value = str);
	}
	public render() {
		return (
			<Bootstrap.Grid>
			<Bootstrap.Row>
			<h2>Pixiv Assistant Server Config</h2>
			<Bootstrap.Well>
			<Bootstrap.Form>
				<Bootstrap.InputGroup>
					<Bootstrap.FormControl type="text" placeholder="pixivRepository" ref="repoPath" />
					<Bootstrap.InputGroup.Button>
						<Bootstrap.Button onClick={this.handleBrowse.bind(this)}>Browse</Bootstrap.Button>
					</Bootstrap.InputGroup.Button>
				</Bootstrap.InputGroup>
				<Bootstrap.FormGroup inline>
					<Bootstrap.ControlLabel>Repository Type</Bootstrap.ControlLabel>
					<Bootstrap.FormControl componentClass="select" placeholder="Repository Type" ref="repoType">
						<option value={proto.RepositoryType.ArtistBreakdown}>Repo / Artist / Images</option>
						<option value={proto.RepositoryType.LooseImages}>Repo / Loose Images</option>
					</Bootstrap.FormControl>
				</Bootstrap.FormGroup>
				<Bootstrap.FormControl type="text" placeholder="50415" ref="port" />
				<Bootstrap.Button onClick={this.handleSubmit.bind(this)}>Start Server</Bootstrap.Button>
			</Bootstrap.Form>
			</Bootstrap.Well>
			</Bootstrap.Row>
			</Bootstrap.Grid>
		)
	}
}

class CloseServerForm extends React.Component<{clickAction:Function}, void> {
	public render() {
		return <Bootstrap.Button onClick={this.props.clickAction}>Close Server</Bootstrap.Button>
	}
}

ReactDOM.render(<ServerStatus />, document.getElementById('content'));


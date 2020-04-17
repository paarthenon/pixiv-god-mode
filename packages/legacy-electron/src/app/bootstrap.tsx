import * as React from 'react'
import * as ReactDOM from 'react-dom'
import * as Bootstrap from 'react-bootstrap'
import Mailman from '../mailman'
import * as proto from '../proto'
import log from 'daslog'

const console = log.prefix('Bootstrap');

console.debug('test');
class ServerConfigurationForm extends React.Component<{clickAction:(props:Partial<proto.IServerConfig>) => any}, void> {
	private verboseInput :HTMLInputElement | undefined = undefined;

	public get repoPathInput() {
		return ReactDOM.findDOMNode(this.refs['repoPath']) as HTMLInputElement;
	}
	public get portInput() {
		return ReactDOM.findDOMNode(this.refs['port']) as HTMLInputElement;
	}
	public handleSubmit() {
		this.props.clickAction({
			path: this.repoPathInput.value,
			port: parseInt(this.portInput.value),
			verboseLogging: this.verboseInput && this.verboseInput.checked,
		});
	}
	public handleBrowse() {
		let call = Mailman.ServerConfig.openFolderDialog();
		call.then(str => this.repoPathInput.value = str);
	}
	public render() {
		return (
			<Bootstrap.Grid>
			<Bootstrap.Row>
			<h2>Pixiv Assistant Server Config</h2>
			<Bootstrap.Well>
			<Bootstrap.Form>
				<Bootstrap.FormGroup><Bootstrap.InputGroup>
					<Bootstrap.InputGroup.Addon>Repository Path</Bootstrap.InputGroup.Addon>
					<Bootstrap.FormControl type='text' placeholder='pixivRepository' ref='repoPath' />
					<Bootstrap.InputGroup.Button>
						<Bootstrap.Button onClick={this.handleBrowse.bind(this)}>Browse</Bootstrap.Button>
					</Bootstrap.InputGroup.Button>
				</Bootstrap.InputGroup></Bootstrap.FormGroup>
				<Bootstrap.FormGroup><Bootstrap.InputGroup>
					<Bootstrap.InputGroup.Addon>Port Number</Bootstrap.InputGroup.Addon>
					<Bootstrap.FormControl type='text' defaultValue='50415' ref='port' />
				</Bootstrap.InputGroup></Bootstrap.FormGroup>
				<Bootstrap.Checkbox inputRef={ref => this.verboseInput = ref}>
					Verbose Logging
				</Bootstrap.Checkbox>

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
		return <Bootstrap.Grid>
			<Bootstrap.Row>
			<h2>Server Status</h2>
			<Bootstrap.Well>
				<p> Server <strong>Active</strong> </p>
				<Bootstrap.Button onClick={() => this.props.clickAction()}>Close Server</Bootstrap.Button>
			</Bootstrap.Well>
			</Bootstrap.Row>
			</Bootstrap.Grid>
	}
}

export class ServerStatus extends React.Component<{}, any> {
	state = {started: false};
	public handleStart(props:proto.IServerConfig) {
		Mailman.ServerConfig.initialize(props).then(() => {
			this.setState({started: true});
		})
	}
	public handleClose() {
		Mailman.ServerConfig.close().then(() => {
			this.setState({started: false});
		})
	}
	public render() {
		return <div>
			{(!this.state.started) ?
				<ServerConfigurationForm clickAction={this.handleStart.bind(this)} />
			:
				<CloseServerForm clickAction={this.handleClose.bind(this)}/>
			}
		</div>
	}
}

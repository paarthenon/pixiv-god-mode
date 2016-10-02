import * as React from 'react'
import * as Bootstrap from 'react-bootstrap'

import Mailman from 'vendor/chrome/mailman'
import {Action} from 'src/core/IAction'


interface ActionsListState {
	actions: Action[]
}
export class ActionContainer extends React.Component<void,ActionsListState> {
	state :ActionsListState = { actions: [] };

	componentDidMount() {
		Mailman.ContentScript.getActions()
			.then(actionMsg => {
				this.setState({ actions: actionMsg.actions});
			})
			.catch(error => console.error(error));
	}
	public render() {
		return <Bootstrap.Panel bsSize="small">
				<h5>Page Actions</h5>
				<ActionDisplay actions={this.state.actions} />
			</Bootstrap.Panel>
	}
	
}
export class ActionDisplay extends React.Component<{actions:Action[]}, void> {
	public render() {
		return (
			<Bootstrap.Form>
				{this.props.actions.map(action => <ActionEntry key={action.id} action={action} />)}
			</Bootstrap.Form>
		);
	}
}
export class ActionEntry extends React.Component<{action:Action}, void> {
	public handleExecute() {
		Mailman.ContentScript.performAction({actionId: this.props.action.id});
	}
	public render() {
		return <Bootstrap.FormGroup><Bootstrap.Button onClick={this.handleExecute.bind(this)}>
				<span className={"glyphicon glyphicon-"+this.props.action.icon} aria-hidden="true"></span>
				<span style={{'padding-left':'10px'}}>{this.props.action.label}</span>
			</Bootstrap.Button></Bootstrap.FormGroup>
	}
}

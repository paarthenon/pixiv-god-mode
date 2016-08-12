import * as React from 'react'
import * as Bootstrap from 'react-bootstrap'
import * as log4js from 'log4js'

import Mailman from '../mailman'
import {Action} from '../../../src/core/IAction'

let logger = log4js.getLogger('ActionPanel');

export class ActionPanel extends React.Component<any,{actions: Action[]}> {
	constructor() {
		super();
		this.state = { actions: [] };
		Mailman.ContentScript.getActions()
			.then(actionMsg => {
				this.setState({ actions: actionMsg.actions});
			})
			.catch(error => logger.error(error));

	}
	public render() {
		return (
			<div>
				<p> Actions: {this.state.actions.length}</p>
				{this.state.actions.map(action => <ActionEntry key={action.id} action={action} />)}
			</div>
			);
	}
}

export class ActionEntry extends React.Component<{action:Action}, void> {
	public handleExecute() {
		Mailman.ContentScript.performAction({actionId: this.props.action.id});
	}
	public render() {
		return <div>
				<Bootstrap.Button onClick={this.handleExecute.bind(this)} bsStyle="primary" bsSize="large">{this.props.action.label}</Bootstrap.Button>
			</div>;
	}
}

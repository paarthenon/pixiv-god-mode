import * as React from 'react'
import * as Bootstrap from 'react-bootstrap'
import * as log4js from 'log4js'

import Mailman from '../mailman'

import ConfigKeys from '../../../src/configKeys'
import {CachedDictionaryService} from '../../../src/core/dictionaryManagementService'
import {PAServer} from '../../../src/core/paServer'
import {Action} from '../../../src/core/IAction'
import Config from '../config'

import {DictionaryAdd} from './components/DictionaryAdd'

import {ConditionalRender} from './components/conditionalRender'
let logger = log4js.getLogger('HomePanel');

let dict = new CachedDictionaryService(new Config(), {
	global: ConfigKeys.official_dict,
	local: ConfigKeys.user_dict,
	cache: ConfigKeys.cached_dict
});

export class HomePanel extends React.Component<any,any> {
	public render() {
		return (
			<div>
				<DictionaryAdd onAdd={(key,value) => dict.update(key, value)} />
				<ActionContainer />
				<AlertsDisplay />
			</div>
			);
	}
}

export class ActionContainer extends React.Component<void,{actions: Action[]}> {
	constructor() {
		super();
		this.state = { actions: [] };
		Mailman.ContentScript.getActions()
			.then(actionMsg => {
				this.setState({ actions: actionMsg.actions});
			})
			.catch(error => logger.error(error));
	}
	public render() { return <ActionDisplay actions={this.state.actions} />}
	
}
export class ActionDisplay extends React.Component<{actions:Action[]}, void> {
	public render() {
		return (
			<div>
				<Bootstrap.ListGroup>
					{this.props.actions.map(action => <ActionEntry key={action.id} action={action} />)}
				</Bootstrap.ListGroup>
			</div>
		);
	}
}
export class ActionEntry extends React.Component<{action:Action}, void> {
	public handleExecute() {
		Mailman.ContentScript.performAction({actionId: this.props.action.id});
	}
	public render() {
		return <Bootstrap.ListGroupItem onClick={this.handleExecute.bind(this)}>
				<span className={"glyphicon glyphicon-"+this.props.action.icon} aria-hidden="true"></span>
				{this.props.action.label}
			</Bootstrap.ListGroupItem>;
	}
}

let paserver = new PAServer(new Config(), Mailman.Background.ajax);

export class AlertsDisplay extends React.Component<void, any> {
	public render() {
		return <div>
			<ConditionalRender predicate={() => 
				Mailman.Background.getConfig({key:ConfigKeys.server_url})
					.then(url => !url.value)
					.catch(() => true)
			}>
				<ServerAlert />
			</ConditionalRender>
			<ConditionalRender default={true} predicate={() =>
				paserver.ping().then(() => false).catch(() => true)
			}>
				<ServerConnectionAlert />
			</ConditionalRender>
			<ConditionalRender predicate={() =>
				paserver.ping().then(() => true).catch(() => false)
			}>
				<ServerConnectionSuccessAlert />
			</ConditionalRender>
			<ConditionalRender predicate={() =>
				Mailman.Background.getConfig({key:ConfigKeys.official_dict})
					.then(dict => !dict.value || Object.keys(dict.value).length === 0)
					.catch(() => true)
			}>
				<GlobalDictionaryEmptyAlert />
			</ConditionalRender>
		</div>;
	}
}

export class ServerAlert extends React.Component<void, void> {
	public render() {
		return <Bootstrap.Alert bsStyle="warning">There is no server url registered.</Bootstrap.Alert>
	}
}

export class ServerConnectionAlert extends React.Component<void, void> {
	public render() {
		return <Bootstrap.Alert bsStyle="warning">Unable to connect to server.</Bootstrap.Alert>
	}
}

export class ServerConnectionSuccessAlert extends React.Component<void, void> {
	public render() {
		return <Bootstrap.Alert bsStyle="success">Connected to Server</Bootstrap.Alert>
	}
}

export class GlobalDictionaryEmptyAlert extends React.Component<void, void> {
	public render() {
		return <Bootstrap.Alert bsStyle="warning">Your global dictionary is empty. Please go to the settings and update it.</Bootstrap.Alert>
	}
}
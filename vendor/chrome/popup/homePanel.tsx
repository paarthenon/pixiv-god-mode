import * as React from 'react'
import * as Bootstrap from 'react-bootstrap'
import * as log4js from 'log4js'

import Mailman from '../mailman'

import ConfigKeys from '../../../src/configKeys'
import {CachedDictionaryService} from '../../../src/core/dictionaryManagementService'
import {Action} from '../../../src/core/IAction'
import Config from '../config'

import {DictionaryAdd} from './components/DictionaryAdd'

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

				<p>Go to the settings page and update the global dictionary. This will happen automatically soon.</p>
				<p>Home screen unfinished</p>
				<p>TBD</p>
				<p>Server status: See tab for now.</p>
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
				<p> Page Actions</p>
				<ul>
					{this.props.actions.map(action => <li><ActionEntry key={action.id} action={action} /></li>)}
				</ul>
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
				<a href="#" onClick={this.handleExecute.bind(this)}>{this.props.action.label}</a>
			</div>;
	}
}

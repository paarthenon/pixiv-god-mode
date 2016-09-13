import * as React from 'react'
import * as ReactDOM from 'react-dom'
import * as log4js from 'log4js'

import Config from '../config'
import {MainPanel} from './mainPanel'
import {Tabs} from './tabs'
import {DictViewer} from './dict'
import {ReadOnlyDictViewer} from './readOnlyDict'
import {SettingsPanel} from './settingsPanel'
import {ConfigPanel} from './configPanel'
import {ServerStatusPanel} from './serverStatusPanel'
import {HomePanel} from './homePanel'
import {DictionaryJSON} from './exportDict'

import configKeys from '../../../src/configKeys'
import {CachedDictionaryService, naiveDictionary, cachedDictionary} from '../../../src/core/dictionaryManagementService'

let logger = log4js.getLogger('Bootstrap');
let config = new Config();

let official_dict :any = {};

let cachedDict = new CachedDictionaryService(new Config(), {
	global: configKeys.official_dict,
	local: configKeys.user_dict,
	cache: configKeys.cached_dict
});

class DictContainer extends React.Component<void,cachedDictionary> {
	constructor() {
		super();
		this.state = { cache: [] };
		this.updateDict();
	}
	updateDict() :void {
		cachedDict.cache
			.then(cachedDict => this.setState(cachedDict))
			.catch(error => logger.error(error));
	}

	handleUpdate(key:string, value:string) :void {
		cachedDict.update(key, value).then(() => this.updateDict());
	}
	handleDelete(key:string) {
		cachedDict.delete(key).then(() => this.updateDict());
	}
	public render() {
		return <DictViewer
			cachedDict={this.state}
			getTranslation={key => cachedDict.getTranslation(key)}
			onAdd={this.handleUpdate.bind(this)}
			onUpdate={this.handleUpdate.bind(this)}
			onDelete={this.handleDelete.bind(this)}
			/>
	}
}

import Mailman from '../mailman'
Mailman.Background.getConfig({ key: configKeys.official_dict })
	.then(dict => { official_dict = dict.value; render(); });

function render() {
	let tabInfo: { [id: string]: JSX.Element } = undefined;

	config.get(configKeys.debug_mode).catch(() => false).then(debugMode => {
		if (debugMode) {
			tabInfo = {
				Home: <HomePanel />,
				Dictionary: <DictContainer />,
				Settings: <SettingsPanel />,
				Config: <ConfigPanel />,
				ServerStatus: <ServerStatusPanel />,
				'Exported Dict': <DictionaryJSON />,
			};
		} else {
			tabInfo = {
				Home: <HomePanel />,
				Dictionary: <DictContainer />,
				Settings: <SettingsPanel />,
				'Exported Dict': <DictionaryJSON />,
			};
		}
	}).then(() => {
		ReactDOM.render(<Tabs tabs={tabInfo} initialTab="Home" />, document.getElementById('content'));
	})
}

render();


import * as React from 'react'
import * as ReactDOM from 'react-dom'
import * as log4js from 'log4js'

import {Tabs} from './tabs'
import {DictContainer} from './dict'
import {SettingsPanel} from './settingsPanel'
import {ConfigPanel} from './configPanel'
import {ServerStatusPanel} from './serverStatusPanel'
import {HomePanel} from './homePanel'
import {DictionaryJSON} from './exportDict'

import configKeys from '../../../src/configKeys'
import {Config, DictionaryService} from './services'

let logger = log4js.getLogger('Bootstrap');

Config.get(configKeys.debug_mode).catch(() => false).then(debugMode => {
	if (debugMode) {
		return {
			Home: <HomePanel />,
			Dictionary: <DictContainer dictService={DictionaryService} />,
			Settings: <SettingsPanel />,
			Config: <ConfigPanel />,
			ServerStatus: <ServerStatusPanel />,
			'Exported Dict': <DictionaryJSON />,
		};
	} else {
		return {
			Home: <HomePanel />,
			Dictionary: <DictContainer dictService={DictionaryService} />,
			Settings: <SettingsPanel />,
			'Exported Dict': <DictionaryJSON />,
		};
	}
}).then(tabInfo => {
	ReactDOM.render(<Tabs tabs={tabInfo} initialTab="Home" />, document.getElementById('content'));
})

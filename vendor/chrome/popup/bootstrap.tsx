import * as React from 'react'
import * as ReactDOM from 'react-dom'

import {Tabs} from 'vendor/chrome/popup/tabs'
import {DictContainer} from 'vendor/chrome/popup/dict'
import {SettingsPanel} from 'vendor/chrome/popup/settingsPanel'
import {ConfigPanel} from 'vendor/chrome/popup/configPanel'
import {ServerStatusPanel} from 'vendor/chrome/popup/serverStatusPanel'
import {HomePanel} from 'vendor/chrome/popup/homePanel'
import {DictionaryJSON} from 'vendor/chrome/popup/exportDict'

import configKeys from 'src/configKeys'
import {Config, DictionaryService} from 'vendor/chrome/popup/services'

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

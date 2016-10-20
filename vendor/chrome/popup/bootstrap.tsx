import * as React from 'react'
import * as ReactDOM from 'react-dom'

import {PopupWindowFrame, PopupContentFrame} from 'vendor/chrome/popup/popupFrame'
import {PopupNavbar} from 'vendor/chrome/popup/navBar'
import {DictContainer} from 'vendor/chrome/popup/dict'
import {DictionaryService} from 'vendor/chrome/services'
import {getSetting} from 'vendor/chrome/userSettings'
import SettingKeys from 'src/settingKeys'

// Polling for dictionary auto-update feature.
getSetting(SettingKeys.global.autoUpdateDictionary).then(settingValue => {
	if (settingValue) {
		DictionaryService.globalUpdateAvailable.then(updateAvailable => {
			if (updateAvailable) {
				return DictionaryService.updateGlobalDictionary();
			} else {
				return Promise.resolve();
			}
		});
	}
});


ReactDOM.render(
	<PopupWindowFrame>
		<PopupNavbar />
		<PopupContentFrame>
			<DictContainer dictService={DictionaryService} />
		</PopupContentFrame>
	</PopupWindowFrame>
	, document.getElementById('content'));
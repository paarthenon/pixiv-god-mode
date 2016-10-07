import * as React from 'react'
import * as Bootstrap from 'react-bootstrap'

import {IndividualSettingsPanel} from 'src/components/settings/individualSettingsPanel'
import {BooleanSettingContainer} from 'vendor/chrome/options/booleanSettingContainer'
import SettingKeys from 'src/settingKeys'

export class SearchSettingsPanel extends React.Component<void, void> {
	public render() {
		return <IndividualSettingsPanel header="Search Page">
			<BooleanSettingContainer 
				settingKey={SettingKeys.pages.search.fadeDownloaded} 
				label={'Fade out downloaded images'}/>
			<BooleanSettingContainer 
				settingKey={SettingKeys.pages.search.fadeBookmarked} 
				label={'Fade out images from bookmarked artists'}/>
		</IndividualSettingsPanel>
	}
}
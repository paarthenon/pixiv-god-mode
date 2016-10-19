import * as React from 'react'
import * as Bootstrap from 'react-bootstrap'

import {IndividualSettingsPanel} from 'src/components/settings/individualSettingsPanel'
import {BooleanSettingContainer} from 'vendor/chrome/options/booleanSettingContainer'
import SettingKeys from 'src/settingKeys'

export class IllustrationSettingsPanel extends React.Component<void, void> {
	public render() {
		return <IndividualSettingsPanel header="Illustration Page">
			<BooleanSettingContainer 
				settingKey={SettingKeys.pages.illust.addBookmarkAsModal} 
				label={'Add Bookmark button launches a modal'}/>
			<BooleanSettingContainer 
				settingKey={SettingKeys.pages.illust.autoOpen} 
				label={'Automatically zoom into image'}/>
			<BooleanSettingContainer 
				settingKey={SettingKeys.pages.illust.boxImage} 
				label={'Limit image size to the window (illustration)'}/>
		</IndividualSettingsPanel>
	}
}
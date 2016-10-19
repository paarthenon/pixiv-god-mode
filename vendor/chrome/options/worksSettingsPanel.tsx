import * as React from 'react'

import {IndividualSettingsPanel} from 'src/components/settings/individualSettingsPanel'
import {BooleanSettingContainer} from 'vendor/chrome/options/booleanSettingContainer'
import SettingKeys from 'src/settingKeys'

export class WorksSettingsPanel extends React.Component<void, void> {
	public render() {
		return <IndividualSettingsPanel header="Works Page">
			<BooleanSettingContainer 
				settingKey={SettingKeys.pages.works.inject.openInTabs} 
				label={'Inject open in tabs button'}/>
			<BooleanSettingContainer 
				settingKey={SettingKeys.pages.works.autoDarken} 
				label={'Fade out downloaded images'}/>
			<BooleanSettingContainer 
				settingKey={SettingKeys.pages.works.openTabsImagesOnly} 
				label={'Open in tabs uses the direct image files instead of the pages'}/>
		</IndividualSettingsPanel>
	}
}
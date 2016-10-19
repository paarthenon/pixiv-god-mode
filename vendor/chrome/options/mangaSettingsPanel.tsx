import * as React from 'react'
import * as Bootstrap from 'react-bootstrap'

import {IndividualSettingsPanel} from 'src/components/settings/individualSettingsPanel'
import {BooleanSettingContainer} from 'vendor/chrome/options/booleanSettingContainer'
import SettingKeys from 'src/settingKeys'

export class MangaSettingsPanel extends React.Component<void, void> {
	public render() {
		return <IndividualSettingsPanel header={'Manga Page'}>
			<BooleanSettingContainer 
				settingKey={SettingKeys.pages.manga.inject.toolbox} 
				label={'Inject extra buttons (previous, next, download, open folder)'}/>
			<BooleanSettingContainer 
				settingKey={SettingKeys.pages.manga.loadFullSize} 
				label={'Load full size versions of manga images'}/>
			<BooleanSettingContainer 
				settingKey={SettingKeys.pages.manga.fitImage} 
				label={'Fit image to window'}/>
		</IndividualSettingsPanel>
	}
}

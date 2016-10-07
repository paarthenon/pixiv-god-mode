import * as React from 'react'
import * as Bootstrap from 'react-bootstrap'

import {IndividualSettingsPanel} from 'src/components/settings/individualSettingsPanel'
import {BooleanSettingContainer} from 'vendor/chrome/options/booleanSettingContainer'
import SettingKeys from 'src/settingKeys'

export class BookmarkIllustrationSettingsPanel extends React.Component<void, void> {
	public render() {
		return <IndividualSettingsPanel header="Bookmark Illustration Page">
			<BooleanSettingContainer 
				settingKey={SettingKeys.pages.bookmarkIllustration.inject.viewAll} 
				label={'Inject view all button'}/>
			<BooleanSettingContainer 
				settingKey={SettingKeys.pages.bookmarkIllustration.fadeDownloaded} 
				label={'Fade out downloaded images'}/>
			<BooleanSettingContainer 
				settingKey={SettingKeys.pages.bookmarkIllustration.fadeBookmarked} 
				label={'Fade out images from bookmarked artists'}/>
			<BooleanSettingContainer 
				settingKey={SettingKeys.pages.bookmarkIllustration.skipToDetail} 
				label={'Skip to bookmark detail page'}/>
		</IndividualSettingsPanel>
	}
}
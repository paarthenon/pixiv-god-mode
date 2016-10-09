import * as React from 'react'
import * as Bootstrap from 'react-bootstrap'

import {IndividualSettingsPanel} from 'src/components/settings/individualSettingsPanel'
import {BooleanSettingContainer} from 'vendor/chrome/options/booleanSettingContainer'
import SettingKeys from 'src/settingKeys'

export class ArtistBookmarksSettingsPanel extends React.Component<void, void> {
	public render() {
		return <IndividualSettingsPanel header="Artist's Bookmarks Page">
			<BooleanSettingContainer 
				settingKey={SettingKeys.pages.artistBookmarks.inject.openFolder} 
				label={'Inject open folder button'}/>
			<BooleanSettingContainer 
				settingKey={SettingKeys.pages.artistBookmarks.fadeDownloaded} 
				label={'Fade out downloaded images'}/>
			<BooleanSettingContainer 
				settingKey={SettingKeys.pages.artistBookmarks.fadeBookmarked} 
				label={'Fade out images from bookmarked artists'}/>
		</IndividualSettingsPanel>
	}
}
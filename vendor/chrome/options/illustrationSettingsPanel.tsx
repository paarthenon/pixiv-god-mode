import * as React from 'react'

import {IndividualSettingsPanel} from 'src/components/settings/individualSettingsPanel'
import {BooleanSettingContainer} from 'vendor/chrome/options/booleanSettingContainer'
import {DropdownSettingContainer} from 'vendor/chrome/options/dropdownSettingContainer'
import {default as SettingKeys, AddToBookmarksButtonType} from 'src/settingKeys'

export const IllustrationSettingsPanel : React.StatelessComponent<void> = () =>
	<IndividualSettingsPanel header="Illustration Page">
		<DropdownSettingContainer 
			settingKey={SettingKeys.pages.illust.addBookmarkButtonType} 
			label={'Add Bookmark button launches a modal'}
			options={{
				'Original': AddToBookmarksButtonType.ORIGINAL,
				'Modal': AddToBookmarksButtonType.MODAL,
				'One Click': AddToBookmarksButtonType.ONE_CLICK,
			}}
		/>
		<BooleanSettingContainer 
			settingKey={SettingKeys.pages.illust.autoOpen} 
			label={'Automatically zoom into image'}/>
		<BooleanSettingContainer 
			settingKey={SettingKeys.pages.illust.boxImage} 
			label={'Limit image size to the window (illustration)'}/>
	</IndividualSettingsPanel>

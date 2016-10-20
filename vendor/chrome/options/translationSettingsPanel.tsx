import * as React from 'react'

import SettingKeys from 'src/settingKeys'

import {IndividualSettingsPanel} from 'src/components/settings/individualSettingsPanel'
import {BooleanSettingContainer} from 'vendor/chrome/options/booleanSettingContainer'
import {GlobalDictUpdaterContainer} from 'vendor/chrome/options/globalDictionaryUpdaterContainer'

export const TranslationSettingsPanel : React.StatelessComponent<void> = () =>
    <IndividualSettingsPanel header={'Translations Panel'}>
        <BooleanSettingContainer settingKey={SettingKeys.global.translateTags} label={'Translate pixiv tags'}/>
        <BooleanSettingContainer settingKey={SettingKeys.global.autoUpdateDictionary} label={'Automatically sync updates from the global dictionary'}/>
        <GlobalDictUpdaterContainer />
    </IndividualSettingsPanel>

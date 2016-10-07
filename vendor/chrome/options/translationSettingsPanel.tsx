import * as React from 'react'
import * as Bootstrap from 'react-bootstrap'

import {getUserSettings, getSetting, setSetting} from 'vendor/chrome/userSettings'
import SettingKeys from 'src/settingKeys'

import {IndividualSettingsPanel} from 'src/components/settings/individualSettingsPanel'
import {BooleanSettingContainer} from 'vendor/chrome/options/booleanSettingContainer'
import {GlobalDictUpdaterContainer} from 'vendor/chrome/options/globalDictionaryUpdaterContainer'

export class TranslationSettingsPanel extends React.Component<void, void> {
    public render() {
        return <IndividualSettingsPanel header={'Translations Panel'}>
            <BooleanSettingContainer settingKey={SettingKeys.global.translateTags} label={'Translate pixiv tags'}/>
            <GlobalDictUpdaterContainer />
        </IndividualSettingsPanel>
    }
}
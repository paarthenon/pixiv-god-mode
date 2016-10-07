import * as React from 'react'
import * as Bootstrap from 'react-bootstrap'

import {TextSettingContainer} from 'vendor/chrome/options/textSettingContainer'
import ConfigKeys from 'src/configKeys'

import {IndividualSettingsPanel} from 'src/components/settings/individualSettingsPanel'

export class ServerSettingsPanel extends React.Component<void, void> {
    public render() {
        return <IndividualSettingsPanel header={'Server Settings'}>
            <TextSettingContainer label="Server Url" settingKey={ConfigKeys.server_url} />
        </IndividualSettingsPanel>
    }
}
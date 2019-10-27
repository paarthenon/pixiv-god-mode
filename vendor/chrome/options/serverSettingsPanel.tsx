import * as React from 'react';

import {TextSettingContainer} from 'vendor/chrome/options/textSettingContainer';
import ConfigKeys from 'src/configKeys';

import {IndividualSettingsPanel} from 'src/components/settings/individualSettingsPanel';

export const ServerSettingsPanel: React.FC<{}> = () => (
    <IndividualSettingsPanel header={'Server Settings'}>
        <TextSettingContainer label='Server Url' settingKey={ConfigKeys.server_url} />
    </IndividualSettingsPanel>
);

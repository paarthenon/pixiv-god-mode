import * as React from 'react';

import {IndividualSettingsPanel} from 'src/components/settings/individualSettingsPanel';
import {BooleanSettingContainer} from 'vendor/chrome/options/booleanSettingContainer';
import SettingKeys from 'src/settingKeys';

export const MangaSettingsPanel: React.FC<{}> = () => (
    <IndividualSettingsPanel header={'Manga Page'}>
        <BooleanSettingContainer
            settingKey={SettingKeys.pages.manga.inject.toolbox}
            label={'Inject extra buttons (previous, next, download, open folder)'}
        />
        <BooleanSettingContainer
            settingKey={SettingKeys.pages.manga.loadFullSize}
            label={'Load full size versions of manga images'}
        />
    </IndividualSettingsPanel>
);

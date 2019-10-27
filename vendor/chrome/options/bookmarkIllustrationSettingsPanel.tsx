import * as React from 'react';

import {IndividualSettingsPanel} from 'src/components/settings/individualSettingsPanel';
import {BooleanSettingContainer} from 'vendor/chrome/options/booleanSettingContainer';
import SettingKeys from 'src/settingKeys';

export const BookmarkIllustrationSettingsPanel: React.FC<{}> = () => (
    <IndividualSettingsPanel header='Bookmark Illustration Page'>
        <BooleanSettingContainer
            settingKey={SettingKeys.pages.bookmarkIllustration.inject.viewAll}
            label={'Inject view all button'}
        />
        <BooleanSettingContainer
            settingKey={SettingKeys.pages.bookmarkIllustration.skipToDetail}
            label={'Skip to bookmark detail page'}
        />
    </IndividualSettingsPanel>
);

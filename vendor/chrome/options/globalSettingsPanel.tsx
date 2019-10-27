import * as React from 'react';

import {IndividualSettingsPanel} from 'src/components/settings/individualSettingsPanel';
import {BooleanSettingContainer} from 'vendor/chrome/options/booleanSettingContainer';
import SettingKeys from 'src/settingKeys';

export const GlobalSettingsPanel: React.FC<{}> = () => (
    <IndividualSettingsPanel header='Global Settings'>
        <BooleanSettingContainer
            settingKey={SettingKeys.global.inject.pagingButtons}
            label={'Inject first and last page buttons where relevant'}
        />
        <BooleanSettingContainer
            settingKey={SettingKeys.global.inject.openToArtistButton}
            label={'Inject open to artist folder on user profile'}
        />
        <BooleanSettingContainer
            settingKey={SettingKeys.global.directToManga}
            label={'Thumbnails link directly to the manga page'}
        />
        <BooleanSettingContainer
            settingKey={SettingKeys.global.fadeDownloadedImages}
            label={'Fade out downloaded images (requires server)'}
        />
        <BooleanSettingContainer
            settingKey={SettingKeys.global.fadeArtistRecommendationsAlreadyBookmarked}
            label={"Fade out recommendations for artists you've already got bookmarked"}
        />
        <BooleanSettingContainer
            settingKey={SettingKeys.global.fadeImagesByBookmarkedArtists}
            label={"Fade out images by artists you've bookmarked"}
        />
    </IndividualSettingsPanel>
);

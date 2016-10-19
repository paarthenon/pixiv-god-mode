import Mailman from 'vendor/chrome/mailman'

import ConfigKeys from 'src/configKeys'
import SettingKeys from 'src/settingKeys'


let defaultSettings: { [id:string]:any } = {};

let trueSettings = [
	SettingKeys.global.translateTags,
	SettingKeys.global.directToManga,
	SettingKeys.global.inject.openToArtistButton,
	SettingKeys.global.inject.pagingButtons,
	SettingKeys.global.fadeDownloadedImages,
	SettingKeys.pages.illust.inject.toolbar,
	SettingKeys.pages.illust.addBookmarkAsModal,
	SettingKeys.pages.illust.autoOpen,
	SettingKeys.pages.illust.boxImage,
	SettingKeys.pages.manga.inject.toolbox,
	SettingKeys.pages.manga.loadFullSize,
	SettingKeys.pages.manga.fitImage,
	SettingKeys.pages.works.inject.openInTabs,
	SettingKeys.pages.works.autoDarken,
	SettingKeys.pages.bookmarkIllustration.inject.viewAll,
];

trueSettings.forEach(setting => {
	defaultSettings[setting] = true;
});

export function getUserSettings() {
	return Mailman.Background.getConfig({key: ConfigKeys.user_settings})
		.then(resp => resp.value)
		.catch(error => ({}));
}
export function getSetting(key: string) {
	return getUserSettings().then((userSettings: { [id: string]: any }) => {
		if (userSettings && key in userSettings) {
			return userSettings[key];
		} else {
			return defaultSettings[key] || false;
		}
	});
}

export function setSetting(key:string, value: boolean) {
	return getUserSettings().then((userSettings:{ [id: string]: any }) => {
			userSettings[key] = value;
			Mailman.Background.setConfig({key: ConfigKeys.user_settings, value: userSettings});
		});
}
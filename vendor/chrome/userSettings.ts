import Mailman from './mailman'

import ConfigKeys from '../../src/configKeys'
import SettingKeys from '../../src/settingKeys'


let defaultSettings: { [id:string]:any } = {};

let defaultTuples: [string, boolean][] = [
	[SettingKeys.pages.illust.autoOpen, true],
	[SettingKeys.pages.illust.boxImage, true],
	[SettingKeys.pages.manga.loadFullSize, true],
	[SettingKeys.pages.manga.boxImages, true],
	[SettingKeys.pages.works.autoDarken, true],
	[SettingKeys.pages.works.directToManga, true],
	[SettingKeys.pages.works.mangaLinkToFull, true],
	[SettingKeys.pages.bookmarkIllustration.fadeDownloaded, true],
	[SettingKeys.pages.bookmarkIllustration.fadeBookmarked, true]
];

defaultTuples.forEach(tuple => {
	let [key, value] = tuple;
	defaultSettings[key] = value;
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
			return defaultSettings[key];
		}
	});
}

export function setSetting(key:string, value: boolean) {
	return getUserSettings().then((userSettings:{ [id: string]: any }) => {
			userSettings[key] = value;
			Mailman.Background.setConfig({key: ConfigKeys.user_settings, value: userSettings});
		});
}
import * as Deps from './deps'
let Config = Deps.Container.config;
import ConfigKeys from './configKeys'

export let settingKeys = {
	pages: {
		illust: {
			autoOpen: 'ILLUST_PAGE_AUTO_OPEN',
			boxImage: 'ILLUST_PAGE_BOX_IMAGE_IN_WINDOW'
		},
		manga: {
			loadFullSize: 'MANGA_PAGE_LOAD_FULL_SIZE_IMAGES',
			boxImages: 'MANGA_PAGE_BOX_IMAGES_IN_WINDOW'
		},
		works: {
			autoDarken: 'WORKS_PAGE_AUTO_DARKEN',
			directToManga: 'WORKS_PAGE_OPEN_MANGA_DIRECTLY',
			mangaLinkToFull: 'WORKS_PAGE_REPLACE_MANGA_LINKS_TO_FULL_SIZE'
		}
	}
};

let defaultSettings: { [id:string]:any } = {};

let defaultTuples: [string, boolean][] = [
	[settingKeys.pages.illust.autoOpen, true],
	[settingKeys.pages.illust.boxImage, true],
	[settingKeys.pages.manga.loadFullSize, true],
	[settingKeys.pages.manga.boxImages, true],
	[settingKeys.pages.works.autoDarken, true],
	[settingKeys.pages.works.directToManga, true],
	[settingKeys.pages.works.mangaLinkToFull, true]
];

defaultTuples.forEach(tuple => {
	let [key, value] = tuple;
	defaultSettings[key] = value;
});

let userSettings:any = Config.get(ConfigKeys.user_settings);
export function getSetting(key: string) {
	return Config.get(ConfigKeys.user_settings).then((userSettings: { [id: string]: any }) => 
		(userSettings && key in userSettings) ? userSettings[key] : defaultSettings[key])
}
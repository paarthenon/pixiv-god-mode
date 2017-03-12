export enum AddToBookmarksButtonType {
	ORIGINAL,
	MODAL,
	ONE_CLICK,
}

let settingKeys = {
	global: {
		inject : {
			pagingButtons: 'GLOBAL_INJECT_PAGING_BUTTONS',
			openToArtistButton: 'GLOBAL_INJECT_OPEN_TO_ARTIST_BUTTON'
		},
		translateTags: 'GLOBAL_TRANSLATE_TAGS',
		autoUpdateDictionary: 'GLOBAL_AUTO_UPDATE_DICTIONARY',
		directToManga: 'GLOBAL_LINK_THUMBNAIL_DIRECTLY_TO_MANGA',
		fadeDownloadedImages: 'GLOBAL_FADE_DOWNLOADED_IMAGES',
		fadeImagesByBookmarkedArtists : 'GLOBAL_FADE_BOOKMARKED_ARTIST_IMAGES',
		fadeArtistRecommendationsAlreadyBookmarked : 'GLOBAL_FADE_ARTIST_RECOMMENDATIONS_ALREADY_BOOKMARKED',
	},
	pages: {
		illust: {
			inject: {
				toolbar: 'ILLUST_PAGE_INJECT_TOOLBAR',
			},
			addBookmarkButtonType: 'ILLUST_PAGE_ADD_BOOKMARK_BUTTON_TYPE', // Not a bool. TODO: this is hacky, create a proper settings object.
			autoOpen: 'ILLUST_PAGE_AUTO_OPEN',
			boxImage: 'ILLUST_PAGE_BOX_IMAGE_IN_WINDOW',
		},
		manga: {
			inject: {
				toolbox: 'MANGA_PAGE_TOOLBOX',
			},
			loadFullSize: 'MANGA_PAGE_LOAD_FULL_SIZE_IMAGES',
		},
		works: {
			inject: {
				openInTabs: 'WORKS_PAGE_INJECT_OPEN_IN_TABS',
			},
			openTabsImagesOnly: 'WORKS_PAGE_OPEN_DIRECT_IMAGES_IN_TABS',
		},
		bookmarkIllustration: {
			inject: {
				viewAll: 'BOOKMARK_ILLUSTRATION_INJECT_VIEW_ALL',
			},
			skipToDetail: 'BOOKMARK_ILLUSTRATION_SKIP_TO_DETAIL_PAGE',
		},
	},
};

export default settingKeys;
let settingKeys = {
	pages: {
		illust: {
			inject: {
				openFolder: 'ILLUST_PAGE_INJECT_OPEN_FOLDER_BUTTON'
			},
			autoOpen: 'ILLUST_PAGE_AUTO_OPEN',
			boxImage: 'ILLUST_PAGE_BOX_IMAGE_IN_WINDOW',
		},
		manga: {
			loadFullSize: 'MANGA_PAGE_LOAD_FULL_SIZE_IMAGES',
			fitImage: 'MANGA_PAGE_FIT_IMAGE',
		},
		works: {
			inject: {
				openFolder: 'WORKS_PAGE_INJECT_OPEN_FOLDER_BUTTON',
				pagingButtons: 'WORKS_PAGE_INJECT_PAGING_BUTTONS',
				openInTabs: 'WORKS_PAGE_INJECT_OPEN_IN_TABS'
			},
			autoDarken: 'WORKS_PAGE_AUTO_DARKEN',
			directToManga: 'WORKS_PAGE_OPEN_MANGA_DIRECTLY',
			openTabsImagesOnly: 'WORKS_PAGE_OPEN_DIRECT_IMAGES_IN_TABS',
		},
		bookmarkIllustration: {
			fadeDownloaded: 'BOOKMARK_ILLUSTRATION_FADE_DOWNLOADED',
			fadeBookmarked: 'BOOKMARK_ILLUSTRATION_FADE_BOOKMARKED',
		},
		artistBookmarks: {
			inject: {
				openFolder: 'ARTIST_BOOKMARKS_INJECT_OPEN_FOLDER_BUTTON',
				pagingButtons: 'ARTIST_BOOKMARKS_INJECT_PAGING_BUTTONS'
			},
			fadeDownloaded: 'ARTIST_BOOKMARKS_FADE_DOWNLOADED',
			fadeBookmarked: 'ARTIST_BOOKMARKS_FADE_BOOKMARKED',
			directToManga: 'ARTIST_BOOKMARKS_OPEN_MANGA_DIRECTLY',
		},
		search: {
			directToManga: 'SEARCH_PAGE_OPEN_MANGA_DIRECTLY',
			fadeDownloaded: 'SEARCH_PAGE_FADE_DOWNLOADED',
			fadeBookmarked: 'SEARCH_PAGE_FADE_BOOKMARKED',
		}
	}
};

export default settingKeys;
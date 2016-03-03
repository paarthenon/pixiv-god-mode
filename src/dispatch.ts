import {BasePage} from './pages/base'
import {RootPage} from './pages/root'
import {IllustrationPage} from './pages/illustration'
import {WorksPage} from './pages/works'
import {BookmarkIllustrationPage} from './pages/bookmarks'
import {MangaPage} from './pages/manga'
import {ArtistBookmarksPage} from './pages/artistBookmarks'
import {SearchPage} from './pages/search'
import {BookmarkAddPage} from './pages/bookmarkAdd'
import {ArtistTagListPage} from './pages/artistTagList'

import {log} from './utils/log'

let patterns = {
	illust: /^http:\/\/www.pixiv.net\/member_illust.php\?mode=medium&illust_id=[0-9]+/,
	manga: /^http:\/\/www.pixiv.net\/member_illust.php\?mode=manga&illust_id=[0-9]+/,
	works: /^http:\/\/www.pixiv.net\/member_illust.php\?id=[0-9]+/,
	bookmarks: /^http:\/\/www.pixiv.net\/bookmark.php\?id=[0-9]+/,
	bookmarkDetail: /^http:\/\/www.pixiv.net\/bookmark_detail.php\?illust_id=[0-9]+/,
	bookmarkDetailAdd: /^http:\/\/www.pixiv.net\/bookmark_add.php\?id=[0-9]+/,
	bookmarkAddIllust: /^http:\/\/www.pixiv.net\/bookmark_add.php\?type=illust&illust_id=[0-9]+/,
	search: /^http:\/\/www.pixiv.net\/search.php/,
	artistTagList: /^http:\/\/www.pixiv.net\/member_tag_all.php?id=[0-9]+/
}

export function dispatch(path:string, jquery:JQueryStatic):RootPage {
	if (path.match(patterns.illust)) {
		return new IllustrationPage(path, jquery);
	}
	if (path.match(patterns.manga)) {
		return new MangaPage(path, jquery);
	}
	if (path.match(patterns.works)) {
		return new WorksPage(path, jquery);
	}
	if (path.match(patterns.bookmarks)) {
		return new ArtistBookmarksPage(path, jquery);
	}
	if (path.match(patterns.bookmarkDetail) || path.match(patterns.bookmarkDetailAdd)) {
		return new BookmarkIllustrationPage(path, jquery);
	}
	if (path.match(patterns.bookmarkAddIllust)) {
		return new BookmarkAddPage(path, jquery);
	}
	if (path.match(patterns.search)) {
		return new SearchPage(path, jquery);
	}
	if (path.match(patterns.artistTagList)) {
		return new ArtistTagListPage(path, jquery);
	}
	return new RootPage(path, jquery);
}

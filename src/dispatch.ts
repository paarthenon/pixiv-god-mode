import {BasePage} from './pages/base'
import {IllustrationPage} from './pages/illustration'
import {WorksPage} from './pages/works'
import {BookmarkIllustrationPage} from './pages/bookmarks'
import {BookmarkMember} from './pages/bookmarkMember'
import {MangaPage} from './pages/manga'
import {ArtistBookmarksPage} from './pages/artistBookmarks'
import {SearchPage} from './pages/search'

import {log} from './utils/log'

let patterns = {
	illust: /^http:\/\/www.pixiv.net\/member_illust.php\?mode=medium&illust_id=[0-9]+/,
	manga: /^http:\/\/www.pixiv.net\/member_illust.php\?mode=manga&illust_id=[0-9]+/,
	works: /^http:\/\/www.pixiv.net\/member_illust.php\?id=[0-9]+/,
	bookmarks: /^http:\/\/www.pixiv.net\/bookmark.php\?id=[0-9]+/,
	bookmarkDetail: /^http:\/\/www.pixiv.net\/bookmark_detail.php\?illust_id=[0-9]+/,
	bookmarkDetailAdd: /^http:\/\/www.pixiv.net\/bookmark_add.php\?id=[0-9]+/,
	bookmarkMember: /^http:\/\/www.pixiv.net\/bookmark_add.php$/,
	search: /^http:\/\/www.pixiv.net\/search.php/
}

export function dispatch(path:string, jquery:JQueryStatic):BasePage {
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
	if (path.match(patterns.bookmarkMember)) {
		return new BookmarkMember(path, jquery);
	}
	if (path.match(patterns.search)) {
		return new SearchPage(path, jquery);
	}
	return new BasePage(path, jquery);
}

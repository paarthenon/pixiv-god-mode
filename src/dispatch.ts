import {BasePage} from 'src/pages/base'
import {RootPage} from 'src/pages/root'
import {IllustrationPage} from 'src/pages/illustration'
import {WorksPage} from 'src/pages/works'
import {BookmarkIllustrationPage} from 'src/pages/bookmarks'
import {MangaPage} from 'src/pages/manga'
import {ArtistBookmarksPage} from 'src/pages/artistBookmarks'
import {SearchPage} from 'src/pages/search'
import {BookmarkAddPage} from 'src/pages/bookmarkAdd'
import {ArtistTagListPage} from 'src/pages/artistTagList'
import {ArtistProfilePage} from 'src/pages/artistProfile'
import {FollowArtistPage} from 'src/pages/followArtist'
import {TagOverviewPage} from 'src/pages/tagOverview'
import {TagDetailPage} from 'src/pages/tagDetail'
import {RawImagePage} from 'src/pages/rawImage'
import {SuggestedUsersPage} from 'src/pages/suggestedUsers'
import {HomePage} from 'src/pages/home'
import {WikiArticlePage} from 'src/pages/wikiArticle'

let patterns = {
	illust: /^http:\/\/www.pixiv.net\/member_illust.php\?mode=medium&illust_id=[0-9]+/,
	manga: /^http:\/\/www.pixiv.net\/member_illust.php\?mode=manga&illust_id=[0-9]+/,
	works: /^http:\/\/www.pixiv.net\/member_illust.php\?.*id=[0-9]+/,
	bookmarks: /^http:\/\/www.pixiv.net\/bookmark.php\?.*id=[0-9]+/,
	bookmarkDetail: /^http:\/\/www.pixiv.net\/bookmark_detail.php\?illust_id=[0-9]+/,
	bookmarkDetailAdd: /^http:\/\/www.pixiv.net\/bookmark_add.php/,
	followArtist: /http:\/\/www.pixiv.net\/bookmark_add.php$/,
	bookmarkAddIllust: /^http:\/\/www.pixiv.net\/bookmark_add.php\?type=illust&illust_id=[0-9]+/,
	search: /^http:\/\/www.pixiv.net\/search.php/,
	artistTagList: /^http:\/\/www.pixiv.net\/member_tag_all.php\?id=[0-9]+/,
	artistProfile: /^http:\/\/www.pixiv.net\/member.php\?id=[0-9]+/,
	tagOverview: /^http:\/\/www.pixiv.net\/tags.php$/,
	tagDetail: /http:\/\/www.pixiv.net\/tags.php\?tag=.+/,
	rawImage: /http:\/\/i[0-9].pixiv.net/,
	suggestedUsers: /http:\/\/www.pixiv.net\/search_user.php$/,
	home: /http:\/\/www.pixiv.net\/$/,
	wiki: /http:\/\/dic.pixiv.net\/a\//,
}

export function dispatch(path:string):RootPage {
	if (path.match(patterns.illust)) {
		return new IllustrationPage(path);
	}
	if (path.match(patterns.manga)) {
		return new MangaPage(path);
	}
	if (path.match(patterns.works)) {
		return new WorksPage(path);
	}
	if (path.match(patterns.bookmarks)) {
		return new ArtistBookmarksPage(path);
	}
	if (path.match(patterns.bookmarkDetail) || path.match(patterns.bookmarkDetailAdd)) {
		return new BookmarkIllustrationPage(path);
	}
	if (path.match(patterns.followArtist)) {
		return new FollowArtistPage(path);
	}
	if (path.match(patterns.bookmarkAddIllust)) {
		return new BookmarkAddPage(path);
	}
	if (path.match(patterns.search)) {
		return new SearchPage(path);
	}
	if (path.match(patterns.artistTagList)) {
		return new ArtistTagListPage(path);
	}
	if (path.match(patterns.artistProfile)) {
		return new ArtistProfilePage(path);
	}
	if (path.match(patterns.tagOverview)) {
		return new TagOverviewPage(path);
	}
	if (path.match(patterns.tagDetail)) {
		return new TagDetailPage(path);
	}
	if (path.match(patterns.rawImage)) {
		return new RawImagePage(path);
	}
	if (path.match(patterns.suggestedUsers)) {
		return new SuggestedUsersPage(path);
	}
	if (path.match(patterns.home)) {
		return new HomePage(path);
	}
	if (path.match(patterns.wiki)) {
		return new WikiArticlePage(path);
	}

	return new RootPage(path);
}

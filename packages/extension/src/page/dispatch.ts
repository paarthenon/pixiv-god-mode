import * as $ from 'cash-dom';
import log from 'page/log';
import {ArtworkPage} from './artwork';
import {GalleryPage} from './gallery';
import {RootPage} from './root';
import {UserPage} from './user';

// import {RootPage} from 'src/pages/root';
// import {IllustrationPage} from 'src/pages/illustration';
// import {WorksPage} from 'src/pages/works';
// import {BookmarkIllustrationPage} from 'src/pages/bookmarkIllustration';
// import {ArtistBookmarksPage} from 'src/pages/artistBookmarks';
// import {SearchPage} from 'src/pages/search';
// import {BookmarkAddPage} from 'src/pages/bookmarkAdd';
// import {ArtistTagListPage} from 'src/pages/artistTagList';
// import {ArtistProfilePage} from 'src/pages/artistProfile';
// import {FollowArtistPage} from 'src/pages/followArtist';
// import {TagOverviewPage} from 'src/pages/tagOverview';
// import {TagDetailPage} from 'src/pages/tagDetail';
// import {RawImagePage} from 'src/pages/rawImage';
// import {HomePage} from 'src/pages/home';
// import {WikiArticlePage} from 'src/pages/wikiArticle';
// import log from 'src/log';

const OLD_PATTERNS = {
    illust: /^http(s?):\/\/www.pixiv.net\/[A-Za-z]+\/artworks\/[0-9]+/,
    works: /^http(s?):\/\/www.pixiv.net\/member_illust.php\?.*id=[0-9]+/,
    bookmarks: /^http(s?)(s?):\/\/www.pixiv.net\/bookmark.php\?.*id=[0-9]+/,
    bookmarkDetail: /^http(s?):\/\/www.pixiv.net\/bookmark_detail.php\?illust_id=[0-9]+/,
    bookmarkAdd: /^http(s?):\/\/www.pixiv.net\/bookmark_add.php/,
    search: /^http(s?):\/\/www.pixiv.net\/search.php/,
    artistTagList: /^http(s?):\/\/www.pixiv.net\/member_tag_all.php\?id=[0-9]+/,
    artistProfile: /^http(s?):\/\/www.pixiv.net\/member.php\?id=[0-9]+/,
    tagOverview: /^http(s?):\/\/www.pixiv.net\/tags.php$/,
    tagDetail: /http(s?):\/\/www.pixiv.net\/tags.php\?tag=.+/,
    rawImage: /http(s?):\/\/i[0-9].pixiv.net/,
    rawImage2: /http(s?):\/\/i.pximg.net/,
    home: /http(s?):\/\/www.pixiv.net\/$/,
    wiki: /http(s?):\/\/dic.pixiv.net\/a\//,
};

const pattern = {
    artwork: /^http(s?):\/\/www.pixiv.net\/[A-Za-z]+\/artworks\/[0-9]+/,
    userPage: /^http(s?):\/\/www.pixiv.net\/[A-Za-z]+\/users\/[0-9]+/,
    userGalleryPage: /^http(s?):\/\/www.pixiv.net\/[A-Za-z]+\/users\/[0-9]+\/(artworks|illustrations|novels|manga)/,
}

/**
 * Return the root page
 * @param path 
 */
export function dispatch(path: string): RootPage {
    log.debug('Dispatching on url: ', path);
    const pageCtrs: [RegExp, () => RootPage][] = [
        [pattern.artwork, () => new ArtworkPage(path)],
        [pattern.userGalleryPage, () => new GalleryPage(path)],
        [pattern.userPage, () => new UserPage(path)],
    ];

    for(const [regexp, ctr] of pageCtrs) {
        if (path.match(regexp)) {
            return ctr();
        }
    }
    return new RootPage(path);
}
/**
 * Central dispatcher based on urls. Technically we might be able to register individual content scripts
 * in the manifest.json and optimize the loading here. Eh.
 */
// export function dispatch(path: string): RootPage {
//     log.info('Dispatching on path', path);

//     if (path.match(patterns.illust)) {
//         return new IllustrationPage(path);
//     }
//     if (path.match(patterns.works)) {
//         return new WorksPage(path);
//     }
//     if (path.match(patterns.bookmarks)) {
//         return new ArtistBookmarksPage(path);
//     }
//     if (path.match(patterns.bookmarkDetail)) {
//         return new BookmarkIllustrationPage(path);
//     }
//     if (path.match(patterns.bookmarkAdd)) {
//         // Bookmarking an illustration and following an artist have the same
//         // path (bookmark_add.php) so we're forced to differentiate by checking
//         // for a unique element on the page.
//         if ($('.bookmark-count._ui-tooltip').length > 0) {
//             return new BookmarkIllustrationPage(path);
//         } else if ($('.bookmark-detail-unit .work').length > 0) {
//             return new BookmarkAddPage(path);
//         } else {
//             return new FollowArtistPage(path);
//         }
//     }
//     if (path.match(patterns.search)) {
//         return new SearchPage(path);
//     }
//     if (path.match(patterns.artistTagList)) {
//         return new ArtistTagListPage(path);
//     }
//     if (path.match(patterns.artistProfile)) {
//         return new ArtistProfilePage(path);
//     }
//     if (path.match(patterns.tagOverview)) {
//         return new TagOverviewPage(path);
//     }
//     if (path.match(patterns.tagDetail)) {
//         return new TagDetailPage(path);
//     }
//     if (path.match(patterns.rawImage) || path.match(patterns.rawImage2)) {
//         return new RawImagePage(path);
//     }
//     if (path.match(patterns.home)) {
//         return new HomePage(path);
//     }
//     if (path.match(patterns.wiki)) {
//         return new WikiArticlePage(path);
//     }

//     return new RootPage(path);
// }

import * as $ from 'jquery';
import {RootPage} from 'src/pages/root';
import {ExecuteOnLoad, ExecuteIfSetting} from 'src/utils/actionDecorators';
import {PixivAssistantServer} from 'src/services';
import * as jQUtils from 'src/utils/document';
import {Container as Deps} from 'src/deps';
import {injectViewAllButton} from 'src/injectors/bookmarkDetailViewAll';

import SettingKeys from 'src/settingKeys';

/**
 * This is the bookmark_detail.php page that appears when viewing the details of one of your bookmarks.
 */
export class BookmarkIllustrationPage extends RootPage {
    public getTagElements() {
        return ['ul.tags a'].map(tag => $(tag)).concat(super.getTagElements());
    }

    protected executeOnEachImage<T>(func: (image: JQuery) => T) {
        $('section#illust-recommend li.image-item:not([data-pa-processed="true"])')
            .toArray()
            .forEach(image => func($(image)));
    }

    @ExecuteIfSetting(SettingKeys.pages.bookmarkIllustration.inject.viewAll)
    public injectItems() {
        injectViewAllButton('View All', this.loadAllBookmarks);
    }

    @ExecuteOnLoad
    public injectTrigger() {
        new MutationObserver(this.experimentalFade.bind(this)).observe(
            $('section#illust-recommend ul')[0],
            {childList: true},
        );
    }

    public experimentalFade() {
        this.executeOnEachImage(image => {
            let artist = jQUtils.artistFromJQImage(image);
            let imageObj = jQUtils.imageFromJQImage(image);

            Deps.getSetting(SettingKeys.global.fadeDownloadedImages).then(
                settingValue => {
                    if (settingValue) {
                        PixivAssistantServer.imageExistsInDatabase(artist, imageObj).then(
                            exists => {
                                if (exists) {
                                    image.addClass('pa-hidden-thumbnail');
                                }
                            },
                        );
                    }
                },
            );

            Deps.getSetting(SettingKeys.global.fadeImagesByBookmarkedArtists).then(
                settingValue => {
                    if (settingValue) {
                        let url = jQUtils.artistUrlFromJQImage(image);
                        Deps.isPageBookmarked(url).then(bookmarked => {
                            if (bookmarked) {
                                image.addClass('pa-hidden-thumbnail');
                            }
                        });
                    }
                },
            );

            image.attr('data-pa-processed', 'true');
        });
    }

    @ExecuteIfSetting(SettingKeys.pages.bookmarkIllustration.skipToDetail)
    public moveOnToDetail() {
        // Do not trigger if this is a bookmark_detail page.
        if (/bookmark_add/.test(window.location.href)) {
            let detailLink = $('.bookmark-count')[0];
            if (detailLink) detailLink.click();
        }
    }

    public loadAllBookmarks() {
        Deps.execOnPixiv(pixiv => {
            for (var i = 15; i < pixiv.context.illustRecommendLimit; i += 15) {
                $('.js-recommend-load-more').click();
            }
        });
    }
}

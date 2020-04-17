import * as $ from 'jquery';
import {RootPage} from 'src/pages/root';
import {ExecuteIfSetting} from 'src/utils/actionDecorators';
import {Container as Deps} from 'src/deps';
import {injectViewAllButton} from 'src/injectors/bookmarkDetailViewAll';

import SettingKeys from 'src/settingKeys';

/**
 * This is the bookmark_detail.php page that appears when viewing the details of one of your bookmarks.
 */
export class BookmarkIllustrationPage extends RootPage {
    public getTagSelectors() {
        return ['ul.tags a'];
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

    public loadAllBookmarks() {
        Deps.execOnPixiv(pixiv => {
            for (var i = 15; i < pixiv.context.illustRecommendLimit; i += 15) {
                $('.js-recommend-load-more').click();
            }
        });
    }
}

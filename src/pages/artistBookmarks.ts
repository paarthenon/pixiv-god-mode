import * as $ from 'jquery';
import * as pathUtils from 'src/utils/path';
import {ExecuteIfSetting} from 'src/utils/actionDecorators';
import {GalleryPage} from 'src/pages/gallery';
import {Model} from 'pixiv-assistant-common';
import SettingKeys from 'src/settingKeys';

/**
 * A listing of images that a specific artist has bookmarked.
 */
export class ArtistBookmarksPage extends GalleryPage {
    public get artistId(): number {
        return pathUtils.getArtistId(this.path);
    }
    public get artistName(): string {
        return $('h1.user').text();
    }
    public get artist(): Model.Artist {
        return {id: this.artistId, name: this.artistName};
    }
    
    @ExecuteIfSetting(SettingKeys.global.inject.pagingButtons)
    public async injectPagingButtons() {
        super.injectPagingButtons();
    }
}

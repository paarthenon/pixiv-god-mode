import * as $ from 'jquery';
import * as pathUtils from 'src/utils/path';
import {ExecuteOnLoad, ExecuteIfSetting} from 'src/utils/actionDecorators';
import {RootPage} from 'src/pages/root';
import {Model} from 'pixiv-assistant-common';
import log from 'src/log';
import settingKeys from 'src/settingKeys';

/**
 * The initial overview page of an artist.
 */
export class ArtistProfilePage extends RootPage {
    public get artistId(): number {
        return pathUtils.getArtistId(this.path);
    }
    public get artistName(): string {
        return $('#root h1').first().text();
    }
    public get artist(): Model.Artist {
        return {id: this.artistId, name: this.artistName};
    }

    @ExecuteOnLoad
    public debug() {
        log.info('Artist Profile page reached', this.artist)
    }

    @ExecuteIfSetting(settingKeys.pages.artistProfile.skipPage)
    public skipToWorks() {
        log.info('Skipping to works page')
        window.location.href = `/member_illust.php?id=${this.artistId}`;
        log.warn('Should be on other page. Why did you see this?');
    }
}

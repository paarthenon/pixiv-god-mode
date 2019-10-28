import * as $ from 'jquery';
import * as pathUtils from 'src/utils/path';
import {ExecuteOnLoad} from 'src/utils/actionDecorators';
import {RootPage} from 'src/pages/root';
// import {injectUserRelationshipButton} from 'src/injectors/openFolderInjector';
import {Model} from 'pixiv-assistant-common';
import log from 'src/log';
// import {awaitElement} from 'src/utils/document';

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
        log.info('Artist Profile page reached')
    }

    // @ExecuteOnLoad
    // public injectPageElements() {
    //     injectUserRelationshipButton(this.artist);
    // }

    // @ExecuteOnLoad
    // public async skipToWorks() {
    //     log.info('Skipping to works page')
    //     // const $elem = await awaitElement(`a[href="/member_illust.php?id=${this.artistId}"]`);
    //     const $elem = $(`< a href="/member_illust.php?id=${this.artistId}" ></a>`);
    //     $elem.click();
    //     log.info('Should be on other page. Why did you see this?');
    // }
}

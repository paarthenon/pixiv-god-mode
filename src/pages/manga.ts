/**
 * DEPRECATED FILE.
 */
import * as $ from 'jquery';
import * as pathUtils from 'src/utils/path';
import * as pixivBridge from 'src/utils/pixivBridge';
import {RootPage} from 'src/pages/root';
import {ExecuteOnLoad, ExecuteIfSetting} from 'src/utils/actionDecorators';
import {PixivAssistantServer} from 'src/services';
import {Container as Deps} from 'src/deps';
import SettingKeys from 'src/settingKeys';
import {injectMangaPreviousButton} from 'src/injectors/mangaPreviousButton';
import {injectMangaDownloadButton} from 'src/injectors/mangaDownloadButton';
import {injectMangaNextButton} from 'src/injectors/mangaNextButton';
import {injectMangaOpenFolderButton} from 'src/injectors/mangaOpenFolderButton';
import {injectDownload} from 'src/injectors/wrapImageHover';

import {Model} from 'pixiv-assistant-common';

/**
 * Pixiv's built in manga viewer.
 * 
 * DEPRECATED. This page is no longer used. The artwork page encompasses this functionality. 
 */
export class MangaPage extends RootPage {
    public get artistName(): string {
        return $('section.thumbnail-container a.user').text();
    }
    public get artistId(): number {
        // TODO: Extract to its own function. This currently re-uses the id pattern for URLs which may diverge.
        return pathUtils.getArtistId($('footer ul.breadcrumbs li a.user').attr('href'));
    }
    public get artist(): Model.Artist {
        return {id: this.artistId, name: this.artistName};
    }

    public get illustId(): number {
        return pathUtils.getImageId(this.path);
    }

    @ExecuteOnLoad
    public fitImagesInPage(): void {}

    @ExecuteIfSetting(SettingKeys.pages.manga.inject.toolbox)
    public injectMangaPreviousButton() {
        injectMangaPreviousButton(this.goToPreviousPage.bind(this));
        injectMangaNextButton(this.goToNextPage.bind(this));
        injectMangaDownloadButton(this.downloadMulti.bind(this));
        injectMangaOpenFolderButton(this.openFolder.bind(this));
    }

    @ExecuteOnLoad
    public wrapImages() {
        $('img.image')
            .toArray()
            .forEach(image => {
                let jQImage = $(image);

                injectDownload(jQImage, () => this.downloadSingle(jQImage));
            });
    }

    private downloadSingle(img: JQuery) {
        PixivAssistantServer.download(this.artist, img.attr('data-src'));
    }

    @ExecuteIfSetting(SettingKeys.pages.manga.loadFullSize)
    public autoEmbiggenFixImages(): void {
        pixivBridge.illustDetail(this.illustId).then((response: any) => {
            let extension = response.body[this.illustId].illust_ext;
            let extensionWithDot =
                extension.charAt(0) === '.' ? extension : `.${extension}`;

            $('img.image')
                .toArray()
                .forEach(image => {
                    let jQImage = $(image);
                    // pixiv lazy loads image data, the full url is stored in data-src
                    // and copied over to the source attribute once a user comes into view.
                    let src = jQImage.attr('data-src');
                    let newSrc = pathUtils
                        .getMaxSizeImageUrl(src)
                        .replace(/\.(\w+)$/, extensionWithDot);

                    // Have to alter the data-src as well because if we don't, pixiv will
                    // automatically copy over data-src again
                    jQImage.attr('data-src-backup', src);
                    jQImage.attr('data-src', newSrc);
                    jQImage.attr('src', newSrc);
                });
        });
    }

    // Based on the pixiv manga viewer keybinds
    public goToPreviousPage(): void {
        Deps.execOnPixiv(() => {
            (window as any).colon.ui.shortcut.trigger('K');
        });
    }
    public goToNextPage(): void {
        Deps.execOnPixiv(() => {
            (window as any).colon.ui.shortcut.trigger('J');
        });
    }

    public downloadMulti(): void {
        let fullImages = $('img.image')
            .toArray()
            .map(img => $(img).attr('data-src'));
        PixivAssistantServer.downloadMulti(
            {id: this.artistId, name: this.artistName},
            fullImages,
        );
    }

    public openFolder(): void {
        PixivAssistantServer.openFolder(this.artist);
    }
}

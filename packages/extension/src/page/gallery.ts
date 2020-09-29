import {extract, generateImageLink} from 'util/path';
import {OnLoad} from './decorators';
import {RootPage} from './root';
import _log from './log';
import {PageAction} from './pageAction';
import {strEnum} from 'variant';
import {getUserProfile} from 'core/API';
import {keys} from 'lodash';
import {browser} from 'webextension-polyfill-ts';
import {BGCommand} from 'core/message';
const log = _log.setCategory('Gallery');

export const GalleryActions = strEnum([
    'OpenInTabs'
]);
export type GalleryActions = keyof typeof GalleryActions;
export class GalleryPage extends RootPage {
    get pageNum() {
        const pageStr = extract(this.url, /\?p=([0-9]+)/)
        return pageStr ? parseInt(pageStr) : 1;
    }

    get userId() {
        return extract(this.url, /www.pixiv.net\/[A-Za-z]+\/users\/([0-9]+)\//)
    }

    get artworkType() {
        return extract(this.url, /www.pixiv.net\/[A-Za-z]+\/users\/[0-9]+\/(artworks|illustrations|novels|manga)/);
    }

    @OnLoad
    public first() {
        log.trace('Init gallery', this.pageNum, this.artworkType);
    }

    public async getPageActions(): Promise<PageAction[]> {
        return [
            {
                type: GalleryActions.OpenInTabs,
                label: 'Open each artwork in a tab',
                extra: `p. ${this.pageNum}`,
            }
        ]
    }
    public async handlePageAction(action: PageAction) {
        const profile = await getUserProfile(parseInt(this.userId!));
        log.trace('discovered profile', profile, keys(profile.body.illusts));

        const screenIt = (x: any): x is object => typeof x === 'object' && keys(x).length >= 1 ? x : {};
        switch(action.type) {
            case GalleryActions.OpenInTabs:
                const PAGE_SIZE = 48;

                const combined = [
                    ...keys(screenIt(profile.body.illusts)),
                    ...keys(screenIt(profile.body.manga)),
                    ...keys(screenIt(profile.body.novels)),
                ];
                log.trace('combo', combined);
                const newestFirst = combined.sort((a, b) => parseInt(b) - parseInt(a));
                const selection = newestFirst.slice((this.pageNum - 1) * PAGE_SIZE, this.pageNum * PAGE_SIZE);
                log.trace(selection);

                const urls = selection.map(generateImageLink);
                browser.runtime.sendMessage(BGCommand.createTabs(urls));
                break;
        }
    }
}
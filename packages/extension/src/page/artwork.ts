import {OnLoad} from './decorators';
import {RootPage} from './root';
import _log from './log';
const log = _log.setCategory('Artwork');

import {getBlob, getIllustInfo, getIllustPages, getUgoiraMeta, getUser, getUserProfile} from 'core/API';
import {extract, getFileName} from 'util/path';
import {IllustrationInfo, IllustrationType, UgoiraMeta} from 'core/api/models';
import {GenerateElement} from 'util/page';
import React from 'react';
import $ from 'cash-dom';
import {injectTrayButton} from './inject';
import {browser} from 'webextension-polyfill-ts';
import {BGCommand} from 'core/message';
import {saveAs} from 'file-saver';
import * as whammy from 'whammy';
import jszip from 'jszip';
import {execSequentially} from 'util/promise';
import {spawnCanvas} from 'util/document';
import {explodeImagePathPages} from 'util/path';
import {PageContext} from './context';
import {fields, strEnum, TypeNames, variant, variantList, VariantOf} from 'variant';
import {DownloadConfig, PageAction} from './pageAction';
import {postBloom} from 'core/bloom';
import {update} from 'lodash';

export const ArtworkAction = strEnum([
    'Download',
    'SendToBloom',
    'SendToBloomSplit',
]);
export type ArtworkAction = keyof typeof ArtworkAction;
export class ArtworkPage extends RootPage {
    public isBusy = false;

    @OnLoad
    public injectUnloadCallback() {
        const message = 'Pixiv Assistant is currently processing. Please leave the page open';
        window.addEventListener('beforeunload', event => {
            if (this.isBusy) {
                event.returnValue = message;
                return message;
            }
            return undefined;
        });
    }

    get workID() {
        return ArtworkPage.getArtworkId(this.url);
    }

    get bloomTag() {
        return this.context.then(c => {
            const ctx = c as PageContext<'Artwork'>;
            return `${ctx.artist.name} (${ctx.artist.userId})`  
        })
    }

    @OnLoad
    async testLog() {
        log.trace('Artwork Page loaded');

        log.debug('Discovered own ID as', this.workID);
        if (this.workID) {
            const info = await getIllustInfo(this.workID);
            log.debug('Got illustration info', info);

            // add item to dom
            injectTrayButton('DL', () => {
                log.trace('Clicked download button');
                this.simpleDownload({});
            });
        } else {
            log.error('Could not parse ')
        }
    }

    async contextLoad() {

    }
    
    protected async getContext() {
        if (this.workID) {
            const resp = await getIllustInfo(this.workID);
            const artistResp = await getUser(parseInt(resp.body.userId));
            const artistProfileResp = await getUserProfile(parseInt(resp.body.userId));
            const pageResp = resp.body.pageCount > 1 ? await getIllustPages(this.workID) : undefined;
            return PageContext.Artwork({
                illustInfo: resp.body,
                artist: artistResp.body,
                artistProfile: artistProfileResp.body,
                pages: pageResp?.body,
            })
        } else {
            return super.getContext();
        }

    }
    public async getPageActions(): Promise<PageAction[]> {
        const info = await getIllustInfo(this.workID!);
        
        const baseOptions: PageAction[] = [
            {
                type: ArtworkAction.Download,
                label: 'Download',
                icon: 'import',
            },
            {
                type: ArtworkAction.SendToBloom,
                label: 'Save to Bloom',
                icon: 'document-share',
            },
        ];

        if (info.body.pageCount > 1) {
            return [
                ...baseOptions,
                {
                    type: ArtworkAction.SendToBloomSplit,
                    label: 'Send to Bloom',
                    icon: 'new-layers',
                    subtitle: 'as separate files',
                },

            ]
        } else {
            return baseOptions;
        }
    }
    public async handlePageAction(action: PageAction) {
        switch (action.type) {
            case ArtworkAction.Download:
                this.simpleDownload(action.extra);
                break;
            case ArtworkAction.SendToBloom:
                this.isBusy = true;
                this.simpleSendBloom(action.extra).then(() => {
                    this.isBusy = false;
                })
                break;
            case ArtworkAction.SendToBloomSplit:
                this.isBusy = true;
                getIllustInfo(this.workID!).then(async info => {
                    if (info.body.pageCount > 1) {
                        await this.simpleSendBloomSplit(action.extra);
                    } else {
                        await this.simpleSendBloom(action.extra);
                    }
                    this.isBusy = false;
                });
        }
    }

    public static getArtworkId(url: string) {
        const idStr = extract(url, /artworks\/([0-9]*)/);
        if (idStr != undefined) {
            return parseInt(idStr);
        }
    }

    public async simpleDownload(config: DownloadConfig = {}) {
        if (this.workID) {
            const info = await getIllustInfo(this.workID);
            browser.runtime.sendMessage(BGCommand.setBadge('...'));
            this.isBusy = true;
            const ret = await this.download(info.body, config);
            this.isBusy = false;
            browser.runtime.sendMessage(BGCommand.setBadge('done!', 2500));
            return ret;
        }
    }
    public async simpleSendBloom(config: DownloadConfig = {}) {
        if (this.workID) {
            const info = await getIllustInfo(this.workID);
            switch(info.body.illustType) {
                case IllustrationType.Picture:
                case IllustrationType.Manga:
                    if (info.body.pageCount > 1) {
                        const zip = await downloadManga(info.body, config);
                        return postBloom(`${this.workID}.zip`, zip, [await this.bloomTag]);
                    } else {
                        const url = info.body.urls.original;
                        return postBloom(getFileName(url), await getBlob(url), [await this.bloomTag]);
                    }
                case IllustrationType.Animation:
                    const metaResponse = await getUgoiraMeta(parseInt(info.body.illustId));
                    const vid = await this.downloadAnimation(info.body, metaResponse.body)
                    return postBloom(`${this.workID}.webm`, vid, [await this.bloomTag]);
            }
        }
    }

    public async simpleSendBloomSplit(config: DownloadConfig) {
        if (this.workID) {
            const info = await getIllustInfo(this.workID!);
            const urls = explodeImagePathPages(info.body.urls.original, info.body.pageCount)
                .filter((_, i) => config.checked?.[String(i)] ?? true);

            log.trace('urls to split on', urls);

            Promise.all(urls.map(async url => postBloom(getFileName(url), await getBlob(url), [await this.bloomTag])));
            log.trace('Finished submitting');
        }
    }

    public async download(work: IllustrationInfo, config: DownloadConfig = {}) {
        log.trace('DL Entered');

        switch (work.illustType) {
            case IllustrationType.Picture:
            case IllustrationType.Manga:
                if (work.pageCount > 1) {
                    log.trace('DL MULTIPAGE IMAGE');
                    return this.saveManga(work, config);
                } else {
                    log.trace('DL IMAGE');
                    return saveImage(work.urls.original);
                }
            case IllustrationType.Animation:
                log.trace('DL ANIMATION')
                const metaResponse = await getUgoiraMeta(parseInt(work.illustId));
                return this.saveAnimation(work, metaResponse.body);
        }
    }

    protected async saveAnimation(work: IllustrationInfo, meta: UgoiraMeta) {
        const blob = await this.downloadAnimation(work, meta);
        saveAs(blob, `${work.illustId}.webm`);
    }
    protected async downloadAnimation(work: IllustrationInfo, meta: UgoiraMeta): Promise<Blob> {
        this.isBusy = true;
        const blob = await processUgoira(work, meta, text => {
            this.setBadgeText(text);
        });
        return blob;
    }
    protected async saveManga(work: IllustrationInfo, config: DownloadConfig) {
        const zippedFile = await downloadManga(work, config);
        const objUrl = URL.createObjectURL(zippedFile);
        saveAs(objUrl, `${work.illustId}.zip`);
    }
}

/**
 * Generate a Blob webm.
 * @param work 
 * @param meta 
 * @param updateText 
 */
async function processUgoira(
    work: IllustrationInfo,
    meta: UgoiraMeta,
    updateText: (text: string) => void,
): Promise<Blob> {
    // need to specify 0.9 because of a bug in whammy
    const video = new whammy.Video(undefined, 0.9); 

    log.info('Processing ugoira', work.illustId, meta.originalSrc);

    log.trace('Downloading frames');
    const zipBlob = await getBlob(meta.originalSrc);
    const zip$ = await jszip().loadAsync(zipBlob);

    log.trace('Loading frames');
    let fileData: {[id: string]: Promise<string>} = {};
    zip$.forEach((path, file) => {
        fileData[path] = file.async('base64');
    });

    let currentFrame = 1;
    await execSequentially(meta.frames, async frame => {
        updateText(`${Math.round((100.0 * currentFrame++) / meta.frames.length)}%`);
        log.trace(`Processing frame ${currentFrame} of ${meta.frames.length}`);
        const rawFrame = await fileData[frame.file];
        let dataUrl = `data:${meta.mime_type};base64,${rawFrame}`;
        return spawnCanvas(dataUrl, work).then(canvas => video.add(canvas, frame.delay));
    });

    updateText('done!');
    return video.compile();
}

function saveImage(url: string) {
    log.trace('Downloading image from', url);
    const fileName = url.split('/').pop();
    saveAs(url, fileName);
}

async function downloadManga(work: IllustrationInfo, config: DownloadConfig = {}) { // TODO: This optional thing is *actually* a dirty hack, figure out why config isn't being included.
    log.trace('Downloading manga, found', work.pageCount, 'pages');
    
    const zip = new jszip();
    const urls = explodeImagePathPages(work.urls.original, work.pageCount);

    urls.forEach((url, i) => {
        if (config.checked?.[String(i)] ?? true) {
            zip.file(getFileName(url), getBlob(url));
        }
    })

    const zippedFile = await zip.generateAsync({type: 'blob'});
    return zippedFile;
}
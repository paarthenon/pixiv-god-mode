import {OnLoad} from './decorators';
import {RootPage} from './root';
import _log from './log';
const log = _log.setCategory('Artwork');

import {getBlob, getIllustInfo, getUgoiraMeta} from 'core/API';
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

export class ArtworkPage extends RootPage {
    public isBusy = false;

    get workID() {
        return ArtworkPage.getArtworkId(this.url);
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
                this.download(info.body);
            });
        } else {
            log.error('Could not parse ')
        }
    }

    public static getArtworkId(url: string) {
        const idStr = extract(url, /artworks\/([0-9]*)/);
        if (idStr != undefined) {
            return parseInt(idStr);
        }
    }

    public async download(work: IllustrationInfo) {
        log.trace('DL Entered');

        switch (work.illustType) {
            case IllustrationType.Picture:
                if (work.pageCount > 1) {
                    log.trace('DL MULTIPAGE IMAGE');
                    downloadManga(work);
                } else {
                    log.trace('DL IMAGE');
                    downloadImage(work.urls.original);
                }
                break;
            case IllustrationType.Manga:
                log.trace('DL MANGA');
                downloadManga(work);
            case IllustrationType.Animation:
                log.trace('DL ANIMATION')
                const metaResponse = await getUgoiraMeta(parseInt(work.illustId));
                this.downloadAnimation(work, metaResponse.body);
        }
    }

    protected async downloadAnimation(work: IllustrationInfo, meta: UgoiraMeta) {
        this.isBusy = true;
        const blob = await processUgoira(work, meta, log.trace);

        saveAs(blob, `${work.illustId}.webm`);
    }
    protected async downloadManga(work: IllustrationInfo) {
        downloadManga(work);
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

    updateText('Downloading frames');
    const zipBlob = await getBlob(meta.originalSrc);
    const zip$ = await jszip().loadAsync(zipBlob);

    updateText('Loading frames');
    let fileData: {[id: string]: Promise<string>} = {};
    zip$.forEach((path, file) => {
        fileData[path] = file.async('base64');
    });

    let currentFrame = 1;
    await execSequentially(meta.frames, async frame => {
        updateText(`Processing frame ${currentFrame++} of ${meta.frames.length}`);
        const rawFrame = await fileData[frame.file];
        let dataUrl = `data:${meta.mime_type};base64,${rawFrame}`;
        return spawnCanvas(dataUrl, work).then(canvas => video.add(canvas, frame.delay));
    });

    updateText('Finishing encode');
    return video.compile();
}

function downloadImage(url: string) {
    log.trace('Downloading image from', url);
    const fileName = url.split('/').pop();
    saveAs(url, fileName);
}

async function downloadManga(work: IllustrationInfo) {
    log.trace('Downloading manga, found', work.pageCount, 'pages');
    
    const zip = new jszip();
    const urls = explodeImagePathPages(work.urls.original, work.pageCount);
    urls.forEach(url => {
        zip.file(getFileName(url), getBlob(url));
    })

    const zippedFile = await zip.generateAsync({type: 'blob'});
    const objUrl = URL.createObjectURL(zippedFile);
    saveAs(objUrl, `${work.illustId}.zip`);
}
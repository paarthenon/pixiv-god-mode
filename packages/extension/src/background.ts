import {browser} from 'webextension-polyfill-ts';

import {BGCommand} from 'core/message';
import log from 'log';
import {match} from 'variant';

log.trace('Logging started on background page')

// honestly don't know if this part is necessary
browser.webRequest.onBeforeSendHeaders.addListener(
    details => {
        details.requestHeaders?.push({
            name: 'Referer',
            value: 'https://www.pixiv.net/',
        });
        return {requestHeaders: details.requestHeaders};
    },
    {
        urls: ['*://*.pixiv.net/*', '*://*.pximg.net/*'],
    },
    ['blocking', 'requestHeaders', 'extraHeaders'],
);

declare var chrome: any;
browser.runtime.onMessage.addListener((msg: BGCommand, sender) => {
    match(msg, {
        downloadd: ({url}) => {
            log.trace('BG DL 2: ', url);
            browser.downloads.download({url, filename: 'picture.jpg', saveAs: true});
        }
    })
})
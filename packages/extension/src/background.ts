import 'regenerator-runtime/runtime.js';
import {browser} from 'webextension-polyfill-ts';

import {BGCommand} from 'core/message';
import log from 'log';
import {match} from 'variant';
import {PageContext} from 'page/context';

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

const CONTEXT_CACHE: {[tabId: string]: PageContext} = {};

declare var chrome: any;
browser.runtime.onMessage.addListener(async (msg: BGCommand, sender) => {
    return match(msg, {
        downloadd: ({url}) => {
            log.trace('BG DL 2:', url);
            browser.downloads.download({url, filename: 'picture.jpg', saveAs: true});
        },
        setBadge: ({text}) => {
            log.trace('BG set badge', text);
            browser.browserAction.setBadgeText({text});
        },
        cacheContext: ({context}) => {
            log.trace('Storing context for tabId', sender.tab?.id);
            CONTEXT_CACHE[String(sender.tab?.id)] = context;
        },
        getContext: ({tabId}) => {
            log.trace('Getting context for tabId', tabId);

            return CONTEXT_CACHE[String(tabId)];
        },
    })
})
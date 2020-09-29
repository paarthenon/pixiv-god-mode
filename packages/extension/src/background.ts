import 'regenerator-runtime/runtime.js';
import {browser} from 'webextension-polyfill-ts';

import {BGCommand, KamiSettings, PageCommand} from 'core/message';
import log from 'log';
import {match} from 'variant';
import {PageContext} from 'page/context';
import {PageAction} from 'page/pageAction';
import {ArtworkAction} from 'page/artwork';
import {execSequentially} from 'util/promise';

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
const ACTION_CACHE: {[tabId: string]: PageAction[]} = {};

const settings: KamiSettings = {
    saveAction: ArtworkAction.Download,
}

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
        cacheActions: ({actions}) => {
            log.trace('caching actions');
            ACTION_CACHE[String(sender.tab?.id)] = actions;
        },
        getActions: ({tabId}) => {
            log.trace('getting actions');
            return ACTION_CACHE[String(tabId)];
        },
        getSettings: _ => {
            return {...settings};
        },
        setSettings: ({payload}) => {
            log.trace('set settings', payload);

            Object.assign(settings, payload);
        },
        createTabs: ({payload}) => {
            execSequentially(payload, url => browser.tabs.create({url}));
        },
    })
})


// CONTEXT MENUS

const CMKeys = {
    save: 'kami-sama-save', //combined so that there isn't a menu.
};

let selectedAction = ArtworkAction.Download;

function patchWindow() {
    const win = window as any;
    win.selectedAction = ArtworkAction.Download;
    win.ArtworkAction = ArtworkAction;
}

patchWindow();

browser.contextMenus.create({
    id: CMKeys.save,
    title: 'Save',
    contexts: ['all'],
    documentUrlPatterns: [
        "*://*.pixiv.net/*",
        "*://*.pximg.net/*",
    ],
    onclick: () => {
        performActionOnCurrentTab(settings.saveAction);
    },
});

async function performActionOnCurrentTab(actionType: string) {
    const [tab] = await browser.tabs.query({currentWindow: true, active: true});
    
    const actions = ACTION_CACHE[String(tab.id)];

    const dl = actions.find(a => a.type === actionType);
    if (dl) {
        browser.tabs.sendMessage(tab.id!, PageCommand.PerformAction(dl));
    } else {
        browser.browserAction.setBadgeText({text: 'NO DOWNLOAD ACTION DEFINED', tabId: tab.id})
    }
}

import 'regenerator-runtime/runtime.js';

import {dispatch} from 'page/dispatch';
import log from 'page/log';
import {ElementObserver} from 'util/elementObserver';
import {browser} from 'webextension-polyfill-ts';
import {match} from 'variant';
import {BGCommand, CSCommand, PageCommand} from 'core/message';
import {RootPage} from 'page/root';

log.trace('Init - Content Script');

const stash = {
    page: undefined as (RootPage | undefined),
};

stash.page = dispatch(window.location.href);

log.debug('got page', stash.page);

// This works but *may* end up causing glitches as pages don't clean up their
// listeners before they transition away. TODO figure it out.

// Oh right. It's necessary because pixiv finally became an SPA and page loads
// don't mean what they used to. I'm now just checking for routing differences
// whenever the app's root node mutates. There's probably a better way but this
// sure does work right now. 
const obs = new ElementObserver(document.body);
let oldLocation = document.location.href;
obs.subscribe(() => {
    const newLocation = document.location.href;
    if (oldLocation !== newLocation) {
        log.info('Detected a location change');
        oldLocation = newLocation
        stash.page = dispatch(newLocation);
        log.info('current page now')
    }
});

browser.runtime.onMessage.addListener(msg => msgHandler(stash.page!, msg));

const msgHandler = async (page: RootPage, msg: PageCommand) => match(msg, {
    GetContext: _ => page.context,
    GetActions: _ => page.getPageActions(),
    PerformAction: ({payload}) => page.handlePageAction(payload),
});
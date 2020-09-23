import 'regenerator-runtime/runtime.js';

import {dispatch} from 'page/dispatch';
import log from 'page/log';

log.trace('Init - Content Script');

const page = dispatch(window.location.href);

log.debug('got page', page);

// NOTE: Should you need it, leagcy-extension has a mutation observer
// that it claims to need because pixiv finally became an SPA.
// I'm going without it for now.

import {ElementObserver} from 'util/elementObserver';

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
        dispatch(newLocation);
    }
})

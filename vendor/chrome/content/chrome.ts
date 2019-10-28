import {AjaxRequest} from 'src/core/IAjax';

import Config from 'vendor/chrome/config';
import {default as Mailman} from 'vendor/chrome/mailman';
import {ExecBroker} from 'vendor/chrome/execBroker';
import {getSetting} from 'vendor/chrome/userSettings';

import * as Dependencies from 'src/deps';
import log from 'src/log';

let broker = new ExecBroker();

let deps: Dependencies.IDependencyContainer = {
    config: new Config(),
    openInTab: (url: string) => Mailman.Background.newTab({url}),
    execOnPixiv: (func: (pixiv: any, props: any) => any, props?: any) =>
        broker.queueExecution(func, props),
    ajaxCall: (req: AjaxRequest<any>) => Mailman.Background.ajax(req),
    getSetting,
    isPageBookmarked: url => Mailman.Background.isPageBookmarked({url}),
    download: (url, filename) => Mailman.Background.download({url, filename}),
};

Dependencies.load(deps);

log.info('Initializing Pixiv Assistant. Preparing to dispatch');

import {dispatch} from 'src/dispatch';
dispatch(document.location.href);

import {ElementObserver} from 'src/core/elementObserver';

// This works but *may* end up causing glitches as pages don't clean up their
// listeners before they transition away. TODO figure it out.

// Oh right. It's necessary because pixiv finally became an SPA and page loads
// don't mean what they used to. I'm now just checking for routing differences
// whenever the app's root node mutates. There's probably a better way but this
// sure does work right now. 
const obs = new ElementObserver(document.getElementById('root'));
let oldLocation = document.location.href;
obs.subscribe(() => {
    const newLocation = document.location.href;
    if (oldLocation !== newLocation) {
        log.info('Detected a location change');
        oldLocation = newLocation
        dispatch(newLocation);
    }
})

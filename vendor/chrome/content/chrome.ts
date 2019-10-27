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

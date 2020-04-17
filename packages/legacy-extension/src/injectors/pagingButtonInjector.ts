import * as $ from 'jquery';
import * as React from 'react';

import {PagingButton} from 'src/components/pagingButton';
import {GenerateElement} from 'src/injectors/utils';
import {awaitElement} from 'src/utils/document';
import appLog from 'src/log';
import uuid = require('uuid');
const log = appLog.setCategory('Paging Injector');

function componentString(className: string, url: string, label: string) {
    return `<a class="${className}" href="${url}">${label}</a>`;
}

const firstNonce = uuid.v4();
const lastNonce = uuid.v4();
export async function injectPagingButtons(firstPage: string, lastPage: string) {
    log.info('Injecting button up to page', lastPage);

    const $pagingNav = await awaitElement<HTMLDivElement>('#root > div > div > div > div:nth-child(3)');
    log.debug('found pagingNav', $pagingNav.html(), $pagingNav.children('a'));

    // Remove the old ones. Necessary because I want to sync the state of the injected buttons
    // with whether or not the normal page buttons are hidden. This is simplest.
    [$(`.${firstNonce}`), $(`.${lastNonce}`)]
        .filter($ => $.length > 0)
        .forEach($ => $.remove());

    const firstClasses = `${firstNonce} ${$pagingNav.children('a').first().attr('class')}`;
    $pagingNav.prepend($(componentString(firstClasses, firstPage, 'First')))
    const lastClass = `${lastNonce} ${$pagingNav.children('a').last().attr('class')}`;
    $pagingNav.append($(componentString(lastClass, lastPage, 'Last')));
}

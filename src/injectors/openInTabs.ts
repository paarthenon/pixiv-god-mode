import * as $ from 'jquery';
import * as React from 'react';

import {TagCellContainer, TagCellProps, TagCell} from 'src/components/worksNavigationRightButton';
import {GenerateElement} from 'src/injectors/utils';
import {awaitElement, awaitUntil} from 'src/utils/document';
import olog from 'src/log';
import * as uuid from 'uuid';

const log = olog.subCategory('Action tray injector');

const id = uuid.v4();
export async function injectOpenInTabs(text: string, actions: TagCellProps[] = []) {
    await awaitUntil(() => {
        const $elems = $('#root > div > div > div:nth-child(2) > div > section > div');
        const $tags = $('#root > div > div > div > div > section > div > div > div > a > div');
        // wait until the header is initialized (has a header and content div) 
        // and the tags have rendered 
        if ($elems.length >= 2 && $tags.length > 0) {
            return $elems;
        }
        return false;
    });
    const $elem = await awaitElement('#root > div > div > div:nth-child(2) > div > section > ul');

    // needs to be after the awaits or else you expose yourself to async issues where the page triggered
    // the injector X times before the requisite elements ever showed up and then it added the element
    // X times because all 3 code points had passed the if statement.
    if ($(`#${id}`).length > 0) {
        // already done.
        log.warn('Element already exists. Quitting out');
        return;
    }

    log.debug('Injecting the "open in tabs" button');
    let component = GenerateElement(
        React.createElement(TagCellContainer, {header: text}, actions.map(action => React.createElement(TagCell, action))),
    );
    log.debug('Element created', component);

    log.debug('Conditions seem right');
    const children = $(component).children()
    children.first().attr('id', id);
    children.insertBefore($elem)
    log.debug('Added to tree');
}

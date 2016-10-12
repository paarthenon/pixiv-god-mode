import * as $ from 'jquery'
import * as React from 'react'
import * as ReactDOM from 'react-dom'

import {AddToBookmarksClone} from 'src/components/addToBookmarksClone'
import {GenerateElement} from 'src/injectors/utils'

export function injectBookmarksClone(clickAction: Function) {
    let container = $('.bookmark-container');
    let component = GenerateElement(React.createElement(AddToBookmarksClone, {clickAction}));

    // Only replace the button if the add bookmark button is there, not the
    // edit bookmark button
    if ($('.add-bookmark._button').length > 0) {
        container.empty();
        container.append(component);
    }
}
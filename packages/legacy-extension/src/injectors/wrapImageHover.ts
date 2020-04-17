import * as React from 'react';

import * as Hover from 'src/components/imageHover';
import {GenerateElement} from 'src/injectors/utils';

export function injectDownload(image: JQuery, clickAction: Function) {
    let container = GenerateElement(React.createElement(Hover.Container));
    let content = GenerateElement(React.createElement(Hover.Content, {clickAction}));

    image.wrap(container);
    image.closest(`.${Hover.containerClass}`).append(content);
}

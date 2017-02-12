import * as $ from 'jquery'
import * as React from 'react'

import {CountBadge} from 'src/components/countBadge'
import {GenerateElement} from 'src/injectors/utils'

export function injectCountBadge(text:string) {
	let component = GenerateElement(React.createElement(CountBadge, {text}));
    $(component).insertAfter('span.count-badge');
}

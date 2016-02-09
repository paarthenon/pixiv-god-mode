
import * as DomUtils from './utils/dom'
import * as PathUtils from './utils/path'

import {dispatch} from './dispatch'
import {log} from './utils/log'

let page = dispatch(unsafeWindow.location.href, $);

DomUtils.initialize();

let sidebar = DomUtils.createSidebar();
page.actionCache.forEach(action => {
	let button = DomUtils.createButton(action.id, action.label, action.execute);
	sidebar.append(button);
})

$('body').append(sidebar);
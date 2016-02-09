
import * as DomUtils from './utils/dom'
import * as PathUtils from './utils/path'

import {dispatch} from './dispatch'
import {log} from './utils/log'

let page = dispatch(unsafeWindow.location.href, $);

DomUtils.initialize();

let sidebar = DomUtils.createSidebar();

function collapseNav(){
	let expandNavButton = DomUtils.createButton({
		id: 'pa_expand_nav',
		label: 'Expand Pixiv Assistant',
		color: 'blue',
		execute: () => populateNav()
	});

	sidebar.empty();
	sidebar.append(expandNavButton);
	sidebar.removeClass('open');
	sidebar.addClass('closed');
}

function populateNav(){
	let collapseNavButton = DomUtils.createButton({
		id: 'pa_collapse_nav',
		label: 'Collapse Pixiv Assistant',
		color: 'blue',
		execute: () => collapseNav()
	});

	sidebar.empty();

	// I must explicitly call createButton each time because I need to apply the event listener
	// with onclick each time. If a pre-generated array of button objects is used, their event
	// handlers will spoil after the element is removed. TODO: Rebuild this using display: none
	// and CSS based on the .closed class rather than jQuery. That's a more elegant solution anyway.
	page.actionCache.forEach(action => sidebar.append(DomUtils.createButton(action)));
	sidebar.append(collapseNavButton);
	sidebar.removeClass('closed');
	sidebar.addClass('open');
}

populateNav();

$('body').append(sidebar);
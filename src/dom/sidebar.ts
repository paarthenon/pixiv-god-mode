import {Component, AbstractComponent, renderComponent} from './component'
import {Action} from '../actionModel'

export class SidebarButton extends AbstractComponent {
	public css = `
		li.pa-sidebar-entry {
		    transition: opacity 0.3s;
		    opacity: 0.8;
		    display: block;
		    margin-top: 10px;
		    background-color: #000;
	    	border-radius: 60px;
		    cursor: pointer;
		    color: white;
		}
		li.pa-sidebar-entry:hover {
		    opacity: 1;
		}
		.pa-icon {
			display: inline-block;
			height: 20px;
			width: 20px;
			padding:16px;
			font-size:20px;
		}

		a.pa-tooltip {outline:none; }
		a.pa-tooltip strong {line-height:30px;}
		a.pa-tooltip:hover {text-decoration:none;}
		a.pa-tooltip span.pa-tooltip-body {
		    z-index:10;
		    display:none; 
		    padding:5px 5px; 
		    margin-left:10px;
		    margin-top:10px;
		    line-height:16px;
		    white-space: nowrap;
		}
		a.pa-tooltip:hover span.pa-tooltip-body {
		    display:inline; 
		    position:absolute; 
		    color:#111;
		    border:1px solid #888; 
		    background:#dfdfdf;
		    opacity: 100%;
		}

		a.pa-tooltip span.pa-tooltip-body
		{
		    border-radius:4px;
		    box-shadow: 5px 5px 8px #CCC;
		}
	`;

	constructor(protected action: Action) {
		super();
	}
	public render() {
		return $(`<li id="pa-button-${this.action.id}" class="pa-sidebar-entry"></li>`)
			.css('background-color', this.action.color || '#000')
			.on('click', this.action.execute)
			// .append(createImage(imageStrings.arrow))
			.append($(`<a class="pa-tooltip"><span class="pa-icon pa-icon-${this.action.icon || 'images'}"></span><span class="pa-tooltip-body">${this.action.label}</span></span></a>'`))
	}
}

/*
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

	let hideEditor = DomUtils.createButton({
		id: 'pa_hide_dict_editor',
		label: 'Hide Dictionary',
		color: 'green',
		execute: () => DomUtils.hideEditor()
	});

	let showEditor = DomUtils.createButton({
		id: 'pa_show_dict_editor',
		label: 'Show Dictionary',
		color: 'green',
		execute: () => DomUtils.showEditor()
	});

	let showConfig = DomUtils.createButton({
		id: 'pa_show_config_editor',
		label: 'Show Config',
		color: 'green',
		execute: () => $('body').append(DomUtils.createRawConfigEditor())
	});

	sidebar.empty();

	// I must explicitly call createButton each time because I need to apply the event listener
	// with onclick each time. If a pre-generated array of button objects is used, their event
	// handlers will spoil after the element is removed. TODO: Rebuild this using display: none
	// and CSS based on the .closed class rather than jQuery. That's a more elegant solution anyway.
	page.actionCache.forEach(action => sidebar.append(DomUtils.createButton(action)));
	sidebar.append(hideEditor);
	sidebar.append(showEditor);
	sidebar.append(showConfig);
	sidebar.append(collapseNavButton);
	sidebar.removeClass('closed');
	sidebar.addClass('open');
}

populateNav();
*/

export class Sidebar extends AbstractComponent {
	public css = `
		#pixiv-assistant-sidebar {
			position: fixed;
			left: 10px;
		}
		#pixiv-assistant-sidebar.open {
			top: 50%;
			transform: translateY(-50%);
		}
		#pixiv-assistant-sidebar.closed {
			bottom: 10px;
		}

	`;

	constructor(protected actions: Action[]) { super(); }

	public get children():Component[] {
		let pageButtons = this.actions.map(action => new SidebarButton(action));
		return pageButtons
	}

	private self = $('<ul id="pixiv-assistant-sidebar" class="open"></ul>');

	public render() {
		return this.self;
	}
}
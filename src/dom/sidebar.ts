import {Component, AbstractComponent} from './component'
import {Action} from '../actionModel'

import * as Deps from '../deps'

import {log} from '../utils/log'

export class SidebarButton extends AbstractComponent {
	constructor(protected action: Action) {
		super();
	}
	public render() {
		log('SidebarButton | render | init');
		let self = Deps.jQ(`<li id="pa-button-${this.action.id}" class="pa-sidebar-entry"></li>`);
		log('SidebarButton | render | adding background color');
		self.css('background-color', this.action.color || '#000');
		log('SidebarButton | render | adding callback');
		try {
			self.on('click', this.action.execute);
		}
		catch (e) {
			// statements to handle any exceptions
			unsafeWindow.console.log(e); // pass exception object to error handler
		}
		log('SidebarButton | render | creating tooltip');
		let tooltip = Deps.jQ(`<a class="pa-tooltip"><span class="pa-icon pa-icon-${this.action.icon || 'images'}"></span><span class="pa-tooltip-body">${this.action.label}</span></span></a>'`);
		log('SidebarButton | render | appending tooltip');
		self.append(tooltip);
		log('SidebarButton | render | returning');
		return self;
	}
}

export class Sidebar extends AbstractComponent {
	constructor(protected actions: Action[]) { super(); }

	public get children():Component[] {
		let pageButtons = this.actions.map(action => new SidebarButton(action));
		return pageButtons
	}

	private self = Deps.jQ('<ul id="pixiv-assistant-sidebar" class="open"></ul>');

	public render() {
		return this.self;
	}
}

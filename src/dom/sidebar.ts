import {Component, AbstractComponent} from './component'
import {Action} from '../actionModel'

import {Container as Deps} from '../deps'

import * as log4js from 'log4js'
var logger = log4js.getLogger('Sidebar Generation');

export class SidebarButton extends AbstractComponent {
	constructor(protected action: Action) {
		super();
	}
	public render() {
		logger.trace('SidebarButton | render | init');
		let self = Deps.jQ(`<li id="pa-button-${this.action.id}" class="pa-sidebar-entry"></li>`);
		logger.trace('SidebarButton | render | adding background color');
		self.css('background-color', this.action.color || '#000');
		logger.trace('SidebarButton | render | adding callback');
		self.on('click', this.action.execute);
		logger.trace('SidebarButton | render | creating tooltip');
		let tooltip = Deps.jQ(`<a class="pa-tooltip"><span class="pa-icon pa-icon-${this.action.icon || 'images'}"></span><span class="pa-tooltip-body">${this.action.label}</span></span></a>'`);
		logger.trace('SidebarButton | render | appending tooltip');
		self.append(tooltip);
		logger.trace('SidebarButton | render | returning');
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

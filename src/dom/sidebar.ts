import {Component, AbstractComponent, renderComponent} from './component'
import {Action} from '../actionModel'

export class SidebarButton extends AbstractComponent {
	constructor(protected action: Action) {
		super();
	}
	public render() {
		return $(`<li id="pa-button-${this.action.id}" class="pa-sidebar-entry"></li>`)
			.css('background-color', this.action.color || '#000')
			.on('click', this.action.execute)
			.append($(`<a class="pa-tooltip"><span class="pa-icon pa-icon-${this.action.icon || 'images'}"></span><span class="pa-tooltip-body">${this.action.label}</span></span></a>'`))
	}
}

export class Sidebar extends AbstractComponent {
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
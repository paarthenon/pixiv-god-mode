import {Component, AbstractComponent} from './component'

import {Dictionary} from '../utils/dict'
import {DictionaryEditor} from '../dom/dictEditor'


export class ControlPanel extends AbstractComponent {
	protected self = $('<div id="pixiv-assistant-control-panel" class="hidden">Hello</div>');

	protected visible: boolean = false;

	constructor(
		protected userDictionary:Dictionary
	) { super(); }

	public hide() {
		this.visible = false;
		this.self.addClass('hidden');
	}
	public show() {
		this.visible = true;
		this.self.removeClass('hidden');
	}
	public toggleVisibility() {
		if (this.visible) {
			this.hide();
		} else {
			this.show();
		}
	}

	public get children(): Component[] {
		let components: Component[] = [
			// new DictionaryEditor(this.userDictionary)
		];
		return components;
	}

	public render(): JQuery {
		return this.self;
	}
}
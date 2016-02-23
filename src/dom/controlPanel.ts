import {Component, AbstractComponent} from './component'

import {UserSettings} from './userSettings'
import {Dictionary} from '../utils/dict'
import {DictionaryEditor} from './dictEditor'
import {DictionaryView} from './dictView'

import {Tab, TabbedView} from './tabbedView'


export class ControlPanel extends AbstractComponent {
	protected self = $('<div id="pixiv-assistant-control-panel" class="hidden">Pixiv Assistant Control Panel</div>');

	protected visible: boolean = false;

	constructor(
		protected userDictionary:Dictionary,
		protected officialDictionary:Dictionary
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
			new TabbedView([
				new Tab('Settings', new UserSettings(this.officialDictionary)),
				new Tab('User Dictionary', new DictionaryEditor(this.userDictionary)),
				new Tab('Official Dictionary', new DictionaryView(this.officialDictionary))
			])
		];
		return components;
	}

	public render(): JQuery {
		return this.self;
	}
}
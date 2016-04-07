import {Component, AbstractComponent} from './component'

import {UserSettings} from './userSettings'
import {Dictionary} from '../utils/dict'
import {DictionaryEditor} from './dictEditor'
import {DictionaryView} from './dictView'
import {ConfigEditor} from './rawConfigEditor'
import {GoogleTranslateView} from './googleTranslate'

import {Tab, TabbedView} from './tabbedView'

import {RootPage} from '../pages/root'

import * as Deps from '../deps'

export interface ControlPanelInput {
	userDictionary: Dictionary
	rootDictionary: Dictionary
	page: RootPage
}

export class ControlPanel extends AbstractComponent {
	protected officialDictionary: Dictionary;
	protected userDictionary: Dictionary;
	protected page: RootPage;

	protected self = Deps.Container.jQ('<div id="pixiv-assistant-control-panel" class="hidden"><h1>Pixiv Assistant Control Panel</h1></div>');

	protected visible: boolean = false;

	constructor (globals: ControlPanelInput) { 
		super();
		this.officialDictionary = globals.rootDictionary;
		this.userDictionary = globals.userDictionary;
		this.page = globals.page;
	}

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

	public setupTranslationListener(editor: DictionaryEditor) {
		editor.listen(DictionaryEditor.events.newTranslation, () => {
			this.page.translateTagsOnPage();
		});

		editor.listen(DictionaryEditor.events.updatedTranslation, () => {
			this.page.revertTagTranslations();
			this.page.translateTagsOnPage();
		});
	}

	public get children(): Component[] {
		let userDictEditor = new DictionaryEditor(this.userDictionary);
		this.setupTranslationListener(userDictEditor);

		let components: Component[] = [
			new TabbedView([
				new Tab('Settings', new UserSettings(this.officialDictionary)),
				new Tab('User Dictionary', userDictEditor),
				new Tab('Official Dictionary', new DictionaryView(this.officialDictionary)),
				new Tab('Raw Config', new ConfigEditor()),
				new Tab('Google Translate', new GoogleTranslateView())
			])
		];
		return components;
	}

	public render(): JQuery {
		return this.self;
	}
}
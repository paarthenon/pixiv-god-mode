import {Component, AbstractComponent, renderComponent} from './component'
import {Dictionary, DictionaryService} from '../utils/dict'

import ConfigKeys from '../configKeys'

import * as ghUtils from '../utils/github'

import {Container as Deps} from '../deps'
let Config = Deps.config;

export class DebugModeSetting extends AbstractComponent {
	public get currentSetting():boolean {
		return <boolean>Config.get(ConfigKeys.debug_mode);
	}
	public set currentSetting(val:boolean) {
		Config.set(ConfigKeys.debug_mode, val);
	}

	public render():JQuery {
		let self = Deps.jQ('<div class="pa-options-debug-mode"></div>');
		self.append(Deps.jQ(`<span>Debug Mode: ${(this.currentSetting) ? 'On' : 'Off'}</span>`));
		self.append(
			Deps.jQ('<button>Toggle</button>').on('click', () => {
				this.currentSetting = !this.currentSetting;
			})
		);

		return self;
	}
}
export class UserSettings extends AbstractComponent {
	constructor(protected dict: Dictionary) { 
		super();

		this.refreshUpdateStatus();
	}

	protected dictionaryStatus = Deps.jQ('<p></p>');

	protected genDictionaryStatus(container:JQuery, updateAvailable:boolean){
		container.append(Deps.jQ('<span>Central Dictionary Update Status: </span>'));
		if (updateAvailable) {
			let button = Deps.jQ('<button class="wide">RefreshDict</button>').on('click', () => this.refreshDictionary());
			let statusPositive = Deps.jQ('<span class="wide">New Update Available</span>').append(button);
			container.append(statusPositive);
		} else {
			container.append(Deps.jQ('<span class="wide green">Up To Date</span>'));
		}
	}
	protected refreshUpdateStatus() {
		DictionaryService.updateAvailable(available => {
			this.dictionaryStatus.empty();
			this.genDictionaryStatus(this.dictionaryStatus, available);
		});
	}

	public refreshDictionary() {
		DictionaryService.updateDictionary(() => {
			this.refreshUpdateStatus();
		});
	}

	public importUserDictionary() {
		Config.set(ConfigKeys.user_dict, JSON.parse(Deps.jQ('#pa-dictionary-scratchpad').val()));
	}

	public get children() {
		return [new DebugModeSetting()];
	}

	public render():JQuery {
		let self = Deps.jQ('<div class="pa-options-view"><h2>User Settings</h2></div>');
		self.append(this.dictionaryStatus);
		self.append(Deps.jQ('<button>Import User Dictionary</button>').on('click', () => this.importUserDictionary()));
		self.append(Deps.jQ('<textarea id="pa-dictionary-scratchpad"></textarea>'));
		return self;
	}
}
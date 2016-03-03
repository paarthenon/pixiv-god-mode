import {Component, AbstractComponent, renderComponent} from './component'
import {Dictionary, DictionaryService} from '../utils/dict'

import Config from '../utils/config'
import ConfigKeys from '../configKeys'

import * as ghUtils from '../utils/github'

export class DebugModeSetting extends AbstractComponent {
	public get currentSetting():boolean {
		return <boolean>Config.get(ConfigKeys.debug_mode);
	}
	public set currentSetting(val:boolean){
		Config.set(ConfigKeys.debug_mode, val);
	}

	public render():JQuery {
		let self = $('<div class="pa-options-debug-mode"></div>');
		self.append($(`<span>Debug Mode: ${(this.currentSetting) ? 'On' : 'Off'}</span>`));
		self.append(
			$('<button>Toggle</button>').on('click',()=>{
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

	protected dictionaryStatus = $('<p></p>');

	protected genDictionaryStatus(container:JQuery, updateAvailable:boolean){
		container.append($('<span>Central Dictionary Update Status: </span>'));
		if (updateAvailable) {
			let button = $('<button class="wide">RefreshDict</button>').on('click', () => this.refreshDictionary());
			let statusPositive = $('<span class="wide">New Update Available</span>').append(button);
			container.append(statusPositive);
		} else {
			container.append($('<span class="wide green">Up To Date</span>'));
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
		Config.set(ConfigKeys.user_dict, JSON.parse($('#pa-dictionary-scratchpad').val()));
	}

	public get children() {
		return [new DebugModeSetting()];
	}

	public render():JQuery {
		let self = $('<div class="pa-options-view"><h2>User Settings</h2></div>');
		self.append(this.dictionaryStatus);
		self.append($('<button>Import User Dictionary</button>').on('click', () => this.importUserDictionary()));
		self.append($('<textarea id="pa-dictionary-scratchpad"></textarea>'));
		return self;
	}
}
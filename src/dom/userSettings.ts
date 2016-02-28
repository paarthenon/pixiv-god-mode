import {Component, AbstractComponent, renderComponent} from './component'
import {Dictionary, DictionaryService} from '../utils/dict'

import Config from '../utils/config'
import ConfigKeys from '../configKeys'

import * as ghUtils from '../utils/github'

export class UserSettings extends AbstractComponent {
	constructor(protected dict: Dictionary) { 
		super();
		this.refreshUpdateStatus();
	}

	protected dictionaryStatus = $('<p>Central Dictionary Update Status: </p>');

	protected dictionaryStatusPositive = $('<span class="wide">New Update Available</span>')
		.append($('<button class="wide">RefreshDict</button>').on('click', () => this.refreshDictionary()));

	protected dictionaryStatusNegative = $('<span class="wide green">Up To Date</span>')
	protected refreshUpdateStatus() {
		DictionaryService.updateAvailable(available => {
			this.dictionaryStatusNegative.remove();
			this.dictionaryStatusPositive.remove();
			this.dictionaryStatus.append((available) ? this.dictionaryStatusPositive : this.dictionaryStatusNegative);
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

	public render():JQuery {
		let self = $('<div class="pa-options-view"><h2>User Settings</h2></div>');
		self.append(this.dictionaryStatus);
		self.append($('<button>Import User Dictionary</button>').on('click', () => this.importUserDictionary()));
		self.append($('<textarea id="pa-dictionary-scratchpad"></textarea>'));
		return self;
	}
}
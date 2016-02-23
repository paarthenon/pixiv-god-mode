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

	protected dictionaryStatus = $('<span></span>');
	protected refreshUpdateStatus() {
		DictionaryService.updateAvailable(available => {
			let availableText = (available) ? 'New Update Available' : 'Up To Date';
			this.dictionaryStatus.text(availableText);
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
		let self = $('<div class="pa-options-view">User Settings</div>');
		self.append($('<span>Dictionary Update Status</span>'));
		self.append(this.dictionaryStatus);
		if (this.dictionaryStatus) {
			self.append($('<button>RefreshDict</button>').on('click',()=> this.refreshDictionary()))
		}
		self.append($('<button>Import User Dictionary</button>').on('click', () => this.importUserDictionary()));
		self.append($('<textarea id="pa-dictionary-scratchpad"></textarea>'));
		return self;
	}
}
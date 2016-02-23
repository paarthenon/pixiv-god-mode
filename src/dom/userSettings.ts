import {Component, AbstractComponent, renderComponent} from './component'
import {Dictionary, DictionaryService} from '../utils/dict'

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

	public render():JQuery {
		let self = $('<div class="pa-options-view">User Settings</div>');
		self.append($('<span>Dictionary Update Status</span>'));
		self.append(this.dictionaryStatus);
		if (this.dictionaryStatus) {
			self.append($('<button>RefreshDict</button>').on('click',()=> this.refreshDictionary()))
		}
		return self;
	}
}
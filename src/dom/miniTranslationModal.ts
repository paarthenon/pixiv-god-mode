import {Dictionary} from '../utils/dict'
import {Component, AbstractComponent, renderComponent} from './component'

import {AddNewInput} from './dictEditor'

export class MiniTranslationModal extends AbstractComponent {
	public static events = {
		addedTranslation: 'NEW_TRANSLATION',
	};

	protected self = $('<div id="pa-assistant-mini-translation-modal"></div>');

	constructor(protected dict: Dictionary) { 
		super(); 
		this.self.hide(); 
	}

	public get children(): Component[] {
		let addNewInput = new AddNewInput(this.dict, (key) => {
			this.shout(MiniTranslationModal.events.addedTranslation);
		});
		return [addNewInput];
	}

	public toggleVisibility() {
		this.self.toggle();
	}

	public render():JQuery {
		return this.self;
	}
}
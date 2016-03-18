import {Dictionary} from '../utils/dict'
import {Component, AbstractComponent, renderComponent} from './component'

import {AddNewInput} from './dictEditor'

import * as services from '../services'

import * as Deps from '../deps'

export class MiniTranslationModal extends AbstractComponent {
	public static events = {
		addedTranslation: 'NEW_TRANSLATION',
	};

	protected self = Deps.jQ('<div id="pa-assistant-mini-translation-modal"></div>');

	constructor(protected dict: Dictionary, protected potentialTag:string) { 
		super(); 
		this.self.hide(); 
	}

	public get children(): Component[] {
		let addNewInput = new AddNewInput(this.dict, (key) => {
			this.shout(MiniTranslationModal.events.addedTranslation);
		});
		addNewInput.japanese = this.potentialTag || '';
		if (this.potentialTag) {
			services.googleTranslate(this.potentialTag, englishTranslation => {
				if (!addNewInput.english) {
					addNewInput.english = englishTranslation;
				}
			});
		}
		return [addNewInput];
	}

	public toggleVisibility() {
		unsafeWindow.console.log('MiniTranslationModal | toggleVisibility | called');
		this.self.toggle();
	}

	public render():JQuery {
		return this.self;
	}
}
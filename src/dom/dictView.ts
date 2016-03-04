import {Component, AbstractComponent, renderComponent} from './component'
import {Dictionary} from '../utils/dict'

import * as Deps from '../deps'

export class DictionaryView extends AbstractComponent {
	constructor(protected dict: Dictionary) { super(); }
	public render():JQuery {
		let entries = this.dict.keys.map(dictKey => Deps.jQ(`<dd>${dictKey}</dd><dt>${this.dict.get(dictKey)}</dt>`));
		let entryList = Deps.jQ('<dl></dl>');
		entryList.append(entries);
		return Deps.jQ('<div class="pa-dict-view"></div>').append(entryList);
	}
}
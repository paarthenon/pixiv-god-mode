import {Component, AbstractComponent, renderComponent} from './component'
import {Dictionary} from '../utils/dict'

export class DictionaryView extends AbstractComponent {
	constructor(protected dict: Dictionary) { super(); }
	public render():JQuery {
		let entries = this.dict.keys.map(dictKey => $(`<dd>${dictKey}</dd><dt>${this.dict.get(dictKey)}</dt>`));
		let entryList = $('<dl></dl>');
		entryList.append(entries);
		return $('<div class="pa-dict-view"></div>').append(entryList);
	}
}
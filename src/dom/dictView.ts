import {Component, AbstractComponent, renderComponent} from './component'
import {Dictionary} from '../utils/dict'

import * as Deps from '../deps'

let jQ = Deps.Container.jQ;

function generateSearchLink(tag:string) {
	return `http://www.pixiv.net/search.php?s_mode=s_tag_full&word=${tag}`;
}

export class DictionaryView extends AbstractComponent {
	constructor(protected dict: Dictionary) { super(); }
	public render():JQuery {
		let entries = this.dict.keys.map(dictKey => jQ(`<dd>${dictKey}</dd><dt><a href="${generateSearchLink(dictKey)}">${this.dict.get(dictKey) } </a></dt>`));
		let entryList = jQ('<dl></dl>');
		entryList.append(entries);
		return jQ('<div class="pa-dict-view"></div>').append(entryList);
	}
}
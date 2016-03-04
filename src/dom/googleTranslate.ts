import {Component, AbstractComponent, renderComponent} from './component'

import * as Deps from '../deps'

let translateUrl = "https://translate.google.com/#ja/en/";
export class GoogleTranslateView extends AbstractComponent {
	constructor() { super(); }
	public render():JQuery {
		return Deps.jQ('<div class="pa-google-translate-view">TBD</div>');
	}
}
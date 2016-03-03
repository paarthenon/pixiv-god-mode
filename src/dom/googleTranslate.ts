import {Component, AbstractComponent, renderComponent} from './component'

let translateUrl = "https://translate.google.com/#ja/en/";
export class GoogleTranslateView extends AbstractComponent {
	constructor() { super(); }
	public render():JQuery {
		return $('<div class="pa-google-translate-view">TBD</div>');
	}
}
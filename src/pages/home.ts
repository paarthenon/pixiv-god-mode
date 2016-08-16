import {RootPage} from './root'

export class HomePage extends RootPage {
	protected getTagElements() {
		return [
			'div.tag-name'
		].map(selector => this.jQuery(selector))
		.concat(super.getTagElements());
	}
}

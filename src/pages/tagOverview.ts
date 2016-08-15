import {RootPage} from './root'

export class TagOverviewPage extends RootPage {
	protected getTagElements() {
		return [
			'a.tag-name'
		].map(selector => this.jQuery(selector))
		.concat(super.getTagElements());
	}
}

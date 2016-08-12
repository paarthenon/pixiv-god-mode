import {RootPage} from './root'

export class BookmarkAddPage extends RootPage {
	protected getTagElements() {
		return [
			'ul.tag-cloud li span'
		].map(selector => this.jQuery(selector))
			.concat(super.getTagElements());
	}
}
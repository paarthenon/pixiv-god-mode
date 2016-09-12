import {RootPage} from './root'

export class BookmarkAddPage extends RootPage {
	protected getTagElements() {
		return [
			'ul.tag-cloud li span'
		].map(this.jQuery).concat(super.getTagElements());
	}
}
import {RootPage} from './root'

export class ArtistTagListPage extends RootPage {
	protected getTagElements() {
		return [
			'div.user-tags li a',
			'.tag-list li a.tag-name'
		].map(selector => this.jQuery(selector))
		.concat(super.getTagElements());
	}
}
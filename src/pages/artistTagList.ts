import * as $ from 'jquery'
import {RootPage} from 'src/pages/root'

export class ArtistTagListPage extends RootPage {
	protected getTagElements() {
		return [
			'div.user-tags li a',
			'.tag-list li a.tag-name'
		].map(tag => $(tag)).concat(super.getTagElements());
	}
}
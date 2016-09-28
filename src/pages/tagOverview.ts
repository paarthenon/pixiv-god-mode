import {RootPage} from 'src/pages/root'

export class TagOverviewPage extends RootPage {
	protected getTagElements() {
		return [
			'a.tag-name'
		].map(tag => this.jQuery(tag)).concat(super.getTagElements());
	}
}

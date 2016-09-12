import {RootPage} from './root'

export class TagOverviewPage extends RootPage {
	protected getTagElements() {
		return [
			'a.tag-name'
		].map(this.jQuery).concat(super.getTagElements());
	}
}

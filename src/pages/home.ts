import {RootPage} from './root'

export class HomePage extends RootPage {
	protected getTagElements() {
		return [
			'div.tag-name'
		].map(this.jQuery).concat(super.getTagElements());
	}
}

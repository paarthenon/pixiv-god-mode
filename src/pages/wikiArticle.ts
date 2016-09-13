import {RootPage} from './root'

export class WikiArticlePage extends RootPage {
	protected getTagElements() {
		return [
			'nav#breadcrumbs div a span',
			'nav#breadcrumbs div.current',
			'section#relation div.info a',
		].map(tag => this.jQuery(tag)).concat(super.getTagElements());
	}
}

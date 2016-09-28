import {RootPage} from 'src/pages/root'

export class WikiArticlePage extends RootPage {
	protected getTagElements() {
		return [
			'nav#breadcrumbs div a span',
			'nav#breadcrumbs div.current',
			'section#relation div.info a',
			"a[href*='http://dic.pixiv.net/a/']", //links to other wiki articles.
		].map(tag => this.jQuery(tag)).concat(super.getTagElements());
	}
}

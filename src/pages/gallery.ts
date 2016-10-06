import * as pathUtils from 'src/utils/path'
import {RootPage} from 'src/pages/root'
import {ExecuteOnLoad} from 'src/utils/actionDecorators'
import {injectPagingButtons} from 'src/injectors/pagingButtonInjector'

export class GalleryPage extends RootPage {
	public get imageCountInPage(): number {
		return this.jQuery('li.image-item').length;
	}
	public get imageCountTotal(): number {
		return pathUtils.getResultFromBadge(this.jQuery('span.count-badge').text());
	}

	public get firstPageUrl(): string {
		return this.getPageUrl(1);
	}
	public get lastPageUrl(): string {
		// logger.trace('Going to last page');

		let finalPage = Math.ceil(1.0 * this.imageCountTotal / 20.0);
		return this.getPageUrl(finalPage);
	}

	protected getTagElements() {
		return super.getTagElements();
	}

	protected getPageUrl(pageNum:number) {
		// logger.trace('Going to page', pageNum);
		// This takes advantage of the property that &p=2&p=3 will direct to page 3.
		return `${window.location.href}&p=${pageNum}`;
	}

	protected injectPagingButtons() {
		injectPagingButtons(this.jQuery, this.firstPageUrl, this.lastPageUrl);
	}

	public replaceMangaThumbnailLinksToFull(){
		this.jQuery('li.image-item a.work.multiple').toArray().forEach(manga => {
			let path = this.jQuery(manga).attr('href')
			let mangaPath = path.replace('medium', 'manga');
			this.jQuery(manga).attr('data-backup-href', path);
			this.jQuery(manga).attr('href', mangaPath);
		})
	}
}
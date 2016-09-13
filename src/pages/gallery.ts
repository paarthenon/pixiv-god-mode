import * as pathUtils from '../utils/path'
import {RootPage} from './root'
import {RegisteredAction, ExecuteOnLoad} from '../utils/actionDecorators'

import * as log4js from 'log4js'
let logger = log4js.getLogger('Gallery');

export class GalleryPage extends RootPage {
	public get imageCountInPage(): number {
		return this.jQuery('li.image-item').length;
	}
	public get imageCountTotal(): number {
		return pathUtils.getResultFromBadge(this.jQuery('span.count-badge').text());
	}

	protected getTagElements() {
		return super.getTagElements();
	}

	protected goToPage(pageNum:number) {
		logger.trace('Going to page', pageNum);
		// This takes advantage of the property that &p=2&p=3 will direct to page 3.
		window.location.href = `${window.location.href}&p=${pageNum}`;
	}

	public goToLastPage():void {
		logger.trace('Going to last page');

		let finalPage = Math.ceil(1.0 * this.imageCountTotal / 20.0);
		this.goToPage(finalPage);
	}

	public goToFirstPage():void {
		logger.trace('Going to first page');

		this.goToPage(1);
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
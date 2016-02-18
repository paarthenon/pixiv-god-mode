import * as pathUtils from '../utils/path'
import * as services from '../services'
import {RootPage} from './root'
import {RegisteredAction, ExecuteOnLoad} from '../utils/actionDecorators'

export class GalleryPage extends RootPage {
	public get imageCountInPage(): number {
		return this.jQuery('li.image-item').length;
	}
	public get imageCountTotal(): number {
		return pathUtils.getResultFromBadge(this.jQuery('span.count-badge').text());
	}

	public goToLastPage():void {
		let finalPage = Math.ceil(1.0 * this.imageCountTotal / this.imageCountInPage);
		// This takes advantage of the property that &p=2&p=3 will direct to page 3.
		unsafeWindow.location.href = `${unsafeWindow.location.href}&p=${finalPage}`;
	}
}
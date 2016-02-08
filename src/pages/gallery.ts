import * as pathUtils from '../utils/path'
import * as services from '../services'
import {BasePage, RegisteredAction, ExecuteOnLoad} from './base'

export class GalleryPage extends BasePage {
	public get imageCountInPage(): number {
		return this.jQuery('li.image-item').length;
	}
	public get imageCountTotal(): number {
		return pathUtils.getResultFromBadge(this.jQuery('span.count-badge').text());
	}

	@RegisteredAction({id: 'pa_button_go_to_last_page', label: 'Go To Last Page'})
	public goToLastPage():void {
		let finalPage = Math.ceil(1.0 * this.imageCountTotal / this.imageCountInPage);
		// This takes advantage of the property that &p=2&p=3 will direct to page 3.
		unsafeWindow.location.href = `${unsafeWindow.location.href}&p=${finalPage}`;
	}
}
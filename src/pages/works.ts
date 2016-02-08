import * as pathUtils from '../utils/path'
import * as services from '../services'
import {BasePage, RegisteredAction, ExecuteOnLoad} from './base'
import {GalleryPage} from './gallery'

export class WorksPage extends GalleryPage {
	public get artistId():number {
		return pathUtils.getArtistId(this.path);
	}
	public get artistName():string {
		return this.jQuery('h1.user').text();
	}

	private darkenInList(pictures:Model.Image[]):void {
		this.jQuery('li.image-item').toArray().forEach(image => {
			let imageId = pathUtils.getImageId($(image).find('a.work').attr('href'));
			// Picture format is <imgnum>_<page>_master<size>.<filetype> or imgnum.<filetype>
			if (pictures.some(picture => picture.id === imageId)) {
				this.jQuery(image).css('background-color', '#333334');
			}
		});
	}

	@RegisteredAction({ id: 'pa_button_open_in_tabs', label: 'Open in Tabs' })
	public openTabs():void {
		this.jQuery('li.image-item a.work').toArray().forEach(image => {
			let path = this.jQuery(image).attr('href');
			if (this.jQuery(image).attr('class').indexOf('multiple') >= 0) {
				path = path.replace('medium', 'manga');
			}
			GM_openInTab(`//www.pixiv.net${path}`);
		});
	}

	@ExecuteOnLoad
	public darkenImages():void {
		services.getArtistImages(this.artistId, this.darkenInList);
	}

	@RegisteredAction({id: 'pa_button_open_folder', label: 'Open Folder'})
	public openFolder():void {
		services.openFolder({ id: this.artistId, name: this.artistName });
	}

}
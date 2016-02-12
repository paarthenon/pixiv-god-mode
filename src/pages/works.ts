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

	public get artist():Model.Artist {
		return { id: this.artistId, name: this.artistName };
	}

	private darkenInList(pictures:Model.Image[]):void {
		this.jQuery('li.image-item').toArray().forEach(image => {
			let imageId = pathUtils.getImageId($(image).find('a.work').attr('href'));
			// Picture format is <imgnum>_<page>_master<size>.<filetype> or imgnum_p<pagenum>.<filetype>
			// TODO: ^ is wrong, _square1200 is also a valid option, fix.
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
		services.getArtistImages(this.artistId, (pictures) => this.darkenInList(pictures));
	}

	@RegisteredAction({id: 'pa_button_open_folder', label: 'Open Folder'})
	public openFolder():void {
		services.openFolder(this.artist);
	}

	@RegisteredAction({id: 'pa_button_download_all_user_images', label: 'Download All Images (Expensive)'})
	public downloadAllImagesForArtist():void {
		(<any>unsafeWindow).pixiv.api.userProfile({
			user_ids: this.artistId,
			illust_num: Number.MAX_VALUE
        }, {}).then((result: any) => {
			let combined_urls = result.body[0].illusts.map((illust: any) => {
				let url = illust.url[Object.keys(illust.url)[0]];
				let pages = illust.illust_page_count;

				let fullResUrl = pathUtils.experimentalMaxSizeImageUrl(url);
				let urls = pathUtils.explodeImagePathPages(fullResUrl, pages);

				return urls;
			}).reduce((previous: string[], current: string[]) => previous.concat(current));

			services.downloadMulti(this.artist, combined_urls);
        });
	}

}
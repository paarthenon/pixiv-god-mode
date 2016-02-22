import * as pathUtils from '../utils/path'
import * as services from '../services'
import {RootPage} from './root'
import {RegisteredAction, ExecuteOnLoad, ExecuteIf} from '../utils/actionDecorators'
import {GalleryPage} from './gallery'
import {settingKeys, getSetting} from '../userSettings'

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

	protected getTagElements() {
		return [
			'span.tag-badge',
			'div.user-tags li a'
		].map(selector => this.jQuery(selector))
		.concat(super.getTagElements());
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
	
	// TODO: This logic is wrong if we are already on the last page and there are fewer than the full set of elements. 
	// Make this action only visible if we are not already on the last page. 
	@RegisteredAction({ id: 'pa_button_go_to_last_page', label: 'Go To Last Page', icon: 'last' })
	public goToLastPage() {
		super.goToLastPage();
	} 

	@RegisteredAction({ id: 'pa_button_open_in_tabs', label: 'Open in Tabs', icon: 'new-tab' })
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

	@RegisteredAction({id: 'pa_button_open_folder', label: 'Open Folder', icon: 'folder-open'})
	public openFolder():void {
		services.openFolder(this.artist);
	}

	@RegisteredAction({id: 'pa_button_download_all_user_images', label: 'Download All Images (Expensive)', icon: 'folder-download'})
	public downloadAllImagesForArtist():void {
		(<any>unsafeWindow).pixiv.api.userProfile({
			user_ids: this.artistId,
			illust_num: 1000000
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

	@ExecuteIf(() => getSetting(settingKeys.pages.works.mangaLinkToFull))
	public replaceMangaThumbnailLinksToFull(){
		this.jQuery('li.image-item a.work.multiple').toArray().forEach(manga => {
			let path = this.jQuery(manga).attr('href')
			let mangaPath = path.replace('medium', 'manga');
			this.jQuery(manga).attr('data-backup-href', path);
			this.jQuery(manga).attr('href', mangaPath);
		})
	}


}
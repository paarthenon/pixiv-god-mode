import * as pathUtils from '../utils/path'
import {RootPage} from './root'
import {RegisteredAction, ExecuteOnLoad, ExecuteIfSetting} from '../utils/actionDecorators'
import {PixivAssistantServer} from '../services'
import {Container as Deps} from '../deps'
import SettingKeys from '../settingKeys'
import {injectMangaPreviousButton} from '../injectors/mangaPreviousButton'

export class MangaPage extends RootPage {
	public get artistName(): string {
		return this.jQuery('section.thumbnail-container a.user').text();
	}
	public get artistId(): number {
		// TODO: Extract to its own function. This currently re-uses the id pattern for URLs which may diverge.
		return pathUtils.getArtistId(this.jQuery('footer ul.breadcrumbs li a.user').attr('href'));
	}

	public get illustId(): number {
		return pathUtils.getImageId(this.path);
	}

	@ExecuteOnLoad
	public fitImagesInPage() : void {
	}

	@ExecuteIfSetting(SettingKeys.pages.manga.inject.previousButton)
	public injectMangaPreviousButton(){
		injectMangaPreviousButton(this.jQuery, this.goToPreviousPage.bind(this));
	}

	@ExecuteIfSetting(SettingKeys.pages.manga.loadFullSize)
	public autoEmbiggenFixImages(): void {
		Deps.execOnPixiv(
			(pixiv, props) => pixiv.api.illust.detail([props.illustId], {}),
			{
				illustId: this.illustId
			}
		).then((response: any) => { 
			let extension = response.body[this.illustId].illust_ext;
			let extensionWithDot = (extension.charAt(0) === '.') ? extension : `.${extension}`;

			this.jQuery('img.image').toArray().forEach(image => {
				let jQImage = this.jQuery(image);
				// pixiv lazy loads image data, the full url is stored in data-src
				// and copied over to the source attribute once a user comes into view.
				let src = jQImage.attr('data-src');
				let newSrc = pathUtils.getMaxSizeImageUrl(src).replace(/\.(\w+)$/, extensionWithDot);

				// Have to alter the data-src as well because if we don't, pixiv will 
				// automatically copy over data-src again

				jQImage.attr('data-src-backup', src);
				jQImage.attr('data-src', newSrc);
				jQImage.attr('src', newSrc);
				jQImage.removeAttr('style');
			});
		
		}).then(()=> {
			Deps.getSetting(SettingKeys.pages.manga.fitImage).then(fixSize => {
				if (fixSize) {
					Deps.execOnPixiv(pixiv => pixiv.mangaViewer.listView.updateSize());
				}
			});
		});
	}

	public goToPreviousPage():void {
		Deps.execOnPixiv(pixiv => pixiv.mangaViewer.listView.prev());
	}

	@RegisteredAction({ id: 'pa_download_manga_images', label: 'Download All', icon: 'download2' })
	public downloadMulti(): void {
		let fullImages = this.jQuery('img.image').toArray().map(img => this.jQuery(img).attr('data-src'));
		PixivAssistantServer.downloadMulti({ id: this.artistId, name: this.artistName }, fullImages);
	}
}

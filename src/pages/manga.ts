import * as pathUtils from '../utils/path'
import {RootPage} from './root'
import {RegisteredAction, ExecuteOnLoad} from '../utils/actionDecorators'
import {log} from '../utils/log'
import * as services from '../services'

export class MangaPage extends RootPage {
	public get artistName(): string {
		return this.jQuery('section.thumbnail-container a.user').text();
	}
	public get artistId(): number {
		return parseInt((<any>unsafeWindow).pixiv.context.userId);
	}

	public get illustId(): number {
		return (<any>unsafeWindow).pixiv.context.illustId;
	}

	@ExecuteOnLoad
	public autoEmbiggenFixImages(): void{
		(<any>(<any>unsafeWindow).pixiv.api.illust.detail([this.illustId], {})).then((response: any) => { 
			let extension = response.body[this.illustId].illust_ext;
			let extensionWithDot = (extension.charAt(0) === '.') ? extension : `.${extension}`;
			//this.correctFileType(response.body[this.illustId].illust_ext) 

			this.jQuery('img.image').toArray().forEach(image => {
				let jQImage = this.jQuery(image);
				// pixiv lazy loads image data, the full url is stored in data-src
				// and copied over to the source attribute once a user comes into view.
				let src = jQImage.attr('data-src');
				let newSrc = pathUtils.getMaxSizeImageUrl(src).replace(/\.(\w+)$/, extensionWithDot);

				log(`rewriting image src from [${src}] to [${newSrc}]`);

				// Have to alter the data-src as well because if we don't, pixiv will 
				// automatically copy over data-src again

				jQImage.attr('data-src-backup', src);
				jQImage.attr('data-src', newSrc);
				jQImage.attr('src', newSrc);
				jQImage.removeAttr('style');

				jQImage.on('load', () => {
					// Treat the window as the bounding box for the image. This produces some rendering
					// artifacts, but makes extra-large images viewable.
					let widthRatio = 1.0 * jQImage.width() / unsafeWindow.innerWidth;
					let heightRatio = 1.0 * jQImage.height() / unsafeWindow.innerHeight;

					let higherRatio = Math.max(widthRatio, heightRatio);

					if (higherRatio > 1) {
						// Apparently you only need to set one, and jQuery keeps the aspect ratio aligned. 
						// News to me.
						jQImage.height(jQImage.height() / higherRatio);
					}
				});
			});
		});
	}

	@RegisteredAction({ id: 'pa_go_to_previous_image', label: 'Previous', icon:'arrow-left2' })
	public goToPreviousPage():void {
		(<any>unsafeWindow).pixiv.mangaViewer.listView.prev();
	}

	@RegisteredAction({ id: 'pa_reverse_embiggen_manga_images', label: 'Reverse Embiggen' })
	public reverseEmbiggen(): void {
		this.jQuery('img.image').toArray().forEach(image => {
			let jQImage = this.jQuery(image);
			jQImage.attr('src', jQImage.attr('data-src-backup'));
			jQImage.attr('data-src', jQImage.attr('data-src-backup'));
		});
	}

	@RegisteredAction({ id: 'pa_download_manga_images', label: 'Download All', icon: 'download2' })
	public downloadMulti(): void {
		let fullImages = this.jQuery('img.image').toArray().map(img => this.jQuery(img).attr('data-src'));
		services.downloadMulti({ id: this.artistId, name: this.artistName }, fullImages);
	}
}

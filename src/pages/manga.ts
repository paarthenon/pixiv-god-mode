import * as pathUtils from '../utils/path'
import {BasePage, RegisteredAction, ExecuteOnLoad} from './base'

import {log} from '../utils/log'
import * as services from '../services'

export class MangaPage extends BasePage {
	public get artistName(): string {
		return this.jQuery('section.thumbnail-container a.user').text();
	}
	public get artistId(): number {
		return parseInt((<any>unsafeWindow).pixiv.context.userId);
	}

	@ExecuteOnLoad
	@RegisteredAction({ id: 'pa_embiggen_manga_images', label: 'Embiggen' })
	public embiggenImages(): void {
		this.jQuery('img.image').toArray().forEach(image => {
			let jQImage = this.jQuery(image);
			// pixiv lazy loads image data, the full url is stored in data-src
			// and copied over to the source attribute once a user comes into view.
			let src = jQImage.attr('data-src');
			let newSrc = pathUtils.getMaxSizeImageUrl(src);

			log(`rewriting image src from [${src}] to [${newSrc}]`);

			// Have to alter the data-src as well because if we don't, pixiv will 
			// automatically copy over data-src again
			jQImage.attr('data-src-backup', src);
			jQImage.attr('data-src', newSrc);
			jQImage.attr('src', newSrc);
			jQImage.removeAttr('style');
		});
	}

	@RegisteredAction({ id: 'pa_reverse_embiggen_manga_images', label: 'Reverse Embiggen' })
	public reverseEmbiggen(): void {
		this.jQuery('img.image').toArray().forEach(image => {
			let jQImage = this.jQuery(image);
			jQImage.attr('src', jQImage.attr('data-src-backup'));
			jQImage.attr('data-src', jQImage.attr('data-src-backup'));
		});
	}

	protected correctFileType(extension: string) {
		let extensionWithDot = (extension.charAt(0) === '.') ? extension : `.${extension}`;
		this.jQuery('img.image').toArray().forEach(image => {
			let jQImage = this.jQuery(image);
			let src = jQImage.attr('src');

			let newSrc = src.replace(/\.(\w+)$/, extensionWithDot);

			jQImage.attr('src', newSrc);
			jQImage.attr('data-src', newSrc);
		});
	}

	@RegisteredAction({ id: 'pa_autocorrect_file_type', label: 'Autocorrect File Type' })
	public autoCorrectFileType(): void {
		let illust_id = (<any>unsafeWindow).pixiv.context.illustId;
		(<any>(<any>unsafeWindow).pixiv.api.illust.detail([illust_id], {})).then((response:any) => {this.correctFileType(response.body[illust_id].illust_ext) });
	}

	@RegisteredAction({ id: 'pa_alter_file_type', label: 'New File Type' })
	public alterFileType(): void {
		let input = unsafeWindow.prompt('Choose a new filetype to try', '.png');
		this.correctFileType(input);
	}

	@RegisteredAction({ id: 'pa_download_manga_images', label: 'Download All' })
	public downloadMulti(): void {
		let fullImages = this.jQuery('img.image').toArray().map(img => this.jQuery(img).attr('data-src'));
		services.downloadMulti({ id: this.artistId, name: this.artistName }, fullImages);
	}
}

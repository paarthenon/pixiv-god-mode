import * as pathUtils from '../utils/path'
import {RootPage} from './root'
import {RegisteredAction, ExecuteOnLoad, ExecuteIfSetting} from '../utils/actionDecorators'
import SettingKeys from '../settingKeys'
import {PixivAssistantServer} from '../services'
import {Container as Deps} from '../deps'
import {Model} from '../../common/proto'
import {injectUserRelationshipButton} from '../injectors/openFolderInjector'

export class IllustrationPage extends RootPage {
	public get artistId():number {
		return pathUtils.getArtistId(this.jQuery('a.user-link').attr('href'));
	}
	public get artistName():string {
		return this.jQuery('a.user-link h1').text();
	}
	public get artist():Model.Artist {
		return { id: this.artistId, name: this.artistName };
	}
	public get thumbUrl():string {
		return this.jQuery('.boxbody center img').attr('src');
	}
	public get fullImageUrl():string {
		return this.jQuery('._illust_modal img').attr('data-src');
	}

	protected getTagElements():JQuery[] {
		return [
			'.tags-container li.tag a.text',
			'div.user-tags li a',
		].map(selector => this.jQuery(selector))
		.concat(super.getTagElements());
	}

	@ExecuteOnLoad
	public injectPageElements() {
		injectUserRelationshipButton(this.jQuery, this.artist);
	}

	@ExecuteIfSetting(SettingKeys.pages.illust.autoOpen)
	public openImage(): void {
		this.jQuery("._layout-thumbnail.ui-modal-trigger").click()
	}

	@RegisteredAction({ 
		id: 'pa_download_zip_button', 
		label: 'Download Animation as Zip',
		icon: 'file-zip',
	})
	public downloadZip():void {
		Deps.execOnPixiv(pixiv => pixiv.context.ugokuIllustFullscreenData.src)
			.then((src:string) => {
				if(src.length > 0){
					PixivAssistantServer.downloadZip(this.artist, src);
				}
			});
	}

	@RegisteredAction({ id: 'pa_button_open_folder', label: 'Open Folder', icon: 'folder-open' })
	public openFolder(): void {
		PixivAssistantServer.openFolder(this.artist);
	}

	@RegisteredAction({ id: 'pa_button_download', label: 'Download Image', icon: 'floppy-disk' })
	public download():void {
		PixivAssistantServer.download(this.artist, this.fullImageUrl);
	}

}
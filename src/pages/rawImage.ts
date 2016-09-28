import {RootPage} from 'src/pages/root'
import {RegisteredAction} from 'src/utils/actionDecorators'

import * as pathUtils from 'src/utils/path'

export class RawImagePage extends RootPage {
	@RegisteredAction({id: 'pa_button_go_to_pixiv_image', label:'Go to Image on Pixiv', icon: 'picture'})
	public returnToImage(){
		window.location.href = pathUtils.generateImageLink(pathUtils.getImageIdFromSourceUrl(this.path));
	}
}


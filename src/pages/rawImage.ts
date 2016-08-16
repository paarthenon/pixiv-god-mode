import {RootPage} from './root'
import {RegisteredAction} from '../utils/actionDecorators'

import * as pathUtils from '../utils/path'

export class RawImagePage extends RootPage {
	@RegisteredAction({id: '1', label:'return to image'})
	public returnToImage(){
		window.location.href = pathUtils.generateImageLink(pathUtils.getImageIdFromSourceUrl(this.path));
	}
}


import * as $ from 'jquery'
import * as pathUtils from 'src/utils/path'
import {ExecuteOnLoad} from 'src/utils/actionDecorators'
import {RootPage} from 'src/pages/root'
import {injectUserRelationshipButton} from 'src/injectors/openFolderInjector'
import {Model} from 'common/proto'

export class ArtistProfilePage extends RootPage {
	public get artistId():number {
		return pathUtils.getArtistId(this.path);
	}
	public get artistName():string {
		return $('h1.user').text();
	}
	public get artist():Model.Artist {
		return { id: this.artistId, name: this.artistName };
	}

	@ExecuteOnLoad
	public injectPageElements() {
		injectUserRelationshipButton(this.artist);
	}
}
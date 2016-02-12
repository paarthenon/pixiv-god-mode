import {BasePage} from './base'
import {RegisteredAction} from '../utils/actionDecorators'
import * as services from '../services'
import {log} from '../utils/log'

export class BookmarkMember extends BasePage {
	public get artistId():number {
		return parseInt((<any>unsafeWindow).pixiv.context.userId);
	}
	public darkenRecommendation(artists:Model.Artist[]){
		log("Darkening recommendations");
		this.jQuery('li.user-recommendation-item').toArray().forEach(recommendation => {
			let artistId = parseInt(this.jQuery(recommendation).attr('data-id'));

			let evaluation = false;
			// Artist save format is [<id>] - <username>
			if (artists.some(artist => artist.id === artistId)) {
				this.jQuery(recommendation).css('background-color', '#333334');
				evaluation = true;
			}
			log(`Checked if [${artistId}] was in the artists list, decided [${(evaluation?'YES':'NO')}]`);
		});
	}

	@RegisteredAction({ id: 'pa_darken_member_recommendation', label: 'Darken Recommendations' })
	public darken(){
		services.getArtistList(this.darkenRecommendation);
	}
}
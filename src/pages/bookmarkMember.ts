import {RootPage} from './root'
import {RegisteredAction} from '../utils/actionDecorators'
import * as services from '../services'
import {log} from '../utils/log'

export class BookmarkMember extends RootPage {
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
		services.getArtistList((artists) => this.darkenRecommendation(artists));
	}

	@RegisteredAction({ id: 'pa_load_all_member_recommendation', label: 'Load All Recommendations' })
	public loadAll(){
		this.jQuery('#wrapper ul.user-recommendation-items > li[data-user_id]').toArray().forEach(unloadedRecommendation => {
			let userId = this.jQuery(unloadedRecommendation).attr('data-user_id');
			(<any>unsafeWindow).pixiv.followingBooster.replace(userId, {
				user_ids: userId,
				illust_num: 4,
				get_illust_count: 1
            }, {});
		});
	}
}
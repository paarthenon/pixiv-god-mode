import * as $ from 'jquery'
import * as pathUtils from 'src/utils/path'
import {ExecuteOnLoad} from 'src/utils/actionDecorators'
import {RootPage} from 'src/pages/root'
import {Model} from 'common/proto'
import {Container as Deps} from 'src/deps'
import SettingKeys from 'src/settingKeys'

export class FollowArtistPage extends RootPage {
	public get artistId():number {
		return pathUtils.getArtistId(this.path);
	}
	public get artistName():string {
		return $('h1.user').text();
	}
	public get artist():Model.Artist {
		return { id: this.artistId, name: this.artistName };
	}

	protected actOnNewEntries() {
		let recommendations = $('li.user-recommendation-item:not([data-pa-processed="true"])').toArray().map(x => $(x));

		Deps.getSetting(SettingKeys.global.fadeArtistRecommendationsAlreadyBookmarked).then(settingValue => {
			if (settingValue) {
				recommendations.forEach(recommendation => {
					let links = recommendation.find('a:not(._work):not(.premium-feature)').toArray().map((a:HTMLAnchorElement) => a.href);
					Promise.all<boolean>(links.map(link => Deps.isPageBookmarked(link)))
						.then(results => {
							if(results.some(x => x)) {
								recommendation.addClass('pa-hidden-thumbnail');
							}
						});
				});
			}
		})
		
		Deps.getSetting(SettingKeys.global.directToManga).then(settingValue => {
			if (settingValue) {
				recommendations.forEach(recommendation => {
					recommendation.find('a._work.multiple')
						.toArray()
						.map(x => $(x))
						.forEach(mangaLink => {
							mangaLink.attr('href', mangaLink.attr('href').replace('medium', 'manga'));
						})
					recommendation.attr('data-pa-processed', 'true');
				})
			}
		});
	}

	@ExecuteOnLoad
	public injectTrigger() {
		document.addEventListener('pixivFollowRecommenationLoaded', () => this.actOnNewEntries());

		Deps.execOnPixiv(pixiv => {
			function issueNotification(){
				var evt = new CustomEvent('pixivFollowRecommenationLoaded', {});
				document.dispatchEvent(evt);
			}
			function paWrapFunction(func:Function, context:any) {
				return function() {
					issueNotification();
					func.call(context);
				}
			}

			pixiv.scrollView.process = paWrapFunction(pixiv.scrollView.process, pixiv.scrollView);
		});
	}
}
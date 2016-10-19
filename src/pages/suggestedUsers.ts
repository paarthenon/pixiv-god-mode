import * as $ from 'jquery'
import {ExecuteOnLoad} from 'src/utils/actionDecorators'
import {RootPage} from 'src/pages/root'
import {Container as Deps} from 'src/deps'
import SettingKeys from 'src/settingKeys'

export class SuggestedUsersPage extends RootPage {
	public fadeBookmarks() {
		Deps.getSetting(SettingKeys.global.fadeArtistRecommendationsAlreadyBookmarked).then(settingValue => {
			if (settingValue) {
				let recommendations = $('li.user-recommendation-item:not([data-pa-processed="true"])').toArray().map(x => $(x));

				recommendations.forEach(recommendation => {
					let links = recommendation.find('a:not(._work):not(.premium-feature)')
						.toArray().map((a:HTMLAnchorElement) => a.href);
					Promise.all<boolean>(links.map(link => Deps.isPageBookmarked(link)))
						.then(results => {
							if(results.some(x => x)) {
								recommendation.addClass('pa-hidden-thumbnail');
							}
						});
					recommendation.attr('data-pa-processed', 'true');
				});
			}
		});
	}

	@ExecuteOnLoad
	public injectTrigger() {
		document.addEventListener('pixivSuggestedUserLoaded', () => this.fadeBookmarks());

		Deps.execOnPixiv(pixiv => {
			function issueNotification(){
				var evt = new CustomEvent('pixivSuggestedUserLoaded', {});
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
import * as $ from 'jquery';
import * as pathUtils from 'src/utils/path';
import {ExecuteOnLoad} from 'src/utils/actionDecorators';
import {RootPage} from 'src/pages/root';
import {Model} from 'pixiv-assistant-common';
import {Container as Deps} from 'src/deps';
import SettingKeys from 'src/settingKeys';

import log from 'src/log';
let console = log.subCategory('Follow Artist Page');

export class FollowArtistPage extends RootPage {
    public get artistId(): number {
        return pathUtils.getArtistId(this.path);
    }
    public get artistName(): string {
        return $('h1.user').text();
    }
    public get artist(): Model.Artist {
        return {id: this.artistId, name: this.artistName};
    }

    protected actOnNewEntries() {
        console.debug('New items loaded, triggering actions');

        let recommendations = $(
            'li.user-recommendation-item:not([data-pa-processed="true"])',
        )
            .toArray()
            .map(x => $(x));
        console.debug(`Found ${recommendations.length} new items`);

        Deps.getSetting(
            SettingKeys.global.fadeArtistRecommendationsAlreadyBookmarked,
        ).then(settingValue => {
            if (settingValue) {
                recommendations.forEach(recommendation => {
                    let links = recommendation
                        .find('a:not(._work):not(.premium-feature)')
                        .toArray()
                        .map((a: HTMLAnchorElement) => a.href);
                    Promise.all<boolean>(
                        links.map(link => Deps.isPageBookmarked(link)),
                    ).then(results => {
                        if (results.some(x => x)) {
                            recommendation.addClass('pa-hidden-thumbnail');
                        }
                    });
                });
            }
        });

        Deps.getSetting(SettingKeys.global.directToManga).then(settingValue => {
            if (settingValue) {
                recommendations.forEach(recommendation => {
                    recommendation
                        .find('a._work.multiple')
                        .toArray()
                        .map(x => $(x))
                        .forEach(mangaLink => {
                            mangaLink.attr(
                                'href',
                                mangaLink.attr('href').replace('medium', 'manga'),
                            );
                        });
                    recommendation.attr('data-pa-processed', 'true');
                });
            }
        });
    }

    @ExecuteOnLoad
    public injectTrigger() {
        //TODO: Print error message if it can't find this.
        new MutationObserver(this.actOnNewEntries.bind(this)).observe(
            $('ul.user-recommendation-items')[0],
            {childList: true},
        );
    }
}

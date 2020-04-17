import {RootPage} from 'src/pages/root';

export class WikiArticlePage extends RootPage {
    protected getTagSelectors() {
        return [
            'h1#article-name',
            'nav#breadcrumbs div a span',
            'nav#breadcrumbs div.current span',
            'section.relation div.info a',
            "a[href*='http://dic.pixiv.net/a/']", //links to other wiki articles.
        ]
    }
}

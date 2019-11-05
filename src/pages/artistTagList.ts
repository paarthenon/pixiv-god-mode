import {RootPage} from 'src/pages/root';

/**
 * A listing of the most popular tags in the artist's works.
 */
export class ArtistTagListPage extends RootPage {
    protected getTagSelectors() {
        return ['div.user-tags li a', '.tag-list li a.tag-name']
    }
}

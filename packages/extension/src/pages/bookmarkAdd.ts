import {RootPage} from 'src/pages/root';

/**
 * An intermediary page that pops up when adding a work to your bookmarks.
 */
export class BookmarkAddPage extends RootPage {
    protected getTagSelectors() {
        return ['ul.tag-cloud li span'];
    }
}

import {RootPage} from 'src/pages/root';

export class TagOverviewPage extends RootPage {
    protected getTagSelectors() {
        return ['a.tag-value'];
    }
}

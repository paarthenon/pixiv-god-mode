import * as $ from 'jquery';
import {RootPage} from 'src/pages/root';

export class TagOverviewPage extends RootPage {
    protected getTagElements() {
        return ['a.tag-name'].map(tag => $(tag)).concat(super.getTagElements());
    }
}

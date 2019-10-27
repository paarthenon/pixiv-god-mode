import * as $ from 'jquery';
import {RootPage} from 'src/pages/root';

/**
 * The page arrived at when clicking on a tag. Shows the tag, a small bit of its hierarchy, and
 * links to the search and wiki pages for the tag.
 */
export class TagDetailPage extends RootPage {
    protected getTagElements() {
        return [
            'nav.breadcrumb > span > a > span',
            'span.self',
            'header.tags-portal-header h1.title a',
            'section.tags ul.items li a',
        ]
            .map(tag => $(tag))
            .concat(super.getTagElements());
    }
}

import {RootPage} from 'src/pages/root';
import {injectPagingButtons} from 'src/injectors/pagingButtonInjector';
import {awaitElement} from 'src/utils/document';
import log from 'src/log';

/**
 * Number of images on page
 */
const PAGE_SIZE = 48;

/**
 * Generic gallery page that is extended by the search and works pages.
 */
export abstract class GalleryPage extends RootPage {
    public get imageCountTotal(): Promise<number> {
        return awaitElement('#root > div > div > div > div > section > div > div:first() > div')
            .then($elem => parseInt($elem.text().replace(',', ''), 10)); //handle thousands
    }

    /**
     * Generate a url for the current page given a page number.
     * @param pageNum page number
     */
    protected getPageUrl(pageNum: number) {
        const pageX = /p=[0-9]+/;
        if (pageX.test(window.location.href)) {
            return window.location.href.replace(pageX, `p=${pageNum}`);
        } else {
            // don't need to worry about handling the no '?' case. Every page that uses this
            // has an explicit query parameter.
            return `${window.location.href}&p=${pageNum}`;
        }
    }

    protected async injectPagingButtons() {
        log.info('Injecting paging buttons');
        const lastPage = Math.ceil((1.0 * await this.imageCountTotal) / PAGE_SIZE);
        injectPagingButtons(this.getPageUrl(1), this.getPageUrl(lastPage));
    }
}

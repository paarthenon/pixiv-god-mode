import {ExecuteOnLoad, ExecuteIfSetting} from 'src/utils/actionDecorators';
import {GalleryPage} from 'src/pages/gallery';
import {DictionaryService} from 'src/services';

import {getSearchTerm} from 'src/utils/path';

import appLog from 'src/log';
const log = appLog.setCategory('Search');

export class SearchPage extends GalleryPage {
    @ExecuteOnLoad
    public async changeTitle() {
        const searchTerm = getSearchTerm(document.location.href);
        log.debug('Found search term:', searchTerm);

        const terms = await Promise.all(searchTerm.split(' ').map(async term => {
            const translation = await DictionaryService.getTranslation(term);
            log.info('Translation for search term', term, 'found to be', translation);
            return translation || term;
        }));
        const titleText = `[${terms.join(', ')}] Search Results`;
        log.info('Changing title to: ', titleText);
        document.title = titleText;
    }

    public getTagSelectors() {
        return [
            'div.with-translation-title h1 > a',
        ];
    }
}

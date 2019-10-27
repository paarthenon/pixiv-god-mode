import * as $ from 'jquery';
import {RootPage} from 'src/pages/root';
import {ExecuteOnLoad} from 'src/utils/actionDecorators';

import * as pathUtils from 'src/utils/path';

/**
 * Applies to the raw image files of pixiv. This is mainly useful because of the setting that allows
 * the open in tabs button to open the direct images rather than the pixiv illustration page for the
 * image. This setting is very useful for weaker computers that can't handle loading 20 javascript-
 * laden tabs at once. However, its desirable to have a simple way of getting back to the pixiv
 * image page if you'd like to add the image to your bookmarks or examine its tags.
 *
 * TODO: This is defunct since I removed page actions from the popup. Need to inject this into something
 * else, probably the right-click menu.
 */
export class RawImagePage extends RootPage {
    @ExecuteOnLoad
    public bindEvent() {
        $('img').on('dblclick', () => {
            this.returnToImage();
        });
    }
    public returnToImage() {
        window.location.href = pathUtils.generateImageLink(
            pathUtils.getImageIdFromSourceUrl(this.path),
        );
    }
}

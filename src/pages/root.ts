import * as $ from 'jquery';
import {BasePage} from 'src/pages/base';
import {DictionaryService} from 'src/services';
import {Container} from 'src/deps';
import SettingKeys from 'src/settingKeys';
import {awaitElement} from 'src/utils/document';
import appLog from 'src/log';
import {Sigil} from 'daslog';

const log = appLog.setCategory('Tag').reformat(() => [Sigil.Time(), Sigil.Category()]).setMinimumLogLevel('info');

// Found a way of distinguishing my translations from normal pixiv tags.
const MARKER = {
    FLAG: '⚑',
    BOLT: '🗲',
} as const;

async function replaceTextInNode($jq: JQuery) {
    let textNode = $jq.contents().filter(function() {
        return this.nodeType === Node.TEXT_NODE;
    });

    const translatedText = await DictionaryService.getTranslation(textNode.text());
    if (translatedText) {
        log.info(`Translating [${textNode.text()} -> ${translatedText}]`);
        $jq.attr('data-pa-translation-backup', textNode.text());
        textNode.replaceWith(`${translatedText} ${MARKER.FLAG}`);
    } else {
        log.info(`No translation for [${textNode.text()}]`);
    }
}
/**
 * Mainly responsible for handling tag translation.
 */
export class RootPage extends BasePage {
    constructor(protected path: string) {
        super(path);

        Container.getSetting(SettingKeys.global.translateTags).then(translate => {
            if (translate) this.wokeTranslate();
        });
    }
    protected getTagElements(): JQuery[] {
        return [];
    }

    protected getTagSelectors() {
        return [] as string[];
    }

    public wokeTranslate() {
        this.getTagSelectors().forEach(selector => {
            awaitElement(selector).then($found => $found.toArray().forEach(elem => replaceTextInNode($(elem))));
        })
    }
}

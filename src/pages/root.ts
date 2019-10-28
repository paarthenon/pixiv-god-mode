import * as $ from 'jquery';
import {BasePage} from 'src/pages/base';
import {DictionaryService} from 'src/services';
import {Container} from 'src/deps';
import SettingKeys from 'src/settingKeys';
import {awaitElement} from 'src/utils/document';
import log from 'src/log';

async function replaceTextInNode($jq: JQuery) {
    let textNode = $jq.contents().filter(function() {
        return this.nodeType === Node.TEXT_NODE;
    });

    log.info('Replacing text in node', textNode.text());
    const translatedText = await DictionaryService.getTranslation(textNode.text());

    if (translatedText) {
        $jq.attr('data-pa-translation-backup', textNode.text());
        textNode.replaceWith(translatedText);
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
            log.info('Checking selector', selector);
            awaitElement(selector).then($found => $found.toArray().forEach(elem => replaceTextInNode($(elem))));
        })
    }

    public translateTagsOnPage(): void {
        this.getTagElements().forEach(jQTagElement =>
            jQTagElement
                .toArray()
                .map(x => $(x))
                .forEach(tagElement => {
                    let textNode = tagElement.contents().filter(function() {
                        return this.nodeType === Node.TEXT_NODE;
                    });
                    DictionaryService.getTranslation(textNode.text()).then(
                        translatedText => {
                            if (translatedText) {
                                tagElement.attr(
                                    'data-pa-translation-backup',
                                    textNode.text(),
                                );
                                textNode.replaceWith(translatedText);
                            }
                        },
                    );
                }),
        );
    }
    public revertTagTranslations(): void {
        this.getTagElements().forEach(jQTagElement =>
            jQTagElement
                .toArray()
                .map(x => $(x))
                .forEach(tagElement => {
                    let textNode = tagElement.contents().filter(function() {
                        return this.nodeType === Node.TEXT_NODE;
                    });
                    let backedUpText = tagElement.attr('data-pa-translation-backup');
                    if (backedUpText) {
                        textNode.replaceWith(backedUpText);
                        tagElement.attr('data-pa-translation-backup', '');
                    }
                }),
        );
    }
}

import {ArtworkAction} from 'page/artwork';
import {PageContext} from 'page/context';
import {PageAction} from 'page/pageAction';
import {fields, payload, TypeNames, variant, variantList, VariantOf} from 'variant';

export interface KamiSettings {
    saveAction: typeof ArtworkAction.Download | typeof ArtworkAction.SendToBloom;
}

export const BGCommand = variantList([
    variant('downloadd', fields<{url: string}>()),
    variant('setBadge', fields<{
        text: string,
    }>()),
    variant('cacheContext', fields<{
        tabId: number,
        context: PageContext,
    }>()),
    variant('getContext', fields<{
        tabId: number,
    }>()),
    
    variant('cacheActions', fields<{
        actions: PageAction[],
    }>()),
    variant('getActions', fields<{
        tabId: number,
    }>()),

    variant('getSettings'),
    variant('setSettings', payload<Partial<KamiSettings>>()),
    variant('createTabs', payload<string[]>()),
]);
export type BGCommand<T extends TypeNames<typeof BGCommand> = undefined> = VariantOf<typeof BGCommand, T>;

export const CSCommand = variantList([
    variant('IllustInfo'),
]);
export type CSCommand<T extends TypeNames<typeof CSCommand> = undefined> = VariantOf<typeof CSCommand, T>;

export const PageCommand = variantList([
    variant('GetContext'),
    variant('GetActions'),
    variant('PerformAction', payload<PageAction>()),
]);
export type PageCommand<T extends TypeNames<typeof PageCommand> = undefined> = VariantOf<typeof PageCommand, T>;

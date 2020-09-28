import {IllustrationInfo, UserInfo} from 'core/api/models';
import {variantList, variant, fields, TypeNames, VariantOf} from 'variant';

export const PageContext = variantList([
    variant('Default', fields<{url: string}>()),
    variant('Artwork', fields<{illustInfo: IllustrationInfo, artist: UserInfo}>()),
]);
export type PageContext<T extends TypeNames<typeof PageContext> = undefined> = VariantOf<typeof PageContext, T>;

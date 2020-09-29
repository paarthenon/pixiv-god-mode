import {IllustPageInfo, IllustrationInfo, UserInfo, UserProfile} from 'core/api/models';
import {variantList, variant, fields, TypeNames, VariantOf} from 'variant';

export const PageContext = variantList([
    variant('Default', fields<{url: string}>()),
    variant('Artwork', fields<{
        artist: UserInfo,
        artistProfile: UserProfile,
        illustInfo: IllustrationInfo,
        pages?: IllustPageInfo[],
    }>()),
    variant('User', fields<{
        user: UserInfo,
        profile: UserProfile,
    }>()),
]);
export type PageContext<T extends TypeNames<typeof PageContext> = undefined> = VariantOf<typeof PageContext, T>;

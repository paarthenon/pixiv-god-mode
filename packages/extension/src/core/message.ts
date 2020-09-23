import {fields, TypeNames, variant, variantList, VariantOf} from 'variant';

export const BGCommand = variantList([
    variant('downloadd', fields<{url: string}>()),
]);
export type BGCommand<T extends TypeNames<typeof BGCommand> = undefined> = VariantOf<typeof BGCommand, T>;

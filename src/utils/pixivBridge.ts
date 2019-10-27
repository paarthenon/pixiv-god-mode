import {Container as Deps} from 'src/deps';

export function userProfile(artistId: number) {
    return Deps.execOnPixiv(
        (pixiv, props) => {
            return pixiv.api.get(
                '/rpc/get_profile.php',
                {
                    user_ids: props.artistId,
                    illust_num: 1000000,
                },
                {},
            );
        },
        {
            artistId: artistId,
        },
    );
}

export function illustDetails(ids: number[]) {
    return Deps.execOnPixiv(
        (pixiv, props) => {
            return pixiv.api.get('/rpc/index.php', {
                mode: 'get_illust_detail_by_ids',
                illust_ids: props.ids.join(),
            });
        },
        {ids},
    );
}

export function illustDetail(id: number) {
    return illustDetails([id]);
}

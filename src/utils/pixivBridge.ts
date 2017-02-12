import {Container as Deps} from 'src/deps'

export function userProfile(artistId:number) {
    return Deps.execOnPixiv(
        (pixiv, props) => {
            return pixiv.api.get('/rpc/get_profile.php', {
                user_ids: props.artistId,
                illust_num: 1000000
            }, {})
        },{
            artistId: artistId
        });
}

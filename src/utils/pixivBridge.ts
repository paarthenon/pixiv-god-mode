import {Container as Deps} from 'src/deps';
import {AjaxRequest} from 'src/core/IAjax';
import {IllustrationType} from 'src/pages/illustration';

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

interface IllustrationInfo {
    id: string;
    illustId: string;
    illustTitle: string;
    illustType: IllustrationType;
    likeCount: number;
    width: number;
    height: number;
}
export function illustDetail(id: number) {
    return Deps.ajaxCall({
        type: 'GET',
        url: `https://www.pixiv.net/ajax/illust/${id}`
    }).then<Result<IllustrationInfo>>(JSON.parse)
}

type Result<T> = {
    body: T,
    error: boolean;
    message: string;
}
interface UgoiraInfo {
    frames: {
        file: string;
        delay: number;
    }[]
    mime_type: string;
    originalSrc: string;
    src: string;
}

export function ugoiraDetails(id: number) {
    return Deps.ajaxCall<AjaxRequest<unknown>, string>({
        type: 'GET',
        url: `https://www.pixiv.net/ajax/illust/${id}/ugoira_meta`,
    }).then<Result<UgoiraInfo>>(JSON.parse);
}

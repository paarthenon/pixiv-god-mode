import _log from 'log';
import {ApiResponse, IllustPageInfo, IllustrationInfo, UgoiraMeta, UserInfo} from './api/models';
const log = _log.setCategory('API');

async function apiCall<T = any>(url: string): Promise<T> {
    const response = await fetch(url);
    return await response.json();
}

export async function getBlob(url: string): Promise<Blob> {
    const response = await fetch(url);
    return await response.blob();
}

export async function getIllustInfo(id: number) {
    const ret = await apiCall<ApiResponse<IllustrationInfo>>(`https://www.pixiv.net/ajax/illust/${id}`);
    return ret;
}

export async function getIllustPages(id: number) {
    const ret = await apiCall<ApiResponse<IllustPageInfo[]>>(`https://www.pixiv.net/ajax/illust/${id}/pages`);
    return ret;
}

export async function getUgoiraMeta(id: number) {
    const ret = await apiCall<ApiResponse<UgoiraMeta>>(`https://www.pixiv.net/ajax/illust/${id}/ugoira_meta`);
    return ret;
}

export async function getUser(id: number) {
    const ret = await apiCall<ApiResponse<UserInfo>>(`https://www.pixiv.net/ajax/user/${id}`);
    return ret;
}

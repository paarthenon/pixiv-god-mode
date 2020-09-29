import {getUser, getUserProfile} from 'core/API';
import {extract} from 'util/path';
import {PageContext} from './context';
import {RootPage} from './root';



export class UserPage extends RootPage {
    public static getUserId(url: string) {
        const idStr = extract(url, /users\/([0-9]*)/);
        if (idStr != undefined) {
            return parseInt(idStr);
        }
    }
    async getContext() {
        const id = UserPage.getUserId(this.url);
        const res = await getUser(id!);
        const profileRes = await getUserProfile(id!);
        return PageContext.User({
            user: res.body,
            profile: profileRes.body,
        });
    }
}
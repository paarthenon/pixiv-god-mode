
export enum IllustrationType {
    Picture,
    Manga,
    Animation,
}

export interface CommentInfo {
    commentCount: number;
}
export interface IllustrationInfo extends CommentInfo {
    /**
     * Number of times image has been bookmarked.
     */
    bookmarkCount: number;
    /**
     * Personal bookmark info. `null` if not bookmarked, {id: string, private: boolean} otherwise.
     */
    bookmarkData:
        | {
            id: string;
            private: boolean;
        }
        | null
    ;

    /**
     * Date rendered as string
     * 
     */
    createDate: string;

    /**
     * The description associated with the image. Should be the *same* as illustComment, so I'm leaving out illustComment;
     */
    description: string;

    /**
     * Height of image in pixels
     */
    height: number;
    /**
     * Number, but rendered as string.
     */
    illustId: string;

    /**
     * Title associated with the image
     */
    illustTitle: string;

    /**
     * So far... just a number. Probably
     *  0 - single image
     * 
     */
    illustType: IllustrationType


    /**
     * How many likes the image has
     */
    likeCount: number;
    /**
     * Does the logged in user like the image
     */
    likeData: boolean;
    /**
     * Number of pages in illustration. Is 1 on single page works.
     */
    pageCount: number;

    /**
     * Relevant urls
     */
    urls: {
        mini?: string;
        original: string;
        regular?: string;
        small?: string;
        thumb?: string;
    }
    
    userAccount: string;
    userId: string; // number as string
    /**
     * Map of {[id: string]: unknown | null}, unknown is mini illust info. 
     */
    userIllusts: unknown;
    /**
     * Name of user who posted the illustration.
     */
    userName: string;
    /**
     * Number of times seen by community
     */
    viewCount: number;

    /**
     * Width of image in pixels
     */
    width: number;

    /**
     * boolean rendered as number (0-1)
     */
    xRestrict: number;
}

export interface UgoiraMeta {
    frames: Array<{file: string; delay: number}>;
    mime_type: string;
    /**
     * The full files.
     */
    originalSrc: string;
    src: string;
}

export interface UserInfo {
    acceptRequest: boolean;
    /**
     * Profile icon
     */
    image: string;
    imageBig: string;
    isBlocking: boolean;
    isFollowed: boolean;
    isMypixiv: boolean;
    name: string;
    premium: boolean;
    userId: string;
}

export interface UserProfile {
    illusts: {[id: string]: null};
    manga: {[id: string]: null};
    novels: {[id: string]: null};
}

export interface UserFollowerInfo {
    extraData: unknown;
    followUserTags: unknown[];
    /**
     * Total number of followers that the user has.
     */
    total: number;
    users: unknown[];
    zoneConfig: unknown;
}

export interface IllustPageInfo {
    height: number;
    width: number;
    urls: PixivUrls;
}

export interface PixivUrls {
    original: string;

    regular?: string;
    small?: string;
    thumb_mini?: string;
}

export interface ApiResponse<T = IllustrationInfo> {
    body: T;
    error: boolean;
    message: string;
}
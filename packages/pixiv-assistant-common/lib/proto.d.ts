export declare const Features: {
    OpenToRepo: string;
    OpenToArtist: string;
    OpenToImage: string;
    DownloadImage: string;
    DownloadManga: string;
    DownloadAnimation: string;
    ImageExists: string;
    ImagesExist: string;
    ListArtists: string;
};
export declare module Model {
    interface Artist {
        id: number;
        name: string;
    }
    interface Image {
        id: number;
        page?: number;
        ext?: string;
        animation?: boolean;
    }
}
export declare module Messages {
    interface Response {
        success: boolean;
    }
    interface PositiveResponse<T> extends Response {
        data: T;
    }
    interface NegativeResponse extends Response {
        errors: string[];
    }
    function isPositiveResponse<T>(resp: Response): resp is PositiveResponse<T>;
    function isNegativeResponse(resp: Response): resp is NegativeResponse;
    interface ImageRequest {
        image: Model.Image;
    }
    interface ArtistRequest {
        artist: Model.Artist;
    }
    interface UrlRequest {
        url: string;
    }
    type ArtistImageRequest = ArtistRequest & ImageRequest;
    type ArtistUrlRequest = ArtistRequest & UrlRequest;
    interface BulkRequest<T> {
        items: T[];
    }
}

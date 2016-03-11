export const Features = {
	OpenToRepo: 'openRepo',
	OpenToArtist: 'openArtist',
	DownloadImage: 'downloadImage',
	DownloadManga: 'downloadManga',
	DownloadAnimation: 'downloadAnimation',
	ImageExists: 'imageExists',
	ImageExistsForArtist: 'imageExistsForArtist'
}

export module Model {
	export interface Artist {
		id: number
		name: string
	}
	export interface Image {
		id: number
		page?: number
		ext?: string
	}
}

export module Messages {
	export interface Response<T> {
		success :boolean
	}
	export interface PositiveResponse<T> extends Response<T> {
		data :T
	}
	export interface NegativeResponse<T> extends Response<T> {
		errors: string[]
	}

	export function isPositiveResponse<T>(resp:Response<T>): resp is PositiveResponse<T> {
		return resp.success;
	}
	export function isNegativeResponse<T>(resp:Response<T>): resp is NegativeResponse<T> {
		return !resp.success;
	}

	export interface ImageRequest {
		image :Model.Image
	}
	export interface ArtistRequest {
		artist: Model.Artist
	}
	export interface UrlRequest {
		url: string
	}
	export type ArtistImageRequest = ArtistRequest & ImageRequest
	export type ArtistUrlRequest = ArtistRequest & UrlRequest

}

declare module Model {
	export interface Artist {
		id: number
		name: string
	}
	export interface Image {
		id: number
		page?: number
		ext? :string
	}
}


declare module Message {
	export interface ArtistListResponse {
		artists: Model.Artist[]
	}

	export interface ImagesByArtistRequest {
		artist: Model.Artist
	}

	export interface ImagesByArtistResponse {
		imaages: Model.Image[]
	}

	export interface OpenFolderRequest {
		artist: Model.Artist
	}

	export interface DownloadRequest {
		artist: Model.Artist
		url: string
	}
}
export interface Database {
	Artists: Array<Model.Artist>
	getImagesForArtist: (artist:Model.Artist) => Model.Image[]
	getArtistById: (id:number) => Model.Artist
	getPathForArtist: (artist:Model.Artist) => string
	getPathForImage: (artist:Model.Artist, image:Model.Image) => string
}

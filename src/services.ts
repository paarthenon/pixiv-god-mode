import Config from './utils/config'

let server_url = Config.get('server_url');

class HTTP {
	static GET = 'GET'; 
	static POST = 'POST'; 
}

export function getArtistList(callback:(artists:Model.Artist[]) => any):void {
	GM_xmlhttpRequest({
		method: HTTP.GET,
		url: `${server_url}/list`,
		onload: (response) => callback(JSON.parse(response.responseText))
	});
}

export function getArtistImages(artistId:number, callback:(items:Model.Image[]) => any):void {
	GM_xmlhttpRequest({
		method: HTTP.GET,
		url: `${server_url}/artist/${artistId}`,
		onload: (response) => callback(JSON.parse(response.responseText))
	});
}

export function openFolder(artist:Model.Artist):void {
	GM_xmlhttpRequest({
		method: HTTP.POST,
		url: `${server_url}/openFolder/${artist.id}`,
		data: `name=${artist.name}`,
		headers: {
			"Content-Type": "application/x-www-form-urlencoded"
		}
	});
}

export function download(artist:Model.Artist, imageUrl:string):void {
	GM_xmlhttpRequest({
		method: HTTP.POST,
		url: `${server_url}/download`,
		data: `id=${artist.id}&name=${artist.name}&url=${imageUrl}`,
		headers: {
			"Content-Type": "application/x-www-form-urlencoded"
		}
	});
}

export function downloadMulti(artist: Model.Artist, imageUrls: string[]): void {
	let toSend = { artist: artist, urls: imageUrls };
	GM_xmlhttpRequest({
		method: HTTP.POST,
		url: `${server_url}/downloadMulti`,
		data: JSON.stringify(toSend),
		headers: {
			"Content-Type": "application/json"
		}
	});
}
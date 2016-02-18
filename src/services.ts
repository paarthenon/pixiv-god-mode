import Config from './utils/config'
import ConfigKeys from './configKeys'

import {log} from './utils/log'

let server_url = Config.get(ConfigKeys.server_url);
if(!server_url){
	server_url = window.prompt("Server url?", 'http://localhost:9002');
	Config.set(ConfigKeys.server_url, server_url);
}

class HTTP {
	static GET = 'GET'; 
	static POST = 'POST'; 
}

export function getArtistList(callback:(artists:Model.Artist[]) => any):void {
	log('SERVICES getArtistList called');
	GM_xmlhttpRequest({
		method: HTTP.GET,
		url: `${server_url}/list`,
		onload: (response) => callback(JSON.parse(response.responseText))
	});
}

export function getArtistImages(artistId:number, callback:(items:Model.Image[]) => any):void {
	log(`SERVICES getArtistImages called with artist id [${artistId}]`);
	GM_xmlhttpRequest({
		method: HTTP.GET,
		url: `${server_url}/artist/${artistId}`,
		onload: (response) => callback(JSON.parse(response.responseText))
	});
}

export function openFolder(artist:Model.Artist):void {
	log(`SERVICES openFolder called with artist { id: ${artist.id}, name: ${artist.name} }`);
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
	log(`SERVICES download called with artist { id: ${artist.id}, name: ${artist.name} } and imageUrl [${imageUrl}]`);
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
	log(`SERVICES downloadMulti called with artist { id: ${artist.id}, name: ${artist.name} } and imageUrls of count [${imageUrls.length}]`);
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
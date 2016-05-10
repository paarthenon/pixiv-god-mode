import * as Deps from './deps'
let Config = Deps.Container.config;
import ConfigKeys from './configKeys'

import * as log4js from 'log4js'
let logger = log4js.getLogger('Services');

import {Features, Model, Messages} from '../common/proto'

class HTTP {
	static GET = 'GET'; 
	static POST = 'POST'; 
}

function callService<Req, Res>(feature: string, request: Req) :Promise<Res> {
	return Config.get(ConfigKeys.server_url).then(server_url => {
		return new Promise((resolve, reject) => {
			GM_xmlhttpRequest({
				method: HTTP.POST,
				url: `${server_url}/${feature}`,
				data: JSON.stringify(request),
				headers: { "Content-Type": "application/json" },
				onload: (response) => {
					let parsedResponse: Messages.Response = JSON.parse(response.responseText);

					if (Messages.isPositiveResponse<Res>(parsedResponse)) {
						resolve(parsedResponse.data);
					} else {
						reject('Negative response');
					}
				}
			});
		});
	})
}

export function openFolder(artist: Model.Artist): void {
	logger.debug(`SERVICES openFolder called with artist { id: ${artist.id}, name: ${artist.name} }`);
	callService(Features.OpenToArtist, artist);
}


export function download(artist:Model.Artist, imageUrl:string):void {
	logger.debug(`SERVICES download called with artist { id: ${artist.id}, name: ${artist.name} } and imageUrl [${imageUrl}]`);
	let msg: Messages.ArtistUrlRequest = { artist: artist, url: imageUrl };
	callService(Features.DownloadImage, msg);
}

export function downloadZip(artist: Model.Artist, zipUrl: string): void {
	logger.debug(`SERVICES download called with artist { id: ${artist.id}, name: ${artist.name} } and zipUrl [${zipUrl}]`);
	let msg: Messages.ArtistUrlRequest = { artist: artist, url: zipUrl };
	callService(Features.DownloadAnimation, msg);
}

export function downloadMulti(artist: Model.Artist, imageUrls: string[]): void {
	logger.debug(`SERVICES downloadMulti called with artist { id: ${artist.id}, name: ${artist.name} } and imageUrls of count [${imageUrls.length}]`);
	let msg : Messages.BulkArtistUrlRequest = { items: imageUrls.map(url => ({ artist, url })) };
	callService(Features.DownloadManga, msg);
}

export function imageExistsInDatabase(artist: Model.Artist, image: Model.Image, callback: (param: boolean) => any): void {
	logger.debug(`SERVICES imageExistsInDatabase called with artist { id: ${artist.id}, name: ${artist.name} } and imageId [${image.id}]`);
	let msg: Messages.ArtistImageRequest = { artist, image };
	callService<Messages.ArtistImageRequest, boolean>(Features.ImageExists, msg)
		.then(callback);
}

export function bulkImageExists(entries: Messages.ArtistImageRequest[]) : Promise<Messages.ArtistImageRequest[]> {
	return callService(Features.ImagesExist, { items: entries });
}

export function googleTranslate(japanese:string, callback:(english:string) => any) {
	let serviceUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=ja&tl=en&dt=t&q=${encodeURI(japanese)}`;
	GM_xmlhttpRequest({
		method: HTTP.GET,
		url: serviceUrl,
		onload: (response) => {
			let match = response.responseText.match(/\[\[\[\"([^\"]+)\",/);
			if (match && match.length > 1) {
				callback(match[1]);
			}
			callback(undefined);
		}
	});
}

export function executeManual(obj:any) {
	GM_xmlhttpRequest(obj);
}

export function supportsFeature(feature:string) {
	return callService(`supports/${feature}`, {});
}

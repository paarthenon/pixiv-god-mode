import * as Deps from './deps'
import ConfigKeys from './configKeys'

import * as log4js from 'log4js'
let logger = log4js.getLogger('Services');

import {Features, Model, Messages} from '../common/proto'

import {resolve} from 'url'

class HTTP {
	static GET = 'GET'; 
	static POST = 'POST'; 
}

function callService<Req, Res>(feature: string, request: Req) :Promise<Res> {
	return Deps.Container.config.get(ConfigKeys.server_url).then(server_url => {
		return Deps.Container.ajaxCall({
			type: 'POST',
			url: resolve(server_url.toString(),feature),
			data: request
		})
		.then((response:any) => {
			logger.fatal('response received', response);
			let parsedResponse: Messages.Response = JSON.parse(response);
			if(Messages.isPositiveResponse(parsedResponse)) {
				return parsedResponse.data;
			} else {
				return Promise.reject('Negative response');
			}
		})
	})
}

export function openFolder(artist: Model.Artist) {
	logger.debug(`SERVICES openFolder called with artist { id: ${artist.id}, name: ${artist.name} }`);
	return callService(Features.OpenToArtist, artist);
}


export function download(artist:Model.Artist, imageUrl:string) {
	logger.debug(`SERVICES download called with artist { id: ${artist.id}, name: ${artist.name} } and imageUrl [${imageUrl}]`);
	let msg: Messages.ArtistUrlRequest = { artist: artist, url: imageUrl };
	return callService(Features.DownloadImage, msg);
}

export function downloadZip(artist: Model.Artist, zipUrl: string) {
	logger.debug(`SERVICES download called with artist { id: ${artist.id}, name: ${artist.name} } and zipUrl [${zipUrl}]`);
	let msg: Messages.ArtistUrlRequest = { artist: artist, url: zipUrl };
	return callService(Features.DownloadAnimation, msg);
}

export function downloadMulti(artist: Model.Artist, imageUrls: string[]) {
	logger.debug(`SERVICES downloadMulti called with artist { id: ${artist.id}, name: ${artist.name} } and imageUrls of count [${imageUrls.length}]`);
	let msg : Messages.BulkArtistUrlRequest = { items: imageUrls.map(url => ({ artist, url })) };
	return callService(Features.DownloadManga, msg);
}

export function imageExistsInDatabase(artist: Model.Artist, image: Model.Image, callback: (param: boolean) => any) {
	logger.debug(`SERVICES imageExistsInDatabase called with artist { id: ${artist.id}, name: ${artist.name} } and imageId [${image.id}]`);
	let msg: Messages.ArtistImageRequest = { artist, image };
	return callService<Messages.ArtistImageRequest, boolean>(Features.ImageExists, msg)
		.then(callback);
}

export function bulkImageExists(entries: Messages.ArtistImageRequest[]) : Promise<Messages.ArtistImageRequest[]> {
	return callService(Features.ImagesExist, { items: entries });
}

export function googleTranslate(japanese:string) : Promise<string> {
	let serviceUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=ja&tl=en&dt=t&q=${encodeURI(japanese)}`;
	return Deps.Container.ajaxCall({
		type: 'GET',
		url: serviceUrl
	}).then((response:any) => {
		logger.fatal('response from translation', response);
		let match = response.match(/\[\[\[\"([^\"]+)\",/);
		if (match && match.length > 1) {
			return match[1];
		}
		return Promise.reject('incorrectly formatted response received');
	});
}

export function supportsFeature(feature:string) {
	return callService(`supports/${feature}`, {});
}

import {resolve} from 'url'
import {Features, Model, Messages} from 'pixiv-assistant-common'
import {AjaxFunction} from 'src/core/IAjax'
import IConfig from 'src/core/IConfig'
import ConfigKeys from 'src/configKeys'

import {prefix} from 'src/utils/log'
let console = prefix('Server Connection');

/**
 * Handles all functionality connecting to the database component. 
 */
export class PAServer {

	constructor(protected config:IConfig, protected ajax:AjaxFunction<any,any>) {}

	public callEndpoint<Req, Res>(feature: string, request?: Req) :Promise<Res> {
		return this.config.get(ConfigKeys.server_url).then(server_url => {
			return this.ajax({
				type: 'POST',
				url: resolve(server_url.toString(),feature),
				data: request
			})
			.then((response:any) => {
				console.debug('Received response');
				let parsedResponse: Messages.Response = JSON.parse(response);
				if(Messages.isPositiveResponse(parsedResponse)) {
					return parsedResponse.data;
				}
				if(Messages.isNegativeResponse(parsedResponse)) {
					console.error('Server returned failed response', parsedResponse.errors);
					return Promise.reject('Negative response: ' + JSON.stringify(parsedResponse.errors));
				}
				return Promise.reject('Invalid message type');
			})
		})
	}

	public openFolder(artist: Model.Artist) {
		console.debug(`openFolder called with artist { id: ${artist.id}, name: ${artist.name} }`);
		return this.callEndpoint(Features.OpenToArtist, artist)
			.catch(() => this.openRepo());
	}

	public openImageFolder(image: Model.Image) :Promise<void> {
		return this.callEndpoint<{image: Model.Image}, void>(Features.OpenToImage, {image});
	}

	public openRepo() {
		console.debug('openRepo called');
		return this.callEndpoint(Features.OpenToRepo);
	}

	public download(artist:Model.Artist, imageUrl:string) {
		console.debug(`download called with artist { id: ${artist.id}, name: ${artist.name} } and imageUrl [${imageUrl}]`);
		let msg: Messages.ArtistUrlRequest = { artist: artist, url: imageUrl };
		return this.callEndpoint(Features.DownloadImage, msg)
			.then(() => Promise.resolve());
	}

	public downloadAnimation(request: Messages.ArtistImageRequest, content:string) {
		console.debug(`download called with artist { id: ${request.artist.id}, name: ${request.artist.name} } and image [${request.image.id}]`);
		let msg = Object.assign(request, { content }); 
		return this.callEndpoint(Features.DownloadAnimation, msg)	
			.then(() => Promise.resolve());
	}

	public downloadMulti(artist: Model.Artist, imageUrls: string[]) {
		console.debug(`downloadMulti called with artist { id: ${artist.id}, name: ${artist.name} } and imageUrls of count [${imageUrls.length}]`);
		let msg : Messages.BulkRequest<Messages.ArtistUrlRequest> = { items: imageUrls.map(url => ({ artist, url })) };
		return this.callEndpoint(Features.DownloadManga, msg)
			.then(() => Promise.resolve());
	}

	public imageExistsInDatabase(artist: Model.Artist, image: Model.Image) : Promise<boolean> {
		console.debug(`imageExistsInDatabase called with artist { id: ${artist.id}, name: ${artist.name} } and imageId [${image.id}]`);
		let msg: Messages.ArtistImageRequest = { artist, image };
		return this.callEndpoint<Messages.ArtistImageRequest, boolean>(Features.ImageExists, msg)
	}

	public bulkImageExists(entries: Messages.ArtistImageRequest[]) : Promise<Messages.ArtistImageRequest[]> {
		console.debug(`bulkImagesExist called with ${entries.length} entries`);
		return this.callEndpoint(Features.ImagesExist, { items: entries })
			.then(result => {console.debug('received', result); return result; })
	}

	public ping() : Promise<void> {
		return this.callEndpoint('ping').then<void>(() => Promise.resolve());
	}

	public supportsFeature(feature:string) : Promise<boolean> {
		return this.callEndpoint(`supports/${feature}`, {});
	}

	public supportedFeatures() : Promise<string[]> {
		return Promise.all<string>(Object.keys(Features).map(key => 
				this.supportsFeature((<any>Features)[key])
					.then(supported => {
						if (supported) {
							return (<any>Features)[key];
						} else {
							return undefined;
						}
					})
			)).then(arr => arr.filter(x => x != undefined));
	}

}
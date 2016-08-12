import {resolve} from 'url'
import * as log4js from 'log4js'

import {Features, Model, Messages} from '../../common/proto'

import {AjaxFunction} from './IAjax'
import IConfig from './IConfig'

import ConfigKeys from '../configKeys'

let HTTP = {
	GET: 'GET',
	POST: 'POST', 
};

export class PAServer {
	protected logger = log4js.getLogger('PAServer Services');

	constructor(protected config:IConfig, protected ajax:AjaxFunction<any,any>) {}

	protected callEndpoint<Req, Res>(feature: string, request: Req) :Promise<Res> {
		return this.config.get(ConfigKeys.server_url).then(server_url => {
			return this.ajax({
				type: 'POST',
				url: resolve(server_url.toString(),feature),
				data: request
			})
			.then((response:any) => {
				let parsedResponse: Messages.Response = JSON.parse(response);
				if(Messages.isPositiveResponse(parsedResponse)) {
					return parsedResponse.data;
				} else {
					return Promise.reject('Negative response');
				}
			})
		})
	}

	public openFolder(artist: Model.Artist) {
		this.logger.debug(`openFolder called with artist { id: ${artist.id}, name: ${artist.name} }`);
		return this.callEndpoint(Features.OpenToArtist, artist);
	}

	public download(artist:Model.Artist, imageUrl:string) {
		this.logger.debug(`download called with artist { id: ${artist.id}, name: ${artist.name} } and imageUrl [${imageUrl}]`);
		let msg: Messages.ArtistUrlRequest = { artist: artist, url: imageUrl };
		return this.callEndpoint(Features.DownloadImage, msg);
	}

	public downloadZip(artist: Model.Artist, zipUrl: string) {
		this.logger.debug(`download called with artist { id: ${artist.id}, name: ${artist.name} } and zipUrl [${zipUrl}]`);
		let msg: Messages.ArtistUrlRequest = { artist: artist, url: zipUrl };
		return this.callEndpoint(Features.DownloadAnimation, msg);
	}

	public downloadMulti(artist: Model.Artist, imageUrls: string[]) {
		this.logger.debug(`downloadMulti called with artist { id: ${artist.id}, name: ${artist.name} } and imageUrls of count [${imageUrls.length}]`);
		let msg : Messages.BulkArtistUrlRequest = { items: imageUrls.map(url => ({ artist, url })) };
		return this.callEndpoint(Features.DownloadManga, msg);
	}

	public imageExistsInDatabase(artist: Model.Artist, image: Model.Image, callback: (param: boolean) => any) {
		this.logger.debug(`imageExistsInDatabase called with artist { id: ${artist.id}, name: ${artist.name} } and imageId [${image.id}]`);
		let msg: Messages.ArtistImageRequest = { artist, image };
		return this.callEndpoint<Messages.ArtistImageRequest, boolean>(Features.ImageExists, msg)
			.then(callback);
	}

	public bulkImageExists(entries: Messages.ArtistImageRequest[]) : Promise<Messages.ArtistImageRequest[]> {
		return this.callEndpoint(Features.ImagesExist, { items: entries });
	}

	public supportsFeature(feature:string) {
		return this.callEndpoint(`supports/${feature}`, {});
	}

}
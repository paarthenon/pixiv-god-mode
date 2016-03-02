import * as path from "path"
import * as fs from "fs"
import * as _ from "underscore"
import * as XRegExp from "xregexp"

import {Database} from './dbModel'
import {log} from './utils/log'
import * as pathUtils from './utils/path'

export class ArtistImageDatabase  implements Database{
	constructor(protected path:string) { }

	protected artistToFolderName(artist:Model.Artist):string {
		return pathUtils.avoidTrailingDot(`[${artist.id}] - ${artist.name}`);
	}
	protected folderNameToArtist(folderName:string):Model.Artist {
		let match = XRegExp('^\\[([0-9]+)\\]\\ -\\ (.*)$').exec(folderName);
		if(match && match.length === 3) {
			return {
				id: parseInt(match[1]),
				name: match[2]
			};
		} else {
			log(`filename ${folderName} failed to match regex`);
		}
		return undefined;
	}

	protected fileNameToImage(fileName:string):Model.Image {
		var match = fileName.match(/^([0-9]+)(?:_p([0-9]+))?(?:_master[0-9]+)?\.(.*)/);
		if(match && match.length === 4) {
			return {
				id: parseInt(match[1]),
				page: parseInt(match[2]),
				ext: match[3]
			}
		} else {
			log(`filename ${fileName} failed to match regex`);
		}
		return undefined;
	}
	protected imageToFileName(image:Model.Image):string {
		return pathUtils.avoidTrailingDot(`${image.id}_p${image.page || 0}.${image.ext || '.jpg'}`);
	}
	
	public get Artists():Model.Artist[] {
		return fs.readdirSync(this.path).map(name => this.folderNameToArtist(name));
	}

	public getArtistById(artistId:number):Model.Artist {
		return _.find(this.Artists, artist => artist.id === artistId);
	}

	public getImagesForArtist(artist:Model.Artist):Model.Image[] {
		return fs.readdirSync(this.getPathForArtist(artist))
				.map(name => this.fileNameToImage(name))
				.filter(image => image != undefined);
	}

	public getPathForArtist(artist:Model.Artist):string {
		return path.join(this.path, this.artistToFolderName(artist));
	}
	
	public getPathForImage(artist:Model.Artist, image:Model.Image):string {
		return path.join(this.path, this.artistToFolderName(artist), this.imageToFileName(image));
	}
}

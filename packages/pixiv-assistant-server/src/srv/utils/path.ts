// import * as log4js from 'log4js'
import * as path from 'path'

import {Model} from 'pixiv-assistant-common'

// let logger = log4js.getLogger('Utils | Path');
export function avoidTrailingDot(path:string): string {
	return (path[path.length - 1] === '.') ? path.substr(0, path.length - 1) : path
}

/**
 * Based on a file path, extract the image Id.
 */
export function getImageIdFromFilePath(filePath:string) : number | undefined {
	return getImageIdFromFileName(path.basename(filePath));
}
export function getImageIdFromFileName(fileName: string): number | undefined {
	let match = fileName.match(/^([0-9]+)(?:_big)?(?:_p([0-9]+))?(?:_master[0-9]+)?\.(.*)/);
	let aniMatch = fileName.match(/^([0-9]+)\.webm$/);
	let mangaMatch = fileName.match(/^([0-9]+)\.zip$/);
	if (match && match.length === 4) {
		return parseInt(match[1])
	}
	if (aniMatch && aniMatch.length === 2) {
		return parseInt(aniMatch[1])
	}
	if (mangaMatch && mangaMatch.length === 2) {
		return parseInt(mangaMatch[1])
	}
	return undefined;
}

export function fileNameToImage(fileName: string): Model.Image | undefined {
	let match = fileName.match(/^([0-9]+)(?:_big)?(?:_p([0-9]+))?(?:_master[0-9]+)?\.(.*)/);
	let aniMatch = fileName.match(/^([0-9]+)\.webm$/);
	let mangaMatch = fileName.match(/^([0-9]+)\.zip$/);
	if (match && match.length === 4) {
		return {
			id: parseInt(match[1]),
			page: parseInt(match[2]),
			ext: match[3],
			animation: false
		}
	}
	if (aniMatch && aniMatch.length === 2) {
		return {
			id: parseInt(aniMatch[1]),
			animation: true,
		}
	}

	if (mangaMatch && mangaMatch.length === 2) {
		return {
			id: parseInt(mangaMatch[1])
		}
	}
	// logger.error(`filename ${fileName} failed to match regex`);
	return undefined;
}

//TODO: Modify image type hierarchy to reflect the swithced nature of animation vs. page/ext
export function imageToFileName(image: Model.Image) {
	if (image.animation) {
		return `${image.id}.webm`;
	}
	return avoidTrailingDot(`${image.id}_p${image.page || 0}.${image.ext || 'jpg'}`);
}
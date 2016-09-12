import * as log4js from 'log4js'

import {Model} from '../../common/proto'

let logger = log4js.getLogger('Utils | Path');
export function avoidTrailingDot(path:string): string {
	return (path[path.length - 1] === '.') ? path.substr(0, path.length - 1) : path
}

export function fileNameToImage(fileName: string): Model.Image {
	var match = fileName.match(/^([0-9]+)(?:_big)?(?:_p([0-9]+))?(?:_master[0-9]+)?\.(.*)/);
	var zipMatch = fileName.match(/^([0-9]+)_ugoira1920x1080\.zip/);
	if (match && match.length === 4) {
		return {
			id: parseInt(match[1]),
			page: parseInt(match[2]),
			ext: match[3],
			animation: false
		}
	}
	if (zipMatch && zipMatch.length === 2) {
		return {
			id: parseInt(zipMatch[1]),
			animation: true
		}
	}
	logger.error(`filename ${fileName} failed to match regex`);
	return undefined;
}
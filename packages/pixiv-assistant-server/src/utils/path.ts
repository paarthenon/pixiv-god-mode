import {Model} from '../../common/proto'
import * as log4js from 'log4js'

let logger = log4js.getLogger('Utils | Path');
export function avoidTrailingDot(path:string): string {
	return (path[path.length - 1] === '.') ? path.substr(0, path.length - 1) : path
}

export function fileNameToImage(fileName: string): Model.Image {
	var match = fileName.match(/^([0-9]+)(?:_p([0-9]+))?(?:_master[0-9]+)?\.(.*)/);
	if (match && match.length === 4) {
		return {
			id: parseInt(match[1]),
			page: parseInt(match[2]),
			ext: match[3]
		}
	} else {
		logger.error(`filename ${fileName} failed to match regex`);
	}
	return undefined;
}
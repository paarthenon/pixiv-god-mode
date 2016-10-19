import {Model} from 'src/../common/proto'
import * as pathUtils from 'src/utils/path'
import {Rectangle} from 'src/utils/geometry'

export function artistFromJQImage(image:JQuery):Model.Artist {
	return {
		id: parseInt(image.find('a.user').attr('data-user_id')),
		name: image.find('a.user').attr('data-user_name')
	}
}
export function imageFromJQImage(image:JQuery):Model.Image {
	return {
		id: pathUtils.getImageId(image.find('a.work').attr('href'))
	}
}

export function artistUrlFromJQImage(image:JQuery):string {
	return (<any>image.find('a.user')[0]).href;
}

export function hackedNewTab(jQ:JQueryStatic, url:string) {
	jQ(`<a target="_blank" href="${url}"></a>`)[0].click();
}

export function toCanvasInstance(dataUrl:string, dims:Rectangle) {
	return new Promise((resolve, reject) => {
		let invisiCanvas = document.createElement('canvas') as HTMLCanvasElement;
		invisiCanvas.width = dims.width;
		invisiCanvas.height = dims.height;
		let context = invisiCanvas.getContext('2d');

		let img = new Image();
		img.addEventListener('load', () => {
			context.drawImage(img, 0, 0, invisiCanvas.width, invisiCanvas.height);
			resolve(invisiCanvas);
		})
		img.addEventListener('error', err => {
			reject(err);
		})
		img.src = dataUrl;
	});
}

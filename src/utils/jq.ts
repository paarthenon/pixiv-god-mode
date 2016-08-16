import {Model} from '../../common/proto'
import * as pathUtils from './path'

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
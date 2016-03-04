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
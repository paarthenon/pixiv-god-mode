function extract(str: string, re: RegExp):string {
	let out = str.match(re);
	return (out && out.length > 1)? out[1]:null
}
export function getImageId(path: string):number {
	return parseInt(extract(path, /illust_id=([0-9]*)/));
}
export function getArtistId(path: string):number {
	return parseInt(extract(path, /^.*id=([0-9]*)/));
}
export function getMaxSizeImageUrl(url: string):string {
	return url
		.replace(/c\/(:600x600|1200x1200)\/img-master/, 'img-original')
		.replace('_master1200', '');
}

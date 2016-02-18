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
export function getResultFromBadge(badgeText:string):number{
	return parseInt(extract(badgeText, /^([0-9]+)/));
}

export function experimentalMaxSizeImageUrl(url: string):string {
	return url
		.replace(/c\/(?:[0-9]+)x(?:[0-9]+)\/img-master/, 'img-original')
		.replace('_master1200', '')
		.replace('_square1200', '')
}

export function explodeImagePathPages(url:string, pages:number):string[]{
	let urls:string[] = [];
	for (let i = 0; i < pages; i++) {
		let pageSpecificString = url.replace(/_p[0-9]+\.([a-zA-Z]+)$/, (match, extension) => `_p${i}.${extension}`);
		urls.push(pageSpecificString);
	}
	return urls;
}
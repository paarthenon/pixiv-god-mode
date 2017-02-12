/**
 * Pull raw assets
 */
export function getBlob(src:string) {
	let req = new XMLHttpRequest();
	req.open('GET', src);
	req.responseType = 'blob';
	req.send();
	return new Promise((resolve, reject) => {
		req.addEventListener('load', () => resolve(req.response));
		req.addEventListener('error', err => reject(err));
	})
}
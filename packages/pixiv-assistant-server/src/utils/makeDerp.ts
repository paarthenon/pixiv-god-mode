import * as mkdirp from 'mkdirp'

export function makederp(path:string) {
	return new Promise((resolve, reject) => {
		mkdirp(path, err => {
			if (err) {
				reject(err);
			} else {
				resolve(path);
			}
		})
	});
}

export default makederp;
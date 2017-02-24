import * as mkdirp from 'mkdirp'

export function makederp(path:string) {
	return new Promise<string>((resolve, reject) => {
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
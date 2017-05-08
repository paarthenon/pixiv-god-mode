import * as fs from 'fs'

export function load<T>(path:string) : Promise<T> {
	return new Promise<T>((resolve, reject) => {
		fs.readFile(path, 'utf-8', (err, data) => {
			if (err) {
				reject(err);
			} else {
				resolve(JSON.parse(data));
			}
		})
	});
}

export function save<T>(path:string, db:T) : Promise<void> {
	return new Promise<void>((resolve, reject) => {
		fs.writeFile(path, JSON.stringify(db), 'utf-8', (err) => {
			if (err) {
				reject(err);
			} else {
				resolve();
			}
		})
	});
}

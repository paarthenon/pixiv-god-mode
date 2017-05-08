export function execSequentially<T>(items:T[], action:(x:T) => any) {
	return items.reduce((acc, cur) => acc.then(() => action(cur)), Promise.resolve());
}

export function promisePool<T>(arr:(() => Promise<T>)[], limit:number):Promise<T[]> {
	let boxedLimit = Math.min(limit, arr.length);
	let next = boxedLimit;
	let crashCount = 0;

	let result = Array<T>(arr.length);
	return new Promise<T[]>(resolve => {
		function passBaton(id:number) {
			if (id >= arr.length) {
				if (++crashCount === boxedLimit) {
					resolve(result);
				}
			} else {
				arr[id]()
					.then(x => result[id] = x)
					.then(() => passBaton(next++))
			}
		}

		[...Array(boxedLimit).keys()].forEach(passBaton);
	})
}

export function tap<T>(func :(x:T) => any) {
	return (x:T) => {
		func(x);
		return x;
	}
}

export function execSequentially<T>(arr:T[], func:(x:T)=>any) {
	return arr.reduce((acc, cur) => acc.then(() => func(cur)), Promise.resolve());
}

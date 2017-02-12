export function execSequentially<T>(arr:T[], func:(x:T)=>any) {
	return arr.reduce((acc, cur) => acc.then(() => func(cur)), Promise.resolve());
}

export function tap(func:Function){
	return (x:any) => {
		func();
		return x;
	}
}

export function getMasterCommit(githubPath:string, callback:(hash:string) => any) {
	GM_xmlhttpRequest({
		method: 'GET',
		url: `http://api.github.com/repos/${githubPath}/git/refs/heads/master`,
		onload: (response) => {
			let responseObj: any = JSON.parse(response.responseText);
			callback(responseObj.object.sha);
		}
	});
}

export function getDictionaryObject(githubPath:string, commitSHA:string, callback:(dict:Object) => any) {
	GM_xmlhttpRequest({
		method: 'GET',
		url: `https://cdn.rawgit.com/${githubPath}/${commitSHA}/en-US.json`,
		onload: (response) => {
			callback(JSON.parse(response.responseText));
		}
	});
}
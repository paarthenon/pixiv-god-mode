// let repoCommitPath = 'http://api.github.com/repos/pixiv-assistant/dictionary/git/refs/heads/master'

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

//https://cdn.rawgit.com/pixiv-assistant/dictionary/f9ac206a5a1adb584a142e55d5d7e04af0e3d472/en-US.json
export function getDictionaryObject(githubPath:string, commitSHA:string, callback:(hash:string) => any) {
	GM_xmlhttpRequest({
		method: 'GET',
		url: `https://cdn.rawgit.com/${githubPath}/${commitSHA}/en-US.json`,
		onload: (response) => {
			callback(JSON.parse(response.responseText));
		}
	});
}
import * as Deps from '../deps'

export function getMasterCommit(githubPath:string) : Promise<string> {
	return Deps.Container.ajaxCall({
		type: 'GET',
		url: `http://api.github.com/repos/${githubPath}/git/refs/heads/master`
	}).then((response: any) => JSON.parse(response))
	  .then((response: any) => response.object.sha);
}

export function getDictionaryObject(githubPath:string, commitSHA:string) : Promise<Object> {
	return Deps.Container.ajaxCall({
		type: 'GET',
		url: `https://cdn.rawgit.com/${githubPath}/${commitSHA}/en-US.json`
	}).then((response: any) => JSON.parse(response));
}
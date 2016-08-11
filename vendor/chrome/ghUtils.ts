import Mailman from './mailman'

export function getMasterCommit(githubPath:string) : Promise<string> {
	return Mailman.Background.ajax({
		type: 'GET',
		url: `http://api.github.com/repos/${githubPath}/git/refs/heads/master`
	}).then((response: any) => JSON.parse(response))
	  .then((response: any) => response.object.sha);
}

export function getDictionaryObject(githubPath:string, commitSHA:string) : Promise<Object> {
	return Mailman.Background.ajax({
		type: 'GET',
		url: `https://cdn.rawgit.com/${githubPath}/${commitSHA}/dictionary.json`
	}).then((response: any) => JSON.parse(response));
}

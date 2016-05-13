export default class Mailman {
	static send<T,V>(msg:T): Promise<V> {
		return new Promise(resolve => {
			chrome.runtime.sendMessage(msg, (response:V) => resolve(response));
		})
	} 
}
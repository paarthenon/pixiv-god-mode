import {PALogEvent} from '../utils/electronAppender'
import {ipcRenderer} from 'electron'

let runningLog : PALogEvent[] = [];

let subscribers : Array<(log:PALogEvent[]) => any> = [];

export function initialize() {
	ipcRenderer.on('logMessage', (event, returnValue) => {
		runningLog.push(returnValue);
		subscribers.forEach(sub => sub(runningLog));
	});
}

export function register(func:(log:PALogEvent[]) => any) {
	subscribers.push(func);
}
export function collect() : PALogEvent[] {
	return runningLog;
}


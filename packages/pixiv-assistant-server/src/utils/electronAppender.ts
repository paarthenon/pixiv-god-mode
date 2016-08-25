let sendFunc :Function = undefined;

export interface PALogEvent {
	time :Date
	category :string
	data :any[]
	level: string
}

export function initialize(func:Function) {
	sendFunc = func;
}

function sanitizeLogEvent(loggingEvent:any) :PALogEvent {
	return {
		time: loggingEvent.startTime,
		category: loggingEvent.categoryName,
		data: loggingEvent.data,
		level: loggingEvent.level.levelStr,
	}
}
export function appender() {
	return function(loggingEvent:any) {
		if (sendFunc != undefined) {
			sendFunc('logMessage', sanitizeLogEvent(loggingEvent));
		}
	}
}

export function configure(config:any) {
  return appender();
}

export function shutdown(){}
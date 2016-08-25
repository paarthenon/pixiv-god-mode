interface PALogEvent {
	time :Date
	category :string
	data :any[]
	level: string
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
		console.log(sanitizeLogEvent(loggingEvent));
	}
}

export function configure(config:any) {
  return appender();
}

export function shutdown(){}
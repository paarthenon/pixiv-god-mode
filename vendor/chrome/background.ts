chrome.runtime.onMessage.addListener(msg => {
	if (msg.type === 'openTab') {
		chrome.tabs.create({
			url: msg.url,
			active: false
		});
	}
})
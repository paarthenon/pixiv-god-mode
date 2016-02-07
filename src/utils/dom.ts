declare var $: JQueryStatic;

export function createButton(id:string,text:string,callback:(...args:any[])=>any) {
	return $(`<button id="${id}" class="pa-button">${text}</button>`)
		.css({
			width: '100%'
		})
		.on('click', callback);
}

export function createSidebar() {
	return $('<div id="pixiv-assistant-sidebar">Sidebar</div>')
		.css({
			position: 'fixed',
			top: '50%',
			transform: 'translateY(-50 %)',
			height: '200px',
			width: '100px',
			'background-color': 'white'
		})
}
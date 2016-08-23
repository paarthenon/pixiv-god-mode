import {app, BrowserWindow} from 'electron'

function generateWindow () {
	let win = new BrowserWindow({width: 800, height: 600});
	win.loadURL(`file://${__dirname}/www/index.html`);
	return win;
}

let win:Electron.BrowserWindow

app.on('ready', () => win = generateWindow());

app.on('window-all-closed', () => {
	// On macOS it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	if (process.platform !== 'darwin') {
		app.quit()
	}
})

app.on('activate', () => {
	// On macOS it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (win === null) {
		win = generateWindow();
	}
})
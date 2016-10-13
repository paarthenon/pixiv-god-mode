import {IServerConfigProtocol} from './proto'

import {app, dialog, BrowserWindow} from 'electron'
import * as http from 'http'
import * as log4js from 'log4js'

import {defineService} from './defineService'
import {PixivAssistantServer} from './server'
import * as electronAppender from './utils/electronAppender'

(<any>log4js).loadAppender(
    'electron', electronAppender
);

log4js.configure({
	appenders: [
		{ type: 'console' }
	]
});
log4js.addAppender(log4js.appenders['electron']({}));

let server :PixivAssistantServer | null = null;

let defaultConfig = {
	path: 'pixivRepository',
	port: 50415,
	verboseLogging: false
}

defineService<IServerConfigProtocol>("ServerConfiguration", {
	initialize: config => {
		let mergedConfig = Object.assign(defaultConfig, config);
		server = new PixivAssistantServer(config);
		return server.start();
	},
	close: () => {
		let localInstance = server;
		server = null;
		return localInstance.close();
	},
	openFolderDialog: () => {
		return new Promise((resolve, reject) => {
			dialog.showOpenDialog({properties: ['openDirectory']}, (fileNames) => resolve(fileNames[0]));
		});
	}

});

function generateWindow () {
	let win = new BrowserWindow({
		width: 800, height: 600, 
		icon: __dirname + '/../res/pa-icon-32.png',
		title: 'Pixiv Assistant Server'
	});
	win.loadURL(`file://${__dirname}/www/index.html`);

	electronAppender.initialize(win.webContents.send.bind(win.webContents));
	return win;
}
let win:Electron.BrowserWindow

app.on('ready', () => win = generateWindow());

app.on('window-all-closed', () => {
	// On macOS it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	if (process.platform !== 'darwin') {
		if (server) {
			server.close().then(() => app.quit());
		} else {
			app.quit();
		}
	}
})

app.on('activate', () => {
	// On macOS it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (win === null) {
		win = generateWindow();
	}
})
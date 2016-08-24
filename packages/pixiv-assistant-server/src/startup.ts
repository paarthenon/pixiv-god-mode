import {app, dialog, BrowserWindow} from 'electron'

import {defineService} from './defineService'
import {IServerConfigProtocol} from './proto'
import * as http from 'http'

import * as server from './server'

let serverInstance :http.Server = undefined;

//TODO: Make these actually asynchronous by listening for the open and close events and resolving then.
defineService<IServerConfigProtocol>("ServerConfiguration", {
	initialize: config => 
		{
			serverInstance = server.initServer(config);
			return Promise.resolve();
		},
	close: () => {
		serverInstance.close();
		return Promise.resolve()
	},
	openFolderDialog: () => {
		return new Promise((resolve, reject) => {
			dialog.showOpenDialog({properties: ['openDirectory']}, (fileNames) => resolve(fileNames[0]));
		});
	}

});

function generateWindow () {
	let win = new BrowserWindow({width: 800, height: 600, icon: __dirname + '/../res/pa-icon-32.png'});
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
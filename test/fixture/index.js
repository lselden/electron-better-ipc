'use strict';
const electron = require('electron');
const ipc = require('../..');

ipc.answerRenderer('test', async data => {
	console.log('test:main:data-from-renderer:', data);
	return 'test:main:answer';
});

ipc.answerRenderer('test-error', async () => {
	throw new Error('unicorn');
});

function load(url) {
	const win = new electron.BrowserWindow();
	win.loadURL(url);
	return win;
}

electron.app.on('ready', () => {
	const win = load(`file://${__dirname}/index.html`);

	win.webContents.on('did-finish-load', async () => {
		const answer = await ipc.callRenderer(win, 'test', 'optional-data');
		console.log('test:main:answer-from-renderer:', answer);

		try {
			await ipc.callRenderer(win, 'test-error');
		} catch (error) {
			console.log('test:main:error-from-renderer:', error.name, error.message);
		}
	});
});

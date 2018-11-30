'use strict';
const ipc = require('../..');

ipc.answerMain('test', data => {
	console.log('test:renderer:data-from-main:', data);
	return 'test:renderer:answer-data';
});

ipc.answerMain('test-error', () => {
	throw new Error('unicorn');
});

(async () => {
	const answer = await ipc.callMain('test', 'optional-data');
	console.log('test:renderer:answer-from-main:', answer);

	try {
		await ipc.callMain('test-error');
	} catch (error) {
		console.log(`test:renderer:error-from-main: ${error.name} ${error.message}`);
	}
})();

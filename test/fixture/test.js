import electron from 'electron';
import {serial as test} from 'ava';
import {Application} from 'spectron';

test.beforeEach(async t => {
	t.context.app = new Application({
		path: electron,
		args: ['.']
	});
});

test.afterEach.always(async t => {
	await t.context.app.stop();
});

test('main', async t => {
	const {app} = t.context;
	await app.start();
	await app.client.waitUntilWindowLoaded();

	const [mainLogs, rendererLogs] = await Promise.all([
		app.client.getMainProcessLogs(),
		app.client.getRenderProcessLogs()
	]);

	const logs = [
		// TODO: had to filter this to remove blank line at beginning
		...mainLogs.filter(l => l),
		// TODO: We have to clean the message because of:
		// https://github.com/electron/spectron/issues/283
		...rendererLogs.map(x => x.message.replace(/[^"]+/, ''))
	];
	logs.sort();

	t.deepEqual(logs, [
		// TODO: The value is missing as Spectron only captures the first argument to `console.log`:
		// https://github.com/electron/spectron/issues/282
		'"test:renderer:answer-from-main:"',
		'"test:renderer:data-from-main:"',
		'"test:renderer:error-from-main: Error unicorn"',
		'test:main:answer-from-renderer: test:renderer:answer-data',
		'test:main:data-from-renderer: optional-data',
		'test:main:error-from-renderer: Error unicorn'
	]);
});

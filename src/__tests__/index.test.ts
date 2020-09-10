import { runAndCatch } from '@carnesen/run-and-catch';
import { runBackgroundCommand, ICommandOptions } from '../index';

const DUMMY_PROGRAM_PATH = require.resolve('../dummy-program');

function runDummyProgram(args?: string[], options?: ICommandOptions) {
	return runBackgroundCommand(
		process.execPath,
		[DUMMY_PROGRAM_PATH, ...(args || [])],
		options,
	);
}

describe(runBackgroundCommand.name, () => {
	it('Runs a command asynchronously returning its stdout', async () => {
		const result = await runDummyProgram();
		expect(result).toBe('foo');
	});

	it('Trims a trailing newline from the output if there is one', async () => {
		const result = await runDummyProgram(['end-in-newline']);
		expect(result).toBe('foo');
	});

	it('Raises an error if the child exits with a non-zero status code', async () => {
		const exception = await runAndCatch(runDummyProgram, ['throw']);
		expect(exception.message).toMatch(process.execPath);
		expect(exception.message).toMatch('dummy-program');
		expect(exception.code).toBe(4);
		expect(exception.data).toBe('foobar');
	});

	it('Raises an error if the child object emits one', async () => {
		const exception = await runAndCatch(runBackgroundCommand, 'foo bar baz');
		expect(exception.message).toMatch('ENOENT');
	});
});

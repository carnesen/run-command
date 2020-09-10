import { spawn } from 'child_process';

import { CodedError } from '@carnesen/coded-error';

export interface ICommandOptions {
	cwd?: string;
}

export async function runBackgroundCommand(
	command: string,
	args?: string[],
	options: ICommandOptions = {},
): Promise<string> {
	return new Promise<string>((resolve, reject) => {
		const child = spawn(command, args || [], { cwd: options.cwd });

		const stdoutChunks: Buffer[] = [];
		const allChunks: Buffer[] = []; // stderr and stdout

		child.stdout.on('data', (chunk) => {
			stdoutChunks.push(chunk);
			allChunks.push(chunk);
		});

		child.stderr.on('data', (chunk) => {
			allChunks.push(chunk);
		});

		child.on('error', (err) => {
			reject(err);
		});

		child.on('close', (code) => {
			if (code === 0) {
				const stdout = Buffer.concat(stdoutChunks).toString('utf8');
				if (stdout.endsWith('\n')) {
					resolve(stdout.slice(0, -1));
				} else {
					resolve(stdout);
				}
			} else {
				const commandString = `${command}${args ? ` ${args.join(' ')}` : ''}`;
				const message = `Command "${commandString}" exited with status code ${code}`;
				const data = Buffer.concat(allChunks).toString('utf8');
				reject(new CodedError(message, code, data));
			}
		});
	});
}

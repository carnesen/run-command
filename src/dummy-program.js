const arg = process.argv[2];

process.stdout.write('foo');
process.stderr.write('bar');

switch (arg) {
	case 'throw': {
		process.exit(4);
		break;
	}
	case 'end-in-newline': {
		process.stdout.write('\n');
		process.exit(0);
		break;
	}
	default: {
		process.exit(0);
	}
}

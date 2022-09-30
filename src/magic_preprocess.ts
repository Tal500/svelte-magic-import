import MagicString from 'magic-string';

export const magic_preprocess = () => ({
	markup: ({ content, filename }: { content: string; filename: string }) => {
		console.log('this runs first');
		//console.log('content: ' + content);
		console.log('filename: ' + filename);
		const result = content.match(/<script.*?<\/script>/gs); // Or match all?
		//console.log("Result: " + JSON.stringify(result));

		const s: MagicString = new MagicString(content, { filename }); // TODO: Use it

		if (result) {
			//console.log("Found0: " + result[0])
			const importStatement = result[0].match(/import { shared } from '\$lib';/gs);
			if (importStatement) {
				// TODO: Use magic string
				console.log('Found');
				s.replace(importStatement[0], '');

				// TODO: Strip spaces inside the parameter, and verify that the word inside is a legal one.
				s.replaceAll(/::shared\(some\)/gs, (/*match, offset*/) => ':global(.svelte-magic-blabla)'); // TODO: Only on style
				s.replaceAll(/(?<!:):shared\(some\)/gs, (/*match, offset*/) => '.svelte-magic-blabla'); // TODO: Only on style
				s.replaceAll(/(?<!:)shared\('some'\)/gs, (/*match, offset*/) => '"svelte-magic-blabla"'); // TODO: Only outside style

				console.log('Modified content: ' + s.toString());
			} else {
				console.log('Not Found');
			}
		}

		return {
			code: s.toString(),
			map: s.generateMap()
		};
	}
});

import MagicString from 'magic-string';

const magicPreprocess = () => ({
	markup: ({ content, filename }: { content: string; filename: string }) => {
		console.log('this runs first');
		//console.log('content: ' + content);
		console.log('filename: ' + filename);
		const result = content.match(/<script.*?<\/script>/gs); // Or match all?
		//console.log("Result: " + JSON.stringify(result));

		const s: MagicString = new MagicString(content, { filename }); // TODO: Use it

		if (result) {
			//console.log("Found0: " + result[0])
			const importStatement = result[0].match(/import { shared } from 'svelte-magic-preprocess';/gs);
			if (importStatement) {
				// TODO: Use magic string
				console.log('Found');
				s.replace(importStatement[0], '');

				const findHashedIdentifier = (identifier: string) => {
					// TODO: store a map, and return undefined if the value is missing.
					return 'svelte-magic-' + identifier;
				}
				const calcHashedIdentifier = (identifier: string) => {
					return 'svelte-magic-' + identifier;
				}

				// TODO: Work on better hash algorithm, and use it (maybe like `svelte-preprocess-cssmodules` approach?)

				// TODO: Strip spaces inside the parameter, and verify that the word inside is a legal one.
				s.replaceAll(/::shared\((?<identifier>.*?)\)/gs, (_match, _identifierPosition: number, _offset, _strings, groups: { identifier: string }) => {
					const identifier = groups.identifier.trim();
					const result = `:global(.${calcHashedIdentifier(identifier)})`;
					return result;
				}); // TODO: Only on style
				s.replaceAll(/(?<!:):shared\((?<identifier>.*?)\)/gs, (_match, _identifierPosition: number, _offset, _strings, groups: { identifier: string }) => {
					const identifier = groups.identifier.trim();
					const result = `.${calcHashedIdentifier(identifier)}`;
					return result;
				}); // TODO: Only on style
				s.replaceAll(/(?<!:)shared\((?<identifierArea>.*?)\)/gs, (match, _identifierPosition: number, _offset, _strings, groups: { identifierArea: string }) => {
					const identifierArea = groups.identifierArea.trim();
					const identifierMatch = identifierArea.match(/^('(.*)')|("(.*)")|(`(.*)`)$/);
					const identifier = identifierMatch ? identifierMatch[2] : undefined;
					if (identifier === undefined) {
						// TODO: Format error log better, with line number and location, and filename.
						console.error(`The expression {${identifierArea}} isn't valid. Any value inside the function expression \`shared(*)\` must be string literal`);
						return match;// Return the original string, nothing to modify
					}
					// otherwise

					const result = `"${findHashedIdentifier(identifier)}"`;
					return result;
				}); // TODO: Only outside style

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

export default magicPreprocess;
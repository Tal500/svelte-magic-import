import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig({
	// If entries is not provided, will be automatically inferred from package.json
	entries: [
		// default
		'./src/index',
		'./src/preprocess'
		// // mkdist builder transpiles file-to-file keeping original sources structure
		// {
		//     builder: 'mkdist',
		//     input: './src/package/components/',
		//     outDir: './build/components'
		// },
	],

	// Change outDir, default is 'dist'
	//outDir: 'build',

	// Generates .d.ts declaration file
	declaration: true
});

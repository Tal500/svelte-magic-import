import adapter from '@sveltejs/adapter-auto';
import preprocess from 'svelte-preprocess';

//const { magic_preprocess } = require('./src/lib/magic_preprocess-copy.ts');
//import { magic_preprocess } from './src/lib/magic_preprocess.js';
import { magic_preprocess } from '../dist/magic_preprocess.mjs';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: [magic_preprocess(), preprocess()],

	kit: {
		adapter: adapter()
	}
};

export default config;

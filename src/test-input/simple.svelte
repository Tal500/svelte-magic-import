<script lang="ts">
	import { shared } from 'svelte-magic-preprocess';
</script>

<h1 class={shared('some')}>Welcome to your library project</h1>
<p>Create your package using @sveltejs/package and preview/showcase your work with SvelteKit</p>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

<style>
	::shared(some) {
		color: red;
	}
</style>

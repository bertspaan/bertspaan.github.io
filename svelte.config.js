import adapter from '@sveltejs/adapter-static'

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    target: '#svelte',
    adapter: adapter({
      // default options are shown
      pages: 'docs',
      assets: 'docs',
      fallback: null
    })
  }
}

export default config

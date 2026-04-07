<script lang="ts">
  import './layout.css'
  import favicon from '$lib/assets/favicon.png'

  let { children } = $props()
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
  <title>bertspaan.nl</title>
  <meta property="og:image" content="https://bertspaan.nl/bertspaan.jpg" />
</svelte:head>

{@render children()}

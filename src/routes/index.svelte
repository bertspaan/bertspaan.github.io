<script>
	import BertSpaan from '../lib/BertSpaan.svelte'
</script>

<svelte:head>
  <style>
		* {
			box-sizing: border-box;
		}

		body {
			color: #111;
			font-family: 'Roboto', sans-serif;
			margin: 0;
			padding: 1em;
			position: absolute;
			width: 100%;
			height: 100%;
		}

		#svelte {
			position: relative;
			width: 100%;
			height: 100%;

			display: flex;
			align-items: center;
			justify-content: center;
		}
	</style>
</svelte:head>

<main>
	<div class="logo">
		<BertSpaan />
	</div>

	<p>
		Hi, I'm Bert Spaan. I design and build creative technology for data and exploration.
	</p>

	<p>
	I’m currently building <a href="https://allmaps.org">Allmaps</a>,
	open source tools for georeferencing, warping and exploring IIIF maps.
	</p>

	<p>
		If you’d like to get in touch,
		you can send me an <a href="mailto:hello@bertspaan.nl">email</a> or a message on <a href="https://twitter.com/bertspaan">Twitter</a>.
	</p>
</main>

<style scoped>
main {
	width: 320px;
	max-width: 100%;
	margin-top: -132px;
}

.logo {
	padding: 1em;
	display: flex;
	justify-content: center;
}

p {
	text-align: center;
}

a, a:visited {
	color: #111;
}
</style>
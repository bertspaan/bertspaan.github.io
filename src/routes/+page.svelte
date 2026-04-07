<script>
  import BertSpaan from '../lib/components/BertSpaan.svelte'
</script>

<main
  class="w-sm m-auto max-w-full h-dvh
  grid grid-rows-[1fr_auto_1fr]
  items-center justify-center gap-4 p-4"
>
  <div class="self-end justify-self-center">
    <BertSpaan />
  </div>

  <section class="flex flex-col gap-4 text-center">
    <p>
      Hi, I'm Bert Spaan. I design and build creative technology for data and
      exploration.
    </p>

    <p>
      I'm currently working on <a class="underline" href="https://allmaps.org"
        >Allmaps</a
      >, an open source platform for curating, georeferencing and exploring IIIF
      maps.
    </p>

    <p>
      If you'd like to get in touch, you can send me an <a
        class="underline"
        href="mailto:hello@bertspaan.nl">email</a
      >
      or a message on
      <a class="underline" href="https://bsky.app/profile/bertspaan.nl"
        >Bluesky</a
      >.
    </p>
  </section>
  <div></div>
</main>

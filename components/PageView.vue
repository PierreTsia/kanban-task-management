<script setup lang="ts">
const { data } = await useFetch('/api/pageview')

const time = useTimeAgo(computed(() => data.value.startAt))
</script>

<template>
  <div class="flex flex-col max-w-1000px mx-auto gap-4">
    <h1 class="heading heading-xl">Extra Large</h1>
    <h2 class="heading heading-lg">Large</h2>
    <h3 class="heading heading-md">Medium</h3>
    <h4 class="heading heading-sm">Small</h4>
    <span class="paragraph paragraph-lg">
      Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Phasellus
      hendrerit. Pellentesque aliquet nibh nec urna. In nisi neque, aliquet vel,
      dapibus id, mattis vel, nisi. Sed pretium, ligula sollicitudin laoreet
      viverra, tortor libero sodales leo, eget blandit nunc tortor eu nibh.
      Nullam mollis. Ut justo. Suspendisse potenti. Sed egestas, ante et
      vulputate volutpat, eros pede semper est, vitae luctus metus libero eu
      augue. Morbi purus libero, faucibus adipiscing, commodo quis, gravida id,
      est.</span
    ><br />
    <span class="paragraph paragraph-sm">
      Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Phasellus
      hendrerit. Pellentesque aliquet nibh nec urna. In nisi neque, aliquet vel,
      dapibus id, mattis vel, nisi. Sed pretium, ligula sollicitudin laoreet
      viverra, tortor libero sodales leo, eget blandit nunc tortor eu nibh.
      Nullam mollis. Ut justo. Suspendisse potenti. Sed egestas, ante et
      vulputate volutpat, eros pede semper est, vitae luctus metus libero eu
      augue. Morbi purus libero, faucibus adipiscing, commodo quis, gravida id,
      est.</span
    >
    <section class="flex flex-wrap gap-4 py-2 items-center">
      <button class="btn btn-primary btn-lg">Primary</button>
      <button class="btn btn-primary btn-sm">Primary Sm</button>
      <button class="btn btn-secondary btn-sm">Secondary</button>
      <button class="btn btn-destructive btn-sm">Destructive</button>
    </section>
  </div>
</template>

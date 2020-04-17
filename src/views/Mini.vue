<template>
  <div class="mini">
    <h1>This is an small page</h1>
    <p>lalala</p>
  </div>
</template>
<script>
export default {
  name: 'mini',
  created () {
    console.log(window.location.href)
  }
}
</script>

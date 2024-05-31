<template>
  <web-view :src="url"></web-view>
</template>
<script>
export default {
  data() {
    return {
        url:''
    }
  },
  onLoad(options) {
      let url = options.url
      this.url = decodeURIComponent(url)
  },
}
</script>
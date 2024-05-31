<template>
    <!-- 辅助空白 -->
  <view class="blank" :style="{'height': `${listData.blankHeight*2}rpx`}"></view>
</template>
<script>
export default {
  props: {
    listData: {
        type: Object,
        default:() => {
          return {blankHeight: 10}
        },
        required: true
    }
  },
}
</script>
<style scoped>
.blank {
    width: 100%;
}
</style>
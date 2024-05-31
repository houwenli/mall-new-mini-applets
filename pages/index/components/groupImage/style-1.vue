<template>
  <view class="columns-container" data-desc='单列图'>
    <view class="item" v-for="(item, index) in config.list" :key="index" @click="toPage(item)" :style="[getStyle]">
      <image v-if="item.url" class="pic" :src="item.url" />
      <image class="pic" v-else src="https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/40bee560607cba072f39a1d890510b1e.png" />
    </view>
  </view>
</template>

<script>
import { toPage } from './data.js'
// 魔方图片
export default {
  name: 'style-1',
  props: {
    config: {
      type: Object,
      default: () => {
        return {
          list: [],
        }
      },
    },
  },
  data () {
    return {}
  },
  computed: {
    getStyle () {
      if (String(this.config.hasBackground) === '0' && String(this.config.showComTitle) === '0') {
        return {
          width: '702rpx',
        }
      }
      return {}
    },
  },
  methods: {
    toPage
  }
}
</script>

<style lang="less" scoped>
.columns-container {
  .item {
    // width: 327px;
    width: 100%;
    height: 100px;
    border-radius: 12px;
    overflow: hidden;

    .pic {
      width: 100%;
      height: 100%;
      border: none;
    }
  }
}
</style>
<template>
  <view class="columns-container" data-desc='热区图1'>
    <view class="item" v-for="(item, index) in config.list" :key="index" @click="toPage(item)" :style="[getStyle]">
      <image v-if="item.url" class="pic" :src="item.url" />     
      <view class="pic flex-style bg-gray" v-else>      
        <image class="pic-que"  src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/ws-smart-life/component-no-pic-default.png" />
      </view>
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
      if (String(this.config.hasBackground) === '0') {
        return {
          width: '718rpx',
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
    width: 100%;
    height: 240rpx;
    overflow: hidden;
    .pic {
      width: 100%;
      height: 100%;
      border: none;     
      .pic-que{
        width: 124rpx;
        height: 64rpx;
      }
    }   
  }
}
</style>
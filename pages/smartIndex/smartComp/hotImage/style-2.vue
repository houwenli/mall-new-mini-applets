<template>
  <view class="columns-container" data-desc='热区图2'>
    <view class="item" v-for="(item, index) in config.list" :key="index" @click="toPage(item)" >
      <image v-if="item.url" class="pic" :src="item.url" alt="" />
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
  name: 'style-2',
  props: {
    config: {
      type: Object,
      default: () => {
        return {
          list: []
        }
      },
    },
  },
  data () {
    return {}
  },
  methods: {
    toPage
  }
}
</script>

<style lang="less" scoped>
.columns-container {
  display: flex;
  // margin-bottom: 10rpx;
  margin: 40rpx 16rpx 16rpx;
  // width: 718rpx;
  // height: 240rpx;
  .item {
    flex: 1;
    // 这里不可写固定像素，在安卓机上，会表现出2个元素的间距很大
    // width: 158px;
    height: 184rpx;
    border-radius: 24rpx;
    overflow: hidden;

    &:first-child {
      margin-right: 14rpx;
    }

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
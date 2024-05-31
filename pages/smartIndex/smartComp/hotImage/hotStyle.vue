<template>
  <view class="columns-container" data-desc='热区广告'>
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
  name: 'style-3',
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

  .item {
    flex: 1;
    height: 100%;

    overflow: hidden;
    margin-right: 16rpx;

    &:last-child {
      margin-right: 0;
    }
    .pic {     
      width: 100%;
      height: 218rpx;     
      border: none;
      border-radius: 24rpx;     
      .pic-que{
        width: 82rpx;
        height: 42rpx;
      }
    }  
  }
}
</style>
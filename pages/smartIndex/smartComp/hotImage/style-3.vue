<template>
  <view class="columns-container" data-desc='热区图3'>
    <view class="columns-container-left">
      <image class="columns-container-pic" v-if="config.list[0].url" :src="config.list[0].url" @click="toPage(config.list[0], 5)" />
      <view class="columns-container-pic flex-style bg-gray"  v-else>
        <image class="pic-que" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/ws-smart-life/component-no-pic-default.png" />
      </view>
    </view>

    <view class="columns-container-center">    
      <image class="columns-container-pic" v-if="slideshowImageList[0].url" :src="slideshowImageList[0].url" @click="toPage(slideshowImageList[0].url, 6)" />
      <view class="columns-container-pic flex-style bg-gray" v-else>      
        <image class="pic-que-middle"  src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/ws-smart-life/component-no-pic-default.png" />
      </view>   
    </view>

    <view class="columns-container-right">
      <image class="columns-container-pic" v-if="config.list[1].url" :src="config.list[1].url" @click="toPage(config.list[1], 6)" />
      <view class="columns-container-pic flex-style bg-gray" v-else>      
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
          list: [],
        }
      },
    },
  },
  data () {
    return {
      slideshowImageList: [],
    }
  },
   created() {
    this.slideshowImageList = JSON.parse(
      JSON.stringify(this.config.slideshowImageList)
    );    
  },
  methods: {
    toPage
  }
}
</script>

<style lang="less" scoped>
.columns-container {
  display: flex;
  margin: 40rpx 16rpx 16rpx;
  &-left{
    width: 160rpx;
    height: 184rpx;
    margin-right: 16rpx;
  }
  &-center{
    flex: 1;
    height: 184rpx;
  }
  &-right{
    width: 160rpx;
    height: 184rpx;
    margin-left: 16rpx;
  }
  .columns-container-pic{
    width: 100%;
    height: 100%;
    image{
      width: 58rpx;
      height: 32rpx;
    }
  }
 
  .pic-que{
    width: 80rpx;
    height: 42rpx;
  }
  .pic-que-middle{
    width: 124rpx;
    height: 64rpx;
  }
  .bg-gray{
    border-radius: 0;
  }
 
}
</style>
<template>
  <view class="columns-container" data-desc='三列图'>
    <view class="item" v-for="(item, index) in config.list" :key="index" @click="toPage(item)" :style="{marginBottom: (index == config.list.length - 1 || 
      index == config.list.length - 2 || index == config.list.length - 3) || config.list.length <= 3 ? '0': '16rpx' }">
      <image v-if="item.url" class="pic" :src="item.url" alt="" />
      <view class="pic flex-style bg-gray" v-else>      
        <image class="pic-que"  src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/ws-smart-life/component-no-pic-default.png" />
      </view>
      <view class="item-price" :style="{backgroundColor: item.textBg }" v-if="item.showPrice">
        <view class="item-price-sign" :style="{color: item.textColor }">¥</view>
        <view class="item-price-money" :style="{color: item.textColor }">{{ item.price }}</view>
      </view>
    </view>
  </view>
</template>

<script>
// import { toPage } from './data.js'
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
    // toPage
    toPage(item){
      this.$smart.go(item.miniAppLink || item.h5Link);
    },
  }
}
</script>

<style lang="less" scoped>
.columns-container {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  .item {
    position: relative;
    // flex: 1;
    width: calc((100% - 32rpx) / 3);
    height: 100%;

    overflow: hidden;
    margin-right: 16rpx;
    position: relative;
    &:last-child {
      margin-right: 0;
    }
    .pic {
      width: 100%;
      height: 218rpx;
      border: none;
      border-radius: 24rpx;
      .pic-que{
        width: 80rpx;
        height: 42rpx;
      }
    }
    &-price{
      position: absolute;
      left: -85rpx;
      margin-left: 50%;
      bottom: 16rpx;
      width: 170rpx;
      height: 40rpx;      
      line-height: 40rpx;
      border-radius: 20rpx;
      display: flex;
      align-items: baseline;
      justify-content: center;
      &-sign{
        font-size: 22rpx;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #FF450C;
      }
      &-money{
        font-size: 32rpx;
        font-family: DINAlternate-Bold, DINAlternate;
        font-weight: bold;
        color: #FF450C;
      }
    }
  }
  .item:nth-of-type(3n){
    margin-right: 0;
  }
  .item{   
    margin-bottom: 16rpx;
  }
}
</style>
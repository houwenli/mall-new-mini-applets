<template>
  <view class="columns-container" data-desc='四列图'>
    <!-- :style="getStyle" -->
    <view class="item" v-for="(item, index) in config.list" :key="index" @click="toPage(item)" :style="{marginBottom: (index == config.list.length - 1 || 
      index == config.list.length - 2 || index == config.list.length - 3 || index == config.list.length - 4) || config.list.length <= 4 ? '0': '16rpx' }" >
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
  name: 'style-4',
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
    width: calc((100% - 48rpx) / 4);
    // flex: 1;
    // width: 100%;
    // width: 168rpx;
    height: 168rpx;
    border-radius: 24rpx;
    overflow: hidden;
    margin-right: 16rpx;
    position: relative;
    &:last-child {
      margin-right: 0;
    }

    .pic {
      width: 100%;
      height: 100%;
      border: none;
      .pic-que{
        width: 62rpx;
        height: 32rpx;
      }
    }
    &-price{
      position: absolute;
      left: -60rpx;
      margin-left: 50%;
      bottom: 8rpx;
      width: 120rpx;
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
        font-size: 28rpx;
        font-family: DINAlternate-Bold, DINAlternate;
        font-weight: bold;
        color: #FF450C;
      }
    }
  }
  .item:nth-of-type(4n){
    margin-right: 0;
  }
  .item:not(:last-child){   
    margin-bottom: 16rpx;
  }
}
</style>
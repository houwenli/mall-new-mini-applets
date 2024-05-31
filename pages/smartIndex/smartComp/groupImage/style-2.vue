<template>
  <view class="columns-container" data-desc='双列图'>
    <scroll-view scroll-x="true" class="index-nav" 
      scroll-with-animation style="white-space: nowrap;" v-if="!config.direction">
      <view class="item" v-for="(item, index) in config.list" :key="index" @click="toPage(item)" >
        <image v-if="item.url" class="pic" :src="item.url" alt="" />
        <view class="pic flex-style bg-gray" v-else>      
          <image class="pic-que"  src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/ws-smart-life/component-no-pic-default.png" />
        </view>
        <view class="item-price" :style="{backgroundColor: item.textBg }" v-if="item.showPrice">
          <view class="item-price-sign" :style="{color: item.textColor }">¥</view>
          <view class="item-price-money" :style="{color: item.textColor }">{{ item.price }}</view>
        </view>
      </view>
    </scroll-view>

    <view class="item" v-for="(item, index) in config.list" :key="index" @click="toPage(item)" v-else :style="{marginBottom: (index == config.list.length - 1 || 
      index == config.list.length - 2) || config.list.length <= 2 ? '0': '16rpx' }">
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
  // margin-bottom: 10rpx;
  flex-wrap: wrap;
  width: 100%;
  .item {
    position: relative;
    width: calc((100% - 16rpx) / 2);
    // flex: 1;
    // 这里不可写固定像素，在安卓机上，会表现出2个元素的间距很大
    // width: 158px;
    height: 168rpx;
    border-radius: 24rpx;
    overflow: hidden;  
    margin-right: 14rpx;  
    .pic {
      width: 100%;
      height: 100%;
      border: none;
      .pic-que{
        width: 124rpx;
        height: 64rpx;
      }
    }
    &-price{
      position: absolute;
      right: 20rpx;
      bottom: 20rpx;
      width: 138rpx;
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
  .item:nth-of-type(2n){
    margin-right: 0;
  }
  .item:not(:last-child){   
    margin-bottom: 16rpx;
  }
  .index-nav{
    width: 100%;
    height: 168rpx;
    .item{
      // width: 336rpx;
      height: 168rpx;
      display: inline-block;
    }
    .item:nth-of-type(2n){
      margin-right: 14rpx;
    }
    .item:not(:last-child){   
      margin-bottom: 0;
    }
  }
}
</style>
<template>
  <view class="container" data-desc='半屏双列图'>
    <view
      v-if="config.hasBackground === '1'"
      class="group-panel"
      :style="[getLeftStyle]"
    >
      <view
        v-if="config.hasBackground === '1' && config.showComTitle === '1'"
        class="title"
        >{{ config.list[0].comTitle }}</view
      >
      <view class="pic-list">
        <view
          v-for="(item, index) in leftList"
          :key="index"
          class="item"
          @click="toRouter(item)"
        >
          <image v-if="item.url" class="pic" :src="item.url" />        
          <view class="pic flex-style bg-gray" v-else>      
            <image class="pic-que"  src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/ws-smart-life/component-no-pic-default.png" />
          </view>
          <view class="item-price" :style="{backgroundColor: item.textBg }" v-if="item.showPrice">
            <view class="item-price-sign" :style="{color: item.textColor }">¥</view>
            <view class="item-price-money" :style="{color: item.textColor }">{{ item.price }}</view>
          </view>
        </view>
      </view>
    </view>
    <view
      v-if="config.hasBackground === '1'"
      class="group-panel"
      :style="[getRightStyle]"
    >
      <!-- 标题 -->
      <view
        v-if="config.hasBackground === '1' && config.showComTitle === '1'"
        class="title"
      >
        {{ config.list[1].comTitle }}
      </view>
      <view class="pic-list">
        <view
          v-for="(item, index) in rightList"
          :key="index"
          class="item"
          @click="toRouter(item)"
        >
          <image v-if="item.url" class="pic" :src="item.url" />
          <view class="pic flex-style bg-gray" v-else>      
            <image class="pic-que"  src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/ws-smart-life/component-no-pic-default.png" />
          </view>
          <view class="item-price" :style="{backgroundColor: item.textBg }" v-if="item.showPrice">
            <view class="item-price-sign" :style="{color: item.textColor }">¥</view>
            <view class="item-price-money" :style="{color: item.textColor }">{{ item.price }}</view>
          </view>
        </view>
      </view>
    </view>
    <view v-if="config.hasBackground === '0'" class="flex-center">
      <view
        v-for="(item, index) in config.list"
        :key="index"
        class="noBackgeround"
        @click="toRouter(item)"
      >
        <image v-if="item.url" class="pic" :src="item.url" />
        <view class="pic flex-style bg-gray" v-else>      
          <image class="pic-que"  src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/ws-smart-life/component-no-pic-default.png" />
        </view>
        <view class="item-price" :style="{backgroundColor: item.textBg }" v-if="item.showPrice">
          <view class="item-price-sign" :style="{color: item.textColor }">¥</view>
          <view class="item-price-money" :style="{color: item.textColor }">{{ item.price }}</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
// 半屏双列图
export default {
  name: 'DoubleColumn',
  props: {
    config: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {};
  },
  computed: {
    leftList() {      
      return this.config.list[0].list;
      // return this.config.list.filter((item, index) => index < 2);
    },
    rightList() {
      return this.config.list[1].list;
      // return this.config.list.filter((item, index) => index > 1);
    },

    /**
     * 左侧背景样式
     */
    getLeftStyle() {
      if(this.config.backgroundType == 1){
        return {
          backgroundImage: `url(${this.config.list[0].bgImage})`,
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          'background-size': '100% 100%',          
        };
      } else {
         return {        
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          'background-size': '100% 100%',
          'background-color': `${this.config.list[0].bgColor}` || '#FFFFFF',
        };
      }
    },

    getRightStyle() {
      if(this.config.backgroundType == 1){
        return {
        backgroundImage: `url(${this.config.list[1].bgImage})`,
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          'background-size': '100% 100%',
          'background-size': '100% 100%',         
        };
      } else {
        return {        
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          'background-size': '100% 100%',
          'background-size': '100% 100%',
          'background-color': `${this.config.list[1].bgColor}` || '#FFFFFF',
        };
      }
      
    },
  },
  methods: {
    // 路由跳转
    toRouter(params) {   
      this.$smart.go(params.miniAppLink || params.h5Link);
    },
  },
};
</script>

<style scoped lang="scss">
.container {
  display: flex;
  justify-content: space-between;
  margin: 0 16rpx;
  .title {
    font-size: 30rpx;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #222222;
    margin-bottom: 16rpx;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .item {
    width: 152rpx;
    height: 152rpx;
    border-radius: 24rpx;
    overflow: hidden;
    position: relative;
    .pic {
      width: 100%;
      height: 100%;
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
      height: 32rpx;      
      line-height: 32rpx;
      border-radius: 16rpx;
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
  .noBackgeround {
    width: 168rpx;
    height: 168rpx;
    border-radius: 24rpx;
    overflow: hidden;

    .pic {
      width: 100%;
      height: 100%;
      .pic-que{
        width: 62rpx;
        height: 32rpx;
      }
    }
  }
  .group-panel {
    border-radius: 32rpx;
    width:calc((100% - 14rpx)/2);
    height: 244rpx;
    padding: 20rpx 16rpx 16rpx 16rpx;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    .pic-list {
      display: flex;
      justify-content: space-between;
    }
  }
  .flex-center {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
}
</style>

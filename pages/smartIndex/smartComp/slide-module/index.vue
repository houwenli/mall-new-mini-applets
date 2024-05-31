<template>
  <!-- 滑动区块组件 -->
  <!-- 有背景： 背景颜色/背景图片 -->
  <view
    v-if="config.hasBackground === '1'"
    class="slide_module"
    :style="[getStyle]"
  >
    <view class="module-title" v-if="config.showComTitle == '1'">{{
      config.comTitle
    }}</view>
    <view class="image_list">
      <view class="img_item" v-for="(item, index) in config.list" :key="index">
      
        <view
          @click.stop="navigate(item)"
          class="image"
          v-if="item.url"
          :style="{
            'background-image': `url(${item.url})`,              
            'background-repeat': 'no-repeat',
            'background-size': 'cover',
            'background-position': 'center',
          }"
        ></view>
        <view class="image flex-style bg-gray" v-else  @click.stop="navigate(item)">      
          <image class="pic-que"  src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/ws-smart-life/component-no-pic-default.png" />
        </view>
        <view class="item-price" :style="{backgroundColor: item.backgroundColor }" v-if="item.hasPrice">
          <view class="item-price-sign">¥</view>
          <view class="item-price-money">{{ item.price }}</view>
        </view>
      </view>
    </view>
  </view>
  <!-- 无背景颜色 -->
  <view class="no_bg_slide_module" v-else>
    <view class="image_list">
      <view class="img_item" v-for="(item, index) in config.list" :key="index">       
        <view
          @click.stop="navigate(item)"
          class="image"
          v-if="item.url"
          :style="{
            'background-image': `url(${item.url})`,              
            'background-repeat': 'no-repeat',
            'background-size': 'cover',
            'background-position': 'center',
          }"
        ></view>
        <view class="image flex-style bg-gray" v-else  @click.stop="navigate(item)">      
          <image class="pic-que"  src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/ws-smart-life/component-no-pic-default.png" />
        </view>
        <view class="item-price" :style="{backgroundColor: item.backgroundColor }" v-if="item.hasPrice">
          <view class="item-price-sign">¥</view>
          <view class="item-price-money">{{ item.price }}</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>

// 滑动区块组件
export default {
  name: 'SlideModule',
  props: {
    config: {
      type: Object,
      default: () => {},
    },
    isDistribution: {
      type: Boolean,
      required: false,
      default: () => false,
    },
  },

  computed: {
    getStyle() {
      if (this.config.bgColor) {
        return {
          backgroundColor: this.config.bgColor,
        };
      }

      return {
        'background-image': `url(${this.config.bgImage})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
      };
    },
  },

  methods: {
    navigate(data) {
      this.$smart.go(data.miniAppLink || data.h5Link);
    },
  },
};
</script>

<style scoped lang="scss">
.no_bg_slide_module {
  margin: 0 16rpx;
  // background: #fff;
}
.slide_module {
  padding: 74rpx 16rpx 16rpx 16rpx;
  border-radius: 24rpx;
  background-color: #fff;
  margin: 0 16rpx;
  box-sizing: border-box;
  position: relative;
  .module-title {
    font-size: 30rpx;
    font-weight: 600;
    color: #222;
    line-height: 38rpx;
    position: absolute;
    left: 20rpx;
    top: 20rpx;
  }
}
.image_list {
  display: flex;
  overflow: auto;
  -ms-overflow-style: none; /* IE 10+ */
  scrollbar-width: none; /* Firefox */
  .img_item {
    box-sizing: border-box;
    margin-right: 16rpx;
    text-align: center;
    position: relative;
    .image {
      width: 168rpx;
      height: 168rpx;
      border-radius: 24rpx;
      .pic-que{
        width: 62rpx;
        height: 32rpx;
      }
    }
    .item-price{
      position: absolute;
      left: -60rpx;
      margin-left: 50%;
      bottom: 8rpx;
      width: 120rpx;
      height: 32rpx;      
      line-height: 32rpx;
      border-radius: 16rpx;
      display: flex;
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
  .img_item:last-child {
    margin-right: 0;
  }
}
.image_list::-webkit-scrollbar {
  display: none; /* Chrome Safari */
}
</style>

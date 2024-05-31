<template>
  <view class="cube-list">
    <view class="cube-image-left" :class="config.hasBackground == '0' ? 'cube-image-left-no':''">
      <u-swiper
        name="url"
        :circular="true"
        :list="slideshowImageList"
        class="imgCube_swiper"
        :height="swiperHeight"
        border-radius="24"
        @click="clickSwiperCurrent($event, slideshowImageList)"
        :mode="slideshowImageList.length > 1 ? 'dot' : 'none'"
      ></u-swiper>
    </view>
    <view class="cube-image-right" :class="config.hasBackground == '0' ? 'cube-image-right-no':''">
      <view class="right-pic-item" v-for="(item, index) in config.list" :key="index">
        <image class="right-pic-item-pic" v-if="item.url" :src="item.url" @click="toPage(item, index)" />
        <view v-else class="cube-img-default-logo">
          <image src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/home/home-prefetch-default-logo-2x.png" />
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { toPage, clickSwiperCurrent } from './data.js'
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
    return {
      slideshowImageList: [],
      swiperHeight: 316, // 默认有背景，高度
    }
  },
  created() {
    this.slideshowImageList = JSON.parse(
      JSON.stringify(this.config.slideshowImageList)
    );
    this.slideshowImageList.forEach((item) => {
      if (!item.url) {
        item.url =
          "https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/229f3ae46bb7b4f2a682957b9f4b45b6.png";
      }
      return item;
    });
    // 判断有无背景
    this.swiperHeight = Number(this.config.hasBackground) === '0' ? 340 : 316
  },
  methods: {
    toPage,
    clickSwiperCurrent
  }
}
</script>

<style lang="scss" scoped>
.cube-list {
  display: flex;
  justify-content: space-between;
  .cube-image-left {
    width: 316rpx;
    height: 316rpx;
    border-radius: 24rpx;
    position: relative;
    .imgCube_swiper {
      /deep/ .u-indicator-item-round-active {
        background-color: "#E60113" !important;
      }
    }
  }
  .cube-image-left-no {
    width: 340rpx;
    height: 340rpx;
  }
  .cube-image-right {
    max-width: 49%;
    display: flex;
    flex-wrap: wrap;
    .right-pic-item:nth-child(1) {
      margin:0 20rpx 20rpx 0;
    }
    .right-pic-item:nth-child(3) {
      margin:0 20rpx 0 0;
    }
    .right-pic-item {
      .cube-img-default-logo,.right-pic-item-pic {
        width: 148rpx;
        height: 148rpx;
        background: #FBFBFB;
        border-radius: 24rpx;
        position: relative;
        image {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%,-50%);
          width: 77rpx;
          height: 28rpx;
        }
      }
    }
    .cube-image-right-no {
    .right-pic-item {
      .cube-img-default-logo,.right-pic-item-pic {
        width: 160rpx;
        height: 160rpx;
        background: #FBFBFB;
        border-radius: 24rpx;
        position: relative;
        image {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%,-50%);
          width: 77rpx;
          height: 28rpx;
        }
      }
    }
  }
  }
}
</style>
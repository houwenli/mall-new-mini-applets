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
      <view class="right-pic-item" v-for="(item, index) in list" :key="index">
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
    return {
      slideshowImageList: [],
      list:[],
      swiperHeight: 416, // 默认有背景，高度
    }
  },
  created() {
    this.list = this.config.list?.slice(0,2) // 风格1，右边2组数据
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
    this.swiperHeight = Number(this.config.hasBackground) === '0' ? 464 : 416
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
    // max-width: 49%;
    width: 316rpx;
    height: 416rpx;
    border-radius: 24rpx;
    position: relative;
    .imgCube_swiper {
      /deep/ .u-indicator-item-round-active {
        background-color: "#E60113" !important;
      }
    }
    /deep/ swiper {
      height: 416rpx !important;
    }
  }
  .cube-image-left-no {
    width: 340rpx;
    height: 464rpx;
    /deep/ swiper {
      height: 464rpx !important;
    }
  }
  .cube-image-right {
    max-width: 49%;
    max-height: 49%;
    .right-pic-item:first-child {
      margin-bottom: 16rpx;
    }
    .right-pic-item {
      .cube-img-default-logo,.right-pic-item-pic {
        width: 316rpx;
        height: 200rpx;
        background: #FBFBFB;
        border-radius: 24rpx;
        position: relative;
        image {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%,-50%);
          width: 154rpx;
          height: 56rpx;
        }
      }
    }
  }
  .cube-image-right-no {
    .right-pic-item {
      .cube-img-default-logo,.right-pic-item-pic {
        width: 340rpx;
        height: 220rpx;
        background: #FBFBFB;
        border-radius: 24rpx;
        position: relative;
        image {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%,-50%);
          width: 154rpx;
          height: 56rpx;
        }
      }
    }
  }
}
</style>
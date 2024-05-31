<template>
  <view class="cube-list">
    <view class="cube-image-top" :class="config.hasBackground == '0' ? 'cube-image-top-no':''">
      <u-swiper
        name="url"
        :circular="true"
        :list="slideshowImageList"
        height="200"
        border-radius="24"
        class="imgCube_swiper"
        @change="getSwiperCurrent"
        @click="clickSwiperCurrent($event, slideshowImageList)"
        :mode="slideshowImageList.length > 1 ? 'round' : 'none'"
      ></u-swiper>
      <!-- 重置小圆点的样式 -->
      <view class="dots" v-show="slideshowImageList && slideshowImageList.length > 1">
        <template v-for="(item, index) in slideshowImageList">
          <view
            :key="index"
            :class="index == currentSwiper ? ' active dot' : 'dot'"
          ></view>
        </template>
      </view>
    </view>
    <view class="cube-image-down" :class="config.hasBackground == '0' ? 'cube-image-down-no':''">
      <view class="right-pic-item" v-for="(item, index) in config.list" :key="index">
        <image class="right-pic-item-pic" v-if="item.url" :src="item.url" @click="toPage(item, index+5)" />
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
    return {
      currentSwiper: 0, // swiper选中的页码
      slideshowImageList: [],
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
  },
  methods: {
    toPage,
    clickSwiperCurrent,
    /* 获取当前swiper选中 */
    getSwiperCurrent(e) {
      this.currentSwiper = e;
    },
  }
}
</script>

<style lang="scss" scoped>
.cube-list {
  .cube-image-top {
    width: 654rpx;
    height: 200rpx;
    border-radius: 24rpx;
    margin-bottom: 24rpx;
    position: relative;
    .imgCube_swiper {
      /deep/ .u-indicator-item-round-active {
        background-color: "#E60113" !important;
      }
    }

    /*用来包裹所有的小圆点 */
    .dots {
      height: 8rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      position: absolute;
      left: 50%;
      bottom: 16rpx;
      transform: translate(-50%, 0);
    }
    /*未选中时的小圆点样式 */
    .dot {
      width: 10rpx;
      height: 10rpx;
      border-radius: 50%;
      margin-right: 8rpx;
      background-color: #ffffff;
    }
    /*选中以后的小圆点样式 */
    .active {
      width: 10rpx;
      height: 10rpx;
      border-radius: 50%;
      background-color: $wsf-color-red;
    }
  }
  .cube-image-top-no {
    width: 702rpx;
    height: 200rpx;
  }

  .cube-image-down {
    display: flex;
    justify-content: space-between;
    .right-pic-item {
      .cube-img-default-logo,.right-pic-item-pic {
        width: 204rpx;
        height: 204rpx;
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
  .cube-image-down-no {
    .right-pic-item {
      .cube-img-default-logo,.right-pic-item-pic {
        width: 220rpx;
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
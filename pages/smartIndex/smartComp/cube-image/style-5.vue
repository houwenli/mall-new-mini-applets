<template>
  <view class="cube-list">
    <view class="cube-image-item-pic" :class="config.hasBackground == '0' ? 'cube-image-item-pic-no':''">
      <image class="right-pic-item-pic" v-if="config.list[0].url" :src="config.list[0].url" @click="toPage(config.list[0], 5)" />
      <view v-else class="cube-img-default-logo">
        <image src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/ws-smart-life/component-no-pic-default.png" />
      </view>
    </view>
    <view class="cube-image-center" :class="config.hasBackground == '0' ? 'cube-image-center-no':''">
      <u-swiper
        name="url"
        :circular="true"
        :list="slideshowImageList"
        class="imgCube_swiper"
        height="168"
        border-radius="24"
        @click="clickSwiperCurrent($event, slideshowImageList)"
        :mode="slideshowImageList.length > 1 ? 'dot' : 'none'"
      ></u-swiper>
    </view>
    <view class="cube-image-item-pic" :class="config.hasBackground == '0' ? 'cube-image-item-pic-no':''">
      <image class="right-pic-item-pic" v-if="config.list[1].url" :src="config.list[1].url" @click="toPage(config.list[1], 6)" />
      <view class="cube-img-default-logo flex-style bg-gray" v-else>      
        <image class="pic-que"  src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/ws-smart-life/component-no-pic-default.png" />
      </view>
    </view>
  </view>
</template>

<script>
// import { toPage, clickSwiperCurrent } from './data.js'
// 魔方图片
export default {
  name: 'style-5',
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
          "https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/ws-smart-life/home/smart_mofang_5.png";
      }
      return item;
    });
  },
  methods: {
    // toPage,
    // clickSwiperCurrent
    toPage(item){      
      this.$smart.go(item.miniAppLink || item.h5Link);
    },
    clickSwiperCurrent(e, params){
      let advert = params[e];
      if (!advert) {
        return;
      } else {          
        this.$smart.go(advert.miniAppLink || advert.h5Link);
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.cube-list {
  display: flex;
  justify-content: space-between;
  .cube-image-center {
    width: 336rpx;
    height: 168rpx;
    border-radius: 24rpx;
    position: relative;
    .imgCube_swiper {
      border-radius: 24rpx;
      /deep/ .u-indicator-item-round-active {
        background-color: "#E60113" !important;
      }
    }
  }
  .cube-image-center-no {
    width: 364rpx;
    height: 168rpx;
  }
  .cube-image-item-pic {
    .cube-img-default-logo,.right-pic-item-pic {
      width: 160rpx;
      height: 168rpx;
      // background: #FBFBFB;
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
      .pic-que{
        width: 82rpx;
        height: 42rpx;
      }
    }
  }
  .cube-image-item-pic-no {
    .cube-img-default-logo,.right-pic-item-pic {
      width: 160rpx;
      height: 168rpx;
      // background: #FBFBFB;
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
      .pic-que{
        width: 82rpx;
        height: 42rpx;
      }
    }
  }
}
</style>
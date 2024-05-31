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
        @click="clickSwiperCurrent($event, slideshowImageList)"
        :mode="slideshowImageList.length > 1 ? 'dot' : 'none'"
      ></u-swiper>
    </view>
    <view class="cube-image-down" :class="config.hasBackground == '0' ? 'cube-image-down-no':''">
      <view class="right-pic-item" v-for="(item, index) in config.list" :key="index">
        <image class="right-pic-item-pic" v-if="item.url" :src="item.url" @click="toPage(item, index)" />
        <view class="cube-img-default-logo flex-style bg-gray" v-else>      
          <image class="pic-que"  src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/ws-smart-life/component-no-pic-default.png" />
        </view>
      </view>
    </view>
  </view>
</template>

<script>
// import { toPage, clickSwiperCurrent } from './data.js'
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
          "https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/ws-smart-life/home/smart_mofang_3.png";
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
  .cube-image-top {
    // width: 654rpx;
    height: 200rpx;
    border-radius: 32rpx;
    margin-bottom: 16rpx;
    position: relative;
    .imgCube_swiper {
      /deep/ .u-indicator-item-round-active {
        background-color: "#E60113" !important;
      }
    }
  }
  .cube-image-top-no {
    // width: 702rpx;
    height: 200rpx;
  }

  .cube-image-down {
    display: flex;
    justify-content: space-between;
    .right-pic-item {
      width: calc((100% - 32rpx)/3);
      .cube-img-default-logo,.right-pic-item-pic {
        // width: 204rpx;
        width: 100%;
        height: 218rpx;
        // background: #FBFBFB;
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
        .pic-que{
          width: 82rpx;
          height: 42rpx;
        }
      }
    }
  }
  .cube-image-down-no {
    .right-pic-item {
       width: calc((100% - 32rpx)/3);
      .cube-img-default-logo,.right-pic-item-pic {
        // width: 220rpx;
        width: 100%;
        height: 160rpx;
        // background: #FBFBFB;
        border-radius: 25rpx;
        position: relative;
        image {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%,-50%);
          width: 154rpx;
          height: 56rpx;
        }
        .pic-que{
          width: 82rpx;
          height: 42rpx;
        }
      }
    }
  }
}
</style>
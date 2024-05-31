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
      swiperHeight: 336, // 默认有背景，高度
    }
  },
  created() {
    this.slideshowImageList = JSON.parse(
      JSON.stringify(this.config.slideshowImageList)
    );
    this.slideshowImageList.forEach((item) => {
      if (!item.url) {
        item.url =
          "https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/ws-smart-life/home/smart_mofang_4.png";
      }
      return item;
    });
    // 判断有无背景
    this.swiperHeight = Number(this.config.hasBackground) === 0 ? 352 : 336
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
  .cube-image-left {
    width: 336rpx;
    height: 336rpx;
    border-radius: 24rpx;
    position: relative;
    .imgCube_swiper {
      /deep/ .u-indicator-item-round-active {
        background-color: "#E60113" !important;
      }
    }
  }
  .cube-image-left-no {
    width: 352rpx;
    height: 352rpx;
  }
 
  .cube-image-right {
    box-sizing: border-box;
    width: calc(100% - 352rpx); 
    display: flex;
    flex-wrap: wrap;
    margin-left: 16rpx;
    .right-pic-item:nth-child(1) {
      margin:0 14rpx 16rpx 0;
    }
    .right-pic-item:nth-child(3) {
      margin:0 14rpx 0 0;
    }
    .right-pic-item {  
      width: calc(50% - 8rpx);
      height: 160rpx;
      .cube-img-default-logo,.right-pic-item-pic {
        width: 100%;
        height: 100%;
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
  .cube-image-right-no {
    width: calc(100% - 368rpx); 
    .right-pic-item {
      width: calc(50% - 8rpx);
      height: 168rpx;
      .cube-img-default-logo,.right-pic-item-pic {
        width: 100%;
        height: 100%;
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
}
</style>
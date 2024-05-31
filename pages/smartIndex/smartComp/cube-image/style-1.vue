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
          "https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/ws-smart-life/home/smart_mofang_1.png";
      }
      return item;
    });
    // 判断有无背景
    this.swiperHeight = Number(this.config.hasBackground) === '0' ? 464 : 416
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
  // justify-content: space-between;
  .cube-image-left {
    // max-width: 49%;
    width: 336rpx;
    height: 416rpx;
    border-radius: 24rpx;
    position: relative;
    margin-right: 16rpx;
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
    width: 352rpx;
    height: 416rpx;
    /deep/ swiper {
      height: 416rpx !important;
    }
  }
  .cube-image-right {   
    width: calc(100% - 352rpx);
    .right-pic-item:first-child {
      margin-bottom: 16rpx;
    }
    .right-pic-item {
      height: 200rpx;
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
          // width: 154rpx;
          width: 100%;
          height: 56rpx;
        }
        .pic-que{
          width: 124rpx;
          height: 64rpx;
        }
      }
    }
  }
  .cube-image-right-no {
    width: calc(100% - 368rpx);
    .right-pic-item {
      height: 200rpx;
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
          width: 100%;
          height: 56rpx;
        }
        .pic-que{
          width: 124rpx;
          height: 64rpx;
        }
      }
    }
  } 
}
</style>
<template>
  <view class="wrap applet-template-swiper">
    <!-- uni-app 内置组件 -->   
    <swiper
      :indicator-dots='showIndicatorDots'
      class="swiper"
      :autoplay="swiperAutoplay"
      indicator-active-color='#fff'
      :circular="true"
      :interval="config.time || 3000"
      :current="currentSwiper"
      @change="getSwiperCurrent"
      :vertical="config.direction === 'horizontal' ? false : true"
      @click="clickSwiperCurrent"
    >
      <swiper-item v-for="(item, index) in config.list" :key="index">
        <image
          v-if="item.url"
          style="height: 100%; width: 100%; border-radius: 24rpx"
          :src="item.url"
        />
        <view class="empty-smart-image flex-style bg-gray" v-else>      
          <image class="pic-que"  src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/ws-smart-life/component-no-pic-default.png" />
        </view>       
      </swiper-item>
    </swiper>
  </view>
</template>

<script>
// 轮播图
export default {
  props: {
    config: {
      type: Object,
      default: () => {},
    },

    // 分销
    isDistribution: {
      type: Boolean,
      required: false,
      default: () => false,
    },
    isShowIndicatorDots: {
      type: Boolean,
      required: false,
      default: () => true
    }
  },
  data() {
    return {
      currentSwiper: 0, // swiper选中的页码
      swiperAutoplay: true,
    };
  },

  computed: {
    showIndicatorDots(){
      this.config.direction === "horizontal" && this.isShowIndicatorDots
    }
  },

  onShow() {
    this.swiperAutoplay = true;
  },
  onHide() {
    this.swiperAutoplay = false;
  },
  methods: {
    /* 获取当前swiper选中 */
    getSwiperCurrent(e) {
      let { current, source } = e.detail;
      if (source === 'autoplay' || source === 'touch') {
        this.currentSwiper = current;
      }
    },
    /* 点击swiper */
    clickSwiperCurrent() {
      let data = this.config.list[this.currentSwiper];               
      this.$smart.go(data.miniAppLink || data.h5Link);
    },
  },
};
</script>

<style scoped lang="scss">
.wrap {
  padding: 0 16rpx;
  margin: 0 auto;
}
.swiper {
  width: 100%;
  height: 120rpx;
  border-radius: 24rpx;
  overflow: hidden;
  transform: translateY(0);
}
.applet-template-swiper {
  width: 750rpx;
  box-sizing: border-box;
  position: relative;
  border-radius: 24rpx;
  overflow: hidden;
}
.empty-smart-image {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
	background-color: #FBFBFB;
  .pic-que{
    width: 124rpx;
    height: 64rpx;
  }
  // &::before {
	// 	content: '';
	// 	width: 154rpx;
	// 	height: 56rpx;
	// 	background: url('https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/home/ic_empty_logo.png') center center no-repeat;
	// 	background-size: 100% 100%;
	// }
}
</style>

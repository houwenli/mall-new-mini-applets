<template>
  <view class="wrap applet-template-swiper">
    <!-- uni-app 内置组件 -->
    <swiper
      :indicator-dots='showIndicatorDots'
      class="swiper"
      :autoplay="swiperAutoplay"
      indicator-active-color='#fff'
      :circular="true"
      interval="3000"
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
        <view v-else class="empty-fill-image"></view>
      </swiper-item>
    </swiper>
  </view>
</template>

<script>
import { goPage } from '@/pages/index/helper/index.js'
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
      let item = this.config.list[this.currentSwiper];

      if (!item) return;
      let link = item.link.split('~')[1] || item.link

      if (!link) return;

      if (!this.isDistribution) {
        // 流量分析埋点
        let obj = {
          name: '轮播图',
          type: 1,
          image: item.url || '',
          url: link || '',
          index: this.currentSwiper,
        };
        this.$store.dispatch('SETTINGS/advertVisitRequest', obj);
      }

      // if (this.isDistribution) {
      //   link = item.link.split('~')[1];
      // } else {
      //   link = item.link;
      //   if (!link) return;
      //   if (link.indexOf('/spudetail') !== -1) {
      //     let id = link.split('id=')[1];
      //     link = `productModule/pages/skuDetail/skuDetail?skuId=${id}`;
      //   } else if (link.indexOf('/firstOrder') !== -1) {
      //     let id = link.split('id=')[1];
      //     link = `productModule/pages/firstOrder/firstOrder?id=${id}`;
      //   } else if (link.indexOf('/spulist') !== -1) {
      //     let id = link.split('cateId=')[1];
      //     link = `productModule/pages/spuList/spuList?cateId=${id}`;
      //   }
      // }

      // if (link.indexOf('/spudetail') !== -1) {
      //   let id = link.split('id=')[1];
      //   link = `productModule/pages/skuDetail/skuDetail?skuId=${id}`;
      // } else if (link.indexOf('/firstOrder') !== -1) {
      //   let id = link.split('id=')[1];
      //   link = `productModule/pages/firstOrder/firstOrder?id=${id}`;
      // } else if (link.indexOf('/spulist') !== -1) {
      //   let id = link.split('cateId=')[1];
      //   link = `productModule/pages/spuList/spuList?cateId=${id}`;
      // }

      goPage(link)

      // 分销场景
      // if (
      //   link == 'distributionModule/pages/distributionIndex/distributionIndex'
      // ) {
      //   let isLogin = getApp().globalData.isLink;
      //   if (isLogin) {
      //     // 跳转到分销的页面
      //     this.$wsf.go('distributionIndex');
      //   } else {
      //     // 登录
      //     this.$wsf.go('QuickLogin', { cartRoute: 'pages/index/index' });
      //   }
      // } else {
      //   // 直接跳转配置商品详情
      //   this.$wsf.go(link);
      // }
    },
  },
};
</script>

<style scoped lang="scss">
.wrap {
  padding: 0 24rpx;
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
.empty-fill-image {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
	background-color: #FBFBFB;
  &::before {
		content: '';
		width: 154rpx;
		height: 56rpx;
		background: url('https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/home/ic_empty_logo.png') center center no-repeat;
		background-size: 100% 100%;
	}
}
</style>

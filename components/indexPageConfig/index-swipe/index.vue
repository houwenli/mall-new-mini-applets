<template>
  <view class="wrap applet-template-swiper" :key="index">
    <!-- <u-swiper
      bg-color="rgba(0,0,0,0)"
      mode="none"
      height="120"
      border-radius="32"
      :list="imgList"
      name="url"
      :circular="true"
      img-mode="scaleToFill"
      @change="getSwiperCurrent"
      @click="clickSwiperCurrent($event, imgList)"
    ></u-swiper> -->
    <swiper
      class="swiper"
      :autoplay="swiperAutoplay"
      :circular="true"
      interval="3000"
      :current="currentSwiper"
      @change="getSwiperCurrent"
      :vertical="type == 'vertical' ? true : false"
      @click="clickSwiperCurrent(currentSwiper, imgList)"
    >
      <swiper-item v-for="(item,index) in imgList" :key='index'>
        <image v-if="item.url" style="height: 100%; width: 100%; border-radius: 24rpx;" :src="item.url" />
        <view v-else class="empty-fill-image"></view>
      </swiper-item>
    </swiper>

    <!-- 重置小圆点的样式 -->
    <view class="dots" v-if="type == 'horizontal' && imgList && imgList.length > 1">
      <template v-for="(item, index) in imgList">
        <view
          :key="index"
          :class="index == currentSwiper ? ' active dot' : 'dot'"
        ></view>
      </template>
    </view>
  </view>
</template>

<script>
export default {
  components: {},
  props: {
    isDistribution: {
      type: Boolean,
      required: false,
      default: () => false,
    },
    type: {
      type: String,
      required: false,
      default: 'horizontal',
    },
    listData: {
      type: Array,
      required:false,
      default: () => {
        return [
          {
            id: "u695256381",
            image: "https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/229f3ae46bb7b4f2a682957b9f4b45b6.png",
            link: "",
          },
          {
            id: "u485225903",
            image: "https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/229f3ae46bb7b4f2a682957b9f4b45b6.png",
            link: "",
          },
          {
            id: "u006012768",
            image: "https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/229f3ae46bb7b4f2a682957b9f4b45b6.png",
            link: "",
          },
        ];
      },
    },
  },
  data() {
    return {
      currentSwiper: 0, // swiper选中的页码
      imgList:[],
      swiperAutoplay: true
    };
  },
  created() {
    this.imgList = JSON.parse(JSON.stringify(this.listData))
  },
  onShow() {
    this.swiperAutoplay = true
  },
  onHide() {
    this.swiperAutoplay = false
  },
  methods: {
    /* 获取当前swiper选中 */
    getSwiperCurrent(e) {
      let {current, source} = e.detail
      if(source === 'autoplay' || source === 'touch') {
        this.currentSwiper = current
      }
    },
    /* 点击swiper */
    clickSwiperCurrent(e, params) {
      console.log(params[e])
      let advert = params[e];
      if(!this.isDistribution){
        // 流量分析埋点
        let obj = {
          name:'轮播图',
          type: 1,
          image:params[e].url || '',
          url:params[e].link || '',
          index:e
        }
        this.$store.dispatch("SETTINGS/advertVisitRequest",obj);
      }

      if (!advert) {
        return;
      } else {
				let link
				if(this.isDistribution) {
					link = advert.link.split('~')[1]
				} else {
					link = advert.link
          if(!link) return
          if(link.indexOf('/spudetail') !== -1) {
            let id = link.split('id=')[1]
            link = `productModule/pages/skuDetail/skuDetail?skuId=${id}`
          } else if(link.indexOf('/firstOrder') !== -1) {
            let id = link.split('id=')[1]
            link = `productModule/pages/firstOrder/firstOrder?id=${id}`
          } else if(link.indexOf('/spulist') !== -1) {
            let id = link.split('cateId=')[1]
            link = `productModule/pages/spuList/spuList?cateId=${id}`
          }
				}
       if(link == "distributionModule/pages/distributionIndex/distributionIndex") {
        let isLogin = getApp().globalData.isLink;
        if(isLogin) {
          this.$wsf.go('distributionIndex')
        } else {
          this.$wsf.go('QuickLogin', { cartRoute: 'pages/index/index' })
        }
       } else {
        this.$wsf.go(link);
       }
      }
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
</style>

<template>
  <view class="wrap applet-template-swiper" :key="index">
    <u-swiper
      bg-color="rgba(0,0,0,0)"
      mode="none"
      height="280"
      border-radius="10"
      :list="imgList"
      name="url"
      :circular="true"
      img-mode="scaleToFill"
      @change="getSwiperCurrent"
      @click="clickSwiperCurrent($event, imgList)"
    ></u-swiper>

    <!-- 重置小圆点的样式 -->
    <view class="dots" v-if="imgList && imgList.length > 1">
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
    isDistribution:{
      type: Boolean,
      required: false,
      default: () => false,
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
      imgList:[]
    };
  },
  created() {
    this.imgList = JSON.parse(JSON.stringify(this.listData))
    this.imgList.forEach(item => {
      if(!item.url){
        item.url = 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/229f3ae46bb7b4f2a682957b9f4b45b6.png'
      }
      return item
    })
  },
  methods: {
    /* 获取当前swiper选中 */
    getSwiperCurrent(e) {
      this.currentSwiper = e;
    },
    /* 点击swiper */
    clickSwiperCurrent(e, params) {
			console.log(e,params)
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
.applet-template-swiper {
  width: 750rpx;
  box-sizing: border-box;
  padding: 0 24rpx;
  position: relative;
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

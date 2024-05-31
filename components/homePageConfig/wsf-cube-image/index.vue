<template>
  <view
    class="wrap imgCubeBox"
    :key="floor.id"
    :style="{
      background: `url(${listData.bgImage}) no-repeat center`,
      'background-size': '100% 100%',
      'background-color': `${listData.bgColor}`,
    }"
  >
    <view class="imgCube_left">
      <u-swiper
        name='url'
        :circular="true"
        :list="slideshowImageList"
        height="470"
        class="imgCube_swiper"
        @change="getSwiperCurrent"
        @click="clickSwiperCurrent($event, slideshowImageList)"
				:mode="slideshowImageList.length > 1 ? 'round' : 'none'"
      ></u-swiper>
      <!-- 重置小圆点的样式 -->
    <view class="dots" v-if="slideshowImageList && slideshowImageList.length > 1">
      <template v-for="(item, index) in slideshowImageList">
        <view
          :key="index"
          :class="index == currentSwiper ? ' active dot' : 'dot'"
        ></view>
      </template>
    </view>
    </view>
    <view class="imgCube_right">
      <view class="imgCube_right_top">
        <u-image
          width="100%"
          height="230"
          border-radius="10"
          :src="listData.imageRightUp.url || 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/b3f409c482e4d194b3784fcc88997042.png'"
          @click="toRouter(listData.imageRightUp.link,listData.imageRightUp.url,5)"
        ></u-image>
      </view>
      <view class="imgCube_right_down">
        <u-image
          width="100%"
          height="230"
          border-radius="10"
          :src="listData.imageRightDown.url || 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/b3f409c482e4d194b3784fcc88997042.png'"
          @click="toRouter(listData.imageRightDown.link,listData.imageRightDown.url,6)"
        ></u-image>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
      listData: Object,
			isDistribution: {
			  type: Boolean,
			  required: false,
			  default: () => false,
			},
  },
  data() {
    return {
      currentSwiper: 0, // swiper选中的页码
      slideshowImageList: []
    };
  },
  created() {
    this.slideshowImageList = JSON.parse(JSON.stringify(this.listData.slideshowImageList))
    this.slideshowImageList.forEach(item => {
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
      let advert = params[e];
      if (!advert) {
        if(!this.isDistribution){
          let obj = {
            name:"图片魔方",
            type: 8,
            image:params[e].url || '',
            url: '',
            index:e
          }
          this.$store.dispatch("SETTINGS/advertVisitRequest",obj);
        }
        
        return;
      } else {
				let link
				if(this.isDistribution) {
					link = advert.link.split('~')[1]
				} else {
					link = advert.link
				}
        if(!this.isDistribution){
          let obj = {
            name:"图片魔方",
            type: 8,
            image:params[e].url || '',
            url:link,
            index:e
          }
          this.$store.dispatch("SETTINGS/advertVisitRequest",obj);
        }
        
        this.$wsf.go(link);
      }
    },
    // 路由跳转
    toRouter(params,url,index) {
			let link
			if(this.isDistribution) {
				link = params.split('~')[1]
			} else {
				link = params
			}
      let obj = {
          name:"图片魔方",
          type: 8,
          image:url || '',
          url:link || '',
          index
        }
        this.$store.dispatch("SETTINGS/advertVisitRequest",obj);
      this.$wsf.go(link);
    },
  },
};
</script>

<style scoped lang='scss'>
.wrap {
  padding: 0 24rpx;
  margin: 0 auto;
}
.imgCubeBox {
  padding: 20rpx 20rpx 24rpx;
  width: 702rpx;
  height: 514rpx;
  border-radius: 20rpx;
  display: flex;
  .imgCube_left {
    width: 326rpx;
    height: 470rpx;
    margin-right: 10rpx;
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
  .imgCube_right {
    view {
      width: 326rpx;
      height: 230rpx;
    }
    .imgCube_right_top {
      margin-bottom: 10rpx;
    }
  }
}
</style>

<template>
  <view
    v-if="listData.hasBackground == '1'"
    class="wrap"
    :key="floor.id"
    :style="{
      background: `url(${listData.bgImage}) no-repeat center`,
      'background-size': '100% 100%',
      'background-color': `${listData.bgColor ? listData.bgColor : '#fff'}`,
      width: hasBgStyle[0].boxWidth + 'rpx',
      height: hasBgStyle[0].boxHeight + 'rpx',
      borderRadius: '24rpx'
    }"
  >
    <view class="module-title">
      <text v-if="listData.showComTitle == '1'">{{listData.comTitle}}</text>
    </view>
    <view class="imgCubeBox" style="padding: 0 24rpx 24rpx">
      <view class="imgCube_left" 
        :style="{
          width: hasBgStyle[0].swiperWidth + 'rpx',
          height: hasBgStyle[0].swiperHeight + 'rpx',
        }"
      >
        <u-swiper
          name="url"
          :circular="true"
          :list="slideshowImageList"
          :height="hasBgStyle[0].swiperHeight"
          class="imgCube_swiper"
          border-radius="24"
          @change="getSwiperCurrent"
          @click="clickSwiperCurrent($event, slideshowImageList)"
          :mode="slideshowImageList.length > 1 ? 'none' : 'none'"
        ></u-swiper>
        <!-- 重置小圆点的样式 -->
        <view
          class="dots"
          v-if="slideshowImageList && slideshowImageList.length > 1"
        >
          <template v-for="(item, index) in slideshowImageList">
            <view
              :key="index"
              :class="index == currentSwiper ? ' active dot' : 'dot'"
            ></view>
          </template>
        </view>
      </view>
      <view class="imgCube_right">
        <view class="imgCube_right_top" style="margin-bottom: 16rpx">
          <u-image
            :width="hasBgStyle[0].width + 'rpx'"
            :height="hasBgStyle[0].height + 'rpx'"
            border-radius="24"
            :src="
              listData.imageRightUp.url ||
              'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/b3f409c482e4d194b3784fcc88997042.png'
            "
            @click="
              toRouter(listData.imageRightUp.link, listData.imageRightUp.url, 5)
            "
          ></u-image>
        </view>
        <view class="imgCube_right_down">
          <u-image
            :width="hasBgStyle[0].width + 'rpx'"
            :height="hasBgStyle[0].height + 'rpx'"
            border-radius="24"
            :src="
              listData.imageRightDown.url ||
              'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/b3f409c482e4d194b3784fcc88997042.png'
            "
            @click="
              toRouter(
                listData.imageRightDown.link,
                listData.imageRightDown.url,
                6
              )
            "
          ></u-image>
        </view>
      </view>
    </view>
  </view>

  <view v-else class="wrap imgCubeBox" :key="floor.id">
    <view class="imgCube_left" 
      :style="{
        width: noBgStyle[0].swiperWidth + 'rpx',
        height: noBgStyle[0].swiperHeight + 'rpx',
      }">
      <u-swiper
        name="url"
        :circular="true"
        :list="slideshowImageList"
        :height="noBgStyle[0].swiperHeight"
        class="imgCube_swiper"
        border-radius="24"
        @change="getSwiperCurrent"
        @click="clickSwiperCurrent($event, slideshowImageList)"
        :mode="slideshowImageList.length > 1 ? 'none' : 'none'"
      ></u-swiper>
      <!-- 重置小圆点的样式 -->
      <view
        class="dots"
        v-if="slideshowImageList && slideshowImageList.length > 1"
      >
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
          :width="noBgStyle[0].width + 'rpx'"
          :height="noBgStyle[0].height + 'rpx'"
          border-radius="24"
          :src="
            listData.imageRightUp.url ||
            'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/b3f409c482e4d194b3784fcc88997042.png'
          "
          @click="
            toRouter(listData.imageRightUp.link, listData.imageRightUp.url, 5)
          "
        ></u-image>
      </view>
      <view class="imgCube_right_down">
        <u-image
          :width="noBgStyle[0].width + 'rpx'"
          :height="noBgStyle[0].height + 'rpx'"
          border-radius="24"
          :src="
            listData.imageRightDown.url ||
            'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/b3f409c482e4d194b3784fcc88997042.png'
          "
          @click="
            toRouter(
              listData.imageRightDown.link,
              listData.imageRightDown.url,
              6
            )
          "
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
      slideshowImageList: [],
      noBgStyle: [
        {
          swiperWidth: 340,
          swiperHeight: 464,
          width: 340,
          height: 220,
        },
      ],
      hasBgStyle: [
        {
          swiperWidth: 316,
          swiperHeight: 416,
          width: 316,
          height: 200,
          boxWidth: 702,
          boxHeight: 520,
        },
      ],
    };
  },
  created() {
    this.slideshowImageList = JSON.parse(
      JSON.stringify(this.listData.slideshowImageList)
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
    /* 获取当前swiper选中 */
    getSwiperCurrent(e) {
      this.currentSwiper = e;
    },
    /* 点击swiper */
    clickSwiperCurrent(e, params) {
      let advert = params[e];
      if (!advert) {
        if (!this.isDistribution) {
          let obj = {
            name: "图片魔方",
            type: 8,
            image: params[e].url || "",
            url: "",
            index: e,
          };
          this.$store.dispatch("SETTINGS/advertVisitRequest", obj);
        }

        return;
      } else {
        let link;
        if (this.isDistribution) {
          link = advert.link.split("~")[1];
        } else {
          link = advert.link;
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
        if (!this.isDistribution) {
          let obj = {
            name: "图片魔方",
            type: 8,
            image: params[e].url || "",
            url: link,
            index: e,
          };
          this.$store.dispatch("SETTINGS/advertVisitRequest", obj);
        }

        this.$wsf.go(link);
      }
    },
    // 路由跳转
    toRouter(params, url, index) {
      let link;
      if (this.isDistribution) {
        link = params.split("~")[1];
      } else {
        link = params;
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
      let obj = {
        name: "图片魔方",
        type: 8,
        image: url || "",
        url: link || "",
        index,
      };
      this.$store.dispatch("SETTINGS/advertVisitRequest", obj);
      this.$wsf.go(link);
    },
  },
};
</script>

<style scoped lang='scss'>
.wrap {
  margin: 0 24rpx;
}
.module-title {
  height: 80rpx;
  padding: 24rpx 24rpx 16rpx;
  color: #222;
  font-size: 30rpx;
  line-height: 40rpx;
  font-weight: bold;
}
.imgCubeBox {
  display: flex;
  .imgCube_left {
    width: 340rpx;
    height: 464rpx;
    margin-right: 22rpx;
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
    .imgCube_right_top {
      margin-bottom: 24rpx;
    }
  }
}
</style>

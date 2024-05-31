<template>
  <view>
    <view class="bannerBox">
      <swiper
        class="swiper"
        :interval="3000"
        :circular="true"
        :autoplay="false"
        :current="swiperCurrent"
        :indicator-dots="false"
        @change="bannerChange"
      >
        <swiper-item
          class="swiper-items"
          v-for="(item, index) in carouselPics"
          :key="index"
        >
          <video
            style="width: 100%; height: 100%"
            :poster="item.img"
            :src="spu.spuVideo"
            :show-center-play-btn="true"
            :show-loading="false"
            object-fit="fill"
            :controls="controlsShow"
            :seeked="true"
            class="bannerVideo"
            v-if="bannerCurrent == 0 && spu.spuVideo"
            @play="play()"
          ></video>
          <image
            :src="item.img"
            mode="aspectFill"
            class="swiper-img"
            @tap="previewImg(index)"
          ></image>
        </swiper-item>
      </swiper>
      <view class="currentBox" v-if="carouselPics && carouselPics.length > 0">
        {{ bannerCurrent + 1 }}/{{ carouselPics.length }}
      </view>
    </view>
    <view class="property-swiper" v-if="skuImgList && skuImgList.length >= 2">
      <view class="num-property">
        <p>
          <span>{{ skuImgList.length }}</span
          >种
        </p>
        <p>可选</p>
      </view>
      <view class="property">
        <scroll-view
          class="scroll-view_H"
          scroll-x="true"
          scroll-left="0"
          scroll-with-animation
          :scroll-into-view="scrollFCateId"
        >
          <view class="flex-swiper">
            <img
              v-for="(item, index) in skuImgList"
              :class="[sku.skuId === item.skuId ? 'activity' : '']"
              :key="item.skuId"
              :src="item.url"
              alt=""
              @click="pitchOnFun(item, index)"
              :id="'fCate' + item.skuId"
            />
          </view>
        </scroll-view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      bannerCurrent: 0,
      controlsShow: false,
      swiperCurrent: 0,
      imgList: [],
    };
  },
  computed: {
    scrollFCateId() {
      return "fCate" + this.sku.skuId;
    },
  },
  props: {
    spu: {
      type: Object,
      default: () => {},
    },
    sku: {
      type: Object,
      default: () => {},
    },
    // 轮播图
    carouselPics: {
      type: Array,
      default: () => [],
    },
    // 下面可选sku图
    skuImgList: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    pitchOnFun(item) {
      this.$emit("updateSku", item.skuId);
    },
    previewImg(index) {
      uni.previewImage({
        current: index,
        urls: this.carouselPics,
        indicator: "default",
      });
    },
    // 轮播切换
    bannerChange(data) {
      this.bannerCurrent = data.target.current;
      this.swiperCurrent = data.target.current;
    },
    play() {
      this.controlsShow = true;
    },
  },
};
</script>
<style lang="scss" scoped>
.bannerBox {
  position: relative;
  .swiper-items {
    border-radius: 0rpx 0rpx 24rpx 24rpx;
  }
  .swiper {
    width: 100%;
    height: 750rpx;
  }
  .swiper-img {
    width: 100%;
    height: 100%;
  }
  .currentBox {
    position: absolute;
    right: 32rpx;
    bottom: 32rpx;
    color: #fff;
    height: 40rpx;
    display: inline-flex;
    align-items: center;
    padding: 0 16rpx;
    border-radius: 24rpx;
    background: rgba(0, 0, 0, 0.8);
    font-size: 24rpx;
  }
  .bannerVideo {
    position: absolute;
    width: 100%;
    height: 375px;
    z-index: 1;
  }
  .iconPlay {
    position: absolute;
    width: 2.4rem;
    height: 2.4rem;
    z-index: 2;
    top: 50%;
    left: 50%;
    margin-left: -1.2rem;
    margin-top: -1.2rem;
  }
}
.property-swiper {
  background: #ffffff;
  border-radius: 0rpx 0rpx 32rpx 32rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24rpx;
  padding-top: 8rpx;
  padding-bottom: 16rpx;
  .num-property {
    width: 96rpx;
    height: 88rpx;
    border-radius: 16rpx;
    display: flex;
    flex-shrink: 0;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: rgba(229, 229, 229, 0.22);
    p {
      font-size: 22rpx;
      color: #c3c3c3;
      span {
        font-family: Arial-BoldMT, Arial;
        font-weight: bold;
      }
    }
  }
  .property {
    width: 590rpx;
  }
  .scroll-view_H {
    white-space: nowrap;
    width: 100%;
  }
  .flex-swiper {
    display: flex;
    img {
      flex-shrink: 0;
      width: 88rpx;
      height: 88rpx;
      display: block;
      margin-right: 16rpx;
      background: #f6f6f6;
      border-radius: 16rpx;
      border: 2rpx solid #eeeeee;
      object-fit: cover;
    }
    .activity {
      border: 2rpx solid #ff0a35;
    }
    .disable {
      background-color: #f2f2f2;
      border: 1px solid #f2f2f2;
      color: #bababa;
    }
  }
}
</style>

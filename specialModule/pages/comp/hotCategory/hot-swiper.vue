<template>
  <view class="hot-swiper">
		<swiper
				style="height: 538rpx;"
        :autoplay="true"
        :circular="true"
        :current="item.currentSwiper"
        @change="(val) => {getSwiperCurrent(val, index)}"
      >
        <swiper-item v-for="(n,i) in item.hotAdvertSet.imgList" :key='i'>
          <image :key="i" style="height: 538rpx;width: 100%; border-radius: 16rpx" :src="n.imgUrl" @click="clickSwiperCurrent(n)" />
        </swiper-item>
    </swiper>
	  <view class="dots" v-if="item.hotAdvertSet.imgList && item.hotAdvertSet.imgList.length > 1">
	      <view
          v-for="(n, i) in item.hotAdvertSet.imgList"
	        :key="i"
	        :class="i == item.currentSwiper ? ' active dot' : 'dot'"
	      ></view>
	  </view>
	</view>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      currentSwiper: 0
    }
  },
  methods: {
    /* 获取当前swiper选中 */
    getSwiperCurrent(e, index) {
			let {current, source} = e.detail
      if(source === 'autoplay' || source === 'touch') {
        this.currentSwiper = current
      }
    },
		/* 点击swiper */
    clickSwiperCurrent(item) {
      this.$emit("clickSwiperCurrent", item)
    },
  }
}
</script>

<style scoped lang="scss">
.hot-swiper {
	width: 344rpx;
	height: 538rpx;
	border-radius: 16rpx;
	margin-bottom: 20rpx;
	position: relative;
  /*用来包裹所有的小圆点 */
  .dots {
    height: 14rpx;
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
    width: 14rpx;
    height: 14rpx;
    border-radius: 50%;
    margin-right: 16rpx;
    background: rgba(255,255,255,0.5);
  }
  /*选中以后的小圆点样式 */
  .active {
    width: 14rpx;
    height: 14rpx;
    border-radius: 50%;
    background: #fff;
  }
}
</style>

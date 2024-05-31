<template>
  <view
    class="wrap noticeBoxWrapper"
    @click="toRouter(listData.link)"
  >
    <image class="noticeImg" v-if="listData.iconUrl" :src="listData.iconUrl"></image>
    <image class="noticeImg" v-else :src="noticeIcon"></image>
    <view
      class="positionBox"
      v-if="listData.bgImage"
      :style="{
        background: `url(${listData.bgImage}) no-repeat center `,
        'background-size': '100% 100%',
      }"
    ></view>
    <u-notice-bar
      :speed="80"
      class="noticeBox"
      :volume-icon="false"
      type="none"
      border-radius="16"
      padding="16rpx 66rpx 16rpx 56rpx"
      font-size="24"
      :color="listData.textareaColor"
      :bg-color="listData.bgColor"
      :list="listData.textarea.split(',')"
    ></u-notice-bar>
    <image
      v-if="listData.linkImage && listData.link"
      class="arrow-icon"
      :src="listData.linkImage"
      mode=""
    ></image>
     <image
      v-else-if="!listData.linkImage && listData.link"
      class="arrow-icon"
      :src="arrowIcon"
      mode=""
    ></image>
  </view>
</template>

<script>
export default {
  props: {
		isDistribution: {
		  type: Boolean,
		  required: false,
		  default: () => false,
		},
     listData: {
        type: Object,
        required:true
     }
  },
  data() {
    return {
      arrowIcon: this.$oss + 'wsf-mall/home/arrow_red.png',
      noticeIcon: this.$oss + 'wsf-mall/home/ic_notice.png',
    }
  },
  methods: {
    // 路由跳转
    toRouter(params) {
			let link
			if(this.isDistribution) {
				link = params.split('~')[1]
			} else {
				link = params
			}
      this.$wsf.go(link);
    },
  },
};
</script>

<style scoped lang="scss">
.noticeBox {
  /deep/ .u-notice-box {
    margin: 0 !important;
  }
}
.wrap {
  padding: 0 24rpx;
  margin: 0 auto;
}
.noticeBoxWrapper {
  position: relative;
  .noticeImg {
    position: absolute;
    left: 24rpx;
    top: 0;
    width: 60rpx;
    height: 60rpx;
    z-index: 1;
  }
  .positionBox {
    width: 702rpx;
    height: 100%;
    position: absolute;
    top: 0;
    left: 24rpx;
    border-radius: 16rpx;
  }
  .arrow-icon {
    position: absolute;
    right: 40rpx;
    top: 50%;
    transform: translateY(-50%);
    width: 32rpx;
    height: 32rpx;
    z-index: 1;
  }
}
</style>

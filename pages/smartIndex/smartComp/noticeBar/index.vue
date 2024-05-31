<template>
  <view class="wrap notice-box-wrapper" @click="toRouter(config)">
    <image
      class="notice-img"
      v-if="config.iconUrl"
      :src="config.iconUrl"
    ></image>
    <image class="notice-img" v-else :src="noticeIcon"></image>
    <view
      class="position-box"
      v-if="config.bgImage"
      :style="[positionBox]"
    ></view>
    <u-notice-bar
      :speed="80"
      class="notice-box"
      :volume-icon="false"
      type="none"
      border-radius="16"
      padding="18rpx 66rpx 18rpx 68rpx"
      font-size="24"
      :color="config.color"
      :bg-color="config.bgColor"
      :list="config.textarea.split(',')"
    ></u-notice-bar>
    <image
      v-if="config.linkImage"
      class="arrow-icon"
      :src="config.linkImage"
      mode=""
    ></image>
    <image
      v-else-if="!config.linkImage"
      class="arrow-icon"
      :src="arrowIcon"
      mode=""
    ></image>
  </view>
</template>

<script>

// 公告组件
export default {
  name: 'noticeBar',
  props: {
    isDistribution: {
      type: Boolean,
      required: false,
      default: () => false,
    },
    config: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      arrowIcon: this.$oss + 'wsf-mall/home/arrow_red.png',
      noticeIcon: this.$oss + 'wsf-mall/home/ic_notice.png',
    };
  },
  computed: {
    // 背景
    positionBox() {
      return {
        background: `url(${this.config.bgImage}) no-repeat center `,
        backgroundSize: '100% 100%'
      }
    }
  },
  methods: {
    // 路由跳转
    toRouter(params) {    
      this.$smart.go(params.miniAppLink || params.h5Link);    
    },
  },
};
</script>

<style scoped lang="scss">

/deep/ .u-notice-box {
  margin: 0 !important;
}
.wrap {
  padding: 0 16rpx;
  margin: 0 auto;
}
.notice-box-wrapper {
  position: relative;
  .notice-img {
    position: absolute;
    left: 16rpx;
    top: 50%;
    transform: translateY(-50%);
    width: 60rpx;
    height: 60rpx;
    z-index: 1;
  }
  .position-box {
    width: calc(100% - 32rpx);
    height: 100%;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: 16rpx;
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

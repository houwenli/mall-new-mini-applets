<template>
  <view class="back-top" :style="[getPageStyle]">
    <view class="topback" :style="{ height: iStatusBarHeight + 'px' }"></view>
    <view class="box-top" :style="{ height: boxTopHeight + 'px' }">
      <view class="icon-left" @click="goBack">
        <img v-if="paramsCode === 106" src="https://wsjc-web.wsecar.com/wsf-mall/skuDetail/icon-left.png" alt="" />
        <img v-else-if="paramsCode === 107" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/distribution/arrow-back-white-2x.png" />
        
      </view>
      <view class="title">
        {{ pageTitle || '' }}
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    iStatusBarHeight: {
      type: Number,
      default: 0
    },
    boxTopHeight: {
      type: Number,
      default: 0
    },

    pageTitle: {
      type: [String, Object],
      default: '更多好物，等你挑选'
    },

    config: {
      type: Object,
      default: () => {
        return {}
      }
    },

    paramsCode: {
      type: Number,
      default: null
    }
  },

  computed: {
    getPageStyle({ config, paramsCode }) {
      if (paramsCode === 107) {
        return { background: 'rgba(0,0,0,0.1)', 'backdrop-filter': 'blur(10px)'}
      }
      let { headerData } = config,
        { headerBg } = headerData,
        { backgroundType, bgImage = '', bgColor } = headerBg

      if (String(backgroundType) === '1') {
        // 默认为图片， 但是没传背景图的话，就设置为白色
        if (bgImage === '') {
          return { background: '#fff' }
        }

        return {
          backgroundImage: `url(${bgImage})`,
        }
      }

      if (String(backgroundType) === '0') {
        return {
          background: bgColor,
        }
      }

      return {}
    },
  },

  methods: {
    goBack() {
      // 分享进来返回商城首页
      if (this.enterType === "share") {
        this.$wsf.go("Index");
      }
      //   返回上一个小程序
      if (getCurrentPages().length === 1) {
        uni.navigateBackMiniProgram();
      } else {
        uni.navigateBack({
          delta: 1,
        });
      }
    }
  },
}
</script>
<style lang="less" scoped>
.back-top {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 101;
  display: flex;
  flex-wrap: wrap;
  width: 100%;

  .topback {
    // background: #ffffff;
    width: 100%;
  }

  .box-top {
    display: flex;
    align-items: center;
    width: 100%;
    height: 88rpx;
    // background-color: #fff;
  }

  .title {
    margin-right: 64rpx;
    flex-grow: 1;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1;
    font-size: 36rpx;
    color: #000;
  }

  .icon-left {
    margin-left: 24rpx;

    img {
      width: 40rpx;
      height: 40rpx;
    }
  }

  .more {
    margin-left: 16rpx;
  }

  .search {
    width: 346rpx;
    height: 64rpx;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 37rpx;
    border: 1rpx solid rgba(151, 151, 151, 0.2);
    display: flex;
    flex-shrink: 0;
    align-items: center;
    margin-left: 24rpx;

    img {
      width: 32rpx;
      height: 32rpx;
      padding-left: 16rpx;
    }

    span {
      font-size: 28rpx;
      padding-left: 16rpx;
      color: #999999;
    }
  }
}

.indicator_ {
  width: 232rpx;
  box-shadow: 0rpx -6rpx 20rpx 0rpx rgba(189, 194, 204, 0.04),
    0rpx -4rpx 16rpx 0rpx rgba(189, 194, 204, 0.08),
    0rpx -2rpx 12rpx 0rpx rgba(189, 194, 204, 0.06);
  background: #ffffff;
  border-radius: 16rpx;
  padding: 8rpx 24rpx;
  top: 45px;
  left: 50%;
  transform: translate(-50%, 0%);
  position: absolute;

  .img_ {
    position: absolute;
    width: 32rpx;
    height: 16rpx;
    top: -23rpx;
    left: 41%;

    img {
      width: 100%;
      height: 100%;
    }
  }

  .listTime {
    height: 80rpx;
    display: flex;
    align-items: center;

    img {
      width: 40rpx;
      height: 40rpx;
    }

    span {
      font-size: 26rpx;
      color: #444444;
      padding-left: 24rpx;
    }
  }
}</style>

<template>
  <view class="page-loading">
    <view class="loading-area">
      <image class="loading-img" :src="ossUrl + 'wsf-mall/home/loading.gif'" />
      <view class="loading-text">加载中…</view>
    </view>
  </view>
</template>

<script>
// 障眼法-搞一个蒙层，在最外面-让后让背部的内容，不要滚动就可以，接口响应完成，就隐藏掉
// 分类广告的loading-仅限于这个场景
export default {
  name: 'page-loading',

  data() {
    return {
      ossUrl: this.$oss,
    };
  },
  mounted() {
    
  },
  methods: {
  },
};
</script>

<style lang="scss" scoped>
.page-loading {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  padding-bottom: 100rpx;
  overflow: hidden;

  .loading-area {
    border-radius: 32rpx 32rpx 0 0;
    background-color: #f5f5f5;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-items: center;
    overflow: hidden;
  }

  .loading-img {
    width: 160rpx;
    height: 80rpx;
  }

  .loading-text {
    font-size: 20rpx;
    color: #90969e;
    line-height: 28rpx;
    color: #90969e;
    margin-top: 8rpx;
  }
}
</style>

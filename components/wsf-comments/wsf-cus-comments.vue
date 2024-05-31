<template>
  <view
    class="custom-comment"
    v-if="commentData.length > 0"
    :style="paddingStyle || defaultPaddingStyle"
  >
    <view class="comment-region">
      <view v-for="(item, idx) in commentData" :key="idx" class="comment-item">
        <view style="margin-bottom: 0.2rem" class="title">商家回复：</view>
        <span style="color: #666666" class="conent">{{ item.reply }}</span>
      </view>
    </view>
  </view>
</template>
<script>
export default {
  name: "custom-comment",
  props: {
    commentData: {
      type: Array,
      default: () => [],
    },
    paddingStyle: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      // 图片列 默认宽高
      defaultPaddingStyle: {
        padding: "0 0.72rem 0.48rem",
        fontSize: "0.52rem",
      },
    };
  },
};
</script>
<style lang="scss" scoped>
.custom-comment {
  padding: 0 36rpx 24rpx;
  // font-size: 13px;
  line-height: 44rpx;
  .comment-region {
    background-color: #f5f5f5;
    padding: 8rpx 20rpx;
    word-break: break-all;
    border-radius: 20rpx;
    // line-height: 40rpx;
    .comment-item {
      padding: 16rpx 0;
      .title {
        margin-bottom: 10rpx;
      }
      .conent {
        color: #666666;
      }
    }
  }
}
</style>

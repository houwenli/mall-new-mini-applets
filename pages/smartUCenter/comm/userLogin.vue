<template>
  <view class="userlogin flex">
    <!-- 左边 -->
    <view class="userlogin-left flex">
      <!-- 头像 -->
      <image
        :src="isUserImg"
        class="userlogin-left__icon"
        @click="navigationTo()"
      />
      <!-- 登录 -->
      <view v-if="isLink" class="userlogin-left--log flex">
        <text class="userlogin-left-name">{{ data.nickname }}</text>
      </view>
      <!-- 未登录 -->
      <view v-else class="userlogin-left--notLog flex" @click="navigationTo()">
        <image :src="`${smartImg}/me/logon-icon.png`" />
        <text>点击登录</text>
      </view>
    </view>
    <!-- 右边 -->
    <view class="userlogin-right">
      <!-- 设置 -->
      <image
        class="userlogin-right__img"
        :src="`${mallImg}/usercenter/ic_set_up2.png`"
        @click="navigationTo('smartSetUp')"
      />
    </view>
  </view>
</template>

<script>
export default {
  props: {
    // 用户信息
    data: {
      type: Object,
      default: {
        headUrl: "", //用户头像
        nickname: "", //昵称
      },
    },
    // 是否登录 0：未登录 1：已登录
    isLink: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    isUserImg() {
      return this.isLink == 1
        ? this.data.headUrl
        : `${this.$smartImg}/me/user-not-logon.png`;
    },
  },
  data() {
    return {
      smartImg: this.$smartImg,
      mallImg: this.$mallImg,
    };
  },
  methods: {
    // 跳转页面
    navigationTo(sceneName) {
      this.$emit("navigationTo", sceneName);
    },
  },
};
</script>

<style lang="scss" scoped>
.flex {
  display: flex;
  align-items: center;
}
/* 头部用户登录 */
.userlogin {
  justify-content: space-between;
  margin-top: 8rpx;
  padding: 0 32rpx 0 8rpx;
  &-left {
    &__icon {
      width: 80rpx;
      height: 80rpx;
      border-radius:50%;
    }
    &--log {
      margin-left: 8rpx;
    }
    &--name {
      font-size: 32rpx;
      font-weight: 600;
      color: #111111;
      line-height: 40rpx;
    }
  }
  &-left--notLog {
    margin-left: 12rpx;
    padding: 0 8rpx;
    height: 48rpx;
    background: #e7e5e2;
    border-radius: 24rpx;
    image {
      margin-right: 8rpx;
      width: 24rpx;
      height: 26rpx;
    }
    text {
      font-size: 22rpx;
      font-weight: 400;
      color: #191919;
      line-height: 32rpx;
    }
  }
  &-right {
    &__img {
      width: 40rpx;
      height: 40rpx;
    }
  }
}
</style>

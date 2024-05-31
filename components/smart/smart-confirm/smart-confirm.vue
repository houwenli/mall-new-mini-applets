<template>
  <view class="smartconfirm">
    <u-popup
      v-model="show"
      mode="center"
      border-radius="32"
      width="640"
      :mask-close-able="false"
      :closeable="false"
      :custom-style="{ padding: '64rpx 48rpx 0' }"
    >
      <view class="smartconfirm--title flex" v-if="title != ''">
        {{ title }}
      </view>
      <!-- 插槽 -->
      <slot />
      <view class="smartconfirm__content flex" v-if="contentText != ''">
        {{ contentText }}
      </view>
      <view
        class="smartconfirm__btn flex"
        :class="{ 'smartconfirm__btn--dir': isDirection }"
      >
        <!-- 第一个按钮插槽 -->
        <slot name="firstBtn" />
        <text
          class="smartconfirm__btn--cancel"
          v-if="cancelText != ''"
          @click="cancel"
        >
          {{ cancelText }}
        </text>
        <text
          class="smartconfirm__btn--confirm"
          v-if="confirmText != ''"
          @click="confirm"
        >
          {{ confirmText }}
        </text>
        <!-- 最后一个按钮插槽 -->
        <slot name="lastBtn" />
      </view>
    </u-popup>
  </view>
</template>

<script>
export default {
  props: {
    //是否显示
    show: {
      type: Boolean,
      default: false,
    },
    // 标题
    title: {
      type: String,
      default: "",
    },
    //内容文本
    contentText: {
      type: String,
      default: "",
    },
    //取消文本
    cancelText: {
      type: String,
      default: "",
    },
    //确认文本
    confirmText: {
      type: String,
      default: "",
    },
    //按钮是否纵向排列
    isDirection: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {};
  },
  methods: {
    cancel() {
      this.$emit("cancel");
    },
    confirm() {
      this.$emit("confirm");
    },
  },
};
</script>

<style scoped lang="scss">
.flex {
  display: flex;
  align-items: center;
  justify-content: center;
}
/deep/ .u-drawer__scroll-view {
  padding: 64rpx 48rpx 0;
}
.smartconfirm {
  font-family: PingFangSC-Regular, PingFang SC;
  &--title {
    padding: 64rpx 48rpx 0;
    font-size: 36rpx;
    font-weight: 600;
    color: #191919;
    line-height: 44rpx;
  }
  &__content {
    margin-top: 32rpx;
    padding: 0 48rpx;
    font-size: 30rpx;
    font-weight: 400;
    color: #999999;
    line-height: 38rpx;
  }
  &__btn {
    margin-top: 64rpx;
    border-top: 2rpx solid rgba(0, 0, 0, 0.1);
    &--cancel,
    &--confirm {
      text-align: center;
      height: 110rpx;
      font-size: 34rpx;
      font-weight: 600;
      line-height: 110rpx;
      color: #191919;
    }
    &--confirm {
      color: #0a75d9;
    }
    text {
      flex: 1;
      border-right: 2rpx solid rgba(0, 0, 0, 0.1);
    }
    text:last-child {
      border-right: none;
    }
  }
  &__btn--dir {
    flex-direction: column;
    text {
      width: 100%;
      border-right: none;
      border-bottom: 2rpx solid rgba(0, 0, 0, 0.1);
    }
    text:last-child {
      border-bottom: none;
    }
  }
}
</style>

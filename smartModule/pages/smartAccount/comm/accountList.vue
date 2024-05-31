<template>
  <scroll-view class="accounttype-list" scroll-y v-if="list && list.length">
    <view class="accounttype-item" v-for="(item, key) in list" :key="key">
      <!-- 账户类型图标 -->
      <view class="accounttype-item--mark">
        {{ typsMap[item.bizLine] }}账户
      </view>
      <view class="accounttype-item__top">
        <view class="tip">账户余额</view>
        <view class="flex--between">
          <view class="balance"
            ><text class="balance--unit">￥</text
            ><text class="balance--int">{{ item._perInt }}</text
            ><text class="balance--dec">.{{ item._perDec }}</text>
          </view>
          <view class="cashout flex">
            <text
              class="flex"
              @click="toWithdrawal(item.personalAgencySettledAmount)"
            >
              提现
            </text>
          </view>
        </view>
        <view class="flex--between">
          <view class="detail flex" @click="toIndex('smartBalance')"
            ><text>余额明细</text
            ><image :src="`${smartImg}/account/account-next.png`" />
          </view>
          <text class="sum">
            今日可提现{{ item.todayLeftWithdrawCount || 0 }}次
          </text>
        </view>
      </view>
      <view class="accounttype-item__bottom">
        <view class="tobesettled flex">
          <text class="tobesettled--name">待结算余额</text>
          <text class="tobesettled--money">
            <text>￥</text>{{ item._perUn }}
          </text>
        </view>
      </view>
    </view>
    <view class="accounttype-item--tail"></view>
  </scroll-view>
</template>

<script>
export default {
  props: {
    list: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {
      smartImg: this.$smartImg,
      //后续需要多种业务线,目前只有电商一类
      typsMap: {
        SMART_LIFE: "",
        WSF_MALL: "电商",
        MOBILE_RECHARGE: "",
      },
    };
  },
  methods: {
    // 提现
    toWithdrawal(item) {
      this.$emit("toWithdrawal", item);
    },
    // 跳转页面
    toIndex(name) {
      this.$emit("toIndex", name);
    },
  },
};
</script>

<style scoped lang="scss">
.flex,
.flex--between {
  display: flex;
  align-items: center;
}
.flex--between {
  justify-content: space-between;
}
.accounttype-list {
  height: calc(100vh - 436rpx);
  box-sizing: border-box;
}
.accounttype-item {
  position: relative;
  width: 100%;
  background: #ffffff;
  border-radius: 24rpx;
  overflow: hidden;
  margin-bottom: 32rpx;
  padding: 2rpx;
  &:last-child {
    margin-bottom: 0;
  }
  &--mark {
    position: absolute;
    top: 0;
    left: 0;
    width: 128rpx;
    height: 42rpx;
    line-height: 42rpx;
    background: linear-gradient(to right, #fce1d8, #fff);
    font-size: 22rpx;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    text-align: center;
    color: #ff0a35;
  }
  &__top {
    justify-content: space-between;
    padding: 62rpx 48rpx 54rpx 0;
  }
  .tip,
  .detail text {
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #999999;
    line-height: 30rpx;
  }
  .tip {
    margin-left: 60rpx;
    font-size: 22rpx;
  }
  .balance {
    margin-left: 54rpx;
    display: inline-block;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: bold;
    color: #ff0a35;
    &--unit,
    &--dec {
      display: inline-block;
      font-size: 32rpx;
      font-family: DINAlternate-Bold, DINAlternate;
      line-height: 40rpx;
    }
    &--int {
      display: inline-block;
      font-size: 60rpx;
      font-family: DINAlternate-Bold, DINAlternate;
      line-height: 68rpx;
    }
  }
  .detail {
    margin: 4rpx 0 0 60rpx;
    text {
      font-size: 22rpx;
      line-height: 34rpx;
    }
    image {
      width: 32rpx;
      height: 34rpx;
    }
  }
  .sum {
    display: inline-block;
    margin-top: 4rpx;
    width: 150rpx;
    text-align: center;
    color: #c3c3c3;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    font-size: 20rpx;
    line-height: 28rpx;
  }
  .cashout {
    justify-content: center;
    width: 150rpx;
    text {
      justify-content: center;
      width: 126rpx;
      height: 64rpx;
      background: #ffbe0c;
      border-radius: 37rpx;
      font-size: 26rpx;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #191919;
      line-height: 36rpx;
    }
  }
  &__bottom {
    margin: 0 2rpx;
    height: 68rpx;
    font-size: 24rpx;
    color: #6e6e6e;
    border-radius: 0rpx 0rpx 22rpx 22rpx;
    background: linear-gradient(180deg, #ffffff 0%, #f4f4f4 100%);
  }
  .tobesettled {
    justify-content: space-between;
    height: 100%;
    margin: 0 22rpx;
    padding: 0 24rpx 0 38rpx;
    border-top: 1px solid #eeee;
    &--name {
      font-size: 24rpx;
    }
    &--money {
      width: 150rpx;
      text-align: center;
      font-size: 28rpx;
      font-weight: 600;
      color: #191919;
      line-height: 32rpx;
    }
  }
}
.accounttype-item--tail {
  width: 100%;
  height: 16rpx;
  height: calc(constant(safe-area-inset-bottom) + 16rpx); /* 兼容 iOS < 11.2 */
  height: calc(env(safe-area-inset-bottom) + 16rpx); /* 兼容 iOS >= 11.2 */
}
</style>

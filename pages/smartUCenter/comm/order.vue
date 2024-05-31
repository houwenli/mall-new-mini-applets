<template>
  <view class="order">
    <!-- 标题 -->
    <view class="order__title title flex">
      <text>我的订单</text>
      <view
        class="order__title--whole flex"
        @click="navigationTo('smartOrder', { status: -1 })"
      >
        全部
        <image
          :src="`${smartImg}/me/pro-order-next.png`"
          class="order__title--next"
        />
      </view>
    </view>
    <!-- 内容 -->
    <view class="order__inner flex">
      <view
        class="order__inner--every flex"
        v-for="(item, idx) in modulesList"
        :key="idx"
        @click="navigationTo(item.sceneName, { status: item.status })"
      >
        <view class="order__inner--icon">
          <!-- 模块图标 -->
          <image :src="item.img" />
          <!-- 数量角标 -->
          <u-badge
            class="badge"
            color=" #FFFFFF"
            :is-center="true"
            :style="[`background: url('${setBadge(data[item.status])}')`]"
            :count="item.status ? setCount(data[item.status], 99) : 0"
          >
          </u-badge>
        </view>
        <!-- 模块名称 -->
        <text>{{ item.text }}</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    // 订单数量数据
    data: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      smartImg: this.$smartImg,
      // 订单模块组件按钮集
      modulesList: [
        {
          text: "待付款", //模块名称
          status: 10, //状态值
          sceneName: "smartOrder", // 跳转页面
          img: `${this.$smartImg}/me/2023-09-25/ic_payment.png`, //模块图标
        },
        {
          text: "待收货",
          status: 20,
          sceneName: "smartOrder",
          img: `${this.$smartImg}/me/2023-09-25/ic_receipt.png`,
        },
        {
          text: "待使用",
          status: 30,
          sceneName: "smartOrder",
          img: `${this.$smartImg}/me/2023-09-25/ic_use.png`,
        },
        {
          text: "待评价",
          status: 40,
          sceneName: "smartOrder",
          img: `${this.$smartImg}/me/2023-09-25/ic_evaluate.png`,
        },
        {
          text: "退款/售后",
          status: 80,
          sceneName: "smartOrder",
          img: `${this.$smartImg}/me/2023-09-25/ic_refund.png`,
        },
      ],
      // 角标图片集
      badgeImgs: {
        badge1: `${this.$mallImg}/usercenter/ic_badge1.png`, //1-9
        badge2: `${this.$mallImg}/usercenter/ic_badge2.png`, //10-99
        badge3: `${this.$mallImg}/usercenter/ic_badge3.png`, //99~
      },
    };
  },
  options: {
    // 解除样式隔离
    styleIsolation: "shared",
  },
  methods: {
    // 页面跳转
    navigationTo(sceneName, params) {
      this.$emit("navigationTo", sceneName, params);
    },
    //设置角标
    setBadge(val) {
      let tag = "";
      switch (val) {
        case 0 < val < 10:
          tag = "badge1";
          break;
        case 10 <= val < 100:
          tag = "badge2";
          break;
        default:
          tag = "badge3";
          break;
      }
      return this.badgeImgs[tag];
    },
    // 总量显示规则
    setCount(val, max) {
      if (!val || isNaN(val * 1)) return 0;
      return val * 1 > max ? max + "+" : val;
    },
  },
};
</script>

<style lang="scss" scoped>
.flex {
  display: flex;
  align-items: center;
}
/* 我的订单模块 */
.order {
  margin-top: 16rpx;
  padding-bottom: 12rpx;
  background-image: url("https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/ws-smart-life/me/order-bg.png");
  background-size: 100% 100%;
  border-radius: 24rpx;
  overflow: hidden;
  &__title {
    padding: 20rpx 16rpx 0 24rpx;
    justify-content: space-between;
    font-size: 30rpx;
    font-weight: 600;
    color: #222222;
    line-height: 40rpx;
    &--whole {
      line-height: 34rpx;
      font-size: 26rpx;
      font-weight: 400;
      color: #111111;
    }
    &--next {
      width: 32rpx;
      height: 32rpx;
    }
  }
  &__inner {
    margin-top: 28rpx;
    &--icon {
      position: relative;
    }
  }
  &__inner--every {
    width: 20%;
    flex-direction: column;
    image {
      width: 48rpx;
      height: 48rpx;
    }
    text {
      margin-top: 12rpx;
      font-size: 22rpx;
      font-weight: 400;
      color: #444444;
      line-height: 30rpx;
    }
  }
}
/* badge样式覆盖 */
.badge {
  /deep/ .u-badge {
    // border-radius: 13rpx;
    height: 28rpx;
    width: auto;
    padding: 0 10rpx;
    line-height: 26rpx;
    font-size: 22rpx !important;
    top: 6rpx !important;
  }
  /deep/ .u-badge--bg--error {
    background-color: none;
    background-size: 100% 100%;
  }
}
</style>

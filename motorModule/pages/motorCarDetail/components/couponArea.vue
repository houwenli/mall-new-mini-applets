<template>
  <view class="coupon-area">
    <!-- <template v-for="(item, index) in settlement.storeSettlements"> -->
    <u-cell-group :border="false">
      <u-cell-item
        title="优惠券"
        :border-bottom="false"
        :arrow="true"
        arrow-direction="right"
        @click="openCouponModule"
      >
        <span v-if="skuData.couponLabelList && skuData.couponLabelList.length == 0 || !calcCounbon"
          >暂无优惠券可用</span
        >
        <view v-else class="calc-counbon">
          -¥{{calcCounbon}}
        </view>
        <!-- <view v-for="(item, index) in selectCouponItem" :key="index" v-else>
          <view class="time-tab" v-if="item.couponsType == 1"
            >满{{ item.amountLimitation }}减¥{{ item.faceValue }}</view
          >
          <view class="time-tab" v-else-if="item.couponsType == 2"
            >{{ item.faceValue ? item.faceValue : 0 }}折</view
          >
          <view class="time-tab" v-else-if="item.faceValue"
            >立减¥{{ item.faceValue }}</view
          >
        </view> -->

        <!-- <span style="color: #e60113" v-if="skuData.userCouponDiscount > 0"
          >-￥{{ skuData.userCouponDiscount }}</span
        >
        <span
          style="color: #000"
          v-else-if="
            !skuData.couponLabelList || skuData.couponLabelList.length < 1
          "
          >{{ skuData.couponLabelList.length }}张可用</span
        >
        <span v-else-if="skuData.couponLabelList.length == 0"
          >暂无优惠券可用</span
        > -->
      </u-cell-item>
      <u-cell-item
        title="订单备注"
        :border-bottom="false"
        :arrow="true"
        arrow-direction="right"
        @click="openRemarkt"
        class="remark-css"
      >
        <span v-if="sendRemark">{{ sendRemark }}</span>
        <span v-else>{{ "无备注" }}</span>
      </u-cell-item>
    </u-cell-group>

    <u-cell-item
      title="发票"
      :border-bottom="false"
      :arrow="true"
      arrow-direction="right"
      @click="openPopup"
    >
      <span>{{
        invoiceType <= 0
          ? "不开发票"
          : invoiceType >= 2
          ? "增值税专用发票"
          : "电子普通发票"
      }}</span>
    </u-cell-item>
    <!-- </template> -->
  </view>
</template>

<script>
export default {
  components: {},
  props: {
    skuData: {
      type: Object,
      default() {
        return {};
      },
    },
    selectCouponItem: {
      type: Array,
      default() {
        return [];
      },
    },
    sendRemark: {
      type: String,
      default: "",
    },
    invoiceType: {
      type: Number,
      default: 0,
    },
    calcCounbon: {
      type: String,
      default: "",
    },
  },
  data() {
    return {};
  },
  mounted() {},
  methods: {
    openPopup() {
      this.$emit("openPopup");
    },
    openRemarkt() {
      this.$emit("openRemarkt");
    },
    openCouponModule() {
      this.$emit("couponClick");
    },
  },
};
</script>

<style lang="less" scoped>
.coupon-area {
  padding: 28rpx 24rpx;
}
.remark-css{  
  label{
    display: block;
    height: 52rpx;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
    margin-left: 96rpx;
  } 
}
.calc-counbon{
  font-size: 26rpx;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #FF0A35;
}
</style>

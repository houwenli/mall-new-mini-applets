<template>
  <!-- 详情 -->
  <view class="record-details">
    <!-- 充值状态 -->
    <view class="info record">
      <view class="record-status">
        <image class="image-url" :src="statusImg" alt="" />
        <text class="text">{{ statusText }}</text>
        <div v-if="info.rechargeStatus === 1" class="recharge-text">{{ rechargeText }}</div>
      </view>

      <view v-for="item in recordList" :key="item.id" class="info-for" :class="{'for-record': item.value ==  'rechargeAmount'}">
        <text class="info-gray">{{ item.label }}</text>
        <text class="info-black"
          >{{ getVal(info[item.value], item.value) }}
          <text v-if="item.value === 'rechargeAmount'">元</text>
        </text>
      </view>
      <view v-for="(item, inx) in recordPriceList" :key="item.id" class="info-for">
        <text class="info-black">{{ item.label }}</text>
        <text class="info-black" :class="{ 'info-red': item.value === 'realPayAmount' && inx == recordPriceList.length - 1}">
          <text v-if="item.value === 'realPayAmount'">￥</text>{{ getVal(info[item.value], item.value) }}
        </text>
      </view>
    </view>
    <!-- 订单信息 -->
    <view class="info order">
      <view v-for="item in orderList" :key="item.id" class="info-for">
        <text class="info-gray">{{ item.label }}</text>
        <text class="info-black">
          {{ getVal(info[item.value], item.value) }}
          <!-- 复制订单号 -->
          <image
            v-if="item.value === 'orderNo' && info[item.value]"
            class="right-image"
            src="https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/uat/e8372ca8412606b07fba9177298839e8.png"
            @click="onCopy(info[item.value])"
            alt=""
          />
        </text>
      </view>
      <!-- 联系客服 -->
      <view class="info-customer">
        <image class="customer-image" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/recharge/Customer%20service%402x.png" alt="" />
        <text class="customer-text">客服电话：4006424888</text>
      </view>
    </view>
    <!-- 退款情况  只有充值失败展示 -->
    <view v-if="info.rechargeStatus === 3" class="info refund">
      <view v-for="item in refundList" :key="item.id" class="info-for">
        <text class="info-black">{{ item.label }}</text>
        <text
          class="info-black"
          :class="{ 'info-red': item.value === 'refundAmount' }"
          ><text v-if="item.value === 'refundAmount'">￥</text>{{ getVal(info[item.value], item.value) }}</text
        >
      </view>
      <view class="system-reson"
        >由于系统原因导致充值失败，已自动将该充值款原路退回您的账户，请您注意查收~</view
      >
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      orderNo: "",
      info: {},
      recordList: [
        { id: 1, label: '充值号码', value: 'rechargePhone' },
        { id: 2, label: '充值面额', value: 'rechargeAmount' },
      ],
      recordPriceList: [
        { id: 3, label: '商品总价', value: 'realPayAmount' },
        { id: 4, label: '实付金', value: 'realPayAmount' },
      ],
      orderList: [
        { id: 5, label: '订单编号', value: 'orderNo' },
        { id: 6, label: '支付方式', value: 'mixedPayChannel' },
        { id: 7, label: '交易流水号', value: 'serialNo' },
        { id: 8, label: '付款时间', value: 'payTime' }
      ],
      refundList: [
        { id: 10, label: '退款总金额', value: 'refundAmount' },
        { id: 11, label: '退款方式', value: 'backtracking' },
      ],
    };
  },
  onLoad(option) {
    this.orderNo = option.orderNo
  },
  onShow() {
    this.onSearch();
  },
  computed: {
    statusImg() {
      // 1充值中,2充值成功，3充值失败
      const imgUrl = {
        0: "https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/recharge/In_payment%402x.png",
        1: "https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/recharge/In_payment%402x.png",
        2: "https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/recharge/pay_success%402x.png",
        3: "https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/recharge/failure%402x.png",
      };
      return imgUrl[this.info.rechargeStatus];
    },
    statusText() {
      const text = {
        0: "充值中",
        1: "充值中",
        2: "充值成功！",
        3: "充值失败！",
      };
      return text[this.info.rechargeStatus];
    },
    tradeChannel() {
      return '微信'
    },
    rechargeText() {
      return `预计付款完成后${this.info.rechargeType === 1 ? '10分钟' : '72小时'}左右到账，请关注短信～`
    }
  },
  methods: {
    onCopy(code) {
      uni.setClipboardData({ data: code });
    },
    // 查询详情信息
    async onSearch() {
      try {
        let res = await this.$u.api.queryRechargeOrderDetail({
          orderNo: this.orderNo,
        });
        if (res.code === 200) {
          this.info = res.data;
        }
      } catch (error) {
        console.log(error);
      }
    },
    getVal(val, type) {
      if (['refundAmount','rechargeAmount','realPayAmount'].includes(type)) return this.fenToYuan(val)
      if (type === 'mixedPayChannel') return val
      if( type === 'serialNo')  return this.info.rechargeStatus === 3 ? this.info.refundTradeSerialNo : this.info.payTradeSerialNo
      if( type === 'backtracking') return `原路退回(${this.info.mixedPayChannel})`
      if (val) return val
      return '-'
    },
    fenToYuan(data) {
      if (!parseInt(data)) {
        return "0.00";
      }
      return (Math.round((data / 100) * 100) / 100).toFixed(2);
    },
  },
};
</script>

<style lang="less" scoped>
.record-details {
  height: 100%;
  background: #f6f6f6;
  padding: 24rpx;
  .info {
    padding: 18rpx 24rpx 18rpx 24rpx;
    background: #ffffff;
    border-radius: 24rpx;
    margin-bottom: 24rpx;
  }
  //   浅色label
  .info-gray {
    font-size: 26rpx;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #c3c3c3;
  }
  //   深色
  .info-black {
    font-size: 26rpx;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #191919;
  }
  .info-red {
    color: #ff0a35;
  }
  .info-for {
    padding: 18rpx 0 20rpx 0;
    display: flex;
    justify-content: space-between;
  }
  .info-customer {
    border-top: 1rpx solid #EEEEEE;
    display: flex;
    justify-content: center;
    align-items: center;
    padding-top: 16rpx;
    .customer-image {
      width: 40rpx;
      height: 40rpx;
      margin-right: 8rpx;
    }
    .customer-text {
      font-size: 24rpx;
      color: #646A72;
    }
  }
  .for-record {
    border-bottom: 1rpx solid #EEEEEE;
  }
  .record {
    .record-status {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding-bottom: 32rpx;
    }

    .text {
      font-size: 44rpx;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #000d1d;
    }
    .recharge-text {
      font-size: 26rpx;
      color: #999999;
      padding: 16rpx 0 32rpx 0;
    }

    .image-url {
      margin-top: 32rpx;
      width: 144rpx;
      height: 144rpx;
    }
  }
  .right-image {
    width: 24rpx;
    height: 24rpx;
  }
  .system-reson {
    // padding: 0 24rpx 20rpx 24rpx;
    font-size: 22rpx;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #c3c3c3;
  }
}
</style>
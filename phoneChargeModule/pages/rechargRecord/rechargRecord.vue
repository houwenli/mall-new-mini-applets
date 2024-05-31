<template>
  <!-- 充值记录 -->
  <view class="recharg-record">
    <!-- <view class="head-search" @click="onSearch">
        <image class="search-img" src="https://wsjc-web.wsecar.com/wsf-mall/home/search.png" mode="widthFix"> </image>
        <u-input v-model="goods" class="search-text">输入商品名称</u-input>
        <text class="search-right">搜索</text>  
    </view> -->

        <view v-if="!haveData" class="nodata">
          <image
            class="nodata-image"
            src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/recharge/img_blank_history%402x.png"
            alt=""
          />
          <text class="nodata-tips">暂无充值记录</text>
        </view>
        <view v-else>
            <view class="commodity" v-for="item in recordList" :key="item.id">
                <view class="commodity-title" @click="toDetail(item.orderNo)">
                  <text class="title-left">{{ getVal(item.orderType, 'orderType') }}</text>
                  <text :style="{color: item.rechargeStatus == 0 || item.rechargeStatus == 1 ? '#FF8000' : item.rechargeStatus == 2 ? '#08B638' :'#DE3A38'}">
                    {{ getStatus(item.rechargeStatus) }}
                  </text>
                </view>
                <view class="commodity-info" @click="toDetail(item.orderNo)">
                  <view v-for="it in infoList" :key="it.id" class="info">
                    <text class="info-left" :class="{ 'actual-payment': it.value === 'realPayAmount' }">{{ it.label }}</text>
                    <text class="info-right" :class="{ 'right-red': it.value === 'realPayAmount' }">
                      <text v-if="it.value === 'realPayAmount'">￥</text>
                      {{ getVal(item[it.value], it.value) }}
                      <text v-if="it.value === 'rechargeAmount'">元</text>
                    </text>
                  </view>
                </view>
                <view class="commodity-btn">
                  <!-- 充值成功的订单可以删除 -->
                  <view  v-if="item.rechargeStatus === 2" class="column-btn del-btn" @click="onDelete(item.orderNo)"> 删除订单 </view>
                  <view class="column-btn" @click="onBuy"> 再次购买</view>
                </view>
            </view>
          </view>
        </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      searchValue: "",
      goods: "",
      recordList: [],
      infoList: [
        { id: 1, label: "充值号码", value: "rechargePhone" },
        { id: 2, label: "充值面额", value: "rechargeAmount" },
        { id: 3, label: "付款时间", value: "payTime" },
        { id: 4, label: "实付款", value: "realPayAmount" },
      ],
      orderNo: "",
    };
  },
  computed: {
    haveData() {
      return this.recordList && this.recordList.length;
    },
    chargeType() {
      return {
        1: "话费充值",
      };
    },
  },
  onShow() {
    this.onSearch();
  },
  methods: {
    fenToYuan(data) {
      if (!parseInt(data)) {
        return "0.00";
      }
      return (Math.round((data / 100) * 100) / 100).toFixed(2);
    },
    getVal(val, type) {
      if (val) {
        if (type === "rechargeAmount" || type === "realPayAmount") return this.fenToYuan(val);
        if (type === "orderType") return this.chargeType[val];
        return val;
      }
      return "-";
    },

    getStatus(data) {
      const status = {
        0: '充值中',
        1: "充值中",
        2: "充值成功",
        3: "充值失败-自动退款",
      };
      return status[data];
    },
    onSearch() {
      this.$u.api.queryRechargeOrderList({}).then((res) => {
        if (res.code === 200) {
          this.recordList = res.data;
        }
      });
    },
    toDetail(data) {
      this.$wsf.go("recordDetails", { orderNo: data });
    },
    // 再次购买话费
    onBuy() {
      this.$wsf.go("phoneCharge");
    },
    // 删除充值订单
    onDelete(val) {},
  },
};
</script>

<style lang="less" scoped>
.recharg-record {
  width: 100%;
  height: 100%;
  overflow: auto;
  background: #f6f6f7;
  padding: 36rpx 24rpx;
  .search {
    margin-bottom: 26rpx;
    background: #fff;
    border-radius: 32rpx;
  }
  .search-icon-img {
    width: 48rpx;
    height: 48rpx;
    image {
      width: 100%;
    }
  }
  .right-red {
    color: #ff0a35 !important;
  }
  .head-search {
    width: 702rpx;
    height: 96rpx;
    background: #ffffff;
    border-radius: 32rpx;
    // margin: 0 24rpx;
    margin-bottom: 26rpx;
    padding: 0 24rpx 0 32rpx;
    display: flex;
    align-items: center;
    .search-img {
      width: 32rpx;
      height: 32rpx;
    }
    .search-text {
      padding-left: 16rpx;
      width: 500rpx;
      font-size: 28rpx;
      color: #b4b7ba;
    }
    .search-right {
      font-size: 32rpx;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #2956e1;
      text-align: right;
    }
  }
  .column-btn {
    width: 160rpx;
    height: 56rpx;
    border-radius: 40rpx;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    font-size: 24rpx;
    font-weight: 500;
    background: #fff;
    border: 2rpx solid #ff0a35;
    color: #ff0a35;
  }
  .del-btn {
    border: 2rpx solid #999999;
    color: #999999;
    margin-right: 20rpx;
  }
  .nodata {
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    .nodata-image {
      margin: 144rpx auto 20rpx auto;
      width: 360rpx;
      height: 360rpx;
    }
    .nodata-tips {
      font-size: 30rpx;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #999999;
    }
  }

  .commodity {
    background: #ffffff;
    box-shadow: 0px 8rpx 16rpx 0px rgba(234, 234, 234, 0.44);
    border-radius: 16rpx;
    margin-bottom: 20rpx;
    // padding: 20rpx 24rpx 24rpx 24rpx;
    .commodity-title {
      display: flex;
      justify-content: space-between;
      padding: 20rpx 24rpx 24rpx 24rpx;
      border-bottom: 1rpx solid #eaeaea;
      .title-left {
        font-size: 28rpx;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #000d1d;
      }
      .title-right {
      }
    }
    .commodity-info {
      padding: 20rpx 24rpx 0 24rpx;
      margin-top: 20rpx;
      .info {
        display: flex;
        justify-content: space-between;
        margin-bottom: 36rpx;
      }
      .info-left {
        font-size: 26rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #c3c3c3;
      }
      .actual-payment {
        font-size: 26rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #191919;
        // margin-bottom: 26rpx;
      }
      .info-right {
        font-size: 26rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #191919;
      }
    }
    .commodity-btn {
      text-align: right;
      padding: 0 24rpx 24rpx 24rpx;
      .btn-round {
        font-size: 24rpx;
        font-weight: 500;
        width: 160rpx;
        height: 56rpx;
        border-radius: 40rpx;
        color: #ff0a35;
      }
      .del {
        color: #999999;
        margin-right: 20rpx;
      }
    }
  }
  /deep/.u-content {
    background: #fff;
  }
  /deep/.u-search__action {
    padding: 0 24rpx;
    font-size: 32rpx;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #2956e1;
  }
  .u-search__content {
    padding: 0;
    background: #fff;
  }
  /deep/.u-field__control[type="search"] {
    font-size: 28rpx;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #b4b7ba;
  }
}
</style>
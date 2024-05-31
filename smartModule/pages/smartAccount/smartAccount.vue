<template>
  <view class="wrap">
    <!-- 头部 -->
    <smartNavBar title="我的账户" bg-color="rgb(85 0 0 / 0)" />
    <!-- 银行卡管理 提现记录 -->
    <view class="inlets flex">
      <view class="inlets-item flex" @click="toIndex('smartBankCard')">
        <image :src="`${smartImg}/account/bank-card-icon.png`" />
        <text>银行卡管理</text>
      </view>
      <view class="inlets-item flex" @click="toIndex('smartExtractRecords')">
        <image :src="`${smartImg}/account/cash-out-icon.png`" />
        <text>提现记录</text>
      </view>
    </view>
    <!-- 账户列表 -->
    <view class="accounts">
      <!-- 加载页 -->
      <smartTransition v-if="isLoading" />
      <!-- 内容 -->
      <view class="accounts__content" v-else>
        <!-- 账户信息 至少有一个,所以无缺省状态 -->
        <accountList
          v-if="!isError"
          :list="list"
          @toWithdrawal="toWithdrawal"
          @toIndex="toIndex"
        />
        <!-- 无网络状态 -->
        <smartTransition v-else :typeName="'noNetwork'" :text="`暂无网络`" />
      </view>
    </view>
  </view>
</template>

<script>
// 公共组件
import smartNavBar from "@/components/smart/smart-nav-bar/smart-nav-bar.vue";
import smartTransition from "@/components/smart/smart-transition/smart-transition.vue";
// 公共数据
import { BIZLINE } from "@/common/constants/userinfo";
// 公共方法
import { fenToYuan, getSplitPrice } from "@/common/utils.js";
// 内部组件
import { accountList } from "./comm/accountList.vue";
// 接口
import {
  AccountList,
  FundWithdrawCheck,
} from "@/common/smart-api/userCenterApi";
export default {
  components: {
    accountList,
    smartNavBar,
    smartTransition,
  },
  data() {
    return {
      smartImg: this.$smartImg,
      isError: false, //是否无网络
      isLoading: false, // 是否正在加载
      list: [], //账户信息列表
    };
  },
  onShow() {
    this.getAccountList();
  },
  methods: {
    // 页面跳转
    toIndex(name, val) {
      this.$smart.go(name, val);
    },
    // 校验是否可以提现
    toWithdrawal(val) {
      let param = {
        bizLine: BIZLINE.wsfMall,
      };
      FundWithdrawCheck(param)
        .then((res) => {
          let { oneMaxAmount, amount, oneMinAmount } = res.data
          let money = Math.min(oneMaxAmount, amount)
          this.toIndex("smartExtract", { money, minAmount: oneMinAmount });
        })
        .catch((err) => {
          if (err.data.msg) {
            this.$u.toast(err.data.msg);
          }
        });
    },
    //获取账户列表
    async getAccountList() {
      if (this.isLoading) return;
      this.isError = false;
      this.isLoading = true;
      try {
        let res = await AccountList();
        let dealData = this.dealData(res.data);
        this.list = dealData;
      } catch (error) {
        this.isError = true;
      }
      this.isLoading = false;
    },
    // 处理账户列表数据
    dealData(data) {
      if (!data || data.length == 0) return [];
      let realData = this.$u.deepClone(data);
      realData.forEach((item) => {
        item._perUn = fenToYuan(item.personalAgencyUnsettledAmount)//待结算余额
        item._perInt = getSplitPrice(fenToYuan(item.personalAgencySettledAmount)).int;  //余额整数部分
        item._perDec = getSplitPrice(fenToYuan(item.personalAgencySettledAmount)).decimal;  //余额小数部分
      });
      return realData;
    },
  },
};
</script>

<style scoped lang="scss">
.flex {
  display: flex;
  align-items: center;
}
.wrap {
  background: url("https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/ws-smart-life/account/account-bg.png")
    no-repeat;
  background-size: 100% 400rpx;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
.inlets {
  position: relative;
  z-index: 2;
  justify-content: space-between;
  padding: 88rpx 20rpx 0;
  width: 100%;
  height: 234rpx;
  &-item {
    flex: 1;
    flex-shrink: 1;
    padding-left: 32rpx;
    margin-right: 22rpx;
    height: 146rpx;
    background: #ffffff;
    border-radius: 24rpx;
    font-size: 30rpx;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #191919;
    line-height: 44rpx;
    &:last-child {
      margin-right: 0;
    }
  }
  image {
    margin-right: 16rpx;
    width: 80rpx;
    height: 80rpx;
  }
}
.accounts {
  position: relative;
  top: -72rpx;
  width: 100%;
  background-color: #f6f6f6;
  border-radius: 24rpx 24rpx 0rpx 0rpx;
  height: calc(100vh - 330rpx);
  &__content {
    padding: 106rpx 20rpx 0;
    height: 100%;
  }
}
</style>

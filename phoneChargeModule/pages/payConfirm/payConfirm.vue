<template>
  <view>
    <wsf-nav-bar
      @onBackBtnClick="openModal()"
      :status-bar="true"
      title="万顺福收银台"
      :hasBack="true"
    ></wsf-nav-bar>
    <view class="pay-confirm">
      <!-- 订单金额 -->
      <view class="orderbox">
        <!-- <view class="ordertitle">充值金额</view> -->
        <view class="ordermoney">
          <label class="renminbi">¥</label>
          {{ money | priceFilter }}
        </view>
        <view class="ordertitle">{{payInfo}}</view>
      </view>
      <view class="paywaybox">
        <view class="paybox" @click="selectWxPayWay()">
          <label class="wallet">微信支付</label>
          <view class="pay">
            <image
              class="payimg"
              src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/prev-icon-list/payment_WeChat%402x.png"
              mode=""
            ></image>
            <image
              class="radioimg"
              src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/prev-icon-list/cat_Selected%402x.png"
              mode=""
              v-show="wxPayWay === true"
            ></image>
            <image
              class="radioimg"
              src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/prev-icon-list/cat_ns%402x.png"
              mode=""
              v-show="wxPayWay === false"
            ></image>
          </view>
        </view>
      </view>
      <!-- 底部支付 -->
      <view class="footbox" :class="{ 'footbox-space': isNeedBottomSpace }">
        <button type="default" class="buttonStyle" @tap="toPayFun">
          {{ payWayContext[payWayType] }}支付
          <block v-if="payWayType > 0"> ¥ {{ money | priceFilter }}</block>
        </button>
      </view>
      <view class="footbox-bottom-space" v-if="isNeedBottomSpace"></view>

      <view><u-toast ref="uToast" class="utext" /></view>
      <wsf-confirm
        v-model="showConfirm"
        title="确认要离开收银台？"
        activeText="确认离开"
        cancelText="继续支付"
        @confirm="goToOrderList()"
      ></wsf-confirm>
      <wsf-confirm
        v-model="showPrePayConfirm"
        title="请输入支付密码"
        activeText="确认支付"
        @cancel="this.payPassword = ''"
        @confirm="toPrePay()"
      >
        <view slot="context"
          ><u-input
            v-model="payPassword"
            input-align="center"
            placeholder="请填写您的支付密码"
            :clearable="false"
            type="password"
        /></view>
      </wsf-confirm>
      <wsf-confirm
        v-model="showConfirmPayPassword"
        title="您还未设置支付密码！"
        activeText="去设置"
        @confirm="toPayPassword"
      ></wsf-confirm>
      <wsf-confirm v-model="showPayErrorConfirm" :hideConfirm="true">
        <view slot="context">
          <view class="pay-error-confirm-content">{{ payErrorText }}</view>
        </view>
        <view
          slot="button"
          class="pay-error-confirm-button"
          @tap="showPayErrorConfirm = !showPayErrorConfirm"
        >
          知道了
        </view>
      </wsf-confirm>
    </view>
  </view>
</template>

<script>
let mobile = null;
const app = getApp();
import wsfConfirm from "@/components/wsf-confirm/wsf-confirm.vue";
import wsfNavBar from "@/components/wsf-nav-bar/wsf-nav-bar.vue";
export default {
  components: {
    wsfConfirm,
    wsfNavBar,
  },
  data() {
    return {
      passengerEmpower: 0,
      isNeedBottomSpace: getApp().globalData.isNeedBottomSpace,
      showConfirmPayPassword: false,
      balancePayWay: false,
      wxPayWay: false,
      payWayContext: ["确认", "微信", "微信"],
      orderCode: 0,
      money: 0,
      rechargeAmount: 0,
      area: '',
      showConfirm: false, // 返回按钮
      showPrePayConfirm: false, // 钱包支付模块
      payPassword: "", // 交易密码
      loading: false, // 是否加载中
      payPasswordFlag: 0,
      showPayErrorConfirm: false, //支付限制提示
      payErrorText: "", //支付限制提示文案
    };
  },
  onLoad(options) {
    if (!!options) {
      this.orderCode = options.orderCode;
      this.money = options.realPayAmount || 0;
      this.rechargeAmount = options.rechargeAmount
      this.area = options.area
    } else {
      this.$wsf.go("phoneCharge");
    }
  },
  onShow() {
    this.wxPayWay = true;
  },
  computed: {
    payWayType() {
      if (this.wxPayWay) {
        return 1;
      }
    },
    payInfo() {
      if(this.rechargeAmount) {
        return this.area + this.rechargeAmount + '元'
      }
      return ''
    }
  },
  methods: {
    // 打开模态框
    openModal(context, atv) {
      this.confirmContext = context;
      this.showConfirmType = atv;
      this.showConfirm = true;
    },

    // 微信支付方式
    selectWxPayWay(val) {
      this.wxPayWay = !this.wxPayWay;
    },
    toPayPassword() {
      this.showConfirmPayPassword = false;
      this.$wsf.go("UpdatePayPwd", { mobile });
    },
    // 微信支付
    toWxPay(isMixedPay) {
      let that = this;
      this.$u.api
        .WechatMixedPay({
          payTypes: [2],
          accessType: 5,
          type: 1,
          orderCode: this.orderCode,
          rechargeOrder: 1, //是否为充话费，0否，1是
        })
        .then((res) => {
          //-1:用户不存在 -3:没有待支付的订单 -5:微信生成订单出错 -7 没有设置网站地址 -8 缺少配置  -10没有绑定微信 1 成功
          /* if (res.flag !== 1) {
					app.showToastError('获取微信支付参数失败');
				} else { */
          //that.showConfirmModal();
          let params = res.data;
          wx.requestPayment({
            timeStamp: params.time_stamp, //时间戳，自1970年以来的秒数
            nonceStr: params.nonce_str, //随机串
            package: params.package_,
            signType: params.sign_type, //微信签名方式：
            paySign: params.pay_sign,
            success: function (res) {
              if (res.errMsg === "requestPayment:fail cancel") {
                app.showToastError("用户取消支付");
                return;
              }
              if (res.errMsg === "requestPayment:ok") {
                that.$wsf.go("rechargSuccess", { orderCode: that.orderCode });
              }
            },
            fail: function (res) {
              if (res.errMsg === "requestPayment:fail cancel") {
                app.showToastError("用户取消支付");
              }
            },
          });
          // }
        })
        .catch((err) => {
          this.loadPreDepositCount();
        });
    },
    // 支付
    toPayFun() {
      if (this.loading) return;
      this.loading = true;
      let params;
      switch (this.payWayType) {
        case 1:
          params = {
            payTypes: [2],
            accessType: 5,
            type: 1,
            orderCode: this.orderCode,
            rechargeOrder: 1,
            // balancePayAmount: this.realBalance,
          };
          break;
      }
      this.$u.api
        .ToPay(params)
        .then((res) => {
          this.loading = false;
          if (res.code == 200) {
            let params = res.data;
            wx.requestPayment({
              timeStamp: params.time_stamp, //时间戳，自1970年以来的秒数
              nonceStr: params.nonce_str, //随机串
              package: params.package_,
              signType: params.sign_type, //微信签名方式：
              paySign: params.pay_sign,
              success: (res) => {
                if (res.errMsg === "requestPayment:fail cancel") {
                  app.showToastError("用户取消支付");
                  return;
                }
                if (res.errMsg === "requestPayment:ok") {
                  this.$wsf.go("rechargSuccess", { orderNo: this.orderCode });
                }
              },
              fail: (res) => {
                if (res.errMsg === "requestPayment:fail cancel") {
                  app.showToastError("用户取消支付");
                }
              },
            });
          } else {
            this.$u.toast(res.description);
            // this.queryPermissions();
          }
        })
        .catch((err) => {
          this.loading = false;
          // -31支付余额总额 >= 限制额度 -32支付余额总额 < 限制额度且剩余额度 < 订单支付金额
          if (err.data.code == -31 || err.data.code == -32) {
            this.showPayErrorConfirm = true;
            this.payErrorText = err.data.description;
            return;
          }
          //-1用户不存在 -2用户支付密码错误 -3没有待支付的订单 -4余额不足 -5生成表单出错 -6用户支付密码不存在 -7网站地址不存在  -8支付配置的参数错误 -9支付方式未启用 -10需要同不知福子订单 -11未知的支付方式 -12参数错误 -13未知的支付入口 -14用户预存款金额不足 -15没有设置支付密码 -16注册失败,请刷新后重试 -17订单已支付成功,请勿重复提交 -18记录交易流水失败 -19没有绑定微信 -20微信生成订单错误 -21余额变动,已刷新页面
          if (err.data.code == -3) {
            this.$wsf.go("phoneCharge");
          } else {
            // this.queryPermissions();
          }
        });
    },
    // 确认离开,跳转订单列表
    goToOrderList() {
      this.$wsf.go("phoneCharge");
    },
  },
};
</script>

<style lang="scss" scoped>
.pay-confirm {
  .orderbox {
    width: 100%;
    background-color: #fff;
    height: 260rpx;
    border-radius: 0rpx 0rpx 20rpx 20rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-bottom: 24rpx;
    .ordertitle {
      color: #666666;
      font-size: 28rpx;
    }
    .ordermoney {
      margin-top: 20rpx;
      color: #e60113;
      font-size: 60rpx;
      font-weight: bold;
      .renminbi {
        font-size: 40rpx;
      }
    }
  }
  .payway-title {
    padding: 32rpx 36rpx 32rpx;
    font-size: 30rpx;
    font-weight: bold;
  }
  .paywaybox {
    width: 100%;
    background-color: #fff;
    border-radius: 20rpx;
    overflow: visible;
    padding-left: 36rpx;
    .paybox {
      height: 110rpx;
      line-height: 110rpx;
      position: relative;
      .pay {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .payimg {
          width: 60rpx;
          height: 60rpx;
          margin-right: 20rpx;
        }
        .radioimg {
          width: 36rpx;
          height: 36rpx;
          margin-right: 40rpx;
        }
      }
      .wallet {
        position: absolute;
        left: 80rpx;
        top: 1rpx;
        font-size: 28rpx;
        color: #000;
        .money {
          color: #999;
        }
      }
    }
  }
  .footbox-bottom-space {
    position: fixed;
    bottom: 0;
    height: 68rpx;
    width: 100%;
    background-color: #fff;
    z-index: 999;
  }
  .footbox-space {
    bottom: 68rpx !important;
  }
  .footbox {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100rpx;
    display: flex;
    align-items: center;
    flex: 1;
    .buttonStyle {
      width: 654rpx;
      height: 90rpx;
      line-height: 90rpx;
      text-align: center;
      border-radius: 16rpx;
      background-color: #e60113;
      color: #fff;
      font-size: 32rpx;
    }
  }
  .utext {
    /deep/ .u-text {
      color: #fff;
    }
  }
}
.pay-error-confirm-button {
  font-size: 34rpx;
}
.pay-error-confirm-content {
  line-height: 44rpx;
  text-align: center;
}
</style>

<template>
  <view class="pay-contain">
    <wsf-nav-bar
      @onBackBtnClick="openModal()"
      title="收银台"
      :hasBack="true"
      bgColor="transparent"
      class="nav-bar"
      @getNavHeight="getNavHeight"
    ></wsf-nav-bar>
    <view class="pay-wraper">
      <!-- 订单金额 -->
      <view class="order" :style="[orderStyle]">
        <view class="order-content">
          <view class="order-countdown">支付剩余时间 29:43</view>
          <view class="order-money">
            <label class="yuan-flag">¥</label>
            <label class="int">{{ getMoney[0] }}.</label>
            <label class="decimal">{{ getMoney[1] }}</label>
          </view>
          <view class="order-business">电商业务</view>
        </view>
      </view>
      <!-- 支付方式 -->
      <view class="payway">
        <view class="payway-title">
          支付方式
        </view>
        <view class="payway-list">
          <view class="payway-every" @click="selectWxPayWay()">
            <view class="payway-every__left">
              <image class="payimg" :src="wxImg" mode="" ></image>
              <label class="wallet">微信支付</label>
            </view>
            <view class="payway-every__right">
              <view class="select-falg" :class="{'selected': wxPayWay === true}"></view>
            </view>
          </view>
          <view class="payway-every" @click="selectWxPayWay()">
            <view class="payway-every__left">
              <image class="payimg" :src="zfbImg" mode="" ></image>
              <label class="wallet">微信支付</label>
            </view>
            <view class="payway-every__right">
              <view class="select-falg" :class="{'selected': wxPayWay === true}"></view>
            </view>
          </view>
        </view>
        
      </view>
      <!-- 底部支付 -->
      <view class="footbox">
        <button type="default" class="buttonStyle" @tap="toPayFun">
					<text>立即支付</text>
        </button>
      </view>

      <!-- toast提示 -->
      <view><u-toast ref="uToast" class="utext" /></view>
      <!-- 页面弹窗 -->
      <wsf-confirm
        v-model="showConfirm"
        title="确认要离开收银台？"
        context="下单后30分钟订单将被取消，请尽快支付"
        activeText="确认离开"
        cancelText="继续支付"
        @confirm="goToOrderList()"
        contextAlign="center"
      ></wsf-confirm>
      <wsf-confirm
        v-model="showPayErrorConfirm"
        :hideConfirm="true"
      >
        <view slot="context">
          <view class="payerror-confirm__content">{{ payErrorText }}</view>
        </view>
        <view slot="button" class="payerror-confirm__button" @tap="showPayErrorConfirm = !showPayErrorConfirm">
          知道了
        </view>
      </wsf-confirm>
    </view>
  </view>
</template>

<script>
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
      // 图片相关
      wxImg: `${this.$smartImg}/pay/wx-pay.png`,
      zfbImg: `${this.$smartImg}/pay/zfb-pay.png`,
      navHeight: 0, // 导航高度
			wxPayWay: true
    };
  },
  onLoad(options) {
    if (!!options) {
      this.orderCode = options.orderCode;
      this.money = options.orderMoney || 0;
      this.fromSource = options.fromSource
    } else {
      this.$wsf.go("Index");
    }
  },
  onShow() {

  },
	computed: {
    orderStyle() {
      return {
        paddingTop: `${this.navHeight}px`
      }
    }
	},
  methods: {
    // 获取导航栏高速
    getNavHeight(height) {
      console.log(1111, height)
      this.navHeight = height
    },
    // 打开模态框
    openModal(context, atv) {
      this.confirmContext = context;
      this.showConfirmType = atv;
      this.showConfirm = true;
    },
		// 微信支付方式
		selectWxPayWay(val) {
			if(!this.balancePayWay || this.balance < this.money) return
		  this.wxPayWay = !this.wxPayWay;
			if(this.wxPayWay == true && this.balance >= this.money) {
				this.balancePayWay = false
			}
		},
    // 支付
    toPayFun() {
      if (this.loading) return;
      this.loading = true;
      let params
      switch (this.payWayType) {
        case 0:
          params = {
            orderCode: this.orderCode,
            type: 1,
            accessType: 5,
            payTypes: [0]
          }
          break;
        case 1:
          params = {
            orderCode: this.orderCode,
            type: 1,
            accessType: 5,
            payTypes: [2],
            balancePayAmount: this.realBalance
          }
          break;
				case 2:
          params = {
            orderCode: this.orderCode,
            type: 1,
            accessType: 5,
            payTypes: [0,2],
            balancePayAmount: this.realBalance
          }
				  break;
      }
      this.$u.api.ToPay(params).then(res => {
         this.loading = false;
          if(res.code == 200) {
            if(this.payWayType == 0) {
              this.$u.toast("支付成功");
              this.$wsf.go("CheckOrderPay", { orderCode: this.orderCode });
            } else {
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
                    uni.requestSubscribeMessage({
                      tmplIds: [
                        "r0q1HXh-tFnkpr6iL1FFc4UsFEHYp7mG1fxAvUBnw-Q",//订单支付成功通知
                        "8KL_v78QDVSy8DVKTrstVadGiOo-_J2HUQFq_S2BBbw",//订单发货通知
                        "rfQ3XaHakX4IkpgafumXFeTWgEDqdMKesyCtJaZKGxE",//订单签收提醒
                      ],
                      success(res) {
                        console.log("成功回调：", res);
                      },
                      fail(res) {
                        console.log("失败回调：", res);
                      },
                      complete: (res) => {
                        console.log("关闭了消息订阅授权：", res);
                        this.$u.api.uniformMessageSend({
                            type: 3,
                            orderCode: this.orderCode,
                            openId: uni.getStorageSync("openId"),
                        })
                        .then((res) => {})
                        .catch((err) => {});
                        this.$wsf.go("CheckOrderPay", { orderCode: this.orderCode });
                      },
                    });
                  }
                },
                fail: (res) => {
                  if (res.errMsg === "requestPayment:fail cancel") {
                    app.showToastError("用户取消支付");
                  }
                },
              });
            }
          } else {
            this.$u.toast(res.description);
            // this.queryPermissions()
          }
      }).catch((err) => {
        this.loading = false;
        // -31支付余额总额 >= 限制额度 -32支付余额总额 < 限制额度且剩余额度 < 订单支付金额
         if(err.data.code == -31 || err.data.code == -32){
            this.showPayErrorConfirm = true
            this.payErrorText = err.data.description
            return
         }
        //-1用户不存在 -2用户支付密码错误 -3没有待支付的订单 -4余额不足 -5生成表单出错 -6用户支付密码不存在 -7网站地址不存在  -8支付配置的参数错误 -9支付方式未启用 -10需要同不知福子订单 -11未知的支付方式 -12参数错误 -13未知的支付入口 -14用户预存款金额不足 -15没有设置支付密码 -16注册失败,请刷新后重试 -17订单已支付成功,请勿重复提交 -18记录交易流水失败 -19没有绑定微信 -20微信生成订单错误 -21余额变动,已刷新页面
        if(err.data.code == -3) {
          this.$wsf.go('OrderList', {status: -1}, 'redirectTo');
        } else {
        //   this.queryPermissions()
        }
      });

    },
    // 确认离开,跳转订单列表
    goToOrderList() {
      uni.requestSubscribeMessage({
        tmplIds: [
          "uDC_ZT4STeXnKsNDhNQobS0wTV9HSvW8xRwhF8sFCy0",//下单成功通知
          "E9YG913iV1DszoDdq9f_NLvwZQg-Lnuec2-rQjt2VHk",//订单取消通知
        ],
        success(res) {
          console.log("成功回调：", res);
        },
        fail(res) {
          console.log("失败回调：", res);
        },
        complete: (res) => {
          console.log("关闭了消息订阅授权：", res);
          this.$u.api
            .uniformMessageSend({
              orderCode: this.orderCode,
              openId: uni.getStorageSync("openId"),
            })
            .then((res) => {})
            .catch((err) => {});         
            if(this.fromSource){
              //  uni.navigateTo跳转的返回，默认1为返回上一级
              uni.navigateBack({
                delta: 1,
              });
            } else {
              this.$wsf.go('OrderList', {status: -1}, 'redirectTo');
            }
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.pay-contain {
  height: 100vh;
  background-color: #fff;
}
.nav-bar {
  position: fixed;
  width: 100%;
  top: 0;
}

.pay-wraper {
  .order {
    display: flex;
    justify-content: center;
    background: linear-gradient(360deg, #ffffff 0%, #FFBE0C 50%, #FFBE0C 100%);
    height: 632rpx;
  }
  .order-content {
    width: 686rpx;
    height: 374rpx;
    background-image: url(https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/ws-smart-life/pay/pay.png);
    background-size: 100% 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    margin-top: -10rpx;
  }
  .order-countdown {
    font-size: 26rpx;
    font-weight: 400;
    color: #FF450C;
    line-height: 34rpx;
  }
  .order-money {
    font-size: 72rpx;
    font-family: DINAlternate-Bold, DINAlternate;
    font-weight: bold;
    color: #191919;
    line-height: 72rpx;
    margin-top: 30rpx;
    .yuan-flag {
      font-size: 40rpx;
    }
    .int {

    }
    .decimal {

    }
  }
  .order-business {
    font-size: 22rpx;
    font-weight: 400;
    color: #999999;
    line-height: 30rpx;
  }
  .payway {
    background: #FFFFFF;
    border-radius: 24rpx;
    padding: 32rpx;
    margin-top: -92rpx;
  }
  .payway-title {
    height: 44rpx;
    font-size: 36rpx;
    font-weight: 600;
    color: #191919;
    line-height: 44rpx;
  }
  .payway-list {
    margin-top: 32rpx;
  }
  .payway-every {
    height: 104rpx;
    margin-top: 18rpx;
    display: flex;
    align-content: center;
    justify-content: space-between;
  }
  .payway-every__left {
    display: flex;
    align-items: center;
    justify-content: center;
    .payimg {
      width: 64rpx;
      height: 64rpx;
    }
    .wallet {
      font-size: 32rpx;
      font-weight: 400;
      color: #191919;
      line-height: 44rpx;
      margin-left: 14rpx;
    }
  }
  .payway-every__right {
    margin-right: 16rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    .select-falg {
      width: 32rpx;
      height: 32rpx;
      background-image: url(https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/ws-smart-life/pay/pay-way-def.png);
      background-size: 100% 100%;
    }
    .select-falg.selected {
      background-image: url(https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/ws-smart-life/pay/pay-way-select.png);
    }
  }
}


  
.utext {
  /deep/ .u-text {
    color: #fff;
  }
}

.footbox {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 8rpx 24rpx;
  padding-bottom: calc(8rpx + constant(safe-area-inset-bottom));
  padding-bottom: calc(8rpx + env(safe-area-inset-bottom));
  background: #FFFFFF;
  box-shadow: 0rpx -4rpx 20rpx 0rpx rgba(189,194,204,0.2);
  .buttonStyle {
    height: 80rpx;
    line-height: 80rpx;
    text-align: center;
    border-radius: 40rpx;
    background: #FFBE0C;
    text{
      color: #191919;
      font-size: 32rpx;
    }    
  }
}
.payerror-confirm__content {
  font-size: 34rpx;
}
.payerror-confirm__content{
  line-height: 44rpx;
  text-align: center;
}
</style>

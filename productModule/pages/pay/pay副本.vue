<template>
  <view>
    <wsf-nav-bar
      @onBackBtnClick="openModal()"
      :status-bar="true"
      title="万顺福收银台"
      :hasBack="true"
    ></wsf-nav-bar>
    <view class="payboxwrapper">
      <!-- 订单金额 -->
      <view class="orderbox">
        <view class="ordertitle">订单金额</view>
        <view class="ordermoney">
          <label class="renminbi">¥</label>
          <label class="integer">{{ getMoney[0] }}.</label>
          <label class="decimal">{{ getMoney[1] }}</label>
        </view>
      </view>
      <!-- 支付方式 -->
      <view class="paywaybox" v-if="passengerEmpower">
        <view class="paybox" v-if="balance == 0" style="opacity:0.4" >
          <label class="wallet">
            万顺宝余额支付
            <text class="money">（{{ balance.toFixed(2) }}元）</text>
          </label>
          <view class="pay">
            <image class="payimg" src="@/static/img/payment_wallet@2x.png" mode=""></image>
            <image class="radioimg" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/prev-icon-list/cat_Selected%402x.png" mode="" v-show="balancePayWay === true"></image>
            <image class="radioimg" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/prev-icon-list/cat_ns%402x.png" mode="" v-show="balancePayWay === false"></image>
          </view>
        </view>
				<view class="paybox" @click="selectBalancePayWay()" v-else>
				  <label class="wallet">
				    万顺宝余额支付
				    <text class="money">（{{ balance.toFixed(2) }}元）</text>
				  </label>
				  <view class="pay">
				    <image class="payimg" src="@/static/img/payment_wallet@2x.png" mode=""></image>
				    <image class="radioimg" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/prev-icon-list/cat_Selected%402x.png" mode="" v-show="balancePayWay === true"></image>
				    <image class="radioimg" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/prev-icon-list/cat_ns%402x.png" mode="" v-show="balancePayWay === false"></image>
				  </view>
				</view>
      </view>

			<view class="paywaybox">
                <view class="payway-title">
				    第三方支付方式
			    </view>
				<view class="paybox" @click="selectWxPayWay()">
				 
				  <view class="pay">
                    <view class="pay-left">
                        <image
				          class="payimg"
				          src="@/static/img/icon/WeChat@2x.png"
				          mode=""
				        ></image>
                        <label class="wallet">微信支付</label>
                    </view>
				  
				    <image
				      class="radioimg"
				      src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/address/address-selected-2x.png"
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
      <view class="footbox">
        <button type="default" class="buttonStyle" @tap="toPayFun">
					<text>{{ payWayContext[payWayType] }}支付</text>
					<text v-if="payWayType > 0">¥{{ payWayType == 2 ? wxPayMoney : money | priceFilter }}</text>
        </button>
      </view>

      <view><u-toast ref="uToast" class="utext" /></view>
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
        v-model="showPrePayConfirm"
        title="请输入支付密码"
        activeText="确认支付"
        @cancel="this.payPassword = ''"
        @confirm="toPrePay()"
        contextAlign="center"
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
        contextAlign="center"
        v-model="showConfirmPayPassword"
        title="您还未设置支付密码！"
        activeText="去设置"
        @confirm="toPayPassword"
      ></wsf-confirm>
      <wsf-confirm
        v-model="showPayErrorConfirm"
        :hideConfirm="true"
      >
      <view slot="context">
        <view class="pay-error-confirm-content">{{ payErrorText }}</view>
       </view>
       <view slot="button" class="pay-error-confirm-button" @tap="showPayErrorConfirm = !showPayErrorConfirm">
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
      payWayContext: ["确认", "微信", "微信" ],
      balance: 0, //视图层显示的余额
      realBalance: 0, //未做处理余额
      orderCode: 0,
      money: 0,
      showConfirm: false, // 返回按钮
      showPrePayConfirm: false, // 钱包支付模块
      payPassword: "", // 交易密码
      loading: false, // 是否加载中
      payPasswordFlag: 0,
	  wxPayMoney: 0, //混合支付， 微信需要支付部分
      showPayErrorConfirm:false,//支付限制提示
      payErrorText:'',//支付限制提示文案
      fromSource: false
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
    this.$u.api.CustomerDetail().then((res) => {
      mobile = res.data.mobile;
      uni.setStorageSync('phone', res.data.mobile)
    });
  },
  onShow() {
    // 2023-3-24 接 樊 要求 频闭余额支付
    // this.queryPermissions()
    this.wxPayWay = true
  },
	computed: {
		payWayType() {
			if(this.balancePayWay && !this.wxPayWay) {
				return 0
			} else if(!this.balancePayWay && this.wxPayWay) {
				return 1
			} else if(this.balancePayWay && this.wxPayWay){
				return 2
			}
		},
        getMoney(){
            let realVal  = ''
            if (!isNaN(this.money) && this.money !== '') {
		        // 截取当前数据到小数点后两位
		        realVal = parseFloat(this.money).toFixed(2)
	        } else {
		        realVal ='0.00'
	        }
            return  String(realVal).split('.')
        }
	},
  methods: {
    //查询用户是否关联万顺宝余额且授权
    queryPermissions() {
      let data = {
			  phone: mobile || uni.getStorageSync('phone')
		  }
      this.$u.api.SelectOneByCondition(data).then(res => {
				if(res.code == 200) {
          this.passengerEmpower = res.data.id && res.data.passengerEmpowerStatus
					if(this.passengerEmpower) {
		      	this.loadPreDepositCount();
		      } else {
		      	this.wxPayWay = true
            this.balancePayWay = false
		      }
				}
			})
    },
    // 查询用户万顺宝余额
    loadPreDepositCount() {
      this.$u.api.QueryUserAsset().then((res) => {
       if(res.code == 200) {
        this.balance = res.data.balance ? res.data.balance / 100 : 0;
        this.realBalance = res.data.balance
				if(this.balance >= this.money ) {
					this.balancePayWay = true
          this.wxPayWay = false
				} else {
					if(this.balance <= 0) {
						this.wxPayWay = true
            this.balancePayWay = false
					} else {
						this.balancePayWay = true
						this.wxPayWay = true
						this.wxPayMoney = parseInt(this.money * 1000 - this.balance * 1000) / 1000
					}
				}
       } else {
        this.passengerEmpower = 0
       }
        // this.payWay = res.data.money >= this.money ? 1 : 2;
        // this.payPasswordFlag = res.data.payPasswordFlag;
      });
    },
    // 打开模态框
    openModal(context, atv) {
      this.confirmContext = context;
      this.showConfirmType = atv;
      this.showConfirm = true;
    },
    // 余额支付方式
    selectBalancePayWay(val) {
			if(!this.wxPayWay) return
      this.balancePayWay = !this.balancePayWay;
			if(this.balancePayWay == true && this.balance >= this.money) {
				this.wxPayWay = false
			}
    },

		// 微信支付方式
		selectWxPayWay(val) {
			if(!this.balancePayWay || this.balance < this.money) return
		  this.wxPayWay = !this.wxPayWay;
			if(this.wxPayWay == true && this.balance >= this.money) {
				this.balancePayWay = false
			}
		},

    toPayPassword() {
      this.showConfirmPayPassword = false;
      this.$wsf.go("UpdatePayPwd", { mobile });
    },
    // 钱包支付
    toPrePay() {
      // if (this.payPassword.length == 0) {
      //   this.$u.toast("请输入支付密码");
      //   return;
      // }
      if (this.loading) return;
      this.loading = true;
      this.$u.api
        .BalancePay({
          orderCode: this.orderCode,
          type: 1,
        })
        .then((res) => {
          this.loading = false;
          if(res.code == 200) {
            this.$u.toast("支付成功");
            // this.showPrePayConfirm = false;
            /* 支付成功跳转 */
            this.$wsf.go("CheckOrderPay", { orderCode: this.orderCode });
          } else {
            this.$u.toast(res.description);
            // this.queryPermissions()
          }
        })
        .catch((err) => {
          this.loading = false;
          if(err.data.code == -3 || err.data.code == 3007) {
            this.$wsf.go('OrderList', {status: -1}, 'redirectTo');
          } else {
            // this.queryPermissions()
          }
        });
    },
    // 微信支付
    toWxPay(isMixedPay) {
      let that = this;
      this.$u.api
        .WechatMixedPay({ orderCode: this.orderCode, type: 1, isMixedPay, balancePayAmount: this.realBalance  })
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
                that.$wsf.go("CheckOrderPay", { orderCode: that.orderCode });
              }
            },
            fail: function (res) {
              if (res.errMsg === "requestPayment:fail cancel") {
                app.showToastError("用户取消支付");
              }
            },
          });
          // }
        }).catch(err => {
          this.loadPreDepositCount();
        });
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
    //   this.showConfirm = false;
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
      //uni.navigateTo跳转的返回，默认1为返回上一级
      // uni.navigateBack({
      //   delta: 1,
      // });
    },
  },
};
</script>

<style lang="scss" scoped>
.payboxwrapper {
  .orderbox {
    background-color: #fff;
    border-radius: 16rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 20rpx;
    padding: 40rpx 0rpx;
    .ordertitle {
      color: #191919;
      font-size: 26rpx;
      margin-bottom: 20rpx;
    }
    .ordermoney {
      .renminbi {
        font-size: 32rpx;
        font-family: DINAlternate-Bold, DINAlternate;
        font-weight: bold;
        color: #FF0A35;
        margin-right: 2rpx;
      }
      .integer{
        font-size: 60rpx;
        font-family: DINAlternate-Bold, DINAlternate;
        font-weight: bold;
        color: #FF0A35;
        line-height: 68rpx;
      }
      .decimal{
        font-size: 32rpx;
        font-family: DINAlternate-Bold, DINAlternate;
        font-weight: bold;
        color: #FF0A35;
        line-height: 40rpx;
      }
    }
  }
	.payway-title {
		margin-bottom: 20rpx;
		font-size: 26rpx;
		font-weight: 500;
        color: #191919;
	}
  .paywaybox {
    background-color: #fff;
    border-radius: 16rpx;
    overflow: visible;
    margin: 0rpx 20rpx;
    padding: 24rpx;
    .paybox {
    //   height: 110rpx;
    //   line-height: 110rpx;
    //   position: relative;
      .pay {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 16rpx 0rpx;
        .payimg {
          width: 40rpx;
          height: 40rpx;
          margin-right: 16rpx;
        }
        .radioimg {
          width: 32rpx;
          height: 32rpx;
        }
      }
      .pay-left{
        display: flex;
        align-items: center;
      }
      .wallet {
        // position: absolute;
        // left: 80rpx;
        // top: 1px;
        font-size: 28rpx;
        color: #000;
        .money {
          color: #999;
        }
      }
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
      background: linear-gradient(90deg, #FF5F2E 0%, #FF0A35 100%);
      text{
        color: #fff;
        font-size: 32rpx;
      }    
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
.pay-error-confirm-content{
  line-height: 44rpx;
  text-align: center;
}
</style>

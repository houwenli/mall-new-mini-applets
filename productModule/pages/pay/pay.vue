<template>
  <view class="pay-contain">
    <!-- <wsf-nav-bar
      @onBackBtnClick="openModal()"
      title="收银台"
      :hasBack="true"
      bgColor="transparent"
      class="nav-bar"
      @getNavHeight="getNavHeight"
    ></wsf-nav-bar> -->
    <smartNavBar title="收银台" :bgimg="`${smartImg}/pay/2023-09-25/pay_header.png`" @backFunc="openModal" :isCustomBack="true" />
    <view class="pay-wraper">
      <!-- 订单金额 -->
      <view class="order" :class="!detailsList || !detailsList.length ? 'order-h': ''">
        <view class="order-content">
          <!-- <view class="order-countdown">支付剩余时间{{ remainingTime | formatTime }}</view> -->
          <view class="order-money">
            <label class="yuan-flag">¥</label>
            <label class="int">{{ getMoney[0] }}.</label>
            <label class="decimal">{{ getMoney[1] }}</label>
          </view>
          <view class="order-business">{{ businessTypeEnum[businessType] }}</view>
        </view>
      </view>
      <!-- 中间部分样式 -->
      <view class="main-box" v-if="(passengerEmpower && (balancePay || mixedPay)) || detailsList && detailsList.length>0">
        <!-- 支付方式 -->
        <view class="payway" v-if="passengerEmpower && (balancePay || mixedPay)">
          <view class="payway-list" v-if="balance == 0">
            <view>
              <view class="payway-every">
                <view class="payway-every__left">
                  <image class="payimg" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/ws-smart-life/home/payment_wallet%402x.png" mode=""></image>
                  <span class="wallet">余额支付（{{ balance.toFixed(2) }}元）</span>                               
                </view>
                <view class="pay">              
                  <!-- <image class="radioimg" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/ws-smart-life/pay/pay-way-select.png" mode="" v-show="balancePayWay === true"></image>
                  <image class="radioimg" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/ws-smart-life/home/smart_disabled.png" mode="" v-show="balancePayWay === false"></image> -->
                  <image class="radioimg" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/ws-smart-life/home/smart_disabled.png" mode=""></image>
                </view>
              </view>
            </view>
          </view>
          <view class="payway-list" @click="selectBalancePayWay()" v-else>
            <view>
              <view class="payway-every">         
                <view class="payway-every__left">
                  <image class="payimg" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/ws-smart-life/home/payment_wallet%402x.png" mode=""></image>
                  <span class="wallet">余额支付（{{ balance.toFixed(2) }}元）</span>                               
                </view>
                <view class="pay" v-if="!mixedPay">          
                  <view v-if="balance >= money">
                    <image class="radioimg" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/ws-smart-life/pay/pay-way-select.png" mode="" v-show="!wxPayWay"></image>
                    <image class="radioimg" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/ws-smart-life/pay/pay-way-def.png" mode="" v-show="wxPayWay"></image>
                  </view>
                  <image class="radioimg" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/ws-smart-life/home/smart_disabled.png" mode="" v-else></image>
                </view>
                <view class="pay" v-else>             
                  <image class="radioimg" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/ws-smart-life/pay/pay-way-select.png" mode="" v-show="balancePayWay === true"></image>
                  <!-- <image class="radioimg" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/ws-smart-life/home/smart_disabled.png" mode="" v-show="balancePayWay === false"></image> -->
                  <image class="radioimg" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/ws-smart-life/pay/pay-way-def.png" mode="" v-show="balancePayWay === false"></image>

                </view>
              </view>
            </view>
          </view>
        </view>

        <!-- 支付方式 -->
        <view class="payway" v-if="detailsList && detailsList.length>0">        
          <view class="payway-list">         
            <view v-for="item in detailsList" :key="item.payChannelType" class="payway-list-box">
              <view class="payway-every" @click="selectWxPayWay(item.payChannelType, item)">
                <view class="payway-every__left">
                  <img class="payimg" :src="imgList[item.payChannelType]" mode="" />
                  <span class="wallet">{{ payWay[item.payChannelType] }}</span>
                </view>
                <view class="payway-every__right">              
                  <view class="select-falg" :class="{'selected': payChannelType == item.payChannelType }"></view>
                </view>
              </view>
            </view>				
          </view>
          
        </view>
      </view>
      <!-- 底部支付 -->
      <view class="footbox">
        <view type="default" class="buttonStyle" @tap="toPayFun">
					<!-- <text>{{ payWayContext[payWayType] }}支付</text>
					<text v-if="payWayType > 0">¥{{ payWayType == 2 ? wxPayMoney : money | priceFilter }}</text> -->
          <text>立即支付</text>
        </view>
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
let mobile = null;
const app = getApp();
import wsfConfirm from "@/components/wsf-confirm/wsf-confirm.vue";
import wsfNavBar from "@/components/wsf-nav-bar/wsf-nav-bar.vue";
import { getPayList, orderPay } from '@/common/smart-api/pay'
import { parseTimeData } from '@/mixins/utilFun';
import { qqMap } from "@/common/config.js";
import { yuanToFen, fenToYuan } from "@/common/utils.js";
import smartNavBar from "@/components/smart/smart-nav-bar/smart-nav-bar.vue";
export default {
  components: {
    wsfConfirm,
    wsfNavBar,
    smartNavBar
  },
  data() {
    return {
      smartImg: this.$smartImg,
      passengerEmpower: 1, // 查询用户是否关联万顺宝余额且授权
      // 图片相关
      wxImg: `${this.$smartImg}/pay/wx-pay.png`,
      zfbImg: `${this.$smartImg}/pay/zfb-pay.png`,
      navHeight: 0, // 导航高度
      balancePayWay: false, // 余额大于支付金额 或 余额小于支付金额 并且余额大于0 为true
			wxPayWay: true,
      payWayContext: ["确认", "微信", "微信" ],
      balance: 0, //视图层显示的余额
      showConfirm: false, // 返回按钮
      money: 0,
			detailsList:[
        // {
        //   name: '微信支付', // 支付方式
        //   payChannelType: 2,
        //   payChannelId: '', // 渠道商ID
        //   channelType: '', // 商户类型：1直连 2间连
        //   mchId: '', // 商户号,
        //   appId: ''
        // },
        // {
        //   name: '支付宝支付', // 支付方式
        //   payChannelType: 1,
        //   payChannelId: '', // 渠道商ID
        //   channelType: '', // 商户类型：1直连 2间连
        //   mchId: '', // 商户号,
        //   appId: ''
        // },       
      ],// 支付方式列表
      balancePay: false, // 是否支持余额支付
      mixedPay: false, // 是否支持混合支付
      imgList: {
        1: 'https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/ws-smart-life/pay/zfb-pay.png',       
        2: 'https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/ws-smart-life/pay/wx-pay.png',
      },
			payChannelType: '',
      wxPayMoney: 0, //混合支付， 微信需要支付部分      
      showPayErrorConfirm:false,//支付限制提示
      payErrorText:'',//支付限制提示文案
      payWay: {
        1: '支付宝支付',
        2: '微信支付'
      },
      businessType: '', // 业务类型
      businessTypeEnum: {
        100: '电商优选',
        200: '话费充值',
        300: '换电业务',
        400: '票务业务',
        500: '酒店民宿'       
      },
      cashDeskId: '', // 收银台id
      payChannelId: '', // 渠道商ID（收银台带入）
      paySceneType: '', // 支付场景（收银台带入）
      cityCode: 0, // 城市code
      channelType: '' // 	商户类型：1直连 2间连
      // createTime: '' // 订单创建时间
    };
  },
  // filters: {
  //   formatTime(time) {
  //     let { hours, minutes, seconds } = parseTimeData(time);
  //     return `${minutes}分${seconds}秒`;
  //   }
  // },
  onLoad(options) {
    if (!!options) {
      this.orderCode = options.orderCode;    
      this.money = options.from && options.from=='smart' ? fenToYuan(options.orderMoney) : options.orderMoney;     
      this.fromSource = options.fromSource
      this.businessType = options.businessType || ''
      this.paySceneType = options.paySceneType || ''
      // this.createTime = options.createTime || ''
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
    this.initCityCode()
    this.getPayList()
    // this.queryPermissions()
    this.wxPayWay = true
  },
	computed: {
    // 待支付剩余时间
    // remainingTime() {
    //   let buyTime = new Date(this.createTime.replace(/-/g, '/'));
    //   let endTime = 30 * 60 * 1000;
    //   let nowTime = new Date().getTime();
    //   return endTime - (nowTime - buyTime);
    // },
    getMoney(){
      let realVal  = ''
      if (!isNaN(this.money) && this.money !== '') {
        // 截取当前数据到小数点后两位
        realVal = parseFloat(this.money).toFixed(2)
      } else {
        realVal ='0.00'
      }
      return  String(realVal).split('.')
    },
    payWayType() {
      // balancePayWay  - 余额大于支付金额 或 余额小于支付金额 并且余额大于0 为true [是否可以余额支付]
			if(this.balancePayWay && !this.wxPayWay) {
				return 0 // 余额支付
			} else if(!this.balancePayWay && this.wxPayWay) {
				return 1 // 三方支付
			} else if(this.balancePayWay && this.wxPayWay){      
        if(!this.mixedPay){
          return this.balance < this.money ? 1 : 3
        } // 不支持混合支付，金额大于余额则为三方支付，否则可以选择三方支付或则余额支付
				return 2 // 有余额并且有三方支付 为混合支付
			}
		},
    orderStyle() {
      return {
        paddingTop: `${this.navHeight}px`
      }
    }
	},
  methods: {
    initCityCode() {
      let that = this;
      uni.getFuzzyLocation({
        type: 'wgs84',
        // geocode: true,
        // isHighAccuracy: true,
        success(res) {          
          qqMap.reverseGeocoder({
            location: {
              latitude: res.latitude,
              longitude: res.longitude,
            },
            success: function (result) {
			        let cityCode = String(result.result.ad_info.adcode);
              that.cityCode = cityCode.slice(0, 4) + "00";           
            },
            fail: function (error) {
              console.error(error, "error");
              that.cityCode = 0;
            },
          });
        },
      });
    },
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
				if(this.balance >= this.money && this.balancePay) {
					this.balancePayWay = true
          this.wxPayWay = false
				} else {
					if(this.balance <= 0) {
            this.balancePayWay = false
						this.wxPayWay = true
					} else {
						this.balancePayWay = true
            this.wxPayWay = true
						// this.wxPayMoney = parseInt(this.money * 1000 - this.balance * 1000) / 1000
					}
				}
       } else {
        this.passengerEmpower = 0
       }
        // this.payWay = res.data.money >= this.money ? 1 : 2;
        // this.payPasswordFlag = res.data.payPasswordFlag;
      });
    },
    getPayList(){
		  let userInfo = uni.getStorageSync('userInfo');
      let params = {
        uid: userInfo.id, // 用户id
        businessType: this.businessType, // 业务类型:100.电商业务 200.充值业务 300.换电业务 400.票务业务 500.酒店业务"
        amount: yuanToFen(this.money), // 待支付金额
        platform: 2 // 客户端 1.APP 2.微信小程序 3.H5
      }
      getPayList(params)
        .then((res) => {
          if (res.code === 200) { 
            let result  = res.data || []
            this.detailsList  = result.detailsList || []    
            this.balancePay = result.balancePay // 是否支持余额支付
            this.mixedPay = result.mixedPay // 是否支持混合支付       
            this.cashDeskId = result.cashDeskId // 收银台id                    
            this.payChannelType = this.detailsList.length > 0 ? this.detailsList[0].payChannelType : ''    
            this.payChannelId = this.detailsList.length > 0 ? this.detailsList[0].payChannelId : '' 
            this.channelType  = this.detailsList.length > 0 ? this.detailsList[0].channelType : ''    
            // this.paySceneType = this.detailsList.length > 0 ? this.detailsList[0].payChannelType : ''  // 支付场景            
          }      
        })
      .catch((err) => {         
        this.$u.toast(err.data.description || err.data.msg);
        this.detailsList  =  []    
        this.balancePay = false // 是否支持余额支付
        this.mixedPay = false // 是否支持混合支付     
      })
    },
    // 获取导航栏高速
    getNavHeight(height) {      
      this.navHeight = height
    },
    // 打开模态框
    openModal(context, atv) {
     
      this.showConfirm = true;
      
      
      // this.confirmContext = context;
      // this.showConfirmType = atv;    
    },
    // 余额支付方式
    selectBalancePayWay(val) {      
      if(!this.wxPayWay || (this.balance < this.money && !this.mixedPay) || (this.mixedPay && !this.detailsList.length)) return
      this.balancePayWay = !this.balancePayWay;
      if(this.balancePayWay == true && this.balance >= this.money) {
        this.wxPayWay = false
        this.payChannelType = ''
      }     
    },
		// 微信支付方式
		selectWxPayWay(val, item) {			
      this.payChannelId = item.payChannelId    
      this.channelType = item.channelType
      // this.paySceneType = item.payChannelType  
      this.payChannelType = val
      if(!this.balancePayWay || this.balance < this.money) return
      this.wxPayWay = !this.wxPayWay;
      if(this.wxPayWay == true && this.balance >= this.money) {
        this.balancePayWay = false
      }        
		},
    toPayFun() {
      if(!this.payChannelType){
       return this.$u.toast("未配置收银台");
      }
      let userInfo = uni.getStorageSync('userInfo');
      if (this.loading) return;
      this.loading = true;     
      let params = {
        orderNo: this.orderCode, // 智慧生活业务订单号
        payType: 4, // 	支付方式:0余额 1 支付宝app支付 2 微信app支付 3 微信公众号支付 4微信小程序支付 5微信H5支付 6支付宝H5支付 7支付宝扫码支付 8微信扫码支付 9云闪付wap支付 10云闪付app控件支付 11京东wap支付 12京东APP支付 13云闪付扫码支付 14微信免密支付 15百度支付 16支付宝小程序支付 17云闪付小程序支付 18招行APP支付 19招行H5支付
        userId: userInfo.id, // 用户ID
        businessType: this.businessType, // 业务类型
        cashDeskId: this.cashDeskId, //	收银台ID（收银台带入）
        openId: uni.getStorageSync("openId"), // 微信小程序支付必传           
        mixedPay: this.mixedPay && this.payWayType == 2 ? true : false,
        paySceneType: this.paySceneType, // 支付场景 paySceneType	支付场景 101电商订单；201充值订单
        payChannelId: this.payChannelId, // 渠道id
        cityCode: this.cityCode,
        agentType: 'WX_SMALL_PROGRAM',
        token: uni.getStorageSync('newToken')
      }  
      if(this.channelType == 2) { // 间连
        this.$wsf.go("yplPay", {
          data: JSON.stringify(params),
          url: '/api/app/order/service/orderPay',
          token: uni.getStorageSync('newToken'),
          businessType: this.businessType      
        }); 
      } else {
        orderPay(params).then(res => {
          this.loading = false;
          if(res.code == 200) {
            let outTradeNo = res.data.outTradeNo
            if(this.payWayType == 0) {
              this.$u.toast("支付成功");
              // this.$wsf.go("CheckOrderPay", { orderCode: this.orderCode, businessType: this.businessType });
              this.$wsf.go("CheckOrderPay", { orderCode: this.orderCode, businessType: this.businessType });
            } else {
              let params = JSON.parse(res.data.payResult);     
              
              wx.requestPayment({
                timeStamp: params.timeStamp, //时间戳，自1970年以来的秒数
                nonceStr: params.nonceStr, //随机串
                package: params.package,
                signType: params.signType, //微信签名方式：
                paySign: params.sign,
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
                        this.$wsf.go("CheckOrderPay", { orderCode: this.orderCode, businessType: this.businessType });
                      },
                    });
                  }
                },
                fail: (res) => {
                  this.$wsf.go("CheckOrderPay", { orderCode: this.orderCode, businessType: this.businessType });
                  console.log(res,'resresresres');
                  if (res.errMsg === "requestPayment:fail cancel") {
                    app.showToastError("用户取消支付");
                  }
                },
              });
            }
          } else {						
            this.$u.toast(res.description || res.msg);
            // this.queryPermissions()
          }
        }).catch((err) => {
          console.log(err,'errerrerr');
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
        		this.$u.toast(err.data.description || err.data.msg);
            // this.queryPermissions()
          }
        });
      }

    },
    // 支付
    // toPayFun() {
    //   if (this.loading) return;
    //   this.loading = true;
    //   let params
    //   switch (this.payWayType) {
    //     case 0:
    //       params = {
    //         orderCode: this.orderCode,
    //         type: 1,
    //         accessType: 5,
    //         payTypes: [0]
    //       }
    //       break;
    //     case 1:
    //       params = {
    //         orderCode: this.orderCode,
    //         type: 1,
    //         accessType: 5,
    //         payTypes: [2],
    //         balancePayAmount: this.realBalance
    //       }
    //       break;
		// 		case 2:
    //       params = {
    //         orderCode: this.orderCode,
    //         type: 1,
    //         accessType: 5,
    //         payTypes: [0,2],
    //         balancePayAmount: this.realBalance
    //       }
		// 		  break;
    //   }
    //   this.$u.api.ToPay(params).then(res => {
    //      this.loading = false;
    //       if(res.code == 200) {
    //         if(this.payWayType == 0) {
    //           this.$u.toast("支付成功");
    //           this.$wsf.go("CheckOrderPay", { orderCode: this.orderCode });
    //         } else {
    //           let params = res.data;
    //           wx.requestPayment({
    //             timeStamp: params.time_stamp, //时间戳，自1970年以来的秒数
    //             nonceStr: params.nonce_str, //随机串
    //             package: params.package_,
    //             signType: params.sign_type, //微信签名方式：
    //             paySign: params.pay_sign,
    //             success: (res) => {
    //               if (res.errMsg === "requestPayment:fail cancel") {
    //                 app.showToastError("用户取消支付");
    //                 return;
    //               }
    //               if (res.errMsg === "requestPayment:ok") {
    //                 uni.requestSubscribeMessage({
    //                   tmplIds: [
    //                     "r0q1HXh-tFnkpr6iL1FFc4UsFEHYp7mG1fxAvUBnw-Q",//订单支付成功通知
    //                     "8KL_v78QDVSy8DVKTrstVadGiOo-_J2HUQFq_S2BBbw",//订单发货通知
    //                     "rfQ3XaHakX4IkpgafumXFeTWgEDqdMKesyCtJaZKGxE",//订单签收提醒
    //                   ],
    //                   success(res) {
    //                     console.log("成功回调：", res);
    //                   },
    //                   fail(res) {
    //                     console.log("失败回调：", res);
    //                   },
    //                   complete: (res) => {
    //                     console.log("关闭了消息订阅授权：", res);
    //                     this.$u.api.uniformMessageSend({
    //                         type: 3,
    //                         orderCode: this.orderCode,
    //                         openId: uni.getStorageSync("openId"),
    //                     })
    //                     .then((res) => {})
    //                     .catch((err) => {});
    //                     this.$wsf.go("CheckOrderPay", { orderCode: this.orderCode });
    //                   },
    //                 });
    //               }
    //             },
    //             fail: (res) => {
    //               if (res.errMsg === "requestPayment:fail cancel") {
    //                 app.showToastError("用户取消支付");
    //               }
    //             },
    //           });
    //         }
    //       } else {						
    //         this.$u.toast(res.description);
    //         this.queryPermissions()
    //       }
    //   }).catch((err) => {
    //     console.log(err,'errerrerr');
    //     this.loading = false;
    //     // -31支付余额总额 >= 限制额度 -32支付余额总额 < 限制额度且剩余额度 < 订单支付金额
    //      if(err.data.code == -31 || err.data.code == -32){
    //         this.showPayErrorConfirm = true
    //         this.payErrorText = err.data.description
    //         return
    //      }
    //     //-1用户不存在 -2用户支付密码错误 -3没有待支付的订单 -4余额不足 -5生成表单出错 -6用户支付密码不存在 -7网站地址不存在  -8支付配置的参数错误 -9支付方式未启用 -10需要同不知福子订单 -11未知的支付方式 -12参数错误 -13未知的支付入口 -14用户预存款金额不足 -15没有设置支付密码 -16注册失败,请刷新后重试 -17订单已支付成功,请勿重复提交 -18记录交易流水失败 -19没有绑定微信 -20微信生成订单错误 -21余额变动,已刷新页面
    //     if(err.data.code == -3) {
    //       this.$wsf.go('OrderList', {status: -1}, 'redirectTo');
    //     } else {
		// 			this.$u.toast(err.data.description);
    //       this.queryPermissions()
    //     }
    //   });

    // },
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

            uni.navigateBack({
              delta: 1,
            });
            // if(this.fromSource){
            //   //  uni.navigateTo跳转的返回，默认1为返回上一级
            //   uni.navigateBack({
            //     delta: 1,
            //   });
            // } else {
            //   this.$wsf.go('OrderList', {status: -1}, 'redirectTo');
            // }
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.pay-contain {
  height: 100vh;
  background-color: #F6F6F6;;
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
    height: 456rpx;
    width: 750rpx;
    background-image: url(https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/ws-smart-life/pay/2023-09-25/pay.png);
    background-size: 100% 100%;
    padding-top: 122rpx;
  }
  .order-content {
    display: flex;
    align-items: center;
    flex-direction: column;
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
    padding-top: -20rpx;
  }
  .payway-title {
    height: 44rpx;
    font-size: 36rpx;
    font-weight: 600;
    color: #191919;
    line-height: 44rpx;
  }
  
  .payway-every {
    padding: 28rpx 32rpx;
    display: flex;
    align-content: center;
    justify-content: space-between;
    .pay {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16rpx 0rpx;
      margin-right: 16rpx;
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
  }
  .payway-list-box:not(:last-child){   
    .payway-every{
      border-bottom: 1px solid #EEE;
    }
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
      margin-left: 16rpx;
    }
  }
  .payway-every__right {
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
      background-image: url(https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/ws-smart-life/cart/2023-09-25/cart-sku-select.png);
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
    background: linear-gradient(90deg, #FF8011 0%, #FE3040 100%);
    text{
      color: #ffffff;
      font-size: 32rpx;
      font-weight: 500;
      font-family: PingFangSC-Medium, PingFang SC;
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
.main-box{
  background: #F6F6F6;
  border-radius: 24rpx;
  padding: 32rpx 24rpx 0;
  margin-top: -82rpx;
}
</style>

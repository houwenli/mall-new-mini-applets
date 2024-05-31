<template>
	<view class="ypl-pay">	
		<wsf-nav-bar
			@onBackBtnClick="openModal()"
			title="订单支付"		
			bgColor="transparent"
			class="nav-bar"
			@getNavHeight="getNavHeight"
			:hasBack="true"
		></wsf-nav-bar>	
		
	
		<view class="ypl-pay-load" :style="updateHeight" v-if="loading">
			<u-loading :show="loading"  color="#E60113" mode="load" :size="120" />
			<!-- <text>订单支付中...</text> -->
		</view>
		<view v-else>
			<button class="button" open-type="launchApp" v-if="intoSource!='WX_SMALL_PROGRAM'">返回APP</button>	
			<button class="button"  @click="goToCheckOrderPay" v-else>返回结果页</button>	
		</view>
	</view>
</template>

<script>
let code = ""

import {http} from '@/common/smart-api/http.interceptor.js'
const getUUID = (e) => {
    var uuid = uni.getStorageSync("deviceId");
    if (!uuid) {
      var d = new Date().getTime();
      uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        function (c) {
          var r = (d + Math.random() * 16) % 16 | 0;
          d = Math.floor(d / 16);
          return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
        }
      );
      uni.setStorageSync("deviceId", uuid);
    }
    return uuid
}
export default {
	data() {
		return {
			intoSource: '',  // 来源
			businessType: '',// 业务类型
			orderCode: '', // 订单号
			openId: '',
			loading: true,	
			navHeight: 0		
		}
	},	
	onLoad(option) {	
		let {data, url, token, softVersion, businessType, fromPage } = option;					
		this.businessType = businessType
		this.loading = true
		if(fromPage && fromPage=='h5') {
			data = {
				payChannelId: option.payChannelId,
				cityCode: +option.cityCode,
				businessType: +option.businessType,
				payType: +option.payType,
				agentType: option.agentType,			
				mixedPay: JSON.parse(option.mixedPay),
				cashDeskId: option.cashDeskId,
				orderNo: option.orderNo,
				paySceneType: +option.paySceneType,
				userId: option.userId,
			}
		} else {
			if(!data || !url || !token){
				this.failPay("缺少参数");
				this.loading = false
				return;
			}				
			data = JSON.parse(data.replaceAll("\\",""));
		}
		
		this.intoSource = data.agentType || ''			
		uni.showLoading({
			title: '正在支付中...',
		})
					
		const op = {token};
		if(softVersion){
			op.softVersion = softVersion;
		}	
		if(!data.cityCode){
			data.cityCode = 0
		}		
		console.log(url,data,'app参数======================');
		if(uni.getStorageSync('openId')){
			data.openId = uni.getStorageSync('openId') 
			this.getPay(url, data, op)
		} else {
			this.uniLoginCode(url, data, op);
		}				
	},
	onShow: function() {
	
	},
	computed: {
		updateHeight(){
			return `height:calc(100vh - ${this.navHeight}px);margin-top:-60px`
		}	
	},
	methods: {	
			
		getPay(url, datas, op){
			let that = this
			that.orderCode = datas.orderNo
			that.post(url, datas, op).then(({code,data,msg})=>{			
							
				if(code == 200){
					let {payResult, outTradeNo} = data;							
					if(payResult){
						payResult = JSON.parse(payResult);								
						console.log(payResult,'payResultpayResultpayResult');
						uni.requestPayment({	
							...payResult,	
							// appid: 	payResult.appId,	
							// appid: 'wx46d563038cdd2a08',	
							// timeStamp: payResult.timestamp, //时间戳，自1970年以来的秒数
							// nonceStr: payResult.noncestr, //随机串
							// package: payResult.package,
							// signType: payResult.sign_type || '', //微信签名方式：					
							// paySign: payResult.sign,						
							success: () => {	
								that.loading = false							
								uni.hideLoading();
								uni.showToast({
									title: '支付成功',
									icon:"success",
								})
							},
							fail: (error) => {
								console.log(error,datas.orderNo,'wwwwwwww')
								that.loading = false		
								that.failPay("微信支付失败");
							},
						});
						return;
					}
					that.failPay("支付失败");
				}else{
					console.log(msg,'msgmsgmsgmsgmsgmsgmsgmsgmsgmsgmsgmsgmsgmsgmsgmsgmsgmsgmsg');
					uni.showToast({
						title:msg,
						icon:"none",
					})
				}				
			},(err)=>{	
				that.loading = false	
				console.log(err,'errerrerrerrerrerrerrerrerr');					
				// that.failPay(err.data.msg);
				that.$u.toast(err.data.msg)				
			})
		},
		async uniLoginCode(url, data, op) {
			let that = this
			await uni.login({
				success(res) {
					code = res.code;
					that.$u.api
					.GetLoginInfo({ code })
					.then((res) => {
						console.log(`接口数据(GetLoginInfo): `, res);						
						data.openId = uni.getStorageSync('openId') || res.data.openId || ''					
						that.getPay(url, data, op)				
					})
					.catch((error) => {
						that.loading = false
						console.log("请求有问题--> ", error);
					});
				},
				file: (error) => {
					that.loading = false
					that.$u.toast("获取code失败!");
				},
			});
		},
		openModal(){		
			this.$wsf.go("SmartIndex");
		},
		// 获取导航栏高速
		getNavHeight(height) {    		
			this.navHeight = height
		},	
		goToCheckOrderPay(){
			// this.$smart.go('SmartIndex');			
 			this.$smart.go("CheckOrderPay", { orderCode: this.orderCode, businessType: this.businessType });
		},
		post(url,data,options={}) {
		             
			return new Promise((resolve, reject) => {			
				data = {				
					channel: '10600003',
					deviceId: getUUID(),
					platform: '3',
					softVersion: 'min', // 微信版本号
					sysVersion: 'min', // 系统版本号					
					...data,
					...options
				}							 
				http.post(            
					url,
					data,               
				).then((res)=>{               
					const jsonData = res.data?.data;
					if (jsonData && typeof jsonData === "string") {
						try {
							res.data.data = JSON.parse(jsonData);
						} catch {}
					}
					resolve(res);               
				}).catch((err)=>{
					reject(err);
				})
			})			
		},
		failPay(title){
			uni.hideLoading()
			uni.showToast({
				title,
				icon:"error",
			})
		}		
	},
}
</script>

<style scoped lang="scss">
.ypl-pay{	
	overflow-y: hidden;
	.ypl-pay-load{
		width: 100%;	
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		position: relative;
		z-index: 9999;
	}
	.button{
	  width: 654rpx;
	  height: 100rpx;
	  background-color: #FFBE0C;
	  border-radius: 16rpx;
	  color: #FFF;
	  line-height: 100rpx;
	  text-align: center;
	  margin: 50% auto 0;
	  font-weight: bold;
	}
}
</style>

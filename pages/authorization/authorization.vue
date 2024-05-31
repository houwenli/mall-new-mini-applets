<template>
	<view class="page">
		<wsf-nav-bar
		  @onBackBtnClick="cancel()"
		  :status-bar="true"
		  title=" "
		  :hasBack="true"
		></wsf-nav-bar>
		<view class="title">
			<image class="title-icon" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/prev-icon-list/quicklogo.png"></image>
			<view class="title-word">
				<view class="welcome">
					欢迎使用
				</view>
				<view class="name">
					万顺福商城
				</view>
			</view>
		</view>
		<view class="content">
			<view class="content-title">
				授权万顺福商城获取以下信息为您服务：
			</view>
			<block v-if="pageType == 1">
				<view class="content-column">
					<view class="dot"></view>
					<view class="content-word">
						您的公开信息
					</view>
				</view>
				<view class="content-column">
					<view class="dot"></view>
					<view class="content-word">
						使用您的身份信息（手机号）进行注册、登录及业务处理
					</view>
				</view>
			</block>
			<view class="content-column" v-else-if="pageType == 2">
				<view class="dot"></view>
				<view class="content-word">
					查询到你的尾号{{hidePhone}}为万顺叫车用户，可授权绑定使用<text class="bold">万顺宝余额</text>购买商品。
				</view>
			</view>
		</view>
		<view class="bottom">
			<view class="bottom-box">
				<view class="agreement" @tap="handleAgreement()">
					<image v-if="agreementFlag" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/prev-icon-list/cat_Selected%402x.png" class="radio"></image>
					<text v-else class="radio radio-empty"></text>
					同意<text class="agreement-name" @tap.stop="goRegisterAgreemt">《万顺福用户注册协议》</text>和<text class="agreement-name" @tap.stop="goPrivacyAgm">《用户隐私协议》</text>
				</view>
				<block v-if="pageType == 2">
					<button class="button agree-button" @tap="confirm()">
						同意授权绑定
					</button>
					<button class="button disagree-button" @tap="goIndex()">不同意直接登录商城</button>
				</block>
				<button v-else-if="pageType == 1" class="button agree-button" @tap="confirm()">
					确认授权
				</button>
			</view>
		</view>
	</view>
</template>

<script>
	import wsfNavBar from "@/components/wsf-nav-bar/wsf-nav-bar.vue";
	import { sign } from "../../common/sign.js";
	export default {
		components: {
		  wsfNavBar,
		},
		data() {
			return {
				pageType: 0, //1 小程序跳转授权 2 商城入口万顺宝余额授权
				jumpUrl: '',
				agreementFlag: false,
				phone: getApp().globalData.phone,
				hidePhone: "",
				source: null
			}
		},
		onLoad(option) {
			if(option) {
				this.pageType = option.pageType
				this.jumpUrl = option.jumpUrl
			}
			if(this.phone) {
				let phone = this.phone
				this.hidePhone = phone.substr(7)
			} else {
				let userInfo = uni.getStorageSync("userInfo")
				this.phone = userInfo.mobile
				this.hidePhone = userInfo.mobile.substr(7)
				this.source = userInfo.source
			}
		},
		methods: {
			// getUserInfo() {
			// 	this.$u.api.CustomerDetail().then(res => {
			// 		if (res.code === 200) {
			// 			this.phone = res.data.mobile
			// 			this.hidePhone = res.data.mobile.substr(7)
			// 			this.source = res.data.source
			// 		}
			// 	});
			// },
			/* 获取用户信息 */
			getUserInfo() {
				this.$u.api.CustomerDetail().then(res => {
					if (res.code === 200) {
						uni.setStorageSync('userInfo', res.data)
					}
				});
			},
			handleAgreement() {
				console.log(this.agreementFlag,'this.agreementFlag');
				this.agreementFlag = !this.agreementFlag
			},
			cancel() {
				if(this.pageType == 1) {
					uni.navigateBackMiniProgram({
						success(res) {
							console.log('返回成功');
						}
					})
				} else {
					this.goIndex()
					// uni.navigateBack({
					// 	delta: 1
					// });
				}
			},
			goRegisterAgreemt() {
				let url = encodeURIComponent('https://m.wsfmall.com/userRegisterAreement');
				uni.navigateTo({
				  url: "/httpsWebView/pages/webView/webView?url=" + url,
				});
			},
			goPrivacyAgm() {
				let url = encodeURIComponent('https://m.wsfmall.com/privacyAgreement');
				uni.navigateTo({
				  url: "/httpsWebView/pages/webView/webView?url=" + url,
				});
			},
			goIndex() {
				this.$wsf.go("Index")
			},
			confirm() {
				if(this.agreementFlag) {
					let openId = uni.getStorageSync("openId"),
					source = 7
					if(this.source) {
						source = this.source
					}
					let data = {
						phone: this.phone,
						source: 3,
						openId,
						empowerType: 1,
						passengerId: getApp().globalData.passengerId
					}
					this.$u.api.AddCustomerEmpower(data).then(res => {
						if(res.code == 200) {
							if(this.pageType == 1) {
								let authData = sign(this.phone, 1);
								authData.openId = uni.getStorageSync("openId");
								authData.passengerId = getApp().globalData.passengerId;
								this.$u.api.UnAuthLogin(authData).then((res) => {
								  if (res.code === 200) {
								    getApp().globalData.newToken = res.data;
								    uni.setStorageSync("newToken", res.data);
								    getApp().globalData.isLink = true;
										this.getUserInfo()
										uni.showToast({
											title: "授权成功",
											icon: "none"
										})
										let storeId = getApp().globalData.storeId
										this.$wsf.go(this.jumpUrl, {storeId}, "redirectTo")
								  }
								})
							} else {
								uni.showToast({
									title: "授权成功",
									icon: "none"
								})
								this.$wsf.go("Index")
							}
						}
					})
				} else {
					uni.showToast({
						title: "请阅读并勾选同意用户注册和隐私协议",
						icon: "none"
					})
				}
			}
		}
	}
</script>

<style scoped lang="scss">
.page {
	height: 100vh;
	background-color: #fff;
	.title {
		padding: 56rpx 30rpx 66rpx;
		display: flex;
		.title-icon {
			width: 132rpx;
			height: 132rpx;
		}
		.title-word {
			display: inline-flex;
			flex-direction: column;
			padding: 10rpx 0 8rpx 14rpx;
			justify-content: center;
			box-sizing: border-box;
			.welcome {
				font-size: 32rpx;
				color: #666;
				line-height: 44rpx;
				padding-bottom: 4rpx;
			}
			.name {
				font-weight: bold;
				line-height: 66rpx;
				color: #333;
				font-size: 48rpx;
			}
		}
	}
	.content {
		padding: 0 40rpx 0 48rpx;
		.content-title {
			font-size: 32rpx;
			font-weight: bold;
			color: #000D1D;
			line-height: 44rpx;
			padding-bottom: 32rpx;
		}
		.content-column {
			display: flex;
			align-items: flex-start;
			justify-content: space-between;
			margin-bottom: 18rpx;
			.dot {
				width: 12rpx;
				height: 12rpx;
				background: #B4B7BA;
				border-radius: 50%;
				margin-top: 18rpx;
			}
			.content-word {
				width: 634rpx;
				font-size: 26rpx;
				color: #666;
				line-height: 48rpx;
				.bold {
					color: #000D1D;
					font-weight: bold;
				}
			}
		}
	}
	.bottom {
		position: fixed;
		left: 0;
		bottom: 0;
		width: 100%;
		padding-bottom: env(safe-area-inset-bottom);
		.bottom-box {
			margin: 0 48rpx;
			padding-bottom: 40rpx;
			.agreement {
				color: #333;
				line-height: 36rpx;
				font-size: 26rpx;
				white-space: nowrap;
				display: flex;
				align-items: center;
				padding-bottom: 30rpx;
				.radio {
					width: 26rpx;
					height: 26rpx;
					margin-right: 24rpx;
				}
				.radio-empty {
					border: 2rpx solid #F26229;
					border-radius: 50%;
					display: inline-block;
				}
				.agreement-name {
					color: #2956E1;
					font-size: 26rpx;
				}
			}
			.button {
				height: 86rpx;
				display: flex;
				align-items: center;
				justify-content: center;
			}
			.agree-button {
				background: #07C160;
				border-radius: 8rpx;
				font-size: 30rpx;
				color: #fff;
			}
			.disagree-button {
				font-size: 28rpx;
				color: #646A72;
				background-color: #fff;
				&::after {
					border: 0;
				}
			}
		}
	}
}
</style>

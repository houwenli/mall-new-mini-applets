<template>
	<view class="page">
		<wsf-nav-bar
		  @onBackBtnClick="cancel()"
		  :status-bar="true"
		  title="手机号登录"
		  :hasBack="true"
		></wsf-nav-bar>
		<view class="register u-padding-left-50 u-padding-right-50">
			<view class="form">
				<view class="form_itme phone u-border-bottom">
					<u-input
						v-model="mobile"
						:custom-style="{ 'font-size': '32rpx' }"
						placeholder-style="color:#999;font-size:32rpx"
						placeholder="请输入手机号码"
						@blur="onCallInput"
						maxlength="11"
					></u-input>
				</view>
				<view class="hint u-padding-top-10">{{ phoneError }}</view>
				<view class="u-flex form_itme verification_code u-border-bottom">
					<u-input
            :disabled='!codeLength'
						@blur="validateCode"
						class="u-flex-8 u-padding-right-10"
						:custom-style="{ 'font-size': '32rpx' }"
						placeholder-style="color:#999;font-size:32rpx"
						v-model="code"
						placeholder="请输入收到的验证码"
						:maxlength="codeLength"
					></u-input>
					<text class="u-flex-4 u-border-left txt" @click="countdown">{{ tips }}</text>
				</view>
			</view>
			<view class="btns">
				<view class="sub_btn u-padding-top-40">
					<button
						:class="[disabled ? 'weui-btn-disabled' : 'weui-btn', 'u-reset-button']"
						type="warning"
						open-type="getUserInfo"
						@getuserinfo="bindGetUserInfo"
						withCredentials="true"
					>
						登录
					</button>
				</view>
				<view class="u-flex u-row-between u-margin-top-24">
					<!-- <text @click="$wsf.go('Login')">账号密码登录</text> -->
					<!-- <text></text> -->
					<!-- <text @click="$wsf.go('Register')">新用户注册</text> -->
				</view>
			</view>
			<u-verification-code @end="end" @start="start" ref="uCode" @change="codeChange"></u-verification-code>
			<wsf-confirm
				v-model="showConfirm"
				title="点击返回将登录失败, 确认返回？"
				activeText="确定"
				cancelText="取消"
				@confirm="activeConfirm"
				@cancel="activeCancel"
			></wsf-confirm>
		</view>
	</view>
</template>

<script>
import wsfNavBar from "@/components/wsf-nav-bar/wsf-nav-bar.vue";
import memberMixin from '@/mixins/memberMixin.js'

import { SMSCODETYPE, SIGNINTYPE } from '@/common/constants/userinfo'
import { getcodeSmart, signInSignUpApp } from '@/common/smart-api/loginApi'

const app = getApp()
let queryParams
export default {
	components: {
	  wsfNavBar,
	},
	mixins: [memberMixin],
	data() {
		return {
			showConfirm: false,
			canIUse: uni.canIUse('button.open-type.getUserInfo'),
			hasUnionId: app.globalData.hasUnionId,
			tips: '',
			isAgree: false,
			mobile: null, //手机号
			code: null, //验证码
			password: '',
      // 根据后台返回验证码几位数，就能输入几位数字
			codeLength: null
		}
	},
	onLoad: function(option) {
		queryParams = option
	},
	computed: {
		disabled() {
			if (this.mobile && this.code) {
				return false
			} else {
				return true
			}
		},
	},
	methods: {
		// 输入事件
    onCallInput(value) {
      value = (value || '').replace(/\D/g, "");
      this.$nextTick(() => {
        this.mobile = value;
      });
    },
		cancel() {
			this.showConfirm = true
		},
		activeConfirm() {
			uni.navigateBack({
				delta: 1
			})
		},
		activeCancel() {
			this.showConfirm = false
		},
		codeChange(text) {
			this.tips = text
		},
		// 获取验证码
		countdown() {
			if (this.$refs.uCode.canGetCode) {
				if (!this.$u.test.mobile(this.mobile)) {
					this.$u.toast('请输入正确的手机号')
					return
				}
				let data = {
					phone: this.mobile,
					smsCodeType: SMSCODETYPE.signIn
				}
				// this.$u.api
				// 	.getVerificationCode(data)
				getcodeSmart(data)
					.then((res) => {
						let { length } = res.data || {}
						this.codeLength = length
						this.$u.toast('验证码已发送')
						// 通知验证码组件内部开始倒计时
						this.$refs.uCode.start()
					})
					.catch((error) => {

					})
			} else {
				// this.$u.toast('倒计时结束后再发送')
			}
		},
		end() {
			// this.$u.toast('倒计时结束')
		},
		start() {
			// this.$u.toast('倒计时开始')
		},

		// 未授权时的登录
		bindGetUserInfo() {
			if (this.disabled) {
				return
			}
			app.bindGetUserInfo(this.register)
		},
		/* 获取用户信息 */
		queryUserInfo() {
			this.$u.api.CustomerDetail().then(res => {
				if (res.code === 200) {
					uni.setStorageSync('userInfo', res.data)
				}
			});
		},
		// hasUnionId=true时的注册
		register(res) {
			this.hasUnionId = res.hasUnionId
			if (this.disabled) {
				return
			}

			let params = {
				mobile: this.mobile,
				smsCode: this.code,
				openId: uni.getStorageSync('openId'),
				signInType: SIGNINTYPE.messAuth,
				loginSource: 3, // 登录来源 0 pc 1 app 2 mobile 3 appleats 4 wechat
			}
			// this.$u.api
			// 	.verificationCodeLogin(params)
			signInSignUpApp(params)
				.then((res) => {
					if(res.code == 200) {
						let data = res.data || {}
          	let token = data.token

						uni.setStorageSync('newToken', token)
						uni.setStorageSync('phone', this.mobile)
						app.globalData.isLink = true
						this.$store.dispatch('refreshFn',true)
						this.queryUserInfo()

						uni.navigateBack({
							delta: 3
						});
						// 不用校验是否授权了
						// let conditionData = {
			    	// 	phone: this.mobile
			    	// }
			    	// this.$u.api.SelectOneByCondition(conditionData).then(res => {
          	//   if(res.code == 200) {
          	//     let info = res.data
						//     if(!info.id && info.passengerPhone) {
          	//       this.$wsf.go("Authorization",{pageType: 2},'redirectTo');
          	//     } else {
          	//       uni.navigateBack({
						// 			    delta: 3
						// 			});
          	//     }
          	//   }
          	// })
					}
				})
				.catch((err) => {
					let data = err.data || {}
					let { code, msg} = data
					switch(code) {
						case 4004:
						// 用户被锁定
						case 4000:
							this.$u.toast(msg)
							break
						default:
							this.$u.toast('系统错误，请稍后重试~')
					}
					console.log('接口有问题: ', err)
				})
		},
		// 去登录
		navigationTo() {
			this.$wsf.go('QuickLogin')
		},
	},
}
</script>

<style scoped lang="scss">
.page {
	height: 100vh;
	background: #fff;
}
.register {
	width: 100%;
	height: 100%;
	background: #ffffff;
	padding-top: 100rpx;
	.form {
		.form_itme {
			height: 80rpx;
		}
		.hint {
			height: 50rpx;
			font-size: 28rpx;
			color: #e60113;
		}
		.explain {
			text-align: center;
			height: 22px;
			font-size: 28rpx;
			font-weight: 400;
			color: #bababa;
			line-height: 22px;
		}
		.verification_code {
			.txt {
				text-align: center;
				color: #999;
				font-size: 28rpx;
			}
		}
	}
	.btns {
		.sub_btn {
			.weui-btn {
				height: 50px;
				line-height: 50px;
				border-radius: 25px;
				background: #e60113;
				// background: #fbd2d5;
				color: #ffffff;
				font-size: 32rpx;
				letter-spacing: 15rpx;
			}
			.weui-btn-disabled {
				height: 50px;
				line-height: 50px;
				border-radius: 25px;
				background: #fbd2d5;
				color: #ffffff;
				font-size: 32rpx;
				letter-spacing: 15rpx;
			}
		}
		// padding: 20rpx 40rpx 0 40rpx;
		.checkbox {
			/deep/ .u-checkbox {
				width: 20px;
			}
			.txt {
				color: $u-type-primary-dark;
			}
		}
	}
}
</style>

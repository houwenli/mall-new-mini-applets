<template>
	<view class="register u-padding-left-50 u-padding-right-50">
		<view class="form">
			<view class="form_itme phone u-border-bottom">
				<u-input
					@blur="phone"
					:custom-style="{ 'font-size': '32rpx' }"
					placeholder-style="color:#999;font-size:32rpx"
					v-model="mobile"
					placeholder="请输入11位手机号码"
				></u-input>
			</view>
			<view class="hint u-padding-top-10">{{phoneError}}</view>
			<view class="u-flex form_itme verification_code u-border-bottom">
				<u-input
					@blur="validateCode"
					class="u-flex-8"
					:custom-style="{ 'font-size': '32rpx' }"
					placeholder-style="color:#999;font-size:32rpx"
					v-model="code"
					placeholder="请输入验证码"
				></u-input>
				<text class="u-flex-4 u-border-left txt" @click="countdown">{{ tips }}</text>
			</view>
			<view class="hint u-padding-top-10">{{codeError}}</view>
			<view class="form_itme password u-border-bottom">
				<u-input
					class=""
					@blur="passwordBlur"
					:custom-style="{ 'font-size': '32rpx' }"
					placeholder-style="color:#999;font-size:32rpx"
					type="password"
					v-model="password"
					placeholder="6-20位字母+数字或符号组合"
				></u-input>
			</view>
			<view class="hint u-padding-top-10">{{passwordError}}</view>
		</view>
		<view class="btns">
			<button :class="[disabled ? 'weui-btn-disabled' : 'weui-btn', 'u-reset-button']" @click="updatePwd">确认</button>
		</view>
		<u-verification-code @end="end" @start="start" ref="uCode" @change="codeChange"></u-verification-code>
	</view>
</template>

<script>
import memberMixin from '../../mixins/memberMixin.js'
export default {
	mixins:[memberMixin],
	data() {
		return {
			tips: '',
			mobile: null, //手机号
			code: null, //验证码
			password: '',
		}
	},
	computed: {
		disabled() {
			if(this.mobile && this.code && this.password){
				return false
			}else {
				return true
			}
		}
	},
	methods: {
		codeChange(text) {
			this.tips = text
		},
		countdown() {
			if (this.$refs.uCode.canGetCode) {
				if (!this.$u.test.mobile(this.mobile)) {
					this.$u.toast('请输入正确的手机号!')
					return
				}
				// 验证手机号是否已注册
				this.$u.api
					.UpdatepwdCheckmobileexist({ mobile: this.mobile })
					.then((res) => {
						this.forgetPwdSendCode()
						/* console.log('验证手机号是否已注册', res)
						if (res.data === 0) {
							this.$u.toast('您的手机号还没有注册过!')
						} else {
							this.forgetPwdSendCode()
						} */
					})
					.catch((error) => {
						console.log('接口有问题: ', error)
					})
			} else {
				// this.$u.toast('倒计时结束后再发送')
			}
		},
		// 获取验证码 0 成功 -1失败
		forgetPwdSendCode() {
			this.$u.api
				.ForgetPwdSendCode({ mobile: this.mobile })
				.then((res) => {
					console.log('验证码接口', res)
					if (res === -1) {
						this.$u.toast('验证码发送失败，请稍后重试')
						return
					}
					// 这里此提示会被this.start()方法中的提示覆盖
					this.$u.toast('验证码已发送')
					// 通知验证码组件内部开始倒计时
					this.$refs.uCode.start()
				})
				.catch((error) => {
					console.log('接口有问题: ', error)
				})
		},
		end() {
			// this.$u.toast('倒计时结束')
		},
		start() {
			// this.$u.toast('倒计时开始')
		},
		// 更改密码
		updatePwd() {
			// if (!this.$u.test.mobile(this.mobile)) {
			// 	this.$u.toast('请输入正确的手机号')
			// 	return
			// }
			// if (!this.code) {
			// 	this.$u.toast('请输入验证码')
			// 	return
			// }
			// if (!this.password) {
			// 	this.$u.toast('请输入密码')
			// 	return
			// }
			if(this.disabled){return}
			let params = {
				mobile: this.mobile,
				code: this.code,
				password: this.password,
			}
			this.$u.api
				.ForgetPwdUpdatePwd(params)
				.then((res) => {
					this.$wsf.go('Login')
					console.log("这里好像有问题");
				})
				.catch((error) => {
					console.log('接口有问题', error)
					// this.$u.toast(error.data.description)
				})
		},
	},
}
</script>

<style scoped lang="scss">
.register {
	width: 100%;
	height: 100%;
	box-sizing: border-box;
	background: #ffffff;
	padding-top: 60px;
	.form {
		.form_itme {
			height: 80rpx;
		}
		.hint {
			height: 50rpx;
			font-size: 28rpx;
			color: #e60113;
		}
		.verification_code {
			.txt {
				text-align: center;
				color: #999999;
			}
		}
	}
	.btns {
		padding-top: 20px;
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
}
</style>

<template>
	<view class="register u-padding-left-50 u-padding-right-50">
		<view class="form">
			<view class="form_itme phone u-border-bottom">
				<u-input
					@blur="phone"
					v-model="mobile"
					:custom-style="{ 'font-size': '32rpx' }"
					placeholder-style="color:#999;font-size:32rpx"
					placeholder="请输入手机号码"
				></u-input>
			</view>
			<view class="hint u-padding-top-10">{{ phoneError }}</view>
			<view class="u-flex form_itme verification_code u-border-bottom">
				<u-input
					@blur="validateCode"
					class="u-flex-8 u-padding-right-10"
					:custom-style="{ 'font-size': '32rpx' }"
					placeholder-style="color:#999;font-size:32rpx"
					v-model="code"
					placeholder="请输入收到的验证码"
				></u-input>
				<text class="u-flex-4 u-border-left txt" @click="countdown">{{ tips }}</text>
			</view>
			<view class="hint u-padding-top-10">{{ codeError }}</view>
			<view class="form_itme password u-border-bottom">
				<u-input
					@blur="passwordBlur"
					:custom-style="{ 'font-size': '32rpx' }"
					placeholder-style="color:#999;font-size:32rpx"
					type="password"
					v-model="password"
					placeholder="设置登录密码"
				></u-input>
			</view>
			<view class="hint u-padding-top-10">{{ passwordError }}</view>
			<view class="explain">必须由6-20字母、数字、下划线组成，至少包含两种</view>
			<!-- <view class="u-flex form_itme referral_code">
				<text class="u-flex-3 u-padding-right-10">推荐码</text>
				<u-input class="" v-model="recommendCode" placeholder="请输入推荐码"></u-input>
			</view> -->
		</view>
		<view class="btns">
			<!-- <view class="u-flex u-col-center checkbox">
				<u-checkbox v-model="isAgree" active-color="#19BD6B" size="30"></u-checkbox>
				<text>阅读并同意</text>
				<navigator url="registerProtocol" class="txt">《万顺福商城注册协议》</navigator>
			</view> -->
			<view class="sub_btn u-padding-top-40">
				<button
					:class="[disabled ? 'weui-btn-disabled' : 'weui-btn', 'u-reset-button']"
					type="warning"
					open-type="getUserInfo"
					@getuserinfo="bindGetUserInfo"
					withCredentials="true"
				>
					确认
				</button>
				<!-- <button :class="[disabled ? 'weui-btn-disabled' : 'weui-btn', 'u-reset-button']" v-if="hasUnionId" type="warning" @click="register">
					确认
				</button> -->
			</view>
		</view>
		<u-verification-code @end="end" @start="start" ref="uCode" @change="codeChange"></u-verification-code>
	</view>
</template>

<script>
import memberMixin from '@/mixins/memberMixin.js'
const app = getApp()
let queryParams
export default {
	mixins: [memberMixin],
	data() {
		return {
			isGoIndexShowCoupon: false,
			canIUse: uni.canIUse('button.open-type.getUserInfo'),
			hasUnionId: app.globalData.hasUnionId,
			tips: '',
			isAgree: false,
			mobile: null, //手机号
			code: null, //验证码
			password: '',
			recommendCode: null, //推荐码
		}
	},
	onShow: function() {
		let that = this
		//调用登录接口查询是否已绑定过账号
		app.checkBind(queryParams).then(() => {
			// that.setData({
			this.hasUnionId = app.globalData.hasUnionId
			// })
		})
	},
	onLoad: function(option) {
		console.log(option, 'option')
		queryParams = option
	},
	computed: {
		disabled() {
			if (this.mobile && this.code && this.password) {
				return false
			} else {
				return true
			}
		},
	},
	methods: {
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
				this.$u.api
					.RegisterSendCode({ mobile: this.mobile })
					.then((res) => {
						console.log(res, '注册验证码')
						this.$u.toast('验证码已发送')
						// 通知验证码组件内部开始倒计时
						this.$refs.uCode.start()
					})
					.catch((error) => {
						console.log('接口有问题', error)
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
		getUserInfo() {
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
				mobilePhone: this.mobile,
				code: this.code,
				password: this.password,
				referccsCode: this.recommendCode ? this.recommendCode : '',
				openId: uni.getStorageSync("openId")
			}
			this.$u.api
				.Registers(params)
				.then((res) => {
					this.isGoIndexShowCoupon = res.data == 2 ? true : false
					console.log(res, '注册接口')
					let params = {
						username: this.mobile,
						password: this.password,
						openId: uni.getStorageSync("openId")
					}
					this.$u.api
						.BindAccount(params)
						.then((res) => {
							console.log('注册接口数据', res)
							uni.setStorageSync('newToken', res.data)
							app.globalData.isLink = true
							this.getUserInfo()
							console.log('this.isGoIndexShowCoupon',this.isGoIndexShowCoupon);
							if(this.isGoIndexShowCoupon) {
								this.$store.commit("SET_INDEXCOUPONOPEN", true)
								this.$wsf.go('Index');
							} else {
								app.returnRoute(queryParams)
							}
						})
						.catch((error) => {
							console.log('接口有问题: ', error)
						})
				})
				.catch((error) => {
					console.log('注册接口有问题: ', error)
					// -1 手机验证码错误 -2 参数错误 -3 手机号码已存在 0 失败  成功>0 -10 推荐人不存在
					/* if (error.data.code === 10) {
						this.$u.toast('推荐人不存在')
						return
					}
					if (error.data.code === -1) {
						this.$u.toast('手机验证码错误')
						return
					}
					if (error.data.code === -2) {
						this.$u.toast('缺少参数')
						return
					}
					if (error.data.code === -3) {
						this.$u.toast('手机已经注册过')
						return
					} */
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

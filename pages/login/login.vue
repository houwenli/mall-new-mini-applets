<template>
	<view class="login u-padding-left-50 u-padding-right-50">
		<view class="form">
			<view class="user_name u-flex u-border-bottom">
				<u-input
					:hold-keyboard="true"
					@blur="userNameBlur"
					class="u-flex-9 u-padding-right-10"
					:custom-style="{ 'font-size': '32rpx' }"
					v-model="username"
					type="text"
					placeholder="用户名/手机号"
					placeholder-style="color:#999;font-size:32rpx"
				></u-input>
			</view>
			<view class="hint u-padding-top-10">{{ userNameError }}</view>
			<view class="password u-flex u-border-bottom">
				<wsf-input
					:hold-keyboard="true"
					@blur="passwordBlur"
					:custom-style="{ 'font-size': '32rpx' }"
					v-model="password"
					class="u-flex-12"
					type="password"
					placeholder="请输入密码"
					placeholder-style="color:#999;font-size:32rpx"
				></wsf-input>
				<view class="forget_password u-border-left" @click="navigationTo('ForgetPwd')">忘记密码</view>
			</view>
			<view class="hint u-padding-top-10">{{ passwordError }}</view>
		</view>
		<view class="btns">
			<!-- <button
				:class="[disabled ? 'weui-btn-disabled' : 'weui-btn', 'u-reset-button']"
				open-type="getUserInfo"
				@getuserinfo="bindGetUserInfo"
				withCredentials="true"
			>
				登录
			</button> -->
			<button
				:class="[disabled ? 'weui-btn-disabled' : 'weui-btn', 'u-reset-button']"
				@click="bindGetUserInfo"
				withCredentials="true"
			>
				登录
			</button>
		</view>
		<!-- <u-button @click="navigationTo('Register')">手机号快速注册</u-button> -->
		<view class="u-flex u-row-between btn_lr">
			<text @click="navigationTo('TextLogin')">短信验证码登录</text>
			<text></text>
			<text @click="navigationTo('Register')">新用户注册</text>
		</view>
	</view>
</template>

<script>
import memberMinix from '../../mixins/memberMixin.js'
import wsfInput from '../../components/wsf-input/wsf-input.vue'

const app = getApp()
let queryParams = ''
export default {
	mixins: [memberMinix],
	components: {
		wsfInput
	},
	data() {
		return {
			canIUse: uni.canIUse('button.open-type.getUserInfo'),
			hasUnionId: app.globalData.hasUnionId,
			showTopTips: false,
			passwordWarn: false,
			usernameWarn: false,
			username: '',
			password: '',
		}
	},
	onLoad: function(option) {
		queryParams = option
		console.log(queryParams, 'eeee')
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
	computed: {
		disabled() {
			if (this.username && this.password) {
				return false
			} else {
				return true
			}
		},
	},
	methods: {
		/* 获取用户信息 */
		getUserInfo() {
			this.$u.api.CustomerDetail().then(res => {
				if (res.code === 200) {
					uni.setStorageSync('userInfo', res.data)
				}
			});
		},
		// 未授权时的登录
		bindGetUserInfo() {
			if (this.disabled) {
				return
			}
			app.bindGetUserInfo(this.bindAccount)
		},
		// 已授权时的登录
		bindAccount: function(res) {
			let that = this
			if (this.disabled) {
				return
			}
			console.log(1, res)
			this.userNameError = ''
			this.passwordError = ''
			this.hasUnionId = res.hasUnionId
			// -1 用户名或密码错误  -2 账号冻结  -3 账号锁定 1 成功  -4 验证码错误
			let params = {
				username: this.username,
				password: this.password,
				openId: uni.getStorageSync("openId")
			}
			this.$u.api
				.BindAccount(params)
				.then((res) => {
					if(res.code == 200) {
						console.log('登录接口数据: ', res)
						app.globalData.newToken = res.data
						uni.setStorageSync('newToken', res.data)
						app.globalData.isLink = true
						this.getUserInfo()
						that.$store.dispatch('refreshFn',true)
						let conditionData = {
			    		phone: app.globalData.phone
			    	}
			    	this.$u.api.SelectOneByCondition(conditionData).then(res => {
          	  if(res.code == 200) {
          	    let info = res.data
						    if(!info.id && info.passengerPhone) {
          	      this.$wsf.go("Authorization",{pageType: 2},'redirectTo');
          	    } else {
          	      uni.navigateBack({
									    delta: 2
									});
          	    }
          	  }
          	})
					}
				})
				.catch((error) => {
					console.log('接口有问题', error)
				})
		},
		/* 跳转 */
		navigationTo(sceneName) {
			console.log(sceneName,"跳转");
			this.$wsf.go(sceneName,{})
		},
	},
}
</script>

<style scoped lang="scss">
.login {
	width: 100%;
	height: 100%;
	background-color: #ffffff;
	box-sizing: border-box;
	padding-top: 60px;
	.form {
		.password {
			.forget_password {
				font-size: 28rpx;
				color: #999999;
				border: none;
				padding-left: 40rpx;
				padding-right: 40rpx;
				margin-left: 40rpx;
			}
		}
		.hint {
			height: 50rpx;
			font-size: 28rpx;
			color: #e60113;
		}
	}
	.btns {
		padding-top: 6px;
		padding-bottom: 20px;
		.weui-btn {
			height: 50px;
			line-height: 50px;
			border-radius: 25px;
			background: #e60113;
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
		.btn_lr {
			font-size: 28rpx;
			color: #666;
		}
	}
}
</style>

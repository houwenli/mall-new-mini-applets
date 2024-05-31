<template>
	<view>
		<u-top-tips ref="uTips"></u-top-tips>
		<u-cell-group>
			<u-cell-item :title-width="200" title="手机号码" :arrow="false">
				<u-input v-model="hideMobile" type="text" :border="false" maxlength="11" :disabled="true" />
			</u-cell-item>
			<u-cell-item :title-width="200" title="验证码" :arrow="false" :title-style="{ color: codeWarn }">
				<view class="flex-item">
					<view class="flex-left"><u-input v-model="code" type="text" :border="false" maxlength="10" placeholder="请输入验证码" /></view>
					<view class="flex-right">
						<view v-if="canSendCode" class="vcode-btn" @click="sendCode">获取验证码</view>
						<view v-else class="vcode-btn" style="color: rgb(204, 204, 204);">重新发送({{ countDown }})</view>
					</view>
				</view>
			</u-cell-item>
			<u-cell-item :title-width="200" title="设置支付密码" :arrow="false" :title-style="{ color: passwordWarn }">
				<u-input v-model="password" :password-icon="true" type="password" :border="false" maxlength="20" placeholder="6-20位字母+数字或符号的组合" />
			</u-cell-item>
		</u-cell-group>
		<view class="page__bd">
			<!-- <u-button type="warning" @click="updatePwd">保存</u-button> -->
			<button
				:class="[disabled ? 'weui-btn-disabled' : 'weui-btn', 'u-reset-button']"
				type="warning"
				@click="updatePwd"
				withCredentials="true"
			>
			保存
			</button>
		</view>
	</view>
</template>

<script>
const app = getApp();
export default {
	data() {
		return {
			mobile: '',
			hideMobile: '',
			code: '',
			password: '',
			passwordWarn: '',
			codeWarn: '',
			canSendCode: true,
			countDown: 60,
			interval: null
		};
	},
	computed: {
		disabled() {
			if (this.code && this.password) {
				return false
			} else {
				return true
			}
		},
	},
	onLoad(option) {
		if(option.mobile) {
			this.mobile = option.mobile;
			this.hideMobile = this.getHideMobile(option.mobile);
		}else {
			this.getPhone()
		}
		
	},
	methods: {
		getPhone() {
			this.$u.api.CustomerDetail().then(res => {
				this.mobile = res.data.mobile;
				this.hideMobile = this.getHideMobile(this.mobile);
			});
		},
		showToastError(errMsg, duration = 1500) {
			uni.showToast({
				title: errMsg,
				icon: 'none',
				mask: true,
				duration: duration
			});
		},
		showTopTips(errorMsg, type = 'error', duration = 1500) {
			this.$refs.uTips.show({
				title: errorMsg,
				type: type,
				duration: duration
			});
		},
		sendCode() {
			let that = this;
			this.canSendCode = false;
			if (!!this.interval) {
				clearInterval(this.interval);
			}
			this.interval = setInterval(function() {
				if (that.countDown === 0) {
					clearInterval(that.interval);
					that.canSendCode = true;
					that.countDown = 60;
				} else {
					that.countDown = that.countDown - 1;
				}
			}, 1000);
			this.$u.api.UpdatePayPwdSendCode().then(res => {
				if (res.code != 200) {
					this.showToastError('验证码发送失败，请稍后重试');
				}
			});
		},
		updatePwd() {
			if(this.disabled) return
			if (!this.code) {
				this.codeWarn = 'red';
				this.showTopTips('请输入验证码');
				return;
			} else {
				this.codeWarn = '';
			}
			if (!this.password) {
				this.passwordWarn = 'red';

				this.showTopTips('请输入支付密码');
				return;
			} else {
				this.passwordWarn = '';
			}
			let data = {
				mobile: this.mobile,
				code: this.code,
				password: this.password
			};
			this.$u.api.UpdatePayPwdUpdate(data).then(res => {
				if (res.code == 200) {
					this.showToastError('更改成功');
					app.navigateBack(500);
				}
			});
		},
		getHideMobile(mobile) {
			if (!!mobile) {
				return mobile.substring(0, 3) + '****' + mobile.substring(7);
			} else {
				return '';
			}
		}
	}
};
</script>

<style scoped lang="scss">
.flex-item {
	display: flex;
	.flex-left {
		flex: 2;
	}
	.flex-right {
		flex: 1;
		.vcode-btn {
			display: inline-flex;
			align-items: center;
			justify-content: center;
			color: $wsf-color-red;
			height: 100%;
		}
	}
}
.page__bd {
		padding: 15px;
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
		.describe{
			width: 100%;
			text-align: center;
			padding-top: 24rpx;
			text {
				font-size: 24rpx;
				font-weight: 400;
				color: #999999;
			}
			
		}
	}
</style>

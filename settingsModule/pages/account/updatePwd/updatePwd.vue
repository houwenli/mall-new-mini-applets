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
			<u-cell-item :title-width="200" title="设置密码" :arrow="false" :title-style="{ color: passwordWarn }">
				<u-input v-model="password" :password-icon="true" type="password" :border="false" maxlength="20" placeholder="6-20位字母+数字或符号的组合" />
			</u-cell-item>
		</u-cell-group>
		<!-- <view class="page__bd"><u-button type="warning" @click="updatePwd">保存</u-button></view> -->
		<view class="page__bd"><wsf-btn @click="updatePwd">保存</wsf-btn></view>
	</view>
</template>

<script>
import wsfBtn from '@/components/wsf-btn/wsf-btn.vue'
const app = getApp();
export default {
	components:{
		wsfBtn
	},
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
	onLoad(option) {
		this.mobile = option.mobile;
		this.hideMobile = this.getHideMobile(option.mobile);
	},
	methods: {
		showToastError(errMsg, duration = 1500) {
			uni.showToast({
				title: errMsg,
				icon: 'none',
				mask: true,
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
			this.$u.api.UpdatePwdSendCode().then(res => {
				if (res.code != 200) {
					this.showToastError('验证码发送失败，请稍后重试');
				}
			});
		},
		updatePwd() {
			if (!this.code) {
				this.codeWarn = 'red';
				this.showTopTips('请输入验证码');
				return;
			} else {
				this.codeWarn = '';
			}
			if (!this.password) {
				this.passwordWarn = 'red';
				this.showTopTips('请输入密码');
				return;
			} else {
				this.passwordWarn = '';
			}
			let data = {
				mobile: this.mobile,
				code: this.code,
				password: this.password
			};
			this.$u.api.UpdatePwdUpdate(data).then(res => {
				if (res.code === 200) {
					this.showToastError('更改成功');
					app.navigateBack(500);
				}
			});
		},
		showTopTips(errorMsg, type = 'error', duration = 1500) {
			this.$refs.uTips.show({
				title: errorMsg,
				type: type,
				duration: duration
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
}
</style>

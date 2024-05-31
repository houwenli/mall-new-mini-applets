<template>
	<view class="phone-valid">
		<u-top-tips ref="uTips"></u-top-tips>
		<template v-if="binding">
			<view class="cue-words">
				<text>绑定后可提高账号安全性，下次还可以用该手机登录万顺福</text>
			</view>
			<view class="mobile">{{hideMobile}}</view>
			<view class="txt">你已绑定手机</view>
			<view class="btn">
				<wsf-btn @click="changeBinding">更换绑定</wsf-btn>
			</view>
		</template>
		<template v-if="!binding">
			<view class="u-padding-left-40 u-padding-right-40">
				<u-cell-group :border="false">
					<u-cell-item v-if="!handleType" :title-width="220" title="原绑定手机号码:" :arrow="false" placeholder="请输入手机号码" :title-style="{ color: mobileWarn }">
						<u-input v-model="hideMobile" type="text" :border="false" maxlength="11" :disabled="!handleType" />
					</u-cell-item>
					<u-cell-item v-else :arrow="false" placeholder="请输入手机号码" :title-style="{ color: mobileWarn }">
						<u-input v-model="mobile" placeholder="请输入手机号码" type="text" :border="false" maxlength="11" />
					</u-cell-item>
					<u-cell-item class="u-border-top" :arrow="false" :title-style="{ color: codeWarn }">
						<view class="flex-item">
							<view class="flex-left"><u-input v-model="code" type="text" :border="false" maxlength="10" placeholder="请输入收到的短信验证码" /></view>
							<view class="u-border-left flex-right">
								<view v-if="canSendCode" class="vcode-btn" @click="sendCode">获取验证码</view>
								<view v-else class="vcode-btn" style="color: rgb(204, 204, 204);">重新发送({{ countDown }})</view>
							</view>
						</view>
					</u-cell-item>
				</u-cell-group>
			</view>
			<view class="page__bd">
				<!-- <u-button type="warning" @click="handleMobile">{{ handleType == 0 ? '验证手机' : '绑定新手机' }}</u-button> -->
				<button
					:class="[disabled ? 'weui-btn-disabled' : 'weui-btn', 'u-reset-button']"
					type="warning"
					withCredentials="true"
					@click="next"
				>
					{{nextTxt}}
				</button>
				<view class="describe">
					<text>更换绑定后可使用新手机号登录万顺福商城</text>
				</view>
			</view>
		</template>
		<wsf-confirm
			v-model="showConfirm"
			:hideConfirm="true"
			:title="'绑定成功'"
			@cancel="activeCancel"
		>
		<view style="text-align: center;font-size: 28rpx;font-weight: 400;color: #666666;" slot="context">
			你可使用此手机号登录当前账号
		</view>
		</wsf-confirm>
	</view>
</template>

<script>
const app = getApp();
import wsfBtn from '@/components/wsf-btn/wsf-btn.vue'
import wsfConfirm from '@/components/wsf-confirm/wsf-confirm.vue';
export default {
	components: {
		wsfBtn
	},
	data() {
		return {
			nextTxt:'下一步',
			binding: true,
			handleType: 0, //0验证,1更换
			mobile: '',
			hideMobile: '',
			code: '',
			codeWarn: '',
			mobileWarn: '',
			canSendCode: true,
			countDown: 60,
			interval: null,
			showConfirm: false,
		};
	},
	computed: {
		disabled() {
			console.log(this.handleType,"this.handleType");
			if(this.handleType == 1){
				if ((this.code && this.code.length===6) && (this.mobile && this.mobile.length === 11)) {
					return false
				} else {
					return true
				}
			}else {
				if (this.code && this.code.length===6) {
					return false
				} else {
					return true
				}
			}
			
		},
	},
	onLoad(option) {
		this.mobile = option.mobile;
		this.hideMobile = this.getHideMobile(option.mobile);
	},
	methods: {
		// 更换绑定手机号
		changeBinding(){
			this.binding = !this.binding
			uni.setNavigationBarTitle({
				title:"更换绑定手机号"
			})
		},
		// 点击了取消按钮
		activeCancel() {
			// if (this.showConfirmType == 1) {
			// 	uni.navigateBack({
			// 		delta: 1
			// 	});
			// }
			app.navigateBack(500);
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
			if (this.handleType == 0) {
				this.$u.api.BindNewMobileSendOldCode().then(res => {
					if (res.code != 200) {
						this.showToastError('验证码发送失败，请稍后重试');
					}
				});
			} else if (this.handleType == 1) {
				let data = { mobile: this.mobile };
				this.$u.api.CheckMobileExist(data).then(res => {
					if (res.code != 200) {
						this.showToastError('验证码发送失败，请稍后重试');
					}else {
						this.BindNewMobileSendNewCode(data)
					}
					
					
				});
			}
		},
		BindNewMobileSendNewCode(data){
			this.$u.api.BindNewMobileSendNewCode(data).then(res => {
				console.log(res,"___________");
			})
		},
		
		next(){
			if(!this.disabled){
				this.handleMobile()
			}
		},
		handleMobile() {
			if (this.handleType == 0) {
				if (!this.code) {
					this.codeWarn = 'red';

					this.showTopTips('请输入验证码');
					return;
				} else {
					this.codeWarn = '';
				}
				let that = this;
				let data = {
					code: this.code,
					mobile: this.mobile
				};
				this.$u.api.BindNewMobileValidateOldCode(data).then(res => {
					if (res.code == 200) {
						this.handleType = 1;
						if (!!this.interval) {
							clearInterval(this.interval);
						}
						that.canSendCode = true;
						that.countDown = 60;
						this.nextTxt = '立即绑定'
						this.code = '';
						this.mobile = '';
						this.showTopTips('验证成功,请绑定新手机','success');
						uni.setNavigationBarTitle({
							title: '绑定新手机'
						});
					}
				});
			} else if (this.handleType == 1) {
				if (!this.mobile || !/1\d{10}/.test(this.mobile)) {
					this.mobileWarn = 'red';
					this.showTopTips('请输入正确的手机号');
					return;
				} else {
					this.mobileWarn = '';
				}
				if (!this.code) {
					this.codeWarn = 'red';
					this.showTopTips('请输入验证码');
					return;
				} else {
					this.codeWarn = '';
				}
				let data = {
					mobile: this.mobile,
					code: this.code
				};
				this.$u.api.BindNewMobileUpdate(data).then(res => {
					this.showConfirm = true
					// if (res.code == 200) {
					// 	this.showToastError('更新成功');
					// 	app.navigateBack(500);
					// }
				});
			}
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
.phone-valid {
	width: 100%;
	height: 100%;
	background: #FFFFFF;
	.cue-words {
		width: 100%;
		height: 76rpx;
		padding: 0 24rpx;
		background: #EEFBEB;
		text {
			font-size: 24rpx;
			font-weight: 400;
			color: #56AD3F;
			line-height: 76rpx;
		}
	}
	
	.mobile {
		padding-top: 160rpx;
		text-align: center;
		width: 100%;
		font-size: 48rpx;
		font-weight: 400;
		color: #000000;
	}
	.txt {
		padding-top: 24rpx;
		padding-bottom: 64rpx;
		text-align: center;
		width: 100%;
		font-size: 24rpx;
		font-weight: 400;
		color: #999999;
	}
	.btn {
		padding: 0 50rpx;
	}
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
}

</style>

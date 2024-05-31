<template>
	<view>
		<u-cell-group>
			<u-cell-item title="昵称" :arrow="true" arrow-direction="right" @click="changeNickName">{{ nickName }}</u-cell-item>
			<!-- <u-cell-item title="性别" :arrow="true" arrow-direction="right" @click="showGenderPicker = true">
				<view>{{ gender }}</view>
				<u-picker mode="selector" v-model="showGenderPicker" :default-selector="[0]" :range="selectorObj" range-key="cateName" @confirm="changeGender"></u-picker>
			</u-cell-item> -->
			<u-cell-item title="用户名" :arrow="true" arrow-direction="right" @click="changeUserName">
				<view>{{ userName ? userName : '设置个性昵称' }}</view>
			</u-cell-item>
			<u-cell-item title="修改密码" :arrow="true" arrow-direction="right" @click="updatePwd"></u-cell-item>
			<!-- <u-cell-item title="手机号码" :arrow="true" arrow-direction="right" @click="bindNewMobile"></u-cell-item> -->
			<!-- <u-cell-item title="地址管理" :arrow="true" arrow-direction="right" @click="addressList"></u-cell-item> -->
			<!-- <u-cell-item title="出生日期" @click="showTimePicker = true" :arrow="true" arrow-direction="right">
				<view>{{ date }}</view>
				<u-picker mode="time" v-model="showTimePicker" @confirm="bindDateChange"></u-picker>
			</u-cell-item> -->
		</u-cell-group>
		<view class="btn" v-if="!isWsUser" @click="unBindAccount">退出登录</view>
		<!-- <u-cell-group title="地址管理"><u-cell-item title="收货地址管理" :arrow="true" arrow-direction="right" @click="addressList"></u-cell-item></u-cell-group>
		<u-cell-group title="账户安全">
			<u-cell-item title="修改密码" :arrow="true" arrow-direction="right" @click="updatePwd"></u-cell-item>
			<u-cell-item title="手机验证" :arrow="true" arrow-direction="right" @click="bindNewMobile"></u-cell-item>
			<u-cell-item title="支付设置" :arrow="true" arrow-direction="right" @click="updatePayPwd"></u-cell-item>
		</u-cell-group> -->
		<!-- <view class="footer_btn" :class="{ 'footer-iphonex-btn': isIphoneX }"><u-button type="warning" @click="unBindAccount">退出登录</u-button></view> -->
	</view>
</template>

<script>
import { uploadFile } from '@/common/uploadFile.js';
const app = getApp();

let id = null
export default {
	data() {
		return {
			selectorObj: [
				{
					cateName: '保密',
					id: 0
				},
				{
					cateName: '男',
					id: 1
				},
				{
					cateName: '女',
					id: 2
				}
			],
			userName: null,
			nickName: '',
			userImg: '',
			gender: '',
			date: '',
			mobile: '',
			customer: {},
			isIphoneX: app.globalData.isIphoneX,
			showTimePicker: false,
			showGenderPicker: false,
			isWsUser: 0
		};
	},
	onShow() {
		this.getUserInfo();
		this.isWsUser = uni.getStorageSync('isWsUser')
	},
	methods: {
		/* 跳转 */
		navigateTo(sceneName, params) {
			// this.$wsf.go('Login')
			this.$wsf.go(sceneName, params);
		},
		unBindAccount() {
			this.$u.api.UnBindAccount().then(res => {
				app.globalData.isLink = false;
				app.globalData.newToken = null
				uni.removeStorageSync("newToken")
				uni.removeStorageSync("userInfo")
				uni.switchTab({
					url: '/pages/index/index'
				});
				this.$store.commit("SET_DISTRIBUTION",false)
			});
		},
		chooseImageToUpload() {
			let that = this;
			uni.chooseImage({
				count: 1,
				success: res => {
					uploadFile(res.tempFilePaths[0]).then(res => {
						that.customer.image = res.data;
						that.updateCustomerInfo();
					});
				}
			});
		},
		changeGender(data) {
			this.customer.gender = data[0];
			this.updateCustomerInfo();
		},
		bindDateChange(data) {
			this.customer.birthday = data.year + '-' + data.month + '-' + data.day + ' 00:00:00';
			this.updateCustomerInfo();
		},
		changeNickName() {
			this.navigateTo('AccountName', { nickName: this.nickName, gender: this.customer.gender});
		},
		changeUserName() {
			if (this.isUpdate > 0) {
				this.$u.toast('您已修改过一次用户名,不可继续修改')
				return
			}
			this.navigateTo('AccountName', { userName: this.userName,isUpdate:this.isUpdate,id });
		},
		getUserInfo() {
			this.$u.api.CustomerDetail().then(res => {
				console.log(res,"用户信息");
				id = res.data.id
				this.nickName = res.data.nickName ? res.data.nickName : '';
				this.userName = res.data.userName
				this.userImg = res.data.image;
				this.isUpdate = res.data.isUpdate
				this.gender = this.getGenderName(res.data.gender);
				this.date = !!res.data.birthday ? res.data.birthday.split(' ')[0] : '1900-01-01';
				this.mobile = res.data.mobile;
				this.customer = res.data;
			});
		},
		updateCustomerInfo() {
			let that = this;
			let data = JSON.stringify(this.customer);
			console.log(this.customer, 'data');
			this.$u.api
				.UpdateCustomerInfo(data)
				.then(res => {
					this.showToastError('更新成功');
					that.getUserInfo();
				})
				.catch(err => {
					this.showToastError('更新用户信息失败');
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
		updatePwd() {
			this.navigateTo('UpdatePwd', { mobile: this.mobile });
		},
		updatePayPwd() {
			this.navigateTo('UpdatePayPwd', { mobile: this.mobile });
		},
		bindNewMobile() {
			this.navigateTo('BindNewMobile', { mobile: this.mobile });
		},
		addressList() {
			this.navigateTo('AddressList');
		},
		getGenderName(gender) {
			switch (gender) {
				case '0':
					return '保密';
				case '1':
					return '男';
				case '2':
					return '女';
				default:
					return '保密';
			}
		}
	}
};
</script>

<style scoped lang="scss">
.person_img {
	width: 90.5rpx;
	height: 90.5rpx;
	border-radius: 45.24rpx;
}
.footer_btn {
	box-sizing: border-box;
	position: fixed;
	bottom: 0;
	padding: 10px;
	width: 100%;
	background: #fff;
	border-top: solid 1px #eee;
	z-index: 5;
}

.footer-iphonex-btn {
	padding-bottom: 29px;
}
.btn {
	margin-top: 24rpx;
	width: 100%;
	height: 90rpx;
	line-height: 90rpx;
	background: #FFFFFF;
	border-radius: 20rpx;
	font-size: 24rpx;
	font-weight: 400;
	color: #000000;
	text-align: center;
}
</style>

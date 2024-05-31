<template>
	<view>
		<wsf-nav-bar @onBackBtnClick="clickBackBtn" :status-bar="true" :title="addressId > 0 ? '编辑收货地址' : '新增收货地址'" bg-color="#FFFFFF" :hasBack="true">
			<!-- <view slot="title" v-if="showSearchBar">我的</view> -->
		</wsf-nav-bar>
		<view class="applet-address-edit">
			<view class="applet-address-edit-header">
				<!-- 收货人 -->
				<u-field
					class="applet-address-edit-field"
					:border-bottom="false"
					:field-style="fieldStyle"
					v-model="addressInfo.name"
					label="收货人"
					placeholder="请填写收货人姓名"
					placeholder-style="color:#BABABA"
					@input="hasChange = true"
				></u-field>
				<u-line color="#f2f2f2" />
				<!-- 手机号码 -->
				<u-field
					@input="hasChange = true"
					class="applet-address-edit-field"
					:border-bottom="false"
					:field-style="fieldStyle"
					v-model="addressInfo.originMobile"
					label="手机号"
					maxlength="11"
					placeholder="请填写收货人手机号"
					placeholder-style="color:#BABABA"
				></u-field>

				<u-line color="#f2f2f2" />

				<!-- 所在地区 -->
				<u-field
					:field-style="fieldStyle"
					:border-bottom="false"
					class="applet-address-edit-field"
					@click="showAction"
					v-model="addressInfo.addressName"
					:disabled="true"
					label="所在地区"
					placeholder=" "
					right-icon="arrow-right"
					:clearable="false"
				></u-field>
				<u-line color="#f2f2f2" />

				<wsf-city-select v-model="show" @city-change="chooseArea" :defaultRegion="addressInfo.defaultRegion"></wsf-city-select>
				<!-- 详细地址 -->
				<u-field
					class="applet-address-edit-field"
					:border-bottom="false"
					:field-style="fieldStyle"
					v-model="addressInfo.detailAddress"
					label="详细地址"
					maxlength="50"
					placeholder="街道楼牌号等"
					placeholder-style="color:#BABABA"
					@input="hasChange = true"
				></u-field>
			</view>

			<view class="applet-address-edit-default-switch">
				<text>设置默认地址</text>
				<u-switch v-model="addressInfo.isDefault" active-color="#E60113" :active-value="1" :inactive-value="0" @change="isDefaultChange"></u-switch>
			</view>

			<view class="wsf-btn">
				<u-button :loading="isLoading" :custom-style="customStyle" shape="circle" hover-class="none" :throttle-time="500" @click="$u.debounce(saveAddress, 500)">
					{{ options.addressId ? '确认' : '保存并使用' }}
				</u-button>
				<!-- 删除确认框 -->
				<u-button
					v-if="addressId"
					@click="openModal('是否确认删除该地址？', 0)"
					:loading="isLoading"
					:custom-style="customDelStyle"
					shape="circle"
					hover-class="none"
					plain
				>
					删除地址
				</u-button>
			</view>

			<wsf-confirm
				v-model="showConfirm"
				:title="confirmContext"
				:activeText="showConfirmType > 0 ? '保存' : '删除'"
				:cancelText="showConfirmType > 0 ? '不保存' : '取消'"
				@confirm="activeConfirm"
				@cancel="activeCancel"
			></wsf-confirm>
		</view>
	</view>
</template>

<script>
import wsfConfirm from '@/components/wsf-confirm/wsf-confirm.vue';
import wsfNavBar from '@/components/wsf-nav-bar/wsf-nav-bar.vue';
import wsfCitySelect from '@/components/wsf-city-select/wsf-city-select.vue';
export default {
	components: {
		wsfConfirm,
		wsfNavBar,
		wsfCitySelect
	},
	data() {
		return {
			addressId: 0,
			addressType: 0,
			userAddressLength: 0,
			addressInfo: {
				detailAddress: ''
			},
			show: false,
			isLoading: false,
			fieldStyle: {
				backgroundColor: '#FFFFFF',
				fontSize: '28rpx',
				lineHeight: '40rpx'
			},
			textareaStyle: {
				backgroundColor: '#FFFFFF',
				fontSize: '28rpx',
				lineHeight: '34rpx',
				padding: '4rpx 0',
				verticalAlign: 'top'
			},
			customStyle: {
				backgroundColor: '#E60113',
				marginBottom: '40rpx',
				color: '#FFF'
			},
			customDelStyle: {
				backgroundColor: '#FFF',
				color: '#333333'
			},
			showConfirm: false,
			showConfirmType: 0, // 0 - 删除状态 1 - 离开状态
			confirmContext: '',
			hasChange: false ,// 是否修改过内容
			
		};
	},
	onLoad(options) {
		console.log("options--------", options )
		this.addressType = options.addressType || 0;
		this.addressId = options.addressId || 0;
		this.userAddressLength = options.addressLength || 0;
		if (this.addressId<= 0) {
			this.addressInfo = {
				name: '',
				originMobile: '',
				addressName: '',
				detailAddress: '',
				isDefault: 0
			};
		}
	},
	onShow() {
		if (!this.addressId) return;
		this.queryAddressForId();
	},
	methods: {
		// 根据ID获取地址信息
		queryAddressForId() {
			this.$u.api.QueryCustomerAddressById({ id: this.addressId }).then(res => {
				this.addressInfo = res.data;
				this.addressInfo.defaultRegion = this.addressInfo.address.split(',');
				this.addressInfo.isDefault = Number(res.data.isDefault);
				this.addressInfo.addressName = this.addressInfo.defaultRegion.join('');
			});
		},
		// 唤起弹窗选择
		showAction() {
			this.show = true;
		},
		// 选择地区
		chooseArea(e) {
			this.hasChange = true;
			// this.addressInfo.defaultRegion = address.split(',');
			this.addressInfo.addressName = `${e.province.name}${e.city.name}${e.area.name}`;
			this.addressInfo.address = `${e.province.name},${e.city.name},${e.area.name}`;
			this.addressInfo.provinceId = e.province.id;
			this.addressInfo.cityId = e.city.id;
			this.addressInfo.countryId = e.area.id;
		},
		// 打开模态框
		openModal(context, atv) {
			this.confirmContext = context;
			this.showConfirmType = atv;
			this.showConfirm = true;
		},
		// 是否默认
		isDefaultChange(e) {
			// console.log('e', e);
			this.addressInfo.isDefault = e;
		},
		clickBackBtn() {
			if (this.hasChange) {
				this.openModal('是否保存本次编辑结果？', 1);
			} else {
				uni.navigateBack({
					delta: 1
				});
			}
		},
		// 保存地址
		saveAddress() {
			this.addressInfo.mobile = this.addressInfo.originMobile;
			if (this.isLoading) return;
			// console.log('this.$u.test.isEmpty(this.addressInfo.name)',this.$u.test.isEmpty(this.addressInfo.name));
			if (this.$u.test.isEmpty(this.addressInfo.name)) {
				this.$u.toast('请填写收货人');
				return;
			} else if (this.$u.test.isEmpty(this.addressInfo.mobile)) {
				this.$u.toast('请输入手机号');
				return;
			} else if (!this.$u.test.mobile(this.addressInfo.mobile+'')) {
				this.$u.toast('手机格式不对,请重新输入');
				return;
			} else if (this.$u.test.isEmpty(this.addressInfo.addressName)) {
				this.$u.toast('请选择所在地区');
				return;
			} else if (this.$u.test.isEmpty(this.addressInfo.detailAddress)) {
				this.$u.toast('请输入详细地址');
				return;
			} else if (!this.$u.test.rangeLength(this.addressInfo.detailAddress, [1, 50])) {
				this.$u.toast('详细地址最多50个字');
				return;
			}

			let api = this.addressId ? 'UpdateAddress' : 'AddAddress';
			let title = this.addressId ? '修改成功' : '新增成功';
			this.isLoading = true;
			this.$u.api[api](this.addressInfo).then(res => {
				this.isLoading = false;
				// this.$u.toast(title);
				if (res.code == 200 && res.data) {
					this.$u.toast(title);
					console.log("判断入口路径this.addressType-----------",this.addressType)
					// 购物车页面过来的 只做新增地址功能
					if (this.addressType === 'goods') {
						setTimeout(() =>{
							uni.navigateBack({  //uni.navigateTo跳转的返回，默认1为返回上一级
								delta: 2
							});
						}, 1000);
						return
					}
					if (!this.addressType) {
						setTimeout(function() {
							uni.navigateBack({
								delta: 1
							});
						}, 1000);
					} else {
						setTimeout(function() {
							console.log("判断入口路径this.addressType----**-------",this.addressType)
							// 返回上一页,并更新上一页的参数
							let pages = getCurrentPages();
							let prevPage = pages[pages.length - 3]; //上一个页面
							prevPage.$vm.addressId = res.data.id
							uni.navigateBack({  //uni.navigateTo跳转的返回，默认1为返回上一级
								delta: 2
							});
						}, 1000);
					}
				}
				
			});
		},
		// 点击了确定按钮
		activeConfirm() {
			if (this.showConfirmType == 0) {
				this.deleteAddress();
			} else if (this.showConfirmType == 1) {
				this.saveAddress();
			}
			this.showConfirm = false;
		},
		// 点击了取消按钮
		activeCancel() {
			if (this.showConfirmType == 1) {
				uni.navigateBack({
					delta: 1
				});
			}
		},
		// 删除地址
		deleteAddress() {
			this.$u.api.DeleteCustomerAddressById({ addressId: this.addressId }).then(res => {
				this.isLoading = false;
				this.$u.toast('删除成功');
				setTimeout(function() {
					uni.navigateBack({
						delta: 1
					});
				}, 1000);
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.applet-address-edit {
	&-header {
		border-radius: 0 0 20rpx 20rpx;
		overflow: hidden;
		margin-bottom: 24rpx;
		background-color: #ffffff;
		/deep/ .u-field {
			background-color: #ffffff;
			.u-label-text {
				color: #333;
				font-size: 28rpx;
			}
		}
	}

	&-default-switch {
		height: 100rpx;
		background-color: #ffffff;
		border-radius: 20rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 36rpx;
		margin-bottom: 60rpx;
	}

	.wsf-btn {
		margin: 0 auto 40rpx;
		width: 678rpx;
		height: 76rpx;
		line-height: 76rpx;
	}
}
</style>

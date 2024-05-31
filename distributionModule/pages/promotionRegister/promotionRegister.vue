<template>
	<view class="page">
		<view class="registerBox">
			<view class="image-box">
				<image :src="headImg" mode=""></image>
			</view>
			<view class="registers">
				<view class="groups">
					<view class="name">姓名/昵称</view>
					<input
						class="promotion-register-input"
						v-model="name"
						placeholder="请输入您的昵称"
						@focus="inputFocus('user')"
						:border="false"
						@input="onInputName"
						@blur="onBlurName"
						:maxlength="10"
						placeholder-class="promotion-register-input-placeholder"
					/>
					<view class="hint" v-if="errorNameMsg">{{ errorNameMsg }}</view>
				</view>
				<view class="groups">
					<view class="name">实体店</view>
					<input
						class="promotion-register-input"
						v-model="store"
						placeholder="请输入或选择实体店"
						@focus="inputFocus('store')"
						:border="false"
						@blur="onBlurStore"
						@input="onInputStore"
						placeholder-class="promotion-register-input-placeholder"
					/>
					<view class="hint" v-if="errorStoreMsg">{{ errorStoreMsg }}</view>
				</view>
				<view class="storeList" v-show="shows">
					<scroll-view scroll-y="true" style="height: 480rpx">
						<view class="storeItem" v-for="item in storeList" v-key="item.agencyNumber" hover-class="hoverClass" @click="getStoreData(item)">{{ item.orgName }}</view>
					</scroll-view>
				</view>
				<button
					class="promotion-register-button"
					:class="{ disabled: !(name && userInfo.userPhone && selectNumber) }"
					type="primary"
					:disabled="!(name && userInfo.userPhone && selectNumber)"
					@tap="onSubmit"
				>
					立即加入万顺推广员
				</button>
			</view>

			<!-- <van-popup :show="shows" position="bottom" @close="onClose" safe-area-inset-bottom lock-scroll="true">
				<view class="popups">
					<van-picker show-toolbar :columns="columns" value-key="label" @confirm="confirm" @cancel="onClose"></van-picker>
				</view>
			</van-popup> -->
			<view class="logoImg">
				<image :src="logoImg" mode=""></image>
			</view>
		</view>

		<!-- 确认弹框 -->
		<smartConfirm :contentText="content" :show="authorityDialog" :title="'提示'" :cancelText="'取消'" :confirmText="'去设置'" @cancel="authorityDialog = false" @confirm="confirmAuthorize" />
	</view>
</template>

<script>
	import smartConfirm from "@/components/smart/smart-confirm/smart-confirm.vue";
	// import { getStoreList, addPromoter } from '@/service/user.js';
	// let selectNumber = '';
	let longlats = "";
	export default {
		data() {
			return {
				headImg: this.$oss + "promoterminiprogram/images/headImg_bg.png",
				logoImg: this.$oss + "promoterminiprogram/images/img_logo.png",
				name: "",
				store: "",
				errorNameMsg: "",
				errorStoreMsg: "",
				shows: false,
				storeList: [],
				phone: "",
				disabled: true,
				selectNumber: "",
				userInfo: {
					userId: "",
					serPhone: "",
					userName: "",
				},
				authorityDialog: false,
				content: "定位失败，请手动授权定位权限！",
			};
		},
		components: {
			smartConfirm,
		},

		onLoad(option) {
			this.userInfo = option;
		},
		onShow() {
			let that = this;
			that.authorityDialog = false;
			uni.getSetting({
				success(res) {
					console.log(res);
					if (!res.authSetting["scope.userFuzzyLocation"]) {
						uni.authorize({
							scope: "scope.userFuzzyLocation",
							success() {
								that.getLocation();
							},
							fail() {
								that.authorityDialog = true;
							},
						});
					} else {
						that.getLocation();
					}
				},
			});
		},

		methods: {
			confirmAuthorize() {
				uni.openSetting()
			},
			getLocation() {
				uni.getFuzzyLocation({
					type: "wgs84",
					success: ({ latitude, longitude }) => {
						let longlat = [longitude, latitude].join(",");
						longlats = longlat;
						this.getStoreLists(longlat, null);
					},
					fail(error) {},
				});
			},
			async onSubmit() {
				if (!this.name) {
					return this.$u.toast("请输入您的昵称");
				}
				if (this.name.length < 2) {
					return this.$u.toast("昵称不能少于两个字");
				}
				if (!this.store) {
					return this.$u.toast("请选择实体店");
				}
				uni.showLoading();
				let params = {
					userId: this.userInfo.userId,
					userPhone: this.userInfo.userPhone,
					userName: this.name,
					userSource: 1,
					agencyNumber: this.selectNumber,
				};
				this.$u.api.PromoteRegister(params).then((res) => {
					uni.hideLoading();
					// this.$wsf.go("distributionIndex", {promoteId: res.data.promoteId})
					uni.navigateBack({
						delta: 1,
					});
				});
			},
			onClose() {
				this.shows = false;
			},
			// 聚焦处理
			inputFocus(name) {
				if (name == "user") {
					this.store = "";
					this.selectNumber = "";
					this.shows = false;
					this.errorNameMsg = "";
				} else if (name == "store") {
					this.errorStoreMsg = "";
					this.shows = true;
				}
			},
			onInputName(e) {
				this.$nextTick(() => {
					this.name = e.detail.value.replace(/[^\u4E00-\u9FA5]/g, "");
				});
			},
			onBlurName(e) {
				let value = e.detail.value;
				if (!value) {
					this.errorNameMsg = "请输入您的昵称";
					this.shows = false;
				} else if (value.length < 2) {
					this.errorNameMsg = "昵称不能少于两个字";
					this.shows = false;
				} else {
					this.errorNameMsg = "";
				}
				this.name = value;
			},
			onBlurStore(e) {
				let value = e.detail.value;
				if (!value) {
					this.errorStoreMsg = "请输入或选择实体店";
				} else {
					this.store = value;
					this.errorStoreMsg = "";
				}
			},
			onInputStore() {
				this.getStoreLists(longlats, this.store);
			},
			getStoreData(data) {
				this.selectNumber = data.agencyNumber;
				this.store = data.orgName;
				this.errorStoreMsg = "";
				this.shows = false;
			},
			async getStoreLists(longlat, store) {
				let params = {
					orgName: store,
					longlat,
				};
				this.$u.api
					.QuerySelectOrgByCondition(params)
					.then((res) => {
						this.storeList = res.data;
					})
					.catch((err) => {
						this.storeList = [];
					});
			},
		},
	};
</script>

<style lang="scss" scoped>
	.authority_dialog {
		height: 100%;
		padding: 10px;
	}
	.registerBox {
		width: 100%;
		height: 100%;
		background: #3e76ff;
		// padding-top: 380rpx;
		position: relative;
		.image-box {
			width: 750rpx;
			height: 500rpx;
			image {
				width: 100%;
				height: 100%;
			}
		}
		.registers {
			width: 688rpx;
			height: 584rpx;
			margin: 0 auto;
			background: #ffffff;
			border-radius: 16rpx;
			padding-top: 16rpx;
			display: flex;
			flex-direction: column;
			align-items: center;
			position: relative;
			margin-top: -120rpx;
			.groups {
				margin: 32rpx auto 0;
				position: relative;
				.hint {
					position: absolute;
					bottom: -28rpx;
					left: 16rpx;
					font-size: 24rpx;
					color: red;
					line-height: 28rpx;
				}
				.name {
					margin-bottom: 16rpx;
				}
				.promotion-register-input {
					background-color: #f5f5f5;
					width: 560rpx;
					height: 88rpx;
					border-radius: 16rpx;
					caret-color: #5069fe;
					width: 560rpx;
					height: 88rpx;
					background: #f5f5f5;
					border-radius: 16rpx;
					color: #333;
					font-weight: 600;
					font-size: 28rpx;
					padding-left: 16rpx;
				}
				/deep/ .promotion-register-input-placeholder {
					font-weight: 400;
					color: #999;
				}
			}
			.promotion-register-button {
				width: 560rpx;
				height: 96rpx;
				background: #5069fe;
				border-radius: 16rpx;
				margin: 64rpx auto 0;
				border: none;
				color: #fff;
				line-height: 96rpx;
				text-align: center;
			}

			.disabled {
				opacity: 0.4;
			}
		}

		.logoImg {
			width: 192rpx;
			height: 42rpx;
			position: fixed;
			bottom: 60rpx;
			left: 50%;
			transform: translateX(-50%);
			image {
				width: 100%;
				height: 100%;
			}
		}
		.storeList {
			position: absolute;
			top: 350rpx;
			width: 560rpx;
			height: 480rpx;
			border-radius: 16rpx;
			border: 1px solid #ebebeb;
			background: #ffffff;
			z-index: 888;
			.hoverClass {
				color: #fff;
				background-color: #5069fe;
			}
			.storeItem {
				width: 560rpx;
				height: 96rpx;
				padding: 24rpx 0 0 24rpx;
				box-sizing: border-box;
			}
		}
	}
</style>

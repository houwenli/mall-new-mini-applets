<template>
	<view>
		<wsf-nav-bar @onBackBtnClick="clickBackBtn" :status-bar="true" :fixed="true" :placeholder="true" title="评论" bg-color="#FFFFFF" :hasBack="true">
			<!-- <view slot="title" v-if="showSearchBar">我的</view> -->
		</wsf-nav-bar>
		<view class="applet-comment">
			<!-- 商品评分 -->
			<view class="applet-comment-goods">
				<view class="applet-comment-goods-image"><image :src="orderSkuEvaluationBo.skuImage" style="height: 100%;width: 100%;" mode=""></image></view>
				<view class="applet-comment-goods-rate">
					<view class="applet-comment-goods-rate-title">{{orderSkuEvaluationBo.skuName}}</view>
					<view class="applet-comment-goods-rate-wrap u-flex u-row-left">
						<u-rate size="36" :count="5" :min-count="1" v-model="orderSkuEvaluationBo.score"></u-rate>
						<view class="applet-comment-goods-rate-wrap-status">{{ rateStatus(orderSkuEvaluationBo.score) }}</view>
					</view>
				</view>
			</view>
			<!-- 商品评价 -->
			<view class="applet-comment-detail">
				<!-- 文本输入框 -->
				<view class="applet-comment-detail-textarea u-margin-bottom-20">
					<u-input
						v-model="orderSkuEvaluationBo.comment"
						placeholder="写下购物体会和使用感受〜"
						maxlength="200"
						type="textarea"
						border="false"
						:height="200"
						:auto-height="true"
						:clearable="false"
					/>
				</view>

				<!-- 文字数量 -->
				<view class="u-margin-bottom-20 u-flex u-row-right">
					<view style="font-size: 22rpx;color: #999999;line-height: 30rpx;">{{ orderSkuEvaluationBo.comment.length }} / 200</view>
				</view>
				<!-- 图片上传 -->
				<view class="applet-comment-detail-upload">
					<wsf-upload
						:max-size="5 * 1024 * 1024"
						max-count="6"
						:custom-btn="true"
						ref="wsfUpload"
						:action="wsfUploadConfig.action"
						:header="wsfUploadConfig.header"
						@on-change="uploadSuccess"
						:show-progress="false"
					>
						<view
							slot="addBtn"
							class="applet-comment-detail-upload-add-btn u-flex flex-column u-row-center"
							:style="{ width: skuImageLength < 1 ? '678rpx' : '200rpx' }"
						>
							<image src="@/static/img/icon/image@2x.png" style="height: 40rpx;width: 40rpx;margin-bottom: 12rpx;" mode=""></image>
							<text style="color: #999;font-size: 26rpx;line-height: 38rpx;">添加图片</text>
						</view>
					</wsf-upload>
				</view>
				<!-- 匿名选项 -->
				<view class="applet-comment-detail-anonymous u-flex u-col-center" @click="orderSkuEvaluationBo.anonymous = !orderSkuEvaluationBo.anonymous">
					<image
						src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/prev-icon-list/cat_ns%402x.png"
						style="height: 36rpx; width: 36rpx;margin-right: 16rpx;"
						mode=""
						v-if="!orderSkuEvaluationBo.anonymous"
					></image>
					<image
						src="@/static/img/icon/Selected@2x.png"
						style="height: 36rpx; width: 36rpx;margin-right: 16rpx;"
						mode=""
						v-if="orderSkuEvaluationBo.anonymous"
					></image>
					<view style="color: #000;font-size: 26rpx;line-height: 38rpx;">匿名评价</view>
				</view>
			</view>

			<!-- 店铺评价模块 -->
			<!-- <view class="applet-comment-store">
				<view class="applet-comment-store-name">{{ storeName }}</view>
				<view class="applet-comment-store-module u-flex u-row-left">
					<text style="font-size: 26rpx;color: #000000;width: 104rpx;margin-right: 40rpx;">描述相符</text>
					<u-rate size="36" :count="5" :min-count="1" v-model="orderSkuEvaluationBo.descScore"></u-rate>
					<view style="margin-left: 40rpx;font-size: 26rpx;color: #999999;">{{ rateStatus(orderSkuEvaluationBo.descScore) }}</view>
				</view>
				<view class="applet-comment-store-module u-flex u-row-left">
					<text style="font-size: 26rpx;color: #000000;width: 104rpx;margin-right: 40rpx;">卖家服务</text>
					<u-rate size="36" :count="5" :min-count="1" v-model="orderSkuEvaluationBo.sellerScore"></u-rate>
					<view style="margin-left: 40rpx;font-size: 26rpx;color: #999999;">{{ rateStatus(orderSkuEvaluationBo.sellerScore) }}</view>
				</view>
				<view class="applet-comment-store-module u-flex u-row-left">
					<text style="font-size: 26rpx;color: #000000;width: 104rpx;margin-right: 40rpx;">物流服务</text>
					<u-rate size="36" :count="5" :min-count="1" v-model="orderSkuEvaluationBo.logisticsScore"></u-rate>
					<view style="margin-left: 40rpx;font-size: 26rpx;color: #999999;">{{ rateStatus(orderSkuEvaluationBo.logisticsScore) }}</view>
				</view>
			</view> -->

			<!-- 评价提交按钮 -->
			<view class="applet-comment-btn-wrap" @click="submitComment()"><view class="applet-comment-submit-btn">提交</view></view>
		</view>
		<!-- 返回确认模块 -->
		<wsf-confirm
			v-model="showConfirm"
			title="您尚未发布"
			context="是否对已编辑内容进行保存"
			contextAlign="center"
			activeText="保存"
			cancelText="不保存"
			@confirm="activeConfirm"
			@cancel="activeCancel"
		></wsf-confirm>
	</view>
</template>

<script>
import httpInterceptor from '@/common/http.interceptor.js';
export default {
	data() {
		return {
			orderSkuEvaluationBo: {
				anonymous: false,
				comment: '',
				pictures: [],
				skuId: '',
				storeId: '',
				orderId: '',
				score: 5,
				sellerScore: 5,
				logisticsScore: 5,
				descScore: 5,
				skuImage: '',
				skuName: ''
			},
			skuImageLength: 0,
			wsfUploadConfig: {
				action: httpInterceptor.uploadFileUrl,
				header: {
					'content-type': 'multipart/form-data',
					'Authorization': 'Bearer ' + (uni.getStorageSync('newToken') || '')
				}
			},
			showConfirm: false,
			storeName: ''
		};
	},
	onLoad(options) {
		this.orderSkuEvaluationBo.skuId = options.skuId;
		this.orderSkuEvaluationBo.skuName = options.skuName;
		this.orderSkuEvaluationBo.orderId = options.orderId;
		this.orderSkuEvaluationBo.storeId = options.storeId;
		this.storeName = options.storeName;
		this.orderSkuEvaluationBo.skuImage = options.skuImage;
	},

	methods: {
		uploadSuccess(data, index, lists, name) {
			console.log('data', data);
			console.log('index', index);
			console.log('lists', lists);
			console.log('name', name);
			this.skuImageLength = lists.length;
		},

		// 返回按钮点击
		clickBackBtn(e) {
			this.showConfirm = true;
		},
		// 取消按钮点击
		activeCancel() {
			uni.navigateBack({
				delta: 1
			});
		},
		// 保存按钮点击
		activeConfirm() {
			console.log('提交');
			this.submitComment();
		},
		// 计算评分
		rateStatus(score) {
			let status;
			switch (score) {
				case 1:
					status = '非常差';
					break;
				case 2:
					status = '差';
					break;
				case 3:
					status = '一般';
					break;
				case 4:
					status = '好';
					break;
				case 5:
					status = '非常好';
					break;
				default:
					status = '非常好';
					break;
			}
			return status;
		},
		// 提交评价
		submitComment() {
			if (this.loading) return;
			let files = [];
			// 通过filter，筛选出上传进度为100的文件(因为某些上传失败的文件，进度值不为100，这个是可选的操作)
			files = this.$refs.wsfUpload.lists.filter(val => {
				return val.progress == 100;
			});
			let fileUrlList = []
			files.forEach(el => {
				if(el && el.response) {
					fileUrlList.push(el.response)
				}
			})
			this.orderSkuEvaluationBo.pictures = fileUrlList
			this.orderSkuEvaluationBo.anonymous = this.orderSkuEvaluationBo.anonymous ? 1 : 0;
			console.log('评论提交数据',this.orderSkuEvaluationBo);
			this.$u.api.AddOrderSkuEvaluation(this.orderSkuEvaluationBo).then(res => {
				this.$u.toast('评价成功');
				this.showConfirm = false;
				uni.navigateBack({
					delta: 1
				});
			});
		}
	}
};
</script>

<style lang="scss">
.applet-comment {
	padding-bottom: 200rpx;
	// 商品评分模块
	.applet-comment-goods {
		display: flex;
		align-items: flex-start;
		padding: 60rpx 36rpx 40rpx;
		border-radius: 0 0 20rpx 20rpx;
		overflow: hidden;
		background-color: #fff;
		margin-bottom: 24rpx;
		&-image {
			width: 120rpx;
			height: 120rpx;
			border-radius: 10rpx;
			border: 1rpx solid #eeeeee;
			overflow: hidden;
			margin-right: 20rpx;
		}
		&-rate {
			display: flex;
			flex-direction: column;
			min-height: 120rpx;
			flex: 1;
			padding-bottom: 16rpx;
			&-title {
				width: 100%;
				padding-left: 4rpx;
				font-size: 28rpx;
				font-weight: 400;
				color: #000000;
				line-height: 38rpx;
				padding-bottom: 8rpx;
			}
			&-wrap {
				&-status {
					margin-left: 40rpx;
					font-size: 28rpx;
					font-weight: 400;
					color: #999999;
					line-height: 38rpx;
				}
			}
		}
	}
	// 商品评价模块
	.applet-comment-detail {
		background-color: #fff;
		border-radius: 20rpx;
		overflow: hidden;
		padding: 40rpx 36rpx 10rpx;
		margin-bottom: 24rpx;

		&-textarea {
		}

		&-upload {
			&-add-btn {
				height: 200rpx;
				background: #f5f5f5;
				border-radius: 16rpx;
				margin-bottom: 20rpx;
			}
		}
		&-anonymous {
			width: 200rpx;
			padding: 10rpx 0 30rpx;
		}
	}

	// 店铺评价模块
	.applet-comment-store {
		padding: 40rpx;
		background-color: #fff;
		border-radius: 20rpx;
		&-name {
			margin-bottom: 24rpx;
			font-size: 26rpx;
			color: #000000;
			line-height: 38rpx;
		}
		&-module {
			padding: 24rpx 48rpx;
		}
	}

	// 评价提交按钮
	.applet-comment-btn-wrap {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		height: 100rpx;
		background-color: #fff;
		padding: 12rpx 36rpx;
		.applet-comment-submit-btn {
			height: 76rpx;
			line-height: 76rpx;
			color: #fff;
			font-size: 28rpx;
			font-weight: 500;
			background-color: $wsf-color-red;
			border-radius: 38rpx;
			overflow: hidden;
			text-align: center;
		}
	}
}
</style>

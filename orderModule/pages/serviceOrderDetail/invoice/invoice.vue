<template>
	<view>
		<wsf-nav-bar :fixed="true" :hasBack="true" backIconType="white" bg-color="transparent"
			@onBackBtnClick="onBackBtnClick"></wsf-nav-bar>
		<view class="backhead">
			<view class="bgtitle" :style="{ paddingTop: `${safePaddingHeight}px` }">
				<view class="top">
					<image class="tick" :src="ossUrl + 'wsf-mall/order/order-right1.png'" />
					已开票
				</view>
				<view class="price">已开发票金额：￥{{ price| priceFilter }}</view>
			</view>
			<view class="bgbody">
				<view class="item">
					<view>发票类型</view><text class="invoicingData">{{invoiceType}}</text>
				</view>
				<view class="item">
					<view>发票抬头</view><text class="invoicingData">{{invoiceTitleType}}</text>
				</view>
				<view class="item">
					<view>抬头名称</view><text
						class="invoicingData">{{ datalist.invoiceTitle?datalist.invoiceTitle:"" }}</text>
				</view>
				<view class="item">
					<view>开票金额</view><text class="invoicingData">{{ price| priceFilter }}</text>
				</view>
				<view class="item">
					<view>开票时间</view><span class="invoicingData">{{ datalist.uploadTime }}</span>
				</view>
				<view class="preview" @click="preview">
					<image class="img" :src="ossUrl + 'wsf-mall/order/invoice-preview.png'" />
					<view>点击预览发票</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				ossUrl: this.$oss,
				safePaddingHeight: getApp().globalData.statusBarHeight,
				price: 0,
				datalist: {}
			}
		},
		onLoad({
			orderId,
			price
		}) {
			this.price = price;
			this.$u.api.queryOrderAttr({
				orderId
			}).then(({
				code,
				data
			}) => {
				if (code == 200) {
					this.datalist = data;
				}
			})
		},
		computed: {
			invoiceType() {
				const invoiceType = {
					0: "不需要发票",
					1: "增值税普票",
					2: "增值税专票",
				}
				return invoiceType[this.datalist.invoiceType];
			},
			invoiceTitleType() {
				const invoiceTitleType = {
					1: "企业",
					2: "个人",
				}
				return invoiceTitleType[this.datalist.invoiceTitleType];
			},
			time() {
				return this.$u.timeFormat(new Date(this.datalist.uploadTime), 'yyyy-mm-dd hh:MM:ss')
			}
		},
		methods: {
			preview() {
				const {
					invoiceUrl
				} = this.datalist;
				const ext = invoiceUrl.substr(invoiceUrl.lastIndexOf(".") + 1)
				if (ext == "pdf") {
					uni.downloadFile({
						url: invoiceUrl,
						success: ({
							tempFilePath
						}) => {
							uni.openDocument({
								filePath: tempFilePath,
								showMenu: true
							})
						}
					})
				} else {
					uni.previewImage({
						urls: [invoiceUrl],
						longPressActions: {
							itemList: ['发送给朋友', '保存图片', '收藏'],
						}
					})
				}
			},
			onBackBtnClick() {
				uni.navigateBack();
			}
		}
	}
</script>

<style scoped lang="scss">
	.backhead {
		height: 100%;
		background: #F5F5F5;

		.bgtitle {
			background: linear-gradient(135deg, #E60113 0%, #F16310 100%);
			text-align: center;
			color: #fff;

			.top {
				font-size: 36rpx;
				padding: 56rpx 0 0;
			}

			.tick {
				width: 36rpx;
				height: 36rpx;
				margin: 0 14rpx 0 0;
				vertical-align: -5rpx;
			}

			.price {
				font-size: 28rpx;
				padding: 34rpx 0 60rpx;
			}
		}

		.bgbody {
			position: relative;
			background: #FFF;
			padding: 48rpx 36rpx 16rpx;
			border-radius: 20rpx;
			margin: -20rpx 0 0;

			.item {
				display: flex;
				color: #999;
				font-size: 26rpx;
				padding: 0 0 30rpx 0;

				.invoicingData {
					color: #000;
					padding: 0 0 0 30rpx;
					max-width: 380rpx;
				}
			}

			.preview {
				position: absolute;
				top: 48rpx;
				right: 36rpx;
				text-align: center;
				font-size: 24rpx;
				color: #999;

				.img {
					width: 200rpx;
					height: 98rpx;
					margin: 0 0 8rpx 0;
				}
			}
		}
	}
</style>

<template>
	<view class="overview">
		<view class="specification">
			<img src="https://wsjc-web.wsecar.com/wsf-mall/skuDetail/icon-introduce.png" alt="">
			<span>商品介绍</span>
		</view>
		<view class="over-img" :class="{'packUp': serveShow}">
			<video style="width: 100%" v-if="skuData.video" :poster="skuData.videoPic" :src="skuData.video"  controls></video>

			<u-parse :html="introduceUrlList" @itemclick="itemclick"  v-else></u-parse>
		</view>
		<view class="btn" v-if="imgHeight" @click="isServeShow">
			<img :src="`https://wsjc-web.wsecar.com/wsf-mall/skuDetail/icon-${serveShow?'btn-btom':'btn-top'}.png`" alt="">
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				imgHeight: false,
				serveShow: false
			};
		},
		props: {
			skuData: {
				type: Object,
				default() {
					return {}
				}
			}
		},
		watch: {
			'skuData': {
				handler(val, oal) {
					setTimeout(() => {
						let info = uni.createSelectorQuery().in(this).select(".over-img");
						let that = this
						info.boundingClientRect(function(data) {
							if (data.height > 500) {
								that.imgHeight = true
								that.serveShow = true
							}
						}).exec(function(res){
						})
					}, 500);
				},
				deep: true,
			},
		},
		computed:{
			introduceUrlList(){
				if(this.skuData.detail && this.skuData.detail.length){
					return this.skuData.detail
				} else if(this.skuData.mobileImageUrlList && this.skuData.mobileImageUrlList.length){
					return this.skuData.mobileImageUrlList
				} else {
					return []
				}
			}
		},
		methods: {
			previewImg(item) {
      	uni.previewImage({
      	  current: '',
      	  urls: [item],
      	  indicator: "none"
      	})
    	},
		isServeShow () {
			this.serveShow = !this.serveShow
			if (this.serveShow) {
				this.$emit("goToTop");
			}
		}
		},
	};
</script>

<style scoped lang="scss">
	.module-header {
		.header-icon {
			margin-right: 8rpx;
			display: inline-block;
			width: 6rpx;
			height: 28rpx;
			background: $wsf-color-red;
			border-radius: 4rpx;
			vertical-align: middle;
		}
		font-size: 30rpx;
		line-height: 30rpx;
		padding-bottom: 30rpx;
		font-weight: bold;

	}
	.module-title {
		color: #666;
		line-height: 28rpx;
		padding-bottom: 22rpx;
		font-weight: bold;
	}
	.overview-image {
		display: block;
		width: 100%;
	}
	.overview {
		margin: 0 24rpx;
		padding: 8rpx;
		background: #ffffff;
		border-radius: 24rpx;
		.specification {
			display: flex;
			align-items: center;
			padding-bottom: 24rpx;
			padding-left: 16rpx;
			padding-top: 22rpx;
			img {
				width: 32rpx;
				height: 34rpx;
			}
			span {
				padding-left: 8rpx;
				font-size: 26rpx;
				color: #191919;
			}
		}
	}
	.overviewImg {
      width:100%;
	  display:block;
	  &:first-child {
		  border-radius: 16rpx 16rpx 0 0;
	  }
	  &:last-child {
		  border-radius: 0 0 16rpx 16rpx;
	  }
	}
	.imgOne {
		border-radius: 16rpx !important;
	}
		.btn {
		width: 122rpx;
		height: 32rpx;
		border-radius: 16rpx;
		margin: 0 auto;
		margin-top: 20rpx;
		margin-bottom: 24rpx;
		img {
			width: 121rpx;
			height: 31rpx;
			display: block;
		}
	}
	.packUp {
		height: 500rpx;
		overflow: hidden;
	}
	.over-img {
		border-radius: 16rpx;
	}
</style>

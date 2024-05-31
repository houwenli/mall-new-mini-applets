<template>
	<view>
		<view class="share-text-container">
			<view class="share-text-box">
				<view class="share-text-title">
					<view class="share-text-title-left">分享文案</view>
					<view class="share-text-title-right" @click="randomShareContent()">
						<u-icon size="32" name="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/prev-icon-list/distribution-refresh%402x.png"></u-icon>
						<span>换一换</span>
					</view>
				</view>
				<view class="share-text-content">{{ shareTextContent }}</view>
				<view class="share-copy-btn-container">
					<view class="share-copy-btn" @click="setClipboardData()">
						<u-icon size="24" name="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/prev-icon-list/distribution-copy%402x.png"></u-icon>
						<span>复制文案</span>
					</view>
				</view>
			</view>
			<view class="share-way-box">
				<view class="share-way-column" @click="changeSelect(1)">
					<p>
						<u-icon v-show="selectShareWay == 1" size="36" name="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/prev-icon-list/radioActive%402x.png"></u-icon>
						<u-icon v-show="selectShareWay == 2" size="36" name="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/prev-icon-list/distibution-radioEmpty%402x.png"></u-icon>
						<span>分享链接</span>
					</p>
				</view>
				<view class="share-way-column" @click="changeSelect(2)">
					<p>
						<u-icon v-show="selectShareWay == 2" size="36" name="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/prev-icon-list/radioActive%402x.png"></u-icon>
						<u-icon v-show="selectShareWay == 1" size="36" name="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/prev-icon-list/distibution-radioEmpty%402x.png"></u-icon>
						<span>分享海报</span>
					</p>
					<view v-show="selectShareWay == 2" class="share-post-container"><image class="share-post" :src="canvasPostImg" mode="heightFix" @click="openPost"></image></view>
				</view>
			</view>
		</view>
		<view class="bottom-column">
			<view class="bottom-column-title">分享至</view>
			<view class="bottom-column-list">
				<button class="list-column" :open-type="item.name == '微信好友' ? 'share' : ''" v-for="(item, index) in shareSheetOptions" :key="index" @click="handleShareWay(item)">
					<image :src="item.icon" mode="heightFix"></image>
					<p>{{ item.name }}</p>
				</button>
			</view>
		</view>
		<!-- canvas画布 -->
		<r-canvas ref="rCanvas"></r-canvas>

		<view class="share-poster-mask" v-if="showPost" @touchmove.stop="stopTouch" @click="closePost">
			<view class="share-poster-container">
				<image :src="canvasPostImg"></image>
				<view class="close-btn" @click="closePost"><image :src="closeImg" mode=""></image></view>
				<!-- <view class="save-btn" @click="savePost">保存图片</view> -->
			</view>
		</view>
	</view>
</template>
<script>
import weChatImg from '@/static/img/icon/WeChat@2x.png';

import closeImg from '@/static/img/icon/close_white@2x.png';
import httpInterceptor from '@/common/http.interceptor.js';
import { writeFile, removeSave } from '@/common/uploadFile.js';
import rCanvas from '@/components/r-canvas/r-canvas.vue';
import { pathToBase64, base64ToPath } from '@/components/r-canvas/image-tools/index.js';
let type = '' //用于区分分享统计接口的type
export default {
	components: {
		rCanvas
	},
	data() {
		return {
			canvasPostImg: '',
			filePostImg: '',
			shareQrcode: '',
			distributionCode: '',
			noStatusShare: false,
			showPost: false,
			showShareModal: false,
			skuDetail: {},
			selectShareWay: 1,
			shareTextContent: '',
			weChatImg,
			closeImg,
			shareTextList: [
				'就差你了，发现一件不错的商品，一起来万顺福商城薅羊毛吧~',
				'[微信红包]恭喜发财，大吉大利！我正在万顺福商城享受品牌好物优惠活动，你也来看看吧。',
				'路过一波优惠，怎么可以忘记你呢，赶紧点击进来一起瞧瞧吧。',
				'用过的99%都赞爆，你还在犹豫什么呢？点击链接get商城最新优惠。',
				'【摊牌了！我就是在这里买的】万顺福商城正在低价促销，买到就是赚到，欲购从速，快快快！！！',
				'在吗？给你分享了一个爆款商品，买到即是赚到，快去下单吧。',
				'太便宜了！老板清仓啦，最后一波疯抢，还不赶紧的。',
				'嘘！偷偷告诉你哦，这里有一波商品促销，省钱别错过。',
				'库存有限！万顺福商城好货折扣发售中，我已经买了，你也来试试吧。',
				'爆款断货王，快来试试你的手速。'
			]
		};
	},

	computed: {
		shareSheetOptions() {
			if (this.selectShareWay == 1) {
				return [{ name: '微信好友', icon: weChatImg, type: 1 }];
			} else {
				return [{ name: '保存图片', icon: 'https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/prev-icon-list/save%402x.png', type: 2 }];
			}
		}
	},
	onShareAppMessage(options) {
		if (options.from === 'button') {
			this.showShareModal = false;
			// 来自页面内分享按钮
			let url;
			if (this.noStatusShare) {
				url = 'productModule/pages/skuDetail/skuDetail?skuId=' + this.skuDetail.id;
			} else {
				url = 'productModule/pages/skuDetail/skuDetail?s=' + this.skuDetail.id + '&c=' + this.distributionCode;
			}
			return {
				title: this.skuDetail.name,
				desc: this.skuDetail.subTitle,
				imageUrl: this.skuDetail.images[0],
				path: url
			};
		} else {
			let url = 'productModule/pages/skuDetail/skuDetail?skuId=' + this.skuDetail.id;
			return {
				title: this.skuDetail.name,
				desc: this.skuDetail.subTitle,
				imageUrl: this.skuDetail.images[0],
				path: url
			};
		}
	},
	onLoad(option) {
		if (option.distributionCode) {
			this.distributionCode = option.distributionCode;
		}
		if (option.id) {
			this.querySkuDetail(option.id);
		}
		type = option.type || ''
	},
	onShow() {
		this.randomShareContent();
	},
	methods: {
		//禁止拖拽事件
		stopTouch() {
			return false;
		},
		// 复制到粘贴板
		setClipboardData() {
			uni.setClipboardData({ data: this.shareTextContent });
		},
		// 关闭放大图片
		closePost() {
			this.showPost = false;
		},
		// 打开放大图片
		openPost() {
			this.showPost = true;
		},
		//获取分销码
		getShareForDistribution() {
			let data = {
				spuId: this.skuDetail.spuId
			};
			this.$u.api.shareForDistribution(data).then(res => {
				if (res.data.code != 200) {
					this.noStatusShare = true;
				} else {
					this.distributionCode = res.data.data;
					this.noStatusShare = false;
				}
			});
		},
		// 查询商品详情信息
		querySkuDetail(id) {
			let that = this;
			let data = {
				skuId: id
			};
			return this.$u.api.queryDistributionSku(data).then(res => {
				if (res.code == 200) {
					that.skuDetail = res.data;
					if (this.distributionCode) {
						this.noStatusShare = false;
					} else {
						this.noStatusShare = true;
						// this.getShareForDistribution()
					}
				}
			});
		},
		//选择分享形式
		changeSelect(index) {
			if (this.selectShareWay == index) return;
			this.selectShareWay = index;

			if (index == 2 && !this.canvasPostImg) {
				uni.showLoading({
					title: '长图生成中',
					mask: true
				});
				this.showPost = false;
				this.showShareModal = false;
				let codeData = {
					scene: 's=' + this.skuDetail.id + '&c=' + this.distributionCode,
					page: 'productModule/pages/skuDetail/skuDetail',
					width: 60,
					autoColor: false,
					isCyaline: 'true'
				};
				if (this.noStatusShare) {
					codeData.scene = 'skuId=' + this.skuDetail.id;
				}
				let header = {
					Accept: 'application/json',
					'Content-Type': 'application/json'
				};
				if (getApp().globalData.isLink) {
					header['Authorization'] = 'Bearer ' + uni.getStorageSync('newToken');
				}
				uni.request({
					url: httpInterceptor.baseUrl + '/share/code',
					header: header,
					data: codeData,
					responseType: 'arraybuffer',
					method: 'POST',
					success: res => {
						console.log(res, 'resff');
						this.shareQrcode = 'data:image/png;base64,' + uni.arrayBufferToBase64(res.data);
						console.log('data:image/png;base64,' + uni.arrayBufferToBase64(res.data), 'uniBase64');
						this.removeBeforeFiles();
					}
				});
			} else if (index == 2 && this.canvasPostImg) {
				this.openPost();
			}
		},
		//更换分享文案
		randomShareContent() {
			let arr = this.shareTextList;
			let content = arr[Math.floor(Math.random() * arr.length)];
			if (this.shareTextContent == content) {
				this.randomShareContent();
			} else {
				this.shareTextContent = content;
			}
		},
		//返回上一页
		backLastPage() {
			this.$router.back();
		},
		//绘制画布
		creatCanvasPost() {
			let skuName = this.skuDetail.name;
			if (skuName.length > 30) {
				skuName = skuName.substr(0, 30) + '…';
			}
			let that = this;

			this.$nextTick(async () => {
				// 初始化
				await that.$refs.rCanvas
					.init({
						canvas_id: 'rCanvas',
						canvas_width: '241',
						canvas_height: '380',
						hidden: true
					})
					.catch(err_msg => {
						this.showToastError('海报生成失败，请稍后重试');
					});

				// await that.$refs.rCanvas.fillRoundRect({
				// 	x: 0,
				// 	y: 0,
				// 	w: 241,
				// 	h: 380,
				// 	radius: 10,
				// 	fill_color: '#fff'
				// }).catch(err_msg=>{
				// this.showToastError('海报生成失败，请稍后重试')
				//   });

				// 画图
				await that.$refs.rCanvas
					.drawImage({
						url: this.skuDetail.images[0],
						x: 12,
						y: 12,
						w: 217,
						h: 217
					})
					.catch(err_msg => {
						this.showToastError('海报生成失败，请稍后重试');
					});

				// 画文字
				await that.$refs.rCanvas
					.drawText({
						text: '￥',
						x: 12,
						y: 254,
						font_color: '#E60113',
						font_size: 12,
						font_weight: 'bold'
					})
					.catch(err_msg => {
						this.showToastError('海报生成失败，请稍后重试');
					});

				await that.$refs.rCanvas
					.drawText({
						text: this.skuDetail.price.toFixed(2),
						x: 24,
						y: 254,
						font_color: '#E60113',
						font_size: 17,
						font_weight: 'bold'
					})
					.catch(err_msg => {
						this.showToastError('海报生成失败，请稍后重试');
					});

				await that.$refs.rCanvas
					.drawText({
						text: '价格具有时效性',
						x: 12,
						y: 270,
						font_color: '#666',
						font_size: 9,
						font_weight: 'lighter'
					})
					.catch(err_msg => {
						this.showToastError('海报生成失败，请稍后重试');
					});

				await that.$refs.rCanvas
					.drawText({
						text: skuName,
						max_width: 130,
						x: 12,
						y: 296,
						font_color: '#333333',
						font_size: 13,
						line_height: 19,
						font_weight: 'lighter'
					})
					.catch(err_msg => {
						this.showToastError('海报生成失败，请稍后重试');
					});

				await that.$refs.rCanvas
					.drawText({
						text: '-长按或扫码购买-',
						x: 156,
						y: 332,
						font_color: '#666',
						font_size: 9
					})
					.catch(err_msg => {
						this.showToastError('海报生成失败，请稍后重试');
					});

				await that.$refs.rCanvas
					.drawRect({
						x: 0,
						y: 360,
						w: 241,
						h: 20,
						color: '#FEF0F1'
					})
					.catch(err_msg => {
						this.showToastError('海报生成失败，请稍后重试');
					});

				// 画图
				await that.$refs.rCanvas
					.drawImage({
						url: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com///198ad539297fc070566ba83685372bb9.png',
						x: 103,
						y: 364,
						w: 36,
						h: 12
					})
					.catch(err_msg => {
						this.showToastError('海报生成失败，请稍后重试');
					});
				console.log(this.shareQrcode, 'this.shareQrcode');
				// 画图
				await that.$refs.rCanvas
					.drawImage({
						url: this.shareQrcode,
						x: 163,
						y: 254,
						w: 60,
						h: 60
					})
					.catch(err_msg => {
						this.showToastError('海报生成失败，请稍后重试');
					});
				// 生成海报
				await that.$refs.rCanvas.draw(res => {
					this.filePostImg = res.tempFilePath;
					console.log(res.tempFilePath, 'res.tempFilePath');
					//res.tempFilePath：生成成功，返回base64图片
					pathToBase64(res.tempFilePath)
						.then(base64 => {
							this.canvasPostImg = base64;
							this.showPost = true;
							this.showShareModal = false;
							// this.shareColumn = 2;
							uni.hideLoading();
						})
						.catch(err_msg => {
							this.showToastError('海报生成失败，请稍后重试');
						});
				});
			});
		},
		//移除文件
		removeBeforeFiles() {
			removeSave()
				.then(() => {
					this.getUseCode();
				})
				.catch(e => {
					console.log(e);
				});
		},
		//获取小程序码
		getUseCode() {
			writeFile(this.shareQrcode)
				.then(img => {
					// codeUrl为base64格式的小程序码
					this.creatCanvasPost();
				})
				.catch(e => {
					console.log(e);
				});
		},
		clickFun(){
			let params = {
				type,
				id: this.skuDetail.id
			}
			this.$store.dispatch('SETTINGS/shareVisitRequest',params)
		},
		handleShareWay(item) {
			this.clickFun()
			if (item.name == '保存图片') {
				//保存到相册
				uni.saveImageToPhotosAlbum({
					filePath: this.filePostImg,
					success() {
						uni.showToast({
							title: '保存成功',
							icon: 'none'
						});
					},
					fail() {
						uni.showToast({
							title: '保存失败',
							icon: 'none'
						});
					}
				});
			}
		}
	}
};
</script>
<style lang="scss" scoped>
.share-text-container {
	height: 90vh;
	background: #f5f5f5;

	.share-text-box {
		min-height: 404rpx;
		background: #fff;
		border-radius: 0px 0px 20rpx 20rpx;
		padding: 40rpx 36rpx;

		.share-text-title {
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: 38rpx;
			margin-bottom: 28rpx;
			.share-text-title-left {
				font-size: 30rpx;
				color: #000;
			}
			.share-text-title-right {
				display: inline-flex;
				justify-content: space-between;
				align-items: center;
				font-size: 30rpx;
				color: #999;
				font-size: 26rpx;
				span {
					margin-left: 4rpx;
				}
			}
		}
		.share-text-content {
			background: #fdf9f2;
			padding: 36rpx 40rpx;
			font-size: 32rpx;
			color: #333;
			font-weight: 500;
			line-height: 44rpx;
			border-radius: 10rpx;
		}
		.share-copy-btn-container {
			padding-top: 36rpx;
			text-align: center;
			.share-copy-btn {
				width: 236rpx;
				height: 60rpx;
				background: #e60113;
				border-radius: 50rpx;
				color: #fff;
				display: inline-flex;
				justify-content: center;
				align-items: center;
				font-size: 28rpx;
				span {
					margin-left: 8rpx;
				}
			}
		}
	}

	.share-way-box {
		margin-top: 24rpx;
		border-radius: 20rpx;
		background: #fff;
		overflow: hidden;
		.share-way-column {
			min-height: 100rpx;
			margin: 0 36rpx;
			border-top: 1rpx solid #f2f2f2;
			font-size: 32rpx;
			p {
				height: 100rpx;
				display: flex;
				align-items: center;
				color: #333;
				span {
					margin-left: 24rpx;
				}
			}
			.share-post-container {
				padding: 0 0 26rpx 60rpx;
				.share-post {
					height: 252rpx;
				}
			}
		}
	}
}

.bottom-column {
	position: fixed;
	bottom: 0;
	height: 290rpx;
	width: 100%;
	background: #fff;
	border-radius: 20rpx 20rpx 0px 0px;
	.bottom-column-title {
		padding-top: 34rpx;
		color: #666;
		line-height: 32rpx;
		text-align: center;
		font-size: 28rpx;
	}
	.bottom-column-list {
		display: flex;
		justify-content: space-around;
		padding: 40rpx 0;
		button {
			padding: 0;
			margin: 0;
			background-color: #fff;
			line-height: 24rpx;
			outline: none;
		}
		button::after {
			border: none;
		}
		.list-column {
			width: 96rpx;
			text-align: center;
			image {
				width: 92rpx;
				height: 92rpx;
			}
			p {
				white-space: nowrap;
				padding-top: 20rpx;
				color: #000000;
				line-height: 28rpx;
				font-size: 24rpx;
				text-align: center;
			}
		}
	}
}

.share-poster-mask {
	background: rgba(0, 0, 0, 0.7);
	position: fixed;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
	z-index: 1000;
}
.share-poster-container {
	position: absolute;
	top: 45%;
	left: 50%;
	transform: translate(-50%, -50%);
	height: 760rpx;
	width: 482rpx;
	background-color: transparent;
	border-radius: 20rpx;
	image {
		width: 100%;
		height: 100%;
		border-radius: 20rpx;
	}
	.close-btn {
		width: 48rpx;
		height: 48rpx;
		position: absolute;
		left: 50%;
		transform: translate(-50%, 0);
		bottom: -124rpx;
		image {
			width: 100%;
			height: 100%;
		}
	}
}
</style>

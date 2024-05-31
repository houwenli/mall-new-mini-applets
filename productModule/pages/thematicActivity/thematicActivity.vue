<template>
	<!-- <view class="thematic-activity-container" :style="{ backgroundImage: 'url(' + backgroundUrl + ')' }"> -->
	<view class="thematic-activity-container" >
		<view class="thematic-banner"><image :src="bannerUrl"></image></view>
		<view class="thematic-hot">
			<view class="thematic-hot-title"><image :src="titleUrl"></image></view>
			<view class="thematic-hot-desc">
			<!-- 	<p>万顺应用无需授权，实现最优配置</p>
				<p>后台切换更加流畅，里程不再丢失</p>
				<p>软件无需手动升级，直接静默安装</p> -->
				<image :src="descImgUrl"></image>
			</view>
			<view class="thematic-hot-spu" v-for="(item, index) in list" :key="index" @click="goSpuDetail(item.skuId)">
				<image :src="spuImgUrl[index]"></image>
				<view class="price-box">
					<view class="price">
						<text class="icon">¥</text>
						<text class="int">{{ parseInt(item.finalPrice) }}</text>
						<text class="float">
							{{ item.finalPrice % 1 != 0 ? '.' + (item.finalPrice % 1).toFixed(2).toString().split('.')[1] : '.00' }}
						</text>
					</view>
					<view class="old-price" v-if="item.finalPrice != item.price">¥{{ item.price.toFixed(2) }}</view>
				</view>
				<view class="score">{{ item.performanceScore }}绩效分</view>
			</view>
		</view>
		<!-- 		<view class="thematic-recommend">
			<view class="thematic-recommend-title"><image :src="url"></image></view>
			<view class="thematic-recommend-list">
				<view class="thematic-recommend-spu" v-for="(item, index) in list.slice(4, 10)"><image :src="url"></image></view>
			</view>
		</view> -->
		<view class="thematic-rule" :style="{ backgroundImage: 'url(' + ruleBgUrl + ')', backgroundRepeat: 'no-repeat', backgroundSize: '100% 100%' }">
			<view class="rule-title">活动规则</view>
			<view class="rule-content">
				<view class="rule-column">
					<view class="left">1、</view>
					<view class="right">凡万顺福商城用户，均可参与本次专题活动；</view>
				</view>
				<view class="rule-column">
					<view class="left">2、</view>
					<view class="right">万顺叫车合伙人参与本次活动，可获相应绩效分奖励；</view>
				</view>
				<view class="rule-column">
					<view class="left">3、</view>
					<view class="right">活动订单若发生退款或退货，则不享有任何活动优惠；</view>
				</view>
				<view class="rule-column">
					<view class="left">4、</view>
					<view class="right">活动手机一年质保，自签收后因质量问题一个月内包换，原则上除未拆包外不支持退货；</view>
				</view>
				<view class="rule-column">
					<view class="left">5、</view>
					<view class="right">因库存有限，具体赠品以下单页面所展示为准，且物流受春节影响可能会出现延后发货，造成不便，敬请谅解。</view>
				</view>
				<view class="rule-column special-hint">特别提示：</view>
				<view class="rule-column">本次活动中，万顺叫车合伙人所获得的绩效分奖励，将在订单最终确认收货后的第七天，发放至合伙人账户中。</view>
				<view class="rule-column hint">*本活动最终解释权归万顺福商城所有*</view>
			</view>
		</view>
		<view class="thematic-cloud-icon">
			<!-- <image :src="cloudIcon"></image> -->
		</view>
		<button open-type="share" @click="clickFun" class="share-btn"><image :src="shareIcon"></image></button>
	</view>
</template>

<script>
import httpInterceptor from '@/common/http.interceptor.js';
import {visit} from '@/common/visit.js'
export default {
	data() {
		return {
			url: 'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2981800396,1345038855&fm=26&gp=0.jpg',
			list: [1, 2],
			// backgroundUrl: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com//11111/4dc5b509dc457192ea94ae564543759b.png',
			
			// bannerUrl: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/fdae05e45bb39e2836fae7e90df0b6f8.jpg',     // banner图片
			bannerUrl: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/474a049a824d37d75aad9330f4c0ad97.jpg',     // banner图片 - 11-22日期
			titleUrl: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/7f76a9a59f4181fd271ca16473020b27.png',     //  title标题图片
			// descImgUrl: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/cd546bd0ab05952db10507fdc7b3e870.png',   //  8大理由图片
			descImgUrl: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/a2142f7bbca57ae66632baeec9a2d014.png',   //  8大理由图片 -- 11-22
			spuImgUrl: [    // 商品图片
				'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/f6e0df2f93c9c8607d5f426e174401f8.png',
				'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/402319e5a4812c10d6c62cb5f10124ef.png',
				// 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/2013089f9b87d5c88afb1988681a71e3.png',  
			],
			ruleBgUrl: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/1da210ec89b4d5ca721327f8a4bd40f8.png', // 活动规则背景
			shareIcon: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/0468b601b72b880bd13f026e2ea7ab1d.png',  // 分享图标
			
			cloudIcon: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com//11111/d422eb3d835d43435bc7a9ee1cab1ece.png',
			postImg: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/e42a201f6cee26d4c1a1c66658447967.png',	 // 分享链接图
			// postImg: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/3223754e229a80c23720feb49eb4f6b8.jpg',
			
		};
	},
	onShareAppMessage(options) {
		let url = 'productModule/pages/thematicActivity/thematicActivity';
		return {
			title: '手机专项定制，接单快人一步',
			desc: '',
			imageUrl: this.postImg,
			path: url
		};
	},
	// onLoad() {
	// 	visit(this,"手机专区活动页")
	// 	this.getInfo();
	// },
	onShow() {
	visit(this,"手机专区活动页")
		this.getInfo();
	},
	methods: {
		getInfo() {
			let arr;
			if (httpInterceptor.baseUrl == 'https://api-test.wsfmall.com/api/applets') {
				arr = ['480'];
			} else if (httpInterceptor.baseUrl == 'https://api-uat.wsfmall.com/api/applets') {
				arr = ['229','245'];
			} else if (httpInterceptor.baseUrl == 'https://api.wsfmall.com/api/applets') {
				// arr = ['449','447']; 959vivo
				arr = ['958', '1414']
			}
			this.$u.api.SelectPerformanceSkuBySpuId(arr).then(res => {
				if (res.code == 200) {
					this.list = res.data;
				}
			});
		},
		goSpuDetail(id) {
			this.$wsf.go('SkuDetail', { skuId: id });
		},
		clickFun(){
			let params = {
				name:'手机狂欢',
				type: 6,
				id: -1
			}
			this.$store.dispatch('SETTINGS/shareVisitRequest',params)
		}
	}
};
</script>

<style lang="scss" scoped>
.thematic-activity-container {
	background-repeat: repeat-y;
	background-size: contain;
	background-color: #7b47f2;
	.thematic-banner {
		width: 100%;
		height: 840rpx;
		image {
			width: 100%;
			height: 100%;
		}
	}
	.thematic-hot {
		text-align: center;
		padding: 0 20rpx;
		.thematic-hot-title {
			display: flex;
			align-items: center;
			justify-content: center;
			margin-bottom: 30rpx;
			height: 36rpx;
			image {
				width: 421rpx;
				height: 100%;
			}
		}
		.thematic-hot-desc {
			p {
				text-align: center;
				font-size: 24rpx;
				font-weight: bold;
				color: #FCF8D5;
				line-height: 40rpx;
			}
			image {
				width: 712rpx;
				height: 625rpx;
			}
			margin-bottom: 40rpx;
		}
		.thematic-hot-spu {
			position: relative;
			width: 710rpx;
			height: 356rpx;
			margin-bottom: 30rpx;
			image {
				width: 100%;
				height: 100%;
			}
			.price-box {
				position: absolute;
				top: 228rpx;
				left: 302rpx;
				width: 320rpx;
				display: flex;
				align-items: flex-end;
				.price {
					display: flex;
					align-items: flex-end;
					color: #7b47f2;
					font-weight: bold;
					background-image: linear-gradient(120deg,#d561e7,#635bf5);
					-webkit-background-clip:text;
					// color: transparent;
					.icon {
						font-size: 24rpx;
					}
					.int {
						font-size: 40rpx;
						line-height: 40rpx;
					}
					.float {
						font-size: 24rpx;
					}
				}
				.old-price {
					margin-left: 16rpx;
					text-decoration: line-through;
					font-size: 20rpx;
					color: #5f5f5f;
				}
			}
			.score {
				position: absolute;
				top: 71rpx;
				left: 20rpx;
				width: 250rpx;
				font-size: 28rpx;
				text-align: center;
				line-height: 28rpx;
				font-weight: bold;
				color: #7b47f2;
			}
		}
	}
	.thematic-recommend {
		.thematic-recommend-title {
			display: flex;
			align-items: center;
			justify-content: center;
			margin: 56rpx 0;
			height: 90rpx;
			image {
				width: 556rpx;
				height: 100%;
			}
		}
		.thematic-recommend-list {
			display: flex;
			flex-wrap: wrap;
			justify-content: space-between;
			padding: 0 20rpx;
			.thematic-recommend-spu {
				width: 340rpx;
				height: 450rpx;
				margin-bottom: 40rpx;
				image {
					width: 100%;
					height: 100%;
				}
			}
		}
	}
	.thematic-rule {
		width: 710rpx;
		// height: 583rpx;
		// background: #ac0c03;
		border-radius: 10px;
		margin: 0 20rpx;
		padding: 20rpx 42rpx;
		color: #fff;
		.rule-title {
			text-align: center;
			padding: 40rpx 0;
			font-size: 36rpx;
			line-height: 40rpx;
		}
		.rule-content {
			.rule-column {
				line-height: 40rpx;
				margin-bottom: 10rpx;
				display: flex;
				vertical-align: top;
				font-size: 24rpx;
				.left {
					width: 44rpx;
					display: inline-block;
					font-size: 24rpx;
				}
				.right {
					flex: 1;
					display: inline-block;
					font-size: 24rpx;
				}
			}
			.special-hint {
				margin-top: 30rpx;
			}
			.hint {
				margin: 56rpx 0 40rpx;
				justify-content: center;
			}
		}
	}
	.thematic-cloud-icon {
		padding: 44rpx 0 48rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		image {
			width: 121rpx;
			height: 46rpx;
		}
	}
	.share-btn {
		padding: 0;
		position: fixed;
		right: 0;
		bottom: 200rpx;
		width: 100rpx;
		height: 70rpx;
		image {
			width: 100%;
			height: 100%;
		}
	}
	button {
		border-radius: 0;
		padding: 0;
		margin: 0;
		background-color: transparent;
		line-height: 24rpx;
		outline: none;
	}
	button::after {
		border: none;
	}
}
</style>

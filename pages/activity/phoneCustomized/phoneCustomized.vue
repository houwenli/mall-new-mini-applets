<template>
	<view class="bg-container" :style="{ paddingTop: `${navBarInfo.allHeight}px` }">
		<nav-bar :backTopStyle="{background: '#fff'}" title="手机定制" @navBarInfo="getNavBarInfo"></nav-bar>
		<image class="top-poster-bg" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/custom-page-top-bg-th.jpg" mode="widthFix"></image>

		<view class="goods-container">
			<image class="right-top-ball" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/ball.png"></image>
			<view class="goods-1" @click="goCar(phone1.skuId)">
				<view class="phone"><image src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/vivo-y77-phone.png"></image></view>
				<view class="right">
					<view class="goods-name">VIVO Y77</view>
					<view class="goods-desc-list">
						<view class="desc-item">80W双芯闪充，一秒回血。</view>
						<view class="desc-item">天玑930 6nm强劲芯，性能流畅不卡顿。</view>
						<view class="desc-item">256G超大储存，下载不等待。</view>
						<view class="desc-item">120Hz护眼原色屏，清晰不伤眼。</view>
					</view>

					<view class="goods-car-wrapper" v-if="phone1.price">
						<image class="phone-momory-size" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/12g-256g.png"></image>
						<view class="left-price">
							<view class="left">
								<text class="price">{{ phone1.price }}</text>
								<text class="unit">元</text>
							</view>
							<view class="line"></view>
							<view class="right">
								<text class="performance-score">{{ phone1.performanceScore }}</text>
								<text class="unit">积分</text>
							</view>
						</view>
						<image class="goods-car-icon" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/goods-car.png"></image>
					</view>
				</view>
			</view>
			<view style="position: relative; z-index: 1;">
				<view class="goods-2">
					<!-- 限量礼包 先到先得 -->
					<image class="hot-goods-tips" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/shou-ji-ding-zhi-xian-liang-li-bao.png"></image>

					<image class="gift-icon" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/gift-icon.png"></image>
					<image class="left" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/baowenbei_shujvxian.png"></image>
					<view class="right">
						<view class="gift-desc">
							<view class="gift-desc-item">
								<view class="sort">1</view>
								<view class="gift-desc-text">买即得积分3798分</view>
							</view>
						</view>

						<view class="gift-desc">
							<view class="gift-desc-item">
								<view class="sort">2</view>
								<view class="gift-desc-text">万顺大礼包</view>
							</view>
							<view class="small-desc">随机赠送礼品一份</view>
						</view>

						<view class="gift-desc">
							<view class="gift-desc-item">
								<view class="sort">3</view>
								<view class="gift-desc-text">定制开机画面</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 第二个商品面板 -->
		<view class="goods-container second-goods-panel">
			<image class="left-top-ball" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/ball.png"></image>
			<view class="goods-1" @click="goCar(phone2.skuId)">
				<view class="phone"><image src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/OPPO-A1-Pro-phone.png"></image></view>
				<view class="right">
					<view class="goods-name">OPPO A1 Pro</view>
					<view class="goods-desc-list">
						<view class="desc-item">67W超级闪充，从早到晚长续航。</view>
						<view class="desc-item">120Hz 十亿色OLED屏，护眼曲屏新高度。</view>
						<view class="desc-item">一亿像素，享单反般超清影像。</view>
						<view class="desc-item">全场景智能NFC，无需带卡出门。</view>
					</view>

					<view class="goods-car-wrapper" v-if="phone2.price">
						<image class="phone-momory-size" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/8g-256g.png"></image>
						<view class="left-price">
							<view class="left">
								<text class="price">{{ phone2.price }}</text>
								<text class="unit">元</text>
							</view>
							<view class="line"></view>
							<view class="right">
								<text class="performance-score">{{ phone2.performanceScore }}</text>
								<text class="unit">积分</text>
							</view>
						</view>
						<image class="goods-car-icon" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/goods-car.png" @click="goCar"></image>
					</view>
				</view>
			</view>
<view style="position: relative; z-index: 1;">
			<view class="goods-2">
				<!-- 限量礼包 先到先得 -->
				<image class="hot-goods-tips" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/shou-ji-ding-zhi-xian-liang-li-bao.png"></image>
				<image class="gift-icon" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/gift-icon.png"></image>
				<image class="left" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/baowenbei_shujvxian.png"></image>
				<view class="right">
					<view class="gift-desc">
						<view class="gift-desc-item">
							<view class="sort">1</view>
							<view class="gift-desc-text">买即得积分3798分</view>
						</view>
					</view>

					<view class="gift-desc">
						<view class="gift-desc-item">
							<view class="sort">2</view>
							<view class="gift-desc-text">万顺大礼包</view>
						</view>
						<view class="small-desc">随机赠送礼品一份</view>
					</view>

					<view class="gift-desc">
						<view class="gift-desc-item">
							<view class="sort">3</view>
							<view class="gift-desc-text">定制开机画面</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		</view>

		<view class="active-rules-list">
			<image class="ball" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/ball.png"></image>
			<view class="title">活动规则</view>
			<view class="item">
				<view class="sort">1.</view>
				<view class="text">凡万顺福商城用户，均可参与本次专题活动；</view>
			</view>
			<view class="item">
				<view class="sort">2.</view>
				<view class="text">万顺叫车合伙人参与本次活动，可获相应积分奖励；</view>
			</view>
			<view class="item">
				<view class="sort">3.</view>
				<view class="text">活动订单若发生退款或退货，则不享有任何活动优惠；</view>
			</view>
			<view class="item">
				<view class="sort">4.</view>
				<view class="text">活动手机一年质保，自签收后因质量问题一个月内包换，原则上除未拆包外不支持退货；</view>
			</view>
			<view class="item">
				<view class="sort">5.</view>
				<view class="text">因库存有限，具体赠品以下单页面所展示为准，且物流受节日或疫情影响可能会出现延后发货，造成不便，敬请谅解。</view>
			</view>
		</view>
	</view>
</template>

<script>
import navBar from '@/common/components/nav-bar.vue';
export default {
	components: { navBar },
	data() {
		return {
			phone1: {
				price: '',
				performanceScore: '',
				skuId: ''
			},
			phone2: {
				price: '',
				performanceScore: '',
				skuId: ''
			},
			navBarInfo: {}, // navbar 信息
		};
	},

	onLoad() {
		this.getData();
	},

	methods: {
		// 获取navbar信息
		getNavBarInfo(navBarInfo) {
			console.log('navBarInfo', navBarInfo);
      		this.navBarInfo = navBarInfo
    	},
		async getData() {
			try {
				let res = await this.$u.api.selectActivityCustomized();

				this.phone1 = res.data[0];
				this.phone2 = res.data[1];
			} catch (e) {
				console.log(e);
			}
		},
		goCar(skuId) {
			if (!skuId) {
				console.log('skuId为空');
				return;
			}

			this.$wsf.go('SkuDetail', { skuId });
		}
	}
};
</script>

<style scoped lang="scss">
@import './index.scss';
</style>

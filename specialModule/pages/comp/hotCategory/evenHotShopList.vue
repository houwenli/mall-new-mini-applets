<template>
<div class="special-shopList">
	<view v-if="flowList.length <= 0" class="applet-empty u-flex flex-column">
		<image src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/main-packages/isEmpty-icon/cart.png" style="width:180rpx;height: 180rpx;" mode=""></image>
		<view class="applet-empty-tips">暂无活动商品~</view>
	</view>

	<view class="applet-template-recommend u-padding-left-24 u-padding-right-24" v-else>
		<wsf-goods-list ref="goodslist" title="" :list="flowList" :loadStatus="loadStatus" @goodsClick="goodsClick($event)" :showStyle="'column'"></wsf-goods-list>			
	</view>
	
</div>
</template>

<script>

import wsfGoodsList from './wsf-goods-list.vue'; // 底部精选好物
import { priceFilter } from '@/common/wsfFilter.js';
export default {
    components: { 
		wsfGoodsList,	
	},
    data() {
		return {				
			queryForm: {
				spuIds: []
			},
			flowList: [], // 瀑布流商品列表
			hasMore: true, // 是否拥有更多
			loadStatus: 'loadmore', // 加载更多样式效果
			isLoading: false, // 是否正在加载		
			priceFilter,				
		}
    },
	props: {
		floorSpuIds: {
			type: Array,
			default: [],
		}
	},	
    created(){
		this.queryForm.spuIds = this.floorSpuIds;
      	this.GetRecommendList();
    },
    // onReachBottom() {
    //   this.GetRecommendList();
    // },
    methods: {
		// 商品跳转
		goodsClick(e) {
			console.log('e', e);
			this.$wsf.go('SkuDetail', { skuId: e.id });
		},
		/* 获取推荐的商品列表 */
		GetRecommendList() {      
			if (this.isLoading || !this.hasMore) return;
			this.isLoading = true;
			this.loadStatus = 'loading';
			this.$u.api.selectSpuDeleteBySpuIds(this.queryForm).then(res => {
			this.isLoading = false;
			this.loadStatus = 'loadmore';
			
			if (res.code === 200) {
				// this.flowList = this.flowList.concat(
				res.data.map((item,index) => {
					item = JSON.parse(JSON.stringify(item))
					item.price = this.priceFilter(item.price);
					this.flowList.push(item)
					return item;
				})
				// );
				console.log('res222', this.flowList);
				this.queryForm.pageNum++;
				this.hasMore = res.data.length === 10;
				this.loadStatus = res.data.length === 10 ? 'loadmore' : 'nomore';
			}
			});
		},						
	},
	
	
}
</script>

<style scoped lang="less">
.special-shopList{
	.applet-template-recommend {
		// padding-bottom: calc(env(safe-area-inset-bottom) + 200rpx);
		.applet-template-recommend-title {
			margin: 40rpx 0 20rpx;
			text-align: center;
		}
	}
}
.u-load-more-wrap, .u-more-text{
	background: transparent !important;
}
.applet-empty{
	justify-content: center;
	padding-top: 0;
}
</style>

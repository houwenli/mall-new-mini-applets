<template>
	<view class="user-collection">
		<view v-if="userCollectionList.length <= 0" class="applet-empty u-flex flex-column">
			<image src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/main-packages/isEmpty-icon/cart.png" style="width:180rpx;height: 180rpx;" mode=""></image>
			<view class="applet-empty-tips">没有收藏任何商品~</view>
		</view>
		<template v-else>
				<view class="product-container" v-for="(item, index) in userCollectionList" :key="index">
					<u-swipe-action class="u_swipe_action"
						:show="item.show"
						:index="index"
						@click="click"
						@open="open(index, item)"
						:options="options"
					>
						<product-info :item="item" @tap="goSkuDetail(item)"></product-info>
					</u-swipe-action>
				</view>
		</template>
		<u-loadmore v-if="userCollectionList.length > 0" ref="backTop" bg-color="#f5f5f5" font-size="22" color="#c3c3c3" margin-bottom="40" :loadText="loadText" :status="loadStatus"></u-loadmore>

		<!-- 回到顶部 -->
		<u-back-top :scroll-top="scrollTop" top="5000" :icon-style="iconStyle" :bottom="140">
			<image src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/prev-icon-list/top%402x.png" style="width: 80rpx; height: 80rpx"></image>
		</u-back-top>
	</view>
</template>

<script>
import ProductInfo from '../../compontents/product-info/product-info.vue'
export default {
	components: {
		ProductInfo
	},
	data() {
		return {
			queryForm: {
				pageNum: 0, // 设置起始页码
				pageSize: 10, //返回每页数据的个数
			},
			loadText: {
				loadmore: '上拉加载更多',
				loading: '努力加载中',
				nomore: '我也是有底线的~'
			},
			userCollectionList: [], //放置返回数据的数组
			loadStatus: 'loadmore', // 加载更多样式效果
			isLoading: false, // 是否正在加载
			hasMore: true, // 是否拥有更多

			skuId:0, //单品Id
			storeId:'', //店铺id
			disabled: false,
			btnWidth: 180,
			show: false,
			options: [
				// {
				// 	text: '收藏',
				// 	style: {
				// 		backgroundColor: '#007aff',
				// 	},
				// },
				{
					text: '取消收藏',
					style: {
						background: '#FF0A35',
						width: '156rpx',
					},
				},
			],
			scrollTop:0
		};
	},
	onPageScroll(e) {
		this.scrollTop = e.scrollTop
	},
	onLoad(){
		this.loadUserCollectionList();
	},
	/* onShow() {
		// 加载收藏信息
		this.loadUserCollectionList();
	}, */
	onReachBottom() {
		this.loadUserCollectionList();
	},
	methods: {
		click(index, index1) {
			if (index1 == 0) {
				console.log(index,"删除时数字下标");
				// this.userCollectionList.splice(index, 1)
				this.$u.api.CancelSkuAttention({skuId:this.skuId, storeId: this.storeId}).then(res => {
					this.userCollectionList.splice(index, 1)
				})
				// this.$u.toast(`删除了第${index}个cell`)
			} else {
				this.$u.toast(`收藏成功`)
			}
		},
		// 如果打开一个的时候，不需要关闭其他，则无需实现本方法
		open(index,item) {
			this.skuId = item.skuId
			this.storeId = item.storeId
			console.log(index,'------------')
			// 先将正在被操作的swipeAction标记为打开状态，否则由于props的特性限制，
			// 原本为'false'，再次设置为'false'会无效
				this.userCollectionList.map((val, idx) => {
					if (index == idx) {
						// 	console.log(idx);
						this.userCollectionList[idx].show = true
					} else {
						this.userCollectionList[idx].show = false
					}
				})
				console.log(this.userCollectionList,"this.userCollectionList");
		},
		goSkuDetail(item){
			console.log(item);
			if(item.sku.status==4) {
				return false
			} else {
				this.$wsf.go('SkuDetail',{skuId: item.skuId, storeIdNumber: item.storeId, sourceType: item.sourceType})
			}
		},

		/* 跳转 */
		navigateTo(sceneName, params) {
			// this.$wsf.go('Login')
			this.$wsf.go(sceneName, params);
		},
		toSkuDetail(id) {
			this.navigateTo('SkuDetail', {skuId:  id});
		},
		loadUserCollectionList() {
			if (this.isLoading || !this.hasMore) return;
			this.isLoading = true;
			this.loadStatus = 'loading';
			let data = this.queryForm
			this.$u.api.Queryattentions(data).then(res => {
				this.isLoading = false;
				this.loadStatus = 'loadmore';
				if (res.code == 200) {
					res.data.list.map((item, index) => {
						res.data.list[index].show = false
					})
					this.userCollectionList = this.userCollectionList.concat(res.data.list);
					this.queryForm.pageNum++;
					this.hasMore = res.data.list.length === 10;
					this.loadStatus = res.data.list.length === 10 ? 'loadmore' : 'nomore';
					console.log(res,"商品收藏数据");
				}
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
		//加购
		handleAddCart(item) {
			let data = {
				num: 1,
				skuId: item.skuId,
				sourceType: item.sourceType,
				storeId: item.storeId,
			};
			this.$u.api.AddShoppingCart(data).then(res => {
				if (res.code == 200) {
					this.specSelectModel = false;
					this.showToastError('成功加入购物车');
				}
			});
		},
	}
};
</script>

<style lang="scss" scoped>
.user-collection {
	width: 100%;
	height: 100%;
	background: #f6f6f6;
	padding: 16rpx 0;

	.product-container {
		margin-bottom: 20rpx;
	}

	.u_swipe_action {
		/deep/ .u-swipe-view {
			background-color: #f6f6f6;
		}
		/deep/ .u-btn-text {
			width: 40px;
			font-size: 14px;
			text-align: center;
			}
	}
}
</style>

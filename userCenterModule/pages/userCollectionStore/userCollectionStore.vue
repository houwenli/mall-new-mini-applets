<template>
	<view class="user-collection-store">
		<view style="height: 24rpx;background: #F2F2F2;"></view>
		<view v-if="userCollectionList.length <= 0" class="applet-empty u-flex flex-column">
			<image src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/main-packages/isEmpty-icon/cart.png" style="width:180rpx;height: 180rpx;" mode=""></image>
			<view class="applet-empty-tips">没有关注任何店铺~</view>
		</view>
		<template>
			<view>
				<u-swipe-action class="u_swipe_action"
					:show="item.show"
					:index="index"
					v-for="(item, index) in userCollectionList"
					:key="item.id"
					@click="click"
					@open="open(index,item.storeId)"
					:options="options"
				>
					<view class="item u-border-bottom" @click="goToStore(item)">
						<image class="u-border" v-if="item.storeInfo.avatarPicture" mode="aspectFill" :src="item.storeInfo.avatarPicture" />
						<image class="u-border" v-else src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/prev-icon-list/Avatar_default.png" mode="aspectFill"></image>
						<!-- 此层wrap在此为必写的，否则可能会出现标题定位错误 -->
						<view class="title-wrap">
							<view class="tit">
								<text class="title u-line-2">{{ item.storeInfo.storeName }}</text>
							</view>
							<view class="grade u-flex">
								<text class="u-margin-right-10">综合体验</text>
								<uni-rate color="#b2b2b2" :size="15" active-color="#E60113" value="5" allow-half :readonly="true"></uni-rate>
								<!-- <text class="u-padding-left-20">{{item.storeAttentionCount}}人关注</text> -->
								<text class="u-padding-left-20">{{item.storeAttentionCount?item.storeAttentionCount + 10000:10000}}人关注</text>
							</view>
						</view>
					</view>
				</u-swipe-action>
			</view>
		</template>
		<!-- <u-loadmore v-if="userCollectionList.length > 0" ref="backTop" bg-color="rgb(240, 240, 240)" :status="loadStatus"></u-loadmore> -->
	</view>
</template>

<script>
export default {
	data() {
		return {
			reachBottom: false,
			queryForm: {
				pageNum: 0, // 设置起始页码
				pageSize: 10, //返回每页数据的个数
			},
			userCollectionList: [], //放置返回数据的数组
			loadStatus: 'loadmore', // 加载更多样式效果
			isLoading: false, // 是否正在加载
			hasMore: true, // 是否拥有更多

			u_rate: {
				count: 5,
				value: '4',
			},
			storeId:0, //店铺ID
			disabled: false,
			btnWidth: 180,
			show: false,
			options: [
				// {
				// 	text: '关注',
				// 	style: {
				// 		backgroundColor: '#007aff',
				// 	},
				// },
				{
					text: '取消关注',
					style: {
						backgroundColor: '#E60113',
					},
				},
			],
		}
	},
	onLoad() {
		// 加载关注信息
		this.loadUserCollectionList()
	},
	 onReachBottom() {
			if(this.reachBottom){
				this.queryForm.pageNum = this.queryForm.pageNum + 1
				this.loadUserCollectionList()
			}
	 },
	/* onShow() {
		// 加载关注信息
		this.loadUserCollectionList()
	}, */
	methods: {
		// 跳转店铺
		goToStore(item) {
			console.log('跳转店铺或首页', item);
			if (item.storeId != 0) {
				this.$wsf.go('StoreIndex', { storeName: item.storeInfo.storeName, storeId: item.storeId });
			} else {
				this.$wsf.go('Index');
			}
		},
		click(index, index1) {
			if (index1 == 0) {
				this.$u.api.CancelStoreAttention({storeId:this.storeId}).then(res => {
					console.log(res,"取消店铺关注接口信息");
					this.userCollectionList.splice(index, 1)
					this.$u.toast(`取消关注成功`)
				})
			} else {
				this.$u.toast(`关注成功`)
			}
		},
		// 如果打开一个的时候，不需要关闭其他，则无需实现本方法
		open(index,storeId) {
			this.storeId = storeId
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
		},
		/* 跳转 */
		navigateTo(sceneName, params) {
			// this.$wsf.go('Login')
			this.$wsf.go(sceneName, params)
		},
		toStoreDetail(item) {
			this.navigateTo('StoreIndex', { storeId: item.storeId, storeName: item.storeInfo.storeName })
		},
		loadUserCollectionList() {
			let that = this
			if (this.isLoading || !this.hasMore) return
			this.isLoading = true
			this.loadStatus = 'loading'
			let data = this.queryForm
			this.$u.api.QueryattentionStore(data).then((res) => {
				this.isLoading = false
				this.reachBottom = false
				this.loadStatus = 'loadmore'
				if (res.code == 200) {
					if(res.data.list.length===10) this.reachBottom = true
					res.data.list.map((item, index) => {
						res.data.list[index].show = false
					})
					for(let i = 0; i < res.data.list.length; i++){
						this.userCollectionList.push(res.data.list[i])
					}
					// this.userCollectionList = that.userCollectionList.concat(res.data.list)
					this.hasMore = res.data.list.length === 10
					this.loadStatus = res.data.list.length === 10 ? 'loadmore' : 'nomore'
				}
			})
		},
	},
}
</script>

<style scoped lang="scss">
.user-collection-store {
	width: 100%;
	height: 100%;
	background: #FFFFFF;
	.store-group {
		position: relative;
		font-size: 28rpx;
		background: #fff;
		border-bottom: 1px solid #eee;
		margin-bottom: 20rpx;
		.store-details {
			display: flex;
			justify-content: flex-start;
			align-content: center;

			.store-img {
				width: 200rpx;
				height: 200rpx;
			}
			.store-info {
				padding-left: 20rpx;
				padding-top: 20rpx;
			}
		}
	}
	.u_swipe_action {
		/deep/ .u-btn-text {
			width: 40px;
			font-size: 14px;
			text-align: center;
		}
		image {
			width: 120rpx;
			flex: 0 0 120rpx;
			height: 120rpx;
			margin-right: 20rpx;
			border-radius: 12rpx;
		}
	}
	.item {
		display: flex;
		padding: 20rpx;
	}
	.title-wrap {
		width: 100%;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		.tit,.grade {
			width: 100%;
		}
		.grade{
			text {
				font-size: 24rpx;
				font-weight: 400;
				color: #999999;
			}
		}
	}
	.title {
		font-size: 28rpx;
		font-weight: 500;
		color: #000000;
	}
}

</style>

<template>
	<view class="user-collection">

		<!-- <u-empty v-if="userCollectionList.length == 0" icon-size="180" color="#999999"
		src="https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/2e447cef0e741d8b4a1018bd4dae451b.png" text="暂无物流消息〜" >
		</u-empty> -->
		<view v-if="userCollectionList.length == 0" class="applet-empty u-flex flex-column">
			<image src="https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/2e447cef0e741d8b4a1018bd4dae451b.png" style="width:180rpx;height: 180rpx;" mode=""></image>
			<view class="applet-empty-tips">暂无账户通知〜</view>
		</view>

		<template v-if="userCollectionList.length > 0">
			<view v-for="(item, index) in userCollectionList" :key="index" style="margin-bottom: 24rpx;">
				<u-swipe-action class="u_swipe_action"
					:show="item.show"
					:index="index"
					:key="item.id"
					@click="click"
					@open="open(index, item.id)"
					bg-color="#f5f5f5"
					btn-width="140"
					:options="options"
				>
					<view class="item">
						<view class="item_header">
							<text class="title u-line-2">{{item.title}}</text>
							<text class="time">{{item.createTime}}</text>
						</view>
						<view class="item_content" >
							<view class="content">
								{{item.content}}
							</view>
						</view>
					</view>
				</u-swipe-action>
			</view>
		</template>

		<!-- 回到顶部 -->
		<u-back-top :scroll-top="scrollTop" top="5000" :icon-style="iconStyle" :bottom="140">
			<image src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/prev-icon-list/top%402x.png" style="width: 80rpx; height: 80rpx"></image>
		</u-back-top>
	</view>
</template>

<script>
export default {
	data() {
		return {
			queryForm: {
				pageNum: 0, // 设置起始页码
				pageSize: 10, //返回每页数据的个数
				msgGroup: 8,
			},
			userCollectionList: [
				// {
				// 	storeName:'万顺印象',
				// 	storeimg:'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/2e447cef0e741d8b4a1018bd4dae451b.png',
				// 	status:1,
				// 	time:'2021/06/25',
				// 	image:'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/2e447cef0e741d8b4a1018bd4dae451b.png',
				// 	content:'订单[万顺定制铝合工牌定]已配送完 成，点击去评价>>',
				// 	id:111
				// }
			], //放置返回数据的数组
			loadStatus: 'loadmore', // 加载更多样式效果
			isLoading: false, // 是否正在加载
			hasMore: false, // 是否拥有更多

			id:0, //单品Id
			disabled: false,
			btnWidth: 180,
			show: false,
			options: [
				{
					text: '删除',
					style: {
						backgroundColor: '#E60113',
						borderRadius:'20rpx',
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
		this.getData();
	},
	onShow() {
		// 加载收藏信息
		this.getData();
	},
	onReachBottom() {
		this.getData();
	},
	methods: {
		/* 重置表单数据 */
		resetList() {
		  this.queryForm = {
		    // 请求页码和也容量
		    pageNum: 0,
		    pageSize: 10,
				msgGroup: 8,
		  };
		  this.hasMore = false;
		  this.userCollectionList = [];
		},
		// 列表
		getData(){
			if (this.isLoading || this.hasMore) return;
			this.isLoading = true;
			this.$u.api.queryNews(this.queryForm).then((res) => {
				if (res.code == 200) {
					let list = res.data.records
					let page = res.data.pages
					this.isLoading = false;
					// this.hasMore = list.length < 10;
					if (page == this.queryForm.pageNum + 1) {
						this.hasMore = true;
					}
					if (list.length > 0) {
						list.forEach((item)=> {
							this.userCollectionList.push(item)
						})
					}
					// this.userCollectionList = this.userCollectionList.concat(list);
					this.queryForm.pageNum++;
					uni.stopPullDownRefresh();
				}
			});
		},
		click(index, index1) {
			if (index1 == 0) {
				let param = {
					msgId:this.id
				}
				this.$u.api.deleteStationNews(param).then(res => {
					this.userCollectionList.splice(index, 1)
					this.showToastError('删除成功')
				})
			}
		},
		// 如果打开一个的时候，不需要关闭其他，则无需实现本方法
		open(index,id) {
			this.id = id
			// 先将正在被操作的swipeAction标记为打开状态，否则由于props的特性限制，
			// 原本为'false'，再次设置为'false'会无效
				this.userCollectionList.map((val, idx) => {
					if (index == idx) {
						this.userCollectionList[idx].show = true
					} else {
						this.userCollectionList[idx].show = false
					}
				})
		},
		showToastError(errMsg, duration = 1500) {
			uni.showToast({
				title: errMsg,
				icon: 'none',
				mask: true,
				duration: duration
			});
		},
	}
};
</script>

<style lang="scss" scoped>
.user-collection {
	width: 100%;
	height: 100%;
	padding:24rpx;
	.u_swipe_action {
		margin-bottom:24rpx;
		/deep/ .u-btn-text {
			width: 40px;
			font-size: 14px;
			text-align: center;
		}
	}
	.item{
		width: 100%;
		// height: 169px;
		background: #FFFFFF;
		border-radius: 20rpx;
		padding: 30rpx 24rpx;
		.item_header{
			display:flex;
			justify-content:space-between;
			item-align:center;
			margin-bottom:24rpx;
			color:#000;
			.title{
				font-weight: bold;
				max-width:425rpx;
				font-size:34rpx;
			}
			.time{
				font-size:24rpx;
				color:#BABABA;
				line-height: 46rpx;
			}
		}
		.item_content{
			display:flex;
			.content{
				width: 100%;
				color: #999999;
			}
		}
	}

}
</style>

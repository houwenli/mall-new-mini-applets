<template>
	<view class="user-collection">

		<!-- <u-empty v-if="userCollectionList.length == 0" icon-size="180" color="#999999"
		src="https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/a6dcf296efd0e95b2349e8f332ae19c8.png" text="暂无物流消息〜" >
		</u-empty> -->
		<view v-if="userCollectionList.length == 0" class="applet-empty u-flex flex-column">
			<image src="https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/a6dcf296efd0e95b2349e8f332ae19c8.png" style="width:180rpx;height: 180rpx;" mode=""></image>
			<view class="applet-empty-tips">暂无优惠促销〜</view>
		</view>

		<template v-if="userCollectionList.length > 0">
			<view v-for="(item, index) in userCollectionList" :key="index" style="margin-bottom: 30rpx; text-align:center">
				<text class="active_time">{{item.createTime}}</text>
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
					<view class="item"  @click="navigateTo('firstOrder', {id:item.extraData.marketingId})">
						<image :src="item.extraData&&item.extraData.activitySharePic" mode="" class="item_image"></image>
						<image src="https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/f2fbaca471aefdf11fcc3fa8d453a7dd.png" mode="" class="engImg" v-if="item.extraData.status == 4"></image>
						<view class="item_content">
							<view class="item_header">
								<text class="title u-line-1">{{ item.title }}</text>
							</view>
							<view class="content">
								<text class="u-line-2" style="text-align: left">
									{{item.content}}
								</text>
							</view>
						</view>
					</view>
				</u-swipe-action>
			</view>
		</template>

		<!-- 领券 -->
		<view class="couponsBox">
			<view class="coupon">
				<image style="width:40rpx;height:40rpx" src="https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/2471878d3a92bd36f1c9c0f828c15bd4.png"></image>
				<text class="coupon_t" @click="navigateTo('couponCenter')">领券</text>
				<image style="width:36rpx;height:24rpx" src="https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/4d7f6b3f7c164688e033de1bd992b93c.png"></image>
			</view>
		</view>
		<!-- <u-loadmore v-if="userCollectionList.length > 0" ref="backTop" bg-color="rgb(240, 240, 240)" :status="loadStatus"></u-loadmore> -->

		<!-- 回到顶部 -->
		<u-back-top :scroll-top="scrollTop" top="5000" :icon-style="iconStyle" :bottom="140">
			<image src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/prev-icon-list/top%402x.png" style="width: 80rpx; height: 80rpx"></image>
		</u-back-top>
	</view>
</template>

<script>
import {priceFilter} from '@/common/wsfFilter.js'
export default {
	data() {
		return {
			queryForm: {
				pageNum: 0, // 设置起始页码
				pageSize: 10, //返回每页数据的个数
				msgGroup: 7,
			},
			userCollectionList: [
				// {
				// 	storeName:'万顺印象',
				// 	endimg:'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/f2fbaca471aefdf11fcc3fa8d453a7dd.png',
				// 	status:1,
				// 	time:'2021/06/25',
				// 	image:'https://img0.baidu.com/it/u=1761470670,1751141355&fm=26&fmt=auto&gp=0.jpg',
				// 	content:'订单[万顺定制铝合工牌定]已配送完 成，点击去评价>>',
				// 	id:111
				// },
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
						width: '140rpx',
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
				msgGroup: 7,
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
			// console.log(index,'------------',this.id)
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

		/* 跳转 */
		navigateTo(sceneName, params) {
			this.$wsf.go(sceneName, params);
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
	padding:24rpx 24rpx 92rpx;
	.u_swipe_action {
		margin-bottom:24rpx;
		/deep/ .u-btn-text {
			width: 40px;
			font-size: 14px;
			text-align: center;
		}
	}
	.active_time{
		display: inline-block;
		height: 48rpx;
		line-height: 48rpx;
		background: #DFDFDF;
		border-radius: 24rpx;
		font-size: 24rpx;
		padding: 0 22rpx;
		margin: 0 auto;
		color: #FFFFFF;
		margin-bottom: 20rpx;
	}
	.item{
		width: 100%;
		background: #FFFFFF;
		border-radius: 20rpx;
		position:relative;
		.item_image{
			width: 100%;
			height: 280rpx;
			border-radius: 20rpx 20rpx 0 0;
		}
		.engImg{
			position:absolute;
			top:48rpx;
			left:50%;
			margin-left:-92rpx;
			width: 184rpx;
			height: 184rpx;
		}
		.item_header{
			margin-bottom:24rpx;
			color:#000;
			.title{
				font-weight: bold;
				font-size: 34rpx;
				width: 654rpx;
				text-align: left;
				display: block;
			}
			.time{
				font-size:24rpx;
				color:#BABABA;
				line-height: 46rpx;
			}
		}
		.item_content{
			padding:26rpx 24rpx 28rpx;
			.content{
				width: 100%;
				color: #999999;
			}
		}
	}
}
.couponsBox{
	width: 100%;
	height: 92rpx;
	line-height:92rpx;
	background: #FFFFFF;
	position: fixed;
	bottom:0;
	left:0;
	.coupon{
		display:flex;
		justify-content:center;
		align-items:center;
	}
	.coupon_t{
		margin:0 12rpx;
		color:#000;
		font-size:28rpx;
		font-weight:bold;
	}
}
</style>

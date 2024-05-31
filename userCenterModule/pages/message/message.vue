<template>
	<view class="applet-message-wrap">
		<!-- 缺省页 -->
	<!-- 	<div v-if="messageList.length != 0" class="nowrap">
			<img style="width: 180rpx; height: 180rpx" src="@/static/img/cat_ui@2x.png" alt="" />
			<div class="news-text">暂无消息~</div>
		</div> -->
		
		<view class="cleanBox" v-if="unreadtotal > 0">
			<image class="cleanImg" src="https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/3776fdab07846c4eb5bf4b2a02a53e8c.png" mode=""></image>
			<text class="clean" @click="cleanRead()">
				清除未读
			</text>
		</view>
		<view class="newsBox">
			<template v-for="(item,index) in list">
				<view class="news" :key="index" @click="toRoute(index)">
					<image :src="item.img" mode="" class="nesImg"></image>
					<view class="newsContent">
						<view class="news_title" :style="{height:!item.content?'100%':''}">
							<text class="title">{{item.name}}</text>
							<text v-if="item.content">{{item.time}}</text>
						</view>
						<view class="contentBox" v-if="item.content">
							<view class="content u-line-1">
								{{item.content}}
							</view>
							<text class="unreadBox" v-if="item.unread > 0">{{item.unread}}</text>
						</view>
						
					</view>
				</view>
			</template>
		</view>
		<!-- 二次确认弹窗 -->
		<wsf-confirm v-model="showConfirm" title="是否确认清空所有未读消息？" activeText="确认" cancelText="取消" @confirm="activeConfirm"></wsf-confirm>
	</view>
</template>

<script>
export default {
	data() {
		return {
			showConfirm:false,
			list:[
				{
					img:'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/083fc2fbf5725ed6ed43917584a78f2b.png',
					name:'交易物流',
					time:'',
					content:'',
					unread:0,
				},
				{
					img:'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/93038f3bf2c99598424030714d82eff3.png',
					name:'服务通知',
					time:'',
					content:'',
					unread:0,
				},
				{
					img:'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/150e7091e0eeaaf79d76b5e60921cd6e.png',
					name:'优惠促销',
					time:'',
					content:'',
					unread:0,
				},
				{
					img:'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/48bfa3ef55b47748a49d37a8462e8ebb.png',
					name:'账户通知',
					time:'',
					content:'',
					unread:0,
				},
			],
			formData: {
				msgGroup: -1,
				pageNum:0,
				pageSize:10000,
			},
			unreadtotal:0
		};
	},
	onShow() {
		this.getList()
		this.readList()
	},
	methods: {
		// 清空未读消息
		activeConfirm(){
			let param = {
				msgGroup:-1
			}
			this.$u.api.updataNews(param).then(res => {
				if (res.code == 200) {
					this.showConfirm = false
					this.readList()
				}
			})
		},
		// 未读数量
		readList() {
			this.$u.api.queryNewsReadNums().then(res => {
				if (res.code == 200) {
					let temp = res.data.filter(ele => {
						if (ele.receiverType == 2) {
							return ele
						}
					})
					let arrRead = temp.map(item=> {
						return item.count
					})
					console.log(arrRead,'arrRead++++');
					this.list[0].unread = temp[0].count;
					this.list[1].unread = temp[1].count;
					this.list[2].unread = temp[2].count;
					this.list[3].unread = temp[3].count;
					// this.unreadtotal = temp[0].count + temp[1].count + temp[2].count + temp[3].count
					this.unreadtotal = arrRead.reduce((prev, cur, index)=>{
						return prev + cur
					})
				}
			})
		},
		// 列表
		getList() {
			this.$u.api.queryNews(this.formData).then(res => {
				if (res.code == 200) {
					let data = res.data.records;
					let [newsLogisticsArr,serverArr,promotionArr,accountArr] = [[],[],[],[]];
					data.map(item=> {
												
						if (item.msgGroup == 5) {
							newsLogisticsArr.push(item)
						} else if (item.msgGroup == 6) {
							serverArr.push(item)
						} else if (item.msgGroup == 7) {
							promotionArr.push(item)
						} else if (item.msgGroup == 8) {
							accountArr.push(item)
						}
					})
					console.log(newsLogisticsArr,'newsLogisticsArr');
					console.log(serverArr,'serverArr');
					console.log(promotionArr,'promotionArr');
					console.log(accountArr,'accountArr');
					if (newsLogisticsArr.length > 0) {
						this.list[0].time = newsLogisticsArr[0].createTime
						this.list[0].content = newsLogisticsArr[0].content
					} 
					if (serverArr.length > 0) {
						this.list[1].time = serverArr[0].createTime
						this.list[1].content = serverArr[0].content
					} 
					if (promotionArr.length > 0) {
						this.list[2].time = promotionArr[0].createTime
						this.list[2].content = promotionArr[0].content
					} 
					if (accountArr.length > 0) {
						this.list[3].time = accountArr[0].createTime
						this.list[3].content = accountArr[0].content
					}
				}
			})
		},
		// 清除未读
		cleanRead() {
			this.showConfirm = true;;
		},
		toRoute(index) {
			let url;
			if (index == 0) {
				url = 'newsLogistics'
			} else if(index == 1) {
				url = 'newsServer'
			} else if(index == 2) {
				url = 'newsPromotion'
			} else if(index == 3) {
				url = 'newsAccount'
			}
			this.$wsf.go(url)
		}
	}
};
</script>

<style lang="scss" scoped>
.applet-message-wrap{
	padding:0 24rpx;
}
.cleanBox{
	text-align:right;
	margin:30rpx 0;
	.cleanImg{
		width:32rpx;
		height:32rpx;
		vertical-align: middle;
		margin-top: -4rpx;
	}
	.clean{
		color:#BABABA;
		fotn-size:28rpx;
		margin-left:4rpx;
	}
}
.newsBox{
	margin-top:20rpx;
}
.news{
	width: 100%;
	height: 160rpx;
	background: #FFFFFF;
	border-radius: 20rpx;
	padding: 36rpx 24rpx 34rpx 20rpx;
	display: flex;
	margin-bottom: 24rpx;
	.nesImg{
		width:90rpx;
		height:90rpx;
		margin-right: 24rpx;
	}
	.newsContent{
		width: 544rpx;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		.news_title{
			display:flex;
			justify-content: space-between;
			align-items: center;
			color:#BABABA;
			font-size:24rpx;
			.title{
				color:#000000;
				font-size:34rpx;
			}
		}
		.contentBox{
			position: relative;
		}
		.content{
			color:#999999;
			font-size:28rpx;
			width:455rpx;
		}
		.unreadBox{
			font-size:22rpx;
			position:absolute;
			top:3rpx;
			right:0;
			display:inline-block;
			padding:6rpx 8rpx;
			height:32rpx;
			line-height:22rpx;
			border-radius:16rpx;
			background-color:#E60113;
			color:#FFFFFF;
		}
	}
}

</style>

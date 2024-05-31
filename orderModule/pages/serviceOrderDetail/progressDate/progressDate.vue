<template>
	<view class="page-content" >
        <service-order-header  title="进度详情" :bgColor="headerBgColor"></service-order-header>

        <view class="booth-block" :style="{'paddingTop':pagePaddingTop+'px'}"></view>
		
		<view class="applet-service-time-line" :class="!isShow ? 'margin-top' : ''" v-if="pageData">
			<u-time-line>
				<template v-for="(item, idx) in pageData.backOrderLogs">
					<u-time-line-item :key="idx" nodeTop="60">
						<template v-slot:node>
							<view class="u-node" :class="{ 'u-node-select': idx <= 0 }"></view>
						</template>
						<template v-slot:content>
							<view  :class="idx === pageData.backOrderLogs.length - 1 ? 'subIdx' : ''">
								<view class="u-order-title" :style="{ color: idx <= 0 ? '#191919' : '#999999' }">{{ item.logType }}</view>
									<view :key="subIdx">
										<view class="u-order-desc" :style="{ color: idx <= 0 && subIdx <= 0 ? '#6E6E6E' : '#999999' }">{{ item.message }}</view>
										<view class="u-order-time">{{ item.createTime }}</view>
									</view>
							</view>
						</template>
					</u-time-line-item>
				</template>
			</u-time-line>
		</view>
	</view>
</template>

<script>
import serviceOrderHeader from '../../../components/serviceOrderHeader/serviceOrderHeader.vue'
	export default {
        components:{
            serviceOrderHeader
        },
		data() {
			return {
				orderId: null,
				progressList: [],
				pageData: null,
				type:null,
				timestamp: null,
                pagePaddingTop:'',
                headerBgColor:'',//标题背景色
				statusDict: {
					1: "退款申请中，待商家审核，还剩",
					2: "退款申请已通过",
					3: "退款申请已拒绝",
					11:"退款申请已取消",
          13: '发起换货申请，待商家审核'
				}
			}
		},
		onLoad(option) {
			if(option) {
				this.orderId = option.id
				this.type = option.type
				this.getData()
			}
		},
        onShow() {
            let menuButtonInfo = uni.getMenuButtonBoundingClientRect()
            let statusBarHeight = uni.getSystemInfoSync().statusBarHeight
            let titlePadding = menuButtonInfo.top-statusBarHeight
            let titleHeight = titlePadding*2+32
            this.pagePaddingTop = titleHeight+statusBarHeight
	    },
        onPageScroll(e){
            if(e.scrollTop === 0){
                this.headerBgColor = ''
            }else{
                this.headerBgColor = 'linear-gradient(225deg, #FF5F2E 0%, #FF0A35 100%)'
            }
        },
        computed:{
            isShow(){
                if(!this.pageData) {
                    return false
                }
                return Number(this.pageData.status) < 4 || Number(this.pageData.status) === 11
            }
        },
		methods: {
			getData() {
				this.$u.api.backorderdetail({ id: this.orderId }).then(res => {
					this.pageData = res.data;
					if(this.pageData.status == 1) {
						let endTime = this.pageData.endTime.replace(/\-/g, '/')
						endTime = new Date(endTime).getTime()
						let nowTime = this.pageData.nowTime.replace(/\-/g, '/')
						nowTime = new Date(nowTime).getTime()
						if (endTime - nowTime > 0) {
							this.timestamp = (endTime - nowTime) / 1000
						}
					}
				})
			},
			// 跳转订单追踪页
			goToTrace() {
				this.$wsf.go('trackingCells', {
					id: this.orderId,
					type: 1
				});
			},
		}
	}
</script>

<style lang="scss" scoped>
.page-content{
    padding-bottom: 22rpx;
}
.booth-block{
    background:linear-gradient(225deg, #FF5F2E 0%, #FF0A35 100%);
    height: 56rpx;
    box-sizing: content-box;
}
.applet-service-time-line {
	border-radius: 16px;
	padding:24rpx 24rpx 24rpx 30rpx;
	margin:-36rpx 24rpx 20rpx 24rpx;
	background-color: #fff;
	.u-node {
		width: 14rpx;
		height: 14rpx;
		background: #dbdbdb;
		border: 4rpx solid #eeeeee;
		border-radius: 18rpx;
		overflow: hidden;
		box-sizing: content-box;
	}
	.u-node-select {
		background: #e60113;
		border: 4rpx solid #ffd8db;
	}

	.u-order-title {
		font-size: 26rpx;
		color: #999999;
		line-height: 34rpx;
		margin-bottom: 8rpx;
	}
	.u-order-desc {
		font-size: 22rpx;
		color: #6E6E6E;
		line-height: 30rpx;
		margin-bottom: 8rpx;
	}
	.u-order-time {
		font-size: 22rpx;
		color: #999999;
		line-height: 24rpx;
	}
	/deep/ .u-time-axis-item {
		margin-bottom: 16rpx !important;
        padding: 16rpx;
        background: rgba(246, 246, 246, 0.5);
        border-radius: 16rpx;
	}
    /deep/.u-time-axis::before {
        top: 60rpx !important;
    }
}
</style>

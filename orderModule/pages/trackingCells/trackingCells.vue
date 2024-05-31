<template>
	<view class="applet-tracking-order">
        <service-order-header  title="订单跟踪" :bgColor="headerBgColor"></service-order-header>
        <view class="booth-block"  :style="{'paddingTop':pagePaddingTop+'px'}"></view>
		<!-- 订单追踪头部信息展示 -->
		<view class="orderdetail module-com">
			<view class="orderdetail-every" >
				<text class="label">订单编号</text>
				<view class="orderdetail-every__value" v-if="expressData.orderCode">
					<text>{{ expressData.orderCode }}</text><text class="orderdetail-every__copy" @click.stop="copyValue(expressData.orderCode)">复制</text>
				</view>
			</view>
			<view class="orderdetail-every" >
				<text class="label">承运公司</text>
				<view class="orderdetail-every__value" v-if="expressData.expressCompany">
					<text>{{ expressData.expressCompany }}</text>
				</view>
			</view>
			<view class="orderdetail-every" >
				<text class="label">运单编号</text>
				<view class="orderdetail-every__value" v-if="expressData.logisticCode">
					<text>{{ expressData.logisticCode }}</text><text class="orderdetail-every__copy" @click.stop="copyValue(expressData.logisticCode)">复制</text>
				</view>
			</view>
		</view>

		<!-- 物流信息内容 -->
		<view class="applet-tracking-time-line">
			<view id="time-line-contain" :class="{'time-line-contain': hasMoreIcon}">
				<u-time-line>
					<u-time-line-item v-for="(item, idx) in tracesList" :key="idx" nodeTop="60" class="node-wrap">
						<template v-slot:node>
							<view class="u-node" :class="{ 'u-node-select': idx <= 0 }"></view>
						</template>
						<template v-slot:content>
								<view class="u-order-title" :style="{ color: idx <= 0 ? '#191919' : '#999999' }"><image src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/order/receipt-new.png"/>{{ item.action }}</view>
								<view class="u-order-desc-contain">
									<view v-for="(subItem, subIdx) in item.children" :key="subIdx" class="u-order-desc-wraper">
										<view class="u-order-desc" :style="{ color: idx <= 0 && subIdx <= 0 ? '#6E6E6E' : '#999999' }">{{ subItem.acceptStation }}</view>
										<view class="u-order-time">{{ subItem.acceptTime }}</view>
									</view>
								</view>
						</template>
					</u-time-line-item>
				</u-time-line>
			</view>
			<view class="sku-more-btn" v-if="hasMore" @click="isHasMore()">
				<image v-if="hasMoreIcon" src="https://wsjc-web.wsecar.com/wsf-mall/skuDetail/icon-btn-btom.png"></image>
				<image v-else src="https://wsjc-web.wsecar.com/wsf-mall/skuDetail/icon-btn-top.png"></image>
			</view>
		</view>

		<!-- 热销商品模块 -->
		<view class="applet-template-recommend">
			<wsf-goods-list title="hot" ref="recommedList" :list="flowList" :loadStatus="loadStatus" @goodsClick="goodsClick($event)"></wsf-goods-list>
		</view>
	</view>
</template>

<script>
import { priceFilter } from '@/common/wsfFilter.js';
import serviceOrderHeader from '../../components/serviceOrderHeader/serviceOrderHeader.vue'
export default {
    components:{
        serviceOrderHeader
    },
	data() {
		return {
			expressData: {
				orderCode: null,
				expressCompany: null,
				logisticCode: null
			},
			expressInfo: {
				expressCode: undefined, // 快递公司编号
				expressCompany: undefined, // 快递公司名字
				orderCode: undefined, // 订单编号
				logisticCode: undefined, // 快递编号
				customerName: undefined // 客户手机号后4位 - 部分快递需求
			},
            headerBgColor:'',//标题背景色
			hasMore: false, // 是否需要查看更多物流
			hasMoreIcon: false, // 物流展开还是收起

			tracesList: [
				{
					action: '正在等待揽收中',
					children: [
						{
							acceptStation: '暂无物流信息',
							acceptTime: ''
						}
					]
				}
			],

			// 热销商品
			RecommendQueryForm: {
				pageType: 6,
				pageNum: 0,
				pageSize: 10,
			},
			flowList: [],
			isLoading: false,
			RecommendHasMore: true,
            pagePaddingTop:'',
			loadStatus: ''
		};
	},
	onLoad(options) {
		this.expressInfo = options
	},
	onShow() {
        let menuButtonInfo = uni.getMenuButtonBoundingClientRect()
        let statusBarHeight = uni.getSystemInfoSync().statusBarHeight
        let titlePadding = menuButtonInfo.top-statusBarHeight
        let titleHeight = titlePadding*2+32
        this.pagePaddingTop = titleHeight+statusBarHeight
		this.loadTraces();
		this.loadRecommend();
	},
    onPageScroll(e){
        if(e.scrollTop === 0){
            this.headerBgColor = ''
        }else{
            this.headerBgColor = 'linear-gradient(225deg, #FF5F2E 0%, #FF0A35 100%)'
        }
    },
	onReachBottom() {
		console.log('我到页面最底部了~');
		// 加载推荐列表
		this.loadRecommend();
	},
	methods: {
		// 获取物流详情
		loadTraces() {
			let data = {
                backOrderId:this.expressInfo.id,
                postType:this.expressInfo.type
            }
            if(this.expressInfo.isSfterSales){
                // 从售后详情单进
                this.$u.api.queryOrderTraces(data).then(res => {
            if(res.data){
			  this.expressData.orderCode = res.data.orderCode
			  this.expressData.expressCompany = res.data.expressCompany
			  this.expressData.logisticCode = res.data.trackingNumber
			  if (res.data.tracesList) {
			    this.tracesList = this.filterTracesList(res.data.tracesList)
			  }
            }
            })
            }else{
                let data = JSON.parse(JSON.stringify(this.expressInfo))
			    this.$u.api.getLogisticsById(data).then(res => {
			        this.expressData.orderCode = res.data.orderCode
			        this.expressData.expressCompany = res.data.expressCompany
			        this.expressData.logisticCode = res.data.trackingNumber
			        if (res.data.tracesList) {
			          this.tracesList = this.filterTracesList(res.data.tracesList)
			        }
			    })
            }
			  // 获取物流区域高度
			  this.getTraceHeight()
		},
		// 复制到剪贴板
		copyValue(value) {
			uni.setClipboardData({
				data: value,
				success: function() {
					console.log('复制成功');
				}
			});
		},
		// 过滤物流数组
		filterTracesList(tracesList) {
			let list = [];
			let result = [];
			tracesList.forEach(el => {
				const listIdx = list.indexOf(el.action);
				if (listIdx < 0) {
					list.push(el.action);
					result.push({
						action: el.action,
						children: [{ acceptStation: el.acceptStation, acceptTime: el.acceptTime }]
					});
				} else {
					result[listIdx].children.push({
						acceptStation: el.acceptStation,
						acceptTime: el.acceptTime
					});
				}
			});
			return result;
		},

		// 获取物流区域高度
		getTraceHeight() {
			this.$nextTick(item => {
				let info = uni.createSelectorQuery().in(this).select('#time-line-contain');
				let that = this
				info.boundingClientRect(function(data) {
					if (data.height >= 167) {
						that.hasMore = true
						that.hasMoreIcon = true
					}
				}).exec(function(res){
				})
			})
			
		},

		// 是否有查看更多物流按钮
		isHasMore() {
			this.hasMoreIcon = !this.hasMoreIcon
		},

		// 商品跳转
		goodsClick(e) {
			console.log('e', e);
			// this.$wsf.go('SkuDetail', { skuId: e.id });
			if(e.goodsSource == 4){
				this.$wsf.go('ToMotor',{skuId: e.id});
			} else {
				this.$wsf.go('SkuDetail', { skuId: e.id });
			}
		},
		priceFilter,
		// 获取推荐商品列表
		loadRecommend() {
			if (this.isLoading || !this.RecommendHasMore) return;
			this.isLoading = true;
			this.loadStatus = 'loading';
			this.$u.api.QueryRecommendCommodity(this.RecommendQueryForm).then(res => {
				this.isLoading = false;
				this.loadStatus = 'loadmore';
				console.log('res', res);
				if (res.code === 200) {
					this.flowList = this.flowList.concat(
						res.data.map(item => {
							item.price = this.priceFilter(item.price);
							return item;
						})
					);
					this.RecommendQueryForm.pageNum++;
					this.RecommendHasMore = res.data.length === 10;
					this.loadStatus = res.data.length === 10 ? 'loadmore' : 'nomore';
				}
			});
		},
	}
};
</script>

<style lang="scss" scoped>
.applet-tracking-order{
    position: relative;
}
.booth-block{
    background:linear-gradient(225deg, #FF5F2E 0%, #FF0A35 100%);
    height: 56rpx;
    box-sizing: content-box;
}
.module-com {
	background: #FFFFFF;
	border-radius: 24rpx;
	margin:-36rpx 0rpx 20rpx 0rpx;
}
.orderdetail {
	padding: 12rpx 0;
    position: relative;
	&-every {
		display: flex;
		justify-content: space-between;
		line-height: 34rpx;
		font-size: 26rpx;
		font-weight: 400;
		color: #191919;
		padding: 20rpx 20rpx 18rpx 20rpx;
	}
	&-every__value {
		max-width: 474rpx;
		word-break: break-all;
	}
	&-every__copy {
		display: inline-block;
		width: 76rpx;
		height: 34rpx;
		line-height: 34rpx;
		text-align: center;
		background: #F7F7F7;
		border-radius: 18rpx;
		font-size: 22rpx;
		font-weight: 400;
		color: #444444;
		margin-left: 8rpx;
	}
}
.applet-tracking-time-line {
    position: relative;
	width: 702rpx;
	margin: 20rpx auto 0;
	padding: 24rpx 24rpx 24px 0;
	background-color: #fff;
	border-radius: 16rpx;
	.time-line-contain {
		height: 433rpx;
		overflow: hidden;
	}
	.sku-more-btn {
      width: 122rpx;
      height: 32rpx;
      border-radius: 16rpx;
      margin: 20rpx auto 0;
      image {
        width: 121rpx;
        height: 31rpx;
        display: block;
      }
    }
	.u-node {
		width: 14rpx;
		height: 14rpx;
		background: #C3C3C3;
		border: 4rpx solid #F7F7F7;
		border-radius: 50%;
		overflow: hidden;
		box-sizing: content-box;
	}
	.u-node-select {
		background: #FF0A35;
		border: 4rpx solid #FFE6EA;
	}

	.u-order-title {
		line-height: 17px;
		font-size: 13px;
		font-weight: 400;
		color: #191919;
		display: flex;
		image {
			width: 16px;
			height: 17px;
			margin-right: 4px;
			opacity: 0.5;
		}
	}
	.u-order-desc-contain {
		.u-order-desc-wraper {
			margin-top: 16px;
		}
		.u-order-desc-wraper:first-of-type {
			margin-top: 4px;
		}
	}
	
	.u-order-desc {
		line-height: 15px;
		font-size: 11px;
		font-weight: 400;
		color: #6E6E6E;
	}

	.u-order-time {
		line-height: 15px;
		font-size: 11px;
		font-weight: 400;
		color: #999999;
		margin-top: 4px;
	}

	/deep/ .u-time-axis {
		padding-left: 54rpx;
	}
	/deep/ .u-time-axis-item {
		width: 624rpx;
		border-radius: 16rpx;
		padding: 16rpx;
		background: rgba(246, 246, 246, 0.5);
		margin-bottom: 0;
	}
	/deep/ .node-wrap .u-time-axis-item {
		margin-top: 16rpx;
	}
	/deep/ .node-wrap:first-of-type .u-time-axis-item {
		margin-top: 0rpx;
		.u-order-title {
			image {
				opacity: 1;
			}
		}
	}
	/deep/ .u-time-axis-node {
		left: -23rpx;
	}
    /deep/.u-time-axis::before {
        top: 60rpx !important;
        left: 30rpx !important;
    }
}

.applet-template-recommend {
	padding: 0 24rpx;
}

/deep/.wsf-mode-footer{
	height: auto !important;
}
</style>

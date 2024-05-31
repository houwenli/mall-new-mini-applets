<template>
	<view class="page-content">
        <service-order-header  :title="serverStatusDict[pageData.status] ? serverStatusDict[pageData.status] : pageData.backOrderLogs[0].logType" :bgColor="headerBgColor"></service-order-header>

        <!-- 节点流程 -->
        <status-process :statusList="statusList" :pageData="pageData" lineWidth="224rpx" ></status-process>

			<view class="service-status-detail" v-if="pageData.backOrderLogs && pageData.backOrderLogs.length > 0" @click="goToProgressDate()">
					<view class="service-status-title flex-space-between">
						<view class="progress" v-if="pageData.status == 1">您的服务单已申请成功，待卖家审核中
							<span v-if="pageData.backOrderType!=4">还剩</span>
							<u-count-down
								v-if="pageData.backOrderType!=4"
								class="time-count"
								separator="zh"
								separator-size="26"
								separator-color="#E60113"
								color="#E60113"
								font-size="26"
								:timestamp="timestamp"
								@end="countDownFinshed()"
							></u-count-down>
						</view>
						<view class="progress" v-else-if="pageData.status == 1">
							您的退款申请商家已同意，待平台审核通过发放退款金额即可
						</view>
						<view class="progress" v-else-if="pageData.status == 3">您的退款申请商家已拒绝，请注意查收商品</view>
						<view v-else class="progress text-grey">
							{{ pageData.backOrderLogs ? pageData.backOrderLogs[0].message : '' }}
						</view>
						<view class="describe" v-if="pageData.desc">问题描述：{{ pageData.desc }}</view>
					</view>
					<image class="more-icon" src="https://wsjc-web.wsecar.com/wsf-mall/skuDetail/icon-right.png"></image>
		</view>

        <view class="service-info-card" v-if="pageData.status == 2">
			<view class="card-column">
				<view class="card-label">退回金额</view>
				<view class="card-value u-font-26">¥ {{pageData.realBackPrice ? pageData.realBackPrice.toFixed(2) : '0.00'}}</view>
			</view>
			<view class="card-column" v-for="(item,index) in pageData.backWayPrices" :key="index">
				<view class="card-label">{{backWayDict[item.backChannel]}}（预计1-5个工作日到账）</view>
				<view class="card-value price-red u-font-26">¥ {{item.backPrice ? item.backPrice.toFixed(2) : '0.00'}}</view>
			</view>
		</view>

        <!-- 商品信息 -->
        <service-order-sku-card v-if="pageData && pageData.refundSku" :pageData="pageData" :skuData="pageData.refundSku"></service-order-sku-card>

		<view class="service-info-card">
            <view class="card-column">
				<view class="card-label">订单编号</view>
				<view class="card-value">
					<view class="u-font-26">{{ pageData.orderCode }}</view>
					<view class="copy-btn" @click="setClipboardData(pageData.orderCode)">复制</view>
				</view>
			</view>
			<view class="card-column">
				<view class="card-label">服务单号</view>
				<view class="card-value">
					<view class="u-font-26">{{ pageData.backCode }}</view>
					<view class="copy-btn" @click="setClipboardData(pageData.backCode)">
						复制
					</view>
				</view>
			</view>
			<view class="card-column">
				<view class="card-label">申请时间</view>
				<view class="u-font-26">{{ pageData.createTime }}</view>
			</view>
			<view class="card-column">
				<view class="card-label">服务类型</view>
				<view class="u-font-22">{{ pageData.type == 1 ? '退款' : pageData.type == 2 ? '退货' : pageData.type == 3 ? '换货' : '' }}</view>
			</view>
			<view class="card-column">
				<view class="card-label">申请原因</view>
				<view class="u-font-22">{{ pageData.reason }}</view>
			</view>
			<view class="card-column">
				<view class="card-label">退款方式</view>
				<view class="u-font-22">原返</view>
			</view>
		</view>
		<view class="bottom-column" v-if="pageData && pageData.status == 1">
			<view
				class="white-btn"
				v-if="pageData && (pageData.status == 1)"
				@click.stop="openConfirm()"
			>
				取消申请
			</view>
		</view>

		<wsf-confirm
			v-model="showConfirm"
			:context="confirmContext"
			:activeText="confirmButton"
			:cancelText="cancelButton"
			@confirm="activeConfirm"
			@cancel="activeCancel"
            contextAlign="center"
		></wsf-confirm>
	</view>
</template>

<script>
import completeImg from '@/static/img/icon/tbg@2x.png';
import { priceFilter, phoneNumberHide } from '@/common/wsfFilter.js';
import serviceOrderSkuCard from '../../components/serviceOrderSkuCard/serviceOrderSkuCard.vue'
import statusProcess from '../../components/statusProcess/statusProcess.vue'
import serviceOrderHeader from '../../components/serviceOrderHeader/serviceOrderHeader.vue'
export default {
    components:{
        serviceOrderSkuCard,
        statusProcess,
        serviceOrderHeader
    },
	data() {
		return {
			isShowOrderInfo: false,
            headerBgColor:'',//标题背景色
			backWayDict: {
				0: '万顺宝余额',
				2: '微信',
				3: '支付宝',
				9: '福气值',
			},
			payWayType: {
				0: '余额支付',
				1: '钱包支付',
				2: '微信支付',
				3: '支付宝支付',
				4: '银联支付',
				5: '平台代付',
				6: '礼卡抵扣',
				7: '微信+余额支付',
				8: '支付宝+余额支付'
			},
			priceFilter,
			phoneNumberHide,
			timestamp: null,
			confirmButton: '',
			cancelButton: '',
			showConfirm: false,
			confirmContext: '',
			pageData: {},
			orderId: '',
			orderSkuId: '',
			completeImg: completeImg,
			serverStatusDict: {
				1: '待审核',
				2: '审核通过',
				3: '审核拒绝',
			},
			statusList: [
				{
					name: '提交申请',
					status: [0]
				},
				{
					name: '供应商审核',
					status: [1]
				},
				{
					name: '审核通过',
					status: [2]
				},
			]
		};
	},
	onLoad(option) {
		if (option) {
			this.orderId = option.orderId || option.id;
		}
	},
    onShow() {
		this.loadServiceOrderDetail();
	},
    onPageScroll(e){
        if(e.scrollTop === 0){
            this.headerBgColor = ''
        }else{
            this.headerBgColor = 'linear-gradient(225deg, #FF5F2E 0%, #FF0A35 100%)'
        }
    },
	methods: {
		// 复制到剪贴板
		setClipboardData(data) {
			uni.setClipboardData({ data: data });
		},
		// 前往商品详情
		goToSku(id) {
			if(this.pageData.orderType == 9) {
				this.$wsf.go('SkuDetail', { skuId: id, storeIdNumber: this.pageData.buyStoreId, sourceType: 2 });
			} else {
				this.$wsf.go('SkuDetail', { skuId: id });
			}
		},
		//倒计时结束
		countDownFinshed() {
			if (this.pageData.status == 4) {
				this.$u.api.dealApplyOverDue({ id: this.orderId }).then(res => {
					this.loadServiceOrderDetail();
				});
			} else
			if (this.pageData.status == 6) {
				this.$u.api.dealFillLogisticsOverDue({ id: this.orderId }).then(res => {
					this.loadServiceOrderDetail();
				});
			}
		},
		//查询详情
		loadServiceOrderDetail() {
			this.$u.api.backorderdetail({ id: this.orderId }).then(res => {
				this.pageData = res.data;
				let options={}, storeServiceConfig = this.pageData.storeServiceConfig,tagsurl = ''
				Object.keys(storeServiceConfig).forEach(key => {
					 if(storeServiceConfig[key]){
						 if(key == 'staffId'){
							 options.staffid = storeServiceConfig[key]
							}else{
							 options[key] = storeServiceConfig[key]
							}
					 }
				 })
				 if(options.staffid){
					 tagsurl = `https://merchant.wsfmall.com/ordermanagement/mallorder/returnreview?id=${this.pageData.id}`
				 }else{
					 //         https://platform-test.wsfmall.com/ordermagamemt/storeorder/storerefundreview?id=1230
					 tagsurl = `https://platform.wsfmall.com/ordermagamemt/storeorder/storereturnreview?id=${this.pageData.id}`
				 }
				let obj = ''
				let ysfData = {
					id:this.pageData.id,
					title:`售后单号: ${this.pageData.backCode}`,
					desc:this.pageData.refundSku.skuName,
					picture: this.pageData.refundSku.skuImage,
					tagsurl,
					note:`￥${this.pageData.refundSku.price}`,
					navigateToUrl:`/orderModule/pages/serviceOrderDetail/serviceOrderDetail?orderId=${this.pageData.id}`,
					...options
				}
				obj = JSON.stringify(ysfData)
				uni.setStorageSync("YSFDATA",obj)

				if(this.pageData.status == 1 ) {
					let endTime = this.pageData.endTime.replace(/\-/g, '/')
					endTime = new Date(endTime).getTime()
					let nowTime = this.pageData.nowTime.replace(/\-/g, '/')
					nowTime = new Date(nowTime).getTime()
					if (endTime - nowTime > 0) {
						this.timestamp = (endTime - nowTime) / 1000
					}
				}

				if(this.pageData.status == 3) {
					let obj = {
						name: '审核拒绝',
						status: [3]
					}
					this.statusList.splice(2,1,obj)
					console.log(this.statusList,"this.statusList");
				}
			});
		},
		//去进度详情
		goToProgressDate() {
			let id = this.pageData.id;
			this.$wsf.go('progressDate', { id: id,type: this.pageData.type });
		},
		//打开弹窗
		openConfirm() {
			this.confirmContext = '是否取消退款申请？';
			this.confirmButton = '确认取消';
			this.cancelButton = '取消';
			this.showConfirm = true;
		},
		// 弹窗确认
		activeConfirm() {
			this.$u.api.cancelReturn({ id: this.pageData.id }).then(res => {
				this.$u.toast('取消申请成功');
				this.showConfirm = false;
				this.loadServiceOrderDetail();
			},({data:{code}})=>{
				this.showConfirm = false;
				//"订单状态已改变" 重新获取订单
				if(code == 2007){
					this.loadServiceOrderDetail();
				}
			});
		},
		// 弹窗取消
		activeCancel() {}
	}
};
</script>

<style scoped lang="scss">
.text-grey {
	font-size: 26rpx !important;
	font-weight: 400 !important;
	color: #666 !important;
}
.page-content{
    position: relative;
    padding-bottom: calc(96rpx + constant(safe-area-inset-bottom));
    padding-bottom: calc(96rpx + env(safe-area-inset-bottom));
}
// 服务单状态信息
.service-status-detail {
	margin-top: -24rpx;
	z-index: 999;
    padding: 32rpx 24rpx;
    background: #FFFFFF;
    border-radius: 24rpx;
    display: flex;
    justify-content: space-between;
    margin-bottom: 20rpx;
    .service-status-title{
        font-size: 26rpx;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #191919;
        line-height: 34rpx;
    }
    .time-count{
        /deep/.u-countdown{
            display: inline !important;
           &-item{
            display: inline !important;
            padding: 0rpx !important;
           } 
            &-colon{
                display: inline !important;
                line-height: 34rpx !important;
                padding: 0rpx !important;
            }
            &-time{
                display: inline !important;
                line-height: 34rpx !important;
            }
        }
    }
    .clear{
        clear: both;
    }
    .progress {
        max-width: 654rpx;
		font-weight: 500;
		font-size: 26rpx;
		line-height: 34rpx;
	}
    .more-icon{
        width: 32rpx;
        height: 32rpx;
        margin-left: 16rpx;
        flex-shrink: 0;
    }
    .describe {
		font-size: 26rpx;
        color: #999999;
        line-height: 34rpx;
        margin-top: 16rpx;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        font-weight: 400;
	}
}
.service-info-card {
	padding: 8rpx 24rpx;
	background: #fff;
	border-radius: 24rpx;
    margin:0rpx 20rpx 20rpx 20rpx;
    .card-column{
        display: flex;
        justify-content: space-between;
        padding: 20rpx 0rpx 18rpx 0rpx;
    }
    .card-label{
        font-size: 26rpx;
        color: #191919;
        line-height: 34rpx;
    }
    .card-value{
        display: flex;
        align-items: center;
        max-width: 458rpx;
    }
    .copy-btn{
        width: 76rpx;
        font-size: 22rpx;
        height: 34rpx;
        line-height: 34rpx;
        background: #F7F7F7;
        border-radius: 17rpx;
        text-align: center;
        margin-left: 16rpx;
    }
    .price-red{
        color: #FF0A35;
    }
}
.bottom-column {
	width: 100%;
	background-color: #fff;
    display: flex;
    justify-content: flex-end;
	padding: 16rpx 24rpx;
	position: fixed;
	bottom: 0;
	left: 0;
    padding-bottom: calc(16rpx + constant(safe-area-inset-bottom));
    padding-bottom: calc(16rpx + env(safe-area-inset-bottom));
    .white-btn{
        border-radius: 32rpx;
        border: 1rpx solid #C3C3C3;
        color: #191919;
        text-align: center;
        padding: 14rpx 24rpx;
        margin-left: 24rpx;
        line-height: 36rpx;
    }
    .red-btn{
        border-radius: 32rpx;
        background: linear-gradient(90deg, #FF6B4E 0%, #FF0A35 100%);
        color: #FFFFFF;
        text-align: center;
        padding: 14rpx 24rpx;
        margin-left: 24rpx;
        line-height: 36rpx;
    }
}
</style>

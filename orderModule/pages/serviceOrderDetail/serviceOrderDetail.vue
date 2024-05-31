<template>
	<view class="page-content" v-if="pageData">
        <service-order-header  :title="serverStatusDict[Number(pageData.status)]"  :bgColor="headerBgColor"></service-order-header>
        <!-- 审核流程 -->
        <status-process  :statusList="statusList" :pageData="pageData" lineWidth="124rpx"></status-process>
        <!-- 服务单信息 -->
			<view class="service-status-detail" v-if="pageData.backOrderLogs && pageData.backOrderLogs.length > 0" @click="goToProgressDate()">
					<view class="service-status-title">
						<view class="progress">
                            <span>{{ serviceOrderInfoText }}</span>
							<u-count-down
								v-if="(pageData.status==4&&pageData.backOrderType!=4)||pageData.status==6"
								class="float-count"
								separator="zh"
								separator-size="26"
								separator-color="#E60113"
								color="#E60113"
								font-size="26"
								:timestamp="timestamp"
								@end="countDownFinshed()"
							></u-count-down>
                            <span v-if="Number(pageData.status) === 6">后关闭</span>
						</view>
                        <view class="describe" v-if="describeText">{{ describeText }}</view>
                    </view>
                    <image class="more-icon" src="https://wsjc-web.wsecar.com/wsf-mall/skuDetail/icon-right.png"></image>
			</view>
		<view class="address-card" v-if="isShowAddressInfo || pageData.waybillCode">
            <logistics-info :marginBottom="isShowAddressInfo?'32rpx':'0rpx'" v-if="pageData.waybillCode" componentType="1" :dataObj="pageData" :orderId="pageData.id"></logistics-info>
            <address-block v-if="isShowAddressInfo" :dataObj="pageData" componentType="1"></address-block>
		</view>
		<view class="service-info-card" v-if="pageData.status == 8">
			<view class="card-column">
				<view class="card-label">退回金额</view>
				<view class="card-value u-font-26">¥{{ pageData.realBackPrice }}</view>
			</view>

			<view v-for="item in pageData.backWayPrices" :key="item.id" class="card-column">
				<view class="card-label u-font-26">{{ payWayType[item.backChannel] }}（预计1-5个工作日）</view>
				<view class="card-value price-red u-font-26">¥{{ item.backPrice }}</view>
			</view>
		</view>
        <!-----------商品信息------------------>
        <service-order-sku-card :pageData="pageData" :skuData="pageData.returnSku"></service-order-sku-card>
        <!-----------服务编号信息------------------>
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
					<view class="copy-btn" @click="setClipboardData(pageData.backCode)">复制</view>
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
        <view class="service-info-card">
            <view class="card-column">
				<view class="card-label">商品退回</view>
				<view class="u-font-22">{{ pageData.backType == 1 ? '快递至供应商卖家' : '' }}</view>
			</view>
			<view class="card-column">
				<view class="card-label">退货联系人</view>
				<view class="u-font-22">{{ pageData.contactName }}</view>
			</view>
			<view class="card-column">
				<view class="card-label">联系电话</view>
				<view class="u-font-26">{{ phoneNumberHide(pageData.contactMobile) }}</view>
			</view>
        </view>

		<view class="bottom-column" v-if="pageData && ['10','18','19'].indexOf(pageData.status) == -1">
			<view
				class="white-btn"
				v-if="pageData && (pageData.status == 4 || pageData.status == 6 || pageData.status == 7 || pageData.status == 13 || pageData.status == 15 || pageData.status == 16)"
				@click.stop="openConfirm(3, pageData)"
			>
				取消申请
			</view>
			<view
				v-if="pageData && pageData.status == 4"
				class="white-btn"
				@click.stop="toAfterSalesService(pageData.id, pageData.returnSku.skuId, 2)"
			>
				修改申请
			</view>
			<view
				v-if="pageData.status == 6"
				class="red-btn"
				@click.stop="goToDeliveryForm(pageData.id, 1)"
			>
				填写发货单
			</view>
			<view
				v-if="pageData.status == 7&&pageData.backOrderType != 4"
				class="red-btn"
				@click.stop="goToDeliveryForm(pageData.id, 2)"
			>
				更改发货单
			</view>
			<view
				v-if="pageData && ['3','5','9','11','12','14','17','22','8'].includes(pageData.status)"
				class="white-btn"
				@click.stop="deleteForm()"
			>
				删除服务单
			</view>
		</view>

		<wsf-confirm
			v-model="showConfirm"
			:title="confirmContext"
			:activeText="confirmButton"
			:cancelText="cancelButton"
			@confirm="activeConfirm"
			@cancel="activeCancel"
		></wsf-confirm>
	</view>
</template>

<script>
import completeImg from '@/static/img/icon/tbg@2x.png';
import { priceFilter, phoneNumberHide } from '@/common/wsfFilter.js';
import serviceOrderSkuCard from '../../components/serviceOrderSkuCard/serviceOrderSkuCard.vue'
import addressBlock from '../../components/addressBlock/addressBlock.vue'
import logisticsInfo from '../../components/logisticsInfo/logisticsInfo.vue'
import statusProcess from '../../components/statusProcess/statusProcess.vue'
import serviceOrderHeader from '../../components/serviceOrderHeader/serviceOrderHeader.vue'
export default {
    components:{
        serviceOrderSkuCard,
        addressBlock,
        logisticsInfo,
        statusProcess,
        serviceOrderHeader
    },
	data() {
		return {
			isShowOrderInfo: false,
			isShowReturnInfo: false,
            headerBgColor:'',//标题栏背景色
			payWayType: {
				0: '余额支付',
				1: '钱包支付',
				2: '微信支付',
				3: '支付宝支付',
				4: '银联支付',
				5: '平台代付',
				6: '礼卡抵扣',
				7: '微信+余额支付',
				8: '支付宝+余额支付',
                9: '福气值支付',
                10:'福气值+万顺宝余额支付',
                11:'福气值+支付宝支付',
                12:'福气值+微信支付',
                13:'福气值+万顺宝余额+支付宝支付',
                14:'福气值+万顺宝余额+微信支付'
			},
			priceFilter,
			phoneNumberHide,
			timestamp: null,
			confirmButton: '',
			cancelButton: '',
			showConfirm: false,
			confirmContext: '',
			pageData: null,
			orderId: '',
			orderSkuId: '',
			completeImg: completeImg,
			serverStatusDict: {
				4: '待审核',
				5: '服务单关闭',
				6: '请您发货',
				7: '待供应商收货',
				8: '退款成功',
				9: '服务单关闭',
				11: '服务单取消',
                12: '退款成功',
			},
			statusList: [
				{
					name: '提交审核',
					status: [4]
				},
				{
					name: '供应商审核',
					status: [6]
				},
				{
					name: '供应商收货',
					status: [7]
				},
				{
					name: '完成',
					status: [8,12]
				}
			],
            // 服务单信息
            serviceOrderInfoMap:{
                4:'您的服务单已申请成功，待商家审核中，还剩',
                6:'您的服务单商家已审核完成，请您尽快发货，如未及时发货将在',
                7:'您的退货商品已寄出，商家最迟将在7天内确认收货，请您耐心等待',
                8:'服务单已完成，感谢您对万顺的支持',
                12:'服务单已完成，感谢您对万顺的支持',
                11:'服务单已取消，如有需要可在售后申请页重新提交服务单',
                5:'服务单已关闭，如有需要可在售后申请页重新提交服务单',
                9:'服务单已关闭，如有需要可在售后申请页重新提交服务单',
            },
            // 备注文案
            describeMap:{
                6:'商家审核通过，请您及时寄出退货商品',
                12:'您的服务单财务已退款，请您注意查收',
                8:'您的服务单财务已退款，请您注意查收',
                9:'您未在规定的时间内寄出商品，服务单已关闭，如有需要可在售后申请页重新提交服务单' 
            }
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
    computed:{
        // 服务单信息
        serviceOrderInfoText(){
						if(!this.pageData) return

            if(this.pageData.status*1 === 8){
                return `服务单${this.pageData.backCode}已完成，感谢您对万顺的支持`
            }
			if(this.pageData.status*1 === 4 &&this.pageData.backOrderType == 4){
				return '您的服务单已修改成功，待商家审核中'
			}
            if(this.pageData.status*1 === 4 && this.pageData.backOrderLogs[0].status*1 === 12){
                return '您的服务单已修改成功，待商家审核中，还剩'
            }
						
			if(this.pageData.status*1 === 7 &&this.pageData.backOrderType == 4){
				return '您的退货商品已寄出，请您耐心等待商家确认收货'
			}
            return this.serviceOrderInfoMap[this.pageData.status*1]
        },
        // 备注文案计算
        describeText(){
            if(!this.pageData) return

            let status = Number(this.pageData.status)
            let text = ''
            switch (status) {
                case 4: text = `申请原因：${this.pageData.reason}`; break;//取申请原因字段
                case 5: text = `关闭原因：${this.pageData.backOrderLogs[0].rawMessage}`; break;//商家填写的审核驳回或不同意退款的原因
                case 6: 
                    // 取商家审核通过时填写的原因 如果没有填写原因 则取固定字段
                    text = this.pageData.backOrderLogs[0].rawMessage ? this.pageData.backOrderLogs[0].rawMessage : this.describeMap[status] //关闭原因
                    break;
                case 7: text = this.pageData.acceptStation; break;//取最新物流信息字段
                
                case 8: text =this.describeMap[status]; break;//固定文案
                case 9:
                    // 用户未在7天内寄出商品 取固定文案 否则取 商家填写的审核驳回或不同意退款的原因
                    text = this.pageData.backOrderLogs[0].status*1 === 13 ? this.describeMap[status] : `关闭原因：${this.pageData.backOrderLogs[0].rawMessage}`
                    break;
                case 11: text = '';  break;
                default:
                    break;
            }
            return text
        },
        // 是否显示寄出地址
        isShowAddressInfo(){
            if(!this.pageData) return

            return [6,7,8,9,10,11,12].includes(Number(this.pageData.status))
        }
    },
	methods: {
		deleteForm() {
			this.$u.api.deleteBackOrder({ id: this.orderId }).then(res => {
				if (res.code == 200) {
					this.$u.toast('操作成功');
					this.$wsf.go('BackOrderList');
				}
			});
		},
		// 复制到剪贴板
		setClipboardData(data) {
			uni.setClipboardData({ data: data });
		},
		// 前往商品详情
		// goToSku(id) {
		// 	if(this.pageData.orderType == 9) {
		// 		this.$wsf.go('SkuDetail', { skuId: id, storeIdNumber: this.pageData.buyStoreId, sourceType: 2 });
		// 	} else {
		// 		this.$wsf.go('SkuDetail', { skuId: id });
		// 	}
		// },
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
					desc:this.pageData.returnSku.skuName,
					picture: this.pageData.returnSku.skuImage,
					tagsurl,
					note:`￥${this.pageData.returnSku.price}`,
					navigateToUrl:`/orderModule/pages/serviceOrderDetail/serviceOrderDetail?orderId=${this.pageData.id}`,
					...options
				}
				obj = JSON.stringify(ysfData)
				uni.setStorageSync("YSFDATA",obj)
				if (this.pageData.status == 7 || this.pageData.status == 8 || this.pageData.status == 9 || this.pageData.status == 10 || this.pageData.status == 12) {
					this.isShowOrderInfo = true;
				}
				if (
					this.pageData.status == 6 ||
					this.pageData.status == 7 ||
					this.pageData.status == 8 ||
					this.pageData.status == 9 ||
					this.pageData.status == 10 ||
					this.pageData.status == 12
				) {
					this.isShowReturnInfo = true;
				}


				let endTime = this.pageData.endTime && this.pageData.endTime.replace(/\-/g, '/')
				endTime = new Date(endTime).getTime()
				let nowTime = this.pageData.nowTime && this.pageData.nowTime.replace(/\-/g, '/')
				nowTime = new Date(nowTime).getTime()
				if (endTime - nowTime > 0) {
				  // this.timestamp = (endTime - nowTime) / 1000
					if(this.pageData.status == 7) {
					  //向上取整转化成天
					  let countDownTime = endTime - nowTime
					  let countDownDay = Math.ceil(countDownTime / (1000 * 60 * 60 * 24))
					  this.timestamp = countDownDay
					} else {
					  this.timestamp = (endTime - nowTime) / 1000
					}
				}
			});
		},
		//去进度详情
		goToProgressDate() {
			let id = this.pageData.id;
			this.$wsf.go('progressDate', { id: id,type: this.pageData.type });
		},
		//打开弹窗
		openConfirm(item) {
			this.confirmContext = '确认取消售后申请？';
			this.confirmButton = '确认取消';
			this.cancelButton = '取消';
			this.selectOrderId = item.id;
			this.showConfirm = true;
		},
		//去发货单页面
		goToDeliveryForm(id, type) {
			this.$wsf.go('deliveryForm', { id: id, type: type });
		},
		// 弹窗确认
		activeConfirm() {
			this.$u.api.cancelReturn({ id: this.pageData.id }).then(res => {
				this.$u.toast('取消申请成功');
				this.showConfirm = false;
				this.loadServiceOrderDetail();
			});
		},
		//申请售后操作
		toAfterSalesService(orderId, orderSkuId, type) {
			this.$wsf.go('choseAfterSalesService', { orderId,orderSkuId,type });
		},
		// 弹窗取消
		activeCancel() {}
	}
};
</script>

<style scoped lang="scss">
.page-content{
    position: relative;
    padding-bottom: calc(96rpx + constant(safe-area-inset-bottom));
    padding-bottom: calc(96rpx + env(safe-area-inset-bottom));
}
.header-box{
    position: fixed;
    top: 0;
    left: 0;
}
.img_item {
	width: 32rpx;
	height: 32rpx;
}
.text-grey {
	font-size: 26rpx !important;
	font-weight: 400 !important;
	color: #666 !important;
}
.color-white {
	background-color: #fff !important;
}
.text-bold {
	font-weight: bold;
	color: #000;
}
.service-store {
	font-size: 22rpx;
	padding: 16rpx 0;
	text-align: center;
	color: #666;
	span {
		color: $wsf-color-red;
	}
}
// 服务单状态信息
.service-status-detail {
	margin-top: -32rpx;
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
    .float-count{
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
    .progress {
        max-width: 654rpx;
		font-weight: 500;
		font-size: 26rpx;
		line-height: 34rpx;
	}
    .more-icon{
        width: 32rpx;
        height: 32rpx;
        margin-left: 12rpx;
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
// 地址模块
.address-card{
    padding: 32rpx 24rpx;
    background: #FFFFFF;
    border-radius: 24rpx;
    margin: 0rpx 24rpx 20rpx 24rpx;
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
    }
    .price-red{
        color: #FF0A35;
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
.bottom-delete-column {
	width: 100%;
	height: 100rpx;
}
</style>

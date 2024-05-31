<template>
	<view  class="page-content" v-if='hasData' >
        <service-order-header  :title="serverStatusDict" :bgColor="headerBgColor"></service-order-header>

        <!-- 审核流程 -->
        <status-process :statusList="statusList" :pageData="pageData" ></status-process>
        <!-- 服务单信息 -->
			<view class="service-status-detail" v-if="pageData.backOrderLogs && pageData.backOrderLogs.length > 0" @click="goToProgressDate()">
                <view class="service-status-title flex-space-between">
									<span class="progress">{{ serviceOrderInfoText }}</span>
							<u-count-down
								v-if="isShowTime"
								class="time-count"
								separator="zh"
								separator-size="26"
								separator-color="#E60113"
								color="#E60113"
								font-size="26"
								:timestamp="timestamp"
								@end="countDownFinshed()"
							></u-count-down>
							<span v-if="isShowTime">{{serviceOrderInfoTailMap[Number(pageData.status)] }}</span>
                        <view class="describe" v-if="describeText">{{ describeText }}</view>
                </view>
                <image class="more-icon" src="https://wsjc-web.wsecar.com/wsf-mall/skuDetail/icon-right.png"></image>
			</view>
					
        <!-- 寄收地址快递信息模块 -->
		<view class="address-card" >
            <!-- 寄物流 -->
            <logistics-info v-if="pageData.waybillCode" componentType="1" :dataObj="pageData" :orderId="pageData.id"></logistics-info>
            <!-- 收物流 -->
            <logistics-info marginBottom="32rpx" v-if="pageData.swapOrder.waybillCode" componentType="2" :dataObj="pageData.swapOrder" :orderId="pageData.id"></logistics-info>
            <address-block :class="isShowBackInfo?'padding-bottom-40':''" :dataObj="pageData.addressVo" componentType="2"></address-block>
            <address-block v-if="isShowBackInfo" :dataObj="pageData" componentType="1"></address-block>
		</view>

	    <!-----------商品信息------------------>
        <service-order-sku-card :pageData="pageData" :skuData="pageData.returnSku"></service-order-sku-card>
        
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
				<view class="card-label">换新商品</view>
				<view class="card-value u-font-22">{{ pageData.newSkuName }}</view>
			</view>
            <view class="card-column">
				<view class="card-label">退款方式</view>
				<view class="u-font-22">原返</view>
			</view>
		</view>
		<view class="service-info-card">
			<view class="card-column">
				<view class="card-label">商品退回</view>
				<view class="u-font-22">{{ pageData.backType == 1 ? '快递至供应商' : '' }}</view>
			</view>
			<view class="card-column">
				<view class="card-label">退货联系人</view>
				<view class="u-font-22">{{ pageData.contactName }}</view>
			</view>
			<view class="card-column">
				<view class="card-label">联系电话</view>
				<view class=" u-font-26">{{ phoneNumberHide(pageData.contactMobile) }}</view>
			</view>
		</view>
		<view
			class="bottom-column"
			v-if="pageData && ['10','12','18','19'].indexOf(pageData.status) == -1"
		>
			<view
				v-if="pageData && (pageData.status == 4 || pageData.status == 6 || pageData.status == 7 || pageData.status == 13 || pageData.status == 15)"
				class="white-btn"
				@click.stop="openConfirm(1)"
			>
				取消申请
			</view>
			<view
				v-if="pageData && (pageData.status == 4 || pageData.status == 13)"
				class="red-btn"
				@click.stop="toAfterSalesService(pageData.id, pageData.returnSku.skuId, 2)"
			>
				修改申请
			</view>
			<view
				v-if="pageData.status == 6 || pageData.status == 15"
				class="red-btn"
				@click.stop="goToDeliveryForm(pageData.id, 1)"
			>
				填写发货单
			</view>
			<view
				v-if="(pageData.status == 7 || pageData.status == 16)&&pageData.backOrderType!=4"
				class="red-btn"
				@click.stop="goToDeliveryForm(pageData.id, 2)"
			>
				更改发货单
			</view>
			<view
				v-if="pageData && ['3','5','8','9','12','11','14','17','22'].includes(pageData.status)"
				class="white-btn"
				@click.stop="deleteForm()"
			>
				删除服务单
			</view>
			<view
				v-if="pageData.status == 20 || pageData.status == 21"
				class="white-btn"
				@click.stop="toTrackingCells()"
			>
				查看物流
			</view>
			<view
				v-if="pageData.status == 20 || pageData.status == 21"
				class="red-btn"
				@click.stop="openConfirm(2)"
			>
				确认收货
			</view>
		</view>

		<wsf-confirm v-model="showConfirm" :title="confirmTitle" :context="confirmContext" :activeText="confirmButton" contextAlign="center" :cancelText="cancelButton" @confirm="activeConfirm" @cancel="activeCancel"></wsf-confirm>
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
			confirmType: 0,
            pageTitle:'',//页面标题
            headerBgColor:'',//标题背景色
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
            applyResending:false,//重新邮寄弹窗
			confirmContext: '',
            confirmTitle:'',
			pageData: {
        status: '',
        storeName: '',
        reason: ''
      },
			orderId: '',
			orderSkuId: '',
			completeImg: completeImg,
			serverStatusDictMap: {
				13: '待审核',
				11: '服务单取消',
				14: '服务单已关闭',
				17: '服务单关闭',
				15: '请您发货',
				16: '待供应商收货',
				18: '待供应商发货',
				19: '退款成功',
				20: '等待收货',
				21: '待商家寄件',
				22: '换货完成'
			},
			statusList: [
				{
					name: '提交审核',
					status: [13]
				},
				{
					name: '供应商审核',
					status: [15]
				},
				{
					name: '供应商收货',
					status: [16]
				},
				{
					name: '供应商发货',
					status: [18,20,21]
				},
				{
					name: '完成',
					status: [19,22]
				}
			],
            // 服务单信息
            serviceOrderInfoMap:{
                13:'您的服务单申请成功，待商家审核中，还剩',
                15:'您的服务单商家已审核完成，请您尽快发货，如未及时发货将在',
                16:'您的换货商品已寄出，',
                17:'服务单已关闭，如有需要可在售后申请页重新提交服务单',
                18:'您的换货商品已确认收货，等待商家寄出换货商品，如商家未在',
                11:'服务单已取消，如有需要可在售后申请页重新提交服务单',
                20:'您的换货商品商家已寄出，请在',
                22:'服务单已完成，感谢您对万顺的支持',
                21:'您的反馈已经提交给商家，商家将核实物流信息后，重新发货',
                14:'服务已关闭，如有需要可在售后申请页重新提交服务单',
                19:'服务单已完成，商家未及时寄件，系统为您退款',

            },
            // 服务单信息时间后面的文案
            serviceOrderInfoTailMap:{
                15:'后关闭',
				16: '天内确认收货，请您耐心等待',
                18:'后重新换货邮寄，系统将自动退款',
                20:'后收货，系统将自动确认收货'
            },
            // 备注文案
            describeMap:{
                15:'商家审核通过，请您及时寄出换货商品',
                18:'商家已收货，等待商家发货',
                11:'服务单已取消，如有需要可在售后申请页重新提交服务单',
                20:'换货商品已发出，等待收货',
                22:'换货商品已签收',
                21:'未收到货，申请重新发货',
                17:'您未在规定的时间内寄出商品，服务单已关闭，如有需要可在售后申请页重新提交服务单',
            },

      hasData: false
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
	computed: {
		// 商品寄回信息显示控制
		isShowBackInfo() {
			return (
				this.pageData.status == 15 ||
				this.pageData.status == 16 ||
				this.pageData.status == 18 ||
				this.pageData.status == 19 ||
				this.pageData.status == 20 ||
				this.pageData.status == 21 ||
				this.pageData.status == 22 ||
				this.pageData.waybillCode
			);
		},
        // 状态计算
        serverStatusDict(){
            if(!this.pageData) return

            if(this.pageData.status*1 === 20 && this.pageData.backOrderLogs[0].status*1 === 24){
                return '商家重新寄出'
            }
            return this.serverStatusDictMap[this.pageData.status*1]
        },
        // 服务单信息计算
        serviceOrderInfoText(){
            if(!this.pageData) return
            let status = Number(this.pageData.status)
            if(status === 18 && this.pageData.receiveStatus*1 === 0){
				return '您的换货商品商家未收到，请核实物流信息，商家仍旧会寄出换货商品，请耐心等待商家发货'
            }
			if(status === 16 &&this.pageData.backOrderType == 4) {
				return '您的换货商品已寄出，请您耐心等待商家确认收货'
			}
			if(status === 13 &&this.pageData.backOrderType == 4){
				return '您的服务单已修改成功，待商家审核中'
			}
            if(status === 13 && this.pageData.backOrderLogs[0].status*1 === 12){
				return '您的服务单已修改成功，待商家审核中，还剩'
            }
			
            return this.serviceOrderInfoMap[this.pageData.status*1]
        },
        // 备注文案计算
        describeText(){
            if(!this.pageData) return
            let text = ''
            let status = Number(this.pageData.status)
            switch (status) {
                case 13: text = `申请原因：${this.pageData.reason}`; break;
                case 14: text = `关闭原因：${this.pageData.backOrderLogs[0].rawMessage},如有需要可在售后申请页重新提交服务单`; break;
                case 15:
                    // 取商家审核通过时填写的原因 未填写 则显示默认文案
                    text = this.pageData.backOrderLogs[0].rawMessage ? `审核原因：${this.pageData.backOrderLogs[0].rawMessage}` : this.describeMap[status]; break;
                case 16: text = this.pageData.acceptStation; break;//取最新物流信息
                case 17: 
                    // 用户未在7天内寄出商品 取默认文案 否则取 商家填写的审核驳原因
                    text = this.pageData.backOrderLogs[0].status*1 === 13 ? this.describeMap[status] : `关闭原因：${this.pageData.backOrderLogs[0].rawMessage},如有需要可在售后申请页重新提交服务单`; break;
                case 18: text = this.pageData.receiveStatus*1 === 0 ? '商家未收到货，请及时与商家沟通': this.describeMap[status]; break;
                case 19: text = `您的服务单${this.pageData.backCode}财务已退款，请您注意查收`; break;
                default:
                    // [11,20,21,22]取默认文案
                    text = this.describeMap[status]; 
                    break;
            }
            return text
        },
        isShowTime(){
            if(!this.pageData) return
            let status = Number(this.pageData.status)
            
            if(status === 18 && this.pageData.receiveStatus*1 === 0){
                return false
            }

			if(status === 16 && this.pageData.backOrderType!=4) {
				return true
			}
            
            return ([13,18].includes(this.pageData.status*1)&&this.pageData.backOrderType!=4)||this.pageData.status==15 || this.pageData.status== 20
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
		goToSku(id) {
			if(this.pageData.orderType == 9) {
				this.$wsf.go('SkuDetail', { skuId: id, storeIdNumber: this.pageData.buyStoreId, sourceType: 2 });
			} else {
				this.$wsf.go('SkuDetail', { skuId: id });
			}
		},
		//倒计时结束
		countDownFinshed() {
			// if (this.pageData.status == 13) {
			// 	this.$u.api.dealApplyOverDue({ id: this.orderId }).then(res => {
			// 		this.loadServiceOrderDetail();
			// 	});
			// } else
			if (this.pageData.status == 15) {
				this.$u.api.dealFillLogisticsOverDue({ id: this.orderId }).then(res => {
					this.loadServiceOrderDetail();
				});
			} else if (this.pageData.status == 20) {
				let data = {
					id: this.pageData.id,
					isReceipt: 1
				};
				this.$u.api.auditReceipt(data).then(res => {
					if (res.code == 200) {
						this.loadServiceOrderDetail();
					}
				});
			}
		},
		//查询详情
		loadServiceOrderDetail() {
			this.$u.api.backorderdetail({ id: this.orderId }).then(res => {
				this.pageData = res.data;
				let options = {},
					storeServiceConfig = this.pageData.storeServiceConfig,
					tagsurl = '';
				Object.keys(storeServiceConfig).forEach(key => {
					if (storeServiceConfig[key]) {
						if (key == 'staffId') {
							options.staffid = storeServiceConfig[key];
						} else {
							options[key] = storeServiceConfig[key];
						}
					}
				});
				if (options.staffid) {
					tagsurl = `https://merchant.wsfmall.com/ordermanagement/mallorder/returnreview?id=${this.pageData.id}`;
				} else {
					//         https://platform-test.wsfmall.com/ordermagamemt/storeorder/storerefundreview?id=1230
					tagsurl = `https://platform.wsfmall.com/ordermagamemt/storeorder/storereturnreview?id=${this.pageData.id}`;
				}
				let obj = '';
				let ysfData = {
					id: this.pageData.id,
					title: `售后单号: ${this.pageData.backCode}`,
					desc: this.pageData.returnSku.skuName,
					picture: this.pageData.returnSku.skuImage,
					tagsurl,
					note: `￥${this.pageData.returnSku.price}`,
					navigateToUrl: `/orderModule/pages/serviceOrderDetail/serviceOrderDetail?orderId=${this.pageData.id}`,
					...options
				};
				obj = JSON.stringify(ysfData);
				uni.setStorageSync('YSFDATA', obj);

				let endTime = this.pageData.endTime?this.pageData.endTime.replace(/\-/g, '/'):'';
				endTime = new Date(endTime).getTime();
				let nowTime = this.pageData.nowTime?this.pageData.nowTime.replace(/\-/g, '/'):'';
				nowTime = new Date(nowTime).getTime();
				if (endTime - nowTime > 0) {
					// this.timestamp = (endTime - nowTime) / 1000
					if (this.pageData.status == 16 || this.pageData.status == 21) {
						//转化成天, 并且向上取整, 再赋值
						let countDownTime = endTime - nowTime;
						let countDownDay = Math.ceil(countDownTime / (1000 * 60 * 60 * 24));
						this.timestamp = countDownDay;
					} else {
						this.timestamp = (endTime - nowTime) / 1000;
					}
				}

        this.hasData = true
			}).catch(err => {
        console.log('查询订单详情失败', err);
      })
		},
		//去进度详情
		goToProgressDate() {
			let id = this.pageData.id;
			this.$wsf.go('progressDate', { id: id, type: this.pageData.type });
		},
		//打开弹窗
		openConfirm(type) {
			if (type == 1) {
                this.confirmTitle = ''
				this.confirmContext = '确认取消售后申请？';
				this.confirmButton = '确认取消';
				this.cancelButton = '取消';
			} else if (type == 2) {
                this.confirmTitle = ''
				this.confirmContext = '您是否收到该订单商品？';
				this.confirmButton = '已收货';
				this.cancelButton = '未收货';
			}
            if(type === 3){
                this.confirmTitle = '确认申请重新邮寄';
                this.confirmContext = '根据物流显示商品已签收，请仔细核实商品状态，否则商家可能会拒绝重新邮寄';

				this.confirmButton = '提交';
				this.cancelButton = '再想想';
            }
			this.confirmType = type
			this.showConfirm = true;
		},
		//去发货单页面
		goToDeliveryForm(id, type) {
			this.$wsf.go('deliveryForm', { id: id, type: type });
		},
		// 弹窗确认
		activeConfirm() {
			if (this.confirmType == 1) {
				this.$u.api.cancelReturn({ id: this.pageData.id }).then(res => {
					this.$u.toast('取消申请成功');
					this.showConfirm = false;
					this.loadServiceOrderDetail();
				});
			} else if (this.confirmType == 2) {
				let data = {
					id: this.pageData.id,
					isReceipt: 1
				};
				this.$u.api.auditReceipt(data).then(res => {
					this.showConfirm = false;
					if (res.code == 200) {
						this.$u.toast('确认收货成功');
						this.loadServiceOrderDetail();
					} else {
						this.$u.toast(res.description);
					}
				});
			}
            // 确认申请邮寄
            if (this.confirmType == 3) {
                this.showConfirm = false
                this.applyMailing()
			}
		},
		//申请售后操作
		toAfterSalesService(orderId, orderSkuId, type) {
			this.$wsf.go('choseAfterSalesService', { orderId,orderSkuId,type });
		},
		// 弹窗取消
		activeCancel() {
			if(this.pageData.backOrderType == 4){
        this.showConfirm = false
				return
			}
            this.showConfirm = false
			if (this.confirmType == 2) {
                this.$u.api.checkOrderTraces({backOrderId:this.pageData.id}).then(res => {
					if (res.code == 200) {
                        // 物流未签收-可以申请重新邮寄
                        this.applyMailing()
					} 
				}).catch(error=>{
                    console.log(error)
                    // 接口异常表示物流已签收
                    this.openConfirm(3)
                })
			}
		},
        // 申请重新邮寄
        applyMailing(){
            let data = {
				id: this.pageData.id,
				isReceipt: 0
			};
			this.$u.api.auditReceipt(data).then(res => {
				this.dialogshow = false; // 关闭弹窗
				if (res.code == 200) {
					this.$u.toast('操作成功');
					this.loadServiceOrderDetail();
				} else {
					this.$u.toast(res.description);
				}
			});
        },
		// 去物流详情
		toTrackingCells() {
			this.$wsf.go('trackingCells', {
				id: this.pageData.id,
				type: 1
			});
		}
	}
};
</script>

<style scoped lang="scss">
.page-content{
    position: relative;
    padding-bottom: calc(96rpx + constant(safe-area-inset-bottom));
    padding-bottom: calc(96rpx + env(safe-area-inset-bottom));
}
.text-grey {
	font-size: 26rpx !important;
	font-weight: 400 !important;
	color: #666 !important;
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
// 地址模块
.address-card{
    padding: 32rpx 24rpx;
    background: #FFFFFF;
    border-radius: 24rpx;
    margin: 0rpx 24rpx 20rpx 24rpx;
    .padding-bottom-40{
        /deep/.address-content{
            padding-bottom: 40rpx;
        }
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
/deep/.wsf-confirm-modal{
    padding: 64rpx 24rpx 40rpx 24rpx !important;
}
/deep/.wsf-confirm-modal-btn{
    justify-content: center;
    padding:0rpx;
    .cancel{
        margin-right: 24rpx;
    }
}
</style>

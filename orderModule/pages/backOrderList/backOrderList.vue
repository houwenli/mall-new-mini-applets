<template>
	<view class="page-content">
		<view class="applet-backorder-tabs">
            <view class="search-box">
                <u-search class="search-input" placeholder="商品名称/订单编号/服务单号" v-model="queryForm.name" @blur="inputBlur" @focus="inputFocus" :show-action="false"></u-search>
                <!-- <view>取消</view> -->
                <view class="search-right">
                    <view class="screen-box" v-if="showSearchBtn" @click="openScreen()">
                        <view>筛选</view>
                        <image class="screen-icon" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/order/shouhou_liebiao_shaixuan.png"></image>
                    </view>
                    <view v-else>取消</view>
                </view>
            </view>
			<u-tabs
				:list="statusList"
				active-color="#191919"
				font-size="26"
				height="76"
				bar-width="54"
				bar-height="8"
				:bar-style="barStyle"
				:is-scroll="false"
				:current="tabsIndex"
				@change="changeTabsStatus"
			></u-tabs>
		</view>
		<view class="after-sales-orders-list">
				<view class="orders-card-item" v-for="(item, idx) in orderList" :key='idx'>
                    <!-- 处理中、申请记录才有服务单号和售后状态 -->
					<view v-if="tabsIndex != 0" class="flex-space-between">
						<view  class="service-order-number" @click="toStoreIndex(item.storeId, item.storeName)">
							服务单号：{{ item.backCode }}
                        </view>
						<view class="orders-item-header-type">
							{{ item.type == 1 ? '退款' : item.type == 2 ? '退货' : item.type == 3 ? '换货' : '' }}
						</view>
					</view>

                    <!-- sku商品列表 -->
					<view class="orders-sku-list" :class="{ 'card-body-margin': tabsIndex != 0 }">
						<view class="orders-sku-item" v-for="(n, i) in getSkuList(item.skuList,item.isExpand)" :key="i" >
                            <!-- 商品信息 -->
							<view class="sku-content" @click.stop="goToSku(item, n)">
								<image :src="n.skuImage" class="sku-image" mode="aspectFill"></image>
								<view class="sku-info">
                                    <view class="sku-info-left">
                                        <view class="sku-name">{{ n.skuName }}</view>
									    <view class="ske-support" v-if="n.skuSupport">
										{{ n.skuSupport }}
									    </view>
                                    </view>
                                    <view class="sku-num">x{{  n.num }}</view>
								</view>
                                
							</view>
							<!-- 申请售后按钮-只有售后申请列表才有 -->
							<view class="flex-space-between" v-if="tabsIndex == 0">
								<view class="flex-align-items-center" v-if="item.overDueStatus == 1 || item.status == 4">
									<block v-if="item.overDueStatus == 1">
										<image class="footer-status-icon" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/order/shouhou_liebiao_shangpin_tishi.png"></image>
										<span class="tip-text">该商品已超过售后期</span>
									</block>
									<block v-if="item.status == 4">
										<span class="flex-align-items-center" v-if="n.num == n.afterSaleNum && n.afterSaleStatus == 1 && item.overDueStatus == 0" @click="goRecord(n.orderSkuId)">
											<span class="tip-text">该商品已申请售后</span>
											<image class="status-icon-right" src="https://wsjc-web.wsecar.com/wsf-mall/skuDetail/icon-right.png"></image>
										</span>
										<span class="flex-align-items-center" v-if="n.num > n.afterSaleNum && n.afterSaleStatus == 1 && item.overDueStatus == 0" @click="goRecord(n.orderSkuId)">
											<span class="tip-text">有{{ n.afterSaleNum }}个商品已申请售后</span>
											<image class="status-icon-right" src="https://wsjc-web.wsecar.com/wsf-mall/skuDetail/icon-right.png"></image>
										</span>
									</block>
								</view>
								<view
									v-if="item.status == 4 && item.overDueStatus == 0 && n.afterSaleNum != n.num"
									@click.stop="toAfterSalesService(item, 1, n)"
									class="btn border-black"
								>
									申请售后
								</view>
								<view
									v-if="item.status == 4 && item.overDueStatus == 1"
									@click.stop="openConfirm(2, item)"
									class="btn bg-black"
								>
									申请售后
								</view>
							</view>
						</view>
					</view>

					<!-- 退换状态 -->
					<view
						class="after-sales-status-box flex-space-between flex-align-items-start"
						v-if="tabsIndex != 0 && item.logList && item.logList.length > 0"
						@click="goToSeviceOrderDetail(item)"
					>
						<view class="after-sales-status-title">{{ backOrderStatusText(Number(item.status),Number(item.logList[0].status)) }}</view>
                        <view class="flex-align-items-start">
                            <view class="after-sales-status-info">{{ backOrderText(Number(item.status),Number(item.logList[0].status)) }}</view>
						    <image class="status-icon-right" src="https://wsjc-web.wsecar.com/wsf-mall/skuDetail/icon-right.png"></image>
                        </view>
					</view>

					<!-- 按钮区 -->
					<view class="flex-space-between"  v-if="tabsIndex == 0 && item.status == 3">
						<view class="flex-align-items-center">
                            <image class="footer-status-icon" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/order/shouhou_liebiao_shangpin_tishi.png"></image>
                            <span class="tip-text">该订单需确认收到商品后才可申请售后</span>
                        </view>
						<view
							@click.stop="openConfirm(1, item)"
							class="btn bg-red"
						>
							确认收货
						</view>
					</view>
					<view class="applet-backorder-list-item-footer u-flex u-row-right" v-if="tabsIndex != 0">
						<view
                            class="btn border-black"
							v-if="item.status == 4 || item.status == 6 || item.status == 7 || item.status == 13 || item.status == 15"
							@click.stop="openConfirm(3, item)"
						>
							取消申请
						</view>
						<view
							v-if="item.status == 4 || item.status == 13"
							class="btn border-black"
							@click.stop="toAfterSalesService(item, 2)"
						>
							修改申请
						</view>
						<view
							v-if="item.status == 6 || item.status == 15"
							class="btn border-red"
							@click.stop="goToDeliveryForm(item.id, 1)"
						>
							填写发货单
						</view>
						<view
							v-if="(item.status == 7 || item.status == 16)&&item.backOrderType != 4"
							class="btn border-black"
							@click.stop="goToDeliveryForm(item.id, 2)"
						>
							更改发货单
						</view>
						<view
                        v-if="item.status == 20 || item.status == 21"
                        class="btn border-black"
						@click.stop="openConfirm(4, item)"
						>
							查看物流
						</view>
						<view
							v-if="item.status == 20 || item.status == 21"
							@click.stop="openConfirm(5, item)"
							class="btn bg-red"
						>
							确认收货
						</view>
					</view>
                    <view class="good-list-expand-more" v-if="!item.isExpand && item.skuList.length > 3">
                        <view class="expand-more-btn" @click="expandSkuList(item)">
                            显示更多{{item.skuList.length - 3}}个商品
                            <image class="expand-more-btn-icon" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/order/shouhou_liebiao_gengduo_xiangxia_jiantou.png"></image>
                        </view>
                    </view>
				</view>
		</view>
		<u-loadmore margin-top="26" v-if="orderList && orderList.length > 0" ref="backTop" :loadText="loadText" bg-color="#f3f3f3" color="#999" :status="loadStatus"></u-loadmore>
		<view v-else class="applet-empty u-flex flex-column">
			<image src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/main-packages/isEmpty-icon/cart.png" style="width:180rpx;height: 180rpx;" mode=""></image>
			<view class="applet-empty-tips">没有退款/售后的商品哦〜</view>
		</view>
		<wsf-confirm
			v-model="showConfirm"
			:title="confirmTitle"
            :context="confirmContext"
			:activeText="confirmButton"
			:cancelText="cancelButton"
			@confirm="activeConfirm"
			@cancel="activeCancel"
            contextAlign="center"
		></wsf-confirm>

		<!-- 回到顶部 -->
		<u-back-top :scroll-top="scrollTop" top="5000" :icon-style="iconStyle" :bottom="140">
			<image src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/distribution/back_top.png" style="width: 80rpx; height: 80rpx"></image>
		</u-back-top>
        <!-- 筛选弹窗 -->
        <date-screen-popup :show.sync="showDatePopup" @confirmDate="confirmDate"></date-screen-popup>
	</view>
</template>

<script>
import { backOrderStatusList } from '@/common/wsfRules.js';
import dateScreenPopup from '../../components/dateScreenPopup/dateScreenPopup.vue'
export default {
    components: {
		dateScreenPopup
	},
	data() {
		return {
            showSearchBtn:true,//是否显示筛选按钮
            showDatePopup:false,//是否显示筛选的日期弹窗
            prohibitAfterSales:{
                
            },
			lastPageUpdate: 0,
			confirmButton: '',
			cancelButton: '',
			confirmTitle: '',
			loadText: {
				loadmore: '上拉加载更多',
				loading: '努力加载中',
				nomore: '我也是有底线的~'
			},
			loadStatus: 'loadmore', // 加载更多样式效果
			isLoading: false, // 是否正在加载
			hasMore: true, // 是否拥有更多
			queryForm: {
                name:'',
                timeType:0,
				queryType: '',
				orderSkuId: '',
				pageNum: 0,
				pageSize: 10
			},
			showConfirm: false,
			confirmContext: '',
			showConfirmType: -1, //1 确认收货
			statusList: backOrderStatusList,
			tabsIndex: 0,
			orderList: [],
			selectOrderId: '',
			// isShowStore: 0,
			scrollTop:0,
			backOrderStatusMap: {
			  1: '待审核',
			  2: '已完成',
			  3: '服务单关闭',
			  4: '待审核',
			  5: '服务单关闭',
			  6: '请您发货',
			  7: '待供应商收货',
			  8: '完成',
			  9: '服务单关闭',
			  10: '完成',
			  11: '服务单取消',
			  12: '完成',
			  13: '待审核',
			  14: '服务单关闭',
			  15: '请您发货',
			  16: '待供应商收货',
			  17: '服务单关闭',
			  18: '待供应商换货',
			  19: '退款成功',
			  20: '待您确认收货',
              21:'待供应商换货',
			  22: '完成',
			},
            backOrderTextMap:{
                4:'您的服务单已申请成功，待商家审核中',
                5:'商家不同意服务单申请，服务单已关闭',
                6:'请您尽快发货并填写运单号',
                7:'您的退货商品已寄出，请耐心等待商家确认收货',
                8:'服务单已完成，感谢您对万顺的支持',
                9:'商家不同意服务单申请，服务单已关闭',
                11:'服务已取消，如有需要可在售后申请页重新提交服务单',
                12:'服务单已完成，感谢您对万顺的支持',
                13:'您的服务单已申请成功，待商家审核中',
                15:'请您尽快发货并填写运单号',
                16:'您的换货商品已寄出，请耐心等待商家确认收货',
                18:'您的换货商品商家已收到，请耐心等待商家邮寄新换货商品',
                20:'新换货商品商家已发出，请注意查收',
                22:'服务单已完成，感谢您对万顺的支持',
                21:'您的反馈已经提交给商家，商家将核实物流信息后，重新发货',
                14:'商家不同意服务单申请，服务单已关闭',
                17:'商家不同意服务单申请，服务单已关闭',
                19:'商家未及时寄件，系统为您退款',
            },
            barStyle:{ 
                bottom: '8rpx', 
                background:'linear-gradient(90deg, #FF5F2E 0%, #FF0A35 100%)',
            },
			backOrderType:null,
		};
	},
    computed:{
        // 列表页状态
        backOrderStatusText(){
            return function(status,logListStatus){
                if(status === 30 && logListStatus === 24){
                    return '商家重新寄出'
                }

                return this.backOrderStatusMap[status]
            }
        },
        // 列表页文案
        backOrderText(){
            return function (status,logListStatus){
                if([9,17].includes(status) && Number(logListStatus) === 13){
                    return '您未在规定的时间内寄出，服务单已关闭'
                }
                if(status === 9 && Number(logListStatus) === 40){
                    return '商家无需您退货，且不同意退款，服务单已关闭'
                }
                if(status === 4 && Number(logListStatus) === 12){
                    return '您的服务单修改成功，待商家审核中'
                }
                if(status === 13 && Number(logListStatus) === 12){
                    return '您的服务单修改成功，待商家审核中'
                }
                if(status === 18 && Number(logListStatus) === 34){
                    return '请耐心等待商家邮寄新换货商品'
                }

                return this.backOrderTextMap[status]
            }
        },
    },
	onPageScroll(e) {
		this.scrollTop = e.scrollTop
	},
	onShow() {
		// this.isShowStore = getApp().globalData.wsfBaseInfo.isShowStore // 判断商城信息
        this.resetForm()
		this.loadBackOrderList();
	},
	onLoad(option) {
		this.resetForm();
		if (option && option.type) {
			this.tabsIndex = option.type;
		}
		if (option && option.orderSkuId) {
			this.queryForm.orderSkuId = option.orderSkuId;
		}
		this.loadBackOrderList();
	},
	onReachBottom() {
		this.loadBackOrderList();
	},
	watch:{
		lastPageUpdate(e,o) {
			this.clearAndSearch(2)
		}
	},
	methods: {

		//解决售后单
		doneServiceForm(item) {
			this.$u.api.userConfirmationCompleted({ id: item.id }).then(res => {
				this.$u.toast('操作成功');
				this.clearAndSearch(2);
			});
		},
		//去店铺
		toStoreIndex(storeId, storeName) {
			this.navigateTo('StoreIndex', { storeId: storeId, storeName: storeName });
		},
		// 前往商品详情
		goToSku(item, n) {
            if(item.orderType == 14){
                uni.setStorageSync("enterpriseAgencyId", item.enterpriseId);
                this.$wsf.go("collectionDetail", { skuId: n.skuId });
                return
            }
			if(item.orderType == 9) {
				this.$wsf.go('SkuDetail', { skuId: n.skuId, storeIdNumber: item.buyStoreId, sourceType: 2 });
			} else {
				this.$wsf.go('SkuDetail', { skuId: n.skuId});
			}
		},
		//切换到申请记录
		goRecord(orderSkuId) {
			this.orderList = [];
			this.hasMore = true;
			this.queryForm.pageNum = 0;
			this.queryForm.orderSkuId = orderSkuId;
			this.tabsIndex = 2;
			this.loadBackOrderList();
		},
		//打开弹窗
		async openConfirm(type, item) {
			console.log(item, 'item');
			this.backOrderType = item.backOrderType
			this.confirmTitle = ''
			if (type == 1) {
				await this.$u.api.JudgeRefund({orderId: item.orderId}).then(res => {
					if(res.data == 1) {
						this.confirmContext = '您是否收到该订单商品？';
						this.confirmButton = '已收货';
						this.cancelButton = '未收货';
					} else {
						this.confirmContext = '订单中存在退款申请中商品，确认收货则默认撤销申请。';
						this.confirmButton = '确认';
						this.cancelButton = '取消';
					}
				})
				this.selectOrderId = item.orderId;

			} else if (type == 2) {
				this.selectOrderId = item.orderId;
				this.confirmContext = '抱歉，您已错过售后申请时效';
				this.confirmButton = '联系客服';
				this.cancelButton = '取消';
			} else if (type == 3) {
				this.selectOrderId = item.id;
				this.confirmContext = '确认取消售后申请？';
				this.confirmButton = '确认取消';
				this.cancelButton = '取消';
			} else if (type == 4) {
				this.$wsf.go("trackingCells", {
				  id: item.id,
					type: 1
				});
				return
			} else if (type == 5) {
				this.selectOrderId = item.id;
				this.confirmContext = '您是否收到该订单商品？';
				this.confirmButton = '已收货';
				this.cancelButton = '未收货';
			} else if (type == 6) {
				this.confirmTitle = '确认申请重新邮寄';
				this.confirmContext = '根据物流显示商品已签收，请仔细核实商品状态，否则商家可能会拒绝重新邮寄';
				this.confirmButton = '提交';
				this.cancelButton = '再想想';
			}
			this.showConfirmType = type;
			this.showConfirm = true;
		},
		//去发货单页面
		goToDeliveryForm(id, type) {
			this.$wsf.go('deliveryForm', { id, type });
		},
		//申请售后操作
		toAfterSalesService(item, type, n) {
			if (type == 1) {
				this.$wsf.go('choseAfterSalesService', { orderId: item.orderId, orderSkuId: n.orderSkuId, type: type });
			} else if (type == 2) {
				this.$wsf.go('choseAfterSalesService', { orderId: item.id, orderSkuId: null, type: type });
			}
		},
		// 弹窗确认
		activeConfirm() {
			if (this.showConfirmType == 1) {
				this.$u.api.ConfirmReceipt({ orderId: this.selectOrderId }).then(res => {
					this.resetForm();
					this.loadBackOrderList();
					this.$u.toast('确认收货成功');
					this.showConfirm = false;
				});
			} else if (this.showConfirmType == 2) {
				uni.removeStorageSync('YSFDATA');
				this.serviceTel();
				// let phoneNumber = '0755-23061865';
				// uni.makePhoneCall({
				// 	phoneNumber: phoneNumber
				// });
			} else if (this.showConfirmType == 3) {
				this.$u.api.cancelReturn({ id: this.selectOrderId }).then(res => {
					this.$u.toast('取消申请成功');
					this.resetForm();
					this.loadBackOrderList();
				});
			} else if (this.showConfirmType == 5) {
				let data = {
				  id: this.selectOrderId,
				  isReceipt: 1
				}
				this.$u.api.auditReceipt(data).then((res) => {
				  this.dialogshow = false // 关闭弹窗
				  if (res.code == 200) {
				    this.$u.toast('确认收货成功')
				    this.resetForm();
				    this.loadBackOrderList();
				  } else {
				    this.$u.toast(res.description)
				  }
				})
			} else if (this.showConfirmType == 6) {
				this.applyMailing()
			}
			this.showConfirm = false;
		},

		// 弹窗取消
		activeCancel() {
			if(this.backOrderType == 4){
        //第三方供应商，直接关闭弹窗即可
        this.showConfirm = false
        return
      }
			if (this.showConfirmType == 5) {

				this.$u.api.checkOrderTraces({backOrderId:this.selectOrderId}).then(res => {
					if (res.code == 200) {
                        // 物流未签收-可以申请重新邮寄
                        this.applyMailing()
					} 
				}).catch(error=>{
                    console.log(error)
                    // 接口异常表示物流已签收
                    this.openConfirm(6)
                })		
			}
		},

		// 申请重新邮寄
        applyMailing(){
			let data = {
			  id: this.selectOrderId,
			  isReceipt: 0
			}
			this.$u.api.auditReceipt(data).then((res) => {
			  this.dialogshow = false // 关闭弹窗
			  if (res.code == 200) {
			    this.$u.toast('操作成功')
			    this.resetForm();
			    this.loadBackOrderList();
			  } else {
			    this.$u.toast(res.description)
			  }
			})
        },

		// 切换状态
		changeTabsStatus(e) {
			console.log(e, 'e');
			if (this.tabsIndex != e) {
				this.clearAndSearch(e)
			}
		},
		//重置搜索条件并查询
		clearAndSearch(e) {
			if (e != 0) {
				this.queryForm.queryType = e == 1 ? 1 : e == 2 ? 0 : '';
			}
			this.isLoading = false;
			this.orderList = [];
			this.hasMore = true;
			this.loadStatus = 'loadmore';
			this.queryForm.pageNum = 0;
			this.queryForm.orderSkuId = '';
			this.tabsIndex = e;
			this.loadBackOrderList();
		},
		// 跳转订单详情
		toOrderDetail(data) {
			console.log('xinxi', data);
			/* ToDo 跳转订单详情 */
			this.$wsf.go('PendingPayment', { orderId: data.orderId });
		},
		// 跳转服务单单详情
		goToSeviceOrderDetail(item) {
			let name
			if(item.type == 2) {
				name = 'ServiceOrderDetail'
			} else if(item.type == 3) {
				name = 'ExchangeServiceDetail'
			} else if(item.type == 1) {
				name = 'RefundServiceDetail'
			}
			this.$wsf.go(name, { orderId: item.id });
		},
		loadBackOrderList() {
			if (this.isLoading || !this.hasMore) return;
			this.isLoading = true;
			this.loadStatus = 'loading';
			if (this.tabsIndex == 0) {
				let data = {
                    name:encodeURIComponent(this.queryForm.name),
                    timeType:this.queryForm.timeType,
					pageNum: this.queryForm.pageNum,
					pageSize: this.queryForm.pageSize
				};
				this.$u.api.pageAfterSaleOrder(data).then(res => {
					this.isLoading = false;
					this.loadStatus = 'loadmore';
                    res.data.list.forEach(item=>{
                        // 初始化每个商家列表是否展开字段
                        item.isExpand = false
                    })
					this.orderList = this.orderList.concat(res.data.list);
					this.queryForm.pageNum++;
					this.hasMore = res.data.list.length === 10;
					this.loadStatus = res.data.list.length === 10 ? 'loadmore' : 'nomore';
				});
			} else {
				let data = this.queryForm;
				this.$u.api.afterSalePage(data).then(res => {
					this.isLoading = false;
					this.loadStatus = 'loadmore';
					this.orderList = this.orderList.concat(res.data.list);
					this.queryForm.pageNum++;
					this.hasMore = res.data.list.length === 10;
					this.loadStatus = res.data.list.length === 10 ? 'loadmore' : 'nomore';
					this.orderList.forEach(item => {
						item['skuList'] = [];
						item.skuList.push(item.returnSku);
					});
				});
			}
		},
		resetForm() {
			this.hasMore = true;
			this.queryForm = {
                name:'',
                timeType:0,
				pageNum: 0,
				pageSize: 10
			};
			this.orderList = [];
		},
		goToOrderDetail(item) {
			this.$wsf.go('PendingPayment', { orderId: item.orderId });
		},
        expandSkuList(item){
            item.isExpand = true
        },
        getSkuList(skuList,isExpand){
            if(isExpand){
                return skuList
            }else{
                return skuList.slice(0,3);
            }
        },
        // 查询输入框失焦
        inputBlur(){
            console.log('失去焦点了',this.queryForm.name)
            this.showSearchBtn = true
            this.hasMore = true
            // 从第0页开始查
            this.queryForm.pageNum = 0
            // 列表重新渲染
            this.orderList = []
            this.loadBackOrderList()
        },
        // 查询输入框获得焦点
        inputFocus(){
            this.showSearchBtn = false
            console.log('获得焦点了',this.queryForm.name)
        },
        // 打开日期筛选弹窗
        openScreen(){
            this.showDatePopup = true
        },
        //确定选择日期筛选
        confirmDate(val){
            console.log(val,'去顶了')
            this.queryForm.timeType = val
            this.showDatePopup = false
            this.hasMore = true
            // 从第0页开始查
            this.queryForm.pageNum = 0
            // 列表重新渲染
            this.orderList = []
            this.loadBackOrderList()
        },
	}
};
</script>

<style lang="scss">
.page-content{
    padding-bottom: calc(148rpx + constant(safe-area-inset-bottom));
    padding-bottom: calc(148rpx + env(safe-area-inset-bottom));
}
.card-body-margin {
	margin: 18rpx 0;
}
.applet-backorder-tabs {
	background-color: #fff;
	border-radius: 0 0 20rpx 20rpx;
	overflow: hidden;
	position: sticky;
	top: 0;
	z-index: 888;
    .u-tab-item{
        line-height: 68rpx !important;
        color: #444444 !important;
    }
}
.flex-space-between{
    display: flex;
    justify-content: space-between;
    align-items: center;
    // height: 64rpx;
}
.flex-align-items-start {
	display: flex;
    align-items: flex-start;
}
.flex-align-items-center{
    display: flex;
    align-items: center;
}
.after-sales-orders-list{
    padding: 0rpx 20rpx;
    background: #F6F6F6;
}
.orders-card-item{
    background-color: #fff;
	border-radius: 24rpx;
    margin-top: 20rpx;
	padding:20rpx;
    .sku-content{
        display: flex;
        margin-bottom: 16rpx;
    }
    .sku-image{
        width: 148rpx;
        height: 148rpx;
        border-radius: 16rpx;
        margin-right: 16rpx;
    }
    .sku-info{
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .sku-num{
        font-size: 26rpx;
        color: #999999;
        line-height: 34rpx;
        margin-left: 8rpx;
    }
    .sku-name{
        font-size: 26rpx;
        font-weight: 500;
        color: #191919;
        line-height: 34rpx;
        margin-bottom: 8rpx;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
    }
    .ske-support{
        font-size: 22rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #E3903F;
        line-height: 30rpx;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
    }
    .tip-text{
        font-size: 22rpx;
        color: #999999;
        line-height: 30rpx;
        padding: 18rpx 0rpx 16rpx 0rpx;
    }
    .orders-item-header-type{
        font-size: 26rpx;
        color: #FF0A35;
    }
    .service-order-number{
        font-size: 26rpx;
        color: #999999;
    }
    .after-sales-status-box{
        padding: 20rpx 8rpx 20rpx 16rpx;
        background:rgba(246, 246, 246,0.5);
        border-radius: 16rpx;
        margin-bottom: 20rpx;
    }
    .after-sales-status-title{
        font-size: 26rpx;
        color: #191919;
        width: 156rpx;
        margin-right: 16rpx;
    }
    .after-sales-status-info{
        font-size: 22rpx;
        color: #6E6E6E;
        width: 426rpx;
        text-align: left;
        margin-right: 16rpx;
    }
    .status-icon-right{
        width: 32rpx;
        height: 32rpx;
    }
    .footer-status-icon{
        width: 28rpx;
        height: 28rpx;
        margin-right: 8rpx;
    }
.good-list-expand-more{
    padding: 20rpx 0rpx 8rpx 0rpx;
    display: flex;
    justify-content: center;
    .expand-more-btn{
        padding: 8rpx 20rpx;
        border-radius: 30rpx;
        border: 1rpx solid #C3C3C3;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .expand-more-btn-icon{
        width: 32rpx;
        height: 32rpx;
        margin-left:12rpx ;
    }
}
}
.border-black{
    border: 1rpx solid #C3C3C3;
    color: #191919;
}
.border-red{
    border: 1rpx solid #FF0A35;
    color: #FF0A35;
}
.bg-black{
    background: #EEEEEE;
    color: #999999;
}
.bg-red{
    background: linear-gradient(90deg, #FF6B4E 0%, #FF0A35 100%);
    color: #FFFFFF;
}
.btn{
    border-radius: 32rpx;
    font-size: 28rpx;
    text-align: center;
    padding: 14rpx 24rpx;
    margin-left: 24rpx;
    line-height: 36rpx;
}
.search-box{
    display: flex;
    align-items: center;
    padding: 12rpx 24rpx;
    .search-input{
        flex:1;
        margin-right: 24rpx;
    }
    .screen-box{
        display: flex;
        align-items: center;
    }
    .screen-icon{
        height: 32rpx;
        width: 34rpx;
        margin-left: 12rpx
    }
}
</style>

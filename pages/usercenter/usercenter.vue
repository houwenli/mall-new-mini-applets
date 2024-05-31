<template>
	<view class="body" :style="[getStyle]">
		<!-- 上滑时头部 -->
		<view v-if="!isWsUser">
			<wsf-nav-bar v-show="showSearchBar" :fixed="true" :status-bar="true"  :shadow="false" :bgColor="showSearchBar ? '#fff' : ''">
				<view slot="searchBar" class="navBar">
					<image class="navBar-img"  @click="navigationTo(isLink ? '' : 'QuickLogin')" :src="logType[isLink?1:0]"></image>
					<view class="navBar-text"  @click="navigationTo(isLink ? '' : 'QuickLogin')">{{ isLink ? username : '请登录' }}</view>
				</view>
			</wsf-nav-bar>
		</view>

		<view class="user-content" >
			<view class="user-header">
				<view class="user-info" v-if="!isWsUser">
					<view class="user-info-login">
						<!-- 左边-头像 -->
						<view class="user-info-img" @click="navigationTo(isLink ? '' : 'QuickLogin')">
							<image :src="logType[isLink?1:0]" />
						</view>
						<!-- 右边-用户信息 -->
						<view class="user-info-means">
							<!-- 昵称 -->
							<view class="user-info-text" :style="{'color':`${disposeList.colorStyle==1?'#fff':''}`}" >{{ isLink ? username : '请登录' }}</view>
							<view class="user-info-act" v-if="isLink">
								<!-- 收藏 足迹 订阅 -->
								<view class="user-info-record">
									<view class="user-info-record-item" v-for="(item,index) in recordList" :key="index" @click="navigationTo(item.funName)">
										<view class="user-info-record-text">
											<text class="name" :style="{'color':`${disposeList.colorStyle==1?'#fff':''}`}">{{ item.name }}</text>
											<text class="count" :style="{'color':`${disposeList.colorStyle==1?'#fff':''}`}" >{{ setCount(userRecordCount[item.valName] , 999) || 0 }}</text>
										</view>
										<view class="user-info-record-line"  v-if="item.funName!='UserFollowStore'" :style="{'background-color':`${disposeList.colorStyle==1?'#fff':''}`}"></view>
									</view>
								</view>
							</view>
							<view class="user-info-no-login" v-else @click="navigationTo(isLink ? '' : 'QuickLogin')">
								<view class="login" :style="{'background':`${disposeList.colorStyle==1?'#fff':''}`}">
									<image src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/usercenter/ic_user.png"></image>
									<text>点击登录</text>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="user-body">
				<!-- 分销订单 推广小店 -->
				<view v-if="mySotreList.length"  class="my-store">
					<view class="left">
						<text class="name">推广小店</text>
						<view class="entry" @click="toStore">
							<image src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/usercenter/ic_me_shop.png"></image>
							<text class="store">我的小店</text>
						</view>
					</view>
					<view class="right">
						<image src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/usercenter/ic_shop.png"></image>
					</view>
				</view>
				<!-- 我的订单模块 -->
				<view class="user-modules user-modules-order">
					<!-- 更多订单-->
					<view class="user-modules-order-grid">
						<view
							:class="['user-modules-order-grid-items',idx==modulesOrderGridList.length-1?'user-modules-order-grid-all':'']"
							v-for="(item,idx) in modulesOrderGridList"
							:key="idx"
							@click="navigationTo(item.sceneName, { status: item.status })"
						>
						 		<!-- 区分线 -->
								<image
										v-if="idx==modulesOrderGridList.length-1"
										class="user-modules-order-grid-items-rightImg"
										style="height: 100%;width: 100%;"
										:src="item.rightImg"
										alt=""
									/>
								<view>
									<view class="user-modules-order-grid-items-icon">
										<image
											class="user-modules-order-grid-items-icon-img"
											style="height: 100%;width: 100%;"
											:src="item.img"
											alt=""
										/>
										<!-- Todo : 修改边框样式 -->
										<u-badge
											 :class="[
                          orderMessageCount[item.MessageCountName] < 10 ? 'badge1' : orderMessageCount[item.MessageCountName] < 100 ? 'badge2' : 'badge3',
                          'badge',
                        ]"
											color=" #FFFFFF"
											:is-center="true"
											:count="
												item.MessageCountName
													? setCount(orderMessageCount[item.MessageCountName], 99)
													: 0
											"
										>
										</u-badge>
									</view>
									<view class="user-modules-order-grid-items-text">{{ item.text }}</view>
								</view>
						</view>
					</view>
					<!-- 付款 收货 轮播 -->
					<swiper v-if="isLink && payAndReceiveList.length!=0" class="user_modules_order_swipe" circular :indicator-dots="false" :autoplay="true" :interval="3000">
							<swiper-item v-for="(item, index) in payAndReceiveList" :key="index">
								<!-- 待付款--UI4期 -->
								<!-- <view v-if="item.status==1" class="flex" @click="goTo(item,1)">
									<image class="img" :src="item.skuImage"></image>
									<view class="text">
										<text class="name">{{item.action||''}}</text>
										<text class="time" v-if="item.remainTime">剩余时间<uni-countdown :show-day="false" :second="1000" @timeup="timeup" /></text>
									</view>
									<view class="btn" @click.stop="goTo(item,2)">去支付</view>
								</view> -->

								<!-- 待付款 -->             
								<view class="flex transport-pay" @click="goTo(item,1)" v-if="item.status==1">
									<view class="transport-pay-left">                
										<image :src="item.skuImage"></image>
										<view class="transport-pay-left-middle">
											<text class="transport-pay-left-middle-status">{{item.action || ''}}</text>
											<view class="transport-pay-left-middle-time">
												<text class="text1">剩余时间</text>
												<view class="text2"> 
													<u-count-down
														fontFamily="Arial-BoldMT, Arial"
														color="#FF0A35"
														separatorColor="#FF0A35"
														fontSize="26"
														:show-day="false" 
														:timestamp="item.time"
														@end="timeup"></u-count-down>													
												</view>
											</view>
										</view>
									</view>
									<view class="transport-pay-right" @click.stop="goPay(item,2)">
										去支付
									</view>
								</view>

								<view class="flex swiper-item-content transportStatus" @click="goTo(item,3)" v-if="item.status==3">
									<image class="img" :src="item.skuImage"></image>
									<view class="text">
										<view class="name flex">
											<text>{{item.action||''}}</text>
											<text class="date">{{item.acceptDate ? getTransportTime(item.acceptDate):''  }}</text>
										</view>
										<view class="time">{{item.acceptStation ||''}}</view>
									</view>
								</view>
							</swiper-item>
					</swiper>
				</view>
				<!-- 拓展功能模块 我的权益 -->
				<view class="user-modules user-modules-slot">
					<view class="user-modules-slot-header">我的权益</view>
					<view class="user-modules-slot-container">
						<block v-for="(item, index) in modulesSlotList" :key="index">
							<view :key="index" class="user-modules-slot-items" @click="navigationTo(item.sceneName)">
								<view>
									<view class="user-modules-slot-items-data">{{modulesSlotData[item.sceneName]}}</view>
									<view class="user-modules-slot-items-name">{{item.name}}<image src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/usercenter/ic_next.png" class="user-modules-slot-items-name-img"></image></view>
								</view>
								<image :src="item.img" class="user-modules-slot-items-img"></image>
							</view>
							<view v-if="item.sceneName=='GoodFortuneValue'" class="user-modules-slot-items-line"></view>
					  </block>
					</view>
				</view>
				<!-- 智慧生活会员 产品（林敏）要求这里先关闭2023.07.10-->
				<!-- <view class="membership" @click="toMembership" v-if="isLink">
					 <image
					 	class="image"
					 	src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/main-packages/usercenter/banner.png"
					 	alt=""
					 />
				</view> -->
			</view>
		</view>
		<!-- 商品轮播 -->
		<view v-if="disposeList.contentList && disposeList.contentList.length!=0" class="user-modules-swipe">
			<swipe class="wsf-swipe" :config="disposeList.contentList[0]"></swipe>
		</view>
		<!-- 热销商品模块 -->
		<view class="applet-template-recommend">
			<wsf-goods-list title="hot" ref="goodslist" :list="flowList" :loadStatus="loadStatus" @goodsClick="goodsClick($event)"></wsf-goods-list>
		</view>

		<!-- 底部导航栏 -->
		<wsfTabBar :selected="3"></wsfTabBar>

		<!-- 回到顶部 -->
		<u-back-top :scroll-top="scrollTop" top="5000" :icon-style="iconStyle" :bottom="200">
			<image src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/prev-icon-list/top%402x.png" style="width: 80rpx; height: 80rpx"></image>
		</u-back-top>
		<orderSecondConfirm ref="orderSecondConfirm"></orderSecondConfirm>
	</view>
</template>

<script>
import wsfGoodsList from '@/components/wsf-goods-list/wsf-goods-list.vue';
import wsfNavBar from '@/components/wsf-nav-bar/wsf-nav-bar.vue';
import wsfTabBar from '@/components/wsf-tab-bar/wsf-tab-bar.vue'
import swipe from '../index/components/swipe/index.vue'
import { priceFilter,getTransportTime } from '@/common/wsfFilter.js';
import {visit} from '@/common/visit.js'
import orderSecondConfirm from '@/components/orderSecondConfirm.vue';
export default {
	components: { wsfNavBar, wsfGoodsList,wsfTabBar,swipe, orderSecondConfirm },
	data() {
		return {
			getTransportTime,
			modulesOrderGridList: [
				// 订单模块组件按钮集
				{
					text: '待付款',
					sceneName: 'OrderList',
					status: '1',
					MessageCountName: 'toPayCount',
					img:'https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/usercenter/ic_evaluate.png'
				},
				{
					text: '待收货',
					sceneName: 'OrderList',
					status: '2',
					MessageCountName: 'toReceiptAndDeliverCount',
					img:'https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/usercenter/ic_receipt.png'
				},
				{
					text: '待评价',
					// sceneName: 'EvaluationCenter',
					sceneName: 'OrderList',
					status: '5',
					MessageCountName: 'toEvaluateCount',
					img:'https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/usercenter/ic_evaluate.png'
				},
				{
					text: '退货/换货',
					sceneName: 'BackOrderList',
					status: '',
					MessageCountName: 'backOrderCount',
					img:'https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/usercenter/ic_back_order.png'
				},
					{
					text: '更多订单',
					sceneName: 'OrderList',
					status: '-1',
					img:'https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/usercenter/ic_all_order.png',
					rightImg:'https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/usercenter/ic_right.png'
				},
			],
			modulesSlotList: [
				// 插槽拓展功能按钮集
				// {
				// 	name: '福气值',
				// 	sceneName: 'GoodFortuneValue',
				// 	img:'https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/usercenter/ic_good_fortune.png'
				// },
				{
					name: '优惠券',
					sceneName: 'newCoupon',
					img:'https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/usercenter/ic_new_oupon.png'
				}
			],
			modulesSlotData: {
				'GoodFortuneValue': 0,
				'newCoupon': 0
			},
			priceFilter,
			safePaddingHeight: 0, // 状态栏高度
			messageCount: 0, // 用户消息统计
			userRecordCount: {
				// 商品记录
			},
			orderMessageCount: {
				// 订单记录统计
				toPayCount: 0,
				toDeliverCount: 0,
				toReceiptCount: 0,
				toEvaluateCount: 0,
				backOrderCount: 0,
				toReceiptAndDeliverCount: 0
			},
			isLogin: false, // 是否登录
			isLink: false, // 是否已经关联过账号
			showSearchBar: false, // 是否显示头部导航栏
			flowList: [], // 瀑布流商品列表
			loadStatus: 'loadmore', // 加载更多样式效果
			isLoading: false, // 是否正在加载
			hasMore: true, // 是否拥有更多
			queryForm: {
				// 页码页容量
				pageType: 4,
				pageNum: 0,
				pageSize: 10
			},
			username: '', // 用户名
			isShowStore: 0,
			couponCount: 0,//可用优惠券数量
			scrollTop:0,
			isWsUser: 0,
			mySotreList: [],
			payAndReceiveList:[],
			disposeList:{
				bgImage:'',
				bgColor:'',
				colorStyle:2,// colorStyle 1:浅色  2: 深色
				contentList:[]
			},//轮播
      		timeNum:0,
			isDistribution:true, //是否展示轮播图
			recordList:[
				{
					name: '收藏',
					funName: 'UserCollection',
					valName: 'collectGoodsCount'
				},
				{
					name: '足迹',
					funName: 'UserBrowser',
					valName: 'viewGoodsCount'
				},
				{
					name: '订阅',
					funName: 'UserFollowStore',
					valName: 'collectStoreCount'
				},
			],
			logType:{ //登录头像 0：未登录 1：已登录
				0:'https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/usercenter/ic_no_log.png',
				1:'https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/usercenter/ic_avatar.png'
			}

		};
	},
	onShow() {
		// this.isWsUser = uni.getStorageSync('isWsUser')
		visit(this,"个人中心")
		this.safePaddingHeight = getApp().globalData.statusBarHeight + 20;
		this.isLink = getApp().globalData.isLink;
		this.isShowStore = getApp().globalData.wsfBaseInfo.isShowStore // 判断商城信息
		console.log(getApp().globalData.wsfBaseInfo.isShowStore,"getApp().globalData.isLink");
		if (getApp().globalData.isLink) {
			this.getUserInfo();
			this.loadMessageCount();
			this.loadOrderCount();
			this.getCustomerRecord();
			this.getPayAndReceive();
			this.getCouponTotal()
			this.getMystore()

			// this.loadPointOrderCount();
			// this.$u.api.valueCardCodeCount().then(res => {
			// 	this.modulesSlotList[1].name = `礼品卡(${res.data.canUseNum})`
			// }) //礼品卡功能相关
		} else {
			// this.modulesSlotList[1].name = `礼品卡(0)` //礼品卡功能相关
			this.couponCount = 0;
			this.messageCount = 0;
			this.orderMessageCount = {
				toPayCount: 0,
				toDeliverCount: 0,
				toReceiptCount: 0,
				toEvaluateCount: 0,
				backOrderCount: 0,
				toReceiptAndDeliverCount: 0,
			};
			this.username = '';
			this.userRecordCount = {};
			this.mySotreList = [];
		}
		this.queryPersonConfigTemp();
		 // if (this.flowList && this.flowList.length == 0) {
		this.resetList()
		// }
	},
	onReachBottom() {
		this.GetRecommendList();
	},
	onPageScroll(e) {
		this.scrollTop = e.scrollTop;

		let showSearchBar = this.showSearchBar;
		if (e.scrollTop > 30 && !showSearchBar) {
			this.showSearchBar = true;
		} else if (e.scrollTop < 30 && showSearchBar) {
			this.showSearchBar = false;
		} else {
			return;
		}
	},
	watch:{
		isLink(newVal) {
			if(!newVal) {
				this.modulesSlotData['GoodFortuneValue'] = 0
				this.modulesSlotData['newCoupon'] = 0
			}
		}
	},
	computed:{
		getStyle(){
			let bgImage=this.disposeList.bgImage||''
      if(!bgImage){
        if(this.disposeList.colorStyle==1){
         bgImage="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/usercenter/shense.png"
        }else{
         bgImage="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/usercenter/qianse.png"
        }
      }
      return {
				paddingTop: `${this.safePaddingHeight}px`,
        backgroundImage:bgImage? `url(${bgImage})` : '',
      }
		},
	},
	methods: {
		// 总量显示规则
		setCount(val,max){
			if(!val||isNaN(val*1)) return 0
			return val*1 > max ? max + '+': val
		},
		goPay(item){
			item.id = item.orderIds[0]
			this.$refs.orderSecondConfirm.orderOperation(item, '去支付')
		},
		//轮播跳转
		goTo(val, tag) {
			let name=''
			let params={}
			switch (tag) {
				//付款卡片
				case 1:
				name='PendingPayment'
				params= {
					orderId: val.orderIds[0],
					backStatus: 0,
				}
				break
				//付款按钮
				case 2:
				name='Pay'
				params= {
					id: val.orderIds[0],
					orderMoney: val.price,
					orderCode: val.masterOrderCode,
					type: 1,
					fromSource: true,
					businessType: 100,
        			paySceneType: val.orderType == 14 ? 102 : 101 //102集采 101电商订单
				}
				break
				//已发货 已揽收 运输中 派件中 正常签收
				case 3:
				name='trackingCells'
				params= {
					id: val.orderId,
					type: 0,
				}
				break
				default:
				break
			}
			this.$wsf.go(name , params )
		},
		//倒计时结束
		timeup(){
			this.getPayAndReceive()
		},
		// 获取待付款和待收货轮播信息
		getPayAndReceive(){
			this.$u.api.queryOrderRotographList().then(res => {
				if(res.code==200){
					this.payAndReceiveList=res.data
					// this.payAndReceiveList=[
					// 	{
					// 		time: 1681007594000,
					// 		status: 1, // 状态1 待付款
					// 		skuImage: 'https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/order/history_no.png',
					// 		action: '待付款',
					// 		acceptDate: '2022-03-04',
					// 		acceptStation: '【深圳转运中心】已发出，下一站【深圳宝安机场的点点滴滴多多多多多多多多多多多多多多多多多啊】'
					// 	},
					// 	{
					// 		time: 1681005674000,
					// 		status: 1, // 状态1 待付款
					// 		skuImage: 'https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/order/history_no.png',
					// 		action: '待付款2',
					// 		acceptDate: '2022-03-04',
					// 		acceptStation: '【武汉转运中心】已发出，下一站【深圳宝安机场的点点滴滴多多多多多多多多多多多多多多多多多啊】'
					// 	},
					// 	{
					// 		status: 3, // 状态3 等待收货
					// 		skuImage: 'https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/order/history_no.png',
					// 		action: '等待收货',
					// 		acceptDate: '2022-03-04',
					// 		acceptStation: '【深圳转运中心】已发出，下一站【深圳宝安机场的点点滴滴多多多多多多多多多多多多多多多多多啊】'
					// 	}
					// ] 
					let newArray = []
					this.payAndReceiveList.forEach(item=>{
						if(item.createTime){
							item.createTime = item.createTime.replace(/(\-)/g,'/')
							item.time = new Date(new Date(item.createTime).getTime() + 30*60*1000).getTime() - new Date().getTime()
							item.time = item.time/1000
						}
						if(item.time>0 || item.status==3) {
							newArray.push(item)
						}
					})  
					this.payAndReceiveList = newArray 
				}
			})
		},
		// 获取PC配置的商品轮播配置等
		queryPersonConfigTemp(){
			this.$u.api.queryPersonConfigTemp(103).then(res=>{
				if(res.code==200){
          this.disposeList=JSON.parse(res.data.content)
					// 小程序头部根据模式进行颜色变化
					if(this.disposeList.colorStyle==1){
						wx.setNavigationBarColor({
							frontColor: "#ffffff",
							backgroundColor:'#fff'
						})
					}else{
						wx.setNavigationBarColor({
							frontColor: "#000000",
							backgroundColor:'#fff'
						})
					}
        }
			})
		},
		resetList() {
			this.flowList = []
			this.hasMore = true
			this.loadStatus = 'loadmore'
			this.queryForm = {
				// 页码页容量
				pageType: 4,
				pageNum: 0,
				pageSize: 10
			}
			this.$refs.goodslist.clearList();
			this.GetRecommendList()
		},
		//获取用户的优惠券总数
		getCouponTotal() {
			this.$u.api.QueryUserCouponList({
				pageNo: 0, pageSize: 10
			}).then(res => {
				this.modulesSlotData['newCoupon'] = res.data.rows
			})
		},
		/* 获取用户信息 */
		getUserInfo() {
			this.$u.api.CustomerDetail().then(res => {
				if (res.code === 200) {
					this.username = res.data.userName;
					this.modulesSlotData['GoodFortuneValue'] = (res.data.fqzPoint / 100).toFixed(2)
					this.isLogin = true;
				}
			});
		},
		/* 获取用户信息总数 */
		loadMessageCount() {
			let that = this;
			this.$u.api.queryNewsReadNums().then(res => {
				if (res.code == 200) {
					let num = 0;
					res.data.filter(ele => {
						if (ele.receiverType == 2) {
							num += ele.count
						}
					})
					this.messageCount = num
				}
			})
		},
		/* 获取用户订单数量 */
		loadOrderCount() {
			let that = this;
			this.$u.api.QueryOrderMessageCount().then(res => {
				if (res.code === 200) {
					let orderMessageCount = {
						toPayCount: res.data.toPayCount,
						toDeliverCount: res.data.toDeliverCount,
						toReceiptCount: res.data.toReceiptCount,
						toEvaluateCount: res.data.toEvaluateCount,
						backOrderCount: res.data.backOrderCount,
						toReceiptAndDeliverCount: res.data.toReceiptAndDeliverCount,
					};
					this.orderMessageCount = orderMessageCount;
				}
			});
		},
		/* 获取用户商品记录 */
		getCustomerRecord() {
			let that = this;
			this.$u.api.GetCustomerStatistics().then(res => {
				if (res.code === 200) {
					this.userRecordCount = res.data;
				}
			});
		},
		/* 跳转 */
		navigationTo(sceneName, params) {
			if(sceneName) {
				this.$wsf.go(sceneName, params);
			}
		},
		/* 获取推荐的商品列表 */
		GetRecommendList() {
			let that = this;
			if (this.isLoading || !this.hasMore) return;
			this.isLoading = true;
			this.loadStatus = 'loading';
			this.$u.api.QueryRecommendCommodity(this.queryForm).then(res => {
				this.isLoading = false;
				this.loadStatus = 'loadmore';
				if (res.code === 200) {
					this.flowList = this.flowList.concat(
						res.data.map(item => {
							item.price = this.priceFilter(item.price);
							return item;
						})
					);
					this.queryForm.pageNum++;
					this.hasMore = res.data.length === 10;
					this.loadStatus = res.data.length === 10 ? 'loadmore' : 'nomore';
				}
			});
		},

		// 商品跳转
		goodsClick(e) {
			console.log('e', e);
			if(e.goodsSource == 4){
				this.$wsf.go('ToMotor',{skuId: e.id});
			} else {
				this.$wsf.go('SkuDetail', { skuId: e.id });
			}
		},
		//去分销订单列表
		toDistributionOrder() {
			this.$wsf.go("DistributionOrder")
		},
		// 查询我的小店
		getMystore() {
			this.$u.api.GetMyStores().then((res) => {
				this.mySotreList = res.data || []
			});
		},
		toStore() {
			if(this.mySotreList.length > 1) {
				this.$wsf.go('UserFollowStore', { type: 1 });
			} else {
				let idNumber = this.mySotreList[0].idNumber
				this.$wsf.go('StoreIndex', { type: 1,storeId:idNumber });
			}
		},
		toMembership(){
			uni.navigateToMiniProgram({
				appId:"wx2c4dc6427b1b83ff",
				extraData:{
					mallToken:uni.getStorageSync('newToken'),
					url:`/pages/page-web-view/page-web-view?isUsePassengerH5=1&url=/wisdom-live/autonym&param={"buyType":3}`,
				},
				envVersion: __wxConfig.envVersion
			})
		}
	}
};
</script>

<style lang="scss" scoped>

.body{
	background-color: #f6f6f6;
	overflow: auto;
	background-size: 100% auto;
	background-repeat: no-repeat;
	z-index: 1;
}
/* 隐藏头部 */
.navBar{
	display: flex;
	align-items: center;
	padding-left: 24rpx;
	.navBar-img{
		width: 64rpx;
		height: 64rpx;
	}
	.navBar-text{
		padding-left: 16rpx;
    font-size: 30rpx;
		font-weight: 500;
		color: #191919
	}
	.navBar-bt{
		padding-left: 16rpx;
		width: 32rpx;
		height: 34rpx;
	}

}

/* 头部 */
.user-header {
  padding-bottom: 14rpx;
  .user-info {
    padding: 0 34rpx 0 22rpx;
    font-size: 24rpx;
    .user-info-login {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      width: 100%;
      margin-right: 200rpx;
      // 头像
      .user-info-img,
      .user-info-img image {
        height: 92rpx !important;
        width: 92rpx !important;
      }
      // 用户信息
      .user-info-means {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        width: 100%;
        height: 92rpx;
        margin-left: 14rpx;
        // 昵称
        .user-info-text {
          font-size: 32rpx;
          font-weight: 500;
          color: #000;
        }
        .user-info-act {
          display: flex;
          justify-content: space-between;
          // 收藏 足迹 订阅
          .user-info-record {
            color: #ffffff;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            align-content: space-between;
            .user-info-record-item {
              display: flex;
              align-items: center;
              color: #ffffff;
              box-sizing: content-box;
              .user-info-record-text {
                height: 30rpx;
                font-size: 22rpx;
                color: #6e6e6e;
                text {
                  display: inline-block;
                  line-height: 30rpx;
                }
                .count {
                  padding-left: 8rpx;
                  font-size: 26rpx;
                  color: #191919;
									font-family: Arial-BoldMT, Arial;
                }
              }
              .user-info-record-line {
                margin: 0 20rpx;
                width: 2rpx;
                height: 20rpx;
                background: #6e6e6e;
              }
            }
          }
          // 设置
          .user-info-bt {
            width: 36rpx;
            height: 36rpx;
          }
        }
				// 未登录
				.user-info-no-login{
					display: flex;
					justify-content: space-between;
					.login{
						display: flex;
            align-items: center;
						height: 38rpx;
						line-height: 38rpx;
						padding: 0 8rpx;
						background: #ebe5e2;
						border-radius: 18rpx;
						image{
							width: 24rpx;
							height: 26rpx;
						}
						text{
							line-height: 40rpx;
							padding-left: 8rpx;
							font-size: 22rpx;
							color: #191919;
						}
					}
					.set{
						width: 36rpx;
            height: 36rpx;
					}

				}
      }
    }
  }
}

/*付款 收货 轮播*/
.user_modules_order_swipe{
  margin:0  16rpx 16rpx 16rpx;
	height: 108rpx;
  background: #FAFAFA;
  border-radius: 16rpx;
  .flex{
    display:flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }
 .swiper-item-content{
    padding: 8rpx 8rpx 12rpx 8rpx;
    .img{
      width: 88rpx;
      height:88rpx;
      border-radius: 24rpx;
    }
    .text{
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 88rpx;
      flex:1;
      overflow: hidden;
      margin-left:8rpx;
			padding:8rpx 0 6rpx;
      .name{
        font-size: 30rpx;
        font-weight: 500;
        color: #191919;
      }
      .time{
        font-size: 22rpx;
        color: #6E6E6E;
        white-space: nowrap; // 强制一行
        overflow: hidden; // 溢出隐藏
        text-overflow: ellipsis; // 文字溢出显示省略号
        text{
          display: inline-block;
          margin-left: 8rpx;
          .uni-countdown{
            font-size: 26rpx !important;
            color: #FF0A35 !important;
            font-weight: bold;
          }
        }
      }
    }
    .btn{
      width: 160rpx;
      height: 60rpx;
      line-height: 60rpx;
      background: linear-gradient(90deg, #FF5F2E 0%, #FF0A35 100%);
      border-radius: 16rpx;
      font-size: 32rpx;
      color: #FFF9E9;
      text-align: center;
    }
  }
  /deep/ .van-swipe__indicators{
    display: none;
  }
	.transport-pay{
		height: 100%;
		&-left{
			display: flex;
			image{
				width: 88rpx;
				height:88rpx;
				border-radius: 24rpx;
			}
			&-middle{
				display: flex;
				flex-direction: column;
				padding: 8rpx;
				&-status{
					font-size: 30rpx;
					font-family: PingFangSC-Medium, PingFang SC;
					font-weight: 500;
					color: #191919;
				}
				&-time{
					display: flex;
					>.text1{
						font-size: 22rpx;
						font-family: PingFangSC-Regular, PingFang SC;
						font-weight: 400;
						color: #6E6E6E;
						margin-right: 8rpx;
					}
				}
			}
		}
		&-right{
			width: 160rpx;
			margin-right: 16rpx;
			text-align: center;
			height: 60rpx;
			background: linear-gradient(90deg, #FF5F2E 0%, #FF0A35 100%);
			border-radius: 30rpx;
			font-size: 32rpx;
			font-family: PingFangSC-Medium, PingFang SC;
			font-weight: 500;
			color: #FFF9E9;
			line-height: 60rpx;
		}
	}	
	.transportStatus{
		.date{
			padding-right:14rpx;
			font-size: 22rpx;
			font-weight: 400;
			color: #999999;
		}
	}
}

.user-content::-webkit-scrollbar {
	display: none;
}

.user-body {
	border-radius: 20rpx 20rpx 0 0;
	overflow: hidden;
	box-sizing: border-box;
	padding: 0 28rpx 0;

	.my-store{
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-top: 20rpx;
		padding: 10rpx 32rpx 8rpx 16rpx;
		width: 100%;
		height: 158rpx;
		background: #FFFFFF;
		border-radius: 24rpx;

		.left{
			flex: 1;
			display: flex;
    	flex-direction: column;
    	justify-content: space-between;
			height: 140rpx;
			font-size: 30rpx;
			font-family: PingFangSC-Medium, PingFang SC;
			font-weight: 500;
			color: #191919;
			.name{
				font-size: 30rpx;
				font-weight: 500;
				padding: 10rpx 0 0 8rpx;
			}
			.entry{
				display: flex;
    		align-items: center;
				height: 64rpx;
				background: linear-gradient(98deg, rgba(255,15,52,0.07), #FFFFFF 100%);
				border-radius: 20rpx;
				image{
					margin-left: 16rpx;
					width: 44rpx;
					height: 44rpx;
				}
				.store{
					padding-left: 16rpx;
					font-size: 26rpx;
				}
			}
		}
		.right,.right image{
			width: 172rpx;
			height: 140rpx;
		}
	}
}

/* 模块栏 */
.user-body .user-modules {
	position: relative;
	z-index: 10;
	background-color: #fff;
	border-radius: 20rpx;
	padding: 24rpx;
	margin-top: 20rpx;
	/* margin: 20rpx 24rpx 40rpx 24rpx; */
}

/* 我的订单模块 */
.user-body .user-modules-order {
  padding: 0;
  overflow: hidden;
  .user-modules-order-header {
    box-sizing: content-box;
    padding: 24rpx 0 10rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    line-height: 40rpx;
    .user-modules-order-header-title {
      font-size: 28rpx;
      font-weight: 500;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #000000;
    }
    .user-modules-order-header-arrow {
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .user-modules-order-header-icon {
      width: 16rpx;
      height: 16rpx;
      margin-left: 8rpx;
    }
  }
  .user-modules-order-grid {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .user-modules-order-grid-items {
      display: flex;
      flex-direction: column;
      text-align: center;
      width: 20%;
      height: 138rpx;
      .user-modules-order-grid-items-icon {
        width: 52rpx;
        height: 52rpx;
        margin: 24rpx auto 16rpx;
        position: relative;
        .user-modules-order-grid-items-icon-img {
          height: 100%;
          width: 100%;
        }
      }
      .user-modules-order-grid-items-rightImg {
        height: 100%;
        width: 20rpx !important;
      }
      .user-modules-order-grid-items-text {
        font-size: 24rpx;
        line-height: 26rpx;
        color: #444;
      }
    }
    .user-modules-order-grid-all {
      flex-direction: row;
    }
  }
}

/* 拓展插槽组件 */
.user-modules-slot {
  padding: 20rpx 24rpx  28rpx !important;
  .user-modules-slot-header {
    line-height: 40rpx;
    font-size: 30rpx;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #000000;
  }
  .user-modules-slot-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 18rpx 16rpx  0!important;
  }
  .user-modules-slot-items {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100%;
    flex: 1;
    .user-modules-slot-items-icon {
      width: 68rpx;
      height: 68rpx;
      margin: 4rpx auto 16rpx;
      .user-modules-slot-items-icon-img {
        height: 100%;
        width: 100%;
      }
    }
    .user-modules-slot-items-name {
			display: flex;
			align-items: center;
      font-size: 26rpx;
      height: 34rpx;
      font-size: 26rpx;
      color: #6e6e6e;
      .user-modules-slot-items-name-img {
        margin-left: 4rpx;
        width: 24rpx;
        height: 26rpx;
      }
    }
    .user-modules-slot-items-data {
      font-size: 40rpx;
      font-weight: 500;
      color: #000;
      line-height: 36rpx;
      padding-bottom: 12rpx;
      font-family: Arial-BoldMT, Arial;
    }
    .user-modules-slot-items-img {
      width: 88rpx;
      height: 88rpx;
    }
  }
	.user-modules-slot-items-line {
      margin: 0 36rpx 0 32rpx;
      width: 2rpx;
      height: 64rpx;
      background: #C3C3C3;
  }
}

/* 热销商品 */
.applet-template-recommend {
	padding: 20rpx 24rpx 0;
	padding-bottom: calc(env(safe-area-inset-bottom) + 100rpx);
}

/* badge样式覆盖 */
.badge {
	/deep/ .u-badge {
		// border-radius: 13rpx;
		height: 28rpx;
		width: auto;
		padding: 0 10rpx;
		line-height: 26rpx;
		font-size: 22rpx !important;
		top: 6rpx !important;
	}
	/deep/ .u-badge--bg--error{
		background-color: none;
	}
}
.badge1{
	/deep/ .u-badge--bg--error{
    background:url('https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/usercenter/ic_badge1.png');
    background-size: 100% 100%;
	}
}
.badge2{
	/deep/ .u-badge--bg--error{
    background:url('https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/usercenter/ic_badge2.png');
    background-size: 100% 100%;
	}
}
.badge3{
	/deep/ .u-badge--bg--error{
    background:url('https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/usercenter/ic_badge3.png');
    background-size: 100% 100%;
	}
}

/* 商品轮播 */
.user-modules-swipe{
	padding-top: 20rpx;
	/deep/.wx-swiper-dot{
		display: none !important;
	}
}

.membership .image{
	width: 702rpx;
	height: 188rpx;
	display: block;
	margin: 20rpx auto 0;
	border-radius: 20rpx;
}
</style>

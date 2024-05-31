<template>
  <view class="pending-payment">
    <wsf-nav-bar
      :fixed="true"
      :hasBack="true"
      :status-bar="true"
      :title="showSearchBar ? '订单详情' : ''"
      :shadow="false"
      backIconType="grey"
      :bg-color="showSearchBar ? '#fff' : 'transparent'"
      @onBackBtnClick="onBackBtnClick"
    ></wsf-nav-bar>
    <view class="content">
      <view class="header" :style="{ paddingTop: `${safePaddingHeight}px` }">
        <view class="title">
          <!-- <image class="order-status-icon" :src="orderStatusIconDict[status]" /> -->
		  <image class="order-status-icon" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/motorCar/ok.png" v-if="titleName == '退款成功' || titleName == '交易完成'" />
          <image class="order-status-icon" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/motorCar/time.png" v-else-if="titleName != '超时未支付，已取消'" />
		  <image class="order-status-icon" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/motorCar/tips.png" v-else />
          <text class="order-status-text">{{ titleName }}</text>
        </view>
        <!-- 等待支付 -->
        <view class="txt" v-if="status == 1 && countDown>0">
          <text>剩</text>
          <u-count-down
            :show-days="false"
            :show-minutes="true"
            :show-seconds="true"
            separator="zh"
            bg-color="transparent"
            separator-size="26"
            separator-color="#fff"
            color="#fff"
            font-size="26"
            :timestamp="countDown"
          ></u-count-down>
          <text>支付关闭</text>
        </view>
        <!-- 等待收货 -->
        <view
          class="txt"
          v-else-if="(status == 2 || status == 3) && titleDesc"
          >{{ titleDesc }}</view
        >
		<!-- 订单超时 -->
		<!-- <view v-else-if="status == 8" class="txt">
			<image class="order-status-icon" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/motorCar/tips.png" />
          	<text class="order-status-text">用户主动取消</text>
		</view> -->
        <!-- 已取消 -->
        <view v-else style="height: 8rpx"></view>
      </view>
    </view>
    <view
      class="inform"
      v-if="(status == 2 || status == 3) && orderDetailData.signType == 1"
    >
      <u-notice-bar mode="horizontal" :list="barList"></u-notice-bar>
    </view>
    <view class="address-info">
      <view class="address-info-content">
        <view class="store-get" v-if="(status == 6 && orderDetailData.orderSkuWithMarketings[0].refundStatus == 2) ||
		(status == 3 && orderDetailData.orderSkuWithMarketings[0].refundStatus != 1)">
          <!-- 待提车 -->
          <template v-if="status == 3 && orderDetailData.orderSkuWithMarketings[0].refundStatus != 1">
            <view>
              <text>请到店后出示</text>
              <text>取车码</text>
            </view>
            <text>{{ orderDetailData.deliveryGoodsCode }}</text>
          </template>
          <!-- 已退款 -->
          <template v-else-if="status == 6">
            <view>
              <text>已原路退回</text>
            </view>
            <text>￥{{ priceFilter(orderDetailData.realBackPrice) }}</text>
          </template>
        </view>

        <view class="store-adress">
          <text>自提门店</text>
          <view class="store-adress-content">
            <view class="store-adress-content-top">
              <view>{{ storeItem.name }}</view>
              <view>{{ storeItem.distance | filterDistance }}</view>
            </view>
            <view class="store-adress-content-middle"
              >{{ storeItem.address }}
            </view>
            <view class="store-adress-content-bottom"
			v-if="storeItem.openStartTime && storeItem.openEndTime"
              >营业时间：{{ storeItem.openStartTime }} - {{ storeItem.openEndTime }}
            </view>
          </view>
          <view class="store-adress-footer">
            <view @click="openMap">
              <image src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/motorCar/navigation.png"></image>
              <text>导航到店</text>
            </view>
            <view style="color: #eaeaea">|</view>
            <view @click="openPhone">
              <image src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/motorCar/phone-icon.png"></image>
              <text>联系门店</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 商品信息 -->
    <view class="merchandise-news">
      <view class="shop-name" v-if="isShowStore > 0" @click="goToStore()">
        <!-- 店铺图标 -->
        <image
          src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/prev-icon-list/Shop%402x.png"
          style="width: 30rpx; height: 30rpx"
        ></image>
        <text class="name u-line-1">{{ orderDetailData.storeName }}</text>
      </view>
      <view
        v-for="(item, index) in orderDetailData.orderSkuWithMarketings"
        :key="index"
      >
        <view class="shop-container">
          <view class="shop-info" @click="goToSku(orderDetailData.orderSkuIds[0])">
            <view class="img"
              ><image
                :src="item.skuImage"
                style="width: 160rpx; height: 160rpx; border-radius: 10rpx"
              ></image
            ></view>
            <view class="txt-info">
              <view class="txt-1 u-line-1">{{ item.skuName }}</view>
              <view class="txt-2">
                <text>{{ item.skuSpecs }}</text>
              </view>
            </view>
          </view>
          <view class="shop-button-column">
            <button
              class="common-btn light-btn"
              v-if="item.refundStatus == 1"
              @tap="goRefundServiceDetail(item)"
            >
              退款中
            </button>
            <button
              class="common-btn"
              v-if="item.refundStatus == 2 && orderDetailData.oldRefund != 1"
              @tap="goRefundServiceDetail(item)"
            >
              退款完成
            </button>
            <button
              class="common-btn"
              v-if="item.refundStatus == 3"
              @tap="goRefundServiceDetail(item)"
            >
              退款失败
            </button>
            <button
              class="common-btn light-btn"
              v-if="
                orderDetailData.canRefund &&
                (item.refundStatus == 0 || item.refundStatus == 3) &&
                orderDetailData.orderType != 10
              "
              @tap="goToRefund(item)"
            >
              申请退款
            </button>
          </view>
        </view>
      </view>

      <!-- 商品总价 -->
      <view class="money-content u-border-top">
        <view class="money-content-line">
          <span>商品总价</span>
          <span>￥{{ priceFilter(orderDetailData.totalSalePrice) }}</span>
        </view>
        <view class="money-content-line money-content-coupon" v-if="orderDetailData.retailerCouponPrice>0">
          <span>优惠券</span>
          <span>-￥{{ priceFilter(orderDetailData.retailerCouponPrice) }} </span>
        </view>
        <view class="money-content-line money-content-true">
          <span>实付款</span>
          <span> ￥{{ priceFilter(orderDetailData.price) }} </span>
        </view>
      </view>

      <!-- 联系客服 -->
      <view class="service u-border-top">
        <view :class="['store-adress-footer', (status ==1 && orderDetailData.orderSkuWithMarketings[0].refundStatus != 1) || status ==3 || status == 4 ? '' : 'store-adress-footer-center']">
          <view @click="openConfirm('invoice')" v-if="(status ==1 && orderDetailData.orderSkuWithMarketings[0].refundStatus != 1) || status ==3 || status == 4">
            <image src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/motorCar/navigation.png"></image>
            <text>{{ invoiceText }}</text>
          </view>
          <view style="color: #eaeaea" v-if="(status ==1 && orderDetailData.orderSkuWithMarketings[0].refundStatus != 1) || status ==3">|</view>
          <view @click="serviceTel">
            <image
              src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/motorCar/phone-icon.png"
            ></image>
            <text>联系客服</text>
          </view>
        </view>
      </view>
    </view>
    <!-- 订单信息 -->
    <view class="motor-order">
      <view class="item order-no">
        <text class="txt-1">订单编号:</text>
        <text class="txt-2">{{ orderDetailData.orderCode }}</text>
        <image
          @click="setClipboardData"
          src="@/static/img/copy.png"
          class="img_item"
        />
      </view>
      <view class="item order-no u-padding-top-22">
        <text class="txt-1">创建时间:</text>
        <text class="txt-2">{{ orderDetailData.createTime }}</text>
      </view>

      <view class="item order-no u-padding-top-22" v-if="orderDetailData.payTime">
        <text class="txt-1">付款时间:</text>
        <text class="txt-2">{{ orderDetailData.payTime }}</text>
      </view>

	  <view class="item order-no u-padding-top-22" v-if="orderDetailData.receivingTime">
        <text class="txt-1">成交时间:</text>
        <text class="txt-2">{{ orderDetailData.receivingTime }}</text>
      </view>

      <view class="item order-no" v-if="orderDetailData.remark">
        <text class="txt-1">订单备注:</text>
        <text class="txt-2">{{ orderDetailData.remark }}</text>
      </view>
    </view>

    <view class="motor-text" @click="goToLicensing">
      <view>
        <image src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/motorCar/pai.png" />
        <text>上牌说明</text>
      </view>
      <view>
        <text>自行上牌指南</text>
        <image src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/motorCar/store_right_icon.png" />
      </view>
    </view>
    <!-- 热销商品 -->
    <view
      class="applet-template-recommend u-padding-left-24 u-padding-right-24"
    >
      <wsf-goods-list
        title="hot"
        :list="flowList"
        :loadStatus="loadStatus"
        @goodsClick="goodsClick($event)"
      ></wsf-goods-list>
    </view>
    <!-- 发票服务弹框 -->
    <!-- 发票确认模块 -->
    <wsf-confirm
      v-model="showConfirm"
      :title="confirmInfo.title"
      :activeText="confirmInfo.activeText"
      :cancelText="confirmInfo.cancelText"
      @confirm="activeConfirm"
    ></wsf-confirm>
    <!-- 取消订单模块 -->
    <wsf-popup v-model="popupShow" mode="bottom" title="取消订单" height="800">
      <!-- 弹框组件 -->
      <view class="applet-cancel-order-wrap">
        <view class="applet-cancel-order-tips">
          <view class="applet-cancel-order-tips-title">温馨提示:</view>
          <view class="applet-cancel-order-tips-text"
            >订单一旦取消，无法恢复</view
          >
        </view>
        <view class="applet-cancel-order-radio">
          <view class="applet-cancel-order-radio-title"
            >请选择取消订单的原因（必选）：</view
          >
          <template v-for="(item, index) in informationList">
            <view
              class="applet-cancel-order-radio-item u-flex"
              :key="index"
              @click="selectInformation(item, index)"
            >
              <image
                v-if="cancelInformation !== item.value"
                style="margin-right: 14rpx; height: 36rpx; width: 36rpx"
                src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/prev-icon-list/cat_ns%402x.png"
                mode=""
              ></image>
              <image
                v-else
                style="margin-right: 14rpx; height: 36rpx; width: 36rpx"
                src="@/static/img/icon/Selected@2x.png"
                mode=""
              ></image>
              <text>{{ item.label }}</text>
            </view>
          </template>
          <view style="height: 370rpx; width: 100%"></view>
        </view>
      </view>
      <view class="applet-cancel-order-footer" slot="footer">
        <!--start 虚拟商品需要屏蔽-->
        <!-- <view class="applet-cancel-order-footer-switch u-flex u-row-between">
          <text class="applet-cancel-order-footer-switch-text"
            >提交后，将本单商品放回购物车中</text
          >
          <wsf-switch
            inactive-color="#DDD"
            v-model="isAddCart"
            :isShowCatSwitch="isVirtual"
          ></wsf-switch>
        </view> -->
        <!--end 虚拟商品需要屏蔽-->
        <view
          class="applet-cancel-order-footer-btn"
          :class="{ disable: cancelInformation <= 0 }"
          @click.stop="cancelOrder"
          >提交</view
        >
      </view>
    </wsf-popup>

    <!-- 回到顶部 -->
    <u-back-top
      :scroll-top="scrollTop"
      top="5000"
      :icon-style="iconStyle"
      :bottom="140"
    >
      <image
        src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/prev-icon-list/top%402x.png"
        style="width: 80rpx; height: 80rpx"
      ></image>
    </u-back-top>

    <!-- 底部按钮 -->
    <view
      class="bottom-btn"
      style="height: 100rpx"
      :class="{ needButtomSpace: isNeedBottomSpace }"
	  v-if="[1,3,4,5,6,7].includes(status)"
    ></view>
    <view
      class="bottom-btn bottom-btn-3 u-border-top"
      v-if="status == 1"
      :class="{ needButtomSpace: isNeedBottomSpace }"
    >
     <view
        class="bottom-common-cancel-btn"
        @click="openCancelPopup()"
        >取消订单</view
      >
      <view class="bottom-common-btn" @click="goToPay()">继续付款</view>
    </view>
	<view
		class="bottom-btn bottom-btn-3 u-border-top"
		v-if="titleName == '已申请退款，待商家审核'"
		:class="{ needButtomSpace: isNeedBottomSpace }"
	>
		<view class="bottom-common-btn" @click="buyAgain">重新下单</view>
	</view>
	<!-- 等待收货 -->
	<!-- <view
		class="bottom-btn bottom-btn-3 u-border-top"
		v-if="status == 3"
		:class="{ needButtomSpace: isNeedBottomSpace }"
		>

		<view class="right-btn" @click="openConfirm('receipt')">确认收货</view>
	</view> -->

	<!-- <view
		class="bottom-btn u-border-top"
		v-if="status == 4"
		:class="{ needButtomSpace: isNeedBottomSpace }"
		>
		<view class="left-btn" @click="openConfirm('delete')">删除订单</view>
		<view style="display: flex">
			<view class="right-btn" @click="buyAgain()" v-if="!isVirtual"
			>再次购买</view
			>
		</view>
	</view> -->
	<view
		class="bottom-btn u-border-top"
		v-if="status == 5 || status == 6 || status == 7"
		:class="{ needButtomSpace: isNeedBottomSpace }"
		>
		<view class="bottom-common-btn" @click="buyAgain">重新下单</view>
	</view>
	<!-- 联系门店 -->
	<motorPhone
		:motorPhoneShow="motorPhoneShow"
		@handleCloseDialog="motorPhoneShow=false"
		:mobile="mobile"
		:idNumber="orderDetailData.storeId"
		:cityCode="cityCode"
	>
	</motorPhone>

	<wsf-confirm
	v-model="discountOrderDialog"
	:isNeedTouchClose="true"
	:title="
		discountOrderType == 'cancelOrder'
		? '以下订单需一起取消'
		: '以下订单需一起付款'
	"
	:activeText="discountOrderType == 'cancelOrder' ? '取消订单' : '付款'"
	:cancelText="discountOrderType == 'cancelOrder' ? '直接买了' : '取消'"
	@confirm="discountOrderConfirm"
	@cancel="discountOrderCancel"
	@handleCloseDialog="discountOrderDialog = false"
	>
	<view class="discount-order-container">
		<view class="order-auto-box">
		<view
			class="discount-order"
			v-for="(item, index) in discountOrderData.orderList"
			:key="index"
		>
			<view class="discount-order-info">
			<view class="left-part">{{ item.storeName }}</view>
			<view class="right-part">￥{{ item.price }}</view>
			</view>
			<view class="discount-order-count"
			>(共{{ item.orderSkus && item.orderSkus.length }}件)</view
			>
		</view>
		</view>
		<view class="order-total-box">
		<span class="text">订单合计金额：</span>
		<span class="symbol">￥</span>
		<span class="price">{{ discountOrderData.totalPrice }}</span>
		</view>
	</view>
	</wsf-confirm>

	<merge-order-popup
	:show="mergeOrderPopup"
	:data="mergeOrderData"
	@close="mergeOrderPopup = false"
	></merge-order-popup>
	<!-- 福气值抵扣提示弹框 -->
	<wsf-confirm
	v-model="fqzConfirmDialog"
	title="支付确认"
	activeText="确认支付"
	cancelText="再想想"
	@confirm="handleFqzConfirm"
	@cancel="fqzConfirmDialog = false"
	>
	<view class="fqz-confirm-dialog">
		<view class="fqz-column" style="padding-bottom: 20rpx">
		福气值已抵扣
		<text class="light">：¥{{ mergeOrderData.fqzPrice.toFixed(2) }}</text>
		</view>
		<view class="fqz-column">
		仍需支付
		<text class="light"
			>：¥{{ mergeOrderData.orderFqzAmount.toFixed(2) }}</text
		>
		</view>
	</view>
	</wsf-confirm>
  </view>
</template>

<script>
import wsfNavBar from "@/components/wsf-nav-bar/wsf-nav-bar.vue";
import wsfGoodsList from "@/components/wsf-goods-list/wsf-goods-list.vue";
import { priceFilter } from "@/common/wsfFilter.js";
import MergeOrderPopup from "../../components/mergeOrderPopup/mergeOrderPopup.vue";
import { qqMap } from "@/common/config.js";
import motorPhone from "./motorPhone.vue";

export default {
  components: {
    wsfNavBar,
    wsfGoodsList,
    MergeOrderPopup,
	motorPhone
  },
  data() {
    return {
      orderStatusIconDict: {
        1: this.$oss + "wsf-mall/order/order-time-red.png",
        2: this.$oss + "wsf-mall/order/order-time.png",
        3: this.$oss + "wsf-mall/order/order-time.png",
        4: this.$oss + "wsf-mall/order/order-right.png",
        5: this.$oss + "wsf-mall/order/order-error.png",
        6: this.$oss + "wsf-mall/order/order-error.png",
        7: this.$oss + "wsf-mall/order/order-error.png",
      },
      fqzConfirmDialog: false,
      mergeOrderData: {
        orderFqzAmount: 0,
        fqzPrice: 0,
        wsOrderCode: "",
        totalAmount: "",
        orderInfoVos: [],
      },
      mergeOrderPopup: false,
      isNeedBottomSpace: getApp().globalData.isNeedBottomSpace, // 机型为iPhoneX以上
      discountOrderData: {},
      discountOrderDialog: false,
      discountOrderType: "",
      backStatus: null,
      sign: "",
      showPackUp: false,
      showConfirm: false,
      iconName: "clock",
      titleName: "等待支付",
      titleDesc: "",
      height: "444rpx",
      status: null, //订单状态 1 待付款/2 待发货/3 待收货/4 已完成/5 取消订单/6 退款通过/7 退货通过

      orderId: null, //订单Id
      showSearchBar: false, // 是否显示头部导航栏
      safePaddingHeight: 0, // 状态栏高度
      hasMore: true, // 是否拥有更多
      loadStatus: "loadmore", // 加载更多样式效果
      isLink: false, // 是否登录
      isLoading: false, // 是否正在加载
      flowList: [], // 瀑布流商品列表
      orderDetailData: {}, //订单详情数据

      confirmInfo: {
        type: "",
        title: "",
        activeText: "",
        cancelText: "",
      },
      queryForm: {
        // 页码页容量
        pageNum: 0,
        pageSize: 10,
        orderCode: "",
        pageType: 7,
      },
      scrollTop: 0,
      priceFilter,
      popupShow: false, // 弹出组件状态
      isAddCart: false, // 是否加入购物车
      cancelInformation: 0, // 取消原因ID
      informationList: [
        // {
        //   label: "地址信息填写错误",
        //   value: 1,
        // },

        {
          label: "不想要了",
          value: 2,
        },

        {
          label: "商品错选/多选",
          value: 3,
        },

        {
          label: "商品无货",
          value: 4,
        },

        {
          label: "商品降价",
          value: 5,
        },
      ],

      isShowStore: 0,
      setTimer: null, // 定时器
      timeInteval: null, // 倒计时函数
      countDown: 1800, // 倒计时
      camiloList: [],
      isOpenCamilo: true, //权益卡密收起功能
      isVirtual: false, // 虚拟商品标识
      barList: [],
	  storeItem: {
		name: '',
		distance: '',
		latitude: '',
		longitude: '',
		openEndTime: '',
		openStartTime: '',
		address: '',
		contactPhone: ''
	  }, // 附近门店
	  motorPhoneShow: false, // 联系门店弹窗
	  mobile: '',
	  cityCode: ''
    };
  },
  filters: {
    filterDistance(val) {
      if(val){
        if(val > 1000){
          return (val/1000).toFixed(1) + 'km'
        } else {
          val = String(val)
          let index = val.indexOf('.')
          if(index>-1){
            return val.slice(0, index) + 'm'
          } else {
            return val + 'm'
          }
        }
      } else {
        return ''
      }
    }
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
  onReachBottom() {
    this.GetRecommendList();
  },
  onLoad(params) {
    this.sign = params.sign;
    console.log("参数: ", params);
    this.orderId = params.orderId;
    this.backStatus = params.backStatus;

	let userInfo = uni.getStorageSync("userInfo")
	console.log(userInfo,'userInfo');
	this.mobile = userInfo.mobile
  },
  onShow() {
    this.isLink = getApp().globalData.isLink;
    this.isShowStore = getApp().globalData.wsfBaseInfo.isShowStore; // 判断商城信息
    this.safePaddingHeight = getApp().globalData.statusBarHeight;
    this.OrderDetail();
    this.setTimer = setInterval(this.OrderDetail, 60000);
  },
  computed: {
    performanceScoreTotal() {
      if (
        !this.orderDetailData ||
        !this.orderDetailData.orderSkuWithMarketings
      ) {
        return 0;
      } else {
        let list = this.orderDetailData.orderSkuWithMarketings,
          point = 0;
        list.forEach((item) => {
          if (item.performanceScore && item.performanceScore > 0) {
            let num = item.performanceScore * item.num;
            point += num;
          }
        });
        return point;
      }
    },
    isInvoiced() {
      const { invoiceFlag } = this.orderDetailData;
      //已经开票
      return invoiceFlag != 0 && invoiceFlag != null;
    },
    invoiceText() {
      return this.isInvoiced ? "查看发票" : "发票服务";
    },
  },
  watch: {
    countDown(value) {
      // console.log('秒',value);
      if (value == 0) {
        clearInterval(this.setTimer);
        clearInterval(this.timeInteval);
      }
    },
  },
  beforeDestroy() {
    clearInterval(this.setTimer);
    clearInterval(this.timeInteval);
  },
  methods: {
	QueryMotorDeliveryGoods(sendData){
  		let data = sendData;
		this.$u.api.QueryMotorDeliveryGoods(data).then((res) => {
			console.log(res,'res===================');
			if (res.code == 200) {
				this.storeItem = res.data || {}
			}
		});
	},
	getLocation() {
      let that = this;
      uni.getSystemInfo({
        success({ locationEnabled, locationAuthorized }) {
          // locationEnabled 判断手机定位服务是否开启
          // locationAuthorized 判断定位服务是否允许微信授权
          if (!locationEnabled && !locationAuthorized) {
            // GPS未开启 与 GPS未给微信授权定位服务
            that.isOpen = false;
            uni.showModal({
              title: "需要获取地理位置",
              content: "GPS已开启，GPS未给微信授权定位服务",
              showCancel: false,
            });
          } else if (locationEnabled && !locationAuthorized) {
            // GPS已开启 与 GPS未给微信授权定位服务
            that.isOpen = false;
            uni.showModal({
              title: "需要获取地理位置",
              content: "GPS已开启，GPS未给微信授权定位服务",
              showCancel: false,
            });
          } else if (locationEnabled && locationAuthorized) {
            /*
				GPS已开启 与 GPS已给微信授权定位服务
				判断微信小程序位置信息是否开启
			*/
			// 微信小程序位置信息已开启
			uni.getFuzzyLocation ({
				type: 'wgs84',
				success({ latitude, longitude }) {
					that.longitude = longitude;
					that.latitude = latitude;

					qqMap.reverseGeocoder({
						location: {
							latitude,
							longitude,
						},
						success: function (result) {
							that.cityCode = String(result.result.ad_info.adcode).slice(0,4) + '00'
							let sendData = {
								longitude,
								latitude,
								idNumber: that.orderDetailData.storeId,
								orderId: that.orderId,
							}
							that.QueryMotorDeliveryGoods(sendData);
						},
						fail: function (error) {
							console.error(error,'error');
							that.cityCode = null;
						},
					});
				},
				fail() {
					// 微信小程序位置信息未开启
					uni.getSetting({
					success: (res) => {
						let authStatus = res.authSetting["scope.userLocation"];
						if (!authStatus) {
						that.isOpen = false;
						uni.showModal({
							title: "需要获取地理位置",
							content:
							"需要获取您的位置信息，请在设置界面打开相关权限",
							success: (res) => {
								if (res.confirm) {
								uni.openSetting();
								}
							},
							showCancel: false,
						});
						} else {
						that.isOpen = false;
						uni.showModal({
							title: "获取位置信息",
							content: "无法获取位置信息",
							showCancel: false,
						});
						}
					},
					});
					// uni.showModal({
					//  title: '需要获取地理位置',
					//  content: '微信小程序位置信息未开启',
					//  showCancel: false
					// });
					// reject("weixinPositionNotOpen");
				},
				});

				// uni.authorize({
				//   scope: "scope.userLocation",
				//   success() {

				//   },
				//   fail() {
				//     // 微信小程序位置信息未开启
				//     uni.getSetting({
				//       success: (res) => {
				//         let authStatus = res.authSetting["scope.userLocation"];
				//         if (!authStatus) {
				//           that.isOpen = false;
				//           uni.showModal({
				//             title: "需要获取地理位置",
				//             content:
				//               "需要获取您的位置信息，请在设置界面打开相关权限",
				//             success: (res) => {
				//                 if (res.confirm) {
				//                   uni.openSetting();
				//                 }
				//             },
				//             showCancel: false,
				//           });
				//         } else {
				//           that.isOpen = false;
				//           uni.showModal({
				//             title: "获取位置信息",
				//             content: "无法获取位置信息",
				//             showCancel: false,
				//           });
				//         }
				//       },
				//     });
				//     // uni.showModal({
				//     //  title: '需要获取地理位置',
				//     //  content: '微信小程序位置信息未开启',
				//     //  showCancel: false
				//     // });
				//     // reject("weixinPositionNotOpen");
				//   },
				// });
          	}
        },
        fail(err) {
          let reg = /request:fail/;
          if (reg.test(err.errMsg)) {
            // 无网络
            reject("noNetWork");
          } else {
            // 请求超时'
            reject("requestTimeOut");
          }
        },
      });
    },
    openPhone() {
		this.motorPhoneShow = true
    },
    openMap() {
      uni.openLocation({
		name: this.storeItem.name,
        longitude: Number(this.longitude),
        latitude: Number(this.latitude),
        scale: 12,
        success: function () {
          console.log("success");
        },
      });
    },
    goToLicensing() {
      this.$wsf.go("Licensing");
    },
    //合并支付/取消订单 确认按钮
    discountOrderConfirm() {
      if (this.discountOrderType == "cancelOrder") {
        //取消订单 走填写取消原因逻辑
        this.discountOrderDialog = false;
        this.popupShow = true;
      } else if (this.discountOrderType == "goPayOrder") {
        //付款 跳转支付页面
        this.$wsf.go("Pay", {
          orderMoney: this.discountOrderData.totalPrice,
          orderCode: this.discountOrderData.masterOrderCode,
          businessType: 100,
          paySceneType: 101 //电商订单
        });
      }
    },
    //合并支付/取消订单 取消按钮
    discountOrderCancel() {
      if (this.discountOrderType == "cancelOrder") {
        //直接买了 跳转支付页面
        this.$wsf.go("Pay", {
          orderMoney: this.discountOrderData.totalPrice,
          orderCode: this.discountOrderData.masterOrderCode,
          businessType: 100,
          paySceneType: 101 //电商订单
        });
      } else if (this.discountOrderType == "goPayOrder") {
        //取消 关闭弹窗
        this.discountOrderDialog = false;
        this.discountOrderType = "";
        this.discountOrderData = {};
      }
    },
    //取消订单弹窗
    openCancelPopup() {
      if (this.orderDetailData.platformCouponCode) {
        this.$u.api.checkOrder(this.orderDetailData.id).then((res) => {
          this.discountOrderType = "cancelOrder";
          if (res.data && res.data.orderList.length > 0) {
            this.discountOrderData = res.data;
            this.discountOrderDialog = true;
          } else {
            this.popupShow = !this.popupShow;
          }
        });
      } else {
        this.popupShow = !this.popupShow;
      }
    },
    //筛选出商品规格
    filterSkuSpec(data) {
      let list = JSON.parse(data);
      let strList = list.map((item) => {
        return item.name + ":" + item.valueRemark;
      });
      let specName = strList.join(" ");
      return specName;
    },
    //筛选满赠活动列表
    filterGiftSku(giftskus, price, name) {
      let tempArr = giftskus.filter((el) => {
        return price >= el.fullPrice;
      });
      return tempArr.length > 0 ? tempArr[0].giftSkuInfos : [];
    },

    onBackBtnClick() {
      if (this.sign == "checkOrderPay") {
        this.$wsf.go("CheckOrderPay", {
          orderCode: this.orderDetailData.orderCode,
        });
      } else {
        uni.navigateBack();
      }
    },
    // 订单详情
    OrderDetail() {
      let that = this;
      this.$u.api.OrderDetail({ id: this.orderId }).then((res) => {
        let that = this;
        console.log(res, "订单详情数据");
        this.orderDetailData = res.data;
        this.resetList();
        this.GetRecommendList();
        // 获取定位信息查找附近门店
        this.getLocation()
        this.barList = [res.data.signContent || ""];
        // 虚拟商品卡密数据赋值
        if (this.orderDetailData.orderType == 7) {
          this.camiloList = this.orderDetailData.virtualCardKeyList;
        }
        this.isVirtual = this.orderDetailData.orderType == 7;
        let options = {},
          storeServiceConfig = that.orderDetailData.storeServiceConfig,
          tagsurl = "";
        Object.keys(storeServiceConfig).forEach((key) => {
          if (storeServiceConfig[key]) {
            if (key == "staffId") {
              options.staffid = storeServiceConfig[key];
            } else {
              options[key] = storeServiceConfig[key];
            }
          }
        });
        if (options.staffid) {
          tagsurl = `https://merchant.wsfmall.com/ordermanagement/mallorder/orderdetail?id=${that.orderDetailData.orderSkuWithMarketings[0].orderId}`;
        } else {
          tagsurl = `https://platform.wsfmall.com/ordermagamemt/storeorder/storeorderdetail?id=${that.orderDetailData.orderSkuWithMarketings[0].orderId}`;
        }
        let obj = "";
        let ysfData = {
          id: that.orderDetailData.id,
          title: `订单号: ${that.orderDetailData.orderCode}`,
          desc: that.orderDetailData.orderSkuWithMarketings[0].skuName,
          picture: that.orderDetailData.orderSkuWithMarketings[0].skuImage,
          tagsurl,
          note: `￥${that.orderDetailData.price}`,
          navigateToUrl: `/orderModule/pages/motorCarDetail/motorOrderDetail?orderId=${that.orderDetailData.id}&backStatus=${that.backStatus}`,
          ...options,
        };
        obj = JSON.stringify(ysfData);
        uni.setStorageSync("YSFDATA", obj);
        /**
         * status === 1 待付款状态
         * status === 2 待出库状态
         * status === 3 待收货状态
         * status === 4 已完成状态
         * status === 5,6,7 已取消状态
         */
        this.status = this.orderDetailData.status;
        if (this.status == 2) {
          this.iconName = "order";
          // this.titleName = res.data.backOrderLogVO&&res.data.backOrderLogVO.status == '1' ? '锁定' : '正在出库';
          let index = this.orderDetailData.orderSkuWithMarketings.findIndex(
            (item) => {
              return item.refundStatus == 1;
            }
          );
          if (index >= 0) {
            this.titleName = "已申请退款，待商家审核";
            this.titleDesc = "";
          } else {
            this.titleName = "请前往门店取车";
            this.titleDesc = "";
          }
          this.height = "312rpx";
        }
        if (this.status == 3) {
          this.iconName = "order";
          let index = this.orderDetailData.orderSkuWithMarketings.findIndex(
            (item) => {
              return item.refundStatus == 1;
            }
          );
          if (index >= 0) {
            this.titleName = "已申请退款，待商家审核";
            this.titleDesc = "";
          } else {
            this.titleName = "请前往门店取车";
            this.titleDesc = "";
          }
          this.height = "312rpx";
        }
        // 已完成
        if (this.status == 4) {
          this.titleName = "交易完成";
          this.iconName = "checkmark-circle";
          this.height = "274rpx";
        }
        if (this.status == 5 || this.status == 6 || this.status == 7) {
			this.iconName = "error-circle";
			this.titleName = "用户主动取消";
			this.height = "222rpx";
			if(this.status == 6 ){
				this.iconName = "order";
				this.titleName = "退款成功";
			}

			if(this.orderDetailData.cancelReson == "订单超时自动取消") {
				this.titleName = "超时未支付，已取消";
			}
        }

        let overtime =
          new Date(
            this.orderDetailData.createTime.replace(/-/g, "/")
          ).getTime() + 1800000;
        let time = overtime - new Date().getTime();
        this.countDown = time / 1000;
        if (this.status == 1) {
			setTimeout(
				function () {
				that.$u.api
					.CancelOrder({
						orderId: that.orderId,
						reason: "订单超时自动取消",
						addCart: false,
					})
					.then((res) => {
						this.titleName = "超时未支付，已取消";
						//   uni.navigateBack();
					});
				},
				time < 1000 ? 1000 : time
			);
        }
      });
    },
    resetList() {
      this.flowList = [];
      this.hasMore = true;
      this.loadStatus = "loadmore";
      this.queryForm = {
        // 页码页容量
        pageType: 7,
        pageNum: 0,
        pageSize: 10,
        orderCode: "",
      };
    },
    /* 获取推荐的商品列表 */
    GetRecommendList() {
      let that = this;
      if (this.isLoading || !this.hasMore) return;
      this.isLoading = true;
      this.loadStatus = "loading";
      this.queryForm.orderCode = this.orderDetailData.orderCode;
      this.$u.api.QueryRecommendCommodity(this.queryForm).then((res) => {
        this.isLoading = false;
        this.loadStatus = "loadmore";
        if (res.code === 200) {
          this.flowList = this.flowList.concat(
            res.data.map((item) => {
              item.price = this.priceFilter(item.price);
              return item;
            })
          );
          this.queryForm.pageNum++;
          this.hasMore = res.data.length === 10;
          this.loadStatus = res.data.length === 10 ? "loadmore" : "nomore";
        }
      });
    },
    showToastError(errMsg, duration = 1500) {
      uni.showToast({
        title: errMsg,
        icon: "none",
        mask: true,
        duration: duration,
      });
    },
    // 跳转店铺
    goToStore() {
      if (this.orderDetailData.storeId != 0) {
        this.$wsf.go("StoreIndex", {
          storeName: this.orderDetailData.storeName,
          storeId: this.orderDetailData.storeId,
        });
      } else {
        this.$wsf.go("Index");
      }
    },
    //加购
    handleAddCart(params) {
      console.log(params, "加入购物车");
      let { num, skuId } = params;
      let data = { num, skuId };
      data.sourceType = this.orderDetailData.sourceType;
      data.storeId = this.orderDetailData.storeId;
      this.$u.api.AddShoppingCart(data).then((res) => {
        if (res.code == 200) {
          this.showToastError("商品已加入购物车");
        }
      });
    },
    // 商品跳转
    goodsClick(e) {
		// this.$wsf.go("SkuDetail", { skuId: e.id });
	  	if(e.goodsSource == 4){
			this.$wsf.go('ToMotor',{skuId: e.id});
		} else {
			this.$wsf.go('SkuDetail', { skuId: e.id });
		}
    },
    // 前往商品详情
    goToSku(skuId) {
		this.$wsf.go('ToMotor',{skuId});
    },
    // 联系客服
    // serviceTel() {
    // 	let phoneNumber = '0755-23061865';
    // 	uni.makePhoneCall({
    // 		phoneNumber: phoneNumber
    // 	});
    // },
    // 复制到剪贴板
    setClipboardData() {
      uni.setClipboardData({ data: this.orderDetailData.orderCode });
    },
    // 跳转支付页面
    goToPay() {
      if (this.orderDetailData.platformCouponCode) {
        this.$u.api.checkOrder(this.orderDetailData.id).then((res) => {
          console.log(res, "res");
          this.discountOrderType = "goPayOrder";
          if (res.data && res.data.orderList.length > 0) {
            this.discountOrderData = res.data;
            this.discountOrderDialog = true;
          } else {
            this.$wsf.go("Pay", {
              orderMoney: this.orderDetailData.price,
              orderCode: this.orderDetailData.orderCode,
              businessType: 100,
              paySceneType: 101 //电商订单
            });
          }
        });
      } else {
        let params = {
          orderId: this.orderDetailData.id,
        };
        this.$u.api.SelectWsOrderInfoByOrderId(params).then((res) => {
          if (res.code == 200) {
            let list = res.data.orderInfoVos;
            if (list && list.length < 2) {
              if (res.data.fqzPrice && res.data.fqzPrice > 0) {
                this.mergeOrderData = res.data;
                this.mergeOrderData.orderCode = this.orderDetailData.orderCode;
                this.fqzConfirmDialog = true;
              } else {
                this.$wsf.go("Pay", {
                  orderMoney: res.data.totalAmount,
                  orderCode: this.orderDetailData.orderCode,
                  businessType: 100,
                  paySceneType: 101 //电商订单
                });
              }
            } else if (list && list.length >= 2) {
              this.mergeOrderData = res.data;
              this.mergeOrderPopup = true;
            }
          }
        });
      }
    },

    // 选择取消原因
    selectInformation(item, idx) {
      this.$nextTick(function () {
        this.cancelInformation = this.informationList[idx].value;
      });
    },
    // 申请退款
    goToRefund(item) {

      let { skuImage, skuName, price, num, id, skuPrice } = item;
	  console.log(this.orderDetailData.orderType,'orderType');
      this.$wsf.go("Refund", {
		orderType: this.orderDetailData.orderType,
        orderId: this.orderDetailData.id,
        receiptType: this.orderDetailData.status == 3 ? 1 : 0,
        skuName,
        price,
        num,
        id,
        skuPrice,
        skuImage
      });
    },
    // 退款详情
    goRefundServiceDetail(item) {
      console.log(item, "item");
      this.$wsf.go("RefundServiceDetail", { orderId: item.backOrderId });
    },
    // 取消订单
    cancelOrder() {
      if (this.cancelInformation <= 0) {
        this.$u.showToast("请选择取消原因");
        return;
      }
      // 发送请求
      let reason = this.informationList.filter((el) => {
        return el.value == this.cancelInformation;
      })[0].label;

      if (
        this.discountOrderType == "cancelOrder" &&
        this.discountOrderData.orderIdList &&
        this.discountOrderData.orderIdList.length > 0
      ) {
        let params = {
          orderIdList: this.discountOrderData.orderIdList,
          addCart: this.isAddCart,
          reason: reason,
        };
        this.$u.api.cancelOrderBatch(params).then((res) => {
          if (res.code == 200) {
            this.$u.toast("取消成功");
            this.popupShow = false;
            this.discountOrderType = "";
            this.discountOrderData = {};
            uni.navigateBack();
          } else {
            this.$u.toast(res.description);
          }
        });
      } else {
        this.$u.api
          .CancelOrder({
            orderId: this.orderId,
            reason,
            addCart: this.isAddCart,
          })
          .then((res) => {
            uni.navigateBack();
          });
        // 关闭弹窗
        this.popupShow = false;
      }
    },
    async openConfirm(type) {
      this.confirmInfo.type = type;
      if (type === "invoice") {
        const { id, price } = this.orderDetailData;
        //已经开票
        if (this.isInvoiced) {
          this.$wsf.go("orderInvoice", { orderId: id, price });
          return;
        }
        // 发票模块
        this.confirmInfo.title =
          "非自营订单的发票由商家开具，具体金额以实际开票为准。如有疑问，请联系商家。";
        this.confirmInfo.activeText = "联系商家";
        this.confirmInfo.cancelText = "取消";
      } else if (type === "delete") {
        // 删除模块
        this.confirmInfo.title = "确认删除此订单？";
        this.confirmInfo.activeText = "删除";
        this.confirmInfo.cancelText = "取消";
      } else if (type === "receipt") {
        // 收货模块
        await this.$u.api.JudgeRefund({ orderId: this.orderId }).then((res) => {
          if (res.data == 1) {
            this.confirmInfo.title = "您是否收到该订单商品？";
            this.confirmInfo.activeText = "已收货";
            this.confirmInfo.cancelText = "未收货";
          } else {
            this.confirmInfo.title =
              "订单中存在退款申请中商品，确认收货则默认撤销申请。";
            this.confirmInfo.activeText = "确认";
            this.confirmInfo.cancelText = "取消";
          }
        });
      } else if (type === "cancel") {
        // 取消申请
        this.confirmInfo.title = "确认取消退款申请？";
        this.confirmInfo.activeText = "确认";
        this.confirmInfo.cancelText = "再想想";
      }
      this.showConfirm = true;
    },
    // 弹窗确认
    activeConfirm() {
      if (this.confirmInfo.type == "invoice") {
        // 发票模块
        this.showConfirm = false;
        this.serviceTel();
        // let phoneNumber = '0755-23061865';
        // uni.makePhoneCall({
        // 	phoneNumber: phoneNumber
        // });
      } else if (this.confirmInfo.type == "delete") {
        this.$u.api
          .DeleteOrder({ orderId: this.orderDetailData.id })
          .then((res) => {
            // this.resetQueryForm();
            // this.orderList = [];
            // this.loadOrderList();
            this.$u.toast("删除成功");
            this.showConfirm = false;
            uni.navigateBack();
          });
      } else if (this.confirmInfo.type == "receipt") {
        this.$u.api
          .ConfirmReceipt({ orderId: this.orderDetailData.id })
          .then((res) => {
            // this.resetQueryForm();
            // this.orderList = [];
            // this.loadOrderList();
            this.$u.toast("确认收货成功");
            this.showConfirm = false;
            uni.navigateBack();
          });
      } else if (this.confirmInfo.type == "cancel") {
        this.$u.api
          .cancelReturn({ id: this.orderDetailData.backOrderLogVO.backOrderId })
          .then((res) => {
            this.$u.toast("取消申请成功");
            this.showConfirm = false;
            uni.navigateBack();
          });
      }
      this.showConfirm = false;
    },
    // 再次购买
    buyAgain() {
     	this.$wsf.go('ToMotor',{skuId: this.orderDetailData.orderSkuIds[0]});
    },
    // 跳转订单追踪页
    goToTrace(data, type) {
      if (this.orderDetailData.deliverGoodsMode == 2) return;
      if (type == 1) {
        if (this.status < 3 || this.status > 4) return;
        this.$wsf.go("trackingCells", {
          id: data.id,
          type: 0,
        });
      } else if (type == 2) {
        console.log(data, "item");
        this.$wsf.go("trackingCells", {
          id: data.id,
          type: 2,
        });
      }
    },
    // 跳转 取消/退款进度查询
    goToRefundDetail() {
      const queryData = {
        orderId: this.orderDetailData.id,
        orderCode: this.orderDetailData.orderCode,
        cancelTime: this.orderDetailData.cancelTime,
      };
      this.$wsf.go("RefundDetail", queryData);
    },
    // 展开收起
    openCamilo() {
      this.isOpenCamilo = !this.isOpenCamilo;
    },
    // 复制到剪贴板
    copyCamilo(txt) {
      uni.setClipboardData({
        data: txt,
      });
    },
  },
};
</script>

<style lang="scss">
@import "./motorOrderDetail.less";
.img_item {
  width: 32rpx;
  height: 32rpx;
  margin-left: -4px;
  vertical-align: middle;
}
.pending-payment {
  width: 100%;
  .content {
    width: 100%;
    .header {
      width: 100%;
      padding-bottom: 48rpx;
      background-image: url("https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/motorCar/bg.png");
      background-repeat: no-repeat;
      background-size: 100% 100%;

      text-align: center;
      .title {
        width: 100%;
        height: 112rpx;
        display: flex;
        align-items: flex-end;
        justify-content: center;
        margin-bottom: 6rpx;
        margin-top: 88rpx;
        .order-status-icon {
          width: 38rpx;
          height: 38rpx;
          margin-right: 16rpx;
        }
        .order-status-text {
          font-size: 36rpx;
          font-family: PingFangSC-Semibold, PingFang SC;
          font-weight: 600;
          color: #ffffff;
        }
      }
      .txt {
        font-size: 26rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #ffffff;
        height: 92rpx;
        text {
          font-size: 26rpx;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #ffffff;

          padding-bottom: 0;
          line-height: 34rpx;
        }
      }
    }
  }
  .address-info {
    margin-top: -20rpx;
    border-radius: 20rpx 20rpx 0 0;
    background: #f6f6f6;
    .address-info-content {
      padding: 48rpx 36rpx 0;
      width: 100%;
    }
    .store-get {
      background: #ffffff;
      border-radius: 24rpx;
      padding: 32rpx 24rpx;
      display: flex;
      width: 100%;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20rpx;
      > view {
        text:first-of-type {
          font-size: 32rpx;
          font-family: PingFangSC-Semibold, PingFang SC;
          font-weight: 600;
          color: rgba(25, 25, 25, 1);
        }
        text:last-of-type {
          font-size: 32rpx;
          font-family: PingFangSC-Semibold, PingFang SC;
          font-weight: 600;
          color: rgba(255, 10, 53, 1);
        }
      }
      > text {
        font-size: 48rpx;
        font-family: DINAlternate-Bold, DINAlternate;
        font-weight: bold;
        color: #ff0a35;
        line-height: 56rpx;
      }
    }
    .store-adress {
      background: #ffffff;
      border-radius: 24rpx;
      padding: 20rpx 24rpx;
      width: 100%;
      > text {
        font-size: 32rpx;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #191919;
        line-height: 40rpx;
        margin-bottom: 20rpx;
        display: block;
      }
      .store-adress-content {
        border-radius: 24rpx;
        border: 0.5rpx solid #ff450c;
        padding: 20rpx 24rpx;
		background: url("https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/motorCar/shop.png") 100% 100% no-repeat;
		background-size: 120rpx 120rpx;
        .store-adress-content-top {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          margin-bottom: 8rpx;
          view:first-of-type {
            font-size: 30rpx;
            font-family: PingFangSC-Semibold, PingFang SC;
            font-weight: 600;
            color: #ff450c;
            line-height: 38rpx;
          }
          view:last-of-type {
            font-size: 26rpx;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #ff450c;
            line-height: 34rpx;
          }
        }
        .store-adress-content-middle {
          font-size: 26rpx;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #999999;
          line-height: 34rpx;
          margin-bottom: 8rpx;
        }
        .store-adress-content-bottom {
          width: 470rpx;
          height: 34rpx;
          font-size: 26rpx;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #999999;
          line-height: 34rpx;
        }
      }
    }
  }
  .merchandise-news {
    background: #ffffff;
    border-radius: 20rpx;
    margin: 20rpx 24rpx;
    padding-bottom: 24rpx;
    .shop-name {
      display: flex;
      align-items: center;
      padding-bottom: 42rpx;
      image {
        margin-right: 8rpx;
      }
      .name {
        display: inline-block;
        font-weight: bold;
        max-width: 420rpx;
      }
    }
    .shop-container {
      border-bottom: 1rpx solid #f2f2f2;
      padding: 24rpx;
      &:last-child {
        border: 0;
      }
    }
    .shop-button-column {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding-top: 20rpx;
      .common-btn {
        background-color: #fff;
        padding: 0 28rpx;
        height: 60rpx;
        border-radius: 30px;
        border: 1rpx solid #666666;
        display: inline-flex;
        align-items: center;
        margin: 0 0 0 24rpx;
        color: #000;
        font-size: 24rpx;
      }
      .light-btn {
        border: 1px solid #ff0a35;
        color: #ff0a35;
      }
    }
    .shop-info {
      width: 100%;
      display: flex;
      position: relative;

      .img {
        width: 160rpx;
        height: 160rpx;
        border-radius: 19rpx;
      }
      .txt-info {
        width: calc(100% - 176rpx);
        margin-left: 16rpx;
        display: flex;
        flex-direction: column;
        justify-content: center;
        position: relative;

        .txt-1 {
          font-size: 32rpx;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #111111;
          line-height: 40rpx;
        }
        .txt-2 {
          font-size: 26rpx;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #c3c3c3;
          line-height: 34rpx;
          margin-top: 8rpx;
        }
      }
    }
    .btn-box {
      padding-top: 40rpx;
      text-align: right;
      .common_btn {
        display: inline-block;
        height: 60rpx;
        border-radius: 30rpx;
        border: 2rpx solid #666666;
        line-height: 56rpx;
        font-size: 26rpx;
        color: #000;
        padding: 0 24rpx;
      }
    }
    .service {
      display: flex;
      justify-content: center;
      align-items: center;
      line-height: 38rpx;
      text {
        margin-left: 16rpx;
        font-size: 26rpx;
        font-weight: 400;
        color: #000;
      }
    }
  }
  .motor-order {
    border-radius: 20rpx;
    margin: 20rpx 24rpx;
    background: #ffffff;
    padding: 18rpx 24rpx;
    .camilo-module {
      min-height: 32rpx;
      .camilo-name {
        float: left;
      }
      .camilo-module-miyao {
        min-height: 32rpx;
        width: 520rpx;
        float: left;
        .btn-left {
          margin-left: 10rpx;
        }
      }
      .camilo_space {
        margin-bottom: 36rpx;
        display: block;
        float: left;
        height: 34rpx;
        line-height: 34rpx;
        padding-top: 3rpx !important;
      }
      .box-open-close {
        width: 100%;
        text-align: center;
        .open {
          width: 220rpx;
        }
        .close {
          width: 106rpx;
        }
        .font {
          display: inline-block;
          height: 48rpx;
          line-height: 48rpx;
          border-radius: 30rpx;
          border: 1px solid #666;
          text-align: center;
          font-size: 24rpx;
          image {
            width: 14rpx;
            height: 8rpx;
            margin-top: -2rpx;
            margin-left: 11rpx;
            vertical-align: middle;
          }
        }
      }
    }
    .order-no {
      .txt-1 {
        font-size: 26rpx;
        font-weight: 400;
        color: #666666;
      }
      .txt-2 {
        padding: 0 24rpx;
        font-size: 26rpx;
        font-weight: 500;
        color: #000000;
      }
      .txt-btn {
        display: inline-block;
        text-align: center;
        width: 70rpx;
        height: 34rpx;
        background: #f5f5f5;
        border-radius: 18rpx;

        font-size: 22rpx;
        font-weight: 400;
        color: #000000;
        line-height: 34rpx;
      }
    }
    .order-time {
      padding-bottom: 48rpx;
      .txt-1 {
        font-size: 26rpx;
        font-weight: 400;
        color: #666666;
        padding-right: 24rpx;
      }
    }
    .price,
    .freight {
      padding-top: 36rpx;
      display: flex;
      justify-content: space-between;
      font-size: 26rpx;
      font-weight: 400;
      color: #000000;
    }
    .price {
      .txt-2 {
        font-weight: 500;
      }
    }
    .freight {
      .txt-2 {
        font-weight: 500;
      }
    }
    .payment {
      padding-top: 50rpx;
      text-align: right;
      .txt-1 {
        padding-right: 20rpx;
      }
      .txt-2 {
        font-size: 22rpx;
        font-weight: 500;
        color: #e60113;
      }
      .txt-3 {
        font-size: 36rpx;
        font-weight: 600;
        color: #e60113;
      }
    }
    .show-pack-up {
      margin: 0 auto;
      border: 1rpx solid;
      margin-top: 36rpx;
      width: 126rpx;
      height: 48rpx;
      border-radius: 48rpx;
      border: 1rpx solid #666666;
      display: flex;
      justify-content: center;
      align-items: center;
      text {
        margin-right: 12rpx;
        font-size: 24rpx;
        font-weight: 400;
        color: #000000;
      }
      /deep/ .u-icon {
        width: 24rpx;
        height: 24rpx;
      }
    }
  }
  .bottom-btn {
    z-index: 999;
    width: 100%;
    padding: 8rpx 24rpx;
    position: fixed;
    background: #ffffff;
    left: 0;
    bottom: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .bottom-common-btn{
      width:100%;
      height: 80rpx;
      background: linear-gradient(90deg, #FF5F2E 0%, #FF0A35 100%);
      border-radius: 40rpx;
      font-size: 32rpx;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #FFF9E9;
      line-height: 80rpx;
      text-align: center;

    }
    .bottom-common-cancel-btn{
      width:100%;
      height: 80rpx;
      border: 1rpx solid rgba(255, 91, 47, 1);
      border-radius: 40rpx;
      font-size: 32rpx;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #FF0D34;
      line-height: 80rpx;
      text-align: center;
      margin-right: 22rpx;
    }
    .left-btn {
      font-size: 26rpx;
      font-weight: 500;
      color: #000000;
    }
    .right-btn {
      width: 152rpx;
      height: 60rpx;
      background: #e60113;
      border-radius: 30rpx;
      line-height: 60rpx;
      text-align: center;
      font-size: 26rpx;
      font-weight: 400;
      color: #ffffff;
    }
    // .right-btn
    .right-btn-1,
    .right-btn-2 {
      width: 152rpx;
      height: 60rpx;
      background: #ffffff;
      line-height: 60rpx;
      text-align: center;
      font-size: 26rpx;
      font-weight: 400;
      color: #000;
      border: 1rpx solid #666;
      border-radius: 30rpx;
    }
  }
  .bottom-btn-3 {
    justify-content: flex-end;
  }

  // 取消订单模块
  .applet-cancel-order-wrap {
    padding: 0 36rpx 0rpx;
    .applet-cancel-order-tips {
      width: 100%;
      height: 160rpx;
      background: #f5f5f5;
      border-radius: 4px;
      padding-left: 20rpx;
      padding-top: 36rpx;
      margin-bottom: 60rpx;
      &-title {
        font-size: 26rpx;
        font-weight: 400;
        color: #000000;
        line-height: 30rpx;
        margin-bottom: 24rpx;
      }
      &-text {
        font-size: 26rpx;
        font-weight: 400;
        color: #666666;
        line-height: 36rpx;
      }
    }
    .applet-cancel-order-radio {
      &-title {
        font-size: 28rpx;
        font-weight: 500;
        color: #000000;
        line-height: 36rpx;
        margin-bottom: 26rpx;
      }
      &-item {
        height: 84rpx;
        line-height: 84rpx;
        font-size: 26rpx;
        font-weight: 400;
        color: #000000;
      }
    }
  }
  .applet-cancel-order-footer {

    &-switch {
      height: 100rpx;
      &-text {
        font-size: 26rpx;
        color: #000000;
        font-weight: 500;
      }
    }
    &-btn {
      width: 678rpx;
      height: 76rpx;
      line-height: 76rpx;
      border-radius: 38rpx;
      background-color: #e60113;
      color: #fff;
      font-size: 28rpx;
      font-weight: 500;
      text-align: center;
    }
    .disable {
      background-color: #fbd2d5;
    }
  }
  .needButtomSpace {
    padding-bottom: 18px;
  }
}
.wsf-mode-footer{
	height: auto !important;
}
.discount-order-container {
  padding: 0 36rpx;
  .order-auto-box {
    overflow-y: auto;
    height: 520rpx;
    .discount-order {
      padding-top: 40rpx;
      .discount-order-info {
        display: flex;
        justify-content: space-between;
        align-items: center;
        line-height: 48rpx;
        color: #000;
        font-size: 28rpx;
        .left-part {
          max-width: 406rpx;
        }
        .right-part {
          font-weight: 500;
        }
      }
      .discount-order-count {
        color: #666;
        line-height: 48rpx;
        font-size: 28rpx;
      }
    }
  }
  .order-total-box {
    display: flex;
    justify-content: flex-end;
    align-items: flex-end;
    padding-top: 40rpx;
    .text {
      color: #000;
      font-size: 28rpx;
      line-height: 32rpx;
    }
    .symbol {
      font-size: 22rpx;
      color: #e60113;
      font-weight: 500;
    }
    .price {
      color: #e60113;
      font-size: 36rpx;
      font-weight: 600;
      line-height: 36rpx;
    }
  }
}
.inform {
  height: 96rpx;
  background: #ffe7c0;
  color: #ffa000;
  border-radius: 20rpx 20rpx 0rpx 0rpx;
}
/deep/ .u-type-warning-light-bg {
  background-color: #ffe7c0;
  padding: 18rpx 32rpx !important;
  border-radius: 20rpx 20rpx 0rpx 0rpx;
}
.applet-template-recommend {
  padding-bottom: calc(env(safe-area-inset-bottom) + 40rpx);
}
</style>

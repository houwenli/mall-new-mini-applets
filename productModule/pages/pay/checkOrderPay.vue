<template>
  <view class="payres-contain">
    <!-- <wsf-nav-bar
      @onBackBtnClick="openModal()"
      title="支付结果"
      :hasBack="true"
      bgColor="transparent"
      class="nav-bar"
      @getNavHeight="getNavHeight"
    ></wsf-nav-bar> -->
    <smartNavBar title="支付结果" :bgimg="`${smartImg}/pay/2023-09-25/pay_header.png`" @backFunc="openModal" :isCustomBack="true" />
    <view class="payres-wraper">
      <!-- 支付结果 -->
      <view class="payres">
        <!-- 提示语 -->
        <view class="notice-box">
          <!-- <image
            class="notice-img"
          ></image> -->
          <view
            class="notice-img"
          ></view>
          <u-notice-bar
            :speed="80"
            :volume-icon="false"
            type="none"
            border-radius="24"
            padding="14rpx 16rpx 12rpx 64rpx"
            font-size="24"
            color="#444"
            bg-color="#F6F6F6"
            :list="['注意：万顺福平台不会以订单异常、系统升级为由要求您点击任何网址链接进行退款操作，如有收到此类短信，请您忽略或联系平台处理！']"
          ></u-notice-bar>
        </view>
        
        <!-- 内容 -->
        <view class="payres-content">
          <view class="payres-content__img" v-if="orderType == 'PAID'"></view>
          <view class="payres-content__img_fail" v-else></view>
          <view class="payres-content__money"  v-if="orderType == 'PAID'">
            <view class="payres-content__desc">支付成功</view> 
            <text>¥{{ money / 100 | priceFilter }}</text>
          </view>
          <view class="payres-content__desc" v-if="orderType == 'FAILED' || orderType == 'PAYING'">支付失败</view>
          <view class="payres-content__btn-wraper" :style="[btnWraperStyle]">
            <!-- 100: '电商业务', 200: '充值业务', 300: '换电业务', 400: '票务业务', 500: '酒店业务'  -->
            <view class="payres-content__btn" @click.stop="goToOrder" v-if="orderType == 'PAID' && businessType == 200 || businessType == 100">查看订单</view>
            <view v-if="businessType==100">
              <view class="payres-content__btn special" @click.stop="goPages" v-if="orderType == 'PAID'">继续逛逛</view>
              <view class="payres-content__btn special" @click.stop="goToPay" v-if="orderType == 'FAILED' || orderType == 'PAYING'">继续支付</view>
            </view>
            <view v-else-if="businessType==200">              
              <view class="payres-content__btn special" @click.stop="goNextOne">再来一笔</view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 热销商品模块 -->
		<view class="applet-template-recommend">
      <view class="header">
        <image :src="hotImg" mode="heightFix" />
      </view>
      <wsf-smart-goods-list
        v-if="flowList && flowList.length > 0"
        :list="flowList"
        :loadStatus="loadStatus"
        loadMoreBgColor="#f8f8f8"
        @goodsClick="goodsClick($event)"
      ></wsf-smart-goods-list>

			<!-- <wsf-smart-goods-list title="hot" ref="goodslist" :list="flowList" :loadStatus="loadStatus" @goodsClick="goodsClick($event)"></wsf-smart-goods-list> -->
		</view>
    <wsf-confirm
			v-model="discountGiftDialog"
			title="恭喜您获得优惠券礼包"
			:showCloseDialogBtn="true"
			activeText="立即查看"
			:isNeedTouchClose="true"
			:hideCancel="true"
			@confirm="discountGiftConfirm"
			@handleCloseDialog="handleCloseDialog()"
		>
			<view class="discount-gift-container">
				<view class="discount-gift-text">以下优惠券已发放到您的账户中</view>
				<view class="discount-gift-list">
					<view class="discount-gift-coupon" v-for="(item, index) in platformCouponCodeVoList" :key="index">
						<span class="top-round-corner"></span>
						<span class="bottom-round-corner"></span>
						<view class="stub-ticket">
							<view class="content">
								<span class="text" v-if="item.type != 2">￥</span>
								<span class="price">{{ item.type == 2 ? parseInt(item.discountRate * 100) / 10 : skuPriceInt(item.price) }}</span>
								<span class="text" v-if="item.type != 2">{{ '.' + skuPriceFloat(item.price) }}</span>
								<span class="text" v-else>折</span>
							</view>
						</view>
						<view class="main-ticket">
							<view class="content">
								<view class="title" v-if="item.type != 0">满{{ item.fullPrice }}可用</view>
								<view class="title" v-else>无门槛</view>
								<view class="cate">
									<template v-if="item.permittedType == 0">
										全平台商品可用
									</template>
									<template v-else-if="item.permittedType == 1">
										平台部分商品可用
									</template>
									<template v-else-if="item.permittedType == 2">
										限平台部分品类商品
									</template>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</wsf-confirm>
    <!-- 支付异常提醒弹窗 -->
    <wsf-confirm
      v-model="showPayErrorConfirm"
      title="支付异常提醒"
      activeText="去设置"
      :hideConfirm="true"
      cancelText="我知道了"
    >
      <view slot="context">
        <view class="pay-error-confirm-content">1.余额扣款失败，订单已取消，已付金额将予以原路退回，请您留意查收</view>
        <view>2.如还需购买，请您重新加购～</view>
      </view>
      <view slot="button" class="pay-error-confirm-button" @tap="goToOrder()">
        我知道了
      </view>
    </wsf-confirm>
  </view>
</template>

<script>
const app = getApp();
import wsfConfirm from "@/components/wsf-confirm/wsf-confirm.vue";
import wsfNavBar from "@/components/wsf-nav-bar/wsf-nav-bar.vue";
import wsfSmartGoodsList from "@/components/wsf-smart-goods-list/wsf-smart-goods-list.vue";
import { priceFilter } from '@/common/wsfFilter.js';
import { payQorderPayCheckuery, payQuery } from '@/common/smart-api/pay'
import smartNavBar from "@/components/smart/smart-nav-bar/smart-nav-bar.vue";
import {
  GetRecommendCommodity
} from "@/common/smart-api/homeApi";

export default {
  components: {
    wsfConfirm,
    wsfNavBar,
    wsfSmartGoodsList,
    smartNavBar
  },
  data() {
    return {
      smartImg: this.$smartImg,
      // 图片
      hotImg: `${this.$smartImg}/home/smart_hot_goods.png`,

      priceFilter,
      navHeight: 0, // 导航高度
      showPayErrorConfirm: false,
			discountGiftDialog: false,
		
			orderType: '', // 订单状态 PENDING-待支付 ,PAYING-支付中,PAID-已支付,CANCELED-已取消,FAILED-支付失败,TIMEOUT_CANCELED-超时已取消
			orderId: '', // 订单id
      isPaySuccess: true,
      flowList: [], // 瀑布流商品列表
      orderCode: '', // 订单编号
			loadStatus: 'loadmore', // 加载更多样式效果
			isLoading: false, // 是否正在加载
			hasMore: true, // 是否拥有更多
			queryForm: {
				// 页码页容量
				pageType: 5,
				pageNum: 0,
				pageSize: 10,
				orderCode: ''
			},
      businessType: '',// 业务类型
      platformCouponCodeVoList:[]
    };
  },
  onLoad(options) {
    this.orderCode = options.orderCode || '';
    this.businessType = options.businessType,

    // 
    this.isThirdPay = options.isThirdPay != 0;

    if (!this.isThirdPay) {
      this.money = options.orderMoney ? Number(options.orderMoney).toFixed(2) : '';
			this.orderType = options.payStatus;
    }
  },
  onShow() {
    this.isThirdPay && setTimeout(() => {
			this.loadOrderDetail();
		}, 500);
    this.resetList()
    this.GetRecommendList();
  },
  onReachBottom() {
		this.GetRecommendList();
	},
	computed: {
    btnWraperStyle() {
      return {
        marginTop: (this.isPaySuccess ? `30rpx` : `48rpx`)
      }
    }
	},
  methods: {  
    openModal(){
      uni.navigateBack({
        delta: 1,
      });
    },
    // 充值订单再来一笔
    goNextOne(){
      this.$wsf.go('phoneCharge')
    },
    goToPay(){
      this.$wsf.go('Pay', { orderMoney: this.money/100, orderCode: this.orderCode, businessType: this.businessType,
        paySceneType: 101 //电商订单
      });
    },
    // 获取导航栏高速
    getNavHeight(height) {
      this.navHeight = height
    },
    // 查询订单支付状态
		loadOrderDetail() {
      // let userInfo = uni.getStorageSync('userInfo');
			// orderPayCheck({ outTradeNo: this.orderCode, orderType: this.businessType, userId: userInfo.id }).then(res => {
      payQuery({ outTradeNo: this.orderCode }).then(res => {
				if (res.code == 200) {
					this.money = res.data.payAmount ? res.data.payAmount.toFixed(2) : '';         
					this.orderType = res.data.payStatus;
					// if(res.data.status == 5 || res.data.status == 6) {
					// 	this.showPayErrorConfirm = true
					// }
					if (res.data.platformCouponCodeVoList && res.data.platformCouponCodeVoList.length > 0) {
						this.platformCouponCodeVoList = res.data.platformCouponCodeVoList || [];
						this.discountGiftDialog = true;
					}
				}
			});
		},
    // 前往订单详情
		goToOrder() {	 
			this.$smart.go('smartOrder', { status: -1 }, 'redirectTo');
		},
		// 点击完成时的跳转
		goPages() {
			this.$smart.go('SmartIndex');	
		},
    /* 获取推荐的商品列表 */
		GetRecommendList() {
			if (this.isLoading || !this.hasMore) return;
			this.isLoading = true;
			this.loadStatus = 'loading';
			this.queryForm.orderCode = this.orderCode
			GetRecommendCommodity(this.queryForm).then(res => {
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
    resetList() {
			this.flowList = []
			this.hasMore = true
			this.loadStatus = 'loadmore'
			this.queryForm = {
				// 页码页容量
				pageType: 5,
				pageNum: 0,
				pageSize: 10
			}
		},
    // 商品跳转
		goodsClick(e) {
			console.log('e', e);
			// this.$wsf.go('SkuDetail', { skuId: e.id }, 'redirectTo');
			if(e.goodsSource == 4){			
				this.$wsf.go('ToMotor',{skuId: e.id});
			} else {
				this.$wsf.go('SkuDetail', { skuId: e.id }, 'redirectTo');
			}
		},
  },
};
</script>

<style lang="scss" scoped>
.header {
  padding: 40rpx 0 20rpx;
  display: flex;
  justify-content: center;
  image {
    height: 32rpx;
    width: 498rpx;
  }
}
.pay-contain {
  height: 100vh;
  background-color: #fff;
}
.nav-bar {
  position: fixed;
  width: 100%;
  top: 0;
}

.payres-wraper {
  .payres {
    background-image: url(https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/ws-smart-life/pay/2023-09-25/pay_results.png);
    background-size: 100% 100%;
    height: 648rpx;
    padding-top: 16rpx;
  }
  .notice-box {
    width: 686rpx;
    margin: 0 auto;
    position: relative;
  }
  .notice-img {
    width: 40rpx;
    height: 40rpx;
    // background: #EEEEEE;
    position: absolute;
    top: 10rpx;
    left: 16rpx;
    background-image: url(https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/ws-smart-life/home/smart_message.png);
    background-size: 100% 100%;
  }
  /deep/ .u-notice-bar{
    .u-direction-row{
        height: 30rpx;
        line-height: 30rpx;
    }
  }
  .payres-content {
    width: 686rpx;
    height: 470rpx;
    // background-image: url(https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/ws-smart-life/pay/payed.png);
    // background-size: 100% 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    margin: 0 auto;
  }
  .payres-content__img {
    width: 160rpx;
    height: 160rpx;
    background: #F1F1F1;
    background-image: url(https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/ws-smart-life/home/cart.gif);
    background-size: 100% 100%;
  }
  .payres-content__img_fail{
    width: 160rpx;
    height: 160rpx;
    background: #F1F1F1;
    background-image: url(https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/ws-smart-life/home/smart_fail.png);
    background-size: 100% 100%;

  }
  .payres-content__desc {
    font-size: 36rpx;
    font-weight: 600;
    color: #191919;
    line-height: 44rpx;
    margin-top: 8rpx;
  }
  .payres-content__money {
    font-size: 32rpx;
    font-family: DINAlternate-Bold, DINAlternate;
    font-weight: bold;
    color: #C3C3C3;
    line-height: 40rpx;
    margin-top: 12rpx;
    text-align: center;
  }
  .payres-content__btn-wraper {
    display: flex;
    align-items: center;
  }
  .payres-content__btn {
    width: 260rpx;
    height: 80rpx;
    background: #F6F6F6;
    border-radius: 40rpx;
    font-size: 32rpx;
    font-weight: 500;
    color: #6E6E6E;
    line-height: 80rpx;
    text-align: center;
    margin: 0 12rpx;
  }
  .payres-content__btn.special {
    background: linear-gradient(90deg, #FF8011 0%, #FE3040 100%);
    color: #ffffff;
  }
  
}
  
.pay-error-confirm-button {
  width: 208rpx;
  height: 60rpx;
  border-radius: 29rpx;
  border: 1px solid #E60113;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24rpx;
  color: #EA0213;
  font-weight: bold;
}

.pay-error-confirm-content{
  margin-bottom: 16rpx; 
  line-height: 44rpx;
}

/* 热销商品 */
.applet-template-recommend {
  margin-top: -100rpx;
  border-radius: 24rpx;
  background: #fff;
	padding: 8rpx 16rpx;
}
/deep/.u-load-more-wrap,/deep/.u-more-text{
  background: transparent !important;
}
</style>

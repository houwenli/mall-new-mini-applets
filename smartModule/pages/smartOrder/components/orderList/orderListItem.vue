<template>
  <view class="orderwrapper">
    <header class="ordertop">
      <view class="orderstatus">
        <view class="orderstatus-title">
          <image :src="businessIconUrl" class="business-title__flag" />
          <view class="business-title__word">{{ orderItem.businessTypeName }}</view>
        </view>
        <view class="orderstatus-text">
          <text>{{ orderItem.statusName }}</text>
        </view>
      </view>
    </header>
    <view class="orderbox">
      <view v-for="(bigorder, bigorderIndex) in orderList" :key="bigorderIndex">
        <view v-for="(sku, index) in bigorder.skus" :key="index">
          <view class="goodsbox">
            <view>
              <u-lazy-load
                :image="sku.skuImage"
                class="goodsimg"
                img-mode="scaleToFill"
                height="160"
                border-radius="16"
                :is-effect="false"
                @click="toOrderDetail(sku)"
                loading-img="https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/9b496c274eacdd0606e79714d08d8c1d.png"
              ></u-lazy-load>
            </view>
            <!-- 电商 -->
            <view class="goods-info" v-if="orderItem.businessType == BUSINESS_TYPE.mall">
              <view class="goods-info__top">
                <view class="info-wraper">
                  <view
                    class="goodsname u-line-2"
                    @click="toOrderDetail(sku)"
                  >
                    {{ sku.skuName }}
                  </view>
                </view>
                <view class="goodsprice">
                  ￥<text class="special">{{ sku._priceObj.int }}</text>.{{ sku._priceObj.decimal }}
                </view>
              </view>
              <view class="goods-info__bottom">
                <view class="buy-num">x{{ sku.num }}</view>
                <view class="sku-status" v-if="sku.skuStatusName">{{ sku.skuStatusName }}</view>
              </view>
            </view>
            <!-- 充值 -->
            <view class="goods-info" v-else-if="orderItem.businessType == BUSINESS_TYPE.recharge">
              <view class="goods-info__top">
                <view class="info-wraper">
                  <view
                    class="goodsname u-line-2"
                    @click="toOrderDetail(sku)"
                  >
                    {{ sku.skuName }}
                  </view>
                  <view class="charge-number">充值号码：{{ sku.rechargePhone }}</view>
                </view>
                <view class="goodsprice">
                  ￥<text class="special">{{ sku._priceObj.int }}</text>.{{ sku._priceObj.decimal }}
                </view>
              </view>
            </view>
          </view>
        </view>
        <view class="orderfooter" v-if="bigorder.btnList.length > 0">
          <view class="orderfooter-wraper">
            <text v-for="btn in bigorder.btnList" :key="btn.btnCode"
              class="common"
              :class="{evaluate: BTN_LIST[btn.eventId].style == 'red'}"
              @click.stop="() => {orderOperation('bigOrder', orderItem, bigorder, btn)}">
              {{ btn.eventName }}
            </text>
          </view>
        </view>
      </view>
    </view>

    <view class="order-time">{{createTimeText}}：{{ orderItem.createTime }}</view>
    <view class="orderfooter">
      <view class="orderfooter-wraper">
        <view v-for="btn in orderItem.btnList" :key="btn.btnCode"
          class="common"
          :class="{evaluate: BTN_LIST[btn.eventId].style =='red'}"
          @click.stop="() => {orderOperation('smartOrder', orderItem, null, btn)}">
          {{ btn.eventName }}
        </view>
      </view>
    </view>
  </view>
</template>

<script>
// import uLazyLoad from "../../../../../uview-ui/components/u-lazy-load/u-lazy-load.vue";
import { BUSINESS_TYPE, BTN_LIST, BTN_ID } from '@/common/constants/order'
import { fenToYuan, getSplitPrice } from "@/common/utils.js";

import { orderListButtonInfo } from '@/common/smart-api/orderApi';

export default {
  components: {},
  props: {
    orderItem: {
      type: Object,
      default: () => {
        return {};
      },
    },
    //状态
    status:{
      type: [String,Number],
      default: -1,
    }
  },
  filters: {
    filterFraction(val, make) {
      let len = (val + "").length;
      switch (len) {
        case 3:
        case 4:
          if (make && val == 1000) {
            val = "999+";
          } else {
            val =
              parseInt(val / Math.pow(10, len - 1)) * Math.pow(10, len - 1) +
              "+";
          }
          break;
        case 5:
        case 6:
        case 7:
          if (make) {
            val = "999+";
          } else {
            val = parseInt((val / 10000) * 10) / 10 + "万";
          }
          break;
        default:
          break;
      }
      return val;
    },
  },
  data() {
    return {
      // 常量
      BUSINESS_TYPE, BTN_LIST,

      // 页面中使用图片
      cartIcon: `${this.$smartImg}/cart/cart-icon.png`,
      chargeIcon: `${this.$smartImg}/cart/charge-icon.png`,
    };
  },
  computed: {
    //时间展示文案
    createTimeText(){
      return this.status==80?'申请时间':'下单时间'
    },
    // 业务线图片
    businessIconUrl() {
      let defIcon = ''
      let businessType = this.orderItem.businessType
      switch (businessType) {
        // 电商
        case BUSINESS_TYPE.mall:
          defIcon = this.cartIcon
          break
        // 充话费
        case BUSINESS_TYPE.recharge:
          defIcon = this.chargeIcon
          break
      }
      return this.orderItem.businessIconUrl || defIcon
    },

    // 订单列表
    orderList() {
      let { orderList } = this.orderItem;
      orderList = (orderList || []).map(bigOrder => {
        bigOrder.skus = (bigOrder.skus || []).map(sku => {
          sku._price = fenToYuan(sku.price)
          sku._priceObj = getSplitPrice(sku._price)
          sku._unitPrice = fenToYuan(sku.unitPrice)
          
          return {
            ...sku
          }
        })
        return {
          ...bigOrder
        }
      })
      
      return orderList;
    },
  },
  methods: {
    // 去评价
    goEvaluate(item) {
      let params = { orderIds: item.orderIds };
      this.$wsf.go("EvaluationCenter", params);
    },

    // 再次购买
    opeBuyAgain(item) {
      console.log(item, "sssssssssssssss");
      let list = item.skus;
      if (list && list.length) {
        let buyNowRequestList = [];
        list.forEach((n) => {
          let skuObj = {
            skuId: n.skuId,
            recommendToken: null,
            num: n.num,
            sourceType: item.sourceType,
            storeId: item.storeId,
          };
          buyNowRequestList.push(skuObj);
        });
        buyNowRequestList = JSON.stringify(buyNowRequestList);
        if (list && list.length > 1) {
          this.$smart.go("Settlement", { buyNowRequestList, cart: 1 });
        } else {
          this.$smart.go("Settlement", { buyNowRequestList });
        }
      }
    },
    // 跳转评价模块
    goToComment(item) {
      const commentData = {
        skuId: item.skuId,
        orderId: item.orderId,
        storeId: item.storeId,
        storeName: item.storeName,
        skuName: item.skuName,
        skuImage: item.skuImage,
      };
      this.$wsf.go("Comment", commentData);
    },

    // 按钮操作分为智慧生活订单和各级子业务订单
    // 根据不同情况拼装参数，请求处理接口
    orderOperation(type, smartOrder, bigOrder, btn) {
      let {eventId, eventName, eventType} = btn || {}
      // 公共参数
      let params = {
        eventId,
        eventName,
        eventType,
      }
      // 业务参数
      let businessParam = {
        orderType: smartOrder.orderType,
        orderNo: smartOrder.orderNo,
        businessOrderId: smartOrder.masterOrderCode,
      }
      // 如果是智慧生活订单的按钮
      // 目前只有支付按钮，不需要额外参数
      if (type == 'smartOrder') {
      }

      // 如果是子业务的按钮
      // 确认收货，再来一单等等
      if (type == 'bigOrder') {
        let orderList = smartOrder.orderList || []
        let orderCodes = orderList.map(item => item.orderCode)
        businessParam.orderCode = bigOrder.orderCode
        businessParam.orderSubCode = bigOrder.id
        businessParam.orderCodes = orderCodes
        if(smartOrder.orderType === 102 && eventId === 10){
            // 智慧生活订单列表orderType 102 为集采订单-再来一单支付时需要传代理商id
            uni.setStorageSync("enterpriseAgencyId", bigOrder.enterpriseId);
        }
      }

      params.businessParam = businessParam

      orderListButtonInfo(params).then(ret => {
        let data = ret.data || {}
        let { eventType, appletLink } = data
        // 这里不通用就不提出去了
        // 按钮事件类型 1:请求接口事件 2: 跳转原生deepLink 3: 跳转H5
        if (eventType == 1) {
          // 刷新页面
          this.$emit('reload')
        } else if (eventType == 4) {
          const { buttonBoxInfo } = data
          let confirmInfo = {
            ...buttonBoxInfo,
            eventType: 4,
            title: '支付确认',
            confirmText: '确认支付',
            cancelText: '再想想',
            appletLink: appletLink,
          }
          this.$emit('confirm', confirmInfo)
        } else {
          if (appletLink) {
            this.$smart.go(appletLink);
          } else {
            this.$u.toast('系统异常，请稍后重试');
          }
        }
      }).catch(err => {
        this.$u.toast('系统异常，请稍后重试');
      })
    },

    // 跳转详情
    toOrderDetail(item) {
      this.$smart.go(item.orderDeailAppletUrl);
    },
  },
};
</script>
<style lang="less" scoped>
.orderwrapper {
  width: 718rpx;
  background: #ffffff;
  border-radius: 24rpx;
  padding: 32rpx 20rpx 16rpx;
  margin: 0 auto;
  .ordertop {
  }
  .orderstatus {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .orderstatus-title {
    display: flex;
  }
  .business-title__flag {
    width: 40rpx;
    height: 40rpx;
  }
  .business-title__word {
    font-size: 32rpx;
    font-weight: 500;
    color: #191919;
    line-height: 40rpx;
    margin-left: 8rpx;
  }
  .orderstatus-text {
    font-size: 26rpx;
    font-weight: 400;
    color: #ff450c;
    line-height: 34rpx;
  }

  .orderbox {
    margin-top: 32rpx
  }
  .goodsbox {
    display: flex;
    margin-top: 24rpx;
  }
  .goodsimg {
    display: block;
    width: 160rpx;
    height: 160rpx;
    border-radius: 16rpx;
  }
  .goods-info {
    display: flex;
    justify-content: space-between;
    width: 536rpx;
    height: 160rpx;
    flex-direction: column;
    justify-content: space-between;
    margin-left: 16rpx;
  }
  .goods-info__top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    .info-wraper {
      width: 354rpx;
    }
    .goodsname {
      width: 354rpx;
      font-size: 26rpx;
      font-weight: 500;
      color: #191919;
      line-height: 34rpx;
    }
    .charge-number {
      font-size: 26rpx;
      font-weight: 400;
      color: #999999;
      line-height: 34rpx;
      margin-top: 8rpx;
    }
    .goodsprice {
      font-size: 24rpx;
      font-family: DINAlternate-Bold, DINAlternate;
      font-weight: bold;
      color: #191919;
      line-height: 40rpx;
      .special {
        font-family: DINAlternate-Bold, DINAlternate;
        font-size: 32rpx;
      }
    }
  }
  .goods-info__bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .buy-num {
      font-size: 26rpx;
      font-weight: 400;
      color: #999999;
      line-height: 34rpx;
    }
    .sku-status {
      font-size: 26rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #FFBE0C;
    }
  }

  .order-time {
    font-size: 22rpx;
    font-weight: 400;
    color: #999999;
    line-height: 30rpx;
    margin-top: 16rpx;
  }

  .orderfooter {
    margin-top: 16rpx;
  }

  .orderfooter-wraper {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    .common {
      width: 160rpx;
      height: 60rpx;
      border-radius: 30rpx;
      // box-shadow: 0 0 0 1rpx #c3c3c3;
      border: 1rpx solid #c3c3c3;
      font-size: 26rpx;
      font-weight: 400;
      color: #444444;
      line-height: 60rpx;
      text-align: center;
      margin-left: 16rpx;
      transform: rotateZ(360deg);
    }
    .evaluate {
      color: #ff450c;
      // box-shadow: 0 0 0 1rpx #ff450c;
      border-color: #ff450c;
    }
  }

  
}
</style>

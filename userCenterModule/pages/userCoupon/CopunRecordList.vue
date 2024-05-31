<template>
  <view>
    <!-- 头部tops -->
    <view class="applet-order-list-tabs">
      <view
        v-for="item in couponStatusList"
        :key="item.status"
        :class="{ 'tab-item-active': active == item.status }"
        class="list-tab-item"
        @tap="changeOrderStatus(item.status)"
      >
        <view class="tab-name">
          {{ item.name }}
        </view>
      </view>
    </view>
    <view v-if="!isLoading" class="content">
      <view class="coupon-list" v-if="pageList.length > 0">
        <p class="ticket">{{ nameMap[active] }}</p>
        <view
          class="coupon-card"
          v-for="(item, index) in pageList"
          :key="index"
        >
          <!-- 左边 商品信息 -->
          <view class="main-ticket product-padding useful-store-ticket">
            <image class="product-img" :src="item.url" />
            <view class="coupon-info">
              <view class="coupon-name">
                <text class="name">
                  {{ typeMap[1] }}
                </text>
                {{ item.commodityName }}
              </view>
              <view class="coupon-indate"
                >{{
                  $u.timeFormat(
                    new Date(
                      item.effectiveStartTime.replace(/-/g, "/")
                    ).getTime(),
                    "yyyy.mm.dd"
                  )
                }}-{{
                  $u.timeFormat(
                    new Date(
                      item.effectiveEndTime.replace(/-/g, "/")
                    ).getTime(),
                    "yyyy.mm.dd"
                  )
                }}</view
              >
            </view>
          </view>
          <!-- 右边 券详情-->
          <view
            class="stub-ticket"
            :class="[item.status == 2 ? 'right-used' : 'right-expired']"
          >
            <view class="coupon-price">
              <text class="symbol" v-if="item.couponsType != 2">￥</text>
              <text class="int-price">{{ item.faceValue / 100 }}</text>
              <text v-if="item.couponsType == 2" class="float-price">折</text>
            </view>
            <view class="coupon-condition" v-if="item.couponsType == 1"
              >满{{ item.amountLimitation / 100 }}元可用</view
            >
            <view class="coupon-condition" v-else-if="item.couponsType == 3"
              >满{{ item.faceValue / 100 }}元可用</view
            >
            <view class="coupon-condition" v-else>无门槛</view>
          </view>
        </view>
        <u-loadmore
          margin-top="20"
          ref="backTop"
          :loadText="loadText"
          bg-color="#f3f3f3"
          color="#999"
          :status="loadStatus"
        ></u-loadmore>
      </view>
      <view class="empty-module" v-else>
        <view class="empty-part">
          <image
            src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/coupon/empty.png"
          ></image>
          <p>暂无优惠券</p>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { couponStatusList } from "@/common/wsfRules.js";
export default {
  data() {
    return {
      active: 2,
      couponStatusList,
      typeMap: { 1: "平台券" },
      nameMap: { 2: "已使用", 3: "已过期" },
      loadText: {
        loadmore: "上拉加载更多",
        loading: "努力加载中",
        nomore: "没有更多数据",
      },
      loadStatus: "loadmore", // 加载更多样式效果
      isLoading: true, // 是否正在加载
      hasMore: true, // 是否拥有更多
      queryForm: {
        pageNo: 0,
        pageSize: 10,
        status: 2,
      },
      pageList: [],
    };
  },
  onShow() {
    this.reset();
  },
  onPullDownRefresh() {
    this.reset();
  },
  onReachBottom() {
    this.getUserCoupons();
  },
  methods: {
    //切换tap
    changeOrderStatus(index) {
      this.active = index;
      this.reset();
    },
    reset() {
      this.loadStatus = "loadmore";
      this.hasMore = true;
      this.queryForm = {
        pageNo: 0,
        pageSize: 10,
        status: this.active,
      };
      this.pageList = [];
      this.getUserCoupons();
    },
    getUserCoupons() {
      if (!this.hasMore) return;
      this.isLoading = true;
      this.loadStatus = "loading";
      this.$u.api.QueryUserCouponList(this.queryForm).then((res) => {
        uni.stopPullDownRefresh();
        this.isLoading = false;
        this.loadStatus = "loadmore";
        this.pageList = this.pageList.concat(res.data.list);
        this.queryForm.pageNo++;
        this.hasMore = res.data.list.length === 10;
        this.loadStatus = res.data.list.length === 10 ? "loadmore" : "nomore";
        wx.setNavigationBarTitle({ title: `优惠券(${this.pageList.length})` });
      });
    },
    goDetail(e) {
      if (e.goodsSource == 4) {
        this.$wsf.go("ToMotor", { skuId: e.skuId });
      } else {
        this.$wsf.go("SkuDetail", { skuId: e.skuId });
      }
    },
  },
};
</script>

<style scoped lang="scss">
.applet-order-list-tabs {
  position: fixed;
  top: 0;
  z-index: 999;
  display: flex;
  height: 76rpx;
  width: 100%;
  background: #ffffff;
  .list-tab-item {
    position: relative;
    padding-top: 6px;
    text-align: center;
    font-size: 26rpx;
    color: #444444;
    height: 76rpx;
    flex: 1;
  }
  .tab-item-active {
    font-weight: 600;
    color: #191919;
    font-family: PingFangSC-Medium, PingFang SC;
    &::after {
      position: absolute;
      bottom: 12rpx;
      left: 50%;
      transform: translateX(-50%);
      content: "";
      border-radius: 4rpx;
      width: 52rpx;
      height: 8rpx;
      background-image: linear-gradient(#ff5f2e, #ff0a35);
    }
  }
  .tab-name {
    position: relative;
    display: inline-block;
    font-size: 26rpx;
    color: #191919;
    line-height: 34rpx;
  }
}
.ticket {
  margin-top: 20rpx;
  font-size: 26rpx;
  color: #444444;
}
.content {
  padding: 76rpx 0 20rpx;
}
.coupon-list {
  padding: 0 24rpx;
  .coupon-card {
    position: relative;
    display: flex;
    margin-top: 20rpx;
    height: 192rpx;
    background: #fff;
    border-radius: 16rpx;
    overflow: hidden;
    .mark-img {
      width: 148rpx;
      height: 108rpx;
      position: absolute;
      right: 218rpx;
      bottom: 0;
    }
    .product-padding {
      padding: 16rpx;
    }
    .main-ticket {
      width: 510rpx;
      display: flex;
      padding: 32rpx 16rpx 24rpx;
      border-radius: 16rpx;
      border: 1rpx solid #ffffff;
      .product-img {
        width: 128rpx;
        height: 128rpx;
        border-radius: 10rpx;
        // 图片灰色兼容各类浏览器
        filter: grayscale(100%);
        -webkit-filter: grayscale(100%);
        -moz-filter: grayscale(100%);
        -ms-filter: grayscale(100%);
        -o-filter: grayscale(100%);
        filter: progid:DXImageTransform.Microsoft.BasicImage(grayscale=1);
        -webkit-filter: grayscale(1);
      }
      .coupon-info {
        margin-left: 24rpx;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        width: 318rpx;
        .coupon-name {
          height: 72rpx;
          font-size: 26rpx;
          font-weight: 600;
          line-height: 36rpx;
          color: #191919;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box; //作为弹性伸缩盒子模型显示。
          -webkit-box-orient: vertical; //设置伸缩盒子的子元素排列方式--从上到下垂直排列
          -webkit-line-clamp: 2; //显示的行
          .name {
            display: inline-block;
            margin-right: 8rpx;
            padding: 0 8rpx;
            width: 76rpx;
            height: 32rpx;
            background: #f6f6f6;
            border-radius: 16rpx;
            font-size: 20rpx;
            font-weight: 400;
            color: #6e6e6e;
          }
        }
        .coupon-indate {
          color: #999;
          font-size: 22rpx;
          line-height: 32rpx;
        }
      }
    }
    .stub-ticket {
      padding: 12rpx 0 16rpx;
      width: 192rpx;
      display: inline-flex;
      flex-direction: column;
      justify-content: center;
      border-radius: 16rpx;
      border: 1rpx solid #ffffff;
      .coupon-price {
        width: 100%;
        display: inline-flex;
        justify-content: center;
        align-items: baseline;
        color: #fff;
        line-height: 48rpx;
        .symbol {
          color: #6e6e6e;
          font-size: 32rpx;
          line-height: 40rpx;
        }
        .int-price {
          color: #6e6e6e;
          font-size: 40rpx;
          line-height: 48rpx;
          font-weight: bold;
          font-family: DINAlternate-Bold, DINAlternate;
        }
        .float-price {
          color: #6e6e6e;
          font-size: 28rpx;
          line-height: 28rpx;
        }
      }
      .coupon-condition {
        font-size: 20rpx;
        line-height: 28rpx;
        width: 100%;
        text-align: center;
        color: #6e6e6e;
      }
      .coupon-use-button {
        width: 120rpx;
        height: 40rpx;
        background: #fff;
        border-radius: 24rpx;
        line-height: 40rpx;
        text-align: center;
        margin: 0 auto;
        font-size: 24rpx;
        background: linear-gradient(270deg, #ff6518 0%, #ff0a35 99%);
        color: #ffffff;
      }
      .store-button {
        color: #fe8c02;
      }
    }
  }
}
.record {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 112rpx;
  background: #ffffff;
  padding: 16rpx 24rpx;
  box-shadow: 0rpx -4rpx 20rpx 0rpx rgba(189, 194, 204, 0.2);
  text {
    display: inline-block;
    width: 100%;
    height: 80rpx;
    line-height: 80rpx;
    text-align: center;
    border-radius: 40rpx;
    border: 2rpx solid #c3c3c3;
    font-size: 32rpx;
    font-weight: 600;
    color: #191919;
  }
}
.empty-module {
  padding: 250rpx 0;
  display: flex;
  align-items: center;
  justify-content: center;
  .empty-part {
    text-align: center;
    image {
      width: 320rpx;
      height: 320rpx;
    }
    p {
      text-align: center;
      margin-top: 16rpx;
      color: #444;
    }
  }
}
.right-used {
  background: url("https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/coupon/used.png")
    top right no-repeat !important;
  background-size: 112rpx !important;
}
.right-expired {
  background: url("https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/coupon/expired.png")
    top right no-repeat !important;
  background-size: 112rpx !important;
}
</style>

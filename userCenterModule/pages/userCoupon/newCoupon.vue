<template>
  <view>
    <view v-if="!isLoading">
      <view class="coupon-list" v-if="pageList && pageList.length">
        <p class="ticket" v-if="pageList.length > 0">
          {{ typeMap[1] }}({{ pageList.length }})
        </p>
        <block v-for="(item, index) in pageList" :key="index">
          <view class="coupon-box">
            <view
              :class="[
                'coupon-card',
                item.receiveFlag == 1 && item.expireFlag != 1
                  ? 'right-exp'
                  : '',
                item.expireFlag == 1 ? 'right-rec' : '',
              ]"
            >
              <view class="main-ticket product-padding useful-store-ticket">
                <image class="product-img" :src="item.url" />
                <view class="coupon-info">
                  <view class="coupon-name">
                    <text class="name">
                      {{ typeMap[1] }}
                    </text>
                    {{ item.commodityName }}
                  </view>
                  <view v-if="item.expireFlag == 1" class="coupon-card-time">
                    <u-count-down
                      :show-days="true"
                      :show-minutes="true"
                      :show-seconds="false"
                      separator="zh"
                      bg-color="transparent"
                      separator-size="22"
                      separator-color="#FF0A35"
                      color="#FF0A35"
                      font-size="22"
                      :timestamp="item.expireTimeSeconds"
                      @finish="reset()"
                    >
                    </u-count-down>
                    后过期
                  </view>
                  <view v-else class="coupon-indate"
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
              <view class="stub-ticket useful-product-ticket">
                <view class="coupon-price">
                  <text class="symbol" v-if="item.couponsType != 2">￥</text>
                  <text class="int-price">{{ item.faceValue / 100 }}</text>
                  <text v-if="item.couponsType == 2" class="float-price"
                    >折</text
                  >
                </view>
                <view class="coupon-condition" v-if="item.couponsType == 1"
                  >满{{ item.amountLimitation / 100 }}元可用</view
                >
                <view class="coupon-condition" v-else-if="item.couponsType == 3"
                  >满{{ item.faceValue / 100 }}元可用</view
                >
                <view class="coupon-condition" v-else>无门槛</view>
                <view class="coupon-use-button" @tap="goDetail(item)"
                  >去使用</view
                >
              </view>
            </view>
          </view>
        </block>
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
        <image
          src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/coupon/empty.png"
        ></image>
        <p>暂无优惠券</p>
      </view>
    </view>
    <view class="record">
      <text @click="goDetail('', 1)">使用记录</text>
    </view>
    <view class="footer"></view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      typeMap: { 1: "平台券" },
      loadText: {
        loadmore: "上拉加载更多",
        loading: "努力加载中",
        nomore: "我也是有底线的~",
      },
      loadStatus: "loadmore", // 加载更多样式效果
      isLoading: false, // 是否正在加载
      hasMore: true, // 是否拥有更多
      queryForm: {
        pageNo: 0,
        pageSize: 10,
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
    reset() {
      this.loadStatus = "loadmore";
      this.hasMore = true;
      this.queryForm = {
        pageNo: 0,
        pageSize: 10,
      };
      this.pageList = [];
      this.getUserCoupons();
    },
    getUserCoupons() {
      console.log(this.pageList, "this.pageList");
      if (this.isLoading || !this.hasMore) return;
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
    goDetail(e, tag) {
      // this.$wsf.go("SkuDetail", {skuId: item.skuId})
      if (tag && tag == 1) {
        this.$wsf.go("CopunRecordList");
        return;
      }
      if (e.goodsSource == 4) {
        this.$wsf.go("ToMotor", { skuId: e.skuId });
      } else {
        this.$wsf.go("SkuDetail", { skuId: e.skuId });
      }
    },
    // getFontSize(price) {
    //   if(price && Number(price > 1000)) {
    //     return '44rpx'
    //   } else if(price && Number(price > 100)) {
    //     return '56rpx'
    //   } else {
    //     return '64rpx'
    //   }
    // }
  },
};
</script>

<style scoped lang="scss">
.ticket {
  margin-top: 20rpx;
  font-size: 26rpx;
  color: #444444;
}
.coupon-list {
  margin-bottom: 96rpx;
  padding: 0 24rpx 140rpx;
  .coupon-box {
    margin-top: 20rpx;
    position: relative;
    .coupon-card {
      position: relative;
      display: flex;
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
              background: #fbeef3;
              border-radius: 16rpx;
              font-size: 20rpx;
              font-weight: 400;
              color: #ff0a35;
            }
          }
          .coupon-card-time {
            color: #ff0a35;
            font-size: 22rpx;
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
            color: #ff0a35;
            font-size: 32rpx;
            line-height: 40rpx;
          }
          .int-price {
            color: #ff0a35;
            font-size: 40rpx;
            line-height: 48rpx;
            font-weight: bold;
            font-family: DINAlternate-Bold, DINAlternate;
          }
          .float-price {
            color: #ff0a35;
            font-size: 28rpx;
            line-height: 28rpx;
          }
        }
        .coupon-condition {
          font-size: 20rpx;
          line-height: 28rpx;
          width: 100%;
          text-align: center;
          color: #999;
        }
        .coupon-use-button {
          width: 120rpx;
          height: 40rpx;
          background: #fff;
          border-radius: 24rpx;
          line-height: 40rpx;
          text-align: center;
          margin: 0 auto;
          margin-top: 16rpx;
          font-size: 24rpx;
          background: linear-gradient(270deg, #ff6518 0%, #ff0a35 99%);
          color: #ffffff;
        }
        .store-button {
          color: #fe8c02;
        }
      }
      .useful-product-ticket {
        background: linear-gradient(270deg, #ffffff 0%, #fff1f3 100%);
      }
      .useful-store-ticket {
        background: linear-gradient(270deg, #f7f8ff 0%, #fffbfb 100%);
      }
      .unuseful-stub-ticket {
        background: #999;
      }
    }
    .coupon-detail {
      background: linear-gradient(180deg, #f2f2f2 0%, #ffffff 100%);
      padding: 16rpx 36rpx;
      .default-text {
        color: #999;
        line-height: 32rpx;
        font-size: 22rpx;
        text {
          font-size: 22rpx;
        }
      }
    }
  }
  .right-rec::after {
    content: "";
    position: absolute;
    width: 40px;
    height: 40px;
    top: 0px;
    right: 0px;
    background: url("https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/coupon/overdue.png");
    background-size: 40px;
  }
  .right-exp::after {
    content: "";
    position: absolute;
    width: 40px;
    height: 40px;
    top: 0px;
    right: 0px;
    background: url("https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/coupon/new.png");
    background-size: 40px;
  }
}
.record {
  z-index: 2;
  position: fixed;
  bottom: calc(constant(safe-area-inset-bottom)); /* 兼容 iOS < 11.2 */
  bottom: calc(env(safe-area-inset-bottom));/* 兼容 iOS >= 11.2 */
  width: 100%;
  min-height: 112rpx;
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
  position: fixed;
  left: 50vw;
  top: calc(50vh - 68rpx);
  transform: translate(-50%, -50%);
  text-align: center;
  image {
    width: 320rpx;
    height: 320rpx;
  }
  p {
    margin-top: 16rpx;
    color: #444;
  }
}
.footer {
  position: fixed;
  bottom: 0;
  background: #ffffff;
  width: 100%;
  padding-bottom: calc(constant(safe-area-inset-bottom)); /* 兼容 iOS < 11.2 */
  padding-bottom: calc(env(safe-area-inset-bottom)); /* 兼容 iOS >= 11.2 */
}
</style>

<template>
  <view
    class="page"
    :style="{ background: tabIndex == 0 ? '#fff' : '#f5f5f5' }"
  >
    <view class="tabs">
      <u-tabs
        :list="tabList"
        active-color="#E60113"
        inactive-color="#000"
        font-size="32"
        height="100"
        :bar-style="{ width: '40rpx', height: '8rpx', bottom: '-6rpx' }"
        :is-scroll="false"
        :current="tabIndex"
        @change="changeTab"
      ></u-tabs>
    </view>
    <!-- 商品列表 -->
    <view class="product-container" v-show="tabIndex == 0">
      <template v-if="goodsList && goodsList.length">
        <block v-for="(item, index) in goodsList">
          <view class="product" @tap="goDetail(item)" :key="index">
            <view class="product-image">
              <u-image
                height="252rpx"
                width="252rpx"
                loading-icon="https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com//11111/f4aef8f9d91387ce0d074d378b4cc384.png?imageView2/1/w/504"
                border-radius="10rpx"
                :src="item.productUrl + '?imageView2/1/w/504'"
              ></u-image>
            </view>
            <view class="product-info">
              <view class="product-name u-line-2">{{ item.skuName }}</view>
              <view class="product-price"
                >售价 <text class="light">{{ item.price }}</text></view
              >
              <view class="product-mark">预估佣金{{ item.preCommission }}</view>
            </view>
            <button class="share-button" @tap.stop="handleShareProduct(item)">
              分享商品
            </button>
          </view>
        </block>
        <u-loadmore
          ref="backTop"
          margin-top="40"
          margin-bottom="40"
          :loadText="loadText"
          :status="loadStatus"
        ></u-loadmore>
      </template>

      <view class="empty-page" v-else>
        <image class="empty-image" :src="emptyImg"></image>
        <text class="empty-text">暂无商品</text>
      </view>
    </view>
    <!-- 订单列表 -->
    <view class="order-container" v-show="tabIndex == 1">
      <template v-if="orderList && orderList.length">
        <block v-for="(item, index) in orderList" :key='index'>
          <view class="order" :key="index">
            <view class="order-title">
              <view
                ><text class="order-code">订单号：</text>
                {{ item.distributionOrderCode }}</view
              >
              <view
                class="order-status"
                :class="{ 'dark-text': item.showStatus == 0 || item.showStatus == 5}"
                >{{ showStatusDict[item.showStatus] }}</view
              >
            </view>
            <view class="order-product">
              <view class="order-product-image">
                <u-image
                  height="160rpx"
                  width="160rpx"
                  loading-icon="https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com//11111/f4aef8f9d91387ce0d074d378b4cc384.png?imageView2/1/w/320"
                  border-radius="10rpx"
                  :src="item.skuImage + '?imageView2/1/w/320'"
                ></u-image>
              </view>
              <view class="order-product-info">
                <view class="order-product-name u-line-2">{{
                  item.skuName
                }}</view>
                <view>
                  <view class="order-product-price"
                    >商品售价：{{ item.price }}</view
                  >
                  <view class="order-product-price"
                    >预估佣金：<text class="light"
                      >{{ item.advanceCommission }}元</text
                    ></view
                  >
                </view>
                <view class="order-product-num">数量：{{ item.buyCount }}</view>
              </view>
            </view>
            <view class="button-column">
              <button class="navigate-button" @tap="navigateMiniProgram()">
                查看收益
              </button>
            </view>
          </view>
        </block>

        <u-loadmore
          ref="backTop"
          margin-top="40"
          margin-bottom="40"
          :loadText="loadText"
          :status="loadStatus"
          bg-color="#f5f5f5"
        ></u-loadmore>
      </template>

      <view class="empty-page" v-else>
        <image class="empty-image" :src="emptyImg"></image>
        <text class="empty-text">暂无订单</text>
      </view>
    </view>
    <button
      open-type="share"
      class="share-page-icon"
      v-if="tabIndex == 0 && goodsList && goodsList.length"
      @tap="handleSharePage()"
    >
      <image class="share-page-img" :src="shareIcon" />
    </button>

    <u-popup
      v-model="showShareModal"
      mode="bottom"
      border-radius="20"
      height="388rpx"
      :mask-close-able="false"
    >
      <view class="share-container">
        <view class="share-title">分享至</view>
        <view class="share-way">
          <button class="share-way-part" open-type="share">
            <image
              class="share-way-image"
              src="@/static/img/icon/WeChat@2x.png"
            ></image>
            <span>微信好友</span>
          </button>
        </view>
        <view class="cancel-btn" @tap="showShareModal = false">取消</view>
      </view>
    </u-popup>
  </view>
</template>

<script>
import { priceFilter } from "@/common/wsfFilter.js";
import shareIcon from "../../images/share_icon.png";
import shareImg from "../../images/share_img.png";
export default {
  data() {
    return {
      showShareModal: false,
      shareIcon,
      shareImg,
      emptyImg:
        "https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/bf7051fe79eb0e831298a985302ccff1.png",
      tabIndex: 0,
      tabList: [
        {
          name: "商品列表",
        },
        {
          name: "分销订单",
        },
      ],
      // 搜索的参数
      searchParam: {
        pageNum: 0, // 当前页码
        pageSize: 10, // 每页显示记录数
      },
      goodsList: [], // 分销商品列表
      orderList: [],
      loadStatus: "loadmore", // 加载更多样式效果
      isLoading: false, // 是否正在加载
      hasMore: true, // 是否拥有更多
      priceFilter,
      loadText: {
        loadmore: "",
        loading: "努力加载中",
        nomore: "我也是有底线的~",
      },
      shareParams: {
        name: '',
        image: '',
        shareType: '',
        distributionCode: ''
      },
      promoteInfo: {
        promoteId: "",
        promoteType: "",
        phone: "",
      }, //推广员信息
      showStatusDict: {
        0: '已失效',
        1: '等待收货',
        2: '已收货',
        3: '已结束',
        4: '部分退货',
        5: '已退货',
      }
    };
  },
  onLoad(option) {},
  onShow() {
    this.init();
  },
  onPullDownRefresh() {
    this.reset();
  },
  onReachBottom() {
    this.getList();
  },
  onShareAppMessage(options) {
    if (options.from === "button") {
      // 来自页面内分享按钮
      this.showShareModal = false;
      let url;
      if (this.shareParams.shareType == "product") {
        url =
          "productModule/pages/skuDetail/skuDetail?s=" +
          this.shareParams.skuId +
          "&c=" +
          this.shareParams.distributionCode;
      } else if (this.shareParams.shareType == "page") {
        url =
          "distributionModule/pages/distributionIndex/distributionList?id=" +
          this.promoteInfo.promoteId;
      }
      return {
        title: this.shareParams.name,
        imageUrl: this.shareParams.image,
        path: url,
      };
    }
  },
  methods: {
    init() {
      this.$u.api.CustomerDetail().then((res) => {
        let params = {
          userId: res.data.id,
          userPhone: res.data.mobile,
        };
        this.$u.api.QueryIsDistribution(params).then((response) => {
          if(response.data.code == 1) {
            if (
              !response.data.isDistribution ||
              response.data.isDistribution == 0
            ) {
              let info = {
                userId: res.data.id,
                userPhone: res.data.mobile,
                userName: res.data.userName,
              };
              this.$wsf.go("PromotionRegister", info, "redirectTo");
            } else {
              this.promoteInfo = {
                promoteId: response.data.promoteId,
                promoteType: response.data.promoteType,
                phone: response.data.mobile,
              }
              this.getList();
            }
          } else {
            uni.switchTab({
              url: "/pages/index/index",
            });
            setTimeout(() => {
              uni.showToast({
				      	title: response.data.msg,
				      	icon: "none"
				      })
            }, 500)
          }
        });
      });
    },
    getList() {
      if (this.tabIndex == 0) {
        this.getProductList();
      } else {
        this.getOrderList();
      }
    },
    reset() {
      this.loadStatus = "loadmore";
      this.hasMore = true;
      this.searchParam = {
        pageNum: 0,
        pageSize: 10,
      };
      if (this.tabIndex == 0) {
        this.goodsList = [];
        this.getProductList();
      } else {
        this.orderList = [];
        this.getOrderList();
      }
    },
    changeTab(e) {
      this.tabIndex = e;
      this.reset();
    },
    // 获取分销商品列表数据
    getProductList() {
      if (this.isLoading || !this.hasMore) return;
      this.isLoading = true;
      this.loadStatus = "loading";
      this.$u.api.QueryDistributionSpuList(this.searchParam).then((res) => {
        this.isLoading = false;
        uni.stopPullDownRefresh()
        if (res.code === 200) {
          this.goodsList = this.goodsList.concat(
            res.data.list.map((item) => {
              item.price = this.priceFilter(item.price);
              item.preCommission = this.priceFilter(item.preCommission);
              return item;
            })
          );
          this.searchParam.pageNum++;
          this.hasMore = res.data.list.length === 10;
          this.loadStatus = res.data.list.length === 10 ? "loadmore" : "nomore";
        }
      });
    },
    // 获取分销订单数据
    getOrderList() {
      if (this.isLoading || !this.hasMore) return;
      this.isLoading = true;
      this.loadStatus = "loading";
      this.$u.api.QueryDistributionOrderNew(this.searchParam).then((res) => {
        this.isLoading = false;
        uni.stopPullDownRefresh()
        if (res.code === 200) {
          this.orderList = this.orderList.concat(
            res.data.list.map((item) => {
              item.price = this.priceFilter(item.price);
              item.advanceCommission =
                Math.floor(item.advanceCommission * 100) / 100;
              return item;
            })
          );
          this.searchParam.pageNum++;
          this.hasMore = res.data.list.length === 10;
          this.loadStatus = res.data.list.length === 10 ? "loadmore" : "nomore";
        }
      });
    },
    async goDetail(e) {
      this.$wsf.go("distributionSkuDetail", { skuId: e.skuId, promoteType: this.promoteInfo.promoteType, phone: this.promoteInfo.phone, promoteId: this.promoteInfo.promoteId });
    },
    handleShareProduct(e) {
      this.shareParams = {
        name: `¥${e.price} | ${e.skuName}`,
        image: e.shareImage ? e.shareImage : e.productUrl,
        shareType: "product",
        skuId: e.skuId
      };
      this.getShareCode(e.spuId)
      this.showShareModal = true;
    },
    getShareCode(spuId) {
      let param = {
        spuId: spuId,
        recommendUserType: this.promoteInfo.promoteType,
        phone: this.promoteInfo.phone,
        customerId: this.promoteInfo.promoteId,
      }
      this.$u.api.ShareForDistribution(param).then(res => {
        this.shareParams.distributionCode = res.data.data
      })
    },
    navigateMiniProgram() {
      uni.navigateToMiniProgram({
        appId: "wx0d1811ba25b5aeab",
        path: "pages/index/index",
        envVersion: __wxConfig.envVersion,
      });
    },
    handleSharePage() {
      this.shareParams = {
        name: "分享赚，自购省钱，分享赚钱\r\n一键转发，货通全国",
        image: this.shareImg,
        shareType: "page",
      };
    },
  },
};
</script>

<style scoped lang="scss">
.page {
  margin-top: 100rpx;
  min-height: 100vh;
}
.tabs {
  width: 100%;
  position: fixed;
  top: 0;
  z-index: 10;
  /deep/ .u-tab-item:first-child::after {
    content: "";
    position: absolute;
    display: inline-block;
    right: 1rpx;
    top: 50%;
    transform: translateY(-50%);
    width: 2rpx;
    height: 60rpx;
    background: #f2f2f2;
  }
}

.product-container {
  padding: 24rpx;
  background-color: #fff;
  .product {
    margin-bottom: 32rpx;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    background-color: #fff;
    overflow: hidden;
    position: relative;
    .product-image {
      margin-right: 24rpx;
    }
    .product-info {
      height: 252rpx;
      display: flex;
      flex: 1;
      flex-direction: column;
      justify-content: space-between;
      align-items: flex-start;
      padding: 20rpx 0 32rpx;
      .product-name {
        min-height: 80rpx;
        margin-bottom: 40rpx;
        font-size: 28rpx;
        color: #000;
        width: 410rpx;
      }
      .product-price {
        font-size: 24rpx;
        color: #333;
        padding-bottom: 22rpx;
        .light {
          font-size: 36rpx;
          color: #e60113;
        }
      }
      .product-mark {
        padding: 0 4rpx;
        height: 32rpx;
        border-radius: 4rpx;
        border: 2rpx solid #e60113;
        font-size: 20rpx;
        line-height: 28rpx;
        color: #e60113;
        font-weight: 500;
      }
    }
    .share-button {
      position: absolute;
      right: 16rpx;
      bottom: 0;
      width: 184rpx;
      height: 64rpx;
      background: #ffb030;
      border-radius: 38rpx;
      line-height: 64rpx;
      text-align: center;
      font-weight: 500;
      font-size: 28rpx;
      color: #fff;
    }
  }
}

.order-container {
  background: #f5f5f5;
  .order {
    width: 100%;
    height: 374rpx;
    background: #fff;
    border-radius: 20rpx;
    padding-left: 36rpx;
    margin-top: 24rpx;
    .order-title {
      padding-right: 36rpx;
      height: 98rpx;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1rpx solid #f2f2f2;
      font-size: 26rpx;
      color: #000;
      .order-code {
        color: #adadad;
      }
      .order-status {
        color: #e60113;
      }
      .dark-text {
        color: #000;
      }
    }
    .order-product {
      margin-top: 24rpx;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      overflow: hidden;
      .order-product-image {
        margin-right: 24rpx;
      }
      .order-product-info {
        height: 160rpx;
        display: flex;
        flex: 1;
        flex-direction: column;
        justify-content: space-between;
        align-items: flex-start;
        .order-product-name {
          font-size: 26rpx;
          color: #000;
          width: 420rpx;
          line-height: 38rpx;
        }
        .order-product-price {
          font-size: 22rpx;
          color: #000;
          display: inline-block;
          .light {
            font-size: 22rpx;
            color: #e60113;
          }
          &:first-child {
            margin-right: 40rpx;
          }
        }

        .order-product-num {
          font-size: 22rpx;
          line-height: 26rpx;
          color: #999;
        }
      }
    }
    .button-column {
      padding: 0 36rpx;
      text-align: right;
      .navigate-button {
        display: inline-block;
        width: 184rpx;
        height: 64rpx;
        background: #e60618;
        border-radius: 38rpx;
        text-align: center;
        line-height: 64rpx;
        color: #fff;
        font-size: 28rpx;
      }
    }
  }
}

.empty-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 40%;
  .empty-image {
    width: 360rpx;
    height: 360rpx;
  }
  .empty-text {
    font-weight: 500;
    font-size: 30rpx;
    color: #999;
    margin-top: 20rpx;
    line-height: 42rpx;
  }
}

.share-page-icon {
  z-index: 999;
  position: fixed;
  right: 0;
  bottom: 160rpx;
  width: 128rpx;
  height: 128rpx;
  background: transparent;
  padding: 0;
  outline: 0;
  border: 0;
  &::after {
    border: 0;
  }
  .share-page-img {
    width: 100%;
    height: 100%;
  }
}

.share-container {
  height: 388rpx;
  .share-title {
    text-align: center;
    padding: 34rpx 0;
    color: #666;
  }
  .share-way {
    margin: 6rpx 0 40rpx;
    display: flex;
    justify-content: space-around;
    button {
      padding: 0;
      margin: 0;
      background-color: #fff;
      line-height: 24rpx;
      outline: none;
    }
    button::after {
      border: none;
    }
    .share-way-part {
      width: 96rpx;
      text-align: center;
      .share-way-image {
        width: 92rpx;
        height: 92rpx;
        margin-bottom: 24rpx;
      }
      span {
        color: #000;
        font-size: 24rpx;
      }
    }
  }
  .cancel-btn {
    border-top: 1px solid #f2f2f2;
    height: 96rpx;
    line-height: 96rpx;
    text-align: center;
    font-size: 32rpx;
    color: #000;
  }
}
</style>

<template>
  <view class="page-content">
    <view class="goods-list" v-if="goodsList && goodsList.length">
      <view
        v-for="(item, index) in goodsList"
        :key="index"
        class="goods-item"
        @click="goDetails(item)"
      >
        <image :src="item.photoUrl" class="goods-img"></image>
        <view class="goods-info">
          <view class="goods-price">
            <view class="current-price">
              <view class="current-price-icon">¥</view>
              <view class="current-price-value">
                {{
                  item.entPurchasePrice && item.entPurchasePrice.split(".")[0]
                }}.
              </view>
              <view class="current-price-icon">
                {{
                  item.entPurchasePrice && item.entPurchasePrice.split(".")[1]
                }}
              </view>
            </view>
            <view class="original-price">
              <view class="original-price-icon">¥</view>
              <view class="original-price-value">
                {{ item.wsPrice && item.wsPrice.split(".")[0] }}.
              </view>
              <view class="original-price-icon">
                {{ item.wsPrice && item.wsPrice.split(".")[1] }}
              </view>
            </view>
          </view>
          <view class="bq-list" v-if="item.labelList && item.labelList.length">
            <view
              class="bq-item"
              v-for="(tag, index) in item.labelList"
              :key="index"
            >
              {{ tag }}
            </view>
          </view>
          <view class="goods-name">
            {{ item.skuName }}
          </view>
          <view class="sales-data">
            {{ item.commentsCount | countFilters }}评论<span class="separator"
              >|</span
            >{{ item.goodsRate }}%好评<span class="separator">|</span
            >{{ item.buyCount | countFilters }}人已买
          </view>
        </view>
      </view>
      <view class="loading-text">
        <u-loadmore :status="status" />
      </view>
      <button class="share-page-icon" @tap="handleSharePage()">
        <image
          class="share-page-img"
          :src="ossUrl + 'wsf-mall/distribution/ic_WeChat.png'"
        />
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
            <button class="share-way-part" @click="getPost()">
              <image
                class="share-way-image"
                src="@/static/img/icon/pt@2x.png"
              ></image>
              <span>生成海报</span>
            </button>
          </view>
          <view class="cancel-btn" @tap="showShareModal = false">取消</view>
        </view>
      </u-popup>
    </view>
    <view class="empty-page" v-else>
      <image
        class="empty-image"
        src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsService/dian-shang-ji-cai/not_data_2X.png"
      ></image>
      <text class="empty-text">当前暂无商品，敬请期待</text>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      ossUrl: this.$oss,
      currentPage: 0,
      pageSize: 20,
      hasMore: true,
      isLoading: false,
      isEmpty: false,
      enterpriseAgencyId: "", //企业代理商ID
      goodsList: [],
      showShareModal: false,
      status: "loadmore",
    };
  },
  async onLoad(options) {
    console.log("onShow", options.scene, "2323");
    this.getList();
    if (options.scene) {
      try {
        let res = await this.$u.api.getTokenData({ token: options.scene });
        if (res.code === 200) {
          let data = JSON.parse(res.data);
          this.enterpriseAgencyId = data.enterPriseId;
          uni.setStorageSync("enterpriseAgencyId", this.enterpriseAgencyId);
        }
      } catch (error) {}
    } else {
      this.enterpriseAgencyId = uni.getStorageSync("enterpriseAgencyId");
    }
  },
  // 分享配置
  onShareAppMessage(options) {
    console.log(options);
    // 来自页面内分享按钮
    this.showShareModal = false;
    return {
      title: "全民集采，优惠享不停",
      imageUrl:
        "https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsService/dian-shang-ji-cai/wixin-haoyou-collection-share%402x.png",
      path: `collectionModule/pages/index/index?enterpriseAgencyId=${this.enterpriseAgencyId}`,
    };
  },
  onPullDownRefresh() {
    this.currentPage = 0;
    this.status = "loadmore";
    this.getList("refresh");
  },
  onReachBottom() {
    this.getList();
  },
  filters: {
    countFilters(val) {
      if (!val) {
        return "0";
      }
      if (Number(val) >= 1000) {
        return "999+";
      }
      return val;
    },
  },
  methods: {
    handleSharePage() {
      this.showShareModal = true;
    },
    async getList(type) {
      if (this.isLoading || this.status === "nomore") return;
      this.isLoading = true;
      this.status = "loading";
      this.isLoading = true;
      this.currentPage++;
      let params = {
        currentPage: this.currentPage,
        pageSize: this.pageSize,
      };
      this.$u.api
        .enterPriseGoodsList(params)
        .then((res) => {
          console.log(res, "res");
          let list = res.data.list || [];
          this.status = list.length === this.pageSize ? "loadmore" : "nomore";
          this.isLoading = false;
          list.forEach((item) => {
            item.entPurchasePrice = this.amountProcessing(
              item.entPurchasePrice
            );
            item.wsPrice = this.amountProcessing(item.wsPrice);
          });
          if (type === "refresh") {
            this.goodsList = [];
          }
          this.goodsList = this.goodsList.concat(list);
          wx.stopPullDownRefresh();
        })
        .catch((error) => {
          this.isLoading = false;
          wx.stopPullDownRefresh();
          console.error(error, "22");
        });
    },
    getPost() {
      let params = {
        scene: `id=${this.enterpriseAgencyId}`,
        page: "collectionModule/pages/index/index",
        width: 60,
        autoColor: false,
        lineColor: "",
        isHyaline: false,
      };
      this.$u.api.enterPriseGoodsCode(params).then((res) => {
        this.showShareModal = false;
        wx.downloadFile({
          url: res.data.wsSunCodeUrl,
          success: (res) => {
            uni.showShareImageMenu({
              path: res.tempFilePath,
              success: (res) => {
                if (res.errMsg == "showShareImageMenu:ok") {
                  this.$u.toast("保存成功！");
                }
              },
              fail: (res) => {
                console.log(res);
                this.$u.toast("保存失败！");
              },
            });
          },
        });
      });
    },
    amountProcessing(val) {
      if (!val) {
        return "00.00";
      }
      return Number(val).toFixed(2);
    },
    goDetails(item) {
      this.$wsf.go("collectionDetail", {
        skuId: item.skuId,
      });
    },
  },
};
</script>

<style lang="less" scoped>
.page-content {
  padding: 24rpx;
  padding-bottom: calc(
    24rpx + constant(safe-area-inset-bottom)
  ); /* 兼容 iOS < 11.2 */
  padding-bottom: calc(
    24rpx + env(safe-area-inset-bottom)
  ); /* 兼容 iOS >= 11.2 */

  .goods-list {
    overflow: scroll;
  }
  .goods-item {
    width: 702rpx;
    background: #ffffff;
    border-radius: 48rpx;
    margin-bottom: 24rpx;
    .goods-img {
      width: 702rpx;
      height: 702rpx;
      border-radius: 48rpx;
    }
    .goods-info {
      padding: 24rpx;
    }
    .goods-price {
      display: flex;
      align-items: flex-end;
    }
    .original-price,
    .current-price {
      font-family: DINAlternate-Bold, DINAlternate;
      display: flex;
      align-items: flex-end;
    }
    .original-price {
      margin-left: 6rpx;
      position: relative;
    }
    .current-price-icon {
      font-size: 32rpx;
      font-weight: bold;
      color: #e60113;
      line-height: 40rpx;
    }
    .current-price-value {
      font-size: 60rpx;
      font-weight: bold;
      color: #e60113;
      line-height: 68rpx;
    }
    .original-price-icon {
      font-size: 22rpx;
      font-weight: bold;
      color: #c3c3c3;
      line-height: 30rpx;
    }
    .original-price-value {
      font-size: 32rpx;
      font-weight: bold;
      color: #c3c3c3;
      line-height: 40rpx;
    }
    .original-price::before {
      content: "";
      height: 1px;
      background: #999999;
      width: 100%;
      position: absolute;
      top: 50%;
    }
    .bq-list {
      display: flex;
      margin-bottom: 14rpx;
    }

    .bq-item {
      border-radius: 8rpx;
      border: 2rpx solid #ff3700;
      padding: 2rpx 12rpx;
      font-size: 20rpx;
      font-weight: 400;
      color: #ff0a35;
      margin-right: 8rpx;
    }
    .goods-name {
      font-size: 32rpx;
      font-weight: 500;
      color: #111111;
      line-height: 40rpx;
      text-overflow: -o-ellipsis-lastline;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      line-clamp: 2;
      -webkit-box-orient: vertical;
      margin-bottom: 12rpx;
    }
    .sales-data {
      font-size: 22rpx;
      font-weight: 400;
      color: #999999;
      line-height: 30rpx;
    }
    .separator {
      margin: 0px 3px 0px 3px;
      color: #c3c3c3;
    }
  }
  .share-page-icon {
    z-index: 999;
    position: fixed;
    right: 12rpx;
    bottom: 260rpx;
    width: 134rpx;
    height: 134rpx;
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
      margin-bottom: 40rpx;
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
}
</style>

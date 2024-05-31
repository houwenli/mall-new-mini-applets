<template>
  <view class="page-content">
    <view v-if="spu">
      <!-- 头部 -->
      <header-top
        :topSearch="topSearch"
        :showHeader="showHeader"
        @changeTab="changeTab"
        :tabIndex="tabIndex"
        :isShare="isShare"
        id="tabsBox"
        ref="headerBox"
      ></header-top>
      <view
        id="product"
        ref="product"
        :style="{ paddingTop: statusBarHeight + 'px' }"
      >
        <!-- 商品轮播图 -->
        <swiper-list
          :carousel-pics="carouselPics"
          :spu="spu"
          :sku="sku"
          :skuImgList="skuImgList"
          @updateSku="updateSku"
        ></swiper-list>

        <!-- 商品名称等信息 -->
        <goods-info :sku="sku" :shopState="spu.shopState"></goods-info>

        <!-- 商品规格地址选项 -->
        <goods-options
          ref="goodOptions"
          :spu="spu"
          :sku="sku"
          :skuId="skuId"
          :skuNum="skuNum"
          @openShowBase="openShowBase"
        ></goods-options>
      </view>
      <!-- 商品详情-商品介绍 -->
      <view class="module-detail" ref="detailBox" id="detailBox">
        <!-- 规格参数 -->
        <view class="treasure">
          <view class="flex-treasure">
            <img
              src="https://wsjc-web.wsecar.com/wsf-mall/skuDetail/left-icon.png"
              alt=""
            />
            <span>宝贝详情</span>
            <img
              src="https://wsjc-web.wsecar.com/wsf-mall/skuDetail/right-icon.png"
              alt=""
            />
          </view>
        </view>
        <overview-module
          :sku="sku"
          :spu="spu"
          @goToTop="goToTop"
        ></overview-module>
        <specifications-module :spu="spu"></specifications-module>
      </view>

      <!-- 评价 -->
      <view class="module-evaluate" ref="commentBox" id="commentBox">
        <comment-module
          ref="commentUnit"
          :skuId="skuId"
          :spuId="spu.spuId"
          :commentTotal="spu.count.allCommentCount"
          :goodRate="spu.goodsRate"
          :commentList="spu.feedback"
        ></comment-module>
      </view>

      <view class="bottom-box">
        <view
          class="gift-product-tip"
          :class="{ 'gift-product-tip-bottom': isNeedBottomSpace }"
          v-if="spu.shopState === 2"
        >
          抱歉，该商品已下架
        </view>
        <view class="bottom-button">
          <view class="share-box" @click="serviceShare()">
            <img
              class="share-icon"
              src="https://wsjc-web.wsecar.com/wsf-mall/skuDetail/icon-share.png"
              alt=""
            />
            <span class="share-text">分享</span>
          </view>
          <!-- :class="{ 'bug-now': canBuyNow, 'btn-grey': true }" -->
          <view
            class="buy-btn"
            :class="{ 'btn-grey': spu.shopState !== 0 }"
            @click="openShowBase()"
            >立即购买</view
          >
        </view>
      </view>
    </view>
    <view class="emtpy-page" v-else>
      <image
        class="emtpy-page-img"
        src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/main-packages/isEmpty-icon/cart.png"
        mode=""
      ></image>
      <view class="emtpy-page-text">哇呜，商品链接已失效〜</view>
      <view class="emtpy-page-btn" @click="goIndex">看看其他</view>
    </view>
    <!-- 返回顶部 -->
    <view
      class="feature-tabs"
      :class="{ 'feature-tabs-space': isNeedBottomSpace }"
    >
      <view class="btn-top" v-if="showReturnTop" @click="backTop">
        <img
          src="https://wsjc-web.wsecar.com/wsf-mall/skuDetail/icon-roff.png"
          alt=""
        />
        <span>顶部</span>
      </view>
    </view>
    <!-- 商品规格弹窗 -->
    <goods-specifications-dialog
      v-if="sku"
      ref="skuDialog"
      :spu="spu"
      :sku="sku"
      :skuData="skuData"
      :skuNum="skuNum"
      @skuSelected="skuSelected"
      @updateSku="updateSku"
      @changeskuNum="changeskuNum"
    ></goods-specifications-dialog>
    <share-popup ref="sharePopup" :sku="sku" v-if="sku"></share-popup>
  </view>
</template>

<script>
import headerTop from "../../components/headerTop.vue";
import swiperList from "../../components/swiper.vue";
import goodsInfo from "../../components/goodsInfo.vue";
import goodsOptions from "../../components/goodsOptions";
import goodsSpecificationsDialog from "../../components/goodsSpecificationsDialog.vue";
import overviewModule from "../../components/overviewModule.vue";
import specificationsModule from "../../components/specificationsModule.vue";
import commentModule from "../../components/commentModule.vue";
import sharePopup from "../../components/sharePopup.vue";
export default {
  components: {
    headerTop,
    swiperList,
    goodsInfo,
    goodsOptions,
    goodsSpecificationsDialog,
    overviewModule,
    specificationsModule,
    commentModule,
    sharePopup,
  },
  data() {
    return {
      isShare: false,
      skuData: {},
      sku: {}, //当前选中的sku
      spu: {},
      skuId: null,
      skuNum: 1,
      enterpriseAgencyId: "", //企业代理商ID，通过云办公分享带过来
      topBox: "",
      commentBox: "",
      showReturnTop: false,
      carouselPics: [], // 轮播图
      showHeader: false,
      scrollTop: 0,
      tabIndex: 0,
      topSearch: false, // 头部背景颜色
      statusBarHeight: 0, //状态栏高度
    };
  },
  async onLoad(options) {
    console.log(options, "options");
    this.statusBarHeight = uni.getSystemInfoSync().statusBarHeight;
    if (options.scene) {
      // options.scene存在说明是扫码进，太阳码携带的参数需要通过请求接口得到
      this.isShare = true;
      try {
        let res = await this.$u.api.getTokenData({ token: options.scene });
        if (res.code === 200) {
          let data = JSON.parse(res.data);
          this.skuId = data.skuId;
          this.enterpriseAgencyId = data.enterPriseId;
          uni.setStorageSync("enterpriseAgencyId", this.enterpriseAgencyId);
        }
      } catch (error) {}
    } else {
      // 否则就是从集采列表、或者订单详情进入
      this.isShare = options.enterpriseAgencyId ? true : false;
      this.enterpriseAgencyId = uni.getStorageSync("enterpriseAgencyId");
      this.skuId = options.skuId;
    }
    this.getSpudetail();
  },
  onShareAppMessage(options) {
    console.log("onShareAppMessage---options- : ", options);
    let that = this;
    let url = `collectionModule/pages/skuDetail/skuDetail?skuId=${that.skuId}&enterpriseAgencyId=${that.enterpriseAgencyId}`;
    let titleName = that.sku.entPurchasePrice + "元 | " + that.sku.skuName;
    console.log("that.enterpriseAgencyId", that.enterpriseAgencyId);
    return {
      title: titleName,
      desc: that.sku.subTitle,
      imageUrl: that.spu.shareImage
        ? that.spu.shareImage
        : that.sku.skuImages[0],
      path: url,
    };
  },
  onPageScroll(e) {
    this.scrollTop = e.scrollTop;
    if (this.scrollTop > 100) {
      this.topSearch = true;
      this.showHeader = true;
    } else {
      this.topSearch = false;
      this.showHeader = false;
    }
    // 监听页面滚动--tabs对应切换
    this.$u.debounce(this.setBoxTop, 300);
    if (this.scrollTop > 2500) {
      this.showReturnTop = true;
    } else {
      this.showReturnTop = false;
    }
  },
  computed: {
    skuImgList() {
      let list = (this.spu && this.spu.list) || [];
      return list
        .filter((item) => item.skuState === 0)
        .map((item) => {
          return {
            url: item.url,
            skuId: item.id,
          };
        });
    },
  },
  methods: {
    // 切换sku
    updateSku(skuId) {
      this.skuId = skuId;
      this.sku = this.spu.skuList.find((item) => {
        return item.skuId === skuId;
      });
      this.skuNum = this.sku.entPurchaseNum;
      this.setCarouselPics();
    },
    setCarouselPics() {
      //设置轮播图片
      if (this.sku.skuImages) {
        this.carouselPics = this.sku.skuImages.map((image) => {
          image = image.split("?")[0];
          let imgUrl = image.split("/");
          let img = imgUrl.join("/");
          img += "?imageView2/1/w/750";
          return { img };
        });
      }
      //若有视频，则获取sku第一张作为封面
      if (this.spu.spuVideo) {
        let spuVideoPic = this.carouselPics[0] || "";
        this.carouselPics.unshift(spuVideoPic);
      }
    },
    // 切换分类
    changeTab(item) {
      this.tabIndex = item.id;
      let name = "#" + item.mark;
      this.$u.debounce(() => {
        uni
          .createSelectorQuery()
          .select(name)
          .boundingClientRect((data) => {
            uni.pageScrollTo({
              duration: 300, //过渡时间必须为0，uniapp bug，否则运行到手机会报错
              scrollTop: data.top + this.scrollTop - this.topBox - 8, //滚动到实际距离是元素距离顶部的距离减去最外层盒子的滚动距离
            });
          })
          .exec();
      }, 300);
    },
    //返回顶部
    backTop() {
      uni.pageScrollTo({
        duration: 300,
        scrollTop: 0,
      });
      this.tabIndex = 0;
    },
    // 监听滚轮
    setBoxTop() {
      uni
        .createSelectorQuery()
        .in(this.$refs.headerBox)
        .select("#tabsBox")
        .boundingClientRect((data) => {
          this.topBox = data.height + data.top;
        })
        .exec();
      uni
        .createSelectorQuery()
        .select("#detailBox")
        .boundingClientRect((data) => {
          this.detailBox = Number.parseInt(data.top - this.topBox);
          if (this.commentBox > 0 && this.detailBox > -data.height) {
            if (this.detailBox <= 30) {
              this.tabIndex = 1;
            } else {
              this.tabIndex = 0;
            }
          }
        })
        .exec();
      uni
        .createSelectorQuery()
        .select("#commentBox")
        .boundingClientRect((data) => {
          this.commentBox = Number.parseInt(data.top - this.topBox);
          if (this.commentBox <= 30) {
            this.tabIndex = 2;
          }
        })
        .exec();
    },
    getSpudetail() {
      let params = {
        skuId: this.skuId,
      };
      this.$u.api
        .enterPriseGoodsDetail(params)
        .then((res) => {
          if (res.code === 200) {
            this.spu = res.data;
            //   if (this.res.anwserCode.code === 1) {
            //     this.spu = this.res.data;
            this.$nextTick(() => {
              this.$refs.skuDialog && this.$refs.skuDialog.initData();
            });
            this.getSkuData();
          } else {
            this.spu = null;
          }
        })
        .catch((error) => {
          this.spu = null;
        });
    },
    //获取默认选中的sku
    getSkuData() {
      this.spu.skuList = this.spu.list.map((item, index) => {
        return {
          ...this.spu.skuList[index],
          ...item,
        };
      });
      let sku = this.spu.skuList.find((item) => item.id === this.skuId);
      if (sku.skuState !== 0) {
        // 从列表进来的skuId状态为不正常时，取正常状态sku价格最低的
        let normalSkuList = this.spu.skuList.filter(
          (item) => item.skuState === 0
        );
        //找到当前选中的sku,默认为价格最低的sku，后端已排序，直接取
        if (normalSkuList.length !== 0) {
          sku = normalSkuList[0];
        }
      }
      this.sku = sku;
      this.skuId = sku.skuId;

      //当前选中的sku的初始数量--也就是集采最低数量
      this.skuNum = this.sku.entPurchaseNum;

      //设置轮播图
      this.setCarouselPics();
    },
    goToTop() {
      uni.pageScrollTo({
        duration: 300,
        scrollTop: this.overviewHeight + 10,
      });
    },
    changeskuNum(num) {
      this.skuNum = num;
      this.$nextTick(() => {
        this.$refs.goodOptions.selectFreight();
      });
    },
    serviceShare() {
      this.$refs.sharePopup.openShareModal();
    },
    // 显示规格值弹窗
    openShowBase() {
      if (this.spu.shopState !== 0) {
        return;
      }
      this.$refs.skuDialog.open();
    },
    goIndex() {
      this.$wsf.go("collectionIndex", {}, "redirectTo");
    },
  },
};
</script>

<style lang="scss" scoped>
.page-content {
  padding-bottom: calc(120rpx + constant(safe-area-inset-bottom));
  /*兼容 IOS<11.2*/
  padding-bottom: calc(120rpx + env(safe-area-inset-bottom));
  position: relative;
  .header-tabs-wrap {
    z-index: 98;
    position: fixed;
    top: -1000rpx;
    left: 0;
    right: 0;
    height: 76rpx;
    background-color: #fff;
    width: 100%;
    box-shadow: 0rpx 8rpx 20rpx 0rpx rgba(217, 217, 217, 0.15);
    .header-tabs {
      width: 100%;
      display: flex;
      height: 76rpx;
      padding: 0 68rpx;
      padding-top: 12rpx;
      justify-content: space-between;
    }
    .tabs {
      font-size: 26rpx;
      color: #444444;
      display: flex;
      flex-direction: column;
      align-items: center;
      &.active {
        font-weight: bold;
        color: #191919;
      }
      img {
        width: 54rpx;
        height: 8rpx;
        padding-top: 8rpx;
      }
    }
  }
  .module-detail {
    margin-top: 40rpx;
    .treasure {
      display: flex;
      justify-content: center;
      margin-bottom: 20rpx;
      .flex-treasure {
        display: flex;
        align-items: center;
        span {
          font-size: 32rpx;
          font-weight: 600;
          color: #191919;
        }
        img {
          width: 38rpx;
          height: 10rpx;
          display: inline-block;
          padding: 0 6rpx;
        }
      }
    }
  }

  .bottom-box {
    width: 100%;
    position: fixed;
    bottom: 0;
    left: 0;
  }
  .gift-product-tip {
    width: 100%;
    height: 80rpx;
    background: #000;
    opacity: 0.7;
    z-index: 999;
    text-align: center;
    line-height: 80rpx;
    color: #fff;
  }
  .bottom-button {
    padding: 10rpx 24rpx;
    padding-bottom: calc(10rpx + constant(safe-area-inset-bottom));
    /*兼容 IOS<11.2*/
    padding-bottom: calc(10px + env(safe-area-inset-bottom));

    width: 100%;
    display: flex;
    background: #ffffff;
    align-items: center;
    .share-box {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 96rpx;
    }
    .share-icon {
      width: 40rpx;
      height: 40rpx;
    }
    .share-text {
      font-size: 20rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #666666;
      line-height: 28rpx;
      text-shadow: 0px 0px 20px rgba(0, 0, 0, 0.1);
    }
    .buy-btn {
      width: 602rpx;
      height: 80rpx;
      background: linear-gradient(90deg, #ff5f2e 0%, #ff0a35 100%);
      box-shadow: 0rpx 0rpx 20rpx 0rpx rgba(0, 0, 0, 0.1);
      border-radius: 40rpx;
      text-align: center;
      padding: 20rpx 0rpx;
      font-size: 32rpx;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #fff9e9;
      line-height: 40rpx;
      text-shadow: 0px 0px 20px rgba(0, 0, 0, 0.1);
    }
    .btn-grey {
      box-shadow: none;
      background: #f2f2f2;
      color: #bababa;
    }
  }
  .emtpy-page {
    display: flex;
    align-items: center;
    flex-direction: column;
    padding-top: 140rpx;
    &-img {
      width: 180rpx;
      height: 180rpx;
    }
    &-text {
      font-size: 28rpx;
      color: #999;
      line-height: 40rpx;
      margin: 12rpx 0 30rpx;
    }
    &-btn {
      width: 180rpx;
      height: 60rpx;
      border-radius: 40rpx;
      border: 2rpx solid #666;
      color: #000;
      font-size: 28rpx;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

  .feature-tabs {
    position: fixed;
    z-index: 9;
    right: 0;
    bottom: 226rpx;
    width: 112rpx;
    .feature-tabs-space {
      bottom: 266rpx;
    }
    .btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 80rpx;
      height: 80rpx;
      border-radius: 50%;
      background: #4c4c4c;
      position: relative;
    }
    .btn-top {
      width: 80rpx;
      height: 80rpx;
      background: #191919;
      border-radius: 40rpx;
      opacity: 0.8;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      margin-top: 24rpx;
      img {
        width: 28rpx;
        height: 36rpx;
      }
      span {
        font-size: 22rpx;
        color: #ffffff;
      }
    }
  }
}
</style>

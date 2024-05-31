<template>

  <view class="container safe-area-inset-bottom" v-if="!noDetail" >
    <!-- 头部导航 -->
    <back-top :topSearch="topSearch" :to="recommendToken && recommendToken != 'null' ? 'Distribution' : ''" :isShare="isShare"></back-top>
    <!-- 头部tab栏 -->
    <view
      class="header-tabs-wrap"
      :style="{'top': showHeader ? barHeight : '-1000rpx'}"
      id="tabsBox"
    >
      <view class="header-tabs">
        <block v-for="(item, index) in tabList" :key="index">
          <view
            class="tabs"
            :class="{ active: tabIndex == item.id }"
            @click="changeTab(item)"
          >
            <span>{{ item.name }}</span>
            <img v-if="tabIndex == item.id" src="https://wsjc-web.wsecar.com/wsf-mall/skuDetail/icon-subscript.png" alt="">
          </view>
        </block>
      </view>
    </view>
    <!-- 返回顶部 -->
    <view class="feature-tabs" :class="{ 'feature-tabs-space': isNeedBottomSpace }">
    <!-- 分销商品!recommendToken不展示购物车 -->
      <view v-if="!recommendToken" class="cart-data">
        <view class="cart" @click="goCart">
          <img src="https://wsjc-web.wsecar.com/wsf-mall/skuDetail/icon-cart.png" alt="">
          <view class="num-cart" :style="{
            background: numCartBackground,
            'background-size': '100% 100%'
          }">{{shoppingCartCount>99?shoppingCartCount+'+':shoppingCartCount}}</view>
        </view>
      </view>
      <view class="btn-top" v-if="showReturnTop" @click="backTop">
        <img src="https://wsjc-web.wsecar.com/wsf-mall/skuDetail/icon-roff.png" alt="">
        <span>顶部</span>
      </view>
    </view>
    <!-- 商品基本信息 -->
    <view id="product" class="module-base" ref="product" :style="{ 'paddingTop': statusBarHeight + 'px'}">
      <base-module
        ref="baseUnit"
        :marketingVos="marketingVos"
        :timestamp="timestamp"
        :bestCoupon="bestCoupon"
        :skuData="skuDetail"
        :isMark="favourite"
        :sourceType="sourceType"
        @changeAttention="favouriteGood"
        @restDetails="restDetails"
				:recommendToken="recommendToken"
        :couponIds="couponIds"
        :skuId="skuId"
      ></base-module>
    </view>
    <!-- 优惠券 -->
    <!-- 在 productModule/pages/skuDetail/components/baseModule.vue 通过ref打开这个组件的 -->
    <coupon-module
      ref="couponUnit"
      @callback="couponSureCallback"
      haveActivity="true"
    ></coupon-module>
    <!-- 规格运费 -->
    <view class="module-evaluate">
      <spec-module
        ref="specUnit"
        :couponList="storeCouponList"
        :skuId="skuId"
        :timestamp="timestamp"
        :skuData="skuDetail"
        :marketingVos="marketingVos"
        :recommendToken="recommendToken"
        :saveLimitNum="saveLimitNum"
        :sourceType="sourceType"
        @restDetails="restDetails"
        @updateSku="updatePage"
        @loadCartCount="loadShoppingCartCount"
        @commitBestCoupn="getBestCoupn"
        @minusBlur="minusBlur"
        @minus="minusFun"
        @plus="plusFun"
        :sendActiveImg="sendActiveImg"
      ></spec-module>
    </view>
    <!-- 店铺 Todo 店铺入口隐藏-->
    <view v-if="isShowStore > 0" class="module-card"
      ><store-module :skuData="skuDetail" @goStore="toStoreIndex"></store-module
    ></view>
    <!-- 商品详情 -->
    <view class="module-detail" ref="detailBox" id="detailBox">
      <!-- 规格参数 -->
      <view class="treasure">
        <view class="flex-treasure">
          <img :src="`${smartImg}/detail/2023-09-25/left-icon.png`" alt="">
          <span>宝贝详情</span>
          <img :src="`${smartImg}/detail/2023-09-25/right-icon.png`" alt="">
        </view>
      </view>
      <overview-module :skuData="skuDetail" @goToTop="goToTop"></overview-module>
      <param-module :skuData="skuDetail"></param-module>
    </view>
    <!-- 评价 -->
    <view class="module-evaluate" ref="commentBox" id="commentBox">
      <comment-module ref="commentUnit" :skuId="skuId"></comment-module>
    </view>
    <!-- 热销商品 -->
    <view
      class="module-goods-list"
      ref="recommendBox"
      id="recommendBox"
    >
      <view class="goodsTitle"><img :src="`${smartImg}/home/smart_hot_goods.png`" alt=""></view>
      <wsf-goods-list
        loadMoreScene="detail"
        :list="flowList"
        :loadStatus="loadStatus"
        @goodsClick="goodsClick($event)"
      ></wsf-goods-list>
      <view style="height: 110rpx"></view>
    </view>
    <view
      class="gift-product-tip"
      :class="{ 'gift-product-tip-bottom': isNeedBottomSpace }"
      v-if="skuDetail.shelvesStatus == 0 || skuDetail.shelvesStatus == 2"
    >
      抱歉，该商品已下架
    </view>
    <view
      class="gift-product-tip"
      :class="{ 'gift-product-tip-bottom': isNeedBottomSpace }"
      v-else-if="skuDetail.isGift == 1"
      >抱歉，该商品为赠品不支持单独购买</view
    >
    <view style="height:50rpx"></view>
    <view
      class="bottom-column u-flex"
    >
      <view class="common-btn" @click="toStoreIndex()" v-if="isShowStore > 0">
        <u-icon size="36" name="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/prev-icon-list/Shop%402x.png"></u-icon>
        <p>店铺</p>
      </view>
      <view class="service-btn" @click="serviceTel({tit:'商品'})">
        <img src="https://wsjc-web.wsecar.com/wsf-mall/skuDetail/icon-service.png" alt="">
        <p>客服</p>
      </view>
      <view class="service-btn" @click="serviceShare()" v-if="sourceType != 2">
        <img src="https://wsjc-web.wsecar.com/wsf-mall/skuDetail/icon-share.png" alt="">
        <p>分享</p>
      </view>
      <template
        v-if="skuDetail.shelvesStatus == 0 || skuDetail.shelvesStatus == 2"
      >
      <!-- 分销商品!recommendToken不展示购物车 -->
        <view
          v-if="!recommendToken && !promoteId && isVirtual == 0"
          class="column-btn"
          :class="{ 'add-cart': canAddCart, 'btn-grey-border': true }"
          >加入购物车</view
        >
        <view
          class="column-btn"
          :class="{ 'bug-now': canBuyNow, 'btn-grey': true }"
          ><span>立即购买</span></view
        >
      </template>
      <template v-else-if="skuDetail.sellOut == 1">
        <view class="column-btn to-similar-btn" @click="toSimilarPage">查看相似商品</view>
        <view class="column-btn to-notice-btn" @click="toGetNoticePage">到货通知</view>
      </template>
      <template v-else>
        <!-- 分销商品!recommendToken不展示购物车 -->
        <view
          v-if="!recommendToken && !promoteId && isVirtual == 0"
          class="column-btn"
          :class="{ 'add-cart': canAddCart, 'btn-grey-border': !canAddCart }"
          @click="addCart(2)"
          >加入购物车</view
        >
        <view
          class="column-btn"
          :class="{ 'bug-now': canBuyNow, 'btn-grey': !canBuyNow }"
          @click="bugNow(1)"
        >
          <span v-if="!bestCoupon || bestCoupon.isReceive == 1">立即购买</span>
          <view v-else class="u-text-center">
            <p>领券购买</p>
            <p class="u-font-12">
              券后￥{{
                bestCoupon.type == 1
                  ? (skuDetail.price - bestCoupon.couponFull.price).toFixed(2)
                  : skuDetail.price
              }}
            </p>
          </view>
        </view>
      </template>
    </view>
    <view class="footer-bottom-space" v-if="isNeedBottomSpace"></view>
    <u-popup
      v-model="showShareModal"
      mode="bottom"
      border-radius="20"
      height="388rpx"
      @close="cancelShare"
    >
      <view class="share-container">
        <view class="share-title">分享至</view>
        <view class="share-way" v-if="shareColumn == 1">
          <button class="share-way-part" @click="clickFun" open-type="share">
            <image
              class="share-way-image"
              src="@/static/img/icon/WeChat@2x.png"
            ></image>
            <span>微信好友</span>
          </button>
          <button class="share-way-part" @click="handleShareWay(2)">
            <image
              class="share-way-image"
              src="@/static/img/icon/pt@2x.png"
            ></image>
            <span>生成海报</span>
          </button>
        </view>
        <view class="cancel-btn" @click="cancelShare">取消</view>
      </view>
    </u-popup>
    <r-canvas ref="rCanvas"></r-canvas>
    <view class="share-poster-mask" v-if="showPost" @touchmove.stop="stopTouch">
      <view class="share-poster-container">
        <view class="close-btn" @click="closePost"
          ><image :src="closeImg" mode=""></image
        ></view>
        <image :src="canvasPostImg"></image>
        <view class="save-btn" @click="savePost">保存图片</view>
      </view>
    </view>
  </view>
	<view class="" v-else>
		<view class="emtpy-page">
			<image class="emtpy-page-img" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/main-packages/isEmpty-icon/cart.png" mode=""></image>
			<view class="emtpy-page-text">哇呜，商品链接已失效〜</view>
			<view class="emtpy-page-btn" @click="goIndex">看看其他</view>
		</view>
	</view>

</template>

<script>
const app = getApp();
import baseModule from "./components/baseModule.vue";
import specModule from "./components/specModule.vue";
import commentModule from "./components/commentModule.vue";
import storeModule from "./components/storeModule.vue";
import overviewModule from "./components/overviewModule.vue";
import paramModule from "./components/paramModule.vue";
// import couponModule from "./components/couponModule.vue";
import couponModule from "@/components/coupon-popup/coupon-popup.vue";
import wsfGoodsList from "@/components/wsf-goods-list/wsf-goods-list.vue";
import { priceFilter } from "@/common/wsfFilter.js";
import {visit} from '@/common/visit.js'
import backTop from "@/components/backTop.vue";
import httpInterceptor from "@/common/http.interceptor.js";
import { writeFile, removeSave } from "@/common/uploadFile.js";
import closeImg from "@/static/img/icon/close_white@2x.png";
import { pathToBase64 } from "@/components/r-canvas/image-tools/index.js";
export default {
  components: {
    baseModule,
    specModule,
    commentModule,
    storeModule,
    overviewModule,
    paramModule,
    wsfGoodsList,
    couponModule,
    backTop
  },
  data() {
    return {
      smartImg:this.$smartImg,
      isVirtual: 0,
      timestamp: {},
      marketingVos: [],
      isNeedBottomSpace: getApp().globalData.isNeedBottomSpace,
      bestCoupon: null,
      recommendToken: null,
      storeCouponList: [],
      shoppingCartCount: 0,
      priceFilter,
      showHeader: false,
      tabIndex: 0,
      tabList: [
        {
          id: 0,
          name: "商品",
          mark: "product",
        },
        {
          id: 1,
          name: "详情",
          mark: "detailBox",
        },
        {
          id: 2,
          name: "评论",
          mark: "commentBox",
        },
        {
          id: 3,
          name: "推荐",
          mark: "recommendBox",
        },
      ],
      favourite: false,
      skuDetail: {},
      queryForm: {
        // 页码页容量
        skuId: '',
        pageType: 2,
        pageNum: 0,
        pageSize: 10,
      },
      recommendSku: [],
      skuId: null,
      spuId: null,
      scrollTop: 0,
      canAddCart: true,
      canBuyNow: true,
      addressId: 1,
      flowList: [],
      loadStatus: "loadmore", // 加载更多样式效果
      isLoading: false, // 是否正在加载
      hasMore: true, // 是否拥有更多
      isShowStore: 0,
      active: 0, // 判断是否是从秒杀列表进入 0:普通商品,13:秒杀商品
      startTime: null,
      accountArr: [],
      showShareModal: false,
      topBox: "",
      commentBox: "",
      detailBox: "",
      recommendBox: "",
      tabsBox: "",
      saveLimitNum: 1,
			showReturnTop:false,
			noDetail:false,
      agencyStoreId: "", //实体店id
      sourceType: 1, //商品来源: 1:商城, 2: 实体店
      storeIdNumber: "",
      topSearch: false, // 头部背景颜色
      showPost: false,
      shareColumn: -1,
      shareQrcode: null,
      filePostImg: null,
      closeImg: closeImg,
      canvasPostImg: null,
      barHeight: '0px',
      options:{},
      couponIds: [],
      promoteId: null,
      cartSkuId: '',  // 商品详情页进去购物车页面需要选中
      isShare: false, // 是否是分享出去的商品
      sendActiveImg: '',
      statusBarHeight: 0 //状态栏高度
    };
  },
  computed: {
    numCartBackground() {
      return `url(https://wsjc-web.wsecar.com/wsf-mall/skuDetail/cart-num${this.shoppingCartCount<=9?'1':this.shoppingCartCount<=99?'2':'3'}.png) no-repeat`
    }
  },
  onShareAppMessage(options) {
    console.log("onShareAppMessage--- options- : ", options);
    let that = this;
    if (options.from === "button") {
      this.showShareModal = false;
      // 来自页面内分享按钮
    }
    let url = `productModule/pages/skuDetail/skuDetail?skuId=${that.skuDetail.id}&c=${that.recommendToken}&s=${that.skuId}`;
		let titleName;
		if (that.skuDetail.marketingVos&& that.skuDetail.marketingVos.length > 0) {
			let typeData = that.skuDetail.marketingVos.map(temp => {
				return temp.type
			})
			console.log("typeData-----------------",typeData)
			if (typeData.includes('13')) {

				that.skuDetail.marketingVos.map(item=> {
					console.log("item.startTime-----------------",item.startTime)
					let startTime = new Date(item.startTime).getTime()
					let nowDate = new Date().getTime()
					if (startTime <= nowDate) {
						titleName = "快抢光了！【仅售" + that.skuDetail.price + "元】" +  that.skuDetail.name
					} else {
						titleName =  that.skuDetail.price.toFixed(2) + "元 | " +  that.skuDetail.name
					}
				})
			} else if(typeData.includes('1')) {
				// let fallPrice = that.skuDetail.marketingVos.map(item=> {
				that.skuDetail.marketingVos.map(item=> {
					// return item.fall.price
					titleName = "直降" + item.fall.price + "元 | " +  that.skuDetail.name
				})
			} else if(typeData.includes('16')) {
				titleName = "大家都在买【仅售" + that.skuDetail.price + "元】" +  that.skuDetail.name
			}
		} else {
			titleName =  that.skuDetail.price.toFixed(2) + "元 | " +  that.skuDetail.name
		}
		console.log("titleName",titleName)
    return {
      // title: that.skuDetail.name,
      title: titleName,
      desc: that.skuDetail.subTitle,
      imageUrl: that.skuDetail.shareImage ?that.skuDetail.shareImage: that.skuDetail.images[0],
      path: url,
    };
  },
  onShareTimeline(options) {
    console.log("shareApp options- : ", options);
    let that = this;
    if (options.from === "button") {
      this.showShareModal = false;
      // 来自页面内分享按钮
    }
    let url = "productModule/pages/skuDetail/skuDetail?skuId=" + that.skuDetail.id;
		let titleName;
		if (that.skuDetail.marketingVos&& that.skuDetail.marketingVos.length > 0) {
			let typeData = that.skuDetail.marketingVos.map(temp => {
				return temp.type
			})
			console.log("typeData-----------------",typeData)
			if (typeData.includes('13')) {

				that.skuDetail.marketingVos.map(item=> {
					console.log("item.startTime-----------------",item.startTime)
					let startTime = new Date(item.startTime).getTime()
					let nowDate = new Date().getTime()
					if (startTime <= nowDate) {
						titleName = "快抢光了！【仅售" + that.skuDetail.price + "元】" +  that.skuDetail.name
					} else {
						titleName =  that.skuDetail.price.toFixed(2) + "元 | " +  that.skuDetail.name
					}
				})
			} else if(typeData.includes('1')) {
				// let fallPrice = that.skuDetail.marketingVos.map(item=> {
				that.skuDetail.marketingVos.map(item=> {
					// return item.fall.price
					titleName = "直降" + item.fall.price + "元 | " +  that.skuDetail.name
				})
			} else if(typeData.includes('16')) {
				titleName = "【仅售" + that.skuDetail.price + "元】" +  that.skuDetail.name
			}
		} else {
			titleName =  that.skuDetail.price.toFixed(2) + "元 | " +  that.skuDetail.name
		}
		console.log("titleName",titleName)
    return {
      // title: that.skuDetail.name,
      title: titleName,
      desc: that.skuDetail.subTitle,
      imageUrl: that.skuDetail.shareImage ?that.skuDetail.shareImage: that.skuDetail.images[0],
      path: url,
    };
  },
  onLoad(option) {
    let { height, top } = getApp().globalData.capsule
    this.statusBarHeight = uni.getSystemInfoSync().statusBarHeight;
    this.barHeight = (top * 2 - this.statusBarHeight + height ) + 'px'

    let that = this;
    that.options = option
    console.log("URL-------option", option);

    if(option.sourceType) {
      //有商品来源
      this.sourceType = option.sourceType
    } else {
      this.sourceType = 1
    }

    if(option.agencyStoreId) {
      //有实体店铺id  扫码进入用
      this.agencyStoreId = option.agencyStoreId
      this.sourceType = 2
    }

    if(option.promoteId && !option.c) {
      this.promoteId = option.promoteId
      this.getPromoteInfo()
    }

    if(option.storeIdNumber) {
      //有实体店idNumber 列表的实体店商品
      this.storeIdNumber = option.storeIdNumber
    }

    if (option.scene) {
      // let scene = decodeURIComponent(option.scene)
      let scene = option.scene;
      console.log(scene, "scene");
      if (scene.constructor === Object) {
        console.log("是对象");
        this.skuId = scene.s || scene.skuId;
        if (scene.c) {
          this.recommendToken = scene.c;
        }
      } else {
        this.isShare = true
        scene = decodeURIComponent(option.scene);
        console.log(scene, "字符串scene");
        if (scene.indexOf("skuId") != -1) {
          console.log("字符串，只有skuID");
          let skuId = scene.split("skuId=")[1];
          this.skuId = skuId;
          console.log(skuId, "skuId");
        } else if (scene.indexOf("s=") != -1) {
          console.log("字符串，有分销码");
          let sceneS = scene.substring(
            scene.indexOf("s=") + 2,
            scene.lastIndexOf("&")
          );
          let sceneC = scene.split("c=")[1];
          this.recommendToken = sceneC;
          this.skuId = sceneS;
          console.log(sceneS, "sceneS");
        } else if (scene.indexOf("n=") != -1) {

          let sceneN = scene.substring(
            scene.indexOf("n=") + 2,
            scene.lastIndexOf("&")
          );
          let sceneC = scene.split("c=")[1];
          this.recommendToken = sceneC;
          // this = sceneS;


          this.sceneN = sceneN
          return
        }
        if(scene.indexOf("a=") != -1) {
          //有实体店铺id
          let sceneA = scene.split("a=")[1];
          this.agencyStoreId = sceneA;
          this.sourceType = 2
        }
      }
    } else {
      this.skuId = option.s || option.skuId;
      this.spuId = option.spuId
      if (option.s && option.c)  {
        this.recommendToken = option.c;
      }
    }
    if (option.s){
      this.isShare = true
    }

    if (option.active == 13) {
      this.active = option.active;
      console.log(option.startTime, "option.startTime");
      this.startTime = option.startTime;
    }
    uni
      .createSelectorQuery()
      .select("#detailBox")
      .boundingClientRect((data) => {
        this.overviewHeight = data.top
      })
      .exec();

    // 详情点击埋点
    this.$u.api.detailsVisit({
      skuId: this.skuId
    })
  },
  onShow() {
    this.isShowStore = getApp().globalData.wsfBaseInfo.isShowStore; // 判断商城信息
    if (this.active == 13) {
      //秒杀详情接口
      // this.startTime = option.startTime
      // this.startTime = new Date().getTime();
      this.QueryspuSeckillsceneDetail();
    } else if(this.sceneN) {
      this.getSkuId(this.sceneN)
    }
     else {
      //普通详情接口
      this.querySkuDetail();
    }
  },
  onPageScroll(e) {
    this.scrollTop = e.scrollTop;
    if (this.scrollTop > 100) {
      this.topSearch = true
      this.showHeader = true;
    } else {
      this.topSearch = false
      this.showHeader = false;
    }
    // 监听页面滚动--tabs对应切换   节流
    this.$u.debounce(this.setBoxTop, 300);
    if (this.scrollTop > 2500) {
			this.showReturnTop = true
		} else {
			this.showReturnTop = false
		}
  },
  onReachBottom() {
    this.getRecommendList();
  },
  methods: {
    //去首页
    goIndex() {
      this.$wsf.go("SmartIndex");
    },
    goToTop () {
      uni.pageScrollTo({
        duration: 300,
        scrollTop: this.overviewHeight + 10,
      });
    },
    // 到货通知
    toGetNoticePage() {
      this.$wsf.go("NoticePage",{
        spuId: this.skuDetail.spuId
      });
    },
    toSimilarPage() {
      this.$wsf.go("SimilarPage",{
        skuId: this.skuId,
        price: this.skuDetail.price,
        title: this.skuDetail.name,
        url: this.skuDetail.sku.url
      });
    },
    //获取优惠券
    getBestCoupn(obj) {
      this.bestCoupon = obj;
    },
    // 失焦时触发
    minusBlur(data, limitAddNum) {
      let obj = {
        isIgnoreCartNum: true,
        buyNowRequestList: [
          {
            num: data.num,
            skuId: data.skuId,
            storeId: this.skuDetail.storeId,
            sourceType: this.sourceType,
          },
        ],
      };
      let inputNum = data.num;
      this.CheckSkuPanicBuyLimitNum(obj, limitAddNum, inputNum);
    },
    // 步进器-
    minusFun(data,limitAddNum) {
      let obj = {
        isIgnoreCartNum: data.isIgnore,
        buyNowRequestList: [
          {
            num: data.num,
            skuId: data.skuId,
            storeId: this.skuDetail.storeId,
            sourceType: this.sourceType,
          },
        ],
      };
      let inputNum = data.num;
      this.CheckSkuPanicBuyLimitNum(obj, limitAddNum, inputNum);
    },
    // 步进器+
    plusFun(data,limitAddNum) {
      let obj = {
        isIgnoreCartNum: data.isIgnore,
        buyNowRequestList: [
          {
            num: data.num,
            skuId: data.skuId,
            storeId: this.skuDetail.storeId,
            sourceType: this.sourceType,
          },
        ],
      };
      let inputNum = data.num;
      this.CheckSkuPanicBuyLimitNum(obj, limitAddNum, inputNum);
    },
    //更新页面
    updatePage(skuId) {
      this.skuId = skuId;
      if (this.active == 13) {
        this.QueryspuSeckillsceneDetail();
      } else {
        this.querySkuDetail();
      }
    },
    //返回顶部
    backTop() {
      uni.pageScrollTo({
        duration: 300,
        scrollTop: 0,
      });
      this.tabIndex = 0;
    },
    // 切换分类
    changeTab(item) {
      this.tabIndex = item.id;
      let name = "#" + item.mark;
      let top = this.topBox;
      this.$u.debounce(() => {
        console.log(name, top, '===name, top---');
        uni
        .createSelectorQuery()
        .select(name)
        .boundingClientRect((data) => {
          console.log("目标节点盒子"+name, data, '滚动位置scroTop：', data.top + this.scrollTop - this.topBox - 8, this.scrollTop)
          //目标节点
          // uni
          //   .createSelectorQuery()
          //   .select(".container")
          //   .boundingClientRect((res) => {
          //     console.log("最外层盒子container", res , this.scrollTop)
          //     //最外层盒子节点
          //     uni.pageScrollTo({
          //       duration: 300, //过渡时间必须为0，uniapp bug，否则运行到手机会报错
          //       scrollTop: data.top - res.top - this.topBox - 8, //滚动到实际距离是元素距离顶部的距离减去最外层盒子的滚动距离
          //     });
          //   })
          //   .exec();
          uni.pageScrollTo({
            duration: 300, //过渡时间必须为0，uniapp bug，否则运行到手机会报错
            scrollTop: data.top + this.scrollTop - this.topBox - 8, //滚动到实际距离是元素距离顶部的距离减去最外层盒子的滚动距离
          });
        })
        .exec();
      }, 300)
    },
    // 秒杀详情数据接口
    QueryspuSeckillsceneDetail() {
      let that = this;
      let data = {
        skuId: this.skuId,
        // startTime: new Date(this.startTime),
        // startTime: this.$u.timeFormat(this.startTime, 'yyyy-mm-dd hh:MM:ss')
        startTime: this.startTime,
      };
      return this.$u.api.QueryspuSeckillsceneDetail(data).then((res) => {
        if (res.code == 200) {
          that.skuDetail = res.data;
					{
						let properties = {
							"spuId":res.data.spuId,
							"skuId":res.data.id,
							"storeId":res.data.storeId
						}
						visit(that,'商品详情页',properties)
					}

          if (!that.skuDetail) {
            return;
          }
					if (this.skuDetail.spuVideo) {
						// let spuPic = this.skuDetail.spuVideoPic ? this.skuDetail.spuVideoPic:this.skuDetail.images[0] ; // this.skuDetail.images[0]
            // let spuPic = this.skuDetail.spuVideo ? this.skuDetail.spuVideo + '?x-oss-process=video/snapshot,t_0,f_jpg':this.skuDetail.images[0]; // this.skuDetail.images[0]
            let spuPic = that.skuDetail.images[0]
						that.skuDetail.images.unshift(spuPic)

            that.skuDetail.images = that.skuDetail.images.map(item=>{
              return{
                keys: Date.now(),
                src: item
              }
            })
						that.skuDetail.spuVideoPic = that.skuDetail.images[0].src
					}

          let options={}, storeServiceConfig = that.skuDetail.storeServiceConfig
          if(storeServiceConfig) {
            Object.keys(storeServiceConfig).forEach(key => {
						 if(storeServiceConfig[key]){
							 if(key == 'staffId'){
								 options.staffid = storeServiceConfig[key]
								}else{
								 options[key] = storeServiceConfig[key]
								}
						 }
					 })
          }
					let obj = ''
					let ysfData = {
						id:that.skuDetail.id,
						title:that.skuDetail.name,
						desc:that.skuDetail.subTitle,
						picture: that.skuDetail.images[0],
						tagsurl:'https://m.wsfmall.com/spudetail?id='+that.skuDetail.id,
						navigateToUrl:`/productModule/pages/skuDetail/skuDetail?skuId=${that.skuDetail.id}`,
						note:`￥${that.skuDetail.price}`,
						...options
					}
					obj = JSON.stringify(ysfData)
					uni.setStorageSync("YSFDATA",obj)
          if (that.skuDetail.marketingVos && that.skuDetail.marketingVos.length) {

						let istypeShow = that.skuDetail.marketingVos.map((temp) => {

							if (temp.type == 1 || temp.type == 16) {
								return true
							} else if (temp.type == 13) {
								return '13'
							} else {
								return false
							}
						})
						console.log("istypeShow--********-",istypeShow)
						if (istypeShow.includes('13')) {
							that.skuDetail.marketingVos.map(item=> {
								console.log("startTime---",item.startTime)
                let nowDate = parseInt(new Date().getTime() / 1000); //当前秒级时间戳
                let startTime = parseInt(new Date(item.startTime.replace(/-/g, "/")).getTime() / 1000);
								if (startTime > nowDate) {
									that.skuDetail.showActiveType = []
                  console.log('showActiveType1', that.skuDetail.showActiveType)

                } else {
									that.skuDetail.showActiveType = istypeShow
								}
							})
						} else {
							that.skuDetail.showActiveType = istypeShow
						}
            that.marketingVos = that.skuDetail.marketingVos.filter((item) => {
              return (
                item.type && item.type === "13" && item.panicBuy.isShow === "1"
              );
            });
            // this.marketingVos = this.skuDetail.marketingVos.filter((item) => {
            //   return (
            //     item.type && item.type === "13" && item.panicBuy.isShow === "1"
            //   );
            // });

						console.log(that.skuDetail, '------that.skuDetail.spuId-------------------');
						// if (this.recommendToken) {
						// 	this.$storage.setItem({
						// 		spuId: that.skuDetail.spuId,
						// 		recommendToken: this.recommendToken
						// 	});
						// }  // 2022.9.22 电商v3.0需求取消购物车分销功能, 不缓存分销码
						console.log(this.skuDetail, 'skuDetail数据2');
						if (this.skuDetail.marketingVos !== null) {
							this.marketingVos = this.skuDetail.marketingVos.filter(item => {
								return item.type && item.type === '13' && item.panicBuy.isShow === '1';
							});
							this.accountArr = this.skuDetail.marketingVos.filter(item => {
								return item.type && item.type === '2';
							});

							if (this.marketingVos.length) {
								this.marketingVos[0].iSeckill =
									new Date().getTime() >
									new Date(
										this.marketingVos[0].startTime.replace(/-/g, "/")
									).getTime();
								console.log("开始计算倒计时时间");
								this.timestamp.isSeckill = true;
								let startTime = this.$u.deepClone(this.marketingVos[0].startTime);
								console.log(startTime, "startTime");
								let currentTime = parseInt(new Date().getTime() / 1000); //当前秒级时间戳
								let seckillTime = parseInt(
									new Date(startTime.replace(/-/g, "/")).getTime() / 1000
								);
								if (currentTime < seckillTime) {
									console.log(this.marketingVos[0], "哇咔咔");
									this.timestamp.seconds = seckillTime - currentTime;
									this.timestamp.label = "距开始还剩";
									let M =
										new Date(
											this.marketingVos[0].startTime.replace(/-/g, "/")
										).getMonth() + 1;
									let D = new Date(
										this.marketingVos[0].startTime.replace(/-/g, "/")
									).getDate();
									let H = new Date(
										this.marketingVos[0].startTime.replace(/-/g, "/")
									).getHours();
									let m = new Date(
										this.marketingVos[0].startTime.replace(/-/g, "/")
									).getMinutes();
									if (m < 10) {
										m = `0${m}`;
									}
									this.timestamp.startTime = `${M}月${D}日${H}:${m}`;
									// this.timestamp.discount = this.marketingVos[0].panicBuy.discount;
                  this.timestamp.price = this.marketingVos[0].panicBuy.price;
									this.timestamp.dataTime = this.marketingVos[0].startTime;
								} else {
									//开始了
									this.timestamp.seconds = 3600 - (currentTime - seckillTime);
									this.timestamp.label = "距结束还剩";
								}
							} else {
								this.timestamp.isSeckill = false;
							}
						}
						if (this.skuDetail.hasAtten) {
							this.favourite = true;
						} else {
							this.favourite = false;
						}
						if (that.skuDetail.sellOut == 1 || that.skuDetail.isGift == 1) {
							this.canAddCart = false;
							this.canBuyNow = false;
						}
						this.loadShoppingCartCount();
						this.getRecommendList();
						this.addBrowseRecord();
						this.queryCouponList();
						this.$nextTick(() => {
							this.$refs.specUnit.initData();
              this.$refs.baseUnit.initData();
							this.$refs.commentUnit.initData();
						});
					} else {
						this.showActiveType = []
						this.navigateTo("404");
					}
				}
      })
    },
    restDetails(id,sendActiveImg,isGetApi=false) {
      this.skuId = id;
      this.sendActiveImg = sendActiveImg
      this.querySkuDetail(isGetApi);
    },
    /**
     * 查询商品详情
     */
    querySkuDetail(isGetApi) {
      let that = this;
      let data = {
        sourceType: this.sourceType,
        storeId: this.storeIdNumber
      };
			if(this.recommendToken) {
				data['shareCode'] = this.recommendToken
			}
      // else if(this.$storage.getItem(that.skuDetail.spuId)) {
			// 	data['shareCode'] = this.$storage.getItem(that.skuDetail.spuId)
			// } // 2022.9.22 电商v3.0需求取消购物车分销功能, 不缓存分销码

       let skuDetailApi
      if(this.agencyStoreId) {
        skuDetailApi = this.$u.api.AgencystoreDetails
        data.agencyStoreId = this.agencyStoreId
        data.skuId = this.skuId
      } else {
        skuDetailApi = this.$u.api.QuerySpuDetail
        if(this.skuId) {
          data.skuId = this.skuId
        } else {
          data.spuId = this.spuId
        }
      }

      skuDetailApi(data).then((res) => {
        if (res && res.code == 200) {
          this.skuDetail = res.data;

          if (!that.skuDetail) {
            return;
          }
          that.skuId = res.data.id
					if (this.skuDetail.spuVideo) {
            let spuPic = that.skuDetail.images[0]
						this.skuDetail.images.unshift(spuPic)
            this.skuDetail.images = this.skuDetail.images.map(item=>{
              return{
                keys: Date.now(),
                src: item
              }
            })
						this.skuDetail.spuVideoPic = this.skuDetail.images[0].src
					}
          // 虚拟商品是否显示值赋值，刚进来时候数据未加载先显示加入购物车按钮
          that.isVirtual = that.skuDetail.isVirtual

					let properties = {
						"spuId":res.data.spuId,
						"skuId":res.data.id,
						"storeId":res.data.storeId
					}
					visit(that,'商品详情页',properties)
          let options={}, storeServiceConfig = that.skuDetail.storeServiceConfig
          if(storeServiceConfig) {
            Object.keys(storeServiceConfig).forEach(key => {
					  	if(storeServiceConfig[key]){
					  	 if(key == 'staffId'){
					  		 options.staffid = storeServiceConfig[key]
					  		}else{
					  		 options[key] = storeServiceConfig[key]
					  		}
					  	}
					  })
          }
					let obj = ''
					let ysfData = {
						id:that.skuDetail.id,
						title:that.skuDetail.name,
						desc:that.skuDetail.subTitle,
						picture: that.skuDetail.images[0],
						tagsurl:'https://m.wsfmall.com/spudetail?id='+that.skuDetail.id,
						navigateToUrl:`/productModule/pages/skuDetail/skuDetail?skuId=${that.skuDetail.id}`,
						note:`￥${that.skuDetail.price}`,
						...options
					}
					obj = JSON.stringify(ysfData)
					uni.setStorageSync("YSFDATA",obj)

          // if (this.recommendToken) { // 2022.9.22 电商v3.0需求取消购物车分销功能, 不缓存分销码
          //   this.$storage.setItem({
          //     spuId: that.skuDetail.spuId,
          //     recommendToken: this.recommendToken,
          //   });
          // }
          if (this.skuDetail.marketingVos && this.skuDetail.marketingVos.length) {
						let istypeShow = that.skuDetail.marketingVos.map((temp) => {
							if (temp.type == 1 || temp.type == 16) {
								return true
							} else if (temp.type == 13) {
								return '13'
							} else {
								return false
							}
						})
						// console.log("istypeShow--********-",istypeShow)
						if (istypeShow.includes('13')) {
							that.skuDetail.marketingVos.map(item=> {
								console.log("startTime---",item.startTime)
                let nowDate = parseInt(new Date().getTime() / 1000); //当前秒级时间戳
                let startTime = parseInt(new Date(item.startTime.replace(/-/g, "/")).getTime() / 1000);
								if (startTime > nowDate) {
									that.skuDetail.showActiveType = []
								} else {
									that.skuDetail.showActiveType = istypeShow
								}
							})
						} else {
							that.skuDetail.showActiveType = istypeShow
						}
						// console.log('showActiveType', that.skuDetail.showActiveType)

            this.marketingVos = this.skuDetail.marketingVos.filter((item) => {
              return (
                item.type && item.type === "13" && item.panicBuy.isShow === "1"
              );
            });
            if(this.marketingVos.length < 1){
              this.marketingVos = this.skuDetail.marketingVos.filter((item) => {
                return item.type && item.type === "16";
              });
            }
            this.accountArr = this.skuDetail.marketingVos.filter((item) => {
              return item.type && item.type === "2";
            });

            if (this.marketingVos.length) {
              this.marketingVos[0].iSeckill =
                new Date().getTime() >
                new Date(
                  this.marketingVos[0].startTime.replace(/-/g, "/")
                ).getTime();
              // console.log("开始计算倒计时时间");
              this.timestamp.isSeckill = true;
              let startTime = this.$u.deepClone(this.marketingVos[0].startTime);
              // console.log(startTime, "startTime");
              let currentTime = parseInt(new Date().getTime() / 1000); //当前秒级时间戳
              let seckillTime = parseInt(
                new Date(startTime.replace(/-/g, "/")).getTime() / 1000
              );
              if (currentTime < seckillTime) {
                this.timestamp.seconds = seckillTime - currentTime;
                this.timestamp.label = "距开始还剩";
                let M =
                  new Date(
                    this.marketingVos[0].startTime.replace(/-/g, "/")
                  ).getMonth() + 1;
                let D = new Date(
                  this.marketingVos[0].startTime.replace(/-/g, "/")
                ).getDate();
                let H = new Date(
                  this.marketingVos[0].startTime.replace(/-/g, "/")
                ).getHours();
                let m = new Date(
                  this.marketingVos[0].startTime.replace(/-/g, "/")
                ).getMinutes();
                if (m < 10) {
                  m = `0${m}`;
                }
                this.timestamp.startTime = `${M}月${D}日${H}:${m}`;
                // this.timestamp.discount = this.marketingVos[0].panicBuy.discount;
                this.timestamp.price = this.marketingVos[0].panicBuy.price;
                this.timestamp.dataTime = this.marketingVos[0].startTime;
              } else {
                //开始了
                this.timestamp.seconds = 3600 - (currentTime - seckillTime);
                this.timestamp.label = "距结束还剩";
              }
            } else {
              this.timestamp.isSeckill = false;
            }
          } else {
						this.showActiveType = []
            this.marketingVos = []; // 如果没有活动 传入子组件[] 首单活动版本 改变数量控制是否显示限购字样
          }

          if (this.skuDetail.hasAtten) {
            this.favourite = true;
          } else {
            this.favourite = false;
          }

          if (that.skuDetail.sellOut == 1 || that.skuDetail.isGift == 1) {
            this.canAddCart = false;
            this.canBuyNow = false;
          }
          this.loadShoppingCartCount();
          this.getRecommendList();
          this.addBrowseRecord();
          this.queryCouponList();
          this.$nextTick(() => {
            if(!isGetApi){
                this.$refs.specUnit.initData();
            }

            if(!isGetApi){
              this.$refs.baseUnit.initData();
            }
            this.$refs.commentUnit.initData();
          });
          this.noDetail = false
        } else {
					this.noDetail = true
          this.navigateTo("404");
        }

        // 如果只有分销员ID没有分销码则取生成一个
        if(this.promoteId && !this.recommendToken) {
          this.getRecommendToken()
        }
      }).catch(err=> {
				this.noDetail = true
			})
    },
    /**
     * 校验是否超过平台秒杀限制数
     * @param {*} data
     * @param {*} limitNum
     * @param {*} inputNum
     */
    CheckSkuPanicBuyLimitNum(data, limitNum, inputNum) {
      if (inputNum > limitNum) {
        this.$u.toast(`购买数量不能超过库存数量`);
      }
      this.$u.api.CheckSkuPanicBuyLimitNum(data).then((res) => {
        if (res.data && res.data.limitNum) {
          if (res.data.hasBoughtNum) {
            // this.saveLimitNum = res.data.limitNum - res.data.hasBoughtNum;
            this.$u.toast(
              `限购${res.data.limitNum}件,你已购买过${res.data.hasBoughtNum}件了`
            );
          } else {
            // this.saveLimitNum = res.data.limitNum;
            this.$u.toast(`抱歉，该商品限购${res.data.limitNum}件`);
          }
        } else {
          this.saveLimitNum = inputNum
          console.log('无报错 存值', this.saveLimitNum, '输入框',inputNum);
          // this.saveLimitNum = true
        }
      });
    },
    /**
     * 去购物车
     */
    goCart() {
      getApp().globalData.pageSign = "Cart";
      uni.setStorageSync("cartSkuId", this.skuId);
      this.$smart.go("SmartCart")

    },
    /**
     * 优惠券列表
     */
    queryCouponList() {
      this.$u.api
        .QueryCouponList({ storeId: this.skuDetail.storeId, spuId: this.skuDetail.spuId })
        .then((res) => {
          if (res.code == 200) {
            this.storeCouponList = res.data;
          }
        });
    },
    /**
     * 热销商品商品列表
     */
    getRecommendList() {
      let that = this;
      if (this.isLoading || !this.hasMore) return;
      this.isLoading = true;
      this.loadStatus = "loading";
      this.queryForm.skuId = this.skuId
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
    /**
     * 增加浏览记录
     */
    addBrowseRecord() {
      if (app.globalData.isLink) {
        let data = { skuId: this.skuId, storeId: this.skuDetail.storeId, sourceType: this.sourceType };
        this.$u.api.AddBrowseRecord(data).then(() => {})
      } else {
        this.addBrowseRecordStorage();
      }
    },
    // 未登录状态下本地缓存增加浏览记录
    addBrowseRecordStorage() {
      let browSkus = [];
      let that = this;
      wx.getStorage({
        key: "browseDates",
        success(res) {
          browSkus = JSON.parse(res.data);
          browSkus.push({
            skuId: that.skuId,
            typeId: that.skuDetail.typeId,
          });
          if (browSkus.length > 30) {
            browSkus.shift();
          }
          wx.setStorage({
            key: "browseDates",
            data: JSON.stringify(browSkus),
            success: function () {
              console.log("增加本地缓存浏览记录成功");
            },
          });
        },
        fail() {
          browSkus.push({
            skuId: that.skuId,
            typeId: that.skuDetail.typeId,
          });
          if (browSkus.length > 30) {
            browSkus.shift();
          }
          wx.setStorage({
            key: "browseDates",
            data: JSON.stringify(browSkus),
            success: function () {
              console.log("增加本地缓存浏览记录成功");
            },
          });
        },
      });
    },
    /**
     * 购物车数量
     */
    loadShoppingCartCount() {
      // 加购清除remendTOKEN
      // this.recommendToken = null; // 2022.9.22 电商v3.0需求取消购物车分销功能, 不缓存分销码

      if (app.globalData.isLink) {
        this.$u.api.QueryShoppingCartCount().then((res) => {
          this.shoppingCartCount = res.data;
        });
      } else {
        this.shoppingCartCount = 0;
      }
    },
    navigateTo(sceneName, params) {
      // this.$wsf.go('Login')
      this.$wsf.go(sceneName, params);
    },
    showToastError(errMsg, duration = 2000) {
      uni.showToast({
        title: errMsg,
        icon: "none",
        mask: true,
        duration: duration,
      });
    },
    goodsClick(e) {
      let param = e.id;
      if (!param) {
        this.showToastError("缺少参数");
      }
      if(e.goodsSource == 4){
				this.$wsf.go('ToMotor',{skuId: e.id});
			} else {
        this.navigateTo("SkuDetail", { skuId: param });
			}
    },
    // 加购
    addCart(type) {
      if (this.canAddCart) {
        this.$refs.specUnit.openSkuModal(2);
      }
    },
    //立即购买
    bugNow() {
      if (this.canBuyNow) {
        app.globalData.pageSign = "SkuDetail";
        app.globalData.skuId = this.skuId;
        this.$refs.specUnit.openSkuModal(1);
      }
    },
    //去店铺
    toStoreIndex() {
      if (this.skuDetail.storeId) {
        this.navigateTo("StoreIndex", {
          storeId: this.skuDetail.storeId,
          storeName: this.skuDetail.storeName,
        });
      } else {
        uni.switchTab({
          url: "/pages/index/index",
        });
      }
    },
    //收藏/取消收藏
    favouriteGood() {
      // if (!app.globalData.isLink) {
      // 	this.navigateTo('QuickLogin');
      // 	return;
      // }
      if (this.skuDetail.hasAtten) {
        let data = { skuId: this.skuDetail.sku.id, storeId: this.skuDetail.storeId };
        this.$u.api.CancelSkuAttention(data).then((res) => {
          if (res.code == 200) {
            this.showToastError("已取消收藏");
            this.favourite = false;
            this.skuDetail.hasAtten = false;
          }
        });
      } else {
        let data = { skuId: this.skuDetail.sku.id, storeId: this.skuDetail.storeId, sourceType: this.sourceType };
        this.$u.api.AddSkuAttention(data).then((res) => {
          if (res.code == 200) {
            this.showToastError("收藏成功");
            this.favourite = true;
            this.skuDetail.hasAtten = true;
          }
        });
      }
    },

    setBoxTop() {
      // console.log("监听滚轮");

      uni
        .createSelectorQuery()
        .select("#tabsBox")
        .boundingClientRect((data) => {
          this.topBox = data.height + data.top;
          // console.log("头部tabs-----节点离页面顶部的距离为" + this.topBox);
        })
        .exec();
      uni
        .createSelectorQuery()
        .select("#detailBox")
        .boundingClientRect((data) => {
          this.detailBox = Number.parseInt(data.top - this.topBox);
          if (this.recommendBox > 0 && this.detailBox > -data.height) {
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
          // console.log("评论",this.commentBox,data,'-',this.detailBox,this.commentBox,this.recommendBox);
          // if (this.commentBox < 0 && this.recommendBox >= 100) {
            if (this.commentBox <= 30 ) {
              this.tabIndex = 2;
            }
          // }
        })
        .exec();
      uni
        .createSelectorQuery()
        .select("#recommendBox")
        .boundingClientRect((data) => {
          this.recommendBox = Number.parseInt(data.top - this.topBox);
          // console.log("推荐",this.recommendBox,data,'-',this.detailBox,this.commentBox,this.recommendBox);
          if (this.recommendBox <= 30) {
            this.tabIndex = 3;
          }
        })
        .exec();
    },
    serviceShare() {
      this.shareColumn = 1;
      this.showShareModal = true
    },
    cancelShare() {
      this.showPost = false;
    },
    closePost() {
      this.showPost = false;
    },
    clickFun(){
			let params = {
				type: 0,
				id: this.skuDetail.id
			}
			this.$store.dispatch('SETTINGS/shareVisitRequest',params)
		},
    handleShareWay(type) {
      switch (type) {
        //分享小程序给微信好友
        case 1:
          break;
        //生成海报
        case 2:
          uni.showLoading({
            title: "长图生成中",
            mask: true,
          });
          this.showPost = false;
          this.showShareModal = false
          let id = this.recommendToken ? this.skuDetail.skuNo : this.skuDetail.id
          let key = this.recommendToken ? 'n' : 's'
          let codeData = {
            scene: `${key}=${id}&c=${this.recommendToken}`,
            page: "productModule/pages/skuDetail/skuDetail",
            width: 60,
            autoColor: false,
            isCyaline: "true",
          };
          let header = {
            Accept: "application/json",
            "Content-Type": "application/json",
          };
          if (getApp().globalData.isLink) {
            header["Authorization"] =
              "Bearer " + uni.getStorageSync("newToken");
          }
          uni.request({
            url: httpInterceptor.baseUrl + "/share/code",
            header: header,
            data: codeData,
            responseType: "arraybuffer",
            method: "POST",
            success: (res) => {
              // 拿到后台生成的二进制数据
              this.shareQrcode =
                "data:image/png;base64," + uni.arrayBufferToBase64(res.data);
              // 2023-10-31 排查生成逻辑，发现并不需要删除微信的文件缓存以及保存图片。 下面可以直接调用canvas绘制图片
              // this.removeBeforeFiles();

              this.creatCanvasPost();
            },
          });

          break;
        //保存到相册
        case 3:
          uni.saveImageToPhotosAlbum({
            filePath: this.filePostImg,
            success() {
              uni.showToast({
                title: "保存成功",
                icon: "none",
              });
            },
            fail() {
              uni.showToast({
                title: "保存失败",
                icon: "none",
              });
            },
          });
          break;
        //分享图片给微信好友
        case 4:
          break;
        default:
          break;
      }
    },
    // undo-未使用
    removeBeforeFiles() {
      removeSave()
        .then(() => {
          this.getUseCode();
        })
        .catch((e) => {
          console.log(e);
        });
    },
    // undo-未使用
    getUseCode() {
      writeFile(this.shareQrcode)
        .then((img) => {
          // codeUrl为base64格式的小程序码
          this.creatCanvasPost();
        })
        .catch((e) => {
          console.log(e);
        });
    },
    /**
     * 绘制海报
     */
    creatCanvasPost() {
      let skuName = this.skuDetail.shareMsg ? this.skuDetail.shareMsg : this.skuDetail.name;
      if (skuName.length > 30) {
        skuName = skuName.substr(0, 30) + "…";
      }
      let that = this;
      this.$nextTick(async () => {
        // 初始化
        await that.$refs.rCanvas
          .init({
            canvas_id: "rCanvas",
            canvas_width: "241",
            canvas_height: "380",
            hidden: true,
          })
          .catch((err_msg) => {
            this.showToastError("海报生成失败，请稍后重试");
          });

        // await that.$refs.rCanvas.fillRoundRect({
        // 	x: 0,
        // 	y: 0,
        // 	w: 241,
        // 	h: 380,
        // 	radius: 10,
        // 	fill_color: '#fff'
        // }).catch(err_msg=>{
        // this.showToastError('海报生成失败，请稍后重试')
        //   });
        // 如果这里报错，需要检查图片的地址和域名是否正确， 域名有没有添加到白名单-没有的话，主图无法绘制
        // 画图
        await that.$refs.rCanvas
          .drawImage({
            url: this.skuDetail.images[0].src || this.skuDetail.images[0],
            x: 12,
            y: 12,
            w: 217,
            h: 217,
          })
          .catch((err_msg) => {
            this.showToastError("海报生成失败，请稍后重试");
          });

        // 画文字
        await that.$refs.rCanvas
          .drawText({
            text: "￥",
            x: 12,
            y: 254,
            font_color: "#E60113",
            font_size: 12,
            font_weight: "bold",
          })
          .catch((err_msg) => {
            this.showToastError("海报生成失败，请稍后重试");
          });

        await that.$refs.rCanvas
          .drawText({
            text: this.skuDetail.price.toFixed(2),
            x: 24,
            y: 254,
            font_color: "#E60113",
            font_size: 17,
            font_weight: "bold",
          })
          .catch((err_msg) => {
            this.showToastError("海报生成失败，请稍后重试");
          });

        await that.$refs.rCanvas
          .drawText({
            text: "价格具有时效性",
            x: 12,
            y: 270,
            font_color: "#666",
            font_size: 9,
            font_weight: "lighter",
          })
          .catch((err_msg) => {
            this.showToastError("海报生成失败，请稍后重试");
          });

        await that.$refs.rCanvas
          .drawText({
            text: skuName,
            max_width: 130,
            x: 12,
            y: 296,
            font_color: "#333333",
            font_size: 13,
            line_height: 19,
            font_weight: "lighter",
          })
          .catch((err_msg) => {
            this.showToastError("海报生成失败，请稍后重试");
          });

        await that.$refs.rCanvas
          .drawText({
            text: "-长按或扫码购买-",
            x: 156,
            y: 332,
            font_color: "#666",
            font_size: 9,
          })
          .catch((err_msg) => {
            this.showToastError("海报生成失败，请稍后重试");
          });

        await that.$refs.rCanvas
          .drawRect({
            x: 0,
            y: 360,
            w: 241,
            h: 20,
            color: "#FEF0F1",
          })
          .catch((err_msg) => {
            this.showToastError("海报生成失败，请稍后重试");
          });

        // 画图
        await that.$refs.rCanvas
          .drawImage({
            url:
              "https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com///198ad539297fc070566ba83685372bb9.png",
            x: 103,
            y: 364,
            w: 36,
            h: 12,
          })
          .catch((err_msg) => {
            this.showToastError("海报生成失败，请稍后重试");
          });

        // 画图
        await that.$refs.rCanvas
          .drawImage({
            url: this.shareQrcode,
            x: 163,
            y: 254,
            w: 60,
            h: 60,
          })
          .catch((err_msg) => {
            this.showToastError("海报生成失败，请稍后重试");
          });

        // 生成海报
        await that.$refs.rCanvas.draw((res) => {
          this.filePostImg = res.tempFilePath;
          //res.tempFilePath：生成成功，返回base64图片
          pathToBase64(res.tempFilePath)
            .then((base64) => {
              this.canvasPostImg = base64;
              this.showPost = true;
              this.showShareModal = false
              // this.shareColumn = 2;
              uni.hideLoading();
            })
            .catch((err_msg) => {
              this.showToastError("海报生成失败，请稍后重试");
            });
        });
      });
    },
    savePost() {
      let that = this
      // uni.showShareImageMenu({
      //   path: this.filePostImg
      // })
      uni.saveImageToPhotosAlbum({
        filePath: this.filePostImg,
        success() {
          that.clickFun()
          uni.showToast({
            title: "保存成功",
            icon: "none",
          });
        },
        fail() {
          uni.showToast({
            title: "保存失败,请重试",
            icon: "none",
          });
        },
      });
    },
    stopTouch() {
      return false;
    },
    couponSureCallback (item) {
      let {
        userCouponDiscount,
        choosedCoupon,
        ids,
      } = item || {}
      if (choosedCoupon[0]) {
        this.skuDetail.afterCouponPrice = choosedCoupon[0].afterCouponPrice
      } else {
        this.skuDetail.afterCouponPrice = 0
      }
      if(ids.length) {
        this.couponIds = ids
      }
    },

    // 用skuN反查skuId
    getSkuId(skuNo) {
      this.$u.api.querySkuIdBySkuNo({skuNo}).then(res => {
        this.skuId = res.data
        this.querySkuDetail()
      })
    },

    // 查询分享员信息
		 getPromoteInfo() {
			console.log("getPromoteInfo---传参---id---",this.promoteId)
			 this.$u.api.QueryUserBasicInfoById({ id: this.promoteId }).then(res => {
				console.log("getPromoteInfo---接口返回----",res)
				this.promoteInfo = {
					recommendUserType: res.data.recommendUserType,
					phone: res.data.mobile,
					promoteId: res.data.id
				};
        return this.promoteInfo
			});
		},

    async getRecommendToken() {
        if(!this.promoteInfo.promoteId) {
          await this.getPromoteInfo()
        }
				let param = {
					spuId: this.skuDetail.spuId,
					recommendUserType: this.promoteInfo.recommendUserType,
					phone: this.promoteInfo.phone,
					customerId: this.promoteId
				};
				this.$u.api.ShareForDistribution(param).then(res => {
					this.recommendToken = res.data.data
				});
    }
  },
};
</script>

<style lang="scss" scoped>
.feature-tabs-space {
  bottom: 266rpx;
}
.feature-tabs {
  position: fixed;
  z-index: 9;
  right: 0;
  bottom: 226rpx;
  width: 112rpx;
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
}
.header-tabs-wrap {
  z-index: 98;
  position: fixed;
  top: -1000rpx;
  left: 0;
  right: 0;
  height: 76rpx;
  background-color: #fff;
  width: 100%;
  box-shadow: 0rpx 8rpx 20rpx 0rpx rgba(217,217,217,0.15);
}
.header-tabs {
  width: 100%;
  display: flex;
  height: 76rpx;
  padding: 0 68rpx;
  padding-top: 12rpx;
  justify-content: space-between;
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
.back-top /deep/ .u-icon__icon {
  color: #fff !important;
}

.module-card {
  margin-bottom: 24rpx;
  background: #fff;
  border-radius: 20rpx;
  position: relative;
  &.hidden {
    overflow: hidden;
  }
}
.gift-product-tip {
  width: 100%;
  height: 80rpx;
  background: #000;
  opacity: 0.7;
  position: fixed;
  z-index: 999;
  bottom: 100rpx;
  text-align: center;
  line-height: 80rpx;
  color: #fff;
}
.gift-product-tip-bottom {
  bottom: 168rpx !important;
}
.footer-bottom-space {
  position: fixed;
  bottom: 0;
  height: 68rpx;
  width: 100%;
  background-color: #fff;
  z-index: 999;
}
.bottom-column-space {
  bottom: 68rpx !important;
}
.bottom-column {
  width: 100%;
  // height: 100rpx;
  position: fixed;
  // padding: 0 24rpx;
  background-color: #fff;
  z-index: 99;
  bottom: 0;
  box-shadow: 0rpx -8rpx 20rpx 0rpx rgba(217,217,217,0.2);
  box-sizing: content-box;
  padding-bottom: env(safe-area-inset-bottom);
  .common-btn {
    text-align: center;
    min-width: 14%;
    p {
      color: #666;
      margin-top: 6rpx;
      font-size: 20rpx;
    }
  }
  .service-btn {
    display: flex;
    flex-direction: column;
    width: 96rpx;
    height: 96rpx;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    img {
      width: 40rpx;
      height: 40rpx;
    }
    p {
      font-size: 22rpx;
      color: #999999;
    }
  }
  .column-btn {
    margin-right: 14rpx;
    width: 72%;
    height: 80rpx;
    border-radius: 40rpx;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    font-size: 32rpx;
    font-weight: 500;
    &.to-similar-btn {
      background: #FFBE0C;
      color: #FFF9E9;
      width: 260rpx;
      border-radius: 40rpx;
      height: 80rpx;
      text-align: center;
      padding: 20rpx 0;
    }
    &.to-notice-btn {
      width: 260rpx;
      border-radius: 40rpx;
      height: 80rpx;
      text-align: center;
      padding: 20rpx 0;
      background: linear-gradient(90deg, #0A75D9 0%, #00BB8A 100%);
      color: #FFF9E9;
    }
    p {
      color: #fff;
    }
    &:last-child {
      margin-right: 0;
    }
  }
  .add-cart {
    background: #FFBE0C;
    color: #FFFFFF;
    box-sizing:border-box;
    font-weight: 600;
    transform: rotateZ(360deg);
  }
  .bug-now {
    background: linear-gradient(90deg, #FF8011 0%, #FE3040 100%);
    color: #FFFFFF;
    margin-right: 24rpx !important;
    font-weight: 600;
  }
  .btn-grey {
    background: #EEEEEE;
    color: #C3C3C3;
  }
  .btn-grey-border {
    border: 2rpx solid #EEEEEE;
    color: #C3C3C3;
  }
}
.goodsTitle {
  margin-bottom: 20rpx;
  text-align: center;
  img {
    width: 498rpx;
    height: 32rpx;
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
.module-evaluate {
  margin: 24rpx;
  margin-bottom: 0;
  margin-top: 20rpx;
  border-radius: 24rpx;
  background: #ffffff;
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
.module-base {
  background: #F6F6F6;
}
.cart {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80rpx;
  height: 80rpx;
  background: #191919;
  background-color: rgba(25, 25, 25, 0.8);
  border-radius: 44rpx;
  img {
    width: 44rpx;
    height: 44rpx;
  }
  .num-cart {
    height: 28rpx;
    position: absolute;
    top: 6rpx;
    left: 42rpx;
    padding: 0 10rpx;
    color: #ffffff;
    font-size: 16rpx;
    line-height: 28rpx;
  }
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
    color: #FFFFFF;
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
.share-poster-mask {
  background: rgba(0, 0, 0, 0.7);
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
}
.share-poster-container {
  position: absolute;
  top: 45%;
  left: 50%;
  transform: translate(-50%, -50%);
  height: 760rpx;
  width: 482rpx;
  background-color: transparent;
  border-radius: 20rpx;
  image {
    width: 100%;
    height: 100%;
    border-radius: 20rpx;
  }
  .close-btn {
    width: 48rpx;
    height: 48rpx;
    position: absolute;
    right: 0;
    top: -64rpx;
    image {
      width: 100%;
      height: 100%;
    }
  }
  .save-btn {
    width: 482rpx;
    height: 76rpx;
    border-radius: 50rpx;
    background-color: #e60113;
    font-size: 32rpx;
    color: #fff;
    text-align: center;
    line-height: 76rpx;
    position: absolute;
    left: 0;
    bottom: -124rpx;
  }
}
.module-goods-list {
  margin: 0 24rpx;
  padding-top: 40rpx;
}
.cart-data {
  width: 100%;
  height: 100%;
  position: relative;
}
</style>

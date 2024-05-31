<template>
  <view class="container safe-area-inset-bottom" v-if="!noDetail">
    <back-top :topSearch="topSearch" :isShowSearch="false"></back-top>
    <view
      class="header-tabs-wrap"
      :style="{ top: showHeader ? barHeight : '-1000rpx' }"
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
            <img
              v-if="tabIndex == item.id"
              src="https://wsjc-web.wsecar.com/wsf-mall/skuDetail/icon-subscript.png"
              alt=""
            />
          </view>
        </block>
      </view>
    </view>
    <!-- 商品基本信息 -->
    <view id="product" class="module-base" ref="product">
      <base-module
        ref="baseUnit"
        :marketingVos="marketingVos"
        :timestamp="timestamp"
        :bestCoupon="bestCoupon"
        :skuData="skuDetail"
        :sourceType="sourceType"
        @changeAttention="favouriteGood"
        @restDetails="restDetails"
        :recommendToken="recommendToken"
        :skuId="skuId"
      ></base-module>
    </view>
    <!-- 选择规格 -->
    <view class="selectBox">
      <view class="selectSku" @click="chooseSku">
        <image class="selectImg" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/motorCar/store_icon_select.png"></image>
        <view class="skuSelectList">
          <image class="selectImg" v-for="(item,index) in skuDetail.versionVos.slice(0,5)" :src="item.imageUrl" :key="index"></image>
          <!-- <image class="selectImg" v-for="(item,index) in skuDetail.list" :src="item.imgUrl" :key="index"></image>
          <image class="selectImg" v-for="(item,index) in skuDetail.list" :src="item.imgUrl" :key="index"></image> -->
          <text class="selectText"> 共{{ skuDetail.versionVos.length }}种车型可选</text>
        </view>
        <image class="selectArrow" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/motorCar/store_right_icon.png"></image>
      </view>
    </view>
    <!-- 附近门店 -->
    <view class="sku-stores" v-if="storeList.length > 0 && choosedItem">
      <stores-card
        @openAllStorePage="openAllStorePage"
        :choosedItem="choosedItem"
      ></stores-card>
    </view>

    <wsf-popup
      class="store-popup"
      v-model="showAll"
      mode="bottom"
      z-index="10186"
      height="1280rpx"
      title="选择提车门店"
    >
      <scroll-view class="store-box" scroll-y='true' @scrolltolower="loadUserCollectionList">
        <view class="store-view">
          <store-item
          v-for="(item, index) in storeList"
          :key="index"
          :storeItem="item"
          @click.native="chooseStore(item)"
          :sendStore="sendStore"
          :mobile="mobile"
        ></store-item>
        <p class="more-tip">更多门店正在筹备中，敬请期待</p>
        </view>
      </scroll-view>
    </wsf-popup>

    <!-- <coupon-module
      ref="couponUnit"
      :couponList="storeCouponList"
      :skuData="skuDetail"
      @updateCouponList="queryCouponList"
    ></coupon-module> -->

    <!-- 规格运费 -->

    <spec-module
      ref="specUnit"
      :skuId="skuId"
      :timestamp="timestamp"
      :skuData="skuDetail"
      :marketingVos="marketingVos"
      :recommendToken="recommendToken"
      :saveLimitNum="saveLimitNum"
      :sourceType="sourceType"
      :seletDefault="seletDefault"
      @restDetails="restDetails"
      @updateSku="updatePage"
      @commitBestCoupn="getBestCoupn"
      @minusBlur="minusBlur"
      @minus="minusFun"
      @plus="plusFun"
      :selectCouponItem="selectCouponItem"
      :idNumber="idNumber"
      :sendActiveImg="sendActiveImg"
    ></spec-module>

    <!-- 商品详情 -->
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
        :skuData="skuDetail"
        @goToTop="goToTop"
      ></overview-module>
      <param-module :skuData="skuDetail"></param-module>
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
    <view style="height: 50rpx"></view>
    <view class="bottom-column u-flex">
      <!-- <view class="service-btn" @click="serviceTel({ tit: '商品' })">
        <img
          src="https://wsjc-web.wsecar.com/wsf-mall/skuDetail/icon-service.png"
          alt=""
        />
        <p>客服</p>
      </view> -->
      <view class="service-btn" @click="serviceShare()" v-if="sourceType != 2">
        <img
          src="https://wsjc-web.wsecar.com/wsf-mall/skuDetail/icon-share.png"
          alt=""
        />
        <p>分享</p>
      </view>
      <!-- 立即购买 -->
      <!-- <template
        v-if="skuDetail.shelvesStatus == 0 || skuDetail.shelvesStatus == 2"
      >
        <view
          class="column-btn"
          :class="{ 'bug-now': canBuyNow, 'btn-grey': true }"
          ><span>立即购买</span></view
        >
      </template>
      <template v-else>
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
      </template> -->
      
      <view class="column-btn bug-now" @click="openAllStorePage(true)">查看门店</view>
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
      <image class="emtpy-page-img" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/prev-icon-list/Discount_bg%402x.png" mode=""></image>
      <view class="emtpy-page-text">哇呜，商品链接已失效〜</view>
      <view class="emtpy-page-btn" @click="goIndex">看看其他</view>
    </view>
  </view>
</template>

<script>
const app = getApp();

import baseModule from "./components/baseModule.vue";
import specModule from "./components/specModule.vue";

import overviewModule from "./components/overviewModule.vue";
import paramModule from "./components/paramModule.vue";
import { priceFilter } from "@/common/wsfFilter.js";
import { visit } from "@/common/visit.js";
import backTop from "@/components/backTop.vue";
import httpInterceptor from "@/common/http.interceptor.js";
import { writeFile, removeSave } from "@/common/uploadFile.js";
import closeImg from "@/static/img/icon/close_white@2x.png";
import { pathToBase64 } from "@/components/r-canvas/image-tools/index.js";

// import { detailData } from "./mockData";

import StoresCard from "./components/storesCard.vue";
import StoreItem from "./components/store-item.vue";
import { qqMap } from "@/common/config.js";
export default {
  components: {
    baseModule,
    specModule,
    overviewModule,
    paramModule,
    backTop,
    StoresCard,
    StoreItem,
  },
  data() {
    return {
      isVirtual: 0,
      timestamp: {},
      marketingVos: [],
      isNeedBottomSpace: getApp().globalData.isNeedBottomSpace,
      bestCoupon: null,
      recommendToken: null,
      storeCouponList: [],

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
      ],
      skuDetail: {
        spuAttributeValues: [],
        versionVos: []
      },
      queryForm: {
        // 页码页容量
        skuId: "",
        pageType: 2,
        pageNum: 0,
        pageSize: 10,
      },
      recommendSku: [],
      skuId: null,
      spuId: null,
      scrollTop: 0,

      canBuyNow: true,
      addressId: 1,
      flowList: [],

      isLoading: false, // 是否正在加载
      hasMore: true, // 是否拥有更多

      active: 0, // 判断是否是从秒杀列表进入 0:普通商品,13:秒杀商品
      startTime: null,
      accountArr: [],
      showShareModal: false,
      topBox: "",
      detailBox: "",
      tabsBox: "",
      saveLimitNum: 1,
      noDetail: false,
      agencyStoreId: "", //实体店id
      sourceType: 1, //商品来源: 1:商城, 2: 实体店
      idNumber: "",
      topSearch: false, // 头部背景颜色
      showPost: false,
      shareColumn: -1,
      shareQrcode: null,
      filePostImg: null,
      closeImg: closeImg,
      canvasPostImg: null,
      barHeight: '0px',
      showAll: false,
      choosedItem: {},
      storeList: [],
      queryStoreForm: {
        currentPageNum: 1, // 设置起始页码
        pageSize: 10, //返回每页数据的个数
      },
      loadText: {
        loadmore: "上拉加载更多",
        loading: "努力加载中",
        nomore: "更多门店正在筹备中，敬请期待",
      },
      loadStoreStatus: "loadmore", // 加载更多样式效果
      isStoreLoading: false, // 是否正在加载
      hasStoreMore: false, // 是否拥有更多
      sendStore: {
        cityCode: "",
        latitude: "",
        longitude: "",
        spuId: "",
      },
      mobile: "",
      batterySettingId: "", // 选择的电池ID
      sendActiveImg: '',
      precisionGPS: '',

    };
  },
  //分享
  onShareAppMessage(options) {
    console.log("onShareAppMessage--- options- : ", options);
    let that = this;
    if (options.from === "button") {
      this.showShareModal = false;
      // 来自页面内分享按钮
    }
    let url = `motorModule/pages/motorCarDetail/detail?skuId=${that.skuDetail.id}&c=${that.recommendToken}&s=${that.skuId}`;
    let titleName;
    return {
      title: that.skuDetail.shareMsg,
      desc: that.skuDetail.shareMsg,
      imageUrl: that.skuDetail.shareImage,
      path: url,
    }
    if (that.skuDetail.marketingVos && that.skuDetail.marketingVos.length > 0) {
      let typeData = that.skuDetail.marketingVos.map((temp) => {
        return temp.type;
      });
      console.log("typeData-----------------", typeData);
      if (typeData.includes("13")) {
        that.skuDetail.marketingVos.map((item) => {
          console.log("item.startTime-----------------", item.startTime);
          let startTime = new Date(item.startTime).getTime();
          let nowDate = new Date().getTime();
          if (startTime <= nowDate) {
            titleName =
              "快抢光了！【仅售" +
              that.skuDetail.price +
              "元】" +
              that.skuDetail.name;
          } else {
            titleName =
              that.skuDetail.price.toFixed(2) + "元 | " + that.skuDetail.name;
          }
        });
      } else if (typeData.includes("1")) {
        that.skuDetail.marketingVos.map((item) => {
          titleName = "直降" + item.fall.price + "元 | " + that.skuDetail.name;
        });
      } else if (typeData.includes("16")) {
        titleName =
          "大家都在买【仅售" +
          that.skuDetail.price +
          "元】" +
          that.skuDetail.name;
      }
    } else {
      titleName =
        that.skuDetail.price.toFixed(2) + "元 | " + that.skuDetail.name;
    }
    console.log("titleName", titleName);
    return {
      title: titleName,
      desc: that.skuDetail.subTitle,
      imageUrl: that.skuDetail.shareImage
        ? that.skuDetail.shareImage
        : that.skuDetail.images[0],
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
    let url =
      "motorModule/pages/motorCarDetail/detail?skuId=" + that.skuDetail.id;
    let titleName
    return {
      title: that.skuDetail.shareMsg,
      desc: that.skuDetail.shareMsg,
      imageUrl: that.skuDetail.shareImage,
      path: url,
    }
    if (that.skuDetail.marketingVos && that.skuDetail.marketingVos.length > 0) {
      let typeData = that.skuDetail.marketingVos.map((temp) => {
        return temp.type;
      });
      console.log("typeData-----------------", typeData);
      if (typeData.includes("13")) {
        that.skuDetail.marketingVos.map((item) => {
          console.log("item.startTime-----------------", item.startTime);
          let startTime = new Date(item.startTime).getTime();
          let nowDate = new Date().getTime();
          if (startTime <= nowDate) {
            titleName =
              "快抢光了！【仅售" +
              that.skuDetail.price +
              "元】" +
              that.skuDetail.name;
          } else {
            titleName =
              that.skuDetail.price.toFixed(2) + "元 | " + that.skuDetail.name;
          }
        });
      } else if (typeData.includes("1")) {
        that.skuDetail.marketingVos.map((item) => {
          titleName = "直降" + item.fall.price + "元 | " + that.skuDetail.name;
        });
      } else if (typeData.includes("16")) {
        titleName =
          "【仅售" + that.skuDetail.price + "元】" + that.skuDetail.name;
      }
    } else {
      titleName =
        that.skuDetail.price.toFixed(2) + "元 | " + that.skuDetail.name;
    }
    console.log("titleName", titleName);
    return {
      title: titleName,
      desc: that.skuDetail.subTitle,
      imageUrl: that.skuDetail.shareImage
        ? that.skuDetail.shareImage
        : that.skuDetail.images[0],
      path: url,
    };
  },
  onLoad(option) {
    let { height, top } = getApp().globalData.capsule
    let { statusBarHeight } = uni.getSystemInfoSync();
    this.barHeight = (top * 2 - statusBarHeight + height ) + 'px'

    let that = this;
    console.log("URL-------option", option);
    let userInfo = uni.getStorageSync("userInfo");
    this.mobile = userInfo.mobile;
    if (option.sourceType) {
      //有商品来源
      this.sourceType = option.sourceType;
    } else {
      this.sourceType = 1;
    }

    if (option.agencyStoreId) {
      //有实体店铺id  扫码进入用
      this.agencyStoreId = option.agencyStoreId;
      this.sourceType = 2;
    }

    if (option.idNumber) {
      //有实体店idNumber 列表的实体店商品
      this.idNumber = option.idNumber;
    }

    if (option.scene) {
      let scene = option.scene;
      console.log(scene, "scene");
      if (scene.constructor === Object) {
        console.log("是对象");
        this.skuId = scene.s || scene.skuId;
        if (scene.c) {
          this.recommendToken = scene.c;
        }
      } else {
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
        }
        if (scene.indexOf("a=") != -1) {
          //有实体店铺id
          let sceneA = scene.split("a=")[1];
          this.agencyStoreId = sceneA;
          this.sourceType = 2;
        }
      }
    } else {
      this.skuId = option.s || option.skuId;
      this.spuId = option.spuId;
      if (option.s && option.c) {
        this.recommendToken = option.c;
      }
    }
  },
  onShow() {
    // if (this.active == 13) {
    //   //秒杀详情接口
    //   this.QueryspuSeckillsceneDetail();
    // } else {
      //普通详情接口
      
      // this.querySkuDetail();
    // }
    this.precisionGPS = uni.getStorageSync('precisionGPS') ? JSON.parse(uni.getStorageSync('precisionGPS')) : {}
    this.initStore()
    // 获取精确定位
    
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
    // 监听页面滚动--tabs对应切换   节流
    this.$u.debounce(this.setBoxTop, 300);
  },
  mounted() {
    // this.choosedItem = this.storeList[0]
  },
  methods: {
    initStore() {
      let that = this;
      uni.getFuzzyLocation({
        type: 'wgs84',
        // geocode: true,
        // isHighAccuracy: true,
        success(res) {
          that.sendStore.latitude = res.latitude;
          that.sendStore.longitude = res.longitude;
          qqMap.reverseGeocoder({
            location: {
              latitude: res.latitude,
              longitude: res.longitude,
            },
            success: function (result) {
			        let cityCode = String(result.result.ad_info.adcode);
              that.sendStore.cityCode = cityCode.slice(0, 4) + "00";
              that.loadUserCollectionList();
              that.querySkuDetail()
            },
            fail: function (error) {
              console.error(error, "error");
              that.sendStore.cityCode = null;
            },
          });
        },
      });
    },
    loadUserCollectionList() {
      if (this.isStoreLoading || this.hasStoreMore) return;
      this.isStoreLoading = true;
      let data = { ...this.queryStoreForm, ...this.sendStore };
      data.cityCode = this.precisionGPS.areaCode ? this.precisionGPS.areaCode.slice(0, 4) + "00" : data.cityCode
      data.longitude = this.precisionGPS.longitude ? this.precisionGPS.longitude : data.longitude
      data.latitude = this.precisionGPS.latitude ? this.precisionGPS.latitude : data.latitude
      delete data.spuId
      this.$u.api.QueryNearbyStores(data).then((res) => {
        this.isStoreLoading = false;
        if (res.code == 200) {
          this.storeList = this.storeList.concat(res.data);

          let min = Math.min.apply(
            Math,
            this.storeList.map((item) => {
              return item.distance;
            })
          );
          this.storeList.forEach((item, index) => {
            if (index == 0) {
              item.checked = true;
            }
            if (item.distance == min) {
              item.isMin = true;
            }
          });
          this.choosedItem = this.storeList.find((item) => {
            return item.checked;
          });
          this.queryStoreForm.currentPageNum++;
          this.hasStoreMore = this.storeList.length == res.total;
        }
      });
    },
    chooseStore(item) {
      this.storeList.forEach((item) => {
        item.checked = false;
      });
      item.checked = true;
      this.choosedItem = { ...item };
      this.showAll = false;
    },
    openAllStorePage(showAll) {
      this.showAll = showAll;
    },
    //去首页
    goIndex() {
      this.$wsf.go("Index");
    },
    goToTop() {
      uni.pageScrollTo({
        duration: 300,
        scrollTop: this.overviewHeight + 10,
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
    minusFun(data, limitAddNum) {
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
    plusFun(data, limitAddNum) {
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
		//   if (this.active == 13) {
		//     this.QueryspuSeckillsceneDetail();
		//   } else {
        this.querySkuDetail();
    	//   }
    },

    // 切换分类
    changeTab(item) {
      this.tabIndex = item.id;
      let name = "#" + item.mark;
      uni
        .createSelectorQuery()
        .select(name)
        .boundingClientRect((data) => {
          console.log("目标节点盒子" + name, data);
          //目标节点
          uni
            .createSelectorQuery()
            .select(".container")
            .boundingClientRect((res) => {
              console.log("最外层盒子container", res);
              //最外层盒子节点
              uni.pageScrollTo({
                duration: 300, //过渡时间必须为0，uniapp bug，否则运行到手机会报错
                scrollTop: data.top - res.top - 120, //滚动到实际距离是元素距离顶部的距离减去最外层盒子的滚动距离
              });
            })
            .exec();
        })
        .exec();
        console.log(this.tabIndex, 'njnjn');
    },
    // 秒杀详情数据接口
    // QueryspuSeckillsceneDetail() {
    //   let that = this;
    //   let data = {
    //     skuId: this.skuId,
    //     startTime: this.startTime,
    //   };
    //   return this.$u.api.QueryspuSeckillsceneDetail(data).then((res) => {
    //     if (res.code == 200) {
    //       that.skuDetail = res.data;
    //       // that.skuDetail = detailData;
    //       {
    //         let properties = {
    //           spuId: res.data.spuId,
    //           skuId: res.data.id,
    //           storeId: res.data.storeId,
    //         };
    //         visit(that, "商品详情页", properties);
    //       }

    //       if (!that.skuDetail) {
    //         return;
    //       }
    //        if (this.skuDetail.spuVideo) {
    //           // let spuPic = this.skuDetail.spuVideoPic
    //           //   ? this.skuDetail.spuVideoPic
    //           //   : this.skuDetail.images[0]; // this.skuDetail.images[0]
    //           let spuPic = this.skuDetail.images[0]
    //           that.skuDetail.images.unshift(spuPic);

    //           that.skuDetail.images = that.skuDetail.images.map(item=>{
    //             return{
    //               keys: Date.now(),
    //               src: item
    //             }              
    //           }) 
    //           that.skuDetail.spuVideoPic = that.skuDetail.images[0].src;
    //         }

    //       let options = {},
    //         storeServiceConfig = that.skuDetail.storeServiceConfig;
    //       if (storeServiceConfig) {
    //         Object.keys(storeServiceConfig).forEach((key) => {
    //           if (storeServiceConfig[key]) {
    //             if (key == "staffId") {
    //               options.staffid = storeServiceConfig[key];
    //             } else {
    //               options[key] = storeServiceConfig[key];
    //             }
    //           }
    //         });
    //       }
    //       let obj = "";
    //       let ysfData = {
    //         id: that.skuDetail.id,
    //         title: that.skuDetail.name,
    //         desc: that.skuDetail.subTitle,
    //         picture: that.skuDetail.images[0],
    //         tagsurl: "https://m.wsfmall.com/spudetail?id=" + that.skuDetail.id,
    //         navigateToUrl: `/orderModule/pages/motorCarDetail/motorOrderDetail?orderId=${that.skuDetail.id}`,
    //         note: `￥${that.skuDetail.price}`,
    //         ...options,
    //       };
    //       obj = JSON.stringify(ysfData);
    //       uni.setStorageSync("YSFDATA", obj);
    //       if (
    //         that.skuDetail.marketingVos &&
    //         that.skuDetail.marketingVos.length
    //       ) {
    //         let istypeShow = that.skuDetail.marketingVos.map((temp) => {
    //           if (temp.type == 1 || temp.type == 16) {
    //             return true;
    //           } else if (temp.type == 13) {
    //             return "13";
    //           } else {
    //             return false;
    //           }
    //         });
    //         console.log("istypeShow--********-", istypeShow);
    //         if (istypeShow.includes("13")) {
    //           that.skuDetail.marketingVos.map((item) => {
    //             console.log("startTime---", item.startTime);
    //             let nowDate = parseInt(new Date().getTime() / 1000); //当前秒级时间戳
    //             let startTime = parseInt(
    //               new Date(item.startTime.replace(/-/g, "/")).getTime() / 1000
    //             );
    //             if (startTime > nowDate) {
    //               that.skuDetail.showActiveType = [];
    //               console.log("showActiveType1", that.skuDetail.showActiveType);
    //             } else {
    //               that.skuDetail.showActiveType = istypeShow;
    //             }
    //           });
    //         } else {
    //           that.skuDetail.showActiveType = istypeShow;
    //         }
    //         that.marketingVos = that.skuDetail.marketingVos.filter((item) => {
    //           return (
    //             item.type && item.type === "13" && item.panicBuy.isShow === "1"
    //           );
    //         });

    //         if (this.skuDetail.marketingVos !== null) {
    //           this.marketingVos = this.skuDetail.marketingVos.filter((item) => {
    //             return (
    //               item.type &&
    //               item.type === "13" &&
    //               item.panicBuy.isShow === "1"
    //             );
    //           });
    //           this.accountArr = this.skuDetail.marketingVos.filter((item) => {
    //             return item.type && item.type === "2";
    //           });

    //           if (this.marketingVos.length) {
    //             this.marketingVos[0].iSeckill =
    //               new Date().getTime() >
    //               new Date(
    //                 this.marketingVos[0].startTime.replace(/-/g, "/")
    //               ).getTime();
    //             console.log("开始计算倒计时时间");
    //             this.timestamp.isSeckill = true;
    //             let startTime = this.$u.deepClone(
    //               this.marketingVos[0].startTime
    //             );
    //             console.log(startTime, "startTime");
    //             let currentTime = parseInt(new Date().getTime() / 1000); //当前秒级时间戳
    //             let seckillTime = parseInt(
    //               new Date(startTime.replace(/-/g, "/")).getTime() / 1000
    //             );
    //             if (currentTime < seckillTime) {
    //               console.log(this.marketingVos[0], "哇咔咔");
    //               this.timestamp.seconds = seckillTime - currentTime;
    //               this.timestamp.label = "距开始还剩";
    //               let M =
    //                 new Date(
    //                   this.marketingVos[0].startTime.replace(/-/g, "/")
    //                 ).getMonth() + 1;
    //               let D = new Date(
    //                 this.marketingVos[0].startTime.replace(/-/g, "/")
    //               ).getDate();
    //               let H = new Date(
    //                 this.marketingVos[0].startTime.replace(/-/g, "/")
    //               ).getHours();
    //               let m = new Date(
    //                 this.marketingVos[0].startTime.replace(/-/g, "/")
    //               ).getMinutes();
    //               if (m < 10) {
    //                 m = `0${m}`;
    //               }
    //               this.timestamp.startTime = `${M}月${D}日${H}:${m}`;
    //               this.timestamp.price = this.marketingVos[0].panicBuy.price;
    //               this.timestamp.dataTime = this.marketingVos[0].startTime;
    //             } else {
    //               //开始了
    //               this.timestamp.seconds = 3600 - (currentTime - seckillTime);
    //               this.timestamp.label = "距结束还剩";
    //             }
    //           } else {
    //             this.timestamp.isSeckill = false;
    //           }
    //         }
    //         if (that.skuDetail.sellOut == 1 || that.skuDetail.isGift == 1) {
    //           this.canBuyNow = false;
    //         }
    //         // this.addBrowseRecord();
    //         // this.queryCouponList();
    //         this.$nextTick(() => {
    //           this.$refs.specUnit.initData();
    //           this.$refs.baseUnit.initData();
    //         });
    //       } else {
    //         this.showActiveType = [];
    //         this.navigateTo("404");
    //       }
    //     }
    //   });
    // },
    restDetails(id, selectId,sendActiveImg,isGetApi=false) {
      this.skuId = id;
      this.batterySettingId = selectId;
      this.sendActiveImg = sendActiveImg
      this.querySkuDetail(isGetApi);
    },
    async querySkuDetail(isGetApi) {
      let that = this;
      let data = {
        sourceType: this.sourceType,
        storeId: this.idNumber,
        batterySettingId: this.batterySettingId,
      };
      if (this.recommendToken) {
        data["shareCode"] = this.recommendToken;
      }

      let skuDetailApi;
      if (this.agencyStoreId) {
        skuDetailApi = this.$u.api.AgencystoreDetails;
        data.agencyStoreId = this.agencyStoreId;
        data.skuId = this.skuId;
      } else {
        skuDetailApi = this.$u.api.QueryEleCarDetail;
        data = {
          ...data,
          ...this.sendStore
        }
        data.id = this.skuId
        delete data.storeId
        delete data.sourceType
        delete data.batterySettingId
        delete data.spuId

        data.cityCode = this.precisionGPS.areaCode ? this.precisionGPS.areaCode.slice(0, 4) + "00" : data.cityCode
        data.longitude = this.precisionGPS.longitude ? this.precisionGPS.longitude : data.longitude
        data.latitude = this.precisionGPS.latitude ? this.precisionGPS.latitude : data.latitude
        // skuDetailApi = this.$u.api.QuerySpuDetail;
        // if (this.skuId) {
        //   data.skuId = this.skuId;
        // } else {
        //   data.spuId = this.spuId;
        // }
      }

      return skuDetailApi(data)
        .then((res) => {
          if (res && res.code == 200) {
            //商品下架提示失效
            if(!res.data.id) this.noDetail = true;
            this.skuDetail = this.$u.deepClone(res.data);
            this.skuDetail.spuAttributeValues = [
              {
                attributeName: "使用推荐",
                attributeValue: this.skuDetail.recommendUse
              },
              {
                attributeName: "最高时速",
                attributeValue: this.skuDetail.maxSpeed
              },
              {
                attributeName: "整车重量",
                attributeValue: this.skuDetail.vehicleWeight
              },
              {
                attributeName: "整车尺寸",
                attributeValue: this.skuDetail.vehicleSize
              },
              {
                attributeName: "电机",
                attributeValue: this.skuDetail.electricalMachinery
              },
              {
                attributeName: "定位",
                attributeValue: this.skuDetail.gps
              },
              {
                attributeName: "开锁方式",
                attributeValue: this.skuDetail.unlockMethod
              },
              {
                attributeName: "电池名称",
                attributeValue: this.skuDetail.batteryName
              },
            ]
            this.skuDetail.sku = {
              tree: [
                {
                  k: this.skuDetail.versionName || '',
                  k_id: this.skuDetail.versionId,
                  v: this.skuDetail.versionVos
                }
              ]
            }
            this.$nextTick(() => {
              this.$refs.specUnit.initData();              
              if(!isGetApi){
                this.$refs.baseUnit.initData();
              }
            });
            if(this.skuDetail.batteryGoodsVos && this.skuDetail.batteryGoodsVos.length > 0) this.skuDetail.batteryGoodsVos = this.skuDetail.batteryGoodsVos.filter(item => item.status != 2)
            return
            that.skuDetail = res.data;
            that.sendStore.spuId = that.skuDetail.spuId;
            // 获取附近门店
            this.initStore();
            
            // that.skuDetail = detailData; 
            if (!that.skuDetail) {
              return;
            }
            that.skuId = res.data.id;
            if (this.skuDetail.spuVideo) {
              // let spuPic = this.skuDetail.spuVideoPic
              //   ? this.skuDetail.spuVideoPic
              //   : this.skuDetail.images[0]; // this.skuDetail.images[0]
              let spuPic = this.skuDetail.images[0]
              that.skuDetail.images.unshift(spuPic);

              that.skuDetail.images = that.skuDetail.images.map(item=>{
                return{
                  keys: Date.now(),
                  src: item
                }              
              }) 
              that.skuDetail.spuVideoPic = that.skuDetail.images[0].src;
            }
            // 虚拟商品是否显示值赋值，刚进来时候数据未加载先显示加入购物车按钮
            that.isVirtual = that.skuDetail.isVirtual;

            let properties = {
              spuId: res.data.spuId,
              skuId: res.data.id,
              storeId: res.data.storeId,
            };
            visit(that, "商品详情页", properties);
            let options = {},
              storeServiceConfig = that.skuDetail.storeServiceConfig;
            if (storeServiceConfig) {
              Object.keys(storeServiceConfig).forEach((key) => {
                if (storeServiceConfig[key]) {
                  if (key == "staffId") {
                    options.staffid = storeServiceConfig[key];
                  } else {
                    options[key] = storeServiceConfig[key];
                  }
                }
              });
            }
            let obj = "";
            let ysfData = {
              id: that.skuDetail.id,
              title: that.skuDetail.name,
              desc: that.skuDetail.subTitle,
              picture: that.skuDetail.images[0],
              tagsurl:
                "https://m.wsfmall.com/spudetail?id=" + that.skuDetail.id,
              navigateToUrl: `orderModule/pages/motorCarDetail/motorOrderDetail?orderId=${that.skuDetail.id}`,
              note: `￥${that.skuDetail.price}`,
              ...options,
            };
            obj = JSON.stringify(ysfData);
            uni.setStorageSync("YSFDATA", obj);
            if (
              this.skuDetail.marketingVos &&
              this.skuDetail.marketingVos.length
            ) {
              let istypeShow = that.skuDetail.marketingVos.map((temp) => {
                if (temp.type == 1 || temp.type == 16) {
                  return true;
                } else if (temp.type == 13) {
                  return "13";
                } else {
                  return false;
                }
              });
              if (istypeShow.includes("13")) {
                that.skuDetail.marketingVos.map((item) => {
                  console.log("startTime---", item.startTime);
                  let nowDate = parseInt(new Date().getTime() / 1000); //当前秒级时间戳
                  let startTime = parseInt(
                    new Date(item.startTime.replace(/-/g, "/")).getTime() / 1000
                  );
                  if (startTime > nowDate) {
                    that.skuDetail.showActiveType = [];
                  } else {
                    that.skuDetail.showActiveType = istypeShow;
                  }
                });
              } else {
                that.skuDetail.showActiveType = istypeShow;
              }

              this.marketingVos = this.skuDetail.marketingVos.filter((item) => {
                return (
                  item.type &&
                  item.type === "13" &&
                  item.panicBuy.isShow === "1"
                );
              });
              if (this.marketingVos.length < 1) {
                this.marketingVos = this.skuDetail.marketingVos.filter(
                  (item) => {
                    return item.type && item.type === "16";
                  }
                );
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
                let startTime = this.$u.deepClone(
                  this.marketingVos[0].startTime
                );
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
              this.showActiveType = [];
              this.marketingVos = []; // 如果没有活动 传入子组件[] 首单活动版本 改变数量控制是否显示限购字样
            }

            if (that.skuDetail.sellOut == 1 || that.skuDetail.isGift == 1) {
              this.canBuyNow = false;
            }
            // this.addBrowseRecord();
            // this.queryCouponList();
            this.$nextTick(() => {
              this.$refs.specUnit.initData();              
              if(!isGetApi){
                this.$refs.baseUnit.initData();
              }
              // if (
              //   (this.storeCouponList && this.storeCouponList.length > 0) ||
              //   this.accountArr.length
              // )
              // this.$refs.couponUnit.initData();
            });
            this.noDetail = false;
          } else {
            this.noDetail = true;
            this.navigateTo("404");
          }
        })
        .catch((err) => {
          console.log(err, 'uuu');
          this.noDetail = true;
        });
    },
    // 校验是否超过平台秒杀限制数
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
          this.saveLimitNum = inputNum;
          console.log("无报错 存值", this.saveLimitNum, "输入框", inputNum);
          // this.saveLimitNum = true
        }
      });
    },

    //优惠券列表
    // queryCouponList() {
    //   this.$u.api
    //     .QueryCouponList({
    //       storeId: this.skuDetail.storeId,
    //       spuId: this.skuDetail.spuId,
    //     })
    //     .then((res) => {
    //       if (res.code == 200) {
    //         this.storeCouponList = res.data;
    //       }
    //     });
    // },

    //增加浏览记录
    addBrowseRecord() {
      console.log(app.globalData.isLink, "app.globalData.isLink");
      if (app.globalData.isLink) {
        let data = {
          skuId: this.skuId,
          storeId: this.skuDetail.storeId,
          sourceType: this.sourceType,
        };
        this.$u.api.AddBrowseRecord(data).then((res) => {
          if (res.code == 200) {
            console.log("增加浏览记录成功");
          }
        });
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

    //立即购买
    bugNow() {
      if (this.canBuyNow) {
        app.globalData.pageSign = "SkuDetail";
        app.globalData.skuId = this.skuId;
        this.$refs.specUnit.openSkuModal(1);
      }
    },
    chooseSku() {
      this.$refs.specUnit.openSkuModal(1);
    },
    setBoxTop() {
      // console.log("监听滚轮");
      uni
        .createSelectorQuery()
        .select("#tabsBox")
        .boundingClientRect((data) => {
          this.topBox = data.height;
          // console.log("头部tabs-----节点离页面顶部的距离为" + this.topBox);
        })
        .exec();
      uni
        .createSelectorQuery()
        .select("#detailBox")
        .boundingClientRect((data) => {
			console.log(data,'data==============',this.topBox);
			this.detailBox = Number.parseInt(data.top - this.topBox);
            if (this.detailBox <= 100) {
              this.tabIndex = 1;
            } else {
              this.tabIndex = 0;
            }
        })
        .exec();
    },
    serviceShare() {
      this.shareColumn = 1;
      this.showShareModal = true;
    },
    cancelShare() {
      this.showPost = false;
    },
    closePost() {
      this.showPost = false;
    },
    clickFun() {
      let params = {
        type: 0,
        id: this.skuDetail.id,
      };
      this.$store.dispatch("SETTINGS/shareVisitRequest", params);
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
          this.showShareModal = false;
          let codeData = {
            scene: "s=" + this.skuDetail.id + "&c=" + this.recommendToken,
            page: "motorModule/pages/motorCarDetail/detail",
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
              this.shareQrcode =
                "data:image/png;base64," + uni.arrayBufferToBase64(res.data);
              console.log(
                "data:image/png;base64," + uni.arrayBufferToBase64(res.data),
                "uniBase64"
              );
              // this.creatCanvasPost();
              this.removeBeforeFiles();
              // base64ToPath(base64)
              //   .then(path => {
              //     console.log(path)
              // 		this.shareQrcode =  path
              //   })
              //   .catch(error => {
              //     console.error(error)
              //   })
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
    removeBeforeFiles() {
      removeSave()
        .then(() => {
          this.getUseCode();
        })
        .catch((e) => {
          console.log(e);
        });
    },
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
    creatCanvasPost() {
      let skuName = this.skuDetail.shareMsg;
      // if (skuName.length > 30) {
      //   skuName = skuName.substr(0, 30) + "…";
      // }
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

        // 画图
        await that.$refs.rCanvas
          .drawImage({
            url: this.skuDetail.shareImage,
            x: 12,
            y: 12,
            w: 217,
            h: 217,
          })
          .catch((err_msg) => {
            this.showToastError("海报生成失败，请稍后重试");
          });

        // 画文字
        // await that.$refs.rCanvas
        //   .drawText({
        //     text: "￥",
        //     x: 12,
        //     y: 254,
        //     font_color: "#E60113",
        //     font_size: 12,
        //     font_weight: "bold",
        //   })
        //   .catch((err_msg) => {
        //     this.showToastError("海报生成失败，请稍后重试");
        //   });

        // await that.$refs.rCanvas
        //   .drawText({
        //     text: (this.skuDetail.retailPrice / 100).toFixed(2),
        //     x: 24,
        //     y: 254,
        //     font_color: "#E60113",
        //     font_size: 17,
        //     font_weight: "bold",
        //   })
        //   .catch((err_msg) => {
        //     this.showToastError("海报生成失败，请稍后重试");
        //   });

        // await that.$refs.rCanvas
        //   .drawText({
        //     text: "价格具有时效性",
        //     x: 12,
        //     y: 270,
        //     font_color: "#666",
        //     font_size: 9,
        //     font_weight: "lighter",
        //   })
        //   .catch((err_msg) => {
        //     this.showToastError("海报生成失败，请稍后重试");
        //   });

        await that.$refs.rCanvas
          .drawText({
            text: skuName,
            max_width: 130,
            x: 12,
            y: 256,
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
            url: "https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com///198ad539297fc070566ba83685372bb9.png",
            x: 103,
            y: 364,
            w: 36,
            h: 12,
          })
          .catch((err_msg) => {
            this.showToastError("海报生成失败，请稍后重试");
          });
        console.log(this.shareQrcode, "this.shareQrcode");
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
          console.log(res.tempFilePath, "res.tempFilePath");
          //res.tempFilePath：生成成功，返回base64图片
          pathToBase64(res.tempFilePath)
            .then((base64) => {
              console.log("fffss");
              this.canvasPostImg = base64;
              this.showPost = true;
              this.showShareModal = false;
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
      let that = this;
      // uni.showShareImageMenu({
      //   path: this.filePostImg
      // })
      uni.saveImageToPhotosAlbum({
        filePath: this.filePostImg,
        success() {
          that.clickFun();
          uni.showToast({
            title: "保存成功",
            icon: "none",
          });
        },
        fail(err) {
          console.log(err, 'mkmk');
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
    closeStore() {
      this.showAll = false
    }
  },
};
</script>

<style lang="scss" scoped>
.container {
  padding-bottom: 48rpx;
}
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
  box-shadow: 0rpx 8rpx 20rpx 0rpx rgba(217, 217, 217, 0.15);
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
    width: 50%;
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
  box-shadow: 0rpx -8rpx 20rpx 0rpx rgba(217, 217, 217, 0.2);
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
    width: 82%;
    height: 80rpx;
    border-radius: 40rpx;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    font-size: 32rpx;
    font-weight: 500;
    p {
      color: #fff;
    }
    &:last-child {
      margin-right: 0;
    }
  }

  .bug-now {
    background: linear-gradient(270deg, #FE3040 0%, #FF8011 100%);
    color: #fff;
    margin-right: 24rpx !important;
  }
  .btn-grey {
    background: #f2f2f2;
    color: #bababa;
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

.module-detail {
  margin-top: 40rpx;
  padding-bottom: env(safe-area-inset-bottom);
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
  background: #f6f6f6;
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
.sku-stores {
  margin: 16rpx 24rpx 0;
}
.selectBox {
  padding:0 24rpx;
  margin-top: 16rpx;
  .selectSku {
    padding: 24rpx;
    border-radius: 24rpx;
    background: #fff;
    display: flex;
    align-items: center;
    .skuSelectList {
      width: 90%;
      display: flex;
      align-items: center;
    }
    .selectImg {
      width: 64rpx;
      height: 64rpx;
      margin-right: 12rpx;
      border-radius: 12rpx;
    }
    // .selectImg:last-of-type {
    //   width: 64rpx;
    //   height: 64rpx;
    //   margin-right: 0rpx;
    //   opacity: 0.5;
    // }
    .selectText {
      // margin-left: -64rpx;
      font-size: 13px;
      color: #444444;
    }
    .selectArrow {
      width: 32rpx;
      height: 32rpx;
    }
  }
}

.store-popup {
  // background: #F6F6F6;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  .store-popup-title {
    text-align: center;
    color: #000d1d;
    font-size: 32rpx;
    line-height: 44rpx;
    position: relative;
    padding-top: 24rpx;
    padding-bottom: 24rpx;
    // background: #fff;
    > image {
      position: absolute;
      right: 48rpx;
      top: 30rpx;
      height: 40rpx;
      width: 54rpx;
    }
  }
  .store-box {
      background: #f6f6f6;
      border-radius: 24rpx 24rpx 0 0;
      position: relative;
      flex: 1;
      box-sizing: border-box;
      height: 100%;
      .store-view {
        padding: 24rpx 32rpx;
        padding-bottom: 120rpx;
      }
      .more-tip {
        margin-top: 32rpx;
        color: #999;
        font-size: 26rpx;
        text-align: center;
        line-height: 34rpx;
      }
  }
}
</style>

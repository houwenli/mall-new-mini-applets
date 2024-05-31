<template>
  <view class="container" >
    <back-top :topSearch="topSearch" to="Distribution"></back-top>
    <view v-if="!noDetail">
      <view
        class="header-tabs-wrap"
        :style="{'top': showHeader_ ? barHeight : '-1000rpx'}"
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
      <view class="feature-tabs">
        <view class="btn-top" v-if="showHeader" @click="backTop">
          <img src="https://wsjc-web.wsecar.com/wsf-mall/skuDetail/icon-roff.png" alt="">
          <span>顶部</span>
        </view>
      </view>
      <!-- 商品基本信息 -->
      <view id="product" class="module-base" ref="product"
        ><base-module
          ref="baseUnit"
          :bestCoupon="bestCoupon"
          :skuData="skuDetail"
          :isMark="favourite"
          @changeAttention="favouriteGood"
          @restDetails="restDetails"
          :marketingVos="marketingVos"
          :skuId="skuId"
        ></base-module
      ></view>
      <!-- 优惠券 -->
      <coupon-module
          ref="couponUnit"
          :skuData="skuDetail"
      ></coupon-module>
      <!-- 规格运费 -->
      <view class="module-evaluate">
        <spec-module
          ref="specUnit"
          :couponList="storeCouponList"
          :skuId="skuId"
          :timestamp="timestamp"
          :skuData="skuDetail"
          :promoteInfo="promoteInfo"
          :marketingVos="marketingVos"
          :recommendToken="recommendToken"
          :saveLimitNum="saveLimitNum"
          :sourceType="sourceType"
          @restDetails="restDetails"
          @updateSku="updatePage"
          @loadCartCount="loadShoppingCartCount"
          @minusBlur="minusBlur"
          @minus="minusFun"
          @plus="plusFun"
          :sendActiveImg="sendActiveImg"
        ></spec-module>
      </view>
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
      <view class="module-goods-list"
        ref="recommendBox"
        id="recommendBox"
      >
        <view class="goodsTitle"><img :src="`${smartImg}/home/smart_hot_goods.png`" alt=""></view>
        <wsf-goods-list
          :list="flowList"
          :loadStatus="loadStatus"
          loadMoreScene="detail"
          from-page="distributionUserPage"
          @goodsClick="goodsClick($event)"
        ></wsf-goods-list>
      </view>
      <view
        class="gift-product-tip"
        v-if="skuDetail.shelvesStatus == 0 || skuDetail.shelvesStatus == 2"
        >抱歉，该商品已下架</view
      >
      <view class="gift-product-tip" v-else-if="skuDetail.isGift == 1"
        >抱歉，该商品不支持单独购买</view
      >
      <view class="gift-product-tip" v-else-if="skuDetail.tabooStatus == 1"
        >该商品暂不支持分销，换个商品试试吧</view
      >
      <view
        class="bottom-column u-flex"
      >
        <view
          class="service-btn"
          @click="serviceTel({ tit: '商品' })"
        >
          <img src="https://wsjc-web.wsecar.com/wsf-mall/skuDetail/icon-service.png" alt="">
          <p>客服</p>
        </view>
        <view class="bug-now" :class="{'btn-grey-border':!isShare}" @tap="handleNewShareFun()">
          <p v-if="skuDetail.preCommission || skuDetail.preCommission === 0" class="p-1"><span class="spn-1">预估佣金</span><span class="spn-2">¥</span><span class="spn-3">{{reducedPriceFloat[0]}}</span><span class="spn-2">{{'.' +reducedPriceFloat[1]}}</span></p>
          <p class="p-2">立即分享</p>
        </view>
        <view
          class="column-btn"
          :class="{ 'add-cart': canBuyNow, 'btn-grey': !canBuyNow }"
          @click="bugNow(1)"
        >
          立即购买
        </view>
      </view>
      <view class="footer-bottom-space" v-if="isNeedBottomSpace"></view>
      <view class="bottom-block-space"></view>

      <wsf-confirm
        v-model="showConfirm"
        :title="confirmContext"
        :activeText="confirmButton"
        :cancelText="cancelButton"
        @confirm="activeConfirm"
        @cancel="activeCancel"
      ></wsf-confirm>

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
            <button class="share-way-part" open-type="share" @click="clickFun">
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
          <view class="cancel-btn" @click="cancelShare">取消</view>
        </view>
      </u-popup>

      <!-- canvas画布 -->
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
    <view v-else class="emtpy-page">
      <image class="emtpy-page-img" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/main-packages/isEmpty-icon/cart.png" mode=""></image>
      <view class="emtpy-page-text"> 哇呜，商品链接已失效〜 </view>
      <view class="emtpy-page-btn" @click="goIndex"> 看看其他 </view>
    </view>
  </view>
</template>

<script>
const app = getApp();
import { writeFile, removeSave } from "@/common/uploadFile.js";
import rCanvas from "@/components/r-canvas/r-canvas.vue";
import {
  pathToBase64
} from "@/components/r-canvas/image-tools/index.js";
import closeImg from "@/static/img/icon/close_white@2x.png";
import baseModule from "./components/baseModule.vue";
import specModule from "./components/specModule.vue";
import commentModule from "./components/commentModule.vue";
import overviewModule from "./components/overviewModule.vue";
import paramModule from "./components/paramModule.vue";
import couponModule from "./components/couponModule.vue";
import wsfGoodsList from "@/components/wsf-goods-list/wsf-goods-list.vue";
import { priceFilter } from "@/common/wsfFilter.js";
import httpInterceptor from "@/common/http.interceptor.js";
import wsfConfirm from "@/components/wsf-confirm/wsf-confirm.vue";
import { visit } from "@/common/visit.js";
import backTop from "@/components/backTop.vue";


export default {
  components: {
    baseModule,
    specModule,
    commentModule,
    overviewModule,
    paramModule,
    couponModule,
    wsfGoodsList,
    rCanvas,
    wsfConfirm,
    backTop,
  },
  data() {
    return {
      smartImg:this.$smartImg,
      noDetail:false,
      timestamp: {},
      marketingVos: [],
      distributionCode: null,
      noStatusShare: false,
      filePostImg: null,
      canvasPostImg: null,
      shareQrcode: null,
      showPost: false,
      shareColumn: -1,
      shareType: null,
      showConfirm: false,
      confirmContext: "",
      confirmButton: "确认",
      cancelButton: "取消",
      showShareModal: false,
      selfBuyReturn: -1,
      bestCoupon: null,
      recommendToken: "",
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
        pageNum: 0,
        pageSize: 10,
        pageType: 13
      },
      recommendSku: [],
      skuId: "",
      scrollTop: 0,
      closeImg: closeImg,
      canAddCart: true,
      canBuyNow: true,
      flowList: [],
      loadStatus: "loadmore", // 加载更多样式效果
      isLoading: false, // 是否正在加载
      hasMore: true, // 是否拥有更多
      promoteInfo: {},
      saveLimitNum: 1,
      sourceType: 1,
      isNeedBottomSpace: getApp().globalData.isNeedBottomSpace,
			isShare:true,
      topSearch: false,
      showHeader_: false,
      barHeight: '0px',
      tabsBox: "",
      topBox: "",
      detailBox: "",
      commentBox: "",
      recommendBox: "",
      sendActiveImg: ''
    };
  },
  onLoad(option) {

    let { height, top } = getApp().globalData.capsule
    let { statusBarHeight } = uni.getSystemInfoSync();
    this.barHeight = (top * 2 - statusBarHeight + height ) + 'px'

    if (option) {
      this.skuId = option.skuId;
    }
    uni
      .createSelectorQuery()
      .select("#detailBox")
      .boundingClientRect((data) => {
        this.overviewHeight = data.top
      })
      .exec();
    console.log("option", option);
    // 详情点击埋点
    this.$u.api.detailsVisit({
      skuId: this.skuId
    })
  },
  onShow(option) {
    // this.getselfBuyReturn();
    this.querySkuDetail();
  },
  computed: {
      reducedPriceFloat() {
        let preCommission = 0;
        let list = []
        if (this.skuDetail && this.skuDetail.preCommission) {
          preCommission = this.skuDetail.preCommission;
        }
        list = preCommission.toFixed(2).split(".");
        return list;
      },
  },
  onPageScroll(e) {
    this.scrollTop = e.scrollTop;
    if (this.scrollTop > 100) {
      this.topSearch = true
      this.showHeader_ = true;
    } else {
      this.topSearch = false
      this.showHeader_ = false;
    }
    // 监听页面滚动--tabs对应切换   节流
    this.$u.debounce(this.setBoxTop, 50);
    if (this.scrollTop > 1500) {
      this.showHeader = true;
    } else {
      this.showHeader = false;
    }
  },
  onReachBottom() {
    this.getRecommendList();
  },
  onShareAppMessage(options) {
    if (options.from === "button") {
      this.showShareModal = false;
      console.log(this.distributionCode, "this.distributionCode");
      // 来自页面内分享按钮
      let url;
      // if (this.noStatusShare) {
      // 	url = 'productModule/pages/skuDetail/skuDetail?skuId=' + this.skuDetail.id;
      // } else {
      // 	url = 'productModule/pages/skuDetail/skuDetail?s=' + this.skuDetail.id + '&c=' + this.distributionCode;
      // }
      url =
        "productModule/pages/skuDetail/skuDetail?s=" +
        this.skuDetail.id +
        "&c=" +
        this.distributionCode;
      return {
        title: `¥${this.skuDetail.price.toFixed(2)} | ${this.skuDetail.name}`,
        desc: this.skuDetail.subTitle,
        imageUrl: this.skuDetail.shareImage || this.skuDetail.images[0],
        path: url,
      };
    } else {
      let url =
        "productModule/pages/skuDetail/skuDetail?skuId=" + this.skuDetail.id;
      return {
        title: `¥${this.skuDetail.price.toFixed(2)} | ${this.skuDetail.name}`,
        desc: this.skuDetail.subTitle,
        imageUrl: this.skuDetail.shareImage || this.skuDetail.images[0],
        path: url,
      };
    }
  },
  methods: {
    //去首页
    goIndex() {
      this.$wsf.go("Distribution");
    },
    goToTop () {
      uni.pageScrollTo({
        duration: 300,
        scrollTop: this.overviewHeight + 10,
      });
    },
    stopTouch() {
      return false;
    },
    closePost() {
      this.showPost = false;
    },
    savePost() {
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
            title: "保存失败,请重试",
            icon: "none",
          });
        },
      });
    },
    cancelShare() {
      this.showShareModal = false;
      this.showPost = false;
    },
    activeConfirm() {
      if (this.shareType == 1) {
        this.showConfirm = false;
        this.$wsf.go("SkuDetail", { skuId: this.skuDetail.id });
      } else if (this.shareType == 2) {
        // this.noStatusShare = true;
        // this.shareColumn = 1;
        // this.showShareModal = true;
        // this.showConfirm = false;

        // 方案100003 分销分享新方案入口
        this.$wsf.go("distributionSpuShare", { id: this.skuId });
      }
    },
    activeCancel() {
      this.noStatusShare = false;
      this.showConfirm = false;
    },
    //查询自买返资格
    getselfBuyReturn() {
      this.$u.api.getRulesList().then((res) => {
        this.selfBuyReturn = res.data.selfBuyReturn;
      });
    },
    // 分享or立即购买
    handlePageBtn(type) {
      if (!this.canBuyNow || !this.canAddCart) {
        return;
      }

      let data = {
        spuId: this.skuDetail.spuId,
      };
      if (type == 1) {
        data["buyNowFlag"] = true;
      }
      this.$u.api.shareForDistribution(data).then((res) => {
        if (res.data.code != 200) {
          if (
            (res.data.code == 4111 && type == 2) ||
            (type == 1 && this.selfBuyReturn == 1)
          ) {
            this.shareType = type;
            this.confirmContext = res.data.description;
            this.showConfirm = true;
          } else {
            this.$u.toast(res.data.description);
          }
        } else {
          this.distributionCode = res.data.data;
          switch (type) {
            case 1:
              this.$wsf.go("SkuDetail", {
                s: this.skuDetail.id,
                c: this.distributionCode,
              });
              break;

            case 2:
              // this.shareColumn = 1;
              // this.showShareModal = true;

              // 方案100003 分销分享新方案入口
              this.$wsf.go("distributionSpuShare", {
                id: this.skuId,
                distributionCode: this.distributionCode,
                type: 3,
              });
              break;

            default:
              break;
          }
        }
      });
    },
    creatCanvasPost() {
      let skuName = this.skuDetail.name;
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

        // 画图
        await that.$refs.rCanvas
          .drawImage({
            url: this.skuDetail.images[0],
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
    clickFun() {
      let params = {
        type: 3,
        id: this.skuDetail.id,
      };
      this.$store.dispatch("SETTINGS/shareVisitRequest", params);
    },
    handleShareWay(type) {
      switch (type) {
        //分享小程序给微信好友
        case 1:
          this.clickFun();
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
            scene: "s=" + this.skuDetail.id + "&c=" + this.distributionCode,
            page: "productModule/pages/skuDetail/skuDetail",
            width: 60,
            autoColor: false,
            isCyaline: "true",
          };
          if (this.noStatusShare) {
            codeData.scene = "skuId=" + this.skuDetail.id;
          }
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
          this.clickFun();
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

    //返回顶部
    backTop() {
      uni.pageScrollTo({
        duration: 300,
        scrollTop: 0,
      });
    },
    // 切换分类
    changeTab(item) {
      this.tabIndex = item.id;
      let name = "#" + item.mark;
      let top = this.topBox;
      this.$u.debounce(() => {
        uni
        .createSelectorQuery()
        .select(name)
        .boundingClientRect((data) => {
          console.log("目标节点盒子"+name, data, '滚动位置scroTop：', data.top + this.scrollTop - this.topBox - 8, this.scrollTop)
          uni.pageScrollTo({
            duration: 300, //过渡时间必须为0，uniapp bug，否则运行到手机会报错
            scrollTop: data.top + this.scrollTop - this.topBox - 8, //滚动到实际距离是元素距离顶部的距离减去最外层盒子的滚动距离
          });
        })
        .exec();
      }, 300)
    },
    querySkuDetail(isGetApi) {
      let that = this;
      let data = {
        skuId: this.skuId,
        commFlag: 1,
      };
      return this.$u.api
        .QuerySpuDetail(data)
        .then((res) => {         
          if (res && res.code == 200) {          
            that.skuDetail = res.data;
            if (!that.skuDetail) {
              return;
            }

            if (this.skuDetail.spuVideo) {
              // let spuPic = this.skuDetail.spuVideoPic
              //   ? this.skuDetail.spuVideoPic
              //   : this.skuDetail.images[0]; // this.skuDetail.images[0]
              // let spuPic = this.skuDetail.spuVideo ? this.skuDetail.spuVideo + '?x-oss-process=video/snapshot,t_0,f_jpg':this.skuDetail.images[0]; // this.skuDetail.images[0]
              let spuPic = this.skuDetail.images[0]
              that.skuDetail.images.unshift(spuPic);              
              that.skuDetail.images = that.skuDetail.images.map(item=>{
                return{
                  keys: Date.now(),
                  src: item
                }              
              })          
              that.skuDetail.spuVideoPic = that.skuDetail.images[0].src
            }
            // 虚拟商品是否显示值赋值，刚进来时候数据未加载先显示加入购物车按钮
            that.isVirtual = that.skuDetail.isVirtual;
            console.log("===========0=============");
            let properties = {
              spuId: res.data.spuId,
              skuId: res.data.id,
              storeId: res.data.storeId,
            };
            visit(that, "商品详情页", properties);
            console.log("===========1=============");
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
              navigateToUrl: `/productModule/pages/skuDetail/skuDetail?skuId=${that.skuDetail.id}`,
              note: `￥${that.skuDetail.price}`,
              ...options,
            };
            obj = JSON.stringify(ysfData);
            uni.setStorageSync("YSFDATA", obj);

            this.showActiveType = [];
            this.marketingVos = []; // 如果没有活动 传入子组件[] 首单活动版本 改变数量控制是否显示限购字样

            if (this.skuDetail.hasAtten) {
              this.favourite = true;
            } else {
              this.favourite = false;
            }

            if (that.skuDetail.sellOut == 1 || that.skuDetail.isGift == 1) {
              this.canAddCart = false;
              this.canBuyNow = false;
            }
						if(that.skuDetail.tabooStatus==1){
							this.isShare = false;
							this.canBuyNow = false;
							// this.$u.toast(`该商品暂不支持分销，换个商品试试吧`);
						}

            this.getRecommendList();
            this.addBrowseRecord();
            this.$nextTick(() => {
              this.$refs.specUnit.initData();              
              if(!isGetApi){
                this.$refs.baseUnit.initData();
              }
              this.$refs.commentUnit.initData();
            });
            this.noDetail = false;
          } else {
            this.noDetail = true;
            this.navigateTo("404");
          }
        })
        .catch((err) => {        
          // this.showToastError(err.data.msg, 1000)        
          this.noDetail = true;
        });
    },
    //热销商品商品列表
    getRecommendList() {
      let that = this;
      if (this.isLoading || !this.hasMore) return;
      this.isLoading = true;
      this.loadStatus = "loading";
      this.queryForm.skuId = this.skuId
      // GetRecommendList
      this.$u.api.QueryRecommendCommodity(this.queryForm).then((res) => {
        this.isLoading = false;
        this.loadStatus = "loadmore";
        console.log("res", res);
        if (res.code === 200) {
          this.flowList = this.flowList.concat(
            res.data.map((item) => {
              item.price = this.priceFilter(item.price);
              item.fromUser = false
              return item;
            })
          );
          this.queryForm.pageNum++;
          this.hasMore = res.data.length === 10;
          this.loadStatus = res.data.length === 10 ? "loadmore" : "nomore";
        }
      });
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
    restDetails(id,sendActiveImg,isGetApi=false) {
      this.skuId = id;
      this.sendActiveImg = sendActiveImg
      this.querySkuDetail(isGetApi);
    },
    //增加浏览记录
    addBrowseRecord() {
      console.log(app.globalData.isLink, "app.globalData.isLink");
      if (app.globalData.isLink) {
        let data = {
          skuId: this.skuId,
          storeId: this.skuDetail.storeId,
          sourceType: 1,
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
    showToastError(errMsg, duration = 1500) {
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
      this.navigateTo("distributionSkuDetail", { skuId: param });
    },
    //收藏/取消收藏
    favouriteGood() {
      if (!app.globalData.isLink) {
        this.navigateTo("QuickLogin");
        return;
      }
      if (this.skuDetail.hasAtten) {
        let data = {
          skuId: this.skuDetail.sku.id,
          storeId: this.skuDetail.storeId,
        };
        this.$u.api.CancelSkuAttention(data).then((res) => {
          if (res.code == 200) {
            this.showToastError("取消收藏");
            this.favourite = false;
            this.skuDetail.hasAtten = false;
          }
        });
      } else {
        let data = {
          skuId: this.skuDetail.sku.id,
          storeId: this.skuDetail.storeId,
          sourceType: 1,
        };
        this.$u.api.AddSkuAttention(data).then((res) => {
          if (res.code == 200) {
            this.showToastError("收藏成功");
            this.favourite = true;
            this.skuDetail.hasAtten = true;
          }
        });
      }
    },
    //2022/10/27 新版分享方法
    handleNewShareFun(){
			if(this.isShare){
				this.checkPermission().then((isPass) => {
					console.log(isPass,"isPass");
					if (!isPass) return;
					this.getShareCode(this.skuDetail.spuId);
					this.showShareModal = true;
				})
			}
    },
    getShareCode(spuId) {
      let param = {
        spuId: spuId,
        recommendUserType: this.promoteInfo.promoteType,
        phone: this.promoteInfo.phone,
        customerId: this.promoteInfo.promoteId,
      };
      this.$u.api.ShareForDistribution(param).then((res) => {
        this.distributionCode = res.data.data;
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
    getPost() {
      let params = {
        scene: `s=${this.skuDetail.id}&c=${this.distributionCode}`,
        page: "productModule/pages/skuDetail/skuDetail",
        width: 60,
        autoColor: false,
        lineColor: "",
        isHyaline: false,
        suncode: this.distributionCode,
        goodsImgUrl: this.skuDetail.shareImage,
        goodsName: this.skuDetail.name,
        price: this.skuDetail.price,
      };
      this.$u.api.CreateShareCode(params).then((res) => {
        this.showShareModal = false;
        let path = res.data.wsSunCodeUrl;

        wx.downloadFile({
          url: res.data.wsSunCodeUrl,
          success: (res) => {
            console.log("---wx.downloadFil--成功--", res);
            uni.showShareImageMenu({
              path: res.tempFilePath,
              success: (res) => {
                if (res.errMsg == "showShareImageMenu:ok") {
                  this.$u.toast("保存成功！");
                }
              },
              fail: (res) => {
                console.log(res);
                if (res.errMsg == "showShareImageMenu:fail auth deny") {
                  this.$u.toast("保存失败！");
                }
              },
            });
          },
        });
      });
    },
    checkPermission() {
      return new Promise((resolve, reject) => {
        let userInfo = uni.getStorageSync("userInfo");
        let params = {
          userId: userInfo.id,
          userPhone: userInfo.mobile,
        };
        this.$u.api.QueryIsDistribution(params).then((response) => {
          if (response.data.code == 1) {
            if (
              !response.data.isDistribution ||
              response.data.isDistribution == 0
            ) {
              let info = {
                userId: userInfo.id,
                userPhone: userInfo.mobile,
                userName: userInfo.userName,
              };
              this.$wsf.go("PromotionRegister", info);
              reject();
            } else {
              this.promoteInfo = {
                promoteId: response.data.promoteId,
                promoteType: response.data.promoteType,
                phone: response.data.mobile,
              };
              resolve(true);
            }
          } else {
            // uni.switchTab({
            //   url: "/pages/index/index",
            // });
            // setTimeout(() => {
            uni.showToast({
              title: response.data.msg,
              icon: "none",
            });
            // }, 500);
            reject();
          }
        });
      });
    },

    setBoxTop() {

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
          // console.log("详情",this.detailBox,data);
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
          // console.log("评论",this.commentBox,data);
          if (this.commentBox <= 30 ) {
            this.tabIndex = 2;
          }
        })
        .exec();
      uni
        .createSelectorQuery()
        .select("#recommendBox")
        .boundingClientRect((data) => {
          this.recommendBox = Number.parseInt(data.top - this.topBox);
          // console.log("推荐",this.recommendBox,data);
          if (this.recommendBox <= 30) {
            this.tabIndex = 3;
          }
        })
        .exec();
    },
  },
};
</script>

<style lang="scss" scoped>
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
.container {
  padding-bottom: 100rpx;
}
.feature-tabs {
  position: fixed;
  z-index: 999;
  right: 24rpx;
  bottom: 186rpx;
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
  bottom: 168rpx;
  text-align: center;
  line-height: 80rpx;
  color: #fff;
}
.bottom-column {
  width: 100%;
  // height: 100rpx;
  position: fixed;
  z-index: 99;
  background-color: #fff;
  bottom: 0;
  box-shadow: 0rpx -8rpx 20rpx 0rpx rgba(217,217,217,0.2);
  padding-right: 24rpx;
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
    margin-right: 18rpx;
    width: 72%;
    height: 80rpx;
    border-radius: 40rpx;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    font-size: 32rpx;
    font-weight: 500;
    p {
      color: #ffffff;
    }
    &:last-child {
      margin-right: 0;
    }
  }
  .add-cart {
    background: linear-gradient(90deg, #FF8011 0%, #FE3040 100%);
    color: #ffffff;
    margin-right: 24rpx !important;
    font-weight: 600;
    margin-right: 24rpx !important;
  }
  .bug-now {
    background: #FFBE0C;
    margin-right: 18rpx;
    width: 72%;
    height: 80rpx;
    border-radius: 40rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    box-sizing:border-box;
    color: #FFFFFF;
    font-weight: 600;
    .p-1 {
      .spn-1 {
        font-size: 22rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
      }
      .spn-2 {
        font-size: 20rpx;
        font-family: DINAlternate-Bold, DINAlternate;
        font-weight: bold;
      }
      .spn-3 {
        font-size: 26rpx;
        font-family: DINAlternate-Bold, DINAlternate;
        font-weight: bold;
      }
    }
    .p-2 {
      font-size: 26rpx;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
    }
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
.footer-bottom-space {
  position: fixed;
  bottom: 0;
  height: 68rpx;
  width: 100%;
  background-color: #fff;
  z-index: 999;
}
.bottom-block-space {
  height: 120rpx;
}
.bottom-block {
  width: 100%;
  position: fixed;
  z-index: 999;
  background-color: #fff;
  border-top: 1px solid #f2f2f2;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-bottom: env(safe-area-inset-bottom);
  .block-btn {
    width: 686rpx;
    height: 80rpx;
    border-radius: 40rpx;
    background: #ffa000;
    line-height: 80rpx;
    text-align: center;
    color: #fff;
    font-size: 28rpx;
    font-weight: 500;
    margin: 10rpx 0;
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

.goodsTitle {
  font-size: 30rpx;
  font-weight: bold;
  color: #000;
}

.bottom-column-space {
  bottom: 68rpx !important;
}
.module-base {
  background: #F6F6F6;
}
.module-evaluate {
  margin: 24rpx;
  margin-bottom: 0;
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
.module-goods-list {
  margin: 0 24rpx;
  padding-top: 40rpx;
}
.goodsTitle {
  margin-bottom: 20rpx;
  text-align: center;
  img {
    width: 498rpx;
    height: 32rpx;
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
</style>

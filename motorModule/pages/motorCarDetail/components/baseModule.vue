<template>
  <view>
    <view class="bannerBox">
      <swiper
        class="swiper"
        :interval="3000"
        :circular="true"
        :autoplay="false"
        :current="swiperCurrent"
        :indicator-dots="false"
        @change="bannerChange"
      >
        <swiper-item
          class="swiper-items"
          v-for="(item, index) in skuData.imageUrls"
          :key="item.src"
        >
          <video
            style="width: 100%; height: 100%"
            id="videoBanner"
            ref="videoBanner"
            :poster="skuData.spuVideoPic"
            :src="skuData.spuVideo"
            :show-center-play-btn="true"
            :show-loading="false"
            object-fit="fill"
            :controls="controlsShow"
            :seeked="true"
            class="bannerVideo"
            v-if="bannerCurrent == 0 && skuData.spuVideo"
            @play="play()"
            @ended="endVideo()"
          ></video>
          <image
            :src="item.src ? item.src : item"
            mode="aspectFill"
            class="swiper-img"
            @tap="previewImg(index)"
          ></image>
        </swiper-item>
      </swiper>
      <view class="currentBox" v-if="skuData.imageUrls && skuData.imageUrls.length">
        {{ bannerCurrent + 1 }}/{{ skuData.imageUrls.length }}
      </view>
    </view>
    <!-- <view class="property-swiper" v-if="treeLength.length >= 2">
      <view class="num-property">
        <p>
          <span>{{ treeLength.length }}</span
          >种
        </p>
        <p>可选</p>
      </view>
      <view class="property">
        <scroll-view class="scroll-view_H" scroll-x="true" scroll-left="0" scroll-with-animation :scroll-into-view="scrollFCateId">
          <view class="flex-swiper">
            <img
              v-for="(item, index) in treeLength"
              :key="index"            
              :class="[
                item.disabled ? 'disable' : '',
                firstOrderSkuId==item.id? 'activity' : '',
              ]"
              :src="item.imgUrl"
              alt=""
              @click="pitchOnFun(item, index)"
              :id="'fCate' + item.id"
            />
          </view>
        </scroll-view>
      </view>
    </view> -->

    <view class="conent-nav">
      <!-- <view class="base-info u-flex u-row-between">
        <image
          v-if="skuData.sellOut == 1 && skuData.shelvesStatus == '1'"
          class="soldout-img"
          src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/prev-icon-list/cat_soldout%402x.png"
        ></image>
        <view>
          <p class="current-price">
            <template
              v-if="skuData.shelvesStatus == 0 || skuData.shelvesStatus == 2"
            >
              <text>暂无售价</text>
            </template>
            <template v-else>
              <view>
                <i>￥</i>
                <span>{{ skuPriceFloat(0) }}</span>
                <text class="u-font-text">{{ "." + skuPriceFloat(1) }}</text>
              </view>
              <view
                v-if="skuData.afterCouponPrice && sourceType == 1"
                class="reduced-price"
              >
                <span>券后</span>
                <i>￥</i>
                <text class="txt1">{{ reducedPriceFloat[0] }}</text>
                <text class="txt2">{{ "." + reducedPriceFloat[1] }}</text>
              </view>
              <view
                v-if="
                  skuData.oldPrice > skuData.price && !skuData.afterCouponPrice
                "
                class="reduced-original"
              >
                <i>￥</i>
                <text class="txt1">{{ oldPriceflot[0] }}</text>
                <text class="txt2">{{ "." + oldPriceflot[1] }}</text>
              </view>
            </template>
          </p>
        </view>
      </view> -->
      <view class="product-title">{{ skuData.motorcycleTypeName }}</view>
      <!-- <view class="product-subtitle">{{ skuData.subTitle }}</view> -->

      <view class="attr-box">
        <view
          class="attr-item"
          v-for="(item, index) in getAttrList"
          :class="{ 'first-line': index < 3 }"
          :key="index"
        >
          <view class="label">{{ item.attributeName || '' }}</view>
          <view class="value">{{ item.attributeValue || '' }}</view>
        </view>
        <view class="more" v-if="skuData.spuAttributeValues && skuData.spuAttributeValues.length > 5">
          <view class="more-wrapper" @click="openAllBasic()">
            <image src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/motorCar/basic_more_icon.png"></image>
            <view>更多参数</view>
          </view>
        </view>
      </view>
    </view>

    <wsf-popup v-model="showAll" mode="bottom" border-radius="20">
      <view class="basic-popup">
        <view class="basic-popup-title">
          车型参数
          <image
            src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/motorCar/basic_close_icon.png"
            @click="handleCloseParam"
          />
        </view>
        <view class="basic-popup-content">
          <view class="view-table">
            <view
              class="tr"
              v-for="(attribute, index) in skuData.spuAttributeValues"
              :key="index"
            >
              <view class="td-1">{{ attribute.attributeName || '' }}</view>
              <view class="td-2">{{ attribute.attributeValue || '' }}</view>
            </view>
          </view>

          <!-- <view class="tip-title">提示</view>
          <view class="tip-content">
            *续航里程数值因测试环境不同会有较大差异。理论续航是该产品在骑行者体重70kg，环境温度25°C，时速25km/h等实验室环境下的测试数据。*续航里程数值因测试环境不同会有较大差异。理论续航是该产品在骑行者体重70kg，环境温度25°C，时速25km/h等实验室环境下的测试数据。*续航里程数值因测试环境不同会有较大差异。理论续航是该产品在骑行者体重70kg，环境温度25°C，时速25km/h等实验室环境下的测试数据。*续航里程数值因测试环境不同会有较大差异。理论续航是该产品在骑行者体重70kg，环境温度25°C，时速25km/h等实验室环境下的测试数据。
          </view> -->
        </view>
      </view>
    </wsf-popup>

    <wsf-popup
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
    </wsf-popup>

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
</template>

<script>
import closeImg from "@/static/img/icon/close_white@2x.png";

import shareIcon from "@/static/img/icon/icon-share@2x.png";
import { priceFilter } from "@/common/wsfValidate";
import { writeFile, removeSave } from "@/common/uploadFile.js";
import rCanvas from "@/components/r-canvas/r-canvas.vue";
import {
  pathToBase64
} from "@/components/r-canvas/image-tools/index.js";
import httpInterceptor from "@/common/http.interceptor.js";
export default {
  components: {
    rCanvas,
  },
  data() {
    return {
      ossUrl: this.$oss,
      closeImg: closeImg,
      shareIcon: shareIcon,
      filePostImg: null,
      canvasPostImg: null,
      shareQrcode: null,
      showPost: false,
      shareColumn: -1,
      priceFilter,
      bannerCurrent: 0,
      controlsShow: true,
      videoContext: {},
      swiperCurrent: 0,
      tree: [],
      treeLength: [],
      filterList: [], // 依据条件过滤的sku数组
      initialSku: {}, // 条件属性
      choseFullSku: false, //是否选择规格
      firstOrderSkuId: "", // 保存skuId
      addNum: 1,
      skuDetail: {},
      limitAddNum: 100000000,
      initialSkuArr: [],
      attrList: [
        {
          label: "使用推荐",
          value: "坚实骨架更安全",
        },
        {
          label: "最高时速",
          value: "25km/h及以下",
        },
        {
          label: "整车重量",
          value: "55kg",
        },
        {
          label: "使用推荐",
          value: "坚实骨架更安全",
        },
        {
          label: "使用推荐",
          value: "坚实骨架更安全",
        },
        {
          label: "使用推荐",
          value: "坚实骨架更安全",
        },
      ],
      showAll: false,
      activeImg: '',
      activeSku: 's0'
    };
  },
  props: {
    skuData: {
      type: Object,
      default() {
        return {};
      },
    },
    //设置倒计时间，单位为秒
    timestamp: {
      type: Object,
      default() {
        return { seconds: 3600, label: "", startTime: null, discount: 0 };
      },
    },
    // 秒杀数据
    marketingVos: {
      type: Array,
      default() {
        return [];
      },
    },
    bestCoupon: {
      type: Object,
      default() {
        return null;
      },
    },
    showShareModal: {
      type: Boolean,
      default: false,
    },
    sourceType: {
      type: [Number, String],
      default() {
        return 1;
      },
    },
    recommendToken: {
      type: String,
      default: "",
    },
    skuId:{
			type:String,
			default:""
		}
  },
  watch: {   
    // "$store.state.bannerCurrent": function (val, oldval) {
    //   if (val != "") {
    //     console.log(val);
    //     this.bannerCurrent = 0;
    //     this.swiperCurrent = 0;
    //   }
    // },
    initialSku: {
      handler(n, o) {
        this.initialSkuArr = [];
        for (let i in n) {
          if (n[i]) {
            this.initialSkuArr.push(n[i]); //属性
          }
        }

        /**
				 * 顶部选中规格轮播当前选中
				 * 选中位置索引大于1时减1，给左边预留一个规格
				 */
				if(this.treeLength && this.treeLength.length > 2) {
        	let index = 0
        	for (const i in this.treeLength) {
        	  if(this.treeLength[i].id === this.initialSkuArr[0]) {
        	    index = i
        	    break
        	  }
        	}
        	if (index <= 1) {
        	  this.activeSku = 's0';
        	} else {
        	  this.activeSku = 's' + (index - 1);
        	}
        }        
      },
      deep: true,
    },
  },
  filters: {
    tenThousandCount(val) {
      if (val && Number(val) >= 10000) {
        return parseInt((val / 10000) * 10) / 10 + "万分";
      } else if (val && Number(val) >= 1000) {
        return parseInt(Number(val) / 1000) + "000+分";
      } else if (val && Number(val) >= 100) {
        return parseInt(Number(val) / 100) + "00+分";
      } else {
        return val + "分";
      }
    },
    saleNumCount(val) {
      if (val && Number(val) > 999) {
        return "999+";
      } else {
        return val;
      }
    },
  },
  computed: {
    scrollFCateId() {
      return 'fCate' + this.firstOrderSkuId;			
		},
    getAttrList() {
      return this.skuData.spuAttributeValues && this.skuData.spuAttributeValues.slice(0, 5);
    },
    // skuPriceInt() {
    //   let price = 0;
    //   if (this.skuData && this.skuData.price) {
    //     price = this.skuData.price;
    //   }
    //   price = price.toFixed(2).split(".")[0];
    //   return price;
    // },

    reducedPriceFloat() {
      let afterCouponPrice = 0;
      let list = [];
      if (this.skuData && this.skuData.afterCouponPrice) {
        afterCouponPrice = this.skuData.afterCouponPrice;
      }
      list = afterCouponPrice.toFixed(2).split(".");
      return list;
    },
    oldPriceflot() {
      let oldPrice = 0;
      let list = [];
      if (this.skuData && this.skuData.oldPrice) {
        oldPrice = this.skuData.oldPrice;
      }
      list = oldPrice.toFixed(2).split(".");
      return list;
    },
  },
  methods: {
	skuPriceFloat(index) {
      let price = 0;
      if (this.skuData && this.skuData.price) {
        price = this.skuData.price;
      }
      price = price.toFixed(2).split(".")[index];
      return price;
    },
    openAllBasic() {
      this.showAll = true;
    },
    handleCloseParam() {
      this.showAll = false;
    },
    previewImg(index) {
      uni.previewImage({
        current: index,
        urls: this.skuData.images,
        indicator: "default",
      });
    },
    // 轮播切换
    bannerChange(data) {
      console.log(data, "轮播index下标");
      this.bannerCurrent = data.target.current;
      this.swiperCurrent = data.target.current;
    },
    goShare() {
      this.shareColumn = 1;
      this.$emit("update:showShareModal", true);
    },
    cancelShare() {
      this.$emit("update:showShareModal", false);
      this.showPost = false;
    },
    stopTouch() {
      return false;
    },
    closePost() {
      this.showPost = false;
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
        fail() {
          uni.showToast({
            title: "保存失败,请重试",
            icon: "none",
          });
        },
      });
    },
    creatCanvasPost() {
      let skuName = this.skuData.name;
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
            url: this.skuData.images[0],
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
            text: this.skuData.price.toFixed(2),
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
              console.log("fffss");
              this.canvasPostImg = base64;
              this.showPost = true;
              this.$emit("update:showShareModal", false);
              // this.shareColumn = 2;
              uni.hideLoading();
            })
            .catch((err_msg) => {
              this.showToastError("海报生成失败，请稍后重试");
            });
        });
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
    removeBeforeFiles() {
      removeSave()
        .then(() => {
          this.getUseCode();
        })
        .catch((e) => {
          console.log(e);
        });
    },
    clickFun() {
      let params = {
        type: 0,
        id: this.skuData.id,
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
          this.$emit("update:showShareModal", false);
          let codeData = {
            scene: "s=" + this.skuData.id + "&c=" + this.recommendToken,
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
    play() {
      this.controlsShow = true;
    },
    // 视频播放
    plays() {
      let that = this;
      if (that.skuData.spuVideo) {
        let videoContext = uni.createVideoContext("videoBanner", that);
        videoContext.play();
        console.log(videoContext, "videoContext");
        console.log(videoContext.play());
      }

      that.controlsShow = true;
    },
    // 视频播放完
    endVideo() {
      console.log(123, "播放结束");
      // this.controlsShow = false
    },
    openCouponModule() {
      this.$parent.$refs.couponUnit.openCouponModel();
    },
    //商品规格相关-起
    init() {
      this.skuDetail = this.skuData;
      this.tree = this.skuDetail.sku.tree.map((el) => {
        el.v = el.v.map((eel) => {
          eel.disabled = false;
          return eel;
        });
        return el;
      });
      this.skuData.sku.tree.forEach((item, index) => {
        if (index != 0) {
          item.v.forEach((temp, i) => {
            temp.imgUrl = "";
          });
        } else {
          item.v.forEach((temp, i) => {
            temp.previewImgUrl = temp.imgUrl;
          });
        }
      });
      this.initialSku = this.skuDetail.sku.initialSku;
      this.firstOrderSkuId = this.skuId
      // this.calcSkuDisabled();
    },
    // 计算Sku选择属性是否可选
    calcSkuDisabled() {
      // this.tree.forEach((treeItem) => {
      //   treeItem.v.forEach((vItem) => {
      //     vItem.disabled = this.filterSku(treeItem.k_s, vItem.id);
      //   });
      // });
      // data = data.map((item) => {
      //   item.noSdk = item.disabled ? 0 : 1;
      //   return item;
      // });
      let data = this.skuDetail.list;
      this.treeLength = data.filter((item) => {
        return item.stock_num > 0
      })      
    },
    // 过滤当前规格选项
    filterSku(s, sId) {
      this.filterList = this.skuDetail.list.filter((el) => {
        let filterResult = true;
        let filterInitialSku = this.$u.deepClone(this.initialSku);
        filterInitialSku[s] = sId;
        for (let i in filterInitialSku) {
          if (filterInitialSku[i] && filterInitialSku[i] !== el[i]) {
            filterResult = false;
          }
        }
        return filterResult === true;
      });
      let hasStock = false;
      this.filterList.forEach((filEl) => {
        if (filEl.stock_num > 0) {
          hasStock = true;
        }
      });
      if (this.filterList.length === 1 && this.initialSku[s] == sId) {
        this.choseFullSku = true;
        if (this.marketingVos.length && this.marketingVos[0].type == "13") {
          if (
            this.filterList[0].stock_num >
              this.marketingVos[0].panicBuy.limitNum &&
            this.marketingVos.length &&
            this.marketingVos[0].iSeckill
          ) {
            if (this.marketingVos[0].panicBuy.limitNum != -1) {
              this.limitAddNum = this.marketingVos[0].panicBuy.limitNum;
            } else {
              this.limitAddNum = 10000000;
            }
          }
        } else if (
          this.marketingVos.length &&
          this.marketingVos[0].type == "16" &&
          this.marketingVos[0].specialArea.limitNum <
            this.filterList[0].stock_num
        ) {
          if (this.marketingVos[0].specialArea.limitNum != -1) {
            this.limitAddNum = this.marketingVos[0].specialArea.limitNum;
          } else {
            this.limitAddNum = 10000000;
          }
        } else {
          this.limitAddNum = this.filterList[0].stock_num;
        }       
        let skuId = this.filterList[0].id;
        this.firstOrderSkuId = skuId;
        let ele = this.skuDetail.list.filter(item=>{
          return item.id == this.firstOrderSkuId
        })
        this.activeImg = ele[0].imgUrl
      }
      return !hasStock;
    },
    // 按钮点击
    pitchOnFun(v, treeItem, index) {     
      this.bannerCurrent == 0
      this.swiperCurrent = 0;
      // this.$store.commit("SET_BANNERCURRENT", v.id);
      //重置数量
      this.addNum = 1;

      // 替换条件参数
      if (v.disabled) return;
      this.choseFullSku = false;

      // this.initialSku[treeItem.k_s] == v.id
      //   ? (this.initialSku[treeItem.k_s] = null)
      //   : (this.initialSku[treeItem.k_s] = v.id);
      // this.calcSkuDisabled();    
      this.firstOrderSkuId = v.id 
      this.$emit("restDetails", this.firstOrderSkuId, '',this.activeImg, true);
    },
    initData() {
      // 重新初始化addNum，去登录页面回来时没有重置addNum
      this.addNum = 1;
      this.init();
    },
    goActity(e) {
      console.log(e);
      this.$wsf.go("firstOrder", { id: e.id });
    },
  },
};
</script>

<style scoped lang="scss">
.bannerBox {
  position: relative;
}
.currentBox {
  position: absolute;
  right: 32rpx;
  bottom: 32rpx;
  color: #fff;
  height: 40rpx;
  display: inline-flex;
  align-items: center;
  padding: 0 16rpx;
  border-radius: 24rpx;
  background: rgba(0, 0, 0, 0.8);
  font-size: 24rpx;
}
.swiper {
  width: 100%;
  height: 750rpx;
  .swiper-img {
    width: 100%;
    height: 100%;
  }
}
.swiper-items {
  border-radius: 0rpx 0rpx 24rpx 24rpx;
}
.bannerVideo {
  position: absolute;
  width: 100%;
  height: 375px;
  z-index: 1;
}

.base-info {
  align-items: center;
  position: relative;
  margin-bottom: 16rpx;
  height: 56rpx;
  .soldout-img {
    position: absolute;
    right: 0rpx;
    top: 0rpx;
    width: 140rpx;
    height: 140rpx;
  }
  .current-price {
    line-height: 56rpx;
    color: #ff0a35;
    font-weight: 600;
    display: flex;
    i {
      display: inline;
      font-size: 32rpx;
      font-family: DINAlternate-Bold, DINAlternate;
    }
    span {
      font-size: 60rpx;
      font-family: DINAlternate-Bold, DINAlternate;
    }
    .u-font-text {
      font-size: 32rpx;
      font-family: DINAlternate-Bold, DINAlternate;
    }
    .reduced-price {
      height: 56rpx;
      background: linear-gradient(90deg, #ff5f2e 0%, #ff0a35 100%);
      border-radius: 30rpx 30rpx 30rpx 4rpx;
      padding: 0 16rpx;
      color: #fff;
      font-weight: 600;
      margin-left: 8rpx;
      span {
        font-size: 22rpx;
        font-weight: 500;
        font-family: PingFangSC-Medium, PingFang SC;
      }
      i {
        font-size: 26rpx;
        padding-left: 4rpx;
        font-family: DINAlternate-Bold, DINAlternate;
      }
      .txt1 {
        font-size: 40rpx;
        font-family: DINAlternate-Bold, DINAlternate;
      }
      .txt2 {
        font-size: 26rpx;
        font-family: DINAlternate-Bold, DINAlternate;
      }
    }
    .discount-price {
      font-size: 24rpx;
      font-weight: 500;
      color: #999999;
      text-decoration: line-through;
    }
    .performance-mark {
      vertical-align: bottom;
      margin-left: 16rpx;
      margin-bottom: 20rpx;
      padding: 0 8rpx;
      display: inline-flex;
      align-items: center;
      height: 32rpx;
      border-radius: 4rpx;
      border: 1rpx solid #fd302c;
      color: #fd302c;
      font-size: 20rpx;
    }
  }
  .tag-part {
    margin-top: 16rpx;
    display: flex;
    align-items: center;
    .sale-price {
      display: inline-block;
      margin-right: 12rpx;
      width: 116rpx;
      height: 28rpx;
      position: relative;
      .price-tag {
        height: 100%;
        width: 60rpx;
        text-align: center;
        line-height: 28rpx;
        color: #fff;
        font-size: 18rpx;
        position: absolute;
        right: 0;
        top: 0;
      }
      image {
        width: 100%;
        height: 100%;
      }
    }
    .activity-type {
      display: inline-block;
      margin-right: 16rpx;
      color: #ffffff;
      font-size: 20rpx;
      text-align: center;
      // width: 92rpx;
      padding: 0rpx 6rpx;
      // height: 28rpx;
      border-radius: 4rpx;
      background: -webkit-linear-gradient(left, #fe5229, #ff8b40);
    }
    .bug-send {
      margin-right: 16rpx;
      display: inline-block;
      padding: 0 6rpx;
      line-height: 28rpx;
      height: 28rpx;
      border-radius: 4rpx;
      border: 2rpx solid $wsf-color-red;
      font-size: 20rpx;
      color: $wsf-color-red;
    }
  }
  .sekill-date {
    color: #e60113;
    .txt-1 {
      padding: 5rpx;
      border: 1px solid #e60113;
      font-size: 20rpx;
      font-weight: 400;
    }
    .txt-2 {
      padding: 0 10rpx;
    }
  }
  .original-price {
    line-height: 24rpx;
    del {
      color: #999;
      text-decoration: line-through;
    }
  }
  .mark {
    min-width: 54rpx;
  }
}
.product-title {
  font-weight: bold;
  font-size: 32rpx;
  color: #111111;
  line-height: 40rpx;
  margin-bottom: 12rpx;
}
.product-subtitle {
  margin: 12rpx 0 24rpx;
  font-size: 26rpx;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #e3903f;
  line-height: 34rpx;
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

.coupon-module {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 16rpx 0 32rpx;
  .coupon-mark {
    height: 40rpx;
    border-radius: 4rpx;
    border: 2rpx solid #e60113;
    padding: 0 8rpx;
    font-size: 24rpx;
    font-weight: 500;
    display: inline-flex;
    margin-right: 8rpx;
    align-items: center;
    color: #e60113;
  }
  .coupon-module-right {
    color: #e60113;
    font-size: 24rpx;
    display: inline-flex;
    align-items: center;
    .expand-image {
      width: 32rpx;
      height: 32rpx;
      margin-left: 12rpx;
    }
  }
}
.property-swiper {
  background: #ffffff;
  border-radius: 0rpx 0rpx 32rpx 32rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24rpx;
  padding-top: 8rpx;
  padding-bottom: 16rpx;
  .num-property {
    width: 96rpx;
    height: 88rpx;
    border-radius: 16rpx;
    display: flex;
    flex-shrink: 0;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: rgba(229, 229, 229, 0.22);
    p {
      font-size: 22rpx;
      color: #c3c3c3;
      span {
        font-family: Arial-BoldMT, Arial;
        font-weight: bold;
      }
    }
  }
  .property {
    width: 590rpx;
    .scroll-view_H {
      white-space: nowrap;
      width: 100%;
      .flex-swiper {
        display: flex;
        img {
          flex-shrink: 0;
          width: 88rpx;
          height: 88rpx;
          display: block;
          margin-right: 16rpx;
          background: #f6f6f6;
          border-radius: 16rpx;
          border: 2rpx solid #eeeeee;
          object-fit: cover;
        }
        .activity {
          border: 2rpx solid #ff0a35;
        }
        .disable {
          background-color: #f2f2f2;
          border: 1px solid #f2f2f2;
          color: #bababa;
        }
      }
    }
  }
}
.reduced-original {
  display: flex;
  align-items: baseline;
  color: #c3c3c3;
  padding-top: 10rpx;
  margin-left: 8rpx;
  position: relative;
  &::after {
    content: " ";
    width: 100%;
    height: 2rpx;
    background-color: #c3c3c3;
    position: absolute;
    left: 0;
    top: 57%;
    -webkit-transform: translateY(-50%);
    transform: translateY(-50%);
  }
  i {
    font-size: 22rpx !important;
    font-family: DINAlternate-Bold, DINAlternate;
  }
  .txt1 {
    font-size: 32rpx !important;
    font-family: DINAlternate-Bold, DINAlternate;
  }
  .txt2 {
    font-size: 22rpx !important;
    font-family: DINAlternate-Bold, DINAlternate;
  }
}
.conent-nav {
  margin: 20rpx 24rpx 12rpx;
  margin-bottom: 0;
  background: #ffffff;
  padding: 29rpx 24rpx;
  border-radius: 24rpx;
}
.attr-box {
  display: flex;
  flex-wrap: wrap;
  margin-top: 24rpx;
  & > view {
    text-align: left;
  }
  .attr-item {
    display: flex;
    flex-direction: column;
    width: 33%;
    padding-left: 4rpx;
    .label {
      color: #c3c3c3;
      font-size: 26rpx;
      margin-bottom: 8rpx;
    }
    .value {
      color: #191919;
      font-size: 26rpx;
      word-break: break-all;
    }
    &.first-line {
      margin-bottom: 24rpx;
    }
  }
  .more {
    margin-top: 14rpx;
    display: flex;
    flex-direction: column;
    // justify-content: flex-end;
    .more-wrapper {
      background: #f2f2f2;
      color: #444;
      font-size: 26rpx;
      padding: 8rpx 24rpx;
      display: flex;
      align-items: center;
      height: 52rpx;
      border-radius: 26rpx;
      span {
        line-height: 34rpx;
      }
    }
    image {
      width: 32rpx;
      height: 32rpx;
      margin-right: 4px;
    }
  }
}
.basic-popup {
  padding: 24rpx 48rpx 48rpx;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  .basic-popup-content {
    flex: 1;
    overflow-y: auto;
    .view-table {
      border: 1px solid #eeeeee;
      .tr {
        display: flex;
        border-bottom: 1px solid #eeeeee;
        .td-1 {
          width: 176rpx;
          flex-shrink: 0;
          padding: 22rpx 16rpx 20rpx 16rpx;
          font-size: 22rpx;
          color: #999999;
        }
        .td-2 {
          width: 100%;
          padding: 22rpx 16rpx 20rpx 16rpx;
          font-size: 22rpx;
          color: #999999;
          border-left: 1px solid #eeeeee;
        }
      }
      .tr:last-child {
        border-bottom: none;
      }
    }
  }
  .basic-popup-content::-webkit-scrollbar {
    width: 0;
  }
  .basic-popup-title {
    text-align: center;
    color: #000d1d;
    font-size: 32rpx;
    line-height: 44rpx;
    position: relative;
    margin-bottom: 48rpx;
    > image {
      position: absolute;
      right: 0;
      top: 0;
      height: 40rpx;
      width: 54rpx;
    }
  }
  .tip-title {
    color: #999;
    font-size: 22rpx;
    line-height: 30px;
    font-weight: bold;
    margin-top: 24rpx;
  }
  .tip-content {
    color: #999;
    font-size: 22rpx;
    line-height: 30px;
    margin-top: 4rpx;
    text-align: justify;
  }
}
</style>

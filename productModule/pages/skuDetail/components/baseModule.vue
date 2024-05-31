<template>
  <view>
		<view class="bannerBox">

			<swiper class="swiper" :interval="3000" :circular="true" :autoplay="false" :current="swiperCurrent" :indicator-dots="false" @change="bannerChange">
				<swiper-item class="swiper-items" v-for="(item,index) in skuData.images" :key="item.keys">
					<video style="width: 100%;height:100%"
					:poster="skuData.spuVideoPic" :src="skuData.spuVideo"
					:show-center-play-btn="true" :show-loading="false" object-fit="fill" :controls="controlsShow" :seeked="true"
					class="bannerVideo" v-if="bannerCurrent==0&&skuData.spuVideo" @play="play()" @ended="endVideo()"></video>

					<image :src="item.src ? item.src : item" mode="aspectFill" class="swiper-img" @tap="previewImg(index)"></image>
				</swiper-item>
			</swiper>
			<view class="currentBox" v-if="skuData.images && skuData.images.length > 0">
				{{ bannerCurrent + 1 }}/{{skuData.images.length}}
			</view>
		</view>
    <view class="property-swiper" v-if="treeLength && treeLength.length >= 2">
      <view class="num-property">
        <p><span>{{treeLength.length}}</span>种</p>
        <p>可选</p>
      </view>
      <view class="property">
        <scroll-view class="scroll-view_H" scroll-x="true" scroll-left="0" scroll-with-animation :scroll-into-view="scrollFCateId" >
					<view class="flex-swiper">
            <img v-for="(item,index) in treeLength" :key="index" :class="[
              item.disabled ? 'disable' : '',
              firstOrderSkuId.indexOf(item.id) >= 0 ? 'activity' : ''
            ]" :src="item.imgUrl" alt="" @click="pitchOnFun(item,index)" :id="'fCate' + item.id">
          </view>
				</scroll-view>
      </view>
    </view>
    <view class="seckill" v-if="marketingVos[0].type == '13'">
      <view class="left"></view>
      <view class="right">
        <view class="txt">{{ timestamp.label }}</view>
        <view class="count-down u-margin-top-10">
          <u-count-down
            color="#E60113"
            :font-size="20"
            :separator-size="20"
            separator-color="#fff"
            :show-days="false"
            :timestamp="timestamp.seconds"
          ></u-count-down>
        </view>
      </view>
    </view>
    <view class="conent-nav">
      <view class="base-info u-flex u-row-between">
        <image
          v-if="skuData.sellOut == 1 && skuData.shelvesStatus == '1'"
          class="soldout-img"
          src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/prev-icon-list/cat_soldout%402x.png"
        ></image>
        <view>
          <p class="current-price">
            <template v-if="skuData.shelvesStatus == 0 || skuData.shelvesStatus == 2">
              <text>暂无售价</text>
            </template>
            <template v-else>
              <!-- 添加福气值逻辑 -->
              <view class="fqz-price" v-if="skuData.integralPoint > 0">
                <text>
                  <text class="special">
                    {{ skuData.integralPoint }}
                  </text>
                  福气值+
                  <text>
                    {{ skuData.deductionAfterPrice }}
                  </text>
                  元
                </text>
              </view>
              <template v-else>
                <view>
                  <i>￥</i>
                  <span>{{ skuPriceInt }}</span>
                  <text class="u-font-text">{{ "." + skuPriceFloat }}</text>
                </view>
              </template>
              <view v-if="skuData.afterCouponPrice && sourceType == 1" class="reduced-price">
                <span>券后</span>
                <i>￥</i>
                <text class="txt1">{{reducedPriceFloat[0]}}</text>
                <text class="txt2">{{"."+reducedPriceFloat[1]}}</text>
              </view>
              <view v-if="skuData.oldPrice > skuData.price && !skuData.afterCouponPrice" class="reduced-original">
                <i>￥</i>
                <text class="txt1">{{oldPriceflot[0]}}</text>
                <text class="txt2">{{"."+oldPriceflot[1]}}</text>
              </view>
            </template>
          </p>
          <template v-if="timestamp.label == '距开始还剩'">
            <view class="sekill-date">
              <text class="txt-1">秒杀预告</text>
              <text class="txt-2">{{ timestamp.startTime }}</text>
              <text class="txt-3"
                >秒杀价￥{{
                  priceFilter(timestamp.price)
                }}</text
              >
            </view>
          </template>
        </view>
        <view class="collect">
          <view class="mark">
            <p class="u-font-p">{{ isMark ? "已" : "" }}收藏</p>
            <img :src="`https://wsjc-web.wsecar.com/wsf-mall/skuDetail/icon-${!isMark ? 'yet' : 'yettrue'}.png`" alt=""  @click="changeAttention">
          </view>
        </view>
      </view>
      <view class="coupon-ticket" v-if="couponShowlist && couponShowlist.length > 0">
        <view class="coupon-left">
          <scroll-view class="scroll-view_tab" scroll-x="true" scroll-left="0">
            <view class="flex-tab">
              <view v-for="(item, index) in couponShowlist" :key="index">
                <view class="time-tab">{{ item.text }}</view>
              </view>
            </view>
          </scroll-view>
        </view>
        <view class="coupon-right" @tap="openCouponModule()">
          <span>查看</span>
          <img src="https://wsjc-web.wsecar.com/wsf-mall/skuDetail/icon-redRight.png" alt="">
        </view>
      </view>
      <template v-if="false">
      <view class="activity_" v-for="(item, index) in skuData.marketingVos" :key="index" @click="goActity(item)">
        <view class="text">
          <img src="https://wsjc-web.wsecar.com/wsf-mall/skuDetail/icon-actity.png" alt="">
          <view>
            <view class="p_1 p" v-if="item.type == 1">
              <image class="imgage" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/prev-icon-list/reduced_price%402x.png"></image>
              <text>{{ item.id }}元</text>
            </view>
            <view class="p_2 p" v-if="item.type == 12">
              <text>{{ item.name }}</text>
            </view>
            <view class="p_3 p" v-if="item.type == 16">
              <text>{{ item.name }}</text>
            </view>
          </view>
        </view>
        <img src="https://wsjc-web.wsecar.com/wsf-mall/skuDetail/icon-red.png" alt="">
      </view>
      </template>
      <!-- 专题 -->
      <view class="active" v-if="skuData.skuLable && skuData.skuLable.thematicLabel && skuData.skuLable.thematicLabel.subjectLabel" @tap.stop="toThematic(skuData.skuLable.thematicLabel)">
        <view class="active-content">
          <image class="active-hot" src="https://wsjc-web.wsecar.com/wsf-mall/skuDetail/icon-actity.png" alt=""></image>
          <view class="active-word">{{ skuData.skuLable.thematicLabel.subjectLabel }}</view>
        </view>
        <image class="active-check" src="https://wsjc-web.wsecar.com/wsf-mall/skuDetail/icon-redRight.png" alt=""></image>
      </view>
      <view class="tag-pannel" v-if="skuData.skuLable">
        <!-- 标签 -->
        <view class="tag-list" v-if="skuData.skuLable.goodsTagList && skuData.skuLable.goodsTagList.length > 0">
          <view class="tag-every" v-for="tags in skuData.skuLable.goodsTagList" :key="tags.id">
            <view class="tag-every--tip">惠</view>
            <view class="tag-every--val">{{ tags.tagName }}</view>
          </view>
        </view>
        <view class="expression" v-if="skuData.skuLable&&skuData.skuLable.performanceScoreLabel.performanceScore">
          <view class="performance" v-if="skuData.skuLable.performanceScoreLabel.performanceScore > 0">
            <img src="https://wsjc-web.wsecar.com/wsf-mall/skuDetail/icon-performance.png" alt="">
            <view class="num-pannel">绩效分:<text class="num">{{ skuData.skuLable.performanceScoreLabel.performanceScore}}</text></view>
          </view>
        </view>
      </view>
      <view class="product-title">{{
        skuData.name
      }}</view>
    </view>

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
  pathToBase64,
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
			bannerCurrent:0,
			controlsShow:true,
			// videoContext:{},
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
      activeImg: '',
      videoContext: undefined,
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
    couponIds:{
      type: Array,
      default: ()=>[]
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
    isMark: {
      type: Boolean,
      default() {
        return false;
      },
    },
    sourceType: {
      type: [Number,String],
      default() {
        return 1;
      },
    },
		recommendToken:{
			type:String,
			default:""
		},
    recommendToken:{
			type:String,
			default:""
		},
    skuId:{
			type:String,
			default:""
		}
  },
  watch:{
    "$store.state.bannerCurrent": function(val, oldval) {
        if (val != '') {
          console.log(val)
          this.bannerCurrent = 0
          this.swiperCurrent = 0
        }
      },
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
			}
  },
  filters: {
    tenThousandCount(val) {
      if(val && Number(val) >= 10000) {
        return (parseInt((val / 10000) * 10)/10) + '万分'
      } else if(val && Number(val) >= 1000) {
				return parseInt(Number(val) / 1000) + '000+分'
			} else if(val && Number(val) >= 100) {
				return parseInt(Number(val) / 100) + '00+分'
			} else {
        return val + '分'
      }
    },
    saleNumCount(val) {
      if(val && Number(val) > 999) {
        return '999+'
      } else {
        return val
      }
    }
  },

  computed: {
    scrollFCateId() {
      return 'fCate' + this.firstOrderSkuId;
		},
    skuPriceInt() {
      let price = 0;
      if (this.skuData && this.skuData.price) {
        price = this.skuData.price;
      }
      price = price.toFixed(2).split(".")[0];
      return price;
    },
    skuPriceFloat() {
      let price = 0;
      if (this.skuData && this.skuData.price) {
        price = this.skuData.price;
      }
      price = price.toFixed(2).split(".")[1];
      return price;
    },
    reducedPriceFloat() {
      let afterCouponPrice = 0;
      let list = []
      if (this.skuData && this.skuData.afterCouponPrice) {
        afterCouponPrice = this.skuData.afterCouponPrice;
      }
      list = afterCouponPrice.toFixed(2).split(".");
      return list;
    },
    oldPriceflot() {
      let oldPrice = 0;
      let list = []
      if (this.skuData && this.skuData.oldPrice) {
        oldPrice = this.skuData.oldPrice;
      }
      list = oldPrice.toFixed(2).split(".");
      return list;
    },
    couponShowlist(){
      let obj = this.skuData || {};
      let couponlist = []


      let markIngLabel = (obj.skuLable || {}).markIngLabel || []
      // 活动标签
      let actCouponMap = []
      if(markIngLabel && markIngLabel.length) {

        let curActive = markIngLabel[0] || {}
        let tiredPricingList = curActive.tiredPricingList || [];

        // 重新组装活动优惠信息
        if([1, 3].includes(curActive.ruleType)) {
          // 固定金额和自定义规则: 不展示活动优惠券
          actCouponMap = []
        } else if(curActive.ruleType == 2) {
          // 固定折扣活动
          actCouponMap.push({
            text: curActive.fixedDiscount + '折'
          })
        } else if([4, 5].includes(curActive.ruleType)) {
          actCouponMap = tiredPricingList.map(item => {
            if(curActive.ruleType == 4){
              return {
                text: '满' + item.amountLimitation + '减' + item.faceValue
              }
            } else {
              return {
                text: '满' + item.amountLimitation + '打' + item.faceValue + '折'
              }
            }
          })
        }
      }

      let couponLabelList = obj.couponLabelList || []
      couponLabelList = couponLabelList.map(item => {
        let text
        // 满减
        if(item.couponsType == 1) {
          text = `满${item.amountLimitation}减¥${item.faceValue}`
        }
        // 折扣
        else if(item.couponsType == 2) {
          text = `${item.faceValue ? item.faceValue : 0}折`
        }
        // 立减
        else if(item.couponsType == 3) {
          text = `立减¥${item.faceValue}`
        }
        return {
          text
        }
      })
      // 如果有优惠券，展示最多两个活动标签，最多两个优惠券标签
      if(couponLabelList.length > 0) {
        couponlist = [...actCouponMap.slice(0, 2), ...couponLabelList.slice(0, 2)]
      } else {
        // 如果没有优惠券，展示最多3个活动标签
        couponlist = actCouponMap.slice(0, 3)
      }

      return couponlist
    },
  },
  methods: {
    previewImg(index) {
      uni.previewImage({
        current: index,
        urls: this.skuData.images,
        indicator: "default"
      })
    },
		// 轮播切换
		bannerChange(data) {
			console.log(data,'轮播index下标')
			this.bannerCurrent = data.target.current;
      this.swiperCurrent = data.target.current;
		},
    goShare() {
      this.shareColumn = 1;
      this.$emit("update:showShareModal", true);
    },
    changeAttention() {
      this.$emit("changeAttention");
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
    clickFun(){
			let params = {
				type: 0,
				id: this.skuData.id
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
          this.$emit("update:showShareModal", false);
          let codeData = {
            scene: "s=" + this.skuData.id+'&c='+this.recommendToken,
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
              this.removeBeforeFiles();
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
			this.controlsShow = true
		},
		// 视频播放
		// plays() {
		// 	let that = this;
		// 	if (that.skuData.spuVideo) {
    //     let videoContext = uni.createVideoContext("videoBanner", that)
		// 		videoContext.play()
		// 		console.log(videoContext,'videoContext')
		// 		console.log(videoContext.play())
		// 	}

		// 	that.controlsShow = true;
		// },
		// 视频播放完
		endVideo() {
			console.log(123,"播放结束")
			// this.controlsShow = false
		},
    openCouponModule() {
      let obj = {
					spuId: this.skuData.spuId,
					skuId: this.skuData.id,
					num: this.skuData.checked ? this.skuData.num : 1,
					beforeCouponPrice: this.skuData.price,
				}
      const params = {
				skuList: [obj],
        ids:this.couponIds,
				sourceType: this.sourceType // sourceType 来源 1.商城 2.实体店 3.电动车
			}
      // 打开优惠券弹窗
      this.$parent.$refs.couponUnit.setShowCopun(params)
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
      this.calcSkuDisabled();
    },
    // 计算Sku选择属性是否可选
    calcSkuDisabled() {
      // this.tree.forEach((treeItem) => {
      //   treeItem.v.forEach((vItem) => {
      //     vItem.disabled = this.filterSku(treeItem.k_s, vItem.id);
      //   });
      // });

      // let data = this.tree[0].v
      // data = data.map((item) => {
      //   item.noSdk = item.disabled ? 0 : 1
      //   return item
      // })
      // this.treeLength = data.filter((item) => {
      //   return item.noSdk == 1
      // })

      let data = this.skuDetail.list
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
      // this.videoContext.stop()
      //重置数量
      this.addNum = 1;
      // 替换条件参数
      if (v.disabled) return;
      this.choseFullSku = false;

      // this.initialSku[treeItem.k_s] == v.id ?
			// 		(this.initialSku[treeItem.k_s] = null) :
			// 		(this.initialSku[treeItem.k_s] = v.id);
			// this.calcSkuDisabled();
      this.firstOrderSkuId = v.id
      this.$emit("restDetails", this.firstOrderSkuId, this.activeImg, false);
    },
    initData() {
      // 重新初始化addNum，去登录页面回来时没有重置addNum
      this.addNum = 1;
      this.init();
    },
    goActity(e) {
      console.log(e)
      this.$wsf.go("firstOrder", {id:e.id});
    },
    // 去到专题活动页面
    toThematic(item) {
      this.$wsf.go('specialModule', {
          id: item.id,
          spuId: this.skuData.spuId
      })
    }
  },
};
</script>

<style scoped lang="scss">
	.bannerBox{
		position:relative
	}
	.currentBox{
		position:absolute;
	  right: 32rpx;
	  bottom: 32rpx;
	  color:#fff;
	  height: 40rpx;
	  display: inline-flex;
	  align-items: center;
	  padding: 0 16rpx;
	  border-radius: 24rpx;
	  background: rgba(0, 0, 0, 0.8);
	  font-size: 24rpx;
	}
	.swiper{
		width:100%;
		height:750rpx;
		.swiper-img{
			width:100%;
			height:100%
		}
	}
  .swiper-items {
    border-radius: 0rpx 0rpx 24rpx 24rpx;
  }
	.bannerVideo{
	  position: absolute;
	  width: 100%;
	  height: 375px;
	  z-index: 1;
	}
.seckill {
  width: 100%;
  height: 112rpx;
  padding: 34rpx 36rpx;
  box-sizing: border-box;
  background-image: url("https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com///f0271d194b515437b76910e522313c98.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 20rpx;
  .left {
    width: 192rpx;
    height: 44rpx;
    background-image: url("https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com///c1378c6448cf828e1027ccbe0bb89922.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }
  .right {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .txt {
      font-size: 20rpx;
      font-weight: 500;
      color: #ffffff;
    }
  }
}
.performance-part {
  margin-bottom: 12rpx;
  display: inline-block;
  height: 44rpx;
  background: #fcf0f2;
  border-radius: 22rpx;
  line-height: 44rpx;
  padding: 0 20rpx;
  font-size: 26rpx;
  color: #e60113;
  .hint-text {
    color: #666;
  }
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
    color: #FE3040;
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
      background: linear-gradient(90deg, #FF5F2E 0%, #FF0A35 100%);
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
	  	border: 1rpx solid #FD302C;
	  	color: #FD302C;
	  	font-size: 20rpx;
	  }

    .fqz-price {
      font-size: 32rpx;
      .special {
        font-size: 60rpx;
      }
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
  color: #191919;
  line-height: 40rpx;
  margin-bottom: 12rpx;
}
.product-describe {
  font-size: 26rpx;
  color: #999999;
  line-height: 34rpx;
  // padding-top: 12rpx;
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
    border: 2rpx solid #E60113;
    padding: 0 8rpx;
    font-size: 24rpx;
    font-weight: 500;
    display: inline-flex;
    margin-right: 8rpx;
    align-items: center;
    color: #E60113;
  }
  .coupon-module-right {
    color: #E60113;
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
  background: #FFFFFF;
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
    background-color: rgba(229,229,229,0.22);
    p {
      font-size: 22rpx;
	    color: #C3C3C3;
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
          background: #F6F6F6;
          border-radius: 16rpx;
          border: 2rpx solid #EEEEEE;
          object-fit: cover;
        }
        .activity {
          border: 2rpx solid #FF0A35;
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
  color: #C3C3C3;
  padding-top: 10rpx;
  margin-left: 8rpx;
  position: relative;
  &::after {
    content: ' ';
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
  margin: 20rpx 24rpx;
  margin-bottom: 10rpx;
  background: #ffffff;
  padding: 29rpx 24rpx;
  border-radius: 24rpx;
}
.collect {
  margin-bottom: 8rpx;
  .mark {
    display: flex;
    align-items: center;
    height: 66rpx;
    .u-font-p {
      font-size: 26rpx;
      color: #999999;
      padding-right: 6rpx;
    }
    img {
      width: 40rpx;
      height: 40rpx;
      display: block;
      margin-bottom: 2rpx;
    }
  }
}
.coupon-ticket {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20rpx;
  .coupon-left {
    width: 538rpx;
    .scroll-view_tab {
      white-space: nowrap;
      width: 100%;
      .flex-tab {
        display: flex;
        .time-tab {
          height: 48rpx;
          background: rgba(254,48,64,0.1);
          border-radius: 8rpx;
          line-height: 50rpx;
          text-align: center;
          padding: 0 12rpx;
          margin-right: 12rpx;
          font-size: 26rpx;
          color: #FE3040;
        }
      }
    }
  }
  .coupon-right {
    display: flex;
    height: 50rpx;
    align-items: center;
    span {
      font-size: 26rpx;
      color: #FF450C;
    }
    img {
      width: 32rpx;
      height: 32rpx;
    }
  }
}
.activity_ {
  width: 100%;
  height: 64rpx;
  margin-bottom: 22rpx;
  display: flex;
  background-image: url('https://wsjc-web.wsecar.com/wsf-mall/skuDetail/bj-activity.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  align-items: center;
  justify-content: space-between;
  .text {
    display: flex;
    align-items: center;
    img {
      width: 48rpx;
      height: 48rpx;
      padding-left: 10rpx;
    }
    .p {
      flex-shrink: 0;
      width: 460rpx;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      padding-left: 6rpx;
      font-size: 26rpx;
      color: #FF0A35;
    }
    .p_1 {
      display: flex;
      align-items: center;
      .imgage {
        width: 220rpx;
        height: 50rpx;
      }
      text {
        padding-left: 10rpx;
        font-size: 26rpx;
        color: #FF0A35;
      }
    }
  }
  img {
    width: 32rpx;
    height: 32rpx;
    padding-right: 10rpx;
  }
}
.expression {
  display: flex;
  padding-bottom: 10rpx;
  .left-time {
    display: flex;
    .tab-time {
      height: 32rpx;
      border-radius: 8rpx;
      border: 1rpx solid #0A7AD4;
      padding: 0 12rpx;
      line-height: 28rpx;
      color: #0A75D9;
      font-size: 22rpx;
      font-weight: bold;
      margin-right: 12rpx;
    }
  }
  .performance {
    display: flex;
    img {
      width: 32rpx;
      height: 32rpx;
    }
    .num-pannel {
      color: #008864;
      font-size: 22rpx;
      .num {
        font-size: 22rpx;
        font-weight: bold;
      }
    }
  }
}

.active {
  width: 654rpx;
  height: 64rpx;
  background-image: url('https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/ws-smart-life/detail/bj-activity.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  border-radius: 32rpx;
  padding: 0 10rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20rpx;
  .active-content {
    display: flex;
    align-items: center;
  }
  .active-hot {
    width: 48rpx;
    height: 48rpx;
  }
  .active-word {
    color: #FF450C;
    font-size: 26rpx;
    width: 460rpx;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    margin-left: 16rpx;
  }
  .active-check {
    width: 32rpx;
    height: 32rpx;
    padding-right: 10rpx;
  }
}
.tag-pannel {
  display: flex;
  margin-bottom: 20rpx;
  .tag-list {
    display: flex;
  }
  .tag-every {
    display: flex;
    align-items: center;
    padding-right: 8rpx;
    height: 28rpx;
    border-radius: 8rpx;
    border: 1rpx solid rgba(255,55,0,0.4);
    margin-right: 8rpx;
  }
  .tag-every--tip{
    width: 30rpx;
    height: 28rpx;
    text-align: center;
    line-height: 28rpx;
    background: rgba(255, 69, 12, 0.13);
    font-size: 20rpx;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #FF450C;
  }
  .tag-every--val{
    margin-left: 4rpx;
    font-size: 20rpx;
    color: #ff450c;
  }
}
</style>

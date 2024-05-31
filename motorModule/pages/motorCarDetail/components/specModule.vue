<template>
  <view class="spec-module" v-if="specSelectModel">
    <u-popup
      v-model="specSelectModel"
      mode="bottom"
      border-radius="20"
      height="1080rpx"
      @close="updateSku"
    >
      <view class="popup">
        <view class="spec-popup-title">
          <view>{{skuData.motorcycleTypeName}} {{getVersin}}</view>
          <image
            src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/motorCar/basic_close_icon.png"
            alt=""
            @click="updateSku"
        /></view>
        <!-- <view class="sku-info">
          <view class="info">
            <view class="price">
              <view class="txt_item">
                <text class="txt_1">￥</text>
                <view class="txt_2">
                  <span>{{ skuPriceInt(skuPrice) }}</span>
                  <span class="float">{{ "." + skuPriceFloat(skuPrice) }}</span>
                </view>

                <view
                  style="display: inline-block"
                  v-if="
                    !bestCoupon &&
                    skuDetail.showActiveType &&
                    skuDetail.showActiveType[0] &&
                    !skuData.afterCouponPrice
                  "
                >
                  <i
                    style="
                      color: #999999;
                      text-decoration: line-through;
                      margin-left: 7px;
                      vertical-align: -webkit-baseline-middle;
                      font-size: 28rpx;
                    "
                    v-show="skuDetail.oldPrice > Number(skuPrice)"
                  >
                    ¥{{ skuDetail.oldPrice && skuDetail.oldPrice.toFixed(2) }}
                  </i>
                </view>
              </view>

              <view
                v-if="skuData.afterCouponPrice && selectCouponItem.length"
                class="reduced-price"
              >
                <text class="text1">券后</text>
                <text class="text2">￥{{ skuData.afterCouponPrice.toFixed(2) }}</text>              
              </view>
            </view>
          </view>
          <view class="sku-select"> 已选{{ selectItem }}</view>
        </view> -->
        <view class="sku">
          <scroll-view scroll-y="true" class="scroll-Y">
            <view class="sku-item-contaier">
				<view  v-for="(treeItem, index) in tree"
              		:key="index" class="sku-item">
					<view class="sku-name">车架类型</view>
					<view class="sku-val">
						<view
						v-for="(v, index_v) in treeItem.v"
						class="u-line-1"
						:class="[
							'sku-val-item',
							seletDefault.skuDefault == v.id ? 'pitch-on' : '',
							v.disabled ? 'disable' : '',
						]"
						@click="pitchOnFun(v)"
						:key="index_v"
						>
						<image
							v-if="v.imgUrl || v.imageUrl"
							:src="v.imgUrl || v.imageUrl"
							mode=""
							class="image"
						></image>
						<view class="text">
							<view class="text-contaier">
							{{ v.versionName }}</view>
							</view>
						<image
							class="big"
							src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/motorCar/ic_big.png"
							@click.stop="goodsimgShow(v.imageUrl)"
							v-if="index == 0"
						></image>
						</view>
					</view>	
				</view>		  
				<!-- 电池 -->
				<view class="sku-item sku-item-battery">
					<view v-if="skuData.batteryGoodsVos && skuData.batteryGoodsVos.length > 0" class="sku-name">电池类型</view>
					<view class="sku-val">
            {{selectId}}
						<view
						v-for="(treeItem, index) in skuData.batteryGoodsVos"
						:key="index"
						:class="[
							'u-line-1',
							'sku-val-item',
							seletDefault.batteryDefault == treeItem.id ? 'pitch-on' : '',
						]"
						@click="pitchBatteryOnFun(treeItem, skuData)"
						>
              <view class="text">                   
                {{ treeItem.versionName }}                  
              </view>
						</view>
					</view>
				</view>
            </view>

            <!-- 附近门店 -->
            <view class="sku-stores" v-if="$root.storeList.length > 0">
              <stores-card
                :isPay="true"
                storeTitle="到店自提"
                @handleGoToStores="handleGoToStores"
                @openAllStorePage="openAllStorePage"
                :choosedItem="choosedItem()"
              ></stores-card>
            </view>
            <!-- 优惠券-订单备注-发票 -->
            <!-- <view class="sku-stores">
              <coupon-area
                :skuData="skuData"
                :selectCouponItem="selectCouponItem"
                @couponClick="couponClick"
                @openRemarkt="openRemarkt"
                @openPopup="openPopup"
                :sendRemark="sendRemark"
                :invoiceType="invoiceType"
                :calcCounbon="calcCounbon"
              ></coupon-area>
            </view> -->
          </scroll-view>
        </view>
        <template v-if="false">
        <view class="fixed-column" v-if="!isShowDetail">
          <view class="fixed-column-money"  v-if="skuData.afterCouponPrice && selectCouponItem.length">
            <view class="fixed-column-money-left">
              <image
                src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/motorCar/ic_youhui.png"
                v-if="skuData.afterCouponPrice && selectCouponItem.length"
              ></image>
              <view class="txt_item">
                <view class="txt_2">
                  小计<span>{{ Number(skuPrice).toFixed(2) }}，</span>
                </view>
                <view
                  class="txt_3"
                  v-if="skuData.afterCouponPrice && selectCouponItem.length"
                >
                  优惠券减¥{{
                    calcCounbon
                  }}
                </view>
              </view>
            </view>
            <view
              class="fixed-column-money-right"
              @click="isShowDetail = !isShowDetail"
            >
              明细
              <image
                src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/motorCar/up.png"
                v-if="!isShowDetail"
              ></image>
              <image
                src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/motorCar/down.png"
                v-else
              ></image>
            </view>
          </view>
          <view class="spec-btn">
            <!--end 不是虚拟商品不显示加入购物车-->
            <view
              class="common-btn"
              :class="{ 'bug-now': canBuyNow, 'btn-grey': !canBuyNow }"
              v-if="openType != 2"
              @click="handleBugNow"
              >立即支付
              <view v-if="skuData.afterCouponPrice && selectCouponItem.length">
                ￥{{ Number(skuData.afterCouponPrice).toFixed(2) }}
              </view>
              <view v-else> ￥{{ Number(skuPrice).toFixed(2) }} </view>
              <!-- {{
                bestCoupon && bestCoupon.isReceive == 0 ? "领券" : "立即"
              }}支付 -->
            </view>
          </view>
        </view>
        </template>
      </view>
    </u-popup>

    <!-- 订单备注 -->
    <wsf-popup
      class="remarkt-popup"
      v-model="showRemark"
      mode="bottom"
      height="1024rpx"
    >
      <view class="remarkt-popup-box">
        <view class="remarkt-popup-title"
          >订单备注
          <image
            src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/motorCar/basic_close_icon.png"
            alt=""
            @click="showRemark = false; remark=''"
          />
        </view>
        <view class="remarkt-popup-textarea">
          <wsf-input
            v-model="remark"
            placeholder="选填，请先和商家协商一致，付款后商家可见"
            maxlength="200"
            type="textarea"
            :height="334"
            :auto-height="true"
            :clearable="false"
            class="remarkt-popup-textarea-input"
            :custom-style="{ padding: '24rpx' }"
            @input="handleInput"
          />
          <view class="remarkt-input">
            <text>{{ fontNum }}</text
            >/200
          </view>
        </view>
        <view class="coupon-confirm-button" @click="confirmRemarkCoupon"
          >确定</view
        >
      </view>
    </wsf-popup>

    <!-- 发票服务 -->
    <invoice-popup
      :popupShow="showInvoice"
      @goodFortuneConfirm="goodFortuneConfirm"
      @handleCloseDialog="handleCloseDialog"
    ></invoice-popup>

    <!-- 优惠券 -->
    <coupon-module
      ref="couponUnit"
      :couponList="storeCouponList"
      :skuData="skuData"
      @updateCouponList="queryCouponList"
      @confirmSelectCoupon="confirmSelectCoupon"    
    ></coupon-module>

    <!-- 价格明细 -->
    <wsf-popup
      class="money-detail-popup"
      v-model="isShowDetail"
      mode="bottom"
      z-index="10086"
      height="876rpx"
    >
      <view class="money-popup-box">
        <view class="money-popup-title"
          >价格明细
          <image
            src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/motorCar/basic_close_icon.png"
            alt=""
            @click="isShowDetail = false"
        /></view>

        <view class="money-content">
          <view class="money-content-line">
            <span>商品总价</span>
            <span>￥{{ Number(skuPrice).toFixed(2) }}</span>
          </view>
          <view
            class="money-content-line"
            v-if="skuData.afterCouponPrice && selectCouponItem.length"
          >
            <span>优惠券</span>
            <span>-￥{{ calcCounbon }}</span>
            <!-- (Number(skuPrice) - Number(skuData.afterCouponPrice)).toFixed(2) -->
          </view>
          <view class="money-content-line">
            <span>实付款</span>
            <span v-if="skuData.afterCouponPrice">
              ￥{{ Number(skuData.afterCouponPrice).toFixed(2) }}
            </span>
            <span v-else> ￥{{ Number(skuPrice).toFixed(2) }} </span>
          </view>
        </view>
      </view>
      <view class="fixed-column" v-if="isShowDetail">
        <view class="fixed-column-money">
          <view class="fixed-column-money-left">
            <image
              src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/motorCar/ic_youhui.png"
              v-if="skuData.afterCouponPrice && selectCouponItem.length"
            ></image>
            <view class="txt_item">
              <view class="txt_2">
                小计<span>{{ Number(skuPrice).toFixed(2) }}，</span>
              </view>
              <view
                class="txt_3"
                v-if="skuData.afterCouponPrice && selectCouponItem.length"
              >
                优惠券减¥{{
                  (Number(skuPrice) - Number(skuData.afterCouponPrice)).toFixed(
                    2
                  )
                }}
              </view>
            </view>
          </view>
          <view
            class="fixed-column-money-right"
            @click="isShowDetail = !isShowDetail"
          >
            明细
            <image
              src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/motorCar/up.png"
              v-if="!isShowDetail"
            ></image>
            <image
              src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/motorCar/down.png"
              v-else
            ></image>
          </view>
        </view>
        <view class="spec-btn">
          <!--end 不是虚拟商品不显示加入购物车-->
          <view
            class="common-btn"
            :class="{ 'bug-now': canBuyNow, 'btn-grey': !canBuyNow }"
            @click="handleBugNow"
            >立即支付
            <view v-if="skuData.afterCouponPrice">
              ￥{{ Number(skuData.afterCouponPrice).toFixed(2) }}
            </view>
            <view v-else> ￥{{ Number(skuPrice).toFixed(2) }} </view>
            <!-- {{
                bestCoupon && bestCoupon.isReceive == 0 ? "领券" : "立即"
              }}支付 -->
          </view>
        </view>
      </view>
    </wsf-popup>

    <u-mask :show="goodsImgShow" @click="goodsImgShow = false" z-index="99999">
      <view style="width: 100%; height: 100%; position: relative">
        <view class="rect" @tap.stop @click="goodsImgShow = false">
          <u-image
            :src="activeImg"
            mode="widthFix"
          ></u-image>
        </view>
      </view>
    </u-mask>
  </view>
</template>

<script>
const app = getApp();
import { priceFilter } from "@/common/wsfValidate.js";
import StoresCard from "./storesCard.vue";
import StoreItem from "./store-item.vue";
import couponArea from "./couponArea.vue";
import couponModule from "./couponModule.vue";
import invoicePopup from "./invoicePopup.vue";
export default {
  components: {
    StoresCard,
    StoreItem,
    couponArea,
    couponModule,
    invoicePopup,
  },
  data() {
    return {
      bestCoupon: null,
      skuPrice: 0,
      canBuyNow: true,
      selectSkuId: "",
      limitAddNum: 100000000,
      addNum: 1,
      choseFullSku: false, //是否选择规格
      freight: 0,
      openType: 0, //商品规格入口, 0:商品规格栏, 1:立即购买, 2:加入购物车
      specSelectModel: false,
      skuDetail: {},
      initialSku: {}, // 条件属性
      initialSkuArr: [], // 条件属性数组
      filterList: [], // 依据条件过滤的sku数组
      tree: [], // 选项列表
      firstOrderSkuId: "", // 保存skuId
      saveLimitNum: 1,
      // showActiveType:[],
      goodsImgShow: false,
      activeImg: "", // 选中属性对应的图片
      storeCouponList: [],
      selectCouponItem: [],
      showRemark: false, //订单备注弹窗
      remark: "", //订单备注
      sendRemark: "",
      showInvoice: false, // 发票弹窗
      invoiceType: 0,
      isShowDetail: false, // 是否显示价格明细
      fontNum: 0, // 备注输入字数
      popupShowContent: {}, // 发票信息
      selectId: '', // 选择的电池Id
      selectBattery: "", // 选择的电池名称
      isNext: true,
	    specName: '', //已选name
      seletDefault: {
        batteryDefault: '', //默认选择的电池
        skuDefault: '' //默认选择的规格
      }
    };
  },
  props: {
    //设置倒计时间，单位为秒
    timestamp: {
      type: Object,
      default() {
        return {
          seconds: 3600,
          label: "",
          startTime: null,
          discount: 0,
        };
      },
    },
    sourceType: {
      type: String,
      default() {
        return 1;
      },
    },
    recommendToken: {
      type: String,
      default() {
        return "";
      },
    },
    skuData: {
      type: Object,
      default() {
        return {};
      },
    },
    skuId: {
      type: String,
      default() {
        return null;
      },
    },
    // 秒杀数据
    marketingVos: {
      type: Array,
      default() {
        return [];
      },
    },
    idNumber: {
      type: String,
          default: ''
    },
    sendActiveImg: {
      type: String,
      default () {
        return '';
      },
    },
  },
  watch: {
    sendActiveImg(newVal){
      if(newVal){
        this.activeImg = newVal
      }
    },
    initialSku: {
      handler(n, o) {
        this.initialSkuArr = [];
        for (let i in n) {
          if (n[i]) {
            // console.log(n[i], "/-/-/-/-/-/---------------");
            this.initialSkuArr.push(n[i]); //属性
          }
        }
      },
      deep: true,
    },
    skuData: {
      handler(newV) {
        this.seletDefault.batteryDefault = newV.batteryGoodsVos ? newV.batteryGoodsVos[0].id : ''
        this.seletDefault.skuDefault = newV.id
      },
      deep: true,
      immediate: true
    },
    // "skuData.spuServiceSupports": {
    //   handler(val, oal) {
    //     if (!val.length || !val) {
    //       return;
    //     }
    //     setTimeout(() => {
    //       let info = uni.createSelectorQuery().in(this).select(".serve-name");
    //       let that = this;
    //       info
    //         .boundingClientRect(function (data) {
    //           //   if (data.height > 52) {
    //           //     that.serveShow = true;
    //           //   }
    //         })
    //         .exec(function (res) {});
    //     }, 500);
    //   },
    //   deep: true,
    // },
    "skuData.couponLabelList": {
      handler(val, oal) {
        if (!val) {
          return;
        }
        console.log(val, "valvalvalvalvalval");
        this.selectCouponItem = val[0] ? [val[0]] : [];
      },
      immediate: true,
    },
  },
  onLoad() {
    // this.selectCouponItem = this.skuData.couponLabelList[0] || []
  },
  computed: {
    calcCounbon(){
      if(this.skuData.afterCouponPrice){
        return  (Number(this.skuPrice) - this.skuData.afterCouponPrice).toFixed(2)
      } else {
        return ''
      }
    },
    batteryList() {
      const list = this.skuDetail.spuBatteryVos
        ? this.skuDetail.spuBatteryVos.map((item) => item)
        : [];
      if (
        this.skuDetail.liveSalesType == 2 ||
        this.skuDetail.liveSalesType == 3
      ) {
        list.push({
			batteryModel: "不含电池",
			batterySettingId: "",
        });
      }
      //   console.log(list, this.isNext, "list");
      //   if (this.isNext) {
      //     this.selectId = list[0].id ? list[0].id : "";
      //     this.selectBattery = list[0].batteryModel ? list[0].batteryModel : "";
      //     this.isNext = false;
      //   }
      return list;
    },
    selectItem() {
      let newName = "";
      let name = this.specName || "";
	  //   name = name.slice(name.indexOf("(") + 1, name.indexOf(")"));
      name = name.split("/");
      name.forEach((item, index) => {
        if (index < name.length - 1) {
          newName += `“${item}”、`;
        } else {
          newName += `“${item}”`;
        }
      });
      newName =
        newName + (this.selectBattery ? "、" + `“${this.selectBattery}”` : "");
      return newName;
    },
    getVersin() {
      if(this.skuDetail.versionVos && this.skuDetail.versionVos.length > 0) {
        let sku = this.skuDetail.versionVos.filter(item => item.id == this.seletDefault.skuDefault)
        return sku[0]['versionName']
      } else {
        return ''
      }
      
    }
  },
  methods: {
    choosedItem() {
      return this.$root.choosedItem;
    },
    openAllStorePage() {
      this.$root.openAllStorePage(true);
    },
    handleInput(e) {
      this.fontNum = e.length;
      console.log(e, "e=-===========");
    },
    handleCloseDialog() {
      this.showInvoice = false;
    },
    goodFortuneConfirm(invoiceType, popupShowContent) {
      this.showInvoice = false;
      this.invoiceType = invoiceType;
      this.popupShowContent = popupShowContent;
    },
    confirmRemarkCoupon() {
      this.showRemark = false;
      this.sendRemark = this.remark;
    },
    openPopup() {
      this.showInvoice = true;
    },
    openRemarkt() {
      this.showRemark = true;
    },
    confirmSelectCoupon(selectCouponItem) {
      console.log(selectCouponItem, "this.selectCouponItem");
      this.selectCouponItem = selectCouponItem ? [selectCouponItem] : [];
    },
    couponClick() {
		// 实体店不获取优惠券
		if(!this.idNumber){
			this.$refs.couponUnit.openCouponModel();
		}
		if (this.skuData.spuId) {
			this.queryCouponList();
		}
    },
    //优惠券列表
    queryCouponList() {
      this.$u.api
        .QueryCouponList({
          storeId: this.skuData.storeId,
          spuId: this.skuData.spuId,
        })
        .then((res) => {
          if (res.code == 200) {
            this.storeCouponList = res.data;
          }
        });
    },
    handleGoToStores() {
      this.specSelectModel = false;
    },

    goodsimgShow(url) {
      this.activeImg = url || ''
      this.goodsImgShow = true;
    },
    skuPriceInt(data) {
      let price = 0;
      if (data) {
        price = data.split(".")[0];
      }
      return price;
    },
    skuPriceFloat(data) {
      let price = "00";
      if (data) {
        price = data.split(".")[1];
      }
      return price;
    },
    updateSku() {
      this.specSelectModel = false;
      if (this.selectSkuId) {
        this.$emit("updateSku", this.selectSkuId);
      }
    },
    // 校验是否超过平台秒杀限制数
    CheckSkuPanicBuyLimitNum(data, limitNum, inputNum) {
      if (inputNum > limitNum) {
        this.$u.toast(`购买数量不能超过库存数量`);
      }
      this.$u.api.CheckSkuPanicBuyLimitNum(data).then((res) => {
        if (res.data && res.data.limitNum) {
          if (res.data.hasBoughtNum) {
            this.addNum = this.saveLimitNum;
            this.$u.toast(
              `限购${res.data.limitNum}件,你已购买过${res.data.hasBoughtNum}件了`
            );
          } else {
            this.addNum = this.saveLimitNum;
            this.$u.toast(`抱歉，该商品限购${res.data.limitNum}件`);
          }
        } else {
          this.saveLimitNum = inputNum;
        }
      });
    },
    // 步进器 -
    minusFun() {
      if (this.addNum > 1) {
        this.addNum = parseInt(this.addNum) - 1;
        let isIgnore = this.openType == 2 ? false : true;
        let params = {
          num: this.addNum,
          skuId: this.selectSkuId,
          isIgnore: isIgnore,
        };
        this.$emit("minus", params, this.limitAddNum);
      }
    },
    // 步进器 +
    plusFun() {
      console.log(this.addNum, "--", this.limitAddNum);
      if (this.addNum < this.limitAddNum && this.addNum !== this.limitAddNum) {
        this.addNum = parseInt(this.addNum) + 1;
        let params = {
          isIgnoreCartNum: this.openType == 2 ? false : true,
          buyNowRequestList: [
            {
              num: this.addNum,
              skuId: this.selectSkuId,
              sourceType: this.sourceType,
              storeId: this.skuData.storeId,
            },
          ],
        };
        let inputNum = this.addNum;
        this.CheckSkuPanicBuyLimitNum(params, this.limitAddNum, inputNum);
      }
    },
    // 步进器输入框输入时执行
    minusInput(e) {
      if (e.detail.value !== null && e.detail.value !== "") {
        let params = {
          isIgnoreCartNum: this.openType == 2 ? false : true,
          buyNowRequestList: [
            {
              num: e.detail.value,
              skuId: this.selectSkuId,
              sourceType: this.sourceType,
              storeId: this.skuData.storeId,
            },
          ],
        };
        let inputNum = e.detail.value;
        this.CheckSkuPanicBuyLimitNum(params, this.limitAddNum, inputNum);
      } else {
        this.addNum = e.detail.value;
      }
    },
    // 失焦时执行
    minusBlur(e) {
      if (
        e.detail.value !== null &&
        e.detail.value !== "" &&
        e.detail.value > 1
      ) {
        // console.log("失焦", e);
        // console.log("marketingVos----------", this.marketingVos);
        if (e.detail.value <= this.limitAddNum) {
          this.addNum = e.detail.value;
        } else if (!this.marketingVos.map((item) => item.type).includes("16")) {
          this.$u.toast(`购买数量不能超过库存数量`);
          this.addNum = this.limitAddNum;
          return;
        } else {
          this.addNum = this.limitAddNum;
        }
        if (this.marketingVos.length && this.marketingVos[0].iSeckill) {
          this.$emit("minusBlur", {
            num: e.detail.value,
            skuId: this.selectSkuId,
          });
        }
      } else {
        this.addNum = 1;
      }
    },
    initData() {
      // 重新初始化addNum，去登录页面回来时没有重置addNum
      this.addNum = 1;

      this.init();
    },
    showToastError(errMsg, duration = 2500) {
      uni.showToast({
        title: errMsg,
        icon: "none",
        mask: true,
        duration: duration,
      });
    },
    navigateTo(sceneName, params) {
      // this.$wsf.go('Login')
      this.$wsf.go(sceneName, params);
    },
    // 返回店铺信息
    getStoreInfos() {
      let storeinfos = [
        {
          remark: this.sendRemark,
        },
      ];
      return storeinfos;
    },

    // 返回需要提交的订单信息
    getSubmitOrderParams() {
      let params = {};
	  console.log(this.popupShowContent,'this.popupShowContentthis.popupShowContent');
	  if(this.popupShowContent && this.popupShowContent.invoice){
		this.popupShowContent.invoice.storeId = this.skuData.storeId
	  }
      params.invoiceList = this.popupShowContent && this.popupShowContent.invoice ? [this.popupShowContent.invoice] : [];
      params.storeInfos = [
        {
          remark: this.sendRemark,
          storeId: this.skuData.storeId
        },
      ];
      // 实体店下单带参数
      if(this.skuData.storeId){
        params.priceType = 1
      }
      params.buyNowRequestList = this.buyNowRequestList;

      params.orderToken = this.recommendToken;
      params.electricType = 0; //  0  商城下单，1实体店下单

      // params.buyNowRequestList.batterySettingId = this.selectId
      if(this.selectCouponItem && this.selectCouponItem.length>0 && this.skuData.afterCouponPrice){
        params.onlineRetailerCouponIds = this.selectCouponItem.map((item) => {
          return item && item.id;
        });
      }	
      params.orderType = "12";
      params.ids = [];
      // let productCouoponIds = []
      // this.settlement.storeSettlements.forEach(item => {
      // 	productCouoponIds = productCouoponIds.concat(item.onlineRetailerCouponIds)
      // })
      // params.onlineRetailerCouponIds = productCouoponIds
      return params;
    },
    handleBugNow() {
      let data = this.getSubmitOrderParams();
      console.log("data", data);
      data.source = this.$store.getters.getIntoSource; // 订单来源
      //立即购买到结算页面
      data.buyNowRequestList = [
        {
          num: this.addNum,
          skuId: this.selectSkuId,
          recommendToken: this.recommendToken,
          sourceType: 3,
          storeId: this.$root.choosedItem
            ? this.$root.choosedItem.idNumber
            : "",
          batterySettingId: this.selectId,
        },
      ];

      console.log("--------提交订单数据data", data);
      if (!this.$root.choosedItem) {
        return this.$u.toast("请选择门店后购买");
      }
      if (this.skuData.liveSalesType == 1 && !this.selectId) {
        return this.$u.toast("请选择电池后购买");
      }
      this.$u.api
        .SubmitOrder(data)
        .then((res) => {			
			if (res.data.result == 0) {
				// 需要付款跳转到支付页面
				if (res.data.needPay == 0) {
				this.navigateTo(
					"Pay",
					{
            orderMoney: res.data.orderFqzMoney,
            orderCode: res.data.orderCode,
            businessType: 100,  
            paySceneType: 101 //电商订单        
					},
					"redirectTo"
				);
				} else {
				// 不需要付款 跳转到付款成功页面
				this.$wsf.go("CheckOrderPay", { orderCode: res.data.orderCode });
				// this.navigateTo('OrderNoPaySuccess', { orderMoney: res.data.orderMoney });
				} 
			} else if (
				res.data.result == 105 ||
				res.data.result == 106 ||
				res.data.result == 4114 ||
				res.data.result == 4103
			) {
				uni.navigateBack();
			} else if (res.data.result == "-13") {
			} else {          
				if (res.data.needPay == -1) {
				} else {
					this.$u.toast(that.orderError[res.data.result]);
				}           
			}
		})
        .catch((error) => {
			this.$u.toast(error.data.msg)
			// 订单提交失败		 
			console.log(error, "error");
        });
    },

    //打开规格弹窗
    openSkuModal(type) {
      this.openType = type;
      if (this.skuData.sellOut == 1 || this.skuData.isGift == 1) {
        this.canBuyNow = false;
      }
      // console.log("marketingVos",this.marketingVos)
      // if (this.skuData.marketingVos) {
      // 	let istypeShow = this.skuData.marketingVos.map((temp) => {
      // 		if (temp.type == 1 || temp.type == 13 || temp.type == 16) {
      // 			return true
      // 		} else {
      // 			return false
      // 		}
      // 	})
      // 	this.showActiveType = istypeShow
      // 	console.log('showActiveType', this.showActiveType)
      // }
      this.specSelectModel = true;
    },
    //商品规格相关-起
    init() {
      // console.log(this.skuData, "this.skuData1111111111");
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
            // temp.previewImgUrl = temp.imgUrl
          });
        } else {
          item.v.forEach((temp, i) => {
            temp.previewImgUrl = temp.imgUrl;
          });
        }
      });
      console.log(this.skuData.sku.tree, 'jjkkk');
      // console.log(this.skuData.sku.tree, "this.skuData.sku.tree---+++");
      this.initialSku = this.skuDetail.sku.initialSku;
      // this.calcSkuDisabled();
    },
    // 点规格重查详情
    pitchOnFun(v, treeItem, v_i) {
      if(v.id != this.seletDefault.skuDefault) {
        this.seletDefault.skuDefault = v.id
        this.$emit("restDetails", v.id);
      }
    },
    // 点电池不用重查
    pitchBatteryOnFun(treeItem) {
      if(this.seletDefault.batteryDefault != treeItem.id) {
        this.seletDefault.batteryDefault = treeItem.id
      } 
    },
    // 计算Sku选择属性是否可选
    calcSkuDisabled() {
      // console.log("计算可选");
      this.tree.forEach((treeItem) => {
        treeItem.v.forEach((vItem) => {
          vItem.disabled = this.filterSku(treeItem.k_s, vItem.id);
        });
      });
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
		    this.specName = this.filterList[0].name
        console.log(this.filterList, "this.filterList");
        let skuId = this.filterList[0].id;
        this.firstOrderSkuId = skuId;
        this.selectSkuId = skuId;

        // this.skuPrice = priceFilter(this.filterList[0].price / 100);
        this.skuPrice = priceFilter(this.skuDetail.price);

        this.$nextTick(() => {
          this.getBestCoupon(skuId);
        });
      }
      let ele = this.skuDetail.list.filter(item=>{
        return item.id == this.firstOrderSkuId
      })				
      this.activeImg = ele[0] ? ele[0].imgUrl : ''
      return !hasStock;
    },
    //商品规格相关-止
    //选出最优惠的优惠券
    getBestCoupon(id) {
      let obj = {
        num: 1,
        skuId: id,
        sourceType: this.sourceType,
        storeId: this.skuData.storeId,
      };
      let filterList = [];
      filterList.push(obj);
      this.$u.api
        .CartSummary({
          shoppingCartList: filterList,
        })
        .then((res) => {
          if (
            res.code == 200 &&
            res.data.storeSummaryList &&
            res.data.storeSummaryList.length > 0 &&
            res.data.storeSummaryList[0].couponId
          ) {
            this.bestCoupon = res.data.storeSummaryList[0].coupon;
          } else {
            this.bestCoupon = null;
          }
          this.$emit("commitBestCoupn", this.bestCoupon);
        });
    },
  },
};
</script>

<style scoped lang="scss">
.rect {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
}

.wsf-number-box {
  display: flex;
  align-items: center;

  .minus {
    display: flex;
    // justify-content: left;
    align-items: center;
    width: 50rpx;
    height: 50rpx;
  }

  .skill-txt {
    margin-right: 40rpx;
    font-size: 24rpx;
    font-weight: 400;
    color: #e60113;
  }

  .num {
    width: 80rpx;
    height: 40rpx;
    line-height: 40rpx;
    text-align: center;
    font-size: 24rpx;
    font-weight: 500;
    color: #333333;
    background: #f5f5f5;
    border-radius: 5px;
    // margin: 0 16rpx;
  }

  .plus {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    width: 50rpx;
    height: 50rpx;
  }
}

.location-icon {
  vertical-align: text-bottom;
}

.popup {
  background: #f6f6f6;
  border-radius: 24rpx 24rpx 0rpx 0rpx;
  position: relative;
  .spec-popup-title {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    z-index: 1;
    padding: 24rpx;
    view {
      font-size: 16px;
      font-weight: 500;
      color: #111111;
      margin: 0 16rpx;
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    image {
      height: 40rpx;
      width: 54rpx;
    }
  }
  .sku-info {
    box-sizing: border-box;
    width: 100%;
    display: flex;
    flex-direction: column;
    padding: 36rpx 36rpx 0rpx 36rpx;
    height: 162rpx;
    position: absolute;
    z-index: 999;
    .img {
      width: 200rpx;
      height: 200rpx;
      margin-right: 20rpx;
      image {
        width: 200rpx;
        height: 200rpx;
      }
    }
    .info {
      width: 100%;
      display: flex;
      align-items: flex-end;
      .price {
        display: flex;
        .performance-part {
          margin-bottom: 10rpx;
          vertical-align: text-bottom;
          display: inline-block;
          height: 44rpx;
          background: #fcf0f2;
          border-radius: 22rpx;
          line-height: 44rpx;
          padding: 0 20rpx;
          font-size: 26rpx;
          color: #e60113;
        }
        .txt_item {
          .txt_1,
          .txt_2 {
            color: #e60113;
          }
          .txt_1 {
            font-size: 32rpx;
            font-weight: 500;
          }
          .txt_2 {
            font-size: 50rpx;
            font-weight: 600;
            display: inline-block;
            .float {
              font-size: 36rpx;
            }
          }
          .reduced-price {
            margin-left: 16rpx;
            font-weight: normal;
            vertical-align: text-bottom;
            height: 40rpx;
            background: linear-gradient(90deg, #ec5f2a 0%, #e60113 100%);
            border-radius: 200rpx;
            padding: 0 24rpx;
            display: inline-flex;
            color: #fff;
            font-size: 24rpx;
            justify-content: center;
            align-items: center;
            i {
              font-size: 32rpx;
              color: #fff;
            }
          }
        }
        .performance-mark {
          margin-bottom: 30rpx;
          padding: 0 8rpx;
          display: inline-flex;
          align-items: center;
          height: 32rpx;
          border-radius: 4rpx;
          border: 1rpx solid #fd302c;
          color: #fd302c;
          font-size: 20rpx;
        }
        .reduced-price {
          height: 48rpx;
          background: #e60113;

          padding: 0 16rpx;
          margin: 4rpx 0 10rpx 4rpx;
          display: inline-flex;
          color: #fff;
          font-size: 28rpx;
          justify-content: center;
          align-items: center;
          font-weight: 500;
          line-height: 36rpx;
          background: linear-gradient(90deg, #ff5f2e 0%, #ff0a35 100%);
          border-radius: 30rpx 30rpx 30rpx 4rpx;
        }
        .no {
          text {
            font-size: 22rpx;
            font-weight: 400;
            color: #999999;
          }
        }
      }
    }
  }
  .sku-select {
    margin-left: 24rpx;
    font-size: 26rpx;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #999999;
  }

  .sku {
    // padding-top: 162rpx;
    // padding-top: 92rpx;
    height: calc(100% - 40rpx);
    position: fixed;
    background: rgba(246, 246, 246, 1);
    padding-bottom: 30px;
    .scroll-Y {
      box-sizing: border-box;
      padding: 0 24rpx;
      width: 100vw;
      height: 100%;
      ::-webkit-scrollbar {
        width: 0;
        height: 0;
        color: transparent;
      }
	  .sku-item-contaier{
		padding: 24rpx;
		background: #ffffff;
		border-radius: 24rpx;
		.sku-item{           
			//margin-top: 24rpx;
			.sku-name {
			padding-bottom: 16rpx;
			font-weight: bold;
			}
			.sku-val {
			display: flex;
			flex-wrap: wrap;
			&-item {
				min-width: 80rpx;
				box-sizing: border-box;
				text-align: center;
				padding: 0 20rpx;
				margin-right: 20rpx;
				height: 56rpx;
				line-height: 56rpx;
				background: #f2f2f2;
				border-radius: 26px;
				margin-bottom: 24rpx;
				border: 1px solid #f2f2f2;
				text {
				font-weight: 400;
				font-size: 28rpx;
				color: #000000;
				}
			}
			.pitch-on {
				border: 0.5rpx solid #ff0a35;
				background: rgba(254,48,64,0.06);
				.text {
				  color: #ff0a35;
				}
			}
			.disable {
				background-color: #f2f2f2;
				border: 1px solid #f2f2f2;
				color: #bababa;
			}
			}
		}
		.sku-item:first-of-type{
			.sku-val {
			&-item {
				width: calc((100% - 36rpx) / 3);
				height: 206rpx;
				line-height: 206rpx;
				box-sizing: border-box;
				text-align: center;
				padding: 8rpx 12rpx;
				margin-right: 18rpx;
				background: #f2f2f2;
				border-radius: 24rpx;
				margin-bottom: 24rpx;
				border: 1px solid #f2f2f2;
				position: relative;
				.text {
				font-weight: 400;
				font-size: 26rpx;
				color: #191919;
				position: absolute;
				width: 100%;
				height: 44rpx;
				line-height: 44rpx;
				bottom: 0;
				left: 0;
				background: #F6F6F6;
				border-radius: 0rpx 0rpx 24rpx 24rpx;
				}
				.image {
				// width: calc(100% - 24rpx);
				// height: calc(100% - 22rpx);
				width: 100%;
				height: 100%;
				position: absolute;
				// top: 8rpx;
				// left: 8rpx;
				top: 0;
				left: 0;
				}
				.big {
				  width: 28rpx;
				  height: 28rpx;
				  position: absolute;
				  top: 12rpx;
				  right: 12rpx;
				}
			}
			&-item:nth-of-type(3n) {
				margin-right: 0;
			}
			}
			.pitch-on {
			  border: 0.5px solid rgba(255, 10, 53, 1);
			  .text {
			  	background-color: #FFE7EB;
			  	color: rgb(255, 10, 53);
			  }
			}
      .text-contaier{
			  opacity: 1;
        font-size: 13px;
			}
		}
	  }
      // .sku-item-battery {
      //   padding: 0 24rpx;
      // }
      .sku-stores {
        background: #ffffff;
        border-radius: 24rpx;
        margin-top: 24rpx;
      }
    }
  }
}
.fixed-column {
  border-top: 1px solid #f5f5f5;
  width: calc(100% - 48rpx);
  position: fixed;
  z-index: 10087;
  bottom: 0;
  left: 0;
  padding: 20rpx 24rpx;
  box-sizing: content-box;
  background: #ffffff;
  box-shadow: 0rpx -4rpx 20rpx 0rpx rgba(189, 194, 204, 0.2);
  .fixed-column-money {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20rpx;
    .fixed-column-money-left,
    .fixed-column-money-right {
      display: flex;
      align-items: center;
    }
    image {
      width: 36rpx;
      height: 36rpx;
      margin-right: 8rpx;
    }
    .txt_item {
      .txt_2 {
        font-size: 26rpx;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #191919;
        display: inline-block;
      }
      .txt_3 {
        display: inline-block;
        font-size: 26rpx;
        font-family: DINAlternate-Bold, DINAlternate;
        font-weight: bold;
        color: #ff0a35;
      }
    }
  }
  p {
    line-height: 24rpx;
    padding: 2rpx 0 12rpx;
    text-align: center;
    color: #999;
    font-size: 24rpx;
    span {
      color: $wsf-color-red;
    }
  }
  .spec-btn {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    margin: 0 auto;

    .common-btn {
      display: flex;
      justify-content: center;
      flex: 1;
      border-radius: 40rpx;
      height: 80rpx;
      text-align: center;
      line-height: 80rpx;
      font-size: 28rpx;

      &:nth-child(2) {
        margin-left: 24rpx;
      }
    }

    .bug-now {
      background: linear-gradient(90deg, #ff5f2e 0%, #ff0a35 100%);
      color: #fff;
    }

    .btn-grey {
      background: #f2f2f2;
      color: #bababa;
    }
  }
}
.spec-module {
  //   padding: 24rpx 0 0 0;
}
.service {
  margin: 0 24rpx;
  .service-time {
    display: flex;
    justify-content: space-between;
    padding: 19rpx 0;
    .flex-time {
      display: flex;
      span {
        flex-shrink: 0;
        font-size: 26rpx;
        color: #c3c3c3;
        width: 76rpx;
      }
      .icon-adrs {
        width: 32rpx;
        height: 32rpx;
        display: block;
        padding-right: 4rpx;
      }
      .selects {
        font-size: 26rpx;
        color: #191919;
      }
      .beyond {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        overflow: hidden;
        -webkit-line-clamp: 2; /* 2 是控制文字几行 */
        width: 520rpx;
      }
      .colors_ {
        font-size: 26rpx;
        color: #c3c3c3;
      }
      .address_ {
        width: 480rpx;
        overflow: hidden; //超出隐藏
        white-space: nowrap; //不折行
        text-overflow: ellipsis; //溢出显示省略号
      }
    }
    img {
      width: 32rpx;
      height: 32rpx;
      display: block;
      margin-top: 2rpx;
    }
  }
}
.serve {
  background-color: rgba(246, 246, 246, 0.5);
  border-radius: 0 0 16rpx 16rpx;
  padding: 20rpx 24rpx 24rpx 24rpx;
  .serve-name {
    display: flex;
    flex-wrap: wrap;
    .flex-name {
      display: flex;
      align-items: center;
      padding-right: 16rpx;
      padding-bottom: 8rpx;
      img {
        width: 24rpx;
        height: 26rpx;
        display: block;
        flex-shrink: 0;
        padding-right: 4rpx;
      }
      span {
        font-size: 26rpx;
        font-weight: 400;
        color: #999999;
      }
    }
  }
  .packUp {
    height: 80rpx;
    overflow: hidden;
  }
  .btn {
    width: 122rpx;
    height: 32rpx;
    border-radius: 16rpx;
    margin: 0 auto;
    margin-top: 20rpx;
    img {
      width: 121rpx;
      height: 31rpx;
      display: block;
    }
  }
}

.remarkt-popup {
  .remarkt-popup-box {
    height: 1024rpx;
    background: #f6f6f6;
    .remarkt-popup-textarea {
      background: #ffffff;
      border-radius: 24rpx;
      margin: 24rpx;
      .remarkt-popup-textarea-input {
        /deep/.u-input--border {
          border-radius: 24rpx;
        }
      }
      .remarkt-input {
        text-align: right;
        padding: 20rpx 24rpx;
        font-size: 26rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #c3c3c3;
      }
    }
    .remarkt-popup-title {
      text-align: center;
      font-size: 32rpx;
      line-height: 44rpx;
      position: relative;
      padding-top: 24rpx;
      padding-bottom: 24rpx;
      color: #000d1d;
      > image {
        position: absolute;
        right: 48rpx;
        top: 30rpx;
        height: 40rpx;
        width: 54rpx;
      }
    }
    .coupon-confirm-button {
      position: fixed;
      bottom: 24rpx;
      width: calc(100% - 48rpx);
      margin: 10rpx 24rpx;
      height: 80rpx;
      background: #e60113;
      border-radius: 38rpx;
      line-height: 80rpx;
      text-align: center;
      color: #fff;
      font-size: 28rpx;
    }
  }
}
.money-detail-popup {
  padding: 24rpx;
  .money-popup-box {
    background: #f6f6f6;
    border-radius: 24rpx 24rpx 0rpx 0rpx;
    height: 100%;
    .money-popup-title {
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
    .money-content {
      display: flex;
      flex-direction: column;
      background: #fff;
      border-radius: 24rpx;
      margin: 24rpx;
      padding: 24rpx;
      .money-content-line {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 72rpx;
        span:first-of-type {
          font-size: 26rpx;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #191919;
        }
      }
      .money-content-line:nth-of-type(1) {
        span:last-of-type {
          font-size: 26rpx;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #191919;
        }
      }
      .money-content-line:nth-of-type(2) {
        span:last-of-type {
          font-size: 26rpx;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #ff0a35;
        }
      }
      .money-content-line:nth-of-type(3) {
        span:last-of-type {
          font-size: 22rpx;
          font-family: DINAlternate-Bold, DINAlternate;
          font-weight: bold;
          color: #ff0a35;
        }
      }
    }
  }
}
</style>

<template>
  <view class="sku-wraper">
    <view class="business-wraper">
      <view class="business-title">
        <image :src="cartIcon" class="business-title__flag"/>
        <view class="business-title__word">{{ cartTitle }}</view>
      </view>
      <view class="business-list">
        <!-- 区分店铺 -->
        <view class="business-list__store" v-for="(item, cartsIndex) in dealCarts" :key="cartsIndex">
          <u-swipe-action
            class="swipe-action"
            v-for="(normalSkusItem, index) in item.validSpus"
            :index="index"
            :key="index"
            :show="normalSkusItem.actionShow"
            @click="swipeActioncFun(index, cartsIndex)"
            @open="open(cartsIndex, index)"
            :options="options"
            btn-width="160"
          >
            <everySku :sku="normalSkusItem" @dataChange="dataChange" @propsSelect="popupShowFun"></everySku>
          </u-swipe-action>
        </view>
      </view>
      <view class="business-selectall">
        <view class="business-selectall__left">
          <view class="business-selectall__allbtn" :class="{ checked: checkAll }" @click="checkAllFun"></view>
          全选
        </view>
        <view class="business-selectall__right" v-if="!isEdit">
          <view class="business-selectall__price">
            <view class="all-price">合计：<text class="price">¥{{ totalPrice | priceFilter }}</text></view>

            <view class="discount" @tap="openDiscountsInfoModel()">
              <block v-if="discountMoney && discountMoney > 0 && totalPerformanceScore > 0">
                已优惠￥{{ discountMoney | priceFilter }}
                <u-icon style="margin-left: 8rpx" name="arrow-right" color="#e60113" size="18"></u-icon>
              </block>
              <block v-if="discountMoney && discountMoney > 0 && totalPerformanceScore == 0">
                已优惠￥{{ discountMoney | priceFilter }}
                <u-icon v-if="discountsInfoShow == false" style="margin-left: 8rpx" name="arrow-down" color="#e60113" size="18"></u-icon>
                <u-icon v-if="discountsInfoShow == true" style="margin-left: 8rpx" name="arrow-up" color="#e60113" size="18"></u-icon>
              </block>
              <block v-if="!discountMoney && totalPerformanceScore > 0">
                绩效分{{ totalPerformanceScore }}
              </block>
            </view>
          </view>
          <view class="business-selectall__submit" @click="settlement">去结算({{ sum }})</view>
        </view>
        <!-- 编辑 -->
        <view v-else>
          <view class="business-selectall__submit business-selectall__edit" :class="{'submit-cover' : sum == 0}" @click="settlementDelete">删除({{ sum }})</view>
        </view>
        <view class="discounts-info-model" v-if="discountsInfoShow == true">
          <view class="discounts-info-title">金额明细</view>
          <view class="discounts-info-close-btn" @click="discountsInfoShow = false"></view>
          <view class="goods-list-item">
            <view class="discounts-info-column">
              <view>商品总额</view>
              <view>¥{{ totalOldPrice | priceFilter }}</view>
            </view>
            <view class="discounts-info-column" v-if="totalMarketDiscount > 0">
              <view>活动</view>
              <view class="discounts-info-text-red">-¥{{totalMarketDiscount | priceFilter}}</view>
            </view>
            <view class="discounts-info-column" v-if="totalCouponDiscount > 0">
              <view>优惠券</view>
              <view class="discounts-info-text-red">-¥{{totalCouponDiscount | priceFilter}}</view>
            </view>
          </view>

          <view class="Performance-f" v-if="totalPerformanceScore > 0">
            <view>绩效分</view>
            <view>{{totalPerformanceScore}}</view>
          </view>
        </view>
      </view>
    </view>

    <!--限购商品列表 -->
    <!-- 后续确定没有，可以删掉 -->
    <skuLimit
      v-if="showLimit"
      :showModal="showLimit"
      :limitSkuList="limitSkuList"
      :limitFirstList="limitFirstList"
      @cancel="showLimitCancel"
      @confirm="showLimitConfirm"
    ></skuLimit>

    <!-- 确认弹框 -->
    <smartConfirm
      :show="showConfirm"
      :title="confirmText"
      :cancelText="'取消'"
      :confirmText="'确定'"
      @cancel="cancel"
      @confirm="confirm"
    />
    <!-- 商品属性弹出层 -->
    <!-- 属性弹窗移出来的原因是弹窗fixed定位问题，子组件中使用了u-swipe-action，有transform属性，导致定位有问题 -->
		<smart-prop v-if="popupShow" :sku-data="skuDetail" :show.sync="popupShow"  @skuConfirm="skuConfirm" @goodsImgShow="goodsImgShow"></smart-prop>

    <!-- 规格图片预览 -->
    <u-mask :show="previewImg" @click="previewImg = false" z-index="99999">
      <view class="rect-wraper">
        <view class="rect" @tap.stop @click="previewImg = false"><u-image :src="previewshowImg" mode="widthFix"></u-image></view>
      </view>
    </u-mask>
  </view>
</template>

<script>
// 全局组件
// import wsfSku from '@/components/wsf-sku/wsf-sku.vue';
import smartProp from '@/components/smart/smart-prop/smart-prop.vue';
import smartConfirm from "@/components/smart/smart-confirm/smart-confirm.vue";
// 页面组件
import everySku from "../every-sku/index";
import skuLimit from "../sku-limit/index";

// 获取接口常量
import { CARTSTATUS } from '../../common/constants/cart'
import { selectinitialSkuList, initialSkuUpdate, shoppingCarCheckUpCount } from '@/common/smart-api/cartApi'
import { BUSINESS_TYPE } from '@/common/constants/order'
import { fenToYuan } from "@/common/utils.js";

export default {
  name: 'skuList',
  components: {
    everySku,
    skuLimit,
    smartProp,
    smartConfirm
  },
  props: {
    configData: {
      type: Object,
      default: {}
    },
    carts: {
      type: Array,
      default: []
    },
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // 页面中使用图片
      
      // 页面使用数据
      dealCarts: [],
      checkAll: false, // 是否全选
      discountsInfoShow: false, // 优惠弹窗
      sum: 0, //要结算的商品数

      // 价格相关
      totalMarketDiscount: 0, // 活动总优惠
      totalPerformanceScore: 0, // 总绩效分
			totalOldPrice: 0, // 商品总原价
			totalCouponDiscount: 0, // 卡券总优惠
			totalPrice: 0, // 商品优惠后总价
      discountMoney: 0, // 已优惠 = 商品优惠券 + 活动减免综合

      // 超限商品
      limitSkuList: [], // 超限秒杀商品数组
			limitFirstList: [], // 超限首单商品数组
			showLimit: false, // 超限活动商品弹窗状态

      // 页面渲染数据
      confirmText: '', // 删除确认文案
      showConfirm: false, // 删除二次确认弹窗
      cartsIndexs: { // 单个删除
        cartsIndex: null,
				index: null
      },

      // 属性弹窗相关
      popupShow: false, // 属性弹窗开关
      skuDetail: {}, // 商详信息
      shopNum: 0, // 商品数量
      previewshowImg: '', // 预览图片
      previewImg: false, // 预览图片开关

      // u-swipe-action 配置
      options: [{
        text: '删除',
        style: {
          color: '#fff',
          backgroundColor: '#fe3040',
          margin: '20rpx 0 20rpx 0'
        }
      }],
    };
  },
  computed: {
    cartIcon () {
      return this.configData.businessIconUrl || `${this.$smartImg}/cart/cart-icon.png`
    },
    cartTitle () {
      return this.configData.businessTypeName || '电商'
    }
  },
  watch: {
    carts: {
      handler(newVal, oldvalue) {
        let dealCarts = this.$u.deepClone(this.carts)
        // 处理数据，给spu中注入storeId
        dealCarts.forEach(store => {
          store.validSpus = (store.validSpus || []).map(spu => {
            return {
              storeId: store.storeId,
              ...spu
            }
          })
        })
        this.dealCarts = dealCarts
      },
			immediate: true,
			deep: true
    },

    // 这里区分了两个是因为后续操作会改变dealCarts
		dealCarts: {
			handler(newVal, oldvalue) {
        this.sum = 0
        this.dealCarts.forEach(store => {
          return store.validSpus.forEach(spuItem => {
            if (spuItem.checked) {
              // 计算勾选商品总数
              this.sum++;
            }
          })
        })
      },
			// immediate: true,
			deep: true
		}
  },
  methods: {
    swipeActioncFun(index, cartsIndex) {
			this.cartsIndexs = {
				cartsIndex,
				index
			};
			console.log(this.cartsIndexs);
			this.confirmText = `确认要删除已选中的1件商品？`;
			this.showConfirm = true;
		},
    open(cartsIndex, index) {
      this.dealCarts.forEach((store, cartIdx) => {
        (store.validSpus || []).map((spu, spuIdx) => {
          if(cartsIndex == cartIdx && index == spuIdx) {
            spu.actionShow = true
          } else {
            spu.actionShow = false
          }
        })
      })
    },

    // 检查商品是否失效
    grayJudge(sku) {
      return sku.stock == 0 
        || sku.status == CARTSTATUS.noEnoughStock 
        || sku.status == CARTSTATUS.outofStock 
        || sku.status == CARTSTATUS.soldout 
        || sku.status == CARTSTATUS.loseEffect
    },

    // 所有店铺下的商品全选
		checkAllFun() {
			this.checkAll = !this.checkAll;
			if (this.checkAll) {
				//全选
				this.dealCarts.forEach(store => {
          (store.validSpus || []).forEach(skuItem => {
            if (!this.grayJudge(skuItem)) {
              skuItem.checked = true;
            }
          })
				});
			} else {
				//取消全选
				this.dealCarts.forEach(store => {
          (store.validSpus || []).forEach(skuItem => {
            skuItem.checked = false;
          })
				});
			}
			this.getDiscountPrice();
		},

    // 判断全选按钮是否勾选，如果有未被选中的就不能勾选
    judgeCheckAll() {
      let flag = this.dealCarts.some(store => {
        return store.validSpus.some(skuItem => {
          return !skuItem.checked
        })
      })
      this.checkAll = !flag
    },

    // 子组件修改数据，父组件同步修改
    dataChange(sku) {
      // 找到对应的数据，开始修改
      this.dealCarts.some(store => {
        return store.validSpus.some(skuItem => {
          if (skuItem.cartId == sku.cartId) {
            Object.assign(skuItem, sku)
            return true
          }
        })
      })

      // 修改之后的副作用
      // 判断是否需要勾选外层全选
      this.judgeCheckAll()

      // 重新计算优惠券金额
			this.getDiscountPrice();
    },

    // 重置优惠数据
    resetDiscount() {
      this.totalMarketDiscount = 0; // 活动总优惠
      this.totalPerformanceScore = 0; // 总绩效分
			this.totalOldPrice = 0; // 商品总原价
			this.totalCouponDiscount = 0; // 卡券总优惠
			this.totalPrice = 0; // 商品优惠后总价
      this.discountMoney = 0; // 已优惠 = 商品优惠券 + 活动减免综合
    },

    // 计算优惠券金额
    getDiscountPrice() {
      let params = []
      this.dealCarts.forEach(store => {
        let spuParams = store.validSpus
          .filter(skuItem => skuItem.checked)
          .map(skuItem => {
            return {
              cartId: skuItem.cartId,
              checked: skuItem.checked,
              num: skuItem.num,
              oldPrice: skuItem.oldPrice,
              skuId: skuItem.skuId,
              sourceType: skuItem.sourceType,
              spuId: skuItem.spuId,
              thirdCateId: skuItem.thirdCateId,
              storeId: skuItem.storeId
            }
          })
        params = params.concat(spuParams)
      })

      // 没有参数直接重置数据，return
      if (params.length == 0) {
        this.resetDiscount()
        return
      }

      let data = {
        businessType: BUSINESS_TYPE.mall,
        checkedNumAos: params
      }
      // this.$u.api.cartDiscountSummary(params).then(res => {
      shoppingCarCheckUpCount(data).then(res => {
        let { totalMarketDiscount, totalPerformanceScore, totalOldPrice, totalPrice, totalCouponDiscount, discountInfoList= [] } = res.data
        // 这俩特殊处理是因为后台返回了字符串
        totalMarketDiscount = parseInt(totalMarketDiscount)
        totalCouponDiscount = parseInt(totalCouponDiscount)

        this.totalMarketDiscount = fenToYuan(totalMarketDiscount)
        this.totalPerformanceScore = totalPerformanceScore || 0
        this.totalOldPrice = fenToYuan(totalOldPrice)
        this.totalPrice = fenToYuan(totalPrice)
        this.totalCouponDiscount = fenToYuan(totalCouponDiscount)
        this.discountMoney = fenToYuan(totalMarketDiscount + totalCouponDiscount); // 已优惠 = 商品优惠券 + 活动减免综合

        // 商品选择或则商品数量修改之后会重新计算预估到手价，此时需要重新渲染
        for (let store of this.dealCarts) {
          let { validSpus = [] } = store
          for (let spu of validSpus) {
            let findSpu = discountInfoList.find(item => {
              return item.cartId == spu.cartId
            })
            if (findSpu) {
              spu.afterCouponPrice = findSpu.afterCouponPrice
              spu._afterCouponPrice = fenToYuan(spu.afterCouponPrice)
            }
          }
        }
      })
    },

    getIds() {
      let ids = []
      this.dealCarts.forEach(spuItem => {
        (spuItem.validSpus || []).forEach(skuItem => {
          if (skuItem.checked) {
            ids.push(skuItem.cartId);
          }
        })
      });
      return ids
    },

    async settlement() {
      let ids = this.getIds()
			if (!ids.length) {
				uni.showToast({
					title: '你还没选择商品哦',
					icon: 'none',
					duration: 2500
				});
				return;
			}
			let gotCouponNum = -1;
			
			let reqData = {
				ids: ids
			};

      // 判断活动商品是否超限
			let hasLimit = await this.checkLimitSettlement(reqData);
      let {panicBuyLimitList, specialAreaLimitList} = (hasLimit || {}).data || {}

			if (panicBuyLimitList || specialAreaLimitList) {
				this.showLimit = true;
				this.limitSkuList = panicBuyLimitList || [];
				this.limitFirstList = specialAreaLimitList || [];
				return;
			}
      
			this.$wsf.go('Settlement', { ids: ids, gotCouponNum, cart: 1 });
			
		},
		// 结算校验数据
		checkLimitSettlement(reqData) {
			return this.$u.api.CheckLimitNumBeforeSettlement(reqData).then(res => {
				return res;
			});
		},

    settlementDelete() {
      let ids = this.getIds()
			if (!ids.length) {
				uni.showToast({
					title: '你还没选择商品哦',
					icon: 'none',
					duration: 2500
				});
				return;
			}
			this.confirmText = `确认要删除已选中的${this.sum}件商品？`;
			this.showConfirm = true;
		},

    confirm() {
      this.showConfirm = false;
			let ids = null;
			let { cartsIndex, index } = this.cartsIndexs;
			if (this.cartsIndexs.index !== null) {
				ids = cartsIndex != null ? this.dealCarts[cartsIndex].validSpus[index].cartId.toString() : ''
			} else {
        ids = this.getIds().toString();
			}
			this.$u.api.DeleteCart({ ids }).then(res => {
        this.$emit('reload')
			});
    },
    cancel() {
      this.showConfirm=false
    },
    // 打开优惠详情弹窗
    openDiscountsInfoModel() {
			this.discountsInfoShow = true
		},
    // 限购弹窗取消
    showLimitCancel() {
      this.showLimit = false
    },
    // 限购弹窗确认
    showLimitConfirm() {
      this.showLimit = false
    },

    // 属性选择弹出框
		popupShowFun(dealSku) {
      this.dealSku = dealSku
			let { num, status, skuId, sourceType, storeId } = this.dealSku;
			this.shopNum = num

      // status 2： 下架， 3： 售罄， 4： 失效
      if (status != CARTSTATUS.outofStock && status != CARTSTATUS.soldout && status != CARTSTATUS.loseEffect) {
        this.querySpuDetail(skuId, sourceType, storeId)
      }
		},

    /* sku相关数据 */
		querySpuDetail(skuId, sourceType, storeId) {
      let params = {
        skuId
      }
      // this.$u.api.QuerySpuDetail({ skuId, sourceType, storeId }).then(res => {
			selectinitialSkuList(params).then(res => {
				console.log(res, '商品详情数据');
				if (res.code == 200) {
					this.skuDetail = res.data;
					this.popupShow = true;
				} else {
					// this.navigateTo('404');
				}
			}).catch(error=>{
        if(error.data.code === 220){
          this.$u.toast(`商品信息已失效`)
          this.$emit('reload')
        }
      });
		},
    // sku属性确认
    skuConfirm(params) {
			this.popupShow = false;
			let data = {
				id: this.dealSku.cartId,
				skuId: params.skuId
			};
			// this.$u.api.ShoppingcartSpec(data).then(res => {
      initialSkuUpdate(data).then(res => {
				this.$emit('reload')
			});
		},
    // 预览sku图片
    goodsImgShow(data) {
			console.log(data, 'data+++++');
			this.previewImg = true;
			this.previewshowImg = data;
		},
  },
};
</script>

<style scoped lang="scss">
.business-wraper {
  width: 718rpx;
  background: #FFFFFF;
  border-radius: 24rpx;
  margin: 16rpx auto 0;
}
.business-title {
  display: flex;
  align-items: center;
  margin: 0 16rpx;
  height: 90rpx;
  box-shadow: 0 -1rpx 0rpx 0rpx #eee inset;
  &__flag {
    width: 40rpx;
    height: 40rpx;
  }
  &__word {
    font-size: 32rpx;
    font-weight: 500;
    color: #191919;
    line-height: 40rpx;
    margin-left: 12rpx;
  }
}

.business-list__store {
  position: relative;
  margin-top: 20rpx;
  &::after {
    content: '';
    position: absolute;
    width: 646rpx;
    height: 1rpx;
    background-color: #EEEEEE;
    bottom: 0;
    right: 0;
  }
}

.swipe-action {

  &:last-child {
    /deep/ .u-swipe-content {
      margin-bottom: 0;
    }
  }

  /deep/ .u-swipe-content {
    margin-bottom: 26rpx;
  }

  /deep/ .u-btn-text {
    color: #ffffff;
  }
}
.business-selectall {
  padding: 24rpx 20rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  height: 124rpx;
  &__left {
    display: flex;
    align-items: center;
    font-size: 26rpx;
    font-weight: 400;
    color: #6E6E6E;
    line-height: 34rpx;
  }
  &__allbtn {
    width: 32rpx;
    height: 32rpx;
    background-image: url(https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/ws-smart-life/cart/cart-sku-nomal.png);
    background-size: 100% 100%;
    margin-right: 16rpx;
  }
  &__allbtn.checked {
    background-image: $wsf-checkbox-selected-bg-image;
  }
  &__right {
    display: flex;
    align-items: center;
  }
  &__price {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    .all-price {
      font-size: 26rpx;
      font-weight: 500;
      color: #191919;
      line-height: 34rpx;
    }
    .price {
      font-size: 30rpx;
      font-family: DINAlternate-Bold, DINAlternate;
      font-weight: bold;
    }
    .discount {
      font-size: 22rpx;
      font-weight: 400;
      color: #FF450C;
      line-height: 30rpx;
      display: flex;
      margin-top: 4rpx;
    }
    .up-icon {
      width: 32rpx;
      height: 32rpx;
      display: inline-block;
    }
  }
  &__submit {
    background: $wsf-linear-bg;
    border-radius: 40rpx;
    padding: 20rpx 30rpx;
    font-size: 26rpx;
    font-weight: 500;
    color: #fff;
    // height: 72rpx;
    font-family: PingFangSC-Medium, PingFang SC;
    margin-left: 16rpx;
    position: relative;
    line-height: 32rpx;
  }
  &__edit {
    line-height: normal;
    padding: 14rpx 40rpx;
    font-weight: 400;
    height: 64rpx;
    font-family: PingFangSC-Regular, PingFang SC;
  }
  .submit-cover::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    border-radius: 40rpx;
    background: rgba(255,255,255,0.6);
  }
}

// 优惠详情，样式没做优化
.discounts-info-model {
  padding: 24rpx;
  z-index: 99;
  position: absolute;
  bottom: 104rpx;
  left: 0;
  width: 100%;
  height: auto;
  background: #F6F6F6;
  border-radius: 24rpx 24rpx 0rpx 0rpx;
  box-sizing: border-box;
  .discounts-info-title {
    text-align: center;
    height: 44rpx;
    font-size: 32rpx;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #000D1D;
    line-height: 44rpx;
    margin-bottom: 24rpx;
  }
  .discounts-info-close-btn {
    height: 90rpx;
    width: 104rpx;
    position: absolute;
    right: 0;
    top: 0;
    background: url(@/static/img/icon/close-icon.png) center no-repeat;
    background-size: 54rpx 40rpx;
  }


  .Performance-f{
    background: #FFFFFF;
    border-radius: 24rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20rpx 24rpx;
    font-size: 26rpx;
    color: #191919;
    line-height: 34rpx;
  }
  .goods-list-item{
    padding: 24rpx;
    background: #FFFFFF;
    margin-bottom: 20rpx;
    border-radius: 24rpx;
    .discounts-info-column {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 26rpx;
      color: #191919;
      line-height: 34rpx;
      margin-bottom: 38rpx;
      .discounts-info-text-red {
        color: #e60113;
      }
    }
    .discounts-info-column:last-child{
      margin-bottom: 0;
    }
  }
}

.rect-wraper {
  width: 100%;
  height: 100%;
  position: relative;
  .rect {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
  }
}
</style>

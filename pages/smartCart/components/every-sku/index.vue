<template>
  <!-- loseeffect-sku是失效商品 -->
  <view class="sku" :class="{'loseeffect-sku': loseEffect}">
    <view class="sku-checkbtn__wraper">
      <view class="sku-checkbtn" :class="{ checked: dealSku.checked }" @click="checked()"></view>
    </view>
    <view class="sku-info__wraper">
      <view class="sku-info__wraper-top" :class="{ 'sku-line': loseEffect && !isLast }">
        <view class="sku-img__wraper" @click="detailsPage()">
          <image mode="aspectFill" class="sku-img" :src="dealSku.image" />
          <view class="sku-cover" v-if="loseEffect">
            <view class="sku-cover__word">{{ loseeffectReason }}</view>
          </view>
        </view>
        <view class="sku-info">
          <view class="sku-top">
            <view class="sku-title u-line-1" @click="detailsPage()">{{ dealSku.name }}</view>
            <!-- 商品规格 -->
            <view class="sku-prop" @click="propsSelect">
              <view class="sku-prop__text u-line-1">{{ dealSku.spec }}</view>
              <image class="sku-prop__more" :src="cartDownImg"></image>
            </view>
          </view>
          <view class="sku-bottom">
            <!-- 绩效分 -->
            <view class="sku-performance" v-if="!loseEffect && dealSku.performanceScore && dealSku.performanceScore > 0">
              <image class="icon" :src="performanceImg"/>
              绩效分: {{ dealSku.performanceScore }}
            </view>
            <!-- 价格 -->
            <view class="sku-price">
              <view class="sku-price__left">
                <view class="sku-price__origin">
                  <text class="yuan-flag">￥</text>
                  <text class="int">{{ dealSku._oldPrice | getPriceInt }}</text>
                  <text class="decimal">{{ dealSku._oldPrice | getPricePrecision }}</text>
                </view>
              </view>
              <view class="sku-price__right">
                <view class="minus" @click="minusFun()">
                  <image class="minus-icon" :src="minusIcon" />
                  <!-- <u-icon name="minus" :color="minusColor"></u-icon> -->
                </view>
                <view class="num" :style="[numWid(dealSku.num)]">
                  <input
                    v-model.number="dealSku.num"
                    type="number"
                    :disabled="numDisabled"
                    @input="minusInput($event)"
                    @blur="minusBlur($event)"
                    :style="[numStyle]"
                  />
                </view>
                <view class="plus" @click="plusFun()">
                  <image class="plus-icon" :src="plusIcon" />
                  <!-- <u-icon name="plus" :color="plusColor" ></u-icon> -->
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
      <!-- 添加福气值逻辑 -->
      <view class="estimated-price" v-if="dealSku.integralPoint > 0">
        <text>
          <text class="special">
            {{ dealSku.integralPoint }}
          </text>
          福气值+
          <text>
            {{ dealSku.deductionAfterPrice | fenToYuan }}
          </text>
          元
        </text>
      </view>
      <!-- 有效，选中才展示预估到手价 -->
      <view  class="estimated-price"
        v-else-if="!loseEffect 
          && dealSku.checked
          && dealSku.afterCouponPrice 
          && dealSku.afterCouponPrice != dealSku.oldPrice">
        预估到手价<text class="price">￥{{dealSku._afterCouponPrice}}</text>
      </view>
      <view class="estimated-price" v-else-if="!loseEffect"></view>
    </view>
  </view> 
  
</template>

<script>
// 获取公共方法，常量
import { CARTSTATUS } from '../../common/constants/cart'
import { sleep } from "@/common/utils.js";

// 获取接口
import { shoppingCarUpdateCount } from '@/common/smart-api/cartApi'
import { fenToYuan } from '@/common/utils'
// 购物车商品组件
export default {
  name: 'everySku',
  components: {
  },
  options: {
    styleIsolation: 'shared'
  },
  props: {
    sku: {
      type: Object,
      default: {},
    },
    // 是否失效商品
    loseEffect: {
      type: Boolean,
      default: false
    },
    // 是否是最后一个
    isLast: {
      type: Boolean,
      default: false
    },
  },
  watch: {
    sku() {
      this.dealSku = this.$u.deepClone(this.sku)
    }
  },
  data() {
    return {
      // 页面中使用到的图片
      cartDownImg: `${this.$smartImg}/cart/cart-down.png`,
      performanceImg: `${this.$smartImg}/cart/performance.png`,

      // 处理之后的sku
      dealSku: {},
      isNext: true // 用于数量为空时判断数量是否加1，由于从空变为1失焦会加1，所以点加号的时候要处理不加1    
    };
  },
  computed: {
    // 失效商品状态
    // 注意这里status 1: 库存不足，2： 下架， 3： 售罄， 4： 失效
    loseeffectReason() {
      let reason = '...'
      if (this.dealSku.status == CARTSTATUS.noEnoughStock) {
        reason = '库存不足'
      } else if (this.dealSku.status == CARTSTATUS.outofStock) {
        reason = '已下架'
      } else if (this.dealSku.status == CARTSTATUS.soldout) {
        reason = '售罄'
      } else if (this.dealSku.status == CARTSTATUS.loseEffect) {
        reason = '失效'
      } else if (this.dealSku.stock == 0) {
        reason = '无货'
      }
      return reason
    },
    // 置灰状态判断，库存为0，或者几个失效状态
    grayJudge() {
      return this.dealSku.stock == 0 
        || this.dealSku.status == CARTSTATUS.noEnoughStock 
        || this.dealSku.status == CARTSTATUS.outofStock 
        || this.dealSku.status == CARTSTATUS.soldout 
        || this.dealSku.status == CARTSTATUS.loseEffect 
    },
    // 减少按钮图片
    minusIcon() {
      return this.grayJudge || this.dealSku.num == 1 ? `${this.$smartImg}/cart/minus-def.png` : `${this.$smartImg}/cart/minus.png`
    },
    // 增加按钮图片
    plusIcon() {
      return this.grayJudge || this.dealSku.stock == this.dealSku.num ? `${this.$smartImg}/cart/plus-def.png` : `${this.$smartImg}/cart/plus.png`
    },
    // 中间数字输入框宽度
    numWid() {
      return function (value) {
        let width
        if (!value || (String(value).length <= 3)) {
          width = '36px'
        } else {
          // 有内容，字符串长度*字体大小
          width = (String(value).length * 12) + 'px'
        }
        return {
          width
        }
      }
    },
    // 中间数字输入框样式
    numStyle() {
      return {
        color: this.grayJudge ? '#bababa' : ''
      }
    },
    // 中间数字是否禁用
    numDisabled() {
      return this.grayJudge ? true : false
    }
  },
  created () {
    this.dealSku = this.$u.deepClone(this.sku)
  },
  methods: {
    // 选中商品
    checked() {
      if (!this.grayJudge) {
        this.dealSku.checked = !this.dealSku.checked
        // 调整状态需要告知父组件
        this.$emit('dataChange', this.dealSku)
      }
    },
    // 实际操作修改商品数量
    doChangeCartNum() {
      this.$u.debounce(async() => {
        let verify = await this.verifySkuNum()
				if (!verify) {
					console.log('修改商品数量校验失败');
				}
				this.changeCartNum();
      }, 300);
    },
    // 减少商品数量
    async minusFun() {
      // 如果商品失效
			if (this.grayJudge) {
				return false;
			}
      this.isNext= true
			let num = this.dealSku.num;
			if (num > 1) {
				this.dealSku.num--;
				this.doChangeCartNum()
			}
    },
    // 增加商品数量
    async plusFun() {
      // 如果商品失效
			if (this.grayJudge) {
				return false;
			}
      let { num, stock } = this.dealSku;
      // 库存是否足够
      console.log(this.isNext,'wwwss');
      if (num < stock && this.isNext) {
        this.dealSku.num++;
        this.doChangeCartNum()
      } else {
        this.isNext= true
      }
    },
    // 数字输入框输入
    async minusInput(e) {
      let val = parseInt(e.detail.value);
      this.minusInputFun(val)
    },
    // 数字输入框失焦
    minusBlur(e) {
      let val = parseInt(e.detail.value);     
      console.log(val,'wdddddddddddd');
      this.$nextTick(async () => {
        if(!val){          
          this.dealSku.num = 1
          this.isNext = false
        } 
      })
      this.minusInputFun(val)
    },

    minusInputFun(val) {
      this.dealSku.num = ''
      // uniapp兼容问题，输入和赋值不能同步
      this.$nextTick(async () => {
        if (!!val) {
          this.isNext= true
          if (val <= this.dealSku.stock) {
            this.dealSku.num = val
          } else {
            this.$u.toast(`购买数量不能超过库存数量`);
            this.dealSku.num = this.dealSku.stock
          }
        } else {
          // this.dealSku.num = 1
        }
        this.doChangeCartNum()
      })
    },

    // 检查商品数量
    async verifySkuNum(needWait = true) {
      let flag = true
      // 库存不足
			if (this.dealSku.stock < this.dealSku.num) {
				this.$u.toast(`商品加购件数(含已加购件数)已超过库存!`);
				this.dealSku.num = this.dealSku.stock;
        flag = false
			}
      // 校验是否超过平台秒杀限制数
      let obj = {
        isIgnoreCartNum: true,
        buyNowRequestList: [
          {
            num: this.dealSku.num,
            skuId: this.dealSku.skuId,
            sourceType: this.dealSku.sourceType,
            storeId: this.dealSku.storeId,
          }
        ]
      };
      let res = await this.$u.api.CheckSkuPanicBuyLimitNum(obj) || {}
      console.log(res, '校验是否超过平台秒杀限制数');
      if (res.data && res.data.limitNum) {
        if (res.data.hasBoughtNum) {
          this.dealSku.num = res.data.limitNum - res.data.hasBoughtNum;
          this.$u.toast(`限购${res.data.limitNum}件,你已购买过${res.data.hasBoughtNum}件了`);
        } else {
          this.dealSku.num = res.data.limitNum;
          this.$u.toast(`抱歉，该商品限购${res.data.limitNum}件`);
        }
        flag = false
      }

      // 当错误的时候，此时需要显示toast，如果立马返回，会导致页面刷新，toast闪现
      if(!flag && needWait) {
        await sleep(1500)
      }
      return flag
    },
		changeCartNum() {

      // 修改购物车商品数量
			let param = {
				cartId: this.dealSku.cartId,
				num: this.dealSku.num,
        ignoreCartNum: true
			};
			// console.log('改变购车数量提交数据data------------',param)
			shoppingCarUpdateCount(param).then(res => {
				if (this.dealSku.num > this.dealSku.stock) {
					this.dealSku.num = this.dealSku.stock;
				}
        
        this.$emit('dataChange', this.dealSku)
			});
		},

    // 跳转到详情页
		detailsPage() {
			let { skuId, status, sourceType, storeId } = this.dealSku;
			console.log(this.dealSku, '跳转到详情页');
			if (status == CARTSTATUS.loseEffect) return false;
			this.$wsf.go('SkuDetail', { skuId, sourceType, storeIdNumber: storeId });
		},

    // 属性选择
    propsSelect() {
      this.$emit('propsSelect', this.dealSku)
    }
  },
  filters: {
   fenToYuan(price) {
      return fenToYuan(price)
    }
  },
};
</script>

<style scoped lang="scss">
.sku {
  display: flex;
  justify-content: center;
  padding: 0rpx 20rpx 0rpx 20rpx;
  overflow: hidden;
}
.sku-checkbtn__wraper {
  height: 204rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
.sku-checkbtn {
  width: 32rpx;
  height: 32rpx;
  background-image: url(https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/ws-smart-life/cart/cart-sku-nomal.png);
  background-size: 100% 100%;
}
.sku-checkbtn.checked {
  background-image: $wsf-checkbox-selected-bg-image;
}

.sku-info__wraper-top {
  display: flex;
  margin-left: 16rpx;
}
.sku-img__wraper {
  width: 204rpx;
  height: 204rpx;
}
.sku-img {
  width: 204rpx;
  height: 204rpx;
  border-radius: 24rpx;
  overflow: hidden;
}
.sku-info {
  width: 410rpx;
  height: 204rpx;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-left: 16rpx;
}
.sku-top {

}
.sku-title {
  font-size: 26rpx;
  font-weight: 500;
  color: #191919;
  line-height: 34rpx;
}
.sku-prop {
  padding: 4rpx 16rpx;
  background: #F6F6F6;
  border-radius: 24rpx;
  display: inline-flex;
  margin-top: 8rpx;
  &__text {
    font-size: 22rpx;
    font-weight: 400;
    color: #999999;
    line-height: 32rpx;
    display: inline-block;
    max-width: 346rpx;
  }
  &__more {
    width: 32rpx;
    height: 32rpx;
  }
}
.sku-bottom {
}
.sku-performance {
  display: inline-flex;
  height: 28rpx;
  background: linear-gradient(90deg, #ECFFFC 0%, #F4FAFF 100%);
  border-radius: 8rpx;
  font-size: 20rpx;
  font-weight: 400;
  color: #008864;
  line-height: 28rpx;
  padding: 0 8rpx;
  .icon {
    height: 28rpx;
    width: 28rpx;
  }
}
.sku-price {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}
.sku-price__left {

}
.sku-price__origin {
  font-weight: bold;
  color: #191919;
  line-height: 40rpx;
  .yuan-flag {
    font-size: 24rpx;
  }
  .int {
    font-size: 32rpx;
    font-family: DINAlternate-Bold, DINAlternate;
  }
  .decimal {
    font-size: 26rpx;
    font-family: DINAlternate-Bold, DINAlternate;
  }
}
.sku-price__right {
  display: flex;
  align-items: center;
  .minus {
    display: flex;
    align-items: center;
  }
  .minus-icon, .plus-icon {
    width: 20rpx;
    height: 20rpx;
  }
  /deep/ .u-iconfont {
    font-size: 9px!important;
  }
  .num {
    width: 58rpx;
    height: 44rpx;
    line-height: 44rpx;
    text-align: center;
    font-size: 26rpx;
    font-weight: 500;
    color: #191919;
    background: #F6F6F6;
    border-radius: 8rpx;
    margin: 0 8rpx;
    padding: 0 8rpx;
    font-family: DINAlternate-Bold, DINAlternate;
    input {
      min-height: 44rpx;
      height: 44rpx;
      font-family: DINAlternate-Bold, DINAlternate;
    }
  }
  .plus {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
}
.estimated-price {
  margin-left: 236rpx;
  font-size: 22rpx;
  font-weight: 600;
  color: #fe3040;
  line-height: 30rpx;
  height: 54rpx;
  .price {
    font-size: 26rpx;
    font-family: DINAlternate-Bold, DINAlternate;
    font-weight: bold;
  }
}

// 失效商品样式
.loseeffect-sku {
  padding-top: 16rpx;
  .sku-info__wraper-top{
    padding-bottom: 16rpx ;
  }
  .sku-line{
    border-bottom: 1rpx #EEEEEE solid;
  }
  .sku-checkbtn {
    background-image: url(https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/ws-smart-life/cart/cart-sku-loseeffect.png);
    border-radius: 50%;
  }
  .sku-title {
    color: #999;
  }
  .sku-price__origin {
    color: #999;
  }
  /deep/ .u-iconfont {
    color: #c3c3c3;
  }
  .num {
    color: #c3c3c3;
  }
  .sku-img__wraper {
    position: relative;
  }
  .sku-cover {
    position: absolute;
    top: 0;
    left: 0;
    width: 204rpx;
    height: 204rpx;
    background: rgba(25,25,25,0.2);
    border-radius: 16rpx;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .sku-cover__word {
    width: 120rpx;
    height: 44rpx;
    background: rgba(25, 25, 25, 0.7);
    border-radius: 22rpx;
    font-size: 26rpx;
    font-weight: 400;
    color: #FFFFFF;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>

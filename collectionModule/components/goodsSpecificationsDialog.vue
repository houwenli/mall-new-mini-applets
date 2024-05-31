<template>
  <u-popup
    v-model="show"
    mode="bottom"
    :safe-area-inset-bottom="true"
    border-radius="24"
    class="popup-box"
  >
    <view class="select-model-close" @click="close"></view>
    <view class="popup-content">
      <view class="sku-info">
        <view class="img">
          <image :src="sku.url"> </image>
        </view>
        <view class="info">
          <view class="price">
            <view class="txt_item">
              <text class="txt_1">￥</text>
              <view class="txt_2"
                ><span>{{
                  floatPrice(sku.entPurchasePrice).split(".")[0]
                }}</span
                ><span class="float"
                  >.{{ floatPrice(sku.entPurchasePrice).split(".")[1] }}</span
                ></view
              >
            </view>
            <view
              class="performance-mark"
              v-if="sku.performanceScore && spu.performanceScore > 0"
              >绩效分<text class="num">{{ sku.performanceScore }}</text></view
            >

            <view class="select-prop">{{ chosenSpecAndNum }}</view>
          </view>
        </view>
      </view>
      <view class="sku">
        <scroll-view scroll-y="true" class="scroll-Y">
          <view
            class="sku-item"
            v-for="(treeItem, index) in skuData.tree"
            :key="index"
          >
            <view class="sku-name">{{ treeItem.k }}</view>
            <view class="sku-val">
              <!-- initialSkuArr.map((item) => item.id).includes(v.id) -->
              <view
                v-for="(v, index_v) in treeItem.v"
                :class="[
                  'sku-val-item',
                  initialSku[treeItem.k_s] === v.id ? 'pitch-on' : '',
                  v.disabled ? 'disable' : '',
                ]"
                @click="pitchOnFun(v, treeItem)"
                :key="index_v"
              >
                {{ v.name }}
              </view>
            </view>
          </view>
          <view
            class="u-flex u-row-between u-padding-top-14 u-padding-bottom-20"
            style="margin-right: 15rpx"
          >
            <b style="font-weight: bold">数量</b>
            <view class="wsf-number-box">
              <view class="minus" @click="minusFun()">
                <u-icon
                  name="minus"
                  :color="num <= sku.entPurchaseNum ? '#d8d8d8' : '#000'"
                ></u-icon>
              </view>
              <view class="num">
                <input
                  type="number"
                  v-model="num"
                  @input="minusInput($event)"
                  @blur="minusBlur($event)"
                />
              </view>
              <view class="plus" @click="plusFun()">
                <u-icon
                  class="add_icon"
                  name="plus"
                  :color="
                    num < sku.stock && num !== sku.stock
                      ? '#000'
                      : num == sku.stock
                      ? '#d8d8d8'
                      : '#bababa'
                  "
                ></u-icon>
              </view>
            </view>
          </view>
        </scroll-view>
      </view>
    </view>
    <view class="button-box">
      <view class="buy-button" @click="handleBugNow()">立即购买</view>
    </view>
  </u-popup>
</template>

<script>
export default {
  name: "",
  data() {
    return {
      show: false,
      properties: null,
      num: 1,
      initialSku: {}, // 条件属性
      initialSkuArr: [], // 条件属性数组
      skuData: {},
      disableSkuList: [], //售罄、下架的sku
    };
  },
  props: {
    spu: {
      type: Object,
      default: () => {},
    },
    sku: {
      type: Object,
      default: () => {},
    },
    dialogType: {
      type: Number,
      default: 0,
    },
    skuNum: {
      type: [Number, String],
      default: 1,
    },
  },
  computed: {
    chosenSpecAndNum() {
      let str = "";
      if (this.sku.skuSpecStr) {
        str = `已选 ${this.sku.skuSpecStr.join(" ")} ${this.num}个`;
      }
      return str;
    },
  },
  watch: {
    skuNum(newVal) {
      this.num = newVal;
    },
  },
  methods: {
    //商品规格相关初始化
    initData() {
      // tree：规格列表初始化
      let tree = this.spu.skuSpecToolList.map((item, index) => {
        return {
          k: item.specName,
          k_s: item.specIdStr,
          v: item.subToolList.map((subItem) => {
            return {
              id: subItem.specValueId,
              name: subItem.specValueName,
              imgUrl: subItem.url,
              previewImgUrl: subItem.url,
              disabled: false,
            };
          }),
        };
      });

      // 所有规格的属性以及属性值放到一个对象中
      tree.forEach((item) => {
        this.$set(this.initialSku, item.k_s, this.sku[item.k_s]);
      });

      // skuList：是所有sku的信息 list是所有sku规格的信息
      this.skuData = {
        tree: tree,
        list: this.spu.skuList,
      };

      //计算不可选择的sku规格的集合
      this.getDisableSkuList();
      //传入当前已选规格属性 计算其不可选的属性将其置灰
      this.findDifferentProperties(this.initialSku);
    },
    // 切换sku
    pitchOnFun(v, treeItem) {
      if (v.disabled) return;
      // 点击已经选中的属性则反选置空
      this.initialSku[treeItem.k_s] = this.initialSku[treeItem.k_s] === v.id ? null : v.id;

      // 循环遍历initialSku对象每个属性都有值 则表示所有规格都选择了
      let flag = Object.keys(this.initialSku).every(item => this.initialSku[item]);
      if (flag) {
        // 如果每个规格都选择了属性 则根据选中的规格属性查询sku
        let sku = this.skuData.list.find((item) =>
          Object.keys(this.initialSku).every(
            (otem) => this.initialSku[otem] == item[otem]
          )
        );
        this.$emit("updateSku", sku.skuId);
      }
      //传入当前已选规格属性 计算其不可选的属性将其置灰
      this.findDifferentProperties(this.initialSku);
    },
    // 过滤出不可选择的sku所对应的规格属性
    getDisableSkuList() {
      let k_s = this.skuData.tree.map((item) => item.k_s);
      this.disableSkuList = this.skuData.list.filter((item) => item.skuState != 0)
        .map((item) => {
          let obj = {};
          k_s.forEach((otem) => {
            obj[otem] = item[otem];
          });
          return obj;
        });
    },
    // 禁用不可选择的sku属性
    findDifferentProperties(initialSku) {
      // 将所有属性值设置为可选
      this.skuData.tree.forEach((item) => {
        item.v.forEach((otem) => (otem.disabled = false));
      });

      const targetKeys = Object.keys(initialSku);
      const result = {};
      this.disableSkuList.forEach(item=>{
            let matchCount = 0;
            let differentKeys = [];
            targetKeys.forEach(otem=>{
                if(item[otem] === initialSku[otem]){
                    matchCount++
                }else{
                    differentKeys.push(otem);
                }
            })
            if (matchCount === targetKeys.length - 1 && differentKeys.length === 1) {
                if (!result[differentKeys[0]]) {
                    result[differentKeys[0]] = [];
                }
                result[differentKeys[0]].push(
                    item[differentKeys[0]]
                );
            }
      })

      Object.keys(result).forEach((item) => {
        this.skuData.tree.forEach((otem) => {
          if (otem.k_s === item) {
            otem.v.forEach((stem) => {
              if (result[item].includes(stem.id)) {
                stem.disabled = true;
              }
            });
          }
        });
      });
    },
    handleBugNow() {
      let buyNowRequestList = JSON.stringify([
        {
          skuId: this.sku.skuId,
          num: this.skuNum,
          sourceType: 5,
          storeId: this.spu.storeId,
        },
      ]);
      this.close();
      this.$wsf.go("Settlement", {
        buyNowRequestList,
      });
    },
    floatPrice(price) {
      if (!price || Number(price) === 0) {
        return "0.00";
      } else {
        return Number(price).toFixed(2);
      }
    },
    // 数量减
    minusFun() {
      if (this.num <= this.sku.entPurchaseNum) {
        return;
      }
      this.$emit("changeskuNum", Number(this.num) - 1);
    },
    // 数量加
    plusFun() {
      if (this.num >= this.sku.stock) {
        return;
      }
      this.$emit("changeskuNum", Number(this.num) + 1);
    },
    // 步进器输入框输入时执行
    minusInput(e) {
        this.num = e.detail.value.replace(/^(0+)|[^\d]+/g,'')
    },
    // 步进器失焦时执行
    minusBlur(e) {
        let num = Number(e.detail.value)
        if(!num || num < Number(this.sku.entPurchaseNum)){
            // 为空 或者 小于集采数量--默认给最低集采数量
            num =  this.sku.entPurchaseNum
            return
        }
        if (num > Number(this.sku.stock)) {
            // 大于库存 默认给库存数量
            this.$u.toast(`购买数量不能超过库存数量`);
            num = this.sku.stock
            return
        } 
        this.num =  num
        this.$emit("changeskuNum", this.num);
      
    },
    skuSelected(skuValue) {
      this.$emit("skuSelected", skuValue.selectedSkuComb);
    },
    close() {
      this.show = false;
    },
    open() {
      this.show = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.popup-box {
  position: relative;
  .select-model-close {
    width: 54rpx;
    height: 40rpx;
    background-size: 100% 100%;
    background-image: url(https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/address/address-close-2x.png);
    position: absolute;
    right: 24rpx;
    top: 24rpx;
  }
  .popup-content {
    background-color: #fff;
    .sku-info {
      box-sizing: border-box;
      width: 100%;
      display: flex;
      padding: 32rpx 24rpx 0rpx 24rpx;
      .img {
        width: 200rpx;
        height: 200rpx;
        margin-right: 20rpx;
        image {
          width: 200rpx;
          height: 200rpx;
          border-radius: 16rpx;
        }
      }
      .info {
        width: 100%;
        display: flex;
        // align-items: flex-end;
        align-items: flex-start;
        .price {
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
            color: #ff0a35;
          }
          .txt_item {
            .txt_1,
            .txt_2 {
              color: #ff0a35;
              font-family: DINAlternate-Bold, DINAlternate;
            }
            .txt_1 {
              font-size: 32rpx;
              font-weight: 500;
            }
            .txt_2 {
              font-size: 60rpx;
              font-weight: 600;
              display: inline-block;
              .float {
                font-size: 32rpx;
              }
            }
            .reduced-price {
              margin-left: 16rpx;
              font-weight: normal;
              vertical-align: text-bottom;
              height: 40rpx;
              background: linear-gradient(90deg, #ec5f2a 0%, #ff0a35 100%);
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
            margin: 0 10rpx 30rpx 0;
            padding: 0 6rpx;
            display: inline-flex;
            align-items: center;
            height: 32rpx;
            border-radius: 8rpx;
            background-color: #ecfffc;
            color: #008864;
            font-size: 22rpx;
            .num {
              font-size: 20rpx;
            }
          }
          .reduced-price {
            margin-left: 16rpx;
            height: 48rpx;
            background: #ff0a35;
            border-radius: 28rpx;
            padding: 0 16rpx;
            margin: 4rpx 0 10rpx;
            display: inline-flex;
            color: #fff;
            font-size: 28rpx;
            justify-content: center;
            align-items: center;
            font-weight: 500;
            line-height: 36rpx;
          }
          .no {
            text {
              margin-top: 6rpx;
              font-size: 26rpx;
              font-weight: 400;
              color: #999999;
            }
          }
        }
        .select-prop {
          font-size: 26rpx;
          color: #999;
        }
      }
    }
    .sku {
      width: 100%;
      overflow-x: hidden;
    }

    .scroll-Y {
      box-sizing: border-box;
      padding: 30rpx 48rpx 0 48rpx;
      height: 474rpx;
    }
    ::-webkit-scrollbar {
      width: 0;
      height: 0;
      color: transparent;
    }
    .sku-name {
      padding-top: 14rpx;
      padding-bottom: 16rpx;
      font-weight: bold;
    }
    .sku-val {
      display: flex;
      flex-wrap: wrap;
    }
    .pitch-on {
      border: 2rpx solid $wsf-color-new-red !important;
      background-color: rgba(255, 231, 235, 0.5) !important;
      text {
        color: $wsf-color-red !important;
      }
    }
    .disable {
      background-color: #f2f2f2;
      border: 2rpx solid #f2f2f2;
      color: #bababa;
    }
    .sku-val-item {
      min-width: 80rpx;
      box-sizing: border-box;
      text-align: center;
      padding: 0 20rpx;
      margin-right: 20rpx;
      height: 56rpx;
      line-height: 56rpx;
      background: #f2f2f2;
      border-radius: 28rpx;
      margin-bottom: 24rpx;
      border: 1px solid #f2f2f2;
    }
    text {
      font-weight: 400;
      font-size: 26rpx;
      line-height: 26rpx;
      color: #191919;
    }
    .fixed-column {
      border-top: 1px solid #f5f5f5;
      width: 100%;
      position: absolute;
      bottom: 0;
      left: 0;
      box-sizing: content-box;
      padding-bottom: env(safe-area-inset-bottom);
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
        width: 92%;
        margin: 8rpx auto;

        .common-btn {
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

        .add-cart {
          background-color: #ffbe0c;
          color: #fff;
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
        color: #ff0a35;
      }

      .num {
        width: 80rpx;
        height: 44rpx;
        line-height: 44rpx;
        text-align: center;
        font-size: 24rpx;
        font-weight: 500;
        color: #333333;
        background: #f5f5f5;
        border-radius: 8rpx;
        input {
          height: 100%;
          min-height: 100%;
        }
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
  }
  .button-box {
    padding: 8rpx 24rpx;
    .buy-button {
      width: 100%;
      height: 80rpx;
      padding: 20rpx;
      background: linear-gradient(90deg, #ff5f2e 0%, #ff0a35 100%);
      border-radius: 40rpx;
      font-size: 32rpx;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #fff9e9;
      line-height: 40rpx;
      text-align: center;
    }
  }
}
</style>

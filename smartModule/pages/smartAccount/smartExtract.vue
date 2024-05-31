<template>
  <view class="wrap">
    <!-- 头部 -->
    <smartNavBar title="提现" />
    <view class="content">
      <view class="type">
        <u-field
          class="type__field"
          v-model="data.bankName"
          label="到账银行"
          placeholder="请绑定相关银行卡"
          placeholder-style="color:#C3C3C3"
          label-align="right"
          input-align="right"
          @click="openExtractPopup"
          :border-bottom="false"
          :disabled="true"
          :clearable="false"
        >
          <template slot="right">
            <view class="type__icon">
              <image :src="`${smartImg}/me/extract-next.png`"></image>
            </view>
          </template>
        </u-field>
      </view>
      <view class="money">
        <text class="money__text">提现金额</text>
        <u-field
          class="money__field"
          :class="{ 'money__field--red': !isAmount || !isAmountEquMoney }"
          type="number"
          v-model="data.amount"
          label="￥"
          label-width="20"
          :placeholder="`可提现${(money * 1).toFixed(2)}元`"
          placeholder-style="color:#C3C3C3;font-size: 32rpx;font-weight: 400;"
          :clearable="false"
          @input="inputAmount($event)"
        >
          <template #right>
            <text @click="onALL">全部</text>
          </template>
        </u-field>
        <view class="money__tip">
          <text v-show="isAmountExceed">{{ `最大提现金额${money.toFixed(2)}元` }}</text>
        </view>
      </view>
    </view>
    <!-- 底部按钮 -->
    <view class="footer">
      <view
        :class="['footer-btn', !isAmount ? 'footer-btn--notsel' : '']"
        @click="isAmount ? getCodeData() : ''"
      >
        提现
      </view>
    </view>
    <!-- 银行卡弹窗 -->
    <extractPopup
      ref="extractPopup"
      :data="cardList"
      :show="showPopup"
      @closeExtractPopup="closeExtractPopup"
      @getCardName="getCardName"
    />
    <!-- 验证码弹窗 -->
    <codeConfirm
      :show="showConfirm"
      :data="codeData"
      @clone="closeCodeConfirm"
      @getCode="getCode"
    />
  </view>
</template>

<script>
// 公共组件
import smartNavBar from "@/components/smart/smart-nav-bar/smart-nav-bar.vue";
// 公共方法
import {
  checkNum,
  interceptNum,
  fenToYuan,
  yuanToFen,
} from "@/common/utils.js";
// 公共数据
import { BIZLINE, SMSCODETYPE } from "@/common/constants/userinfo";
// 内部组件
import extractPopup from "./comm/extractPopup.vue";
import codeConfirm from "./comm/codeConfirm.vue";
// 接口
import {
  BankCardList,
  FundWithdrawConfirm,
  FundWithdraw,
  Send,
} from "@/common/smart-api/userCenterApi";
export default {
  components: {
    extractPopup,
    codeConfirm,
    smartNavBar,
  },
  computed: {
    // 是否有金额
    isAmount() {
      return this.data.amount ? true : false;
    },
    // 输入金额是否等于全部金额
    isAmountEquMoney() {
      return this.data.amount * 1 == this.money * 1;
    },
    //金额是否超出
    isAmountExceed() {
      return this.data.amount * 1 > this.money * 1;
    },
  },
  data() {
    return {
      smartImg: this.$smartImg,
      showPopup: false,
      showConfirm: false, //提现验证码框
      data: {
        bankName: "", // 银行卡名称
        amount: "", // 提现金额
        bankCardId: "", //银行卡ID
        smsCode: "", //提现验证码
      },
      codeData: {}, //验证码弹窗数据
      cardList: [], //银行卡信息
      money: 0,
      minAmount: 0 // 最小提现金额
    };
  },
  onShow() {
    this.getCardList();
  },
  onLoad(options) {
    this.money = options.money / 100 || 0;
    this.minAmount = Number((options.minAmount / 100 || 0).toFixed(2));
  },
  methods: {
    // 点击全部
    onALL() {
      if (!this.isAmount || !this.isAmountEquMoney) {
        this.data.amount = this.money;
      }
    },
    // 跳转页面
    toIndex(name, val, method) {
      this.$smart.go(name, val, method);
    },

    /*--------------------银行卡------------------*/

    // 获取银行卡列表
    async getCardList() {
      try {
        let res = await BankCardList();
        let dealData = this.dealData(res.data);
        this.cardList = dealData;
        if (this.cardList.length != 0) {
          let val = res.data[0];
          this.setCardName(val);
          this.$refs.extractPopup.selected(val);
        }
      } catch (error) {
        console.log(error);
      }
    },
    // 处理银行卡列表
    dealData(data) {
      if (!data || data.length == 0) return [];
      let realData = this.$u.deepClone(data);
      realData.forEach((item) => {
        item._bankCard = interceptNum(item.bankCard); //待结算余额
      });
      return realData;
    },
    // 获取选中银行信息
    getCardName(val) {
      this.setCardName(val);
      this.closeExtractPopup();
    },
    // 设置银行卡信息
    setCardName(val) {
      this.data.bankName = `${val.bankName}(${val.bankCard.slice(-4)})`;
      this.data.bankCardId = val.bankId;
    },
    // 打开银行卡弹窗
    openExtractPopup() {
      this.showPopup = true;
    },
    // 关闭银行卡弹窗
    closeExtractPopup() {
      this.showPopup = false;
    },

    /*---------------------提现------------------*/
    // 提现金额输入校验
    inputAmount(e) {
      this.$nextTick(() => {
        let value = checkNum(e, 2);
        this.data.amount = value;
      });
    },
    // 获取提现弹窗数据
    async getCodeData() {
      try {
        // 校验
        if (!this.data.amount || !this.data.bankCardId) {
          this.$u.toast("请将提现信息填写完整");
          return;
        }
        if (this.data.amount * 1 < this.minAmount) {
          this.$u.toast(`最小提现金额为${this.minAmount}元`);
          return;
        }
        if (this.isAmountExceed) {
          this.$u.toast(`最大提现金额${this.money.toFixed(2)}元`);
          return;
        }
        let param = {
          amount: yuanToFen(this.data.amount || 0),
          bizLine: BIZLINE.wsfMall,
        };

        let res = await FundWithdrawConfirm(param);
        if (res.code === 200) {
          this.codeData = res.data || {};
          if (this.codeData) {
            this.codeData._reservePhone = interceptNum(
              this.codeData.reservePhone
            ); // 手机尾号处理
            this.codeData._receiveMoney = fenToYuan(this.codeData.receiveMoney); //金额处理
          }
          //获取验证码
          this.getSmsCode();
        } else {
          this.$u.toast(res.msg)
        }

        
      } catch (error) {
        if (error.data.msg) {
          this.$u.toast(error.data.msg);
        }
      }
    },
    // 获取验证码
    async getSmsCode() {
      try {
        // 校验
        if (!this.codeData.reservePhone) {
          return;
        }

        let param = {
          phone: this.codeData.reservePhone,
          smsCodeType: SMSCODETYPE.withdraw,
        };

        await Send(param);

        //打开弹窗
        this.openCodeConfirm();
      } catch (error) {
        if (error.data.msg) {
          this.$u.toast(error.data.msg);
        }
      }
    },
    // 打开验证码弹窗
    openCodeConfirm() {
      this.showConfirm = true;
    },
    // 获取弹窗用户输入验证码
    getCode(val) {
      this.data.smsCode = val;
      this.onWithdrawal();
    },
    // 提现
    async onWithdrawal() {
      try {
        let param = {
          ...this.data,
          amount: yuanToFen(this.data.amount || 0),
          bizLine: BIZLINE.wsfMall,
        };
        let res = await FundWithdraw(param);
        let query = {
          assetSerialId: res.data.assetSerialId || "",
        };
        this.showConfirm = false;
        this.toIndex("smartExtractRecordsDetails", query, 'redirectTo');
        console.log(res);
      } catch (error) {
        if (error.data.msg) {
          this.$u.toast(error.data.msg);
        }
      }
    },
    // 关闭验证码弹窗
    closeCodeConfirm() {
      this.showConfirm = false;
      this.toIndex("smartAccount");
    },
  },
};
</script>

<style scoped lang="scss">
.content {
  padding: 0 16rpx;
}

.type {
  margin-top: 24rpx;
  height: 104rpx;
  background: #ffffff;
  border-radius: 24rpx;
  &__field {
    /deep/ .u-field {
      padding: 32rpx 24rpx !important;
      .u-field-inner {
        height: 40rpx;
      }
    }
    /deep/ .u-label-text {
      font-size: 32rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #191919;
      line-height: 44rpx;
    }
    /deep/ .u-flex {
      margin: 0 !important;
    }
    /deep/ .u-right {
      color: #191919;
    }
    /deep/ .u-button-wrap {
      margin-left: 6rpx !important;
    }
  }
  &__icon {
    height: 40rpx;
    display: flex;
    align-items: center;
    image {
      height: 32rpx;
      width: 32rpx;
    }
  }
}
.money {
  margin-top: 16rpx;
  padding: 32rpx 24rpx 0;
  background: #ffffff;
  border-radius: 24rpx;
  box-sizing: border-box;
  &__field {
    /deep/ .u-label-text {
      font-size: 40rpx;
      font-weight: bold;
      color: #191919;
      line-height: 48rpx;
    }
    /deep/ .u-field {
      margin-top: 32rpx;
      padding: 18rpx 0 !important;
      box-sizing: border-box;
      input {
        font-size: 40rpx;
        font-weight: bold;
      }
    }
    /deep/ .u-button-wrap {
      font-size: 28rpx;
      font-weight: 400;
      color: #c3c3c3;
      line-height: 40rpx;
    }
  }
  &__field--red {
    /deep/ .u-button-wrap {
      color: #ff450c;
    }
  }
  &__text {
    display: inline-block;
    font-size: 32rpx;
    font-weight: 400;
    color: #191919;
    line-height: 40rpx;
  }
  &__tip {
    height: 62rpx;
    width: 100%;
    font-size: 22rpx;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #FF450C;
    line-height: 62rpx;
    text {
      height: 62rpx;
    }
  }
}
.footer {
  position: fixed;
  bottom: 0;
  width: 100%;
  padding: 8rpx 24rpx;
  background: #ffffff;
  box-shadow: 0rpx -4rpx 20rpx 0rpx rgba(189, 194, 204, 0.2);
  z-index: 2000;
  padding-bottom: calc(
    constant(safe-area-inset-bottom) + 8rpx
  ); /* 兼容 iOS < 11.2 */
  padding-bottom: calc(
    env(safe-area-inset-bottom) + 8rpx
  ); /* 兼容 iOS >= 11.2 */
  &-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 80rpx;
    background: linear-gradient(90deg, #FF8011 0%, #FE3040 100%);
    border-radius: 40rpx;
    font-family: PingFangSC-Medium, PingFang SC;
    font-size: 32rpx;
    font-weight: 600;
    color: #ffffff;
    line-height: 40rpx;
    opacity: 1;
  }
  // 置灰状态
  &-btn--notsel {
    opacity: 0.6;
  }
}
</style>

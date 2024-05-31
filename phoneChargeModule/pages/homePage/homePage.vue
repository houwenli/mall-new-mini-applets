<template>
  <view class="phone-charge">
    <wsf-nav-bar
      @onBackBtnClick="toIndex()"
      :status-bar="true"
      title="手机充值"
      :hasBack="true"
    ></wsf-nav-bar>
    <topContacts
      ref="topContacts"
      v-if="numberList && numberList.length != 0"
      @selectContacts="selectContacts"
      :list="numberList"
      :textNum="textNum"
    />
    <!-- 输入手机号,弹出输入框 -->
    <u-toast ref="uToast" />
    <view class="phone">
      <view class="charge-num">
        <view class="charge-num-input">
          <input
            type="text"
            class="input-style"
            placeholder-style="font-size: 48rpx;font-family: PingFangSC-Regular, PingFang SC;font-weight: 400;color: #FFFFFF;opacity:0.4"
            v-model="telPhone"
            maxlength="13"
            placeholder="请输入手机号码"
            @input="onCallInput"
            @paste="onCallInput"
            @blur="onBlur"
            @focus="onFocus"
          />
          <image
            @click="goPage('oftenPhone', { id })"
            class="charge-num-img"
            :src="`${mallImg}/phoneCharge/contacts.png`"
            alt=""
          />
        </view>
        <p class="phone-area">
          {{ phoneTag }}
          <text v-if="area">（{{ area }}）</text>
        </p>
      </view>
    </view>
    <!-- 选择充值面额 -->
    <view class="amount">
      <view v-if="haveData" class="amount-list">
        <view class="amount-top">
          <view
            class="top-up-amount"
            :class="{ 'actived-style': actived === index }"
            v-for="(item, index) in topUpList"
            :key="item.id"
            @click="onChoose(item, index)"
          >
            <!-- 原价 -->
            <text class="face-value">{{ item._rechargeAmount }}元</text>
            <!-- 优惠价 -->
            <text v-if="item._prePrice" class="price">
              优惠{{ item._prePrice }}元
            </text>
          </view>
        </view>
        <!-- 到账提示 -->
        <view class="top-up-tips">{{ tips }}</view>
      </view>
    </view>
    <!-- 分享至 -->
    <view class="feature-tabs" v-if="isLink">
      <view class="btn" @click="serviceShare()">
        <img :src="`${mallImg}/phoneCharge/share.png`" alt="" />
      </view>
    </view>
    <u-popup
      v-model="showShareModal"
      mode="bottom"
      border-radius="20"
      height="388rpx"
    >
      <view class="share-container">
        <view class="share-title">分享至</view>
        <view class="share-way">
          <button
            class="share-way-part"
            open-type="share"
            @click="showShareModal = false"
          >
            <image
              class="share-way-image"
              src="@/static/img/icon/WeChat@2x.png"
            ></image>
            <span>微信好友</span>
          </button>
        </view>
        <view class="cancel-btn" @click="showShareModal = false">取消</view>
      </view>
    </u-popup>
    <!-- 底部按钮组 -->
    <view class="foot-style">
      <view class="foot">
        <text @click="goPage('rechargRecord')">充值记录</text>
        <text class="line"></text>
        <text @click="goPage('warmReminder')">温馨提示</text>
      </view>
      <view class="foot-btn" :class="{ 'foot-btn--color': isLink }">
        <!-- <integral-popup
          v-if="isLink"
          ref="integralPopup" 
          :useIntegral.sync="useIntegral" 
          :integralMoney.sync="integralMoney"
          :integralCfgId.sync="integralCfgId"
          amountUnit="fen"
          :always-show="false" 
          :businessType="businessTypeEnum.recharge" 
          :orderLastTotalPrice="orderLastTotalPrice" 
        >
        </integral-popup> -->
        <button v-if="isLink" @click="toPay()">
          立即充值<text v-if="checkVal && checkVal.realPayAmount">
            ({{ realPayAmount }})
          </text>
        </button>
        <view v-else class="foot-btn--login">
          <view class="tip">立刻登录享充值特价</view>
          <view class="login" @click="goPage">立即登录</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import topContacts from "./topContacts.vue";
import integralPopup from '@/components/wsf-integral-popup/index.vue';
// 公共方法
import { fenToYuan } from "@/common/utils.js";
import { qqMap } from "@/common/config.js";

import { BUSINESS_TYPE } from '@/common/constants/order.js'
export default {
  components: { topContacts, integralPopup },
  data() {
    return {
      mallImg: this.$mallImg,
      numberList: [], // 常用联系人
      telPhone: "", //选中的常用联系人的手机号 344格式)
      textNum: "", // 选中的常用联系人的手机号
      id: null, // 选中的常用联系人的id
      area: "", //选中的常用联系人的手机运营商
      phoneTag: "充值号码", //充值提示
      topUpList: [], //面额列表
      actived: -1, //选中的index
      //选中的充值面额信息
      checkVal: {
        id: "",
      },
      isConfig: false,
      showShareModal: false, // 分享
      queryString: "", // 智慧生活携带数据

      
			useIntegral: 0,
			businessTypeEnum: Object.freeze(BUSINESS_TYPE),
      integralMoney: 0,
      integralCfgId: null
    };
  },
  methods: {
    init() {
      this.initCityCode()
      //已登录
      if (this.isLink) {
        this.selectCustomerCommonPhoneListAndAdd("one");
        this.$refs.integralPopup && this.$refs.integralPopup.getConfig()
      } else {
        this.topUpList = [
          { _rechargeAmount: 30 },
          { _rechargeAmount: 50 },
          { _rechargeAmount: 100 },
        ];
      }
    },
    initCityCode() {
      let that = this;
      uni.getFuzzyLocation({
        type: 'wgs84',
        // geocode: true,
        // isHighAccuracy: true,
        success(res) {         
          console.log('-----------------', res); 
          qqMap.reverseGeocoder({
            location: {
              latitude: res.latitude,
              longitude: res.longitude,
            },
            success: function (result) {
              console.log(result, '----')
			        let cityCode = String(result.result.ad_info.adcode);
              that.cityCode = cityCode.slice(0, 4) + "00";           
            },
            fail: function (error) {
              console.error(error, "error");
              that.cityCode = 0;
            },
          });
        },
      });
    },

    //分享
    serviceShare() {
      this.showShareModal = true;
    },
    // 检验手机号格式
    isMobilePhone(val) {
      return val && /^1(3|4|5|6|7|8|9)\d{9}$/.test(val);
    },
    // 检验手机号全部
    isPhone(val) {
      const text = val.replace(/\s*/g, "");
      if (!val || !this.isMobilePhone(text)) {
        this.phoneTag = !val ? "号码不能为空" : "号码不正确";
        this.isConfig = true;
        const params = {
          cityCode: 0,
          rechargeType: 1,
        };
        this.queryPhoneFeeConfig(params);
        this.isConfig = false;
        return false;
      }
      this.isConfig = false;
      this.phoneTag = "充值号码";
      return true;
    },
    // 选择常用联系人
    selectContacts(val) {
      this.isConfig = false;
      this.textNum = val.mobile;
      this.telPhone = this.getPhone(this.textNum);
      this.checkVal = {
        id: "",
      };
      this.phoneTag = "充值号码";
      this.getMobileConfig();
    },
    // 输入事件
    onCallInput(event) {
      let value = event.target.value.replace(/\D/g, "").substr(0, 11); // 不允许输入非数字字符，超过11位数字截取前11位
      setTimeout(() => {
        this.telPhone = this.getPhone(value);
        this.textNum = value;
      });
    },
    // 手机号处理成344格式
    getPhone(value) {
      if (value) {
        let len = value.length;
        if (len > 3 && len < 8) {
          value = value.replace(/^(\d{3})/g, "$1 ");
        } else if (len >= 8) {
          value = value.replace(/^(\d{3})(\d{4})/g, "$1 $2 ");
        }
        return value;
      }
      return "";
    },
    //失焦
    onBlur() {
      if (!this.isLink) return;
      if (this.telPhone) {
        this.textNum = this.telPhone.replaceAll(" ", "");
      } else {
        this.textNum = "";
        this.actived = -1;
      }
      if (!this.isPhone(this.textNum)) {
        this.topUpList = [];
        this.area = "";
        this.actived = -1;
        return;
      }
      this.getMobileConfig();
    },
    //聚焦
    onFocus() {
      if (!this.isLink) {
        this.$smart.go("QuickLogin");
      }
    },
    // 选择充值面额
    onChoose(val, index) {
      console.log('val',val)
      console.log('index',index)
      // 未登录-去登录
      if (!this.isLink) {
        this.$smart.go("QuickLogin");
        return;
      }
      this.actived = index;
      this.checkVal = val;

      // 检查福气值使用临点
      if (this.integralMoney > this.orderLastTotalPrice) {
        this.$nextTick(() => this.$refs.integralPopup.checkIntegralNum(this.useIntegral))
      }
    },
    // 立刻充值
    async toPay() {
      // 选中的面额最终支付以售价为准
      if (!this.isPhone(this.textNum)) return;
      if (this.payLoadding) return
      this.payLoadding = true
      // 手机号没问题就去确认支付页进行支付
      try {
        let info = this.checkVal.id ? this.checkVal : this.topUpList[0];
        let res = await this.$u.api.createOrder({
          phoneFeeConfigId: info.id,
          rechargePhone: this.textNum,
          integralPoint: this.useIntegral,
          integralCfgId: this.integralCfgId,

          rewardBo: {
            orderingPort: '万顺福小程序',
            orderingVersion: this.$appVersion,
            orderingEquipment: '',
            orderingArea: this.cityCode || ''
          }
        });

        const { code, data } = res
        console.log('res',res)
        if (code === 200) {
          // 无需支付
          if (data.needPay === 1) {
            this.$wsf.go('CheckOrderPay', { isThirdPay: 0, orderMoney: data.orderIntegralMoney, payStatus: 'PAID', businessType: BUSINESS_TYPE.recharge, orderCode: data.orderNo });
            
          } else {
            this.$wsf.go("Pay", {
              orderMoney: fenToYuan(data.orderIntegralMoney),
              orderCode: data.orderNo,
              // area: this.area,
              rechargeAmount: fenToYuan(data.orderIntegralMoney),
              businessType: 200,
              paySceneType: 201, // 201充值订单
            });
          }

          
        } else {
          res.msg ? this.$refs.uToast.show({ title: res.msg }) : "";
        }
        this.payLoadding = false
      } catch (error) {
        this.payLoadding = false
        if (error.data?.msg) {
          this.$refs.uToast.show({ title: error.data.msg });
        }

        setTimeout(() => {
          this.init()
        }, 1000);
      }
    },
    // 查询电话费配置
    async queryPhoneFeeConfig(params) {
      try {
        let res = await this.$u.api.queryPhoneFeeConfig(params);
        // 数据处理
        let dealData = this.dealData(res.data);
        this.topUpList = dealData;
        console.log('this.isConfig',this.isConfig)
        if (!this.isConfig) this.onChoose(this.topUpList[0], 0);
      } catch (error) {}
    },
    // 处理电话费配置数据
    dealData(data) {
      if (!data || data.length == 0) return [];
      let realData = this.$u.deepClone(data);
      realData.forEach((item) => {
        let isPrePrice = item.rechargeAmount > item.realPayAmount; //是否有优惠价
        item._prePrice = isPrePrice
          ? fenToYuan(item.rechargeAmount - item.realPayAmount)
          : null; //优惠价
        item._rechargeAmount = fenToYuan(item.rechargeAmount, false); // 原价
      });
      return realData;
    },
    // 获取运营商，查询对应的电话费配置
    async getMobileConfig() {
      try {
        const mobileTypeName = {
          1: "移动",
          2: "联通",
          3: "电信",
        };
        let res = await this.$u.api.getMobileArea({ mobile: this.textNum }); // 查询手机号和归属地
        let mobileArea = res.data || {};
        if (mobileArea.provName && mobileArea.mobileCode) {
          this.area =
            mobileArea.provName +
            mobileArea.cityName +
            mobileTypeName[mobileArea.mobileCode];
        } else if (!mobileArea.mobileCode) {
          // this.$refs.uToast.show({ title: "未发现对应运营商，请核对是否正确" });
          this.area = "";
        } else {
          this.area = "";
        }
        if (res && res.code === 200) {
          this.id = mobileArea.id;
          const params = {
            cityCode: Number(mobileArea.cityCode),
            rechargeType: 1,
          };
          this.queryPhoneFeeConfig(params);
        }
      } catch (error) {
        console.log(error);
      }
    },
    // 查询常用联系人
    async selectCustomerCommonPhoneListAndAdd(val) {
      try {
        let res = await this.$u.api.selectCustomerCommonPhoneListAndAdd({});
        if (res && res.code == 200) {
          this.numberList = res.data || [];
          // 第一次进来时,默认选中第一个
          if (val && this.numberList.length > 0) {
            this.selectContacts(this.numberList[0]);
          }
        }
      } catch (error) {}
    },
    // 返回按钮
    toIndex() {
      if (["话费", "充值"].includes(this.queryString)) {
        this.$wsf.go("SmartIndex");
      } else {
        uni.navigateBack();
      }
    },
    //跳转页面
    goPage(name, val) {
      // 未登录跳转登录页
      if (!this.isLink) {
        this.$smart.go("QuickLogin");
        return;
      }
      this.$smart.go(name, val);
    },
  },
  onLoad(options) {
    // 从智慧生活搜索话费和充值跳转到该页面点击返回得返回到智慧生活首页
    this.queryString = options.queryString || "";
  },
  // 分享给好友
  onShareAppMessage() {
    return {
      path: "phoneChargeModule/pages/homePage/homePage",
      imageUrl: `${this.mallImg}/phoneCharge/phoneShare.jpg`,
    };
  },
  onShow() {
    this.init()
  },
  computed: {
    //是否登录  -- 是否有token
    isLink() {
      console.log(getApp().globalData, '=====getApp().globalData.isLink')
      return getApp().globalData.isLink;
    },
    //到账提示
    tips() {
      let tip = "*预计10分钟内到账，请留意运营商短信";
      return tip;
    },
    //是否有充值面额
    haveData() {
      return this.topUpList && this.topUpList.length;
    },
    //当前选择金额
    realPayAmount() {
      if (!this.checkVal || !this.checkVal.realPayAmount) return;
      return fenToYuan(this.checkVal.realPayAmount - this.integralMoney);
    },

    orderLastTotalPrice({checkVal}) {
      return checkVal ? checkVal.realPayAmount : 0
    }
  },
};
</script>

<style lang="scss" scoped>
.phone-charge {
  height: 100%;
  width: 100%;
  background: #f6f6f6;
  display: flex;
  flex-direction: column;
  .phone {
    padding: 24rpx 20rpx 0 20rpx;
  }
  .charge-num {
    width: 100%;
    height: 298rpx;
    background: url("https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/recharge/img_bg%402x.png")
      no-repeat;
    background-size: 100% 100%;
    padding: 0 32rpx;
  }
  .charge-num-input {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 72rpx 0 16rpx 0;
    .input-style {
      width: 80%;
      height: 64rpx;
      line-height: 64rpx;
      font-size: 56rpx;
      font-family: DINAlternate-Bold, DINAlternate;
      font-weight: bold;
      color: #ffffff;
    }
    .filed-icon {
      width: 32rpx;
      height: 32rpx;
    }
    .charge-num-img {
      width: 48rpx;
      height: 48rpx;
    }
  }
  /* 光标颜色 */
  input {
    caret-color: #f1f4fc;
    padding-left: 4rpx;
  }
  input.searchinput {
    caret-color: #eeeeee;
    margin-left: 2rpx;
  }
  input.placeholder {
    color: red;
    font-size: 1.5em;
  }
  .phone-area {
    font-size: 26rpx;

    color: #ffffff;
  }
  .charge-num-image {
    width: 48rpx;
    height: 48rpx;
  }
  .phone-list {
    display: flex;
    flex-direction: column;
    max-height: 300rpx;
    overflow: auto;
    margin: 22rpx 0 48rpx 0;
  }
  .empty {
    display: flex;
    align-items: center;
    margin: 0 auto;
    .empty-image {
      width: 32rpx;
      height: 32rpx;
      margin-right: 8rpx;
    }
    .empty-text {
      font-size: 24rpx;
      color: #909399;
    }
  }

  .amount {
    height: 100%;
    background: #fff;
    border-radius: 32rpx 32rpx 0rpx 0rpx;
    padding-top: 6rpx;
    display: flex;
    flex-direction: column;
    .warp {
      font-size: 32rpx;
      font-weight: 600;
      color: #191919;
    }
    .nodata {
      text-align: center;
      display: flex;
      flex-direction: column;
      justify-content: center;
      .nodata-image {
        margin: 144rpx auto 20rpx auto;
        width: 360rpx;
        height: 360rpx;
      }
      .nodata-tips {
        font-size: 30rpx;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #999999;
      }
    }
    .amount-top {
      width: 100%;
      max-height: 770rpx;
      overflow: auto;
      padding: 22rpx 16rpx 0 16rpx;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      flex-wrap: wrap;
    }
    .top-up-amount {
      width: 30.8%;
      height: 172rpx;
      margin: 8rpx 9rpx;
      background: #f8f8f8;
      border-radius: 24rpx;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      .face-value {
        font-size: 32rpx;
        font-weight: 600;
        color: #000d1d;
      }
      .price {
        font-size: 24rpx;
        color: #de3a38;
      }
    }
    .actived-style {
      border: 2rpx solid #ff0a35;
    }
    .unable-style {
      .face-value {
        color: #c9c9c9;
      }
      .price {
        color: #c9c9c9;
      }
    }
    .top-up-tips {
      text-align: center;
      font-size: 26rpx;
      margin-top: 24rpx;
      color: #999999;
    }
  }
  /deep/.u-input__input {
    border-bottom: 2rpx solid #eeeeee;
    font-size: 56rpx;
    font-family: DINAlternate-Bold, DINAlternate;
    font-weight: bold;
    color: #191919;
  }
  .history {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #eeeeee;
    .history-phone {
      font-size: 26rpx;

      color: #191919;
      margin: 24rpx 0 28rpx 0;
    }
    .bind-phone {
      font-size: 26rpx;

      color: #c3c3c3;
    }
  }
  .history:nth-last-child(1) {
    border: none;
  }
}
.foot-style {
  width: 100%;
  background: #fff;
  align-self: flex-end;
  font-size: 26rpx;
  color: #093ee2;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .foot {
    display: flex;
    justify-content: center;
    align-items: center;
    padding-bottom: 64rpx;
    .line {
      width: 2rpx;
      height: 20rpx;
      background: #c3c3c3;
      margin: 0 24rpx;
    }
  }
  .foot-btn {
    width: 100%;
    padding: 24rpx;
    padding-bottom: calc(constant(safe-area-inset-bottom) + 24rpx);
    padding-bottom: calc(env(safe-area-inset-bottom) + 24rpx);
    button {
      margin-top: 12rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 90rpx;
      background: linear-gradient(90deg, #ff5f2e 0%, #ff0a35 100%);
      border-radius: 46rpx;
      font-size: 32rpx;
      font-weight: 500;
      color: #fff9e9;
    }
  }
  .foot-btn--color {
    background: #ffffff;
    box-shadow: 0rpx -80rpx 147rpx 0rpx rgba(0, 0, 0, 0.13);
    padding: 16rpx 32rpx;
    padding-top: 4rpx;
    min-height: 122rpx;
    padding-bottom: calc(constant(safe-area-inset-bottom) + 16rpx);
    padding-bottom: calc(env(safe-area-inset-bottom) + 16rpx);
  }
  .foot-btn--login {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: 12rpx 16rpx 12rpx 24rpx;
    height: 70rpx;
    background: rgba(25, 25, 25, 0.8);
    border-radius: 40rpx;
    .tip {
      font-size: 24rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #ffffff;
      line-height: 34rpx;
    }
    .login {
      width: 120rpx;
      height: 46rpx;
      text-align: center;
      background: #ff0a35;
      border-radius: 24rpx;
      font-size: 22rpx;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #ffffff;
      line-height: 42rpx;
    }
  }
}
// 分享
.feature-tabs {
  position: fixed;
  z-index: 9;
  right: 24rpx;
  bottom: 200rpx;
  bottom: calc(constant(safe-area-inset-bottom) + 200rpx);
  bottom: calc(env(safe-area-inset-bottom) + 200rpx);
  width: 80rpx;
  .btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 80rpx;
    height: 80rpx;
    line-height: 80rpx;
    background: #191919;
    border-radius: 44rpx;
    opacity: 0.8;
    text-align: center;
    img {
      width: 44rpx;
      height: 44rpx;
    }
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
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 0;
      margin: 0;
      width: 50%;
      background-color: #fff;
      line-height: 24rpx;
      outline: none;
    }
    button::after {
      border: none;
    }
    .share-way-part {
      width: auto;
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
/deep/.point-popup {
  background-color: #f6f6f6;
  border-radius: 8px;
  margin-top: 4px;
  .point-content {
    padding: 14rpx 24rpx;
    padding-top: 8rpx;
  }
}
</style>

<template>
  <wsf-popup
    v-model="popupShow"
    mode="bottom"
    :safe-area-inset-bottom="true"
    @close="handleCloseDialog"
  >
    <view class="applet-settlement-popup-wrap" v-if="popupShow">
      <view class="applet-settlement-popup-header u-padding-left-36 u-padding-right-36">
        <view class="applet-settlement-popup-header-close">
          <view
						class="applet-settlement-popup-header-title"
						:class="{
							'applet-settlement-popup-header-title-center': popupShowContent.type == 3
						}"
					>
					 发票
					</view>
          <image
            src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/prev-icon-list/close%402x.png"
            class="applet-settlement-popup-header-close-icon"
            @click="handleCloseDialog"
          ></image>
        </view>
      </view>
      <scroll-view scroll-y="true" style="height: 880rpx">
        <view class="applet-settlement-popup-body">
          <!-- 发票模块 -->
          <template>
            <view class="applet-settlement-popup-invoice">
              <view
                class="applet-settlement-popup-invoice-item u-margin-bottom-36"
              >
                <wsf-radio
                  v-model="popupShowContent.invoice.type"
                  @change="setRules"
                  :options="[
                    { value: 0, label: '不开发票' },
                    { value: 1, label: '电子普通发票' },
                    { value: 2, label: '增值税专用发票' },
                  ]"
                ></wsf-radio>
              </view>
              <u-line class="u-line" color="#F2F2F2"></u-line>
              <template v-if="popupShowContent.invoice.type > 0">
                <!-- 当需要开发票时.引入表单 -->
                <u-form
                  :model="popupShowContent.invoice"
                  ref="uForm"
                  :error-type="['toast']"
                  :border-bottom="false"
                  label-width="176"
                  :label-style="{
                    fontSize: '24rpx',
                    color: '#000000',
                    height: '28rpx',
                    lineHeight: '28rpx',
                  }"
                >
                  <!-- 发票抬头模块 -->
                  <view class="applet-settlement-popup-invoice-form-group">
                    <view
                      class="applet-settlement-popup-invoice-form-group-title"
                      >发票抬头</view
                    >

                    <!-- 当开具电子普通发票时 -->
                    <template v-if="popupShowContent.invoice.type == 1">
                      <u-form-item
                        class="u-padding-top-0 u-padding-bottom-0"
                        :border-bottom="false"
                      >
                        <wsf-radio
                          v-model="popupShowContent.invoice.titleType"
                          :options="[
                            { value: 2, label: '个人' },
                            { value: 1, label: '单位' },
                          ]"
                          @change="popupShowContent.invoice.title = ''"
                        ></wsf-radio>
                      </u-form-item>
                      <template v-if="popupShowContent.invoice.titleType > 1">
                        <u-form-item
                          label="个人名称"
                          prop="title"
                          :border-bottom="false"
                          required
                        >
                          <u-input
                            v-model="popupShowContent.invoice.title"
                            height="48"
                            placeholder-style="color: #BABABA;font-size: 24rpx"
                            placeholder="请填写“个人”或您的姓名"
                          />
                        </u-form-item>
                      </template>
                      <template v-else>
                        <u-form-item
                          label="单位名称"
                          prop="title"
                          :border-bottom="false"
                          required
                        >
                          <u-input
                            v-model="popupShowContent.invoice.title"
                            height="48"
                            placeholder-style="color: #BABABA;font-size: 24rpx"
                            placeholder="请填写单位名称"
                          />
                        </u-form-item>
                        <u-form-item
                          label="纳税人识别号"
                          prop="taxId"
                          :border-bottom="false"
                          required
                        >
                          <u-input
                            v-model="popupShowContent.invoice.taxId"
                            height="48"
                            placeholder-style="color: #E60113;font-size: 24rpx"
                            placeholder="请在此填写纳税人识别号"
                          />
                        </u-form-item>
                      </template>
                    </template>
                    <!-- 当开具增值税发票时 -->
                    <template v-else-if="popupShowContent.invoice.type == 2">
                      <u-form-item
                        label="单位名称"
                        prop="invoiceCompanyName"
                        :border-bottom="false"
                        required
                      >
                        <u-input
                          v-model="popupShowContent.invoice.invoiceCompanyName"
                          height="48"
                          placeholder-style="color: #BABABA;font-size: 24rpx"
                          placeholder="请填写单位名称"
                        />
                      </u-form-item>
                      <u-form-item
                        label="发票税号"
                        prop="taxId"
                        :border-bottom="false"
                        required
                      >
                        <u-input
                          v-model="popupShowContent.invoice.taxId"
                          height="48"
                          placeholder-style="color: #BABABA;font-size: 24rpx"
                          placeholder="请填写纳税人识别号"
                        />
                      </u-form-item>
                      <u-form-item
                        label="注册地址"
                        prop="invoiceRegisterAddress"
                        :border-bottom="false"
                        required
                      >
                        <u-input
                          v-model="
                            popupShowContent.invoice.invoiceRegisterAddress
                          "
                          height="48"
                          placeholder-style="color: #BABABA;font-size: 24rpx"
                          placeholder="请填写注册地址"
                        />
                      </u-form-item>
                      <u-form-item
                        label="注册电话"
                        prop="invoiceRegisterMobile"
                        :border-bottom="false"
                        required
                      >
                        <u-input
                          v-model="
                            popupShowContent.invoice.invoiceRegisterMobile
                          "
                          height="48"
                          type="number"
                          placeholder-style="color: #BABABA;font-size: 24rpx"
                          placeholder="请填写注册电话"
                        />
                      </u-form-item>
                      <u-form-item
                        label="开户银行"
                        prop="invoiceOpenBank"
                        :border-bottom="false"
                        required
                      >
                        <u-input
                          v-model="popupShowContent.invoice.invoiceOpenBank"
                          height="48"
                          placeholder-style="color: #BABABA;font-size: 24rpx"
                          placeholder="请填写开户银行"
                        />
                      </u-form-item>
                      <u-form-item
                        label="银行账号"
                        prop="invoiceBankAccount"
                        :border-bottom="false"
                        required
                      >
                        <u-input
                          v-model="popupShowContent.invoice.invoiceBankAccount"
                          height="48"
                          type="number"
                          placeholder-style="color: #BABABA;font-size: 24rpx"
                          placeholder="请填写银行账号"
                        />
                      </u-form-item>
                    </template>
                  </view>
                  <u-line class="u-line" color="#F2F2F2"></u-line>

                  <!-- 收票人信息模块 -->
                  <view class="applet-settlement-popup-invoice-form-group">
                    <view
                      class="applet-settlement-popup-invoice-form-group-title"
                      >收票人信息</view
                    >
                    <u-form-item
                      label="收票人手机"
                      prop="invoicePhone"
                      :border-bottom="false"
                      required
                    >
                      <u-input
                        v-model="popupShowContent.invoice.invoicePhone"
                        height="48"
                        placeholder-style="color: #BABABA'';font-size: 24rpx"
                        placeholder="请填手机号码"
                      />
                    </u-form-item>
                    <u-form-item
                      label="收票人邮箱"
                      prop="invoiceMail"
                      :border-bottom="false"
                      required
                    >
                      <u-input
                        v-model="popupShowContent.invoice.invoiceMail"
                        height="48"
                        placeholder-style="color: #BABABA'';font-size: 24rpx"
                        placeholder="用来接收电子发票邮件"
                      />
                    </u-form-item>
                    <u-line class="u-line" color="#F2F2F2"></u-line>
                  </view>
                  <!-- 发票内容模块 -->
                  <view class="applet-settlement-popup-invoice-form-group">
                    <view
                      class="applet-settlement-popup-invoice-form-group-title"
                      >发票内容</view
                    >
                    <u-form-item
                      class="u-padding-top-0 u-padding-bottom-0"
                      :border-bottom="false"
                    >
                      <wsf-radio
                        v-model="popupShowContent.invoice.content"
                        :options="[
                          { value: 1, label: '商品明细' },
                          { value: 2, label: '商品类别' },
                        ]"
                      ></wsf-radio>
                    </u-form-item>
                    <view
                      class="applet-settlement-popup-invoice-form-group-tips"
                    >
                      发票内容将显示详细商品名称与价格信息，发票金额为实际支付金额，不含虚资产、
                      优惠等扣减金额。
                    </view>
                  </view>
                </u-form>
              </template>
            </view>
          </template>
        </view>
      </scroll-view>
    </view>
    <button class="confirm-btn" @tap="goodFortuneConfirm()">确定</button>
  </wsf-popup>
</template>
<script>

export default {
  props: {
    popupShow: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      popupShowContent: {},
      formRules: {
        // 发票抬头
        title: [
          {
            required: true,
            message: "请输入个人名称或单位名称",
            // 可以单个或者同时写两个触发验证方式
            trigger: ["change"],
          },
        ],
        // 纳税人识别号
        taxId: [
          {
            required: true,
            min: 5,
            message: "请输入纳税人识别号",
            trigger: "change",
          },
        ],
        // 收票人联系电话
        invoicePhone: [
          {
            len: 11,
            // validator: (rule, value, callback) => {
            // 	// 上面有说，返回true表示校验通过，返回false表示不通过
            // 	// this.$u.test.mobile()就是返回true或者false的
            // 	return this.$u.test.mobile(value);
            // },
            required: true,
            message: "请输入正确的手机号码",
            trigger: "change",
          },
        ],
        // 收票人邮箱
        invoiceMail: [
          {
            type: "email",
            required: true,
            message: "请输入正确的邮箱",
            trigger: "change",
          },
        ],
        // 增值税发票
        // 单位名称
        invoiceCompanyName: [
          {
            required: true,
            message: "请输入单位名称",
            trigger: "change",
          },
        ],
        // 单位地址
        invoiceRegisterAddress: [
          {
            required: true,
            message: "请输入单位地址",
            trigger: "change",
          },
        ],
        // 注册电话
        invoiceRegisterMobile: [
          {
            required: true,
            message: "请输入注册电话",
            trigger: "change",
          },
        ],
        // 开户银行
        invoiceOpenBank: [
          {
            required: true,
            message: "请输入开户银行",
            trigger: "change",
          },
        ],
        // 银行账号
        invoiceBankAccount: [
          {
            required: true,
            message: "请输入银行账号",
            trigger: "change",
          },
        ],
      },
    };
  },
  mounted() {
  
    let defaultInvoice = {
      type: 0,
      title: "",
      content: 1,
      taxId: "",
      titleType: 2,
      invoiceCompanyName: "",
      invoiceRegisterAddress: "",
      invoiceRegisterMobile: "",
      invoiceOpenBank: "",
      invoiceBankAccount: "",
      invoicePhone: "",
      invoiceMail: "",
    };
    this.popupShowContent = { invoice: defaultInvoice};   
  },
  methods: {
    handleCloseDialog() {
      this.$emit("handleCloseDialog");
    },
    // 注入规则
    setRules(e) {
      this.invoiceType = e;
      if (e <= 0) return;
      this.$nextTick(() => {
        this.$refs.uForm.setRules(this.formRules);
        this.$refs.uForm.resetFields();
      });
    },
    goodFortuneConfirm() {
      console.log(this.popupShowContent,'this.popupShowContent');
      this.$nextTick(() => {

        // this.$u.api.GetFqzPrice({ fqzPoint }).then((res) => {
        this.$emit("goodFortuneConfirm", this.invoiceType, this.popupShowContent);
        // });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.coupon-text {
  line-height: 28rpx;
}

.warp {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 100rpx;
  .rect {
    width: 100%;
    background-color: #fff;
    border-radius: 20rpx;
    box-sizing: border-box;
    padding: 60rpx 0rpx 40rpx 0rpx;
    .title {
      width: 100%;
      text-align: center;
      font-size: 32rpx;
      font-weight: 500;
      color: #000000;
    }
    .list {
      width: 100%;
      margin-top: 60rpx;
      margin-bottom: 65rpx;
      .scroll-Y {
        max-height: 600rpx;
      }
      .limit-item::after {
        content: "";
        height: 0.4rem;
        background-color: #f2f2f2;
        width: 100%;
        display: inline-block;
        margin-bottom: 18px;
      }
      .limit-item:last-child::after {
        display: none;
      }
      .content {
        width: 100%;
        display: flex;
        padding: 0 50rpx;
        .left {
          width: 120rpx;
          height: 120rpx;
          image {
            width: 120rpx;
            height: 120rpx;
          }
        }
        .right {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          width: 100%;
          .txt-2 {
            color: #e60113;
          }
          .limit-num {
            font-size: 24rpx;
            color: #e60113;
          }
        }
      }
    }
    .btn {
      width: 100%;
      display: flex;
      justify-content: center;
      .btn-item {
        width: 320rpx;
        height: 60rpx;
        border: 1rpx solid #e60113;
        font-size: 24rpx;
        font-weight: 500;
        color: #e60113;
        text-align: center;
        line-height: 60rpx;
        border-radius: 60rpx;
      }
    }
  }
}

page,
view,
text {
  color: #000000;
}

.wsf-red {
  color: $wsf-color-red;
}
.wsf-grey {
  color: #999;
}

.address-info {
  color: #000000;
  border-radius: 0px 0px 20rpx 20rpx;
  overflow: hidden;
  .default-icon {
    width: 50rpx;
    height: 26rpx;
    background: linear-gradient(277deg, #f99700 0%, #df3927 100%);
    border-radius: 4rpx;
    display: inline-block;
    text-align: center;
    line-height: 26rpx;
    font-size: 18rpx;
    color: #fff;
    vertical-align: middle;
    margin-right: 12rpx;
  }
  .font-bold {
    font-weight: bold;
  }
  .divide-line {
    position: absolute;
    background: repeating-linear-gradient(
      135deg,
      #fa7f6a,
      #fa7f6a 5%,
      white 2.5%,
      white 7.5%,
      #739cfa 7.5%,
      #739cfa 12.5%,
      white 12.5%,
      white 15%
    );
    height: 6rpx;
    width: 100%;
    bottom: 5rpx;
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
.fixed-column-space {
  bottom: 68rpx !important;
}
.fixed-column {
  color: #000000;
  background-color: #fff;
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 50px;
  .all-price {
    font-weight: bold;
  }
  .order-submit {
    width: 216rpx;
    height: 76rpx;
    background: $wsf-color-red;
    border-radius: 38rpx;
    line-height: 76rpx;
    color: #fff;
    font-size: 28rpx;
    text-align: center;
  }
  .sms-user-conpon-discount {
    color: #e60113;
    font-size: 24rpx;
    margin-left: 180rpx;
  }
}
// 弹出层内容
.applet-settlement-popup-wrap {
  color: #000000;
  position: relative;
  border-radius: 20rpx 20rpx 0 0;
  background-color: #fff;
  .applet-settlement-popup-header {
    width: 100%;
    height: 100rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    &-title {
      font-size: 32rpx;
      font-weight: bold;
      color: #000000;
    }
    &-title-center {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
    &-close {
      height: 100rpx;
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      &-icon {
        height: 32rpx;
        width: 32rpx;
      }
    }
  }
  .applet-settlement-popup-body {
    color: #000000;
    // 运费模块
    .applet-settlement-popup-distribution {
      &-item {
        font-size: 14px;
        color: #000000;
        line-height: 14px;
      }
    }
    // 发票模块
    .applet-settlement-popup-invoice {
      padding-left: 36rpx;
      .applet-settlement-popup-invoice-form-group {
        padding: 20rpx 0;
        &-title {
          color: #000000;
          font-weight: 500;
          font-size: 26rpx;
          line-height: 64rpx;
          height: 64rpx;
        }
        &-tips {
          padding-top: 12rpx;
          font-size: 24rpx;
          color: #999999;
        }
        // 修复表单的间隔
        & /deep/ .u-form-item {
          padding: 8rpx 0;
        }
        // 修复输入框右侧的清除按钮样式
        & /deep/ .u-input__right-icon {
          height: 48rpx;
        }
      }
    }
  }
}
.gift-product-list {
  .gift-product {
    display: flex;
    align-items: center;
    margin-top: 36rpx;
    &:first-child {
      margin-top: 0;
    }
    image {
      width: 100rpx;
      height: 100rpx;
      border-radius: 6rpx;
    }
    .content {
      margin: 12rpx 20rpx;
      color: #666;
      font-size: 26rpx;
      width: 388rpx;
    }
  }
}

.header-tabs {
  z-index: 999;
  width: 100%;
  height: 80rpx;
  display: flex;
  align-items: center;
  background-color: #fff;
  border-bottom: 1rpx solid #f2f2f2;
  .tabs {
    font-weight: bold;
    text-align: center;
    height: 100%;
    flex: 1;
    position: relative;
    font-size: 28rpx;
    color: #000;
    display: inline-block;
    line-height: 80rpx;
    i {
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 56rpx;
      height: 6rpx;
      background: #e60113;
      border-radius: 4rpx;
      overflow: hidden;
      &.active {
        font-weight: bold;
      }
    }
  }
}
.empty-page {
  text-align: center;

  height: 100%;
  image {
    margin-top: 120rpx;
    width: 180rpx;
    height: 180rpx;
  }
  .nocoupon-txt {
    font-size: 28rpx;
    color: #999;
    margin-top: -6rpx;
    height: 40rpx;
    line-height: 40rpx;
  }
}
.coupon-list {
  padding: 40rpx 0;
  .coupon-discount-sum {
    padding: 0 24rpx 40rpx;
    font-size: 28rpx;
    color: #000;
    line-height: 36rpx;
  }
  .disabled-coupon {
    background: #f2f2f2;
    .main-ticket {
      width: auto !important;
    }
  }
  .product-coupon {
    background: #fef4f4;
  }
  .store-coupon {
    background: #fff7ee;
  }
  .coupon {
    margin: 0 24rpx 20rpx;
    height: 196rpx;
    border-radius: 16rpx;
    overflow: hidden;
    display: flex;
    position: relative;
    .usable-mark {
      position: absolute;
      right: 16rpx;
      top: 16rpx;
      color: #fe8993;
      line-height: 28rpx;
      font-size: 20rpx;
    }
    .main-ticket {
      width: 502rpx;
      position: relative;
      padding: 52rpx 0 20rpx 56rpx;
      .coupon-detail {
        display: inline-flex;
        align-items: center;
        height: 76rpx;
        .disabled-color {
          color: #999 !important;
        }
        .store-color {
          color: #fe8c02 !important;
        }
        .product-color {
          color: #e60113 !important;
        }
        .coupon-price {
          font-weight: 600;
          display: inline-flex;
          align-items: baseline;
          .text {
            font-size: 28rpx;
            line-height: 40rpx;
          }
          .price {
            margin: 0 8rpx;
            font-size: 64rpx;
            line-height: 76rpx;
          }
        }
        .full-discount {
          font-size: 28rpx;
        }
        .coupon-info {
          padding-top: 16rpx;
          margin-left: 56rpx;
          display: inline-flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: flex-start;
          .condition {
            width: 340rpx;
            color: #000;
            font-size: 28rpx;
            line-height: 40rpx;
            font-weight: 500;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            margin-bottom: 16rpx;
          }
          .indate {
            color: #666;
            font-size: 22rpx;
            line-height: 32rpx;
          }
          .explain {
            margin-top: 16rpx;
          }
        }
      }
      .coupon-explain {
        white-space: nowrap;
        padding-top: 16rpx;
        font-size: 0;
        color: #666;
        line-height: 32rpx;
        text {
          font-size: 22rpx;
        }
      }

      .disabled-mark {
        background: #999;
      }
      .store-mark {
        background: #ffb760;
      }
      .product-mark {
        background: #fe8993;
      }

      .main-mark {
        width: 100rpx;
        height: 36rpx;
        border-radius: 0 0 16rpx 0px;
        position: absolute;
        left: 0;
        top: 0;
        text-align: center;
        line-height: 36rpx;
        font-size: 20rpx;
        color: #fff;
      }
    }
    .stub-ticket {
      width: 200rpx;
      display: inline-flex;
      align-items: center;
      justify-content: flex-end;
      .choosebox {
        width: 36rpx;
        height: 36rpx;
        margin-right: 36rpx;
      }
    }
  }
}
.gift_main {
  .title {
    height: 100rpx;
    text-align: center;
    line-height: 100rpx;
    font-size: 32rpx;
    color: #000;
    font-weight: 800;
    background-color: #f5f5f5;
  }
  .content {
    background-color: #f5f5f5;
    padding: 0 24rpx 24rpx 24rpx;
    height: 100%;
    .min_card {
      margin-bottom: 24rpx;
      overflow: hidden;
      width: 100%;
      border-radius: 20rpx;
      .up {
        color: #fff;
        background-color: #7689df;
        box-sizing: border-box;
        padding: 24rpx;
        .txt_1 {
          display: flex;
          justify-content: space-between;
          font-size: 30rpx;
          text {
            color: #fff;
          }
          .sp {
            font-size: 24rpx;
            display: flex;
            align-items: center;
          }
        }
        .txt_2 {
          text {
            color: #fff;
          }
          margin-top: 20rpx;
          display: flex;
          justify-content: space-between;
          text:nth-child(1) {
            font-size: 26rpx;
          }
          text:nth-child(2) {
            font-size: 22rpx;
          }
        }
      }
      .down {
        background-color: #fff;
        box-sizing: border-box;
        padding: 40rpx 24rpx;
        display: flex;
        .left {
          flex: 0.7;
          view:nth-child(1) {
            font-size: 24rpx;
            text {
              font-size: 36rpx;
            }
          }
          view:nth-child(2) {
            display: flex;
            justify-content: center;
            align-items: center;
            margin-top: 20rpx;
            font-size: 24rpx;
            color: #999;
          }
        }
        .right {
          flex: 0.3;
          display: flex;
          justify-content: flex-end;
          align-items: center;
          .stub-ticket {
            width: 200rpx;
            display: inline-flex;
            align-items: center;
            justify-content: flex-end;
            .choosebox {
              width: 36rpx;
              height: 36rpx;
              margin-right: 36rpx;
            }
          }
        }
      }
    }
  }
  .footer {
    background-color: #fff;
    width: 100%;
    height: 100rpx;
    padding: 10rpx 36rpx;
    box-sizing: border-box;
    .btn {
      width: 100%;
      height: 80rpx;
      line-height: 80rpx;
      background-color: #e60113;
      color: #fff;
      text-align: center;
      border-radius: 40rpx;
    }
  }
}
.popup_text {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 95%;
  .instructions {
    border-radius: 20rpx;
    padding: 60rpx;
    background-color: #fff;
    width: 632rpx;
    min-height: 700rpx;
    position: relative;
    .my_title {
      position: relative;
      text-align: center;
      margin-bottom: 44rpx;
      .img {
        position: absolute;
        top: -28rpx;
        right: -28rpx;
      }
    }
    .my_text {
      flex: 1;
      overflow-y: scroll;
      .usage_record {
        font-size: 28rpx;
        color: #333;
        margin-bottom: 74rpx;
        box-sizing: border-box;
        .item {
          padding: 0 60rpx;
          .date {
            font-size: 26rpx;
            color: #000;
            margin-top: 30rpx;
          }
          .order {
            margin: 24rpx 0;
            text:nth-child(1) {
              font-size: 26rpx;
              color: #666;
            }
            text:nth-child(2) {
              padding: 6rpx 12rpx;
              border-radius: 22rpx;
              display: inline-block;
              font-size: 22rpx;
              color: #000;
              background-color: #f5f5f5;
            }
          }
          .money {
            padding-bottom: 30rpx;
          }
        }
      }
      .image {
        text-align: center;
        padding: 150rpx 0;
        image {
          width: 180rpx;
          height: 180rpx;
        }
      }
    }
    .btn {
      position: absolute;
      bottom: 80rpx;
      left: 158rpx;
      width: 280rpx;
      height: 60rpx;
      line-height: 60rpx;
      text-align: center;
      border-radius: 60rpx;
      background-color: #e60113;
      color: #fff;
      font-size: 24rpx;
    }
  }
}

.cell-item-title {
  color: #000;
  font-size: 26rpx;
}

.good-fortune-popup {
  .title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 40rpx 36rpx 80rpx;
    color: #000;
    font-size: 30rpx;
    line-height: 36rpx;
    .close {
      width: 32rpx;
      height: 32rpx;
    }
  }
  .discount-amount {
    color: #000;
    font-size: 32rpx;
    text-align: center;
    margin-bottom: 36rpx;
    .yuan {
      margin-left: 8rpx;
      font-size: 24rpx;
      color: #e60113;
    }
    .money {
      font-size: 36rpx;
      color: #e60113;
    }
  }
  .good-fortune-input {
    margin: 0 24rpx 90rpx;
    background: #f5f5f5;
    border-radius: 20rpx;
    height: 100rpx;
    padding: 0 20rpx;
    font-size: 36rpx;
    text-align: center;
  }
}

.good-fortune-card {
  /deep/ .u-cell-box {
    border-radius: 20rpx;
  }
}
.confirm-btn {
  margin: 0 32rpx;
  height: 80rpx;
  background: #e60113;
  border-radius: 38rpx;
  line-height: 80rpx;
  text-align: center;
  font-size: 28rpx;
  color: #fff;
}
</style>

<template>
  <view class="wrap">
    <!-- 头部 -->
    <smartNavBar title="添加银行卡" />
    <view class="content">
      <text class="title">请绑定持卡人本人的银行卡</text>
      <view class="info">
        <u-field
          v-model="data.userName"
          label="持卡人"
          placeholder="请输入持卡人姓名"
          placeholder-style="color:#C3C3C3"
          maxlength="20"
          :clearable="false"
        />
        <u-field
          v-model="data.idNo"
          label="身份证号"
          placeholder="请输入身份证号码"
          placeholder-style="color:#C3C3C3"
          @input="onInput($event, 'idNo')"
          @paste="onInput($event, 'idNo')"
          :clearable="false"
        />
        <u-field
          type="number"
          v-model="data.bankCardNum"
          label="银行卡号"
          placeholder="请输入银行卡号"
          placeholder-style="color:#C3C3C3"
          @input="onBankCardInput"
          @paste="onBankCardInput"
          @blur="onBankCardBlur"
          :clearable="false"
        />
        <u-field
          v-model="data.bankCardName"
          label="银行"
          placeholder="所属银行"
          placeholder-style="color:#C3C3C3"
          :disabled="true"
          :clearable="false"
        />
        <u-field
          type="number"
          v-model="data.reservePhone"
          label="预留手机号"
          placeholder="请输入预留手机号"
          placeholder-style="color:#C3C3C3"
          maxlength="11"
          @input="onInput($event, 'reservePhone')"
          @paste="onInput($event, 'reservePhone')"
          :clearable="false"
        />
        <u-field
          type="number"
          v-model="data.smsCode"
          label="验证码"
          placeholder="请输入验证码"
          placeholder-style="color:#C3C3C3"
          maxlength="6"
          :clearable="false"
        >
          <template #right>
            <text
              :class="['code', { 'code--red': tips == '获取验证码' }]"
              @tap="getCode"
            >
              {{ tips }}
            </text>
            <u-verification-code
              ref="uCode"
              :keep-running="false"
              :seconds="seconds"
              change-text="重新发送(xs)"
              end-text="获取验证码"
              @change="codeChange"
            ></u-verification-code>
          </template>
        </u-field>
      </view>
    </view>
    <!-- 底部按钮 -->
    <view class="footer"
      ><view class="footer-btn" @click="save">绑定银行卡</view>
    </view>
  </view>
</template>

<script>
// 公共组件
import smartNavBar from "@/components/smart/smart-nav-bar/smart-nav-bar.vue";
// 公共数据
import { SMSCODETYPE } from "@/common/constants/userinfo";
// 接口
import {
  ToCardName,
  Send,
  AddBankCard,
} from "@/common/smart-api/userCenterApi";

export default {
  components: {
    smartNavBar,
  },
  data() {
    return {
      data: {
        userName: "",
        idNo: "",
        bankCardName: "",
        bankCardNum: "", //有空格的银行卡号
        reservePhone: "",
        smsCode: "",
      },
      seconds: "60",
      tips: "",
    };
  },
  methods: {
    //校验
    onInput(e, name) {
      let repMap = {
        idNo: /[^0-9Xx]/g,
        reservePhone: /[^0-9]/g,
      };
      this.$nextTick(() => {
        this.data[name] = e.replace(repMap[name], "");
      });
    },
    // 银行卡号校验
    onBankCardInput(e) {
      this.$nextTick(() => {
        this.data.bankCardNum = e
          .replace(/\s/g, "")
          .replace(/[^\d]/g, "")
          .replace(/(\d{4})(?=\d)/g, "$1 ");
      });
    },
    // 银行卡号失焦查询银行
    async onBankCardBlur(e) {
      try {
        if (!e.detail.value) return;
        let val = e.detail.value.split(/[\t\r\f\n\s]*/g).join("");
        let params = {
          bankCard: val,
        };
        let res = await ToCardName(params);
        this.data.bankCardName = res.data.bankName || "";
      } catch (error) {
        if (error.data.msg) {
          this.$u.toast(error.data.msg);
        }
      }
    },
    codeChange(text) {
      this.tips = text;
    },
    //获取验证码
    async getCode() {
      try {
        if (this.$refs.uCode.canGetCode) {
          if (!this.$u.test.mobile(this.data.reservePhone || "")) {
            this.$u.toast("请输入正确的手机号!");
            return;
          }
          // 模拟向后端请求验证码
          uni.showLoading({
            title: "正在获取验证码",
          });

          let param = {
            phone: this.data.reservePhone,
            smsCodeType: SMSCODETYPE.bindBankCard,
          };

          //请求验证码
          let res = await Send(param);

          setTimeout(() => {
            // 显示 loading 提示框, 需主动调用 uni.hideLoading 才能关闭提示框。
            uni.hideLoading();
            // 这里此提示会被this.start()方法中的提示覆盖
            this.$u.toast("验证码已发送");
            // 通知验证码组件内部开始倒计时
            this.$refs.uCode.start();
          }, 500);
        } else {
          this.$u.toast("倒计时结束后再发送");
        }
      } catch (error) {
        if (error.data.msg) {
          this.$u.toast(error.data.msg);
        }
        console.log(error);
      }
    },
    //绑定银行卡
    async save() {
      try {
        let obj = this.data;
        for (const key in obj) {
          if (!obj[key] && key != "bankCard") {
            this.$u.toast("请将银行卡信息填写完整");
            return;
          }
        }
        this.data.bankCard = this.data.bankCardNum
          .split(/[\t\r\f\n\s]*/g)
          .join("");
        let res = await AddBankCard(this.data);
        if (res.code == 200) {
          this.toIndex();
        }
      } catch (error) {
        if (error.data.msg) {
          this.$u.toast(error.data.msg);
        }
        console.log(error);
      }
    },
    // 跳转页面
    toIndex() {
      this.$smart.go("smartBankCard");
    },
  },
};
</script>

<style scoped lang="scss">
.info {
  margin-top: 24rpx;
  padding: 0 24rpx;
  background: #fff;
  border-radius: 24rpx;
}
.content {
  padding: 24rpx;
  .title {
    font-size: 26rpx;
    color: #6e6e6e;
    line-height: 34rpx;
  }
  .code {
    font-size: 26rpx;
    color: #c3c3c3;
  }
  .code--red {
    color: #ff450c;
  }
}
/deep/ .u-label {
  min-width: 160rpx;
  font-size: 32rpx;
  color: #191919;
  line-height: 40rpx;
}
/deep/ .u-field {
  padding: 32rpx 0 !important;
}
/deep/.u-border-bottom:after {
  border-color: #eeeeee;
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
  ); /* 兼容 iOS <style 11.2 */
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
    font-size: 32rpx;
    font-weight: 600;
    font-family: PingFangSC-Medium, PingFang SC;
    color: #ffffff;
    line-height: 40rpx;
  }
}
</style>

<template>
  <view>
    <wsf-nav-bar
      @onBackBtnClick="toIndex()"
      :status-bar="true"
      title="编辑联系人"
      :hasBack="true"
    ></wsf-nav-bar>
    <!-- 输入手机号输入框 -->
    <view class="phone">
      <view class="item">
        <label>手机号码</label>
        <input
          type="number"
          class="input-style"
          placeholder-style="font-size: 28rpx;color: #b4b7ba;"
          v-model.trim="data.mobile"
          maxlength="11"
          placeholder="请输入手机号码"
          @input="onCallInput"
          @paste="onCallInput"
        />
      </view>
      <view class="item">
        <label>昵称</label>
        <input
          class="input-style"
          placeholder-style="font-size: 28rpx;color: #b4b7ba;"
          v-model.trim="data.nickName"
          placeholder="请输入昵称，不超过4个字"
      /></view>
      <view class="default">
        <view class="default-text">
          <label>设置为默认充值号码</label>
          <text>默认优先展示该号码</text>
        </view>
        <view class="shop-info-select" @click.stop="data.defaultStatus = 1">
          <i
            :class="
              data.defaultStatus == 1 ? 'icon_select_ok' : 'icon_select_out'
            "
          ></i>
        </view>
      </view>
    </view>
    <!-- 底部按钮 -->
    <view class="footerBtn">
      <button @click="save">保存</button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      data: {
        mobile: "",
        nickName: "",
        defaultStatus: 0,
      },
      id: "",
      beforeData: { mobile: "", nickName: "", defaultStatus: 0 }, //修改前的数据
      isPhone: true,
    };
  },
  components: {},
  onLoad(option) {
    if (option.id) this.id = option.id;
  },
  onShow() {
    if (this.id) {
      this.selectCustomerCommonPhoneById();
    }
  },
  methods: {
    // 输入事件
    onCallInput(event) {
      const value = event.target.value.replace(/\D/g, "");
      this.$nextTick(() => {
        this.data.mobile = value;
      });
    },
    //添加 修改  常用联系人
    async save() {
      try {
        let isPone = false;
        if (this.data.nickName && this.data.nickName.length > 4) {
          this.showToast("昵称不能超过4个字");
          return;
        } else if (!this.data.mobile || this.data.mobile.length < 11) {
          this.showToast(!this.data.mobile ? "号码不能为空" : "号码不正确");
          return;
        } else if (this.id && this.beforeData.mobile === this.data.mobile) {
          isPone = true; //是否是在相同手机号下有了其他修改
        }
        await this.getMobileConfig();

        let name = this.id
          ? this.$u.api.updateCustomerCommonPhone
          : this.$u.api.addCustomerCommonPhone;
        let params = {
          id: this.id,
          ...this.data,
          mobile: isPone ? null : this.data.mobile,
        };
        let res = await name(params);
        if (res && res.code == 200) {
          this.$wsf.go("oftenPhone");
        }
      } catch (error) {
        if (error.statusCode == 200 && error.data.msg) {
          this.showToast(error.data.msg);
        }
      }
    },
    //查询常用联系人详情
    async selectCustomerCommonPhoneById() {
      let params = {
        id: this.id,
      };
      let res = await this.$u.api.selectCustomerCommonPhoneById(params); // 查询手机号和归属地
      if (res && res.code == 200 && res.data) {
        this.data = res.data;
        this.beforeData = JSON.parse(JSON.stringify(res.data))
      }
    },
    //电话号码校验   查询对应运营商、为空、不到11位
    async getMobileConfig() {
      let res = await this.$u.api.getMobileArea({ mobile: this.data.mobile }); // 查询手机号和归属地
      let areaVal = res.data || {};
      if (!areaVal.mobileCode) {
        this.showToast("未发现对应运营商");
        return Promise.reject(res)
      }
    },
    showToast(errMsg, duration = 1500) {
      uni.showToast({
        title: errMsg,
        icon: "none",
        mask: true,
        duration: duration,
      });
    },
    toIndex() {
      uni.navigateBack();
    },
  },
};
</script>

<style lang="less" scoped>
.phone {
  margin: 22rpx 24rpx;
  padding: 48rpx 24rpx;
  height: 414rpx;
  background: #ffffff;
  border-radius: 24rpx;
  .item {
    display: flex;
    align-items: center;
    margin-bottom: 32rpx;
    label {
      margin-right: 20rpx;
      width: 128rpx;
      font-size: 32rpx;
      font-weight: 600;
      color: #010b2a;
      line-height: 44rpx;
    }
    input {
      flex: 1;
      padding-left: 20rpx;
      height: 80rpx;
      background: #f6f6f6;
      border-radius: 20rpx;
    }
  }
  .default {
    display: flex;
    justify-content: space-between;
    label {
      font-size: 32rpx;
      font-weight: 600;
      color: #010b2a;
      line-height: 44rpx;
    }
    .default-text {
      display: flex;
      flex-direction: column;
      text {
        margin-top: 10rpx;
        font-size: 24rpx;
        color: #b4b7ba;
        line-height: 40rpx;
      }
    }
  }
}
.shop-info-select {
  position: relative;
  margin-top: 5rpx;
  width: 32rpx;
  height: 32rpx;
  .icon_select_ok::after,
  .icon_select_out::after {
    position: absolute;
    top: 0;
    content: "";
    display: block;
    width: 32rpx;
    height: 32rpx;
  }
  //勾选
  .icon_select_ok::after {
    background-image: url("https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/address/address-selected-2x.png");
    background-size: 32rpx;
    background-repeat: no-repeat;
  }
  // 未勾选
  .icon_select_out::after {
    background-image: url("https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/browse-records/no.png");
    background-size: 32rpx;
    background-repeat: no-repeat;
  }
}
.footerBtn {
  position: fixed;
  bottom: 0;
  width: 100%;
  padding: 8rpx 24rpx;
  text-align: center;
  background: #ffffff;
  box-shadow: 0px -4rpx 20rpx 0 rgba(189, 194, 204, 0.2);
  padding-bottom: calc(constant(safe-area-inset-bottom)); /* 兼容 iOS < 11.2 */
  padding-bottom: calc(env(safe-area-inset-bottom)); /* 兼容 iOS >= 11.2 */
  button {
    width: 702rpx;
    height: 80rpx;
    background: linear-gradient(90deg, #ff5f2e 0%, #ff0a35 100%);
    border-radius: 40rpx;
    font-size: 32rpx;
    font-weight: 500;
    color: #fff9e9;
    line-height: 80rpx;
  }
}
</style>

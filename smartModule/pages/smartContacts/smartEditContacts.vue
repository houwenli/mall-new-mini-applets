<template>
  <view class="wrap">
    <!-- 头部 -->
    <smartNavBar :title="title" />
    <!-- 输入手机号输入框 -->
    <view class="content">
      <view class="info">
        <view class="info-item">
          <label>手机号</label>
          <input
            type="number"
            placeholder-style="font-size: 28rpx;color: #C3C3C3;"
            v-model.trim="data.mobile"
            maxlength="11"
            placeholder="请输入手机号码"
            @input="onCallInput"
            @paste="onCallInput"
          />
        </view>
        <view class="info-item">
          <label>昵称</label>
          <input
            placeholder-style="font-size: 28rpx;color: #C3C3C3;"
            v-model.trim="data.nickName"
            maxlength="4"
            placeholder="请输入不超过4个字的昵称"
        /></view>
      </view>
      <view class="default">
        <view class="default-text">
          <label>设置为默认充值号码</label>
          <text class="desc">默认优先展示该号码</text>
        </view>
        <u-switch
          v-model="data.defaultStatus"
          active-color="#E60113"
          :active-value="1"
          :inactive-value="0"
        ></u-switch>
      </view>
    </view>
    <!-- 底部按钮 -->
    <view class="footer"
      ><text class="footer-btn" @click="save">保存</text>
    </view>
  </view>
</template>

<script>
// 公共组件
import smartNavBar from "@/components/smart/smart-nav-bar/smart-nav-bar.vue";
// 接口
import {
  AddCustomerCommonPhone,
  SelectCustomerCommonPhoneById,
  UpdateCustomerCommonPhone,
  GetMobileArea,
} from "@/common/smart-api/userCenterApi";
export default {
  components: {
    smartNavBar,
  },
  data() {
    return {
      data: {
        mobile: "",
        nickName: "",
        defaultStatus: 0,
      },
      id: "",
      beforeData: { mobile: "", nickName: "", defaultStatus: 0 }, //修改前的数据
      isPhone: false,
      isExisted: false, //是否是在相同手机号下有了其他修改
      isLoading: false, // 是否正在加载
    };
  },
  computed: {
     title() {
      return this.id ? "编辑联系人" : "添加联系人";
    },
    //编辑时，除手机号外是否有修改
    isIdentical() {
      return (
        this.beforeData.nickName === this.data.nickName &&
        this.beforeData.defaultStatus === Number(this.data.defaultStatus)
      );
    },
  },
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
    // 添加 修改 前校验
    saveCheck() {
      this.isExisted = false;
      if (this.data.nickName && this.data.nickName.length > 4) {
        this.showToast("昵称不能超过4个字");
        return false;
      } else if (this.$u.test.isEmpty(this.data.mobile)) {
        this.showToast("号码不能为空");
        return false;
      } else if (this.data.mobile.length < 11) {
        this.showToast("号码不正确");
        return false;
      } else if (this.id && this.beforeData.mobile === this.data.mobile) {
        this.isExisted = true;
      }
      return true;
    },
    // 添加 修改
    async save() {
      if (this.isLoading) return;
      try {
        // 校验
        let saveCheck = this.saveCheck();
        if (!saveCheck) {
          return;
        }
        // 是否有运营商
        await this.getMobileConfig();
        if (!this.isPhone) {
          return;
        }
        let name = this.id ? UpdateCustomerCommonPhone : AddCustomerCommonPhone;
        let params = {
          id: this.id,
          ...this.data,
          defaultStatus: Number(this.data.defaultStatus),
          mobile: this.isExisted ? null : this.data.mobile, //若未修改手机号,值传null
        };
        await name(params);
        this.isLoading = false;
        uni.navigateBack();
      } catch (error) {
        this.isLoading = false;
        if (error.statusCode == 200 && error.data.msg) {
          this.showToast(error.data.msg);
        }
      }
      
    },
    // 查询常用联系人详情
    async selectCustomerCommonPhoneById() {
      let params = {
        id: this.id,
      };
      try {
        let res = await SelectCustomerCommonPhoneById(params); // 查询手机号和归属地
        this.data = res.data || {};
        this.beforeData = JSON.parse(JSON.stringify(res.data || {}));
      } catch (error) {}
    },
    // 电话号码校验   查询对应运营商、为空、不到11位
    async getMobileConfig() {
      this.isPhone = false; // 是否有运营商
      try {
        let res = await GetMobileArea({ mobile: this.data.mobile }); // 查询手机号和归属地
        let areaVal = res.data || {};
        if (!areaVal.mobileCode) {
          this.showToast("未发现对应运营商");
        } else {
          this.isPhone = true;
        }
      } catch (error) {}
    },
    // 提示
    showToast(errMsg, duration = 1500) {
      uni.showToast({
        title: errMsg,
        icon: "none",
        mask: true,
        duration: duration,
      });
    },
  },
};
</script>

<style lang="less" scoped>
.content {
  padding: 16rpx;
}
.info {
  padding: 32rpx 24rpx;
  height: 264rpx;
  background: #ffffff;
  border-radius: 24rpx;
  &-item {
    display: flex;
    align-items: center;
    margin-bottom: 40rpx;
    &:last-child {
      margin-bottom: 0;
    }
    label {
      margin-right: 60rpx;
      width: 96rpx;
      height: 44rpx;
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
}
.default {
  display: flex;
  justify-content: space-between;
  margin-top: 16rpx;
  padding: 32rpx 24rpx;
  background: #ffffff;
  border-radius: 24rpx;
  /deep/ .u-switch__node {
    top: -4rpx;
    box-shadow: 0 0 0 #ccc;
    width: 48rpx !important;
    height: 48rpx !important;
    background: #d8d8d8;
    border-radius: 24rpx;
  }
  /deep/ .u-switch {
    width: 80rpx !important;
    height: 40rpx !important;
    border: none;
    background: #f6f6f6 !important;
    border-radius: 24rpx;
  }
  /deep/ .u-switch--on {
    background: #f6f6f6 !important;
    .u-switch__node {
      background: #FE3040;
    }
  }
  label {
    font-size: 32rpx;
    font-weight: 600;
    color: #191919;
    line-height: 44rpx;
  }
  &-text {
    display: flex;
    flex-direction: column;
    .desc {
      margin-top: 8rpx;
      font-size: 26rpx;
      color: #c3c3c3;
      line-height: 34rpx;
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
  &-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 80rpx;
    background: linear-gradient(90deg, #FF8011 0%, #FE3040 100%);
    border-radius: 40rpx;
    font-size: 32rpx;
    font-weight: 500;
    color: #FFFFFF;
    line-height: 40rpx;
  }
  padding-bottom: calc(
    constant(safe-area-inset-bottom) + 8rpx
  ); /* 兼容 iOS < 11.2 */
  padding-bottom: calc(
    env(safe-area-inset-bottom) + 8rpx
  ); /* 兼容 iOS >= 11.2 */
}
</style>

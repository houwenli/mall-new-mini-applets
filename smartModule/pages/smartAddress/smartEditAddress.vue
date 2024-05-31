<template>
  <view class="wrap">
    <!-- 头部 -->
    <smartNavBar :title="title" />
    <!-- 内容 -->
    <view class="content">
      <!-- 地址信息 -->
      <view class="address-info">
        <!-- 收货人 -->
        <u-field
          class="address-info__field"
          :border-bottom="false"
          :field-style="fieldStyle"
          v-model="addressInfo.name"
          label="收货人"
          placeholder="请填写收货人姓名"
          placeholder-style="color:#C3C3C3"
          maxlength="10"
          @input="hasChange = true"
        ></u-field>

        <!-- 手机号码 -->
        <u-field
          class="address-info__field"
          :border-bottom="false"
          :field-style="fieldStyle"
          v-model="addressInfo.originMobile"
          label="手机号"
          maxlength="11"
          placeholder="请填写收货人手机号"
          placeholder-style="color:#C3C3C3"
          @input="hasChange = true"
        ></u-field>

        <!-- 所在地区 -->
        <u-field
          :border-bottom="false"
          :field-style="fieldStyle"
          class="address-info__field"
          @click="showAction"
          v-model="addressInfo.addressName"
          :disabled="true"
          label="所在地址"
          placeholder="请选择所在地区"
          placeholder-style="color:#C3C3C3"
          :clearable="false"
        >
          <template slot="right">
            <view class="address-info--right">
              <image :src="`${smartImg}/me/extract-next.png`"></image>
            </view>
          </template>
        </u-field>
        <u-select
          v-model="show"
          class="address-info__city"
          mode="mutil-column-auto"
          label-name="name"
          child-name="children"
          confirm-color="#fe3040"
          value-name="code"
          :default-value="[]"
          :list="cityList"
          :safe-area-inset-bottom="true"
          @confirm="chooseArea"
        >
        </u-select>
        <!-- 详细地址 -->
        <u-field
          class="address-info__field address-info__textarea"
          :class="{ 'address-info__textarea--ios': isIOS }"
          v-model="addressInfo.detailAddress"
          type="textarea"
          mask-close-able
          :border-bottom="false"
          :auto-height="false"
          :field-style="fieldStyle"
          label="详细地址"
          maxlength="100"
          placeholder="街道楼牌号等"
          placeholder-style="color:#C3C3C3"
          disable-default-padding="true"
          @input="hasChange = true"
        ></u-field>
      </view>
      <!-- 默认地址与否 -->
      <view class="address-default">
        <text class="address-default__desc">设置默认地址</text>
        <u-switch
          v-model="addressInfo.isDefault"
          active-color="#E60113"
          :active-value="1"
          :inactive-value="0"
          @change="isDefaultChange"
        ></u-switch>
      </view>
      <!-- 二次确认按钮 -->
      <smartConfirm
        :show="showConfirm"
        :title="'是否删除'"
        :cancelText="'取消'"
        :confirmText="'确定'"
        @cancel="activeCancel"
        @confirm="activeConfirm"
      />
    </view>
    <!-- 底部按钮 -->
    <view class="footer">
      <view
        class="footer-del"
        v-if="addressType === 'edit'"
        @click="openModal('是否删除')"
      >
        <image :src="`${smartImg}/setUp/address-delete.png`" />
        删除
      </view>
      <view class="footer-save" @click="saveAddress"> 保存并使用</view>
    </view>
  </view>
</template>

<script>
// 公共组件
import smartNavBar from "@/components/smart/smart-nav-bar/smart-nav-bar.vue";
import smartConfirm from "@/components/smart/smart-confirm/smart-confirm.vue";
// 接口
import {
  QueryAddressById,
  UpdateAddress,
  AddAddress,
  AreaTree,
  DeleteAddressById,
} from "@/common/smart-api/userCenterApi";
export default {
  components: {
    smartNavBar,
    smartConfirm,
  },
  data() {
    return {
      smartImg: this.$smartImg,
      addressId: null, //id
      addressType: "", //操作类型
      addressInfo: {
        detailAddress: "",
      },
      show: false, //地址选择框
      isLoading: false, //保存是否正在请求
      isDelLoading: false, //删除是否正在请求
      showConfirm: false, // 确认弹窗
      confirmContext: "", // 弹窗主体文案
      hasChange: false, // 是否修改过内容
      cityList: [], //地址选择列表
      //输入框样式
      fieldStyle: {
        color: "#444444",
        fontSize: "28rpx",
        lineHeight: "40rpx",
      },
    };
  },
  computed: {
    title() {
      return this.addressType === "edit" ? "编辑地址" : "新增地址";
    },
    isIOS() {
      return this.$u.os() == "ios";
    },
  },
  onLoad(options) {
    this.addressType = options.addressType;
    this.addressId = options.id || null;
    if (this.addressType == "edit") {
      this.addressInfo = {
        name: "",
        originMobile: "",
        addressName: "",
        detailAddress: "",
        isDefault: 0,
      };
    }
  },
  onShow() {
    this.getAreaTree();
    if (this.addressType != "edit") return;
    this.queryAddressForId();
  },
  methods: {
    // 根据ID获取地址信息
    queryAddressForId() {
      let params = {
        id: this.addressId,
      };
      QueryAddressById(params)
        .then((res) => {
          this.addressInfo = res.data;
          // 数据处理
          this.addressInfo.defaultRegion = this.addressInfo.address.split(",");
          this.addressInfo.isDefault = Number(res.data.isDefault);
          this.addressInfo.addressName =
            this.addressInfo.defaultRegion.join("");
        })
        .catch((err) => {});
    },
    // 唤起弹窗选择
    showAction() {
      this.show = true;
    },
    // 选择地区
    chooseArea(e) {
      this.hasChange = true;
      this.addressInfo.addressName = `${e[0].label}${e[1].label}${e[2].label}`;
      this.addressInfo.address = `${e[0].label},${e[1].label},${e[2].label}`;
      this.addressInfo.provinceCode = e[0].value;
      this.addressInfo.cityCode = e[1].value;
      this.addressInfo.districtCode = e[2].value;
    },
    // 打开模态框
    openModal(context) {
      this.confirmContext = context;
      this.showConfirm = true;
    },
    // 是否默认
    isDefaultChange(e) {
      this.addressInfo.isDefault = e;
    },
    // 保存地址
    async saveAddress() {
      if (this.isLoading) return;
      this.addressInfo.mobile = this.addressInfo.originMobile;
      // 校验
      if (this.$u.test.isEmpty(this.addressInfo.name)) {
        this.$u.toast("请填写收货人");
        return;
      } else if (this.$u.test.isEmpty(this.addressInfo.mobile)) {
        this.$u.toast("请输入手机号");
        return;
      } else if (!this.$u.test.mobile(this.addressInfo.mobile + "")) {
        this.$u.toast("手机格式不对,请重新输入");
        return;
      } else if (this.$u.test.isEmpty(this.addressInfo.addressName)) {
        this.$u.toast("请选择所在地区");
        return;
      } else if (this.$u.test.isEmpty(this.addressInfo.detailAddress)) {
        this.$u.toast("请输入详细地址");
        return;
      } else if (
        !this.$u.test.rangeLength(this.addressInfo.detailAddress, [5, 100])
      ) {
        this.$u.toast("详细地址最少5个字");
        return;
      }

      let api = this.addressType == "add" ? AddAddress : UpdateAddress;
      let title = this.addressType == "add" ? "新增成功" : "修改成功";
      this.isLoading = true;

      try {
        await api(this.addressInfo);
        this.isLoading = false;
        this.$u.toast(title);
        // 提示展示1秒之后再跳转页面
        setTimeout(function () {
          uni.navigateBack();
        }, 1000);
      } catch (error) {
        this.isLoading = false;
      }
    },
    // 点击了确定按钮
    activeConfirm() {
      this.showConfirm = false;
      this.deleteAddress();
    },
    // 点击了取消按钮
    activeCancel() {
      this.showConfirm = false;
    },
    // 删除地址
    async deleteAddress() {
      if (this.isDelLoading) return;
      this.isDelLoading = true;
      let params = {
        id: this.addressId,
      };
      try {
        await DeleteAddressById(params);
        this.isDelLoading = false;
        this.$u.toast("删除成功");
        // 提示展示1秒之后再跳转页面
        setTimeout(function () {
          uni.navigateBack();
        }, 1000);
      } catch (error) {
        this.isDelLoading = false;
        console.log(error);
      }
    },
    //获取省市区树
    getAreaTree() {
      AreaTree().then((res) => {
        this.cityList = res.data || [];
      });
    },
  },
};
</script>

<style scoped lang="scss">
.content {
  padding: 16rpx;
}
.address-info {
  padding: 12rpx 0;
  background: #ffffff;
  border-radius: 24rpx;
  &__field {
    /deep/ .u-field {
      padding: 20rpx 24rpx;
    }
    /deep/ .u-label-text {
      font-size: 32rpx;
      font-weight: 600;
      color: #191919;
      line-height: 44rpx;
    }
    /deep/ .fild-body {
      margin-left: 28rpx;
      padding: 20rpx 12rpx 20rpx;
      height: 80rpx;
      box-sizing: border-box;
      background: #f6f6f6;
      border-radius: 24rpx;
      .u-icon__icon {
        color: #000 !important;
      }
    }
  }
  &--right {
    display: flex;
    align-items: center;
    height: 40rpx;
    image {
      height: 32rpx;
      width: 32rpx;
    }
  }
  &__textarea {
    /deep/ .fild-body {
      height: 164rpx;
      padding: 0;
      .u-flex {
        height: 164rpx;
      }
    }
    /deep/ .u-textarea-class {
      padding: 20rpx 12rpx;
      height: 124rpx;
    }
    /deep/ .u-label{
      padding-top: 14rpx;
    }
  }
  &__textarea--ios {
    /deep/ .u-textarea-class {
      margin-top: -18rpx;
      margin-left: -10rpx;
    }
  }
  &__city {
    /deep/.u-drawer-bottom {
      font-weight: 600;
      border-radius: 24rpx 24rpx 0rpx 0rpx;
    }
    /deep/ .u-select__body__picker-view {
      font-size: 32rpx;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #191919;
    }
  }
}
.address-default {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 16rpx;
  padding: 0 24rpx;
  height: 104rpx;
  background: #ffffff;
  border-radius: 24rpx;
  &__desc {
    font-size: 32rpx;
    font-weight: 600;
    color: #010b2a;
    line-height: 44rpx;
  }
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
}
.footer {
  position: fixed;
  bottom: 0;
  display: flex;
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
  &-del {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-right: 26rpx;
    font-size: 22rpx;
    font-weight: 400;
    color: #999999;
    line-height: 30rpx;
    image {
      width: 34rpx;
      height: 32rpx;
    }
  }
  &-save {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 80rpx;
    background: linear-gradient(90deg, #ff8011 0%, #fe3040 100%);
    border-radius: 40rpx;
    font-size: 32rpx;
    font-weight: 500;
    color: #ffffff;
    line-height: 40rpx;
  }
}
</style>

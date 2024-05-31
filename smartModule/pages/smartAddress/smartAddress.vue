<template>
  <view class="wrap">
    <!-- 头部 -->
    <smartNavBar title="收货地址" />
    <!-- 内容 -->
    <view class="smartaddress">
      <!-- 加载页 -->
      <smartTransition v-if="isLoading" />
      <!-- 内容 -->
      <view v-else class="smartaddress__content">
        <!-- 列表 -->
        <addressList
          v-if="list && list.length > 0"
          :list="list"
          @operate="operate"
        />
        <!-- 缺省页 -->
        <smartTransition
          v-else
          topHight="360"
          :typeName="emptyMap[emptyType].type"
          :text="emptyMap[emptyType].text"
        />
      </view>
    </view>
    <!-- 底部按钮 -->
    <view class="footer">
      <view class="footer-btn" @click="operate('add')">新增收货地址</view>
    </view>
  </view>
</template>

<script>
// 公共组件
import smartTransition from "@/components/smart/smart-transition/smart-transition.vue";
import smartNavBar from "@/components/smart/smart-nav-bar/smart-nav-bar.vue";
// 内部组件
import addressList from "./comm/addressList.vue";
// 接口
import { QueryCustomerAddress } from "@/common/smart-api/userCenterApi";
export default {
  components: { smartTransition, addressList, smartNavBar },
  data() {
    return {
      smartImg: this.$smartImg,
      isLoading: true, // 是否正在加载
      list: [],
      emptyType: 1, //过度页类型 0 无网络 1 为空
      emptyMap: {
        0: {
          type: "noNetwork",
          text: "暂无网络",
        },
        1: {
          type: "noAddress",
          text: "您还没有收货地址噢！",
        },
      },
    };
  },
  onShow() {
    this.reset();
  },

  methods: {
    // 初始化数据
    reset() {
      this.isLoading = true;
      this.list = [];
      this.getList();
    },
    //操作
    operate(type, item) {
      this.$smart.go("smartEditAddress", {
        id: item?.id,
        addressType: type,
      });
    },
    //获取地址
    getList() {
      if (!this.isLoading) return;
      this.isLoading = true;
      this.emptyType = 1;
      QueryCustomerAddress()
        .then((res) => {
          this.isLoading = false;
          // 数据处理
          let dealData = this.dealData(res.data);
          this.list = dealData;
        })
        .catch((err) => {
          this.isLoading = false;
          this.emptyType = 0;
        });
    },
    // 处理地址列表数据
    dealData(data) {
      if (!data || data.length == 0) return [];
      let realData = this.$u.deepClone(data);
      realData.forEach((item) => {
        let address = item.address ? item.address.replaceAll(",", "") : "";
        item._address = address + item.detailAddress;
      });
      return realData;
    },
  },
};
</script>

<style scoped lang="scss">
.flex {
  display: flex;
  align-items: center;
  align-content: center;
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
    background: linear-gradient(90deg, #ff8011 0%, #fe3040 100%);
    border-radius: 40rpx;
    font-family: PingFangSC-Medium, PingFang SC;
    font-size: 32rpx;
    font-weight: 500;
    color: #ffffff;
    line-height: 40rpx;
  }
}
.smartaddress {
  height: calc(100vh - 168rpx);
  &__content {
    height: 100%;
  }
}
</style>

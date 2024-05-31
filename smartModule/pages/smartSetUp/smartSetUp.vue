<template>
  <view>
    <!-- 头部 -->
    <smartNavBar title="设置" />
    <!-- 内容 -->
    <view class="content">
      <view class="module">
        <view class="item line" @click="toIndex('smartAddress')">
          <text>收货地址</text>
          <image :src="`${smartImg}/me/pro-order-next.png`" />
        </view>
        <view class="item" @click="toIndex('smartContacts')">
          <text>常用联系人</text>
          <image :src="`${smartImg}/me/pro-order-next.png`" />
        </view>
      </view>
      <view class="module">
        <view class="item line" @click="toAgr('privacypolicy')">
          <text>隐私协议</text>
          <image :src="`${smartImg}/me/pro-order-next.png`" />
        </view>
        <view class="item" @click="toAgr('serviceagreement')">
          <text>服务协议</text>
          <image :src="`${smartImg}/me/pro-order-next.png`" />
        </view>
      </view>
    </view>
    <view class="footer" @click="onLog"> 退出登录 </view>
  </view>
</template>

<script>
// 公共组件
import smartNavBar from "@/components/smart/smart-nav-bar/smart-nav-bar.vue";
// 接口
import { logoutApp } from "@/common/smart-api/userCenterApi";
import { mallUrl } from "@/common/request/config.js";

const app = getApp();
export default {
  components: {
    smartNavBar,
  },
  data() {
    return {
      smartImg: this.$smartImg,
    };
  },
  onShow() {},
  methods: {
    toAgr(name) {
      let url = encodeURIComponent(`${mallUrl}/${name}`);
      uni.navigateTo({
        url: "/httpsWebView/pages/webView/webView?url=" + url,
      });
    },
    toIndex(name) {
      this.$smart.go(name);
    },
    onLog() {
      logoutApp()
        .then((res) => {
          app.globalData.isLink = false; // 关联账号关系解除
          app.globalData.newToken = null; //newToken制空
          uni.removeStorageSync("newToken"); //删除Storage里的 newToken
          uni.removeStorageSync("userInfo"); //删除 Storage里的 userInfo
          this.$store.commit("SET_DISTRIBUTION", false); //是否有分销权限(电商)
          // this.$store.dispatch("refreshFn", true);
          uni.switchTab({
            //跳转到智慧生活首页 - uni.switchTab跳转页面不刷新
            url: "/pages/smartIndex/smartIndex",
          });
        })
        .catch((err) => {});
    },
  },
};
</script>

<style scoped lang="scss">
.content {
  padding: 18rpx 16rpx 0;
  .module {
    margin-top: 16rpx;
    background: #ffffff;
    border-radius: 24rpx;
    &:first-child {
      margin-top: 0;
    }
    .item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 104rpx;
      margin: 0 16rpx 0 24rpx;
      image {
        width: 32rpx;
        height: 32rpx;
      }
    }
  }
  .line {
    border-bottom: 1px solid #eee;
  }
}
.footer {
  margin: 18rpx 16rpx 0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 32rpx;
  height: 104rpx;
  background: #ffffff;
  border-radius: 24rpx;
  font-size: 32rpx;
  color: #191919;
  line-height: 40rpx;
}
</style>

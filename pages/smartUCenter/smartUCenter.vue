<template>
  <view class="body" :style="[userWraperStyle]">
    <!-- 头部 -->
    <smartNavBar :bgColor="showSearchBar ? '#fff' : 'transparent'">
      <view slot="diy" class="navbar">
        <image class="navbar-left" :src="`${smartImg}/me/2023-09-25/logo.png`" />
      </view>
    </smartNavBar>
    <!-- 内容 -->
    <view class="content">
      <!-- 用户登录 -->
      <userLogin
        :data="myUserInfo"
        :isLink="isLink"
        @navigationTo="navigationTo"
      />
      <!-- 我的订单 -->
      <order :isLink="isLink" :data="myOrder" @navigationTo="navigationTo" />
      <!-- 我的佣金 -->
      <distributionr
        v-if="isLink && isPromote"
        :data="myDistribution"
        @navigationTo="navigationTo"
      />
      <!-- 我的权益 -->
      <equity :data="myEquity" @navigationTo="navigationTo" />
    </view>
    <!-- 热销商品模块 -->
    <smartHotSku
      :pageType="4"
      :getHotSkuFn="getHotSkuFn"
      :dealHotSkuFn="dealHotSkuFn"
      :loadSignal="loadHotSkuSignal"
    />
    <!-- 底部导航栏 -->
    <smartTabBar @tabBarInfo="getTabBarInfo" />
    <!-- 回到顶部 -->
    <u-back-top :scroll-top="scrollTop" top="5000" :bottom="200">
      <image
        :src="`${mallImg}/prev-icon-list/top%402x.png`"
        style="width: 80rpx; height: 80rpx"
      />
    </u-back-top>
  </view>
</template>
<script>
// 公共组件
import smartNavBar from "@/components/smart/smart-nav-bar/smart-nav-bar.vue";
import smartTabBar from "@/components/smart/smart-tab-bar/smart-tab-bar.vue";
import smartHotSku from "@/components/smart/smart-hot-sku/smart-hot-sku";
// 公共方法
import { priceFilter } from "@/common/wsfFilter.js";
import { visit } from "@/common/visit.js";
import { fenToYuan } from "@/common/utils.js";
// 内部组件
import userLogin from "./comm/userLogin.vue"; //用户登录
import order from "./comm/order.vue"; //我的订单
import distributionr from "./comm/distribution.vue"; //分销佣金
import equity from "./comm/equity.vue"; //我的权益
// 接口
import {
  QueryOrderByUserIdCount, //订单数量
  Userminequery, //【我的】信息
} from "@/common/smart-api/userCenterApi";
import { GetRecommendCommodity } from "@/common/smart-api/homeApi"; //热销商品
export default {
  components: {
    smartNavBar,
    smartTabBar,
    smartHotSku,
    userLogin,
    order,
    distributionr,
    equity,
  },
  computed: {
    //设置底部距离
    userWraperStyle() {
      return {
        paddingBottom: `${this.tabbarHeight}px`,
      };
    },
    //是否是展示佣金板块
    isPromote() {
      return this.myDistribution.agencyFlagL == 1 ? true : false;
    },
  },
  data() {
    return {
      smartImg: this.$smartImg, //智慧生活图片公共路径
      mallImg: this.$mallImg, //电商图片公共路径
      isLink: false, // 是否已经关联过账号
      showSearchBar: false, // 是否显示头部导航栏
      scrollTop: 0, //滑动距离
      tabbarHeight: 0, //底部tabbar高度
      // 用户基本信息
      myUserInfo: {
        headUrl: "", //用户头像
        nickname: "", //昵称
      },
      // 我的订单
      myOrder: {},
      // 我的佣金
      myDistribution: {
        agencyFlagL: 0, //是否代理商： 0.否 1.是
        settledAmount: 0, // 已结算佣金
        unsettledAmount: 0, //待结算佣金
      },
      // 我的权益
      myEquity: {
        luckValue: 0, // 福气值
        coupon: 0, // 优惠券
      },
      loadHotSkuSignal: 0, // 加载热销商品信号
    };
  },
  onShow() {
    visit(this, "个人中心");
    /* ----------需校验是否登录 -----------*/
    //是否有token
    this.isLink = getApp().globalData.isLink;
    //已登录
    if (getApp().globalData.isLink) {
      // 获取用户信息
      this.getUserData();
      // 获取订单数量
      this.getOrderCount();
    }
  },
  onReachBottom() {
    this.loadHotSkuSignal = Math.random();
  },
  onPageScroll(e) {
    this.scrollTop = e.scrollTop;
    let showSearchBar = this.showSearchBar;
    if (e.scrollTop > 30 && !showSearchBar) {
      this.showSearchBar = true;
    } else if (e.scrollTop < 30 && showSearchBar) {
      this.showSearchBar = false;
    } else {
      return;
    }
  },
  watch: {
    //登录状态变化时 - 数据初始化
    isLink(newVal) {
      if (!newVal) {
        this.myEquity = {
          luckValue: 0, // 福气值
          coupon: 0, // 优惠券
        };
        this.myOrder = {};
        this.isPromote = false;
      }
    },
  },
  methods: {
    // 获取【我的】信息
    getUserData() {
      Userminequery()
        .then((res) => {
          let mineAssetVo = res.data.mineAssetVo || null;
          let mineBaseVo = res.data.mineBaseVo || null;
          if (!res.data || !mineAssetVo || !mineBaseVo) {
            return;
          }
          // 用户信息
          this.myUserInfo = {
            headUrl: mineBaseVo.headUrl || `${this.smartImg}/me/user-logon.png`, //用户头像
            nickname: mineBaseVo.nickname || "", //昵称
          };
          // 我的权益
          this.myEquity = {
            luckValue: this.setValLen(mineAssetVo.integralPoint * 1, 2), // 福气值
            coupon: this.setValLen(mineAssetVo.couponCount), // 优惠券
          };
          // 我的资产
          this.myDistribution = {
            agencyFlagL: mineAssetVo.agencyFlag || 0, //是否代理商： 0.否 1.是
            settledAmount: this.setValLen(
              fenToYuan(mineAssetVo.personalAgencySettledAmount),
              2
            ), // 已结算佣金
            unsettledAmount: this.setValLen(
              fenToYuan(mineAssetVo.personalAgencyUnsettledAmount),
              2
            ), //待结算佣金
          };
        })
        .catch((err) => {});
    },
    // 个人中心超长数据处理
    setValLen(val, point = 0) {
      if (!val) return 0;
      return val * 1 > 999999 ? (999999).toFixed(point) : val;
    },
    // 获取订单数量
    getOrderCount() {
      QueryOrderByUserIdCount()
        .then((res) => {
          let map = {};
          //处理数组为对象结构
          (res.data || []).map((item) => {
            if (item.status && item.orderCount) {
              map[item.status * 1] = item.orderCount;
            }
          });
          this.myOrder = map;
        })
        .catch((err) => {});
    },
    // 获取热销商品
    getHotSkuFn() {
      return GetRecommendCommodity;
    },
    // 处理热销商品数据的方法
    dealHotSkuFn() {
      return (data) => {
        return data.map((item) => {
          return item;
        });
      };
    },
    // 获取底部tabbar信息
    getTabBarInfo(data) {
      this.tabbarHeight = data.tabbarHeight || 0;
    },
    // 跳转页面
    navigationTo(sceneName, params) {
      // 未登录跳转登录页
      if (!this.isLink) {
        this.$smart.go("QuickLogin");
        return;
      }
      if (sceneName) {
        console.log(params,'params=');
        this.$smart.go(sceneName, params);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.flex {
  display: flex;
  align-items: center;
}
.body {
  background-image: url("https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/ws-smart-life/me/2023-09-25/bg.png");
  background-size: 100% 100%;
  .navbar {
    padding-left: 16rpx;
    height: 88rpx !important;
    text-align: left;
    .navbar-left {
      width: 220rpx;
      height: 88rpx;
    }
  }
}
.content {
  padding: 0 16rpx;
}
</style>

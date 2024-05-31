<template>
  <view class="back-top" id="nav-bar">
    <view
      class="topback"
      :style="{
        background: topbackBgColor || '#ffffff',
        height: iStatusBarHeight + 'px',
      }"
    ></view>
    <view
      class="box-top"
      :style="{
        background: topSearch ? '#ffffff' : '#f6f6f6',
        height: headerIconHeight + 'px',
      }"
    >
      <view class="icon-left" @click="goUponelevel"
        ><img
          src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/ws-smart-life/cart/icon-left.png"
          alt=""
      /></view>

      <!-- 区分页面，list和search页面不一样 -->
      <block v-if="enterType == 'list'">
        <view class="head-search" @click="goToSearchPage">
          <image
            class="search-img"
            src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/ws-smart-life/home/smart_home_search.png"
            mode="widthFix"
          >
          </image>
          <text class="search-text">搜索我的订单</text>
        </view>
      </block>
      <block v-if="enterType == 'search'">
        <view class="head-search">
          <image
            class="search-img"
            src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/ws-smart-life/home/smart_home_search.png"
            mode="widthFix"
          >
          </image>
          <input
            :focus="true"
            v-model.trim="keyword"
            class="searchinput"
            type="text"
            :placeholder="placeholderText"
            maxlength="30"
            placeholder-class="placeholder-style"
            confirm-type="search"
            @confirm="handleSearch"
          />
          <view class="search-icon" @click="handleSearch()">搜索</view>
        </view>
      </block>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    topSearch: {
      type: Boolean,
      default() {
        return false;
      },
    },
    enterType: {
      type: String,
      default: "list",
    },
    // 点击首页回到地址
    to: {
      type: String,
    },

    title: {
      type: String,
      default: "",
    },
    topbackBgColor: {
      type: String,
      default: "",
    },
    placeholderText: {
      type: String,
      default: "商品名称/订单编号",
    }
  },
  data() {
    return {
      iStatusBarHeight: 0,

      headerIconHeight: 0,
      capsuleRight: 0,

      // 搜索关键字
      keyword: "",
    };
  },

  created() {
    let { height, top, left } = getApp().globalData.capsule;
    let { statusBarHeight, screenWidth } = uni.getSystemInfoSync();
    this.iStatusBarHeight = statusBarHeight;
    this.headerIconHeight = (top - this.iStatusBarHeight) * 2 + height;
    this.capsuleRight = screenWidth - left;
  },

  mounted() {
    this.initNavBar()
  },
  methods: {
    // 初始化navbar，获取属性参数
    initNavBar() {
      const query = uni.createSelectorQuery().in(this);
      query
        .select("#nav-bar")
        .boundingClientRect((data) => {
          this.$emit("navBarInfo", {
            navHeight: data.height,
          });
        })
        .exec();
    },
    goToSearchPage() {
      this.$emit("goToSearchPage");
    },
    goUponelevel() {
      uni.navigateBack({
        delta: 1,
      });
    },
    handleSearch() {
      this.$emit("toSearch", this.keyword);
    },
  },
};
</script>

<style scoped lang="scss">
.back-top {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  .show-overlay {
    position: fixed;
    z-index: 10;
    top: 0;
    height: 100vh;
    width: 100%;
  }
  .topback {
    background: #ffffff;
    width: 100%;
  }
  .box-top {
    display: flex;
    height: 44px;
    align-items: center;
    width: 100%;
  }
  .icon-left {
    width: 48rpx;
    height: 48rpx;
    border-radius: 16rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: 20rpx;
    img {
      width: 40rpx;
      height: 40rpx;
    }
  }
  .title {
    flex: 1;
    font-size: 32rpx;
    text-align: center;
    font-weight: 400;
    color: #191919;
  }
  .more {
    margin-left: 16rpx;
  }
  .search {
    width: 346rpx;
    height: 64rpx;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 37rpx;
    border: 1rpx solid rgba(151, 151, 151, 0.2);
    display: flex;
    flex-shrink: 0;
    align-items: center;
    margin-left: 24rpx;
    img {
      width: 32rpx;
      height: 32rpx;
      padding-left: 16rpx;
    }
    span {
      font-size: 28rpx;
      padding-left: 16rpx;
      color: #999999;
    }
  }
}

.head-search {
  margin-left: 16rpx;
  padding-left: 16rpx;
  display: flex;
  align-items: center;
  height: 64rpx;
  background: #ffffff;
  border-radius: 32rpx;
  width: 464rpx;
  border: 1rpx solid #fe3040;
  transform: rotateZ(360deg);
  .search-img {
    width: 32rpx;
    height: 32rpx;
    flex-shrink: 0;
  }

  .search-text {
    padding-left: 16rpx;
    width: 306px;
    height: 18px;
    font-size: 28rpx;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #6e6e6e;
  }
  .searchinput {
    padding-left: 16rpx;
  }

  .search-icon {
    width: 124rpx;
    height: 56rpx;
    margin: 0 4rpx 0 8rpx;
    text-align: center;
    background: $wsf-linear-bg;
    border-radius: 28rpx;
    line-height: 56rpx;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #ffffff;
  }
}
</style>

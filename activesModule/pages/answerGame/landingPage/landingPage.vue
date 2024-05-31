<template>
  <view class="page-container">
    <!--返回按钮 -->
    <view
      class="back-top"
      :style="{
        top: searchBarTop + 'px',
      }"
    >
      <view class="box-top">
        <view class="icon-left" @click="goBack"
          ><img
            src="https://wsjc-web.wsecar.com/wsf-mall/skuDetail/icon-left.png"
            alt=""
        /></view>
        <view class="icon-left more" @click="goOverlay"
          ><img
            src="https://wsjc-web.wsecar.com/wsf-mall/skuDetail/icon-more.png"
            alt=""
          />
          <view v-if="showOverlay" class="indicator_">
            <view class="img_"
              ><img
                src="https://wsjc-web.wsecar.com/wsf-mall/skuDetail/icon-triangle.png"
                alt=""
            /></view>
            <view class="listTime" @click="goIndex()">
              <img
                src="https://wsjc-web.wsecar.com/wsf-mall/skuDetail/icon-homePage.png"
                alt=""
              />
              <span>首页</span>
            </view>
            <view class="listTime" @click="goCart()">
              <img
                src="https://wsjc-web.wsecar.com/wsf-mall/skuDetail/icon-shoppingTrolley.png"
                alt=""
              />
              <span>购物车</span>
            </view>
            <view class="listTime" @click="goRecord()">
              <img
                src="https://wsjc-web.wsecar.com/wsf-mall/skuDetail/icon-personage.png"
                alt=""
              />
              <span>个人中心</span>
            </view>
          </view>
        </view>
      </view>
    </view>
    <!-- 分享按钮 -->
    <button open-type="share" class="share-box">
      <image
        class="share-image"
        :src="`${mallImg}/activity/women-Day/wx_icon.png`"
      ></image>
    </button>

    <!-- 背景 -->
    <view class="poster-container">
      <image
        class="poster"
        :src="`${mallImg}/activity/women-Day/uniapp_luodiye_beijing.png`"
      />
    </view>
    <!-- 小游戏入口 -->
    <image
      class="game-enter"
      @click="getActivity()"
      :src="`${mallImg}/activity/women-Day/luodiye_youxirukou.gif`"
      alt=""
    />
    <view class="goods-container-panel">
      <goodsPanel type="1" :list="goodsList[1]"></goodsPanel>
      <goodsPanel type="2" :list="goodsList[2]"></goodsPanel>
      <goodsPanel type="3" :list="goodsList[3]"></goodsPanel>
    </view>
  </view>
</template>

<script>
import goodsPanel from "../components/goodsPanel/goodsPanel.vue";
import { goodsList } from "./data.js";
import { qqMap } from "@/common/config.js";

export default {
  name: "landingPage",
  components: {
    goodsPanel,
  },
  data() {
    return {
      hasData: false,
      goodsList: goodsList,
      iStatusBarHeight: 0,
      searchBarTop: 0, //胶囊距顶部
      searchBarHeight: 0, //胶囊高度
      showShare: false,
      mallImg: this.$mallImg,
      enterType: "", //进入落地页的类型share表示从分享进
      areaCode: null, //区域code
      showOverlay: false,
    };
  },
  onLoad(options) {
    this.enterType = options.enterType;
  },
  onShow() {
    let menuButtonInfo = uni.getMenuButtonBoundingClientRect();
    this.searchBarTop = menuButtonInfo.top;
    this.searchBarHeight = menuButtonInfo.height;

    // 2023-02-28 向微信申请定位权限失败-先不调用定位
    // this.getLocation();
  },
  //   分享到朋友圈
  onShareTimeline() {
    return {
      title: "万顺福女神节，最高88元优惠券等你来赢！",
      path: "activesModule/pages/answerGame/landingPage/landingPage?enterType=share",
      imageUrl: `${this.mallImg}/activity/women-Day/share-img200.jpg`,
    };
  },
  //   分享给好友
  onShareAppMessage() {
    return {
      title: "万顺福女神节，最高88元优惠券等你来赢！",
      path: "activesModule/pages/answerGame/landingPage/landingPage?enterType=share",
      imageUrl: `${this.mallImg}/activity/women-Day/share-img54.jpg`,
    };
  },
  methods: {
    //首次进入调用活动参与记录接口
    // async goTo() {
    //   try {
    //     let res = await this.$u.api.gameRecord();
    //     if (res.code === 200) {
    //       this.$wsf.go("answerGame");
    //     }
    //   } catch (error) {
    //     console.log("err:", err);
    //   }
    // },
    getLocation() {
      let that = this;
      uni.getLocation({
        type: "gcj02",
        geocode: true,
        isHighAccuracy: true,
        success: (res) => {
          qqMap.reverseGeocoder({
            location: {
              latitude: res.latitude,
              longitude: res.longitude,
            },
            success: function (res) {
              that.areaCode = res.result.ad_info.adcode;
              console.log(that.areaCode, "====areaCode");
            },
            fail: function (error) {
              console.error(error);
              that.areaCode = null;
            },
          });
        },
        fail(error) {
          that.areaCode = null;
          console.log("定位失败---", error);
        },
      });
    },
    async getActivity() {
      let params = {
        // areaCode: this.areaCode,
        areaCode: ''
      };
      try {
        let res = await this.$u.api.getCouponList(params);
        console.log(res.data, "ss");
        this.activityId = res.data.id ? res.data.id : null;
        if (
          this.activityId &&
          res.data.cardCouponList &&
          res.data.cardCouponList.length > 0
        ) {
          // 有活动并且有卡券，调用gameRecord接口新增用户参与记录
          let res = await this.$u.api.gameRecord();
          if (res.code === 200) {
            //跳转到游戏首页
            this.$wsf.go("answerGame", params);
          }
        } else {
          // 没活动 跳转无活动页
          this.$wsf.go("notActivity");
        }
      } catch (error) {

      }
    },
    goCart() {
      this.$smart.go('SmartCart')
    },
    goRecord() {
      this.$smart.go('SmartUCenter');
    },
    goIndex() {
      this.$smart.go('SmartIndex')
    },
    /* 跳转 */
    navigationTo(sceneName) {
      this.$smart.go(sceneName);
    },
    goOverlay() {
      this.showOverlay = !this.showOverlay;
    },
    openShare() {
      this.showShare = true;
    },
    cancelShare() {
      this.showShare = false;
    },
    goBack() {
      // 分享进来返回商城首页
      if (this.enterType === "share") {
        this.$wsf.go("Index");
      }
      //   返回上一个小程序
      if (getCurrentPages().length === 1) {
        uni.navigateBackMiniProgram();
      } else {
        this.$wsf.go("Index");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.page-container {
  background: #ffd8d7;
  overflow-y: auto;
  .share-box {
    position: fixed;
    bottom: 423rpx;
    right: 0;
    width: 104rpx;
    height: 104rpx;
    background: rgba(255, 255, 255, 0.8);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
    .share-image {
      position: absolute;
      width: 68rpx;
      height: 55rpx;
    }
  }
}
button::after {
  border: none;
}
.poster-container {
  position: relative;
  overflow: hidden;
}
.poster {
  width: 100%;
  height: 620rpx;
  display: block;
  margin: 0;
}

.goods-container-panel {
  margin: 0rpx 11rpx;
}

.game-enter {
  display: block;
  width: 100%;
  height: 220rpx;
  position: relative;
  top: -31rpx;
}
.back-top {
  position: fixed;
  top: 0;
  left: 010;
  z-index: 99;
  display: flex;
  flex-wrap: wrap;
  padding-left: 10px;
  width: 100%;
  height: 32px;
  .topback {
    background: #ffffff;
    width: 100%;
  }
  .box-top {
    display: flex;
    align-items: center;
    width: 100%;
  }
  .icon-left {
    width: 50px;
    height: 32px;
    border-radius: 16px;
    background: #ffffff;
    background: rgba(253, 244, 244, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    margin-right: 16rpx;
    img {
      width: 40rpx;
      height: 40rpx;
    }
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
.indicator_ {
  width: 232rpx;
  box-shadow: 0rpx -6rpx 20rpx 0rpx rgba(189, 194, 204, 0.04),
    0rpx -4rpx 16rpx 0rpx rgba(189, 194, 204, 0.08),
    0rpx -2rpx 12rpx 0rpx rgba(189, 194, 204, 0.06);
  background: #ffffff;
  border-radius: 16rpx;
  padding: 8rpx 24rpx;
  top: 45px;
  left: 50%;
  transform: translate(-50%, 0%);
  position: absolute;
  .img_ {
    position: absolute;
    width: 32rpx;
    height: 16rpx;
    top: -23rpx;
    left: 41%;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .listTime {
    height: 80rpx;
    display: flex;
    align-items: center;
    img {
      width: 40rpx;
      height: 40rpx;
    }
    span {
      font-size: 26rpx;
      color: #444444;
      padding-left: 24rpx;
    }
  }
}
</style>

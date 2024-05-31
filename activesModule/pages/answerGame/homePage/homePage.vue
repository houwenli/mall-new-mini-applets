<template>
  <view class="page-container" :class="isUps ? 'regular' : ''">
    <!-- 返回按钮 -->
    <view
      class="back-but"
      @click="goBack()"
      :style="{
        top: searchBarTop + 'px',
        height: searchBarHeight + 'px',
      }"
    >
      <image
        class="back-img"
        :src="`${mallImg}/activity/women-Day/fanhui_hei.png`"
      ></image>
    </view>
    <image
      class="game-bg"
      :src="`${mallImg}/activity/women-Day/uniapp_shouye_beijing.jpg`"
    />

    <view class="entrance">
      <view class="begin-box">
        <view class="start-button-click" @click="goTo()"></view>
        <!-- 开始游戏按钮 -->
        <image
          class="game-start-button"
          :src="`${mallImg}/activity/women-Day/shouye_kaishiyouxi.png`"
        />
        <!-- 手指 -->
        <image
          class="shouzhi-img"
          :src="`${mallImg}/activity/women-Day/youxishouye_shouzhi.png`"
        />
      </view>

      <view class="fun-button">
        <view class="img-ranking" @click="openPopup('ranking')">
          <image
            :src="`${mallImg}/activity/women-Day/shouye_paihangbang.png`"
          />
          <view class="fun-button-text">排行榜</view>
        </view>
        <view class="img-coupons" @click="openPopup('myCoupon')">
          <image :src="`${mallImg}/activity/women-Day/shouye_youhuiquan.png`" />
          <view class="fun-button-text">优惠券</view>
        </view>
      </view>
    </view>
    <view class="description">
      <view class="activity-explain">
        <view
          class="info-text"
          v-for="(item, index) in activityRuleDescList"
          :key="index"
          >{{ item }}</view
        >
      </view>
      <view class="activity-gift">
        <view class="title">
          <span> 活动礼品 </span>
        </view>
        <view class="gift-info">
          此次活动有折扣券和立减券两种券，每个商品都有对应的优惠券。
        </view>
        <view class="gift-box">
          <view class="gift-text">立减大礼包</view>
          <image
            class="gift-img"
            :src="`${mallImg}/activity/game-giftbox-dynamics.jpg`"
          ></image>
          <view class="gift-text">折扣大礼包</view>
        </view>
      </view>
    </view>
    <myCoupon
      v-if="myCouponShow"
      :show.sync="myCouponShow"
      @startGame="goTo()"
    ></myCoupon>
    <ranking v-if="rankingShow" :show.sync="rankingShow"></ranking>
    <answer-result-popup
      v-if="isNotActivity"
      :show.sync="isNotActivity"
      type="isNotActivity"
    ></answer-result-popup>
  </view>
</template>

<script>
import myCoupon from "../components/myCoupon/myCoupon.vue";
import ranking from "../components/ranking/ranking.vue";
import answerResultPopup from "../components/answerResultPopup/answerResultPopup.vue";
import { qqMap } from "@/common/config.js";
export default {
  components: { myCoupon, ranking, answerResultPopup },
  data() {
    return {
      activityId: null,
      isNotActivity: false, //是否没有活动
      activityRuleDescList: [], //活动说明
      id: null,
      latitude: null, //纬度
      longitude: null, //经度
      areaCode: null, //区域code
      myCouponShow: false, //我的优惠券
      rankingShow: false, //排行榜
      searchBarTop: 0,
      searchBarHeight: 0,
      timer: null,
      mallImg: this.$mallImg,
    };
  },
  computed: {
    isUps() {
      return this.isNotActivity || this.myCouponShow || this.rankingShow;
    },
  },
  onLoad(opstion) {
    this.areaCode = opstion.areaCode;
    // this.getLocation();
    this.addRecord();
  },
  onShow() {
    if (uni.getStorageSync("type") === "openMyCoupon") {
      // 答题成功后查看我的优惠券
      this.openPopup("myCoupon");
      uni.removeStorageSync("type");
    }
    this.getActivity();
    // if (uni.getStorageSync("type") === "isNotActivity") {
    //   // 答题成功后再玩一次，没有活动的情况下走进来
    //   this.isNotActivity = true;
    // }
    // 获取胶囊高度和距离手机顶部
    let menuButtonInfo = uni.getMenuButtonBoundingClientRect();
    this.searchBarTop = menuButtonInfo.top;
    this.searchBarHeight = menuButtonInfo.height;
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
    // 第一次添加活动记录
    async addRecord() {
      let params = {
        claimNum: 0,
        nodeType: 1,
      };
      try {
        let res = await this.$u.api.addRecord(params);
        if (res.code === 200) {
          //  需要拿到data作为后两次次接口的id
          this.id = res.data;
        }
      } catch (error) {
        console.log("err:", err);
      }
    },
    async getActivity() {
      let params = {
        areaCode: this.areaCode,
      };
      try {
        let res = await this.$u.api.getCouponList(params);
        this.activityRuleDescList = res.data.activityRuleDescList || [];
        this.activityId = res.data.id ? res.data.id : null;
        // 没有活动或者没有卡券跳转到没有活动页面
        if (
          !this.activityId ||
          (res.data.cardCouponList && res.data.cardCouponList.length < 0)
        ) {
          this.$wsf.go("notActivity");
        }
      } catch (error) {}
    },
    // 打开弹窗
    openPopup(value) {
      if (value === "ranking") {
        this.rankingShow = true;
      } else {
        this.myCouponShow = true;
      }
    },
    goBack() {
      this.$wsf.go("Index");
    },
    async goTo() {
      let params = {
        activityId: this.activityId,
      };
      try {
        let res = await this.$u.api.getCouponList(params);
        if (
          res.data.cardCouponList !== null &&
          res.data.cardCouponList.length !== 0
        ) {
          let paramsRecord = {
            claimNum: 0,
            id: this.id,
            nodeType: 2,
          };
          await this.$u.api.addRecord(paramsRecord);
          this.$wsf.go("answer", { activityId: this.activityId, id: this.id });
        } else {
          this.$wsf.go("notActivity");
        }
      } catch (e) {}
    },
  },
};
</script>

<style lang="scss" scoped>
.regular {
  position: fixed !important;
  top: 0;
  left: 0;
}
.page-container {
  background: linear-gradient(90deg, #481d03 0%, #130600 100%);
  display: flex;
  flex-direction: column;
  min-height: 1624rpx;
  position: relative;
  .back-but {
    width: 50px;
    border-radius: 16px;
    background: #ffffff;
    background: rgba(253, 244, 244, 0.8);
    position: fixed;
    left: 10px;
    z-index: 10;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    .back-img {
      width: 11px;
      height: 20px;
      margin-right: 3px;
    }
  }
  .game-bg {
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 0;
  }
  .entrance {
    min-height: 933rpx;
    display: flex;
    flex-direction: column-reverse;
    justify-content: space-between;
    position: relative;
    .headline {
      width: 60%;
      position: absolute;
      left: 20rpx;
      top: 20rpx;
      right: 0;
      margin: 0 auto;
      .text-box {
        width: 60%;
      }

      image {
        width: 100%;
      }
    }
    .fun-button {
      position: absolute;
      z-index: 21;
      bottom: 152rpx;
      right: 10rpx;
      .img-ranking {
        image {
          width: 91rpx;
          height: 92rpx;
          display: block;
        }
        margin-bottom: 32rpx;
      }
      .img-coupons {
        image {
          width: 91rpx;
          height: 92rpx;
          display: block;
        }
      }
      .fun-button-text {
        font-size: 24rpx;
        font-family: Source Han Sans CN;
        font-weight: bold;
        color: #ffffff;
        text-shadow: 0rpx 1rpx 7rpx #000000;
        text-align: center;
      }
    }

    .begin-box {
      position: relative;
      margin: 0rpx auto;
      .start-button-click {
        position: absolute;
        background: none;
        width: 440rpx;
        height: 130rpx;
        border-radius: 64rpx;
        z-index: 200;
        top: 50%;
        -webkit-transform: translate(0, -50%);
        transform: translate(0, -50%);
      }
      @keyframes fadenum {
        0% {
          transform: scale(1);
        }
        25% {
          transform: scale(0.8);
        }
        50% {
          transform: scale(1);
        }
        75% {
          transform: scale(0.8);
        }
      }
      @keyframes shouzhiButton {
        0% {
          transform: translateY(0px) scale(1);
        }
        25% {
          transform: translateY(20px) scale(0.7);
        }
        50% {
          transform: translateY(0px) scale(1);
        }
        75% {
          transform: translateY(20px) scale(0.7);
        }
      }
      .game-start-button {
        width: 450rpx;
        height: 139rpx;
        margin: auto;
        z-index: 100;
        animation: fadenum 10s ease-in-out infinite;
        -webkit-animation: fadenum 10s ease-in-out infinite;
      }

      .shouzhi-img {
        position: absolute;
        width: 129rpx;
        height: 126rpx;
        bottom: -36rpx;
        right: -20rpx;
        z-index: 15;
        animation: shouzhiButton 10s ease-in-out infinite;
        -webkit-animation: shouzhiButton 10s ease-in-out infinite;
      }
    }
  }
  .description {
    flex: 1;
    margin-top: 124rpx;
    padding: 0rpx 54rpx 78rpx 54rpx;
    background-image: url("https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/women-Day/shouye_huodongshuoming.png");
    background-size: 100% 100%;
    border-radius: 20rpx;
    margin: 18rpx;
    z-index: 10;
    .activity-explain {
      margin-top: 94rpx;
      min-height: 170rpx;
      .title {
        display: flex;
        align-items: center;
        justify-content: center;
        image {
          width: 80rpx;
          height: 26rpx;
        }
      }

      .info-text {
        display: flex;
        align-items: center;
        flex-direction: row;
        font-size: 24rpx;
        line-height: 32rpx;
        font-family: Source Han Sans CN;
        font-weight: 300;
        color: #000000;
        word-break: break-all; //数字换行
        &:before {
          content: "";
          margin-right: 20rpx;
          display: inline;
          min-width: 8rpx;
          min-height: 8rpx;
          border-radius: 100%;
          background: #fe6dae;
        }
      }
    }
  }
  .activity-gift {
    .title {
      font-size: 36rpx;
      font-weight: 700;
      color: #ff3c97;
      text-align: center;
      margin: 30rpx 0rpx 10rpx 0rpx;
      position: relative;
      & span:before,
      & span:after {
        content: "";
        position: absolute;
        top: 50%;
        width: 616rpx;
        background: linear-gradient(56deg, #fe72b1 0%, #fefaf9 100%);
        opacity: 0.33;
        width: 30%;
        height: 2rpx;
      }
      & span:before {
        left: 7%;
        background: linear-gradient(270deg, #fe72b1 0%, #fefaf9 100%);
      }
      & span:after {
        right: 7%;
        background: linear-gradient(90deg, #fe72b1 0%, #fefaf9 100%);
      }
    }
    .gift-info {
      margin-bottom: 31rpx;
      font-size: 24rpx;
      font-family: Source Han Sans CN;
      font-weight: 300;
      color: #000000;
      line-height: 32rpx;
    }
    .gift-box {
      background: #ffdcec;
      border-radius: 44rpx;
      padding: 6rpx;
      height: 86rpx;
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: relative;
      .gift-img {
        width: 194rpx;
        height: 170rpx;
        position: absolute;
        bottom: -30rpx;
        left: 50%;
        -webkit-transform: translate(-50%, 0%);
        transform: translate(-50%, 0%);
      }

      .gift-text {
        font-weight: bold;
        color: #ffffff;
        width: 185rpx;
        height: 78rpx;
        background: linear-gradient(90deg, #f94998 0%, #f9a849 100%);
        border-radius: 38rpx;
        text-align: center;
        line-height: 72rpx;
        font-size: 24rpx;
      }
    }
  }
}
</style>

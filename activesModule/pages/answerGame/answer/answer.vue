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
    <!-- 答题内容背景图 -->
    <view class="content">
      <view class="step-number">
        第{{ `${current}/${questionList.length}` }}题
      </view>
      <view class="question-content">
        <image
          class="question-type-icon"
          :src="`${mallImg}/activity/women-Day/danxuanti.png`"
        ></image>
        <view class="error-tip" v-if="isShowErrorTip">请选择1个答案</view>
        <view class="question-title">
          {{
            questionList && questionList.length > 0
              ? questionList[current - 1].itemContent
              : ""
          }}
        </view>
        <view
          class="question-option"
          v-if="questionList && questionList.length > 0"
        >
          <view
            v-for="(item, index) in optionList"
            @click="selectAnswer(item.answerNo)"
            :key="index"
            class="question-option-item"
            :class="{ 'is-select': myAnswer === item.answerNo }"
          >
            <view class="letter">{{ item.answerNo }}</view>
            <view class="question-text">{{ item.content }}</view>
          </view>
        </view>
      </view>
    </view>

    <view
      v-if="current !== questionList.length"
      class="submit-btn"
      @click="nextQuestion()"
      >下一关</view
    >
    <view v-else class="submit-btn" @click="subemit()">提交</view>
    <select-coupon
      v-if="selectCouponShow"
      :show.sync="selectCouponShow"
      :listData="couponList"
      :options="options"
      @isShowReceiveResult="isShowReceiveResult"
      @openMyCoupon="openMyCoupon"
    ></select-coupon>
    <answer-result-popup
      v-if="resultShow"
      :show.sync="resultShow"
      :type="answerResult"
      @closePopup="closePopup"
    ></answer-result-popup>
    <receiveResult
      v-if="receivShow"
      :receivType="receivType"
      :successCoupon="successCoupon"
    ></receiveResult>
  </view>
</template>

<script>
import answerResultPopup from "../components/answerResultPopup/answerResultPopup.vue";
import selectCoupon from "../components/selectCoupon/selectCoupon.vue";
import receiveResult from "../components/receiveResult/receiveResult.vue";
export default {
  components: {
    answerResultPopup,
    selectCoupon,
    receiveResult,
  },
  data() {
    return {
      timer: null,
      current: 1,
      options: {},
      myAnswer: null, //我的回答
      couponList: [], //闯关成功后查询到可领取的优惠券
      successCoupon: {}, //领取成功的卡券
      questionList: [],
      optionList: [], //选项
      answerResult: null, //答题结果
      resultShow: false, //回答结果弹窗
      selectCouponShow: false, //领取优惠券弹窗
      receivShow: false, //领券结果弹窗
      receivType: "receivedSuccessfully", //领券结果
      searchBarTop: 0,
      searchBarHeight: 0,
      isShowErrorTip: false,
      mallImg: this.$mallImg,
    };
  },

  onLoad(options) {
    this.options = options;
  },
  onShow() {
    let menuButtonInfo = uni.getMenuButtonBoundingClientRect();
    this.searchBarTop = menuButtonInfo.top;
    this.searchBarHeight = menuButtonInfo.height;
    this.getQuestions();
  },
  computed: {
    isUps() {
      return this.receivShow || this.resultShow;
    },
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
    async getQuestions() {
      try {
        await this.$u.api
          .getQuestionsList({ questionNum: 3, itemType: 1 })
          .then((res) => {
            if (res.code == 200) {
              this.questionList = res.data;
              this.optionList = this.questionList[this.current - 1].answerList;
            }
          });
      } catch (error) {}
    },
    async subemit() {
      if (!this.myAnswer) {
        this.isShowErrorTip = true;
        this.timer = setTimeout(() => {
          this.isShowErrorTip = false;
        }, 1000);
        return;
      }
      if (this.questionList[this.current - 1].answer === this.myAnswer) {
        let params = {
          activityId: this.options.activityId,
        };
        try {
          let res = await this.$u.api.getCouponList(params);
          if (
            res.data.cardCouponList !== null &&
            res.data.cardCouponList.length !== 0
          ) {
            this.couponList = res.data.cardCouponList;
            this.couponList.forEach((item) => {
              // 初始都为高亮，不显示遮罩
              item.isMask = false;
            });
            // 有优惠券
            this.receivType = "receivedSuccessfully";
            this.selectCouponShow = true;
          } else {
            // 没有优惠券提示
            this.receivType = "receivedFail";
            this.receivShow = true;
          }
        } catch (error) {
          console.log("err:", err);
        }
      } else {
        this.answerResult = "fail";
        this.resultShow = true;
      }
    },
    isShowReceiveResult(type, itemCoupon) {
      this.selectCouponShow = false;
      this.successCoupon = itemCoupon;
      this.receivType = type;
      this.receivShow = true;
    },
    closePopup() {
      if (this.answerResult === "success") {
        this.current = this.current + 1;
        this.myAnswer = null;
        this.optionList = this.questionList[this.current - 1].answerList;
      }
    },
    goBack() {
      uni.navigateBack({
        delta: 1,
      });
    },
    nextQuestion() {
      console.log(this.myAnswer);
      if (!this.myAnswer) {
        this.isShowErrorTip = true;
        this.timer = setTimeout(() => {
          this.isShowErrorTip = false;
        }, 1000);
        return;
      }
      if (this.questionList[this.current - 1].answer === this.myAnswer) {
        this.answerResult = "success";
      } else {
        this.answerResult = "fail";
      }
      this.resultShow = true;
    },
    selectAnswer(value) {
      this.myAnswer = value;
    },
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  },
};
</script>

<style scoped lang="scss">
.regular {
  position: fixed !important;
  top: 0;
  left: 0;
}
.page-container {
  overflow: auto;
  background: #f5ebe4;
  background-image: url("https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/women-Day/dati-bg.png");
  background-size: 100% 100%;
  height: 1624rpx;
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
  .content {
    background-image: url("https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/women-Day/dati_shuben.png");
    background-size: 100% 100%;
    width: 100%;
    height: 1096rpx;
    margin-top: 184rpx;
    position: relative;
    padding: 130rpx 102rpx 100rpx 84rpx;
    .question-content {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .question-type-icon {
      width: 159rpx;
      height: 60rpx;
      margin-bottom: 66rpx;
    }
    .error-tip {
      font-size: 12px;
      font-family: Source Han Sans CN;
      font-weight: 400;
      color: #af5333;
      background: #e4d2bc;
      width: 110px;
      margin: 0 auto;
      padding: 8rpx 16rpx;
      border-radius: 11px;
      position: absolute;
      text-align: center;
      top: 207rpx;
      left: 50%;
      transform: translate(-50%, 0%);
    }
    .question-title {
      font-size: 42rpx;
      font-family: Source Han Sans CN;
      font-weight: bold;
      color: #74543e;
      text-align: center;
      height: 279rpx;
    }
    .question-option {
      width: 560rpx;
      height: 435rpx;
      border-radius: 14rpx;
      padding: 20rpx 20rpx 0rpx 20rpx;
      .question-option-item {
        width: 519rpx;
        height: 84rpx;
        background: #fef2e2;
        border-radius: 20rpx;
        font-size: 26rpx;
        font-family: Source Han Sans CN;
        font-weight: 400;
        color: #b96345;
        margin-bottom: 20rpx;
        line-height: 84rpx;
        padding-left: 30rpx;
        display: flex;
        overflow: hidden;
        .letter {
          font-size: 42rpx;
          font-family: Source Han Sans CN;
          font-weight: bold;
          color: #b55b3c;
          margin-right: 23rpx;
        }
      }
      .is-select {
        color: #ffffff;
        font-weight: bold;
        background: #fa6ead;
        .letter {
          color: #ffffff;
          -webkit-text-stroke: 3rpx #cf3b8b;
        }
      }
    }
  }
  .step-number {
    position: absolute;
    top: 10rpx;
    right: 100rpx;
    width: 200rpx;
    font-size: 44rpx;
    text-align: center;
    font-family: Source Han Sans CN;
    font-weight: bold;
    color: #ffffff;
    text-shadow: 0rpx 2rpx 2rpx rgba(0, 0, 0, 0.34);
  }
  .submit-btn {
    background-image: url("https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/women-Day/dati_xiayiti.png");
    background-size: 100% 100%;
    height: 172rpx;
    line-height: 187rpx;
    width: 477rpx;
    margin: auto;
    margin-top: 43rpx;
    text-align: center;
    font-size: 50rpx;
    font-family: Source Han Sans CN;
    font-weight: bold;
    color: #ffffff;
    text-shadow: 0rpx 2rpx 2rpx #000000;
  }
}
</style>

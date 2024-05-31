<template>
  <view>
    <view class="popup-container">
      <view class="main-container">
        <!-- 关闭图标 -->
        <image
          @click="close()"
          class="close-img"
          :src="`${mallImg}/activity/women-Day/paihangbang_guanbi.png`"
        ></image>
        <image
          class="bg-top"
          :src="`${mallImg}/activity/women-Day/paihangbang_top.png`"
        ></image>
        <view class="content-outer">
          <view class="content-centre">
            <view class="content-inner">
              <!-- 我的排名 -->
              <view class="my-info" v-if="Object.keys(myRanking).length > 0">
                <view class="rank-box">
                  <view class="rank-number">
                    {{
                      maxNumber(myRanking.currentRanking)
                        ? maxNumber(myRanking.currentRanking)
                        : "无"
                    }}
                  </view>
                </view>

                <!-- 我的头像 -->
                <view class="head-box">
                  <image
                    class="head-pic"
                    :src="`${mallImg}/activity/women-Day/touxiang.png`"
                  ></image>
                </view>

                <!-- 我的卡券 -->
                <view class="coupon-box my-coupon">
                  <image
                    class="coupon-icon"
                    :src="`${mallImg}/activity/game-coupons-icon.png`"
                  ></image>
                  <view class="coupon-count"
                    >{{ maxNumber(myRanking.couponNum) }}张</view
                  >
                </view>

                <!-- 我的名字 -->
                <view class="name-box my-name">{{ myRanking.userName }}</view>
                <!-- 我的点赞 -->
                <view class="thumb">
                  <image
                    @click="thumbsUp()"
                    :class="
                      myRanking.isThumb ? 'thumb-move thumb-img' : 'thumb-img'
                    "
                    :src="
                      myRanking.beCurrentUserLiked === 0
                        ? `${mallImg}/activity/women-Day/dianzan_hui.png`
                        : `${mallImg}/activity/women-Day/dianzan.png`
                    "
                  ></image>
                  <view
                    class="thumb-count"
                    :style="{
                      color: myRanking.beCurrentUserLiked
                        ? '#FF4F9F'
                        : '#C5C5C5',
                    }"
                  >
                    {{ maxNumber(myRanking.likeNum) }}
                  </view>
                </view>
              </view>
              <!-- 所有排名 -->
              <scroll-view :scroll-y="true" class="all-ranking-box">
                <view class="ranking">
                  <view
                    class="raking-item"
                    v-for="(item, index) in rankingList"
                    :key="index"
                  >
                    <!-- 名次 -->
                    <view class="rank-box">
                      <image
                        class="rank-icon"
                        v-if="index < 3"
                        :src="geTrankIcon(index)"
                      ></image>
                      <view v-else class="rank-number">{{
                        item.currentRanking
                      }}</view>
                    </view>

                    <!-- 头像 -->
                    <view class="head-box">
                      <image
                        v-if="index === 0"
                        class="head-icon"
                        :src="`${mallImg}/activity/game-crown.png`"
                      ></image>
                      <image
                        class="head-pic"
                        :src="`${mallImg}/activity/women-Day/touxiang.png`"
                      ></image>
                    </view>
                    <!-- 卡券 -->
                    <view class="coupon-box coupon">
                      <image
                        class="coupon-icon"
                        :src="`${mallImg}/activity/game-coupons-icon.png`"
                      ></image>
                      <view class="coupon-count"
                        >{{ maxNumber(item.couponNum) }}张</view
                      >
                    </view>

                    <!-- 名字 -->

                    <view class="name-box name" data-content="item.userName">{{
                      item.userName
                    }}</view>
                    <!-- 点赞 -->
                    <view class="thumb">
                      <image
                        :src="
                          item.beCurrentUserLiked === 0
                            ? `${mallImg}/activity/women-Day/dianzan_hui.png`
                            : `${mallImg}/activity/women-Day/dianzan.png`
                        "
                        @click="thumbsUp(item)"
                        :class="
                          item.isThumb ? 'thumb-move thumb-img' : 'thumb-img'
                        "
                      ></image>
                      <view
                        class="thumb-count"
                        :style="{
                          color: item.beCurrentUserLiked
                            ? '#FF4F9F'
                            : '#C5C5C5',
                        }"
                      >
                        {{ maxNumber(item.likeNum) }}
                      </view>
                    </view>
                  </view>
                </view>
              </scroll-view>
            </view>
            <view class="remarks"> *只展示排名前20用户 </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  components: {},
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      myRanking: {}, //当前用户
      numberOne: {}, //榜一用户
      rankingList: [],
      mallImg: this.$mallImg,
    };
  },
  created() {
    this.getRanking();
  },
  computed: {
    maxNumber() {
      return function (number) {
        if (!number) {
          return 0;
        }
        if (Number(number) > 999) {
          return "999+";
        } else {
          return number;
        }
      };
    },
  },
  methods: {
    // 获取前三名图标
    geTrankIcon(index) {
      console.log(index);
      if (index === 0)
        return `${this.mallImg}/activity/game-goldmedal-icon.png`;
      if (index === 1)
        return `${this.mallImg}/activity/game-silvermedal-icon.png`;
      if (index === 2)
        return `${this.mallImg}/activity/game-bronze-medal-icon.png`;
      return "";
    },
    thumbsUp(item) {
      let params = {
        customerId: item ? item.customerId : this.myRanking.customerId,
      };
      let beCurrentUserLiked = item
        ? item.beCurrentUserLiked
        : this.myRanking.beCurrentUserLiked;
      beCurrentUserLiked === 0
        ? this.$u.api.giveALike(params).then((res) => {
            // 点赞
            if (res.code === 200) {
              if (item) {
                // 排行榜区点赞
                if (item.customerId === this.myRanking.customerId) {
                  this.myRanking.likeNum++;
                  this.myRanking.beCurrentUserLiked = 1;
                }
                item.beCurrentUserLiked = 1;
                //isThumb为true执行一下动画
                item.isThumb = true;
                item.likeNum++;
              } else {
                // 自己区域点赞
                this.myRanking.likeNum++;
                this.myRanking.isThumb = true;
                this.myRanking.beCurrentUserLiked = 1;
                // 在自己信息处给自己点赞排名区需要同步
                this.rankingList.forEach((people) => {
                  if (people.customerId === this.myRanking.customerId) {
                    people.likeNum++;
                    people.beCurrentUserLiked = 1;
                  }
                });
              }
            }
          })
        : this.$u.api.cancelLike(params).then((res) => {
            // 取消点赞
            if (res.code === 200) {
              if (item) {
                // 排行榜区取消点赞
                console.log("这里22");
                if (item.customerId === this.myRanking.customerId) {
                  this.myRanking.likeNum--;
                  this.myRanking.beCurrentUserLiked = 0;
                }
                item.isThumb = false;
                item.beCurrentUserLiked = 0;
                item.likeNum--;
              } else {
                // 自己区域取消点赞
                console.log("这里11");
                this.rankingList.forEach((people) => {
                  if (people.customerId === this.myRanking.customerId) {
                    people.likeNum--;
                    people.beCurrentUserLiked = 0;
                  }
                });
                this.myRanking.isThumb = false;
                this.myRanking.beCurrentUserLiked = 0;
                this.myRanking.likeNum--;
              }
            }
          });
    },
    getRanking() {
      this.$u.api.rankedList().then((res) => {
        console.log(res.data, "排行榜");
        if (res.code === 200) {
          this.rankingList = res.data.bargainUserDetailTopTwentyVOS;
          this.rankingList.forEach((item) => {
            // 给每一项设置无点赞动效样式
            item.isThumb = false;
          });
          this.numberOne = res.data.bargainUserDetailTopTwentyVOS[0];
          this.myRanking = this.$u.deepClone(res.data);
        }
      });
    },
    open() {},
    close() {
      this.$emit("update:show", false);
    },
  },
};
</script>

<style lang="scss" scoped>
.popup-container {
  width: 100%;
  height: 100vh;
  padding: 112rpx 27rpx 134rpx 27rpx;
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.8) !important;
  z-index: 100;
  .main-container {
    margin: auto;
    width: 100%;
    height: 100%;
    background-position-x: center;
    box-sizing: border-box;
    position: relative;
    display: flex;
    flex-direction: column;
  }
  .bg-top {
    width: 696rpx;
    height: 290rpx;
    position: absolute;
    top: 0rpx;
    left: 49.8%;
    transform: translate(-50%, 0%);
  }
  .content-outer {
    width: 696rpx;
    height: 100%;
    background: #fba5cc;
    border-radius: 30rpx;
    margin-top: 80rpx;
    padding: 20rpx 10rpx;
  }
  .content-centre {
    width: 676rpx;
    height: 100%;
    background: #e23e87;
    border-radius: 30rpx;
    padding: 26rpx 0rpx 57rpx 0rpx;
  }
  .content-inner {
    height: 100%;
    width: 676rpx;
    background: #f7f3f7;
    box-shadow: 0rpx 6rpx 3rpx 0rpx rgba(0, 0, 0, 0.16);
    border-radius: 30rpx;
    display: flex;
    flex-direction: column;
  }

  .my-info {
    width: 100%;
    height: 142rpx;
    display: flex;
    flex-direction: row;
    align-items: center;
    position: relative;
    z-index: 200;
    .my-coupon {
      background: #fd6336;
      color: #ffffff;
    }
    .my-name {
      background: #aa8dfc;
      color: #ffffff;
    }
  }
  .all-ranking-box {
    width: 676rpx;
    flex: 1;
    padding-bottom: 4rpx;
    overflow: scroll;

    .ranking {
      width: 676rpx;
      .raking-item {
        position: relative;
        display: flex;
        flex-direction: row;

        padding: 10rpx 0rpx;
        align-items: center;
        .name {
          background: #b795db;
        }
        .coupon {
          background: #e39293;
        }
        &:after {
          position: absolute;
          bottom: 0rpx;
          content: "";
          display: block;
          width: 100%;
          height: 0rpx;
          border-bottom: 2px dashed #ffd0e5;
          border-bottom-width: 2px;
          border-bottom-style: dashed;
          border-bottom-color: rgb(255, 208, 229);
          position: absolute;
          left: 50%;
          transform: translate(-50%, 0%);
          width: 95%;
        }
      }
    }
  }
  .rank-box {
    width: 80rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 18rpx;
    .rank-number {
      font-size: 36rpx;
      font-family: Arial;
      font-weight: bold;
      font-style: italic;
      color: #ff3d98;
    }
    .rank-icon {
      width: 46rpx;
      height: 55rpx;
    }
  }
  .remarks {
    font-size: 24rpx;
    font-family: Source Han Sans CN;
    font-weight: 400;
    color: #ffffff;
    text-align: center;
    height: 57rpx;
    line-height: 57rpx;
  }

  .noun {
    font-size: 36rpx;
    font-family: Arial;
    font-weight: bold;
    font-style: italic;
    color: #ff3d98;
  }
  .name-box {
    width: 187rpx;
    height: 53rpx;
    line-height: 53rpx;
    background: #b795db;
    border-radius: 27rpx;
    font-size: 24rpx;
    font-family: Source Han Sans CN;
    font-weight: bold;
    color: #fefefe;
    text-align: center;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    padding: 0rpx 10rpx;
    display: inline-block;
    margin-right: 16rpx;
  }
  .head-box {
    height: 84rpx;
    width: 84rpx;
    margin-right: 12rpx;
    position: relative;
    .head-icon {
      width: 45rpx;
      height: 42rpx;
      position: absolute;
      top: -18rpx;
      left: -11rpx;
    }
    .head-pic {
      width: 100%;
      height: 100%;
    }
  }
  .coupon-box {
    width: 156rpx;
    height: 53rpx;
    border-radius: 27rpx;
    display: flex;
    font-size: 24rpx;
    font-family: Source Han Sans CN;
    font-weight: 500;
    margin-right: 7rpx;
    text-align: center;
    line-height: 53rpx;
    align-items: center;
    padding-left: 2rpx;
    justify-content: center;
    .coupon-icon {
      width: 42rpx;
      height: 39rpx;
      margin-right: 9rpx;
    }
    .coupon-count {
      font-size: 24rpx;
      font-family: Source Han Sans CN;
      font-weight: 500;
      color: #ffffff;
      height: 100%;
    }
  }
  .thumb-move {
    animation: fadenum 1s ease-in-out infinite;
    -webkit-animation: fadenum 1s ease-in-out 1;

    @keyframes fadenum {
      0% {
        transform: scale(1) rotate(0deg);
      }
      50% {
        transform: scale(1.3) rotate(-30deg);
      }
      100% {
        transform: scale(1) rotate(0deg);
      }
    }
  }
  .close-img {
    width: 69rpx;
    height: 69rpx;
    position: absolute;
    top: 45rpx;
    right: -15rpx;
    z-index: 10;
  }
  .thumb {
    display: flex;
    align-items: center;
    .thumb-img {
      width: 34rpx;
      height: 36rpx;
      margin-right: 9rpx;
    }
    .thumb-count {
      font-size: 28rpx;
      font-family: Source Han Sans CN;
      font-weight: 500;
      color: #c5c5c5;
      vertical-align: text-bottom;
    }
  }
}
</style>

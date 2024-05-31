<template>
  <view class="page safe-area-inset-bottom">
    <view class="record-container" v-if="list && list.length">
      <view class="record" v-for="(item, index) in list" :key="index">
        <view class="left">
          <!-- <view class="detail">{{ statusDice[item.streamStatus] }}</view> -->
          <view class="detail">{{ item.streamStatusValue }}</view>
          <view class="date">{{ item.createTime }}</view>
        </view>
        <view
          :class="{ up: item.addFlag == 1, down: item.addFlag == 2, right }"
        >
          {{ item.addFlag == 1 ? "+" : "-" }}
          {{ Math.abs(item.fqzPoint / 100).toFixed(2) }}
        </view>
      </view>
      <u-loadmore margin-top="20" ref="backTop" :loadText="loadText" :status="loadStatus"></u-loadmore>
    </view>
    <view class="empty-page" v-else>
      <image class="empty-image" :src="emptyImg"></image>
      <text class="empty-text">当前暂无流水～</text>
    </view>
    <view class="bottom-column safe-area-inset-bottom">
      <view class="bottom-box">
        <view class="left">
          当前余额：<text class="yuan">￥</text
          ><text class="balance">{{ balance }}</text>
        </view>
        <view class="right-button" @tap="goIndex()">马上购物</view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  components: {},
  props: {},
  data() {
    return {
      balance: 0,
      statusDice: {
        1: "奖励（推荐购买包干）",
        2: "消费",
        3: "退回",
        4: "取消订单",
        5: "年终专项奖",
      },
      list: [],
      hasMore: true, // 是否还有更多
      isLoading: false, // 正在加载
      queryForm: {
        pageNum: 0,
        pageSize: 20,
      },
      loadText: {
				loadmore: '上拉加载更多',
				loading: '努力加载中',
				nomore: '我也是有底线的~'
			},
      loadStatus: 'loadmore',
      emptyImg:
        "https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/uat/9eb269647096f980b4aaa194d89d6b67.png",
      };
  },
  onShow() {
    this.getUserInfo();
    this.getList();
  },
  onPullDownRefresh() {
    this.reset();
  },
  onReachBottom() {
    this.getList();
  },
  methods: {
    /* 获取用户信息 */
    getUserInfo() {
      this.$u.api.CustomerDetail().then((res) => {
        if (res.code === 200) {
          this.balance = (res.data.fqzPoint / 100).toFixed(2);
        }
      });
    },
    reset() {
      this.hasMore = true;
      this.isLoading = false;
      this.queryForm = {
        pageNum: 0,
        pageSize: 20,
      };
      this.list = [];
      this.getList();
    },
    getList() {
      if (this.isLoading || !this.hasMore) return;
      this.isLoading = true;
      this.loadStatus = 'loading';
      this.$u.api.GetFqzStreamApplets(this.queryForm).then((res) => {
        this.isLoading = false;
        this.loadStatus = 'loadmore';
        if (res.code === 200) {
          this.list = this.list.concat(res.data.data);
          this.queryForm.pageNum++;
          this.hasMore = res.data.data.length === this.queryForm.pageSize;
          this.loadStatus = res.data.data.length === this.queryForm.pageSize ? 'loadmore' : 'nomore';
        }
      });
    },
    goIndex() {
      this.$wsf.go("Index");
    },
  },
};
</script>

<style scoped lang="scss">
.page {
  height: 100vh;
  position: relative;
  background-color: #fff;
  .record-container {
    background-color: #fff;
    padding-bottom: 180rpx;
    .record {
      height: 118rpx;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 0 36rpx;
      border-bottom: 1rpx solid #f2f2f2;
      .left {
        width: 490rpx;
        .detail {
          font-size: 28rpx;
          color: #000;
          line-height: 40rpx;
          padding-bottom: 4rpx;
        }
        .date {
          font-size: 24rpx;
          color: #999;
          line-height: 34rpx;
        }
      }
      .right {
        font-size: 32rpx;
        font-weight: 500;
      }
      .up {
        color: #e60113;
      }
      .down {
        color: #666666;
      }
    }
  }
  .empty-page {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 40%;
    .empty-image {
      width: 360rpx;
      height: 360rpx;
    }
    .empty-text {
      font-weight: 500;
      font-size: 36rpx;
      color: #999;
      margin-top: 20rpx;
      line-height: 54rpx;
    }
  }
  .bottom-column {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background: #fff;
    z-index: 99;
    .bottom-box {
      padding: 0 36rpx;
      height: 100rpx;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-top: 1rpx solid #f2f2f2;
      .left {
        font-size: 32rpx;
        color: #000;
        .yuan {
          font-size: 24rpx;
          color: #e60113;
        }
        .balance {
          font-size: 36rpx;
          color: #e60113;
        }
      }
      .right-button {
        width: 216rpx;
        height: 76rpx;
        background: #e60113;
        border-radius: 38rpx;
        text-align: center;
        line-height: 76rpx;
        color: #fff;
        font-size: 28rpx;
      }
    }
  }
}
</style>

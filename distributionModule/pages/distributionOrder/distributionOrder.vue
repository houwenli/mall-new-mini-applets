<template>
    <view class="order-container">
    <image v-if="showReturnTop" class="back-top" :src="ossUrl + 'wsf-mall/distribution/back_top.png'" @tap="backTop()" />
    <view class="commission-card">
      <view class="commission-column">
        <view class="column">
          <view class="title">已结算佣金</view>
          <view class="amount">
            {{userCommission.allIncomeCommission ? (userCommission.allIncomeCommission / 100).toFixed(2): "0.00"}}
          </view>
        </view>

        <button class="withdraw-button" @tap="navigateMiniProgram()">
          <!-- <image :src="ossUrl + 'wsf-mall/distribution/ic_right.png'" /> -->
          提现
        </button>
        
      </view>

      <view class="commission-button-box" @tap.stop="toRule()">
        规则说明
        <!-- <view class="withdraw-rules" @tap="toRule()">
          规则说明
          <image :src="ossUrl + 'wsf-mall/distribution/ic_help.png'" />
        </view> -->
      </view>
      <view class="surplus">
          <view class="title">待结算佣金</view>
          <view class="amount">
            <text class="yuan">¥</text>
            {{userCommission.toBeSettledCommission ? (userCommission.toBeSettledCommission / 100).toFixed(2): "0.00"}}
          </view>
        </view>
    </view>
    <view class="order-list" v-if="orderList && orderList.length">
      <template>
        <block v-for="(item, index) in orderList" :key='index'>
          <view class="order" :key="index" @tap="toDetail(item)">
            <view class="order-title">
              <view class="order-type">
                <image class="order-type-icon" :src="bizLineImage[item.bizLine]"></image>
                <text class="order-type-text">{{ bizLineText[item.bizLine] }}</text>
              </view>
              <view :style="{ color: orderStatusColor[item.orderStatus] }">{{ showStatusDict[item.orderStatus] }}</view
              >
            </view>

            <view class="order-info">
              <view class="info-row">
                <view class="row-label">订单号码</view>
                <view class="row-content">{{ item.orderId }}</view>
              </view>
              <view class="info-row">
                <view class="row-label">订单金额</view>
                <view class="row-content">¥{{ item.orderAmount | fenToYuan }}</view>
              </view>
              <view class="info-row">
                <view class="row-label">实付金额</view>
                <view class="row-content">¥{{ item.payAmount | fenToYuan }}</view>
              </view>
            </view>

            <view class="order-commission">
              <text>预估佣金</text>
              <view class="commission-price">
                <text class="price-icon">￥</text>
                <text class="price-yuan">{{ item.commission | priceInt }}</text>
                <text class="price-fen">{{ item.commission | priceFloat }}</text>
              </view>
            </view>

          </view>
        </block>

        <u-loadmore
          margin-top="40"
          margin-bottom="40"
          :loadText="loadText"
          :status="loadStatus"
          bg-color="#f5f5f5"
        ></u-loadmore>
      </template>
    </view>

    <view class="empty-page" v-else>
      <image class="empty-image" :src="emptyImg"></image>
      <text class="empty-text">暂无订单</text>
    </view>
  </view>
</template>

<script>
import { priceFilter } from "@/common/wsfFilter.js";
import {
  Userminequery, //【我的】信息
  findPromoteOrders // 推广订单
} from "@/common/smart-api/userCenterApi";
import { fenToYuan } from '@/common/utils'

export default {
  filters: {
    priceInt(price) {
        let int;
        if (price && Number(price) < 1000000) {
            int = Number(price / 100).toFixed(2).split('.')[0];
        } else if (price && Number(price) >= 1000000) {
            int = parseInt(price / 100);
        } else {
            int = '0';
        }
        return int;
    },
    priceFloat(price) {
        let float;
        if (price && Number(price) < 1000000) {
            float = '.' + Number(price / 100).toFixed(2).split('.')[1];
        } else if (price && Number(price) >= 1000000) {
            float = '';
        } else {
            float = '.00';
        }
        return float;
    },
    fenToYuan(price) {
      return fenToYuan(price)
    }
  },

  data() {
    return {
      ossUrl: this.$oss,
      showShareModal: false,
      showReturnTop: false,
      scrollTop: 0,
      emptyImg:
        "https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/bf7051fe79eb0e831298a985302ccff1.png",
      // 搜索的参数
      searchParam: {
        pageNo: 1, // 当前页码
        pageSize: 10, // 每页显示记录数
      },
      orderList: [],
      loadStatus: "loadmore", // 加载更多样式效果
      isLoading: false, // 是否正在加载
      hasMore: true, // 是否拥有更多
      priceFilter,
      loadText: {
        loadmore: "",
        loading: "努力加载中",
        nomore: "我也是有底线的~",
      },
      showStatusDict: {
        0: '待结算',
        1: '已结算'
      },
      orderStatusColor: {
        0: '#ff450c',
        1: '#00bb8a'
      },
      userCommission: {
				//分销数据
				allIncomeCommission: 0,
				toBeSettledCommission: 0
			},

      bizLineImage: {
        2: this.$oss + 'wsf-mall/distribution/order_ecommerce_icon.png'
      },
      bizLineText: {
        2: '电商'
      },

    };
  },
  onShow() {
    this.getUserCommission()
    this.getOrderList();
  },
  onPullDownRefresh() {
    this.reset();
  },
  onReachBottom() {
    this.getOrderList();
  },
  onPageScroll(e) {
    this.scrollTop = e.scrollTop;
		if (this.scrollTop > 500) {
			this.showReturnTop = true
		} else {
			this.showReturnTop = false
		}
  },
  methods: {
    //查询统计卡
		getUserCommission() {
      Userminequery().then(res => {
        let mineAssetVo = res.data.mineAssetVo || {};

        this.userCommission.allIncomeCommission = mineAssetVo.removeAdjustSettledAmount;
        this.userCommission.toBeSettledCommission = mineAssetVo.personalAgencyUnsettledAmount
      })
		},
    reset() {
      this.loadStatus = "loadmore";
      this.hasMore = true;
      this.searchParam = {
        pageNo: 1,
        pageSize: 10,
      };
      this.orderList = [];
      this.getOrderList();
    },
    // 获取分销订单数据
    getOrderList() {
      if (this.isLoading || !this.hasMore) return;
      this.isLoading = true;
      this.loadStatus = "loading";
      findPromoteOrders(this.searchParam).then((res) => {
        this.isLoading = false;
        uni.stopPullDownRefresh();
        if (res.code === 200) {
          let data = res.data || []
          this.orderList = this.orderList.concat(data);
          this.searchParam.pageNo++;
          this.hasMore = data.length === 10;
          this.loadStatus = data.length === 10 ? "loadmore" : "nomore";
        }
      });
    },
    navigateMiniProgram() {
      // uni.navigateToMiniProgram({
      //   appId: "wx0d1811ba25b5aeab",
      //   path: "pages/index/index",
      //   envVersion: __wxConfig.envVersion,
      // });

      // 跳转页面
      
      
      // 未登录跳转登录页
      if (!getApp().globalData.isLink) {
        this.$smart.go("QuickLogin");
        return;
      }
      this.$smart.go('smartAccount');
      
    },
    toRule() {
      this.$wsf.go("RulesDescription");
    },
    toDetail(item) {
      // this.$wsf.go("DistributionOrderDetail", {id: item.id, distributionOrderCode: item.distributionOrderCode});
    },
    //返回顶部
    backTop() {
      uni.pageScrollTo({
        duration: 300,
        scrollTop: 0,
      });
    },
  },
};
</script>

<style scoped lang="scss">
page {
  background: #F5F5F5;
}

.page {
  margin-top: 100rpx;
}

.order-container {
  background: #f6f6f6;
  padding-bottom: constant(safe-area-inset-bottom);
	/*兼容 IOS<11.2*/
	padding-bottom: env(safe-area-inset-bottom);
  .back-top {
    width: 80rpx;
    height: 80rpx;
    position: fixed;
    z-index: 99;
    right: 12rpx;
    bottom: 120rpx;
  }
  .order-list {
    padding: 8rpx 16rpx 0 16rpx;
    background-image: linear-gradient(to bottom, #FFFFFF 0%, #F6F6F6 100%);
    background-size: 100% 188rpx;
    background-repeat: no-repeat;
    border-radius: 12px 12px 0px 0px;
  }
  .order {
    width: 100%;
    background: #fff;
    border-radius: 24rpx;
    padding: 0 24rpx;
    margin-top: 16rpx;
    .order-title {
      height: 90rpx;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 26rpx;
      color: #000;
      .order-type {
        display: flex;
        align-items: center;
      }
      .order-type-icon {
        margin-right: 12rpx;
        width: 40rpx;
        height: 40rpx;
      }
      .order-type-text {
        color: #191919;
        font-size: 32rpx;
        font-weight: 600;
        line-height: normal;
      }
    }
    
    .order-info {
      .info-row {
        display: flex;
        align-items: center;
        height: 72rpx;
        color: #191919;
        font-size: 26rpx;
        line-height: normal;
      }
      .row-content {
        flex: 1;
        text-align: right;
      }
    }
  }
}

.commission-card {
  position: relative;
  margin: 24rpx;
  height: 324rpx;
  // background: linear-gradient(177deg, #fe4548 0%, #fe5f42 47%, #fc7d3d 100%);
  background-image: url('https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/distribution/commission_card_bg.png');
  background-size: 100% 100%;
  border-radius: 0 0 20rpx 20rpx;
  padding: 92rpx 0 32rpx;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .commission-column {
    padding: 0 48rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #000;
    .column {
      .title {
        font-size: 26rpx;
        line-height: 34rpx;
      }
      .amount {
        padding-top: 16rpx;
        font-size: 48rpx;
        font-weight: bold;
        line-height: 40rpx;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        .yuan {
          font-size: 40rpx;
          margin-right: 8rpx;
        }
      }
    }

    .withdraw-button {
      margin: 0;
      padding: 0 48rpx;
      height: 56rpx;
      line-height: 56rpx;
      background: #191919;
      border-radius: 40rpx;
      font-size: 28rpx;
      font-weight: 600;
      color: #FFFFFF;
    }
  }
  .commission-button-box {
    position: absolute;
    top: 32rpx;
    right: -8rpx;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    padding: 8rpx 16rpx;
    background: linear-gradient(270deg, #FFFFFF 0%, #FFF9CD 100%);
    box-shadow: -6rpx 4rpx 8rpx 0 #FFBF18;
    border-radius: 200rpx 0 0 200rpx;
    font-size: 22rpx;
    line-height: 30rpx;
    color: #999;
    &::before {
      content: '';
      position: absolute;
      right: 0;
      bottom: -16rpx;
      width: 0;
      height: 0;
      border-color: transparent #ff9b75;
      border-width: 0 0 16rpx 8rpx;
      border-style: solid;
    }
  }

  .surplus {
    margin: 0 24rpx;
    padding: 12rpx 24rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: rgba(251,251,251,0.24);
    border-radius: 8px;
    color: #191919;
    line-height: 34rpx;
    .title {
      font-size: 26rpx;
    }
    .amount {
      font-size: 28rpx;
      font-weight: 600;
    }
  }
}

.order-commission {
  position: relative;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: 72rpx;
  z-index: 1;
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    transform: translateX(-50%);
    display: block;
    width: 200%;
    height: 1rpx;
    scale: 0.5;
    background-color: #eee;
  }
  .commission-price {
    margin-left: 8rpx;
    color: #ff0a35;
    font-family: DINAlternate-Bold, DINAlternate;
    .price-icon {
      font-weight: 600;
      font-size: 22rpx;
    }
    .price-yuan {
      font-weight: 600;
      font-size: 40rpx;
    }
    .price-fen {
      font-weight: 600;
      font-size: 22rpx;
    }
  }
}

.empty-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 20%;
  .empty-image {
    width: 360rpx;
    height: 360rpx;
  }
  .empty-text {
    font-weight: 500;
    font-size: 30rpx;
    color: #999;
    margin-top: 20rpx;
    line-height: 42rpx;
  }
}
</style>

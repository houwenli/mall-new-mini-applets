<template>
  <view class="wrap">
    <!-- 头部 -->
    <smartNavBar title="提现详情页" />
    <view class="content">
      <!-- 提现数据 -->
      <view class="info">
        <text>提现金额</text>
        <text class="info--money">
          <text class="unit">￥</text>
          <text class="price">{{ handleAmount }}</text>
        </text>
        <text>
          <text>{{ data.bankName }}</text>
          <text class="phone">尾号{{ handleBankCard }}</text>
        </text>
      </view>
      <!-- 时间线 -->
      <view class="schedule-line">
        <u-time-line>
          <u-time-line-item
            nodeTop="0"
            v-for="(item, index) in data.withdrawFlow"
            :key="index"
            class="schedule-line-item"
            :class="item._lineName"
          >
            <!-- 节点图标 -->
            <template v-slot:node>
              <image
                class="node"
                :src="`${smartImg}/account/cash-out-${item._needName}.png `"
              />
            </template>
            <!-- 节点内容 -->
            <template v-slot:content>
              <!-- 状态 -->
              <view :class="['title', `${item._needName}`]">
                {{ item.settleStateName }}
              </view>
              <!-- 描述 -->
              <view class="">
                <text class="time" v-if="item.auditTime">
                  {{ item.auditTime }}
                </text>
                <text class="desc" v-if="item.reason">{{ item.reason }}</text>
              </view>
            </template>
          </u-time-line-item>
        </u-time-line>
      </view>
    </view>
  </view>
</template>

<script>
// 公共组件
import smartNavBar from "@/components/smart/smart-nav-bar/smart-nav-bar.vue";
// 接口
import { FundWithdrawDetail } from "@/common/smart-api/userCenterApi";
// 公共方法
import { fenToYuan, interceptNum } from "@/common/utils.js";
export default {
  components: { smartNavBar },
  computed: {
    //处理金额
    handleAmount() {
      return fenToYuan(this.data.amount);
    },
    //卡号处理
    handleBankCard() {
      return interceptNum(this.data.bankCard);
    },
  },
  data() {
    return {
      smartImg: this.$smartImg,
      data: {
        amount: 0, //提现金额
        bankCard: "", //银行卡号
        bankName: "", //银行名称
        withdrawFlow: [], //结算进度流程
      },
      assetSerialId: "", //提现流水号
    };
  },
  onLoad(options) {
    this.assetSerialId = options.assetSerialId || "";
  },
  onShow() {
    this.getDetail();
  },
  methods: {
    async getDetail() {
      try {
        let param = {
          assetSerialId: this.assetSerialId,
        };
        let res = await FundWithdrawDetail(param);
        this.data = res.data || {};
        // 数据处理
        if (res.data && res.data.withdrawFlow) {
          let dealData = this.dealData(res.data.withdrawFlow);
          this.data.withdrawFlow = dealData;
        }
      } catch (error) {
        if (error.data.msg) {
          this.$u.toast(error.data.msg);
        }
      }
    },
    // 处理提现详情数据
    dealData(data) {
      if (data.length == 0) return [];
      let realData = this.$u.deepClone(data);
      realData.forEach((item, index) => {
        item._needName = this.dealNodeImg(item.settleState); // 节点类名
        if (index < realData.length - 1) {
          item._lineName = this.dealNodeImg(realData[index + 1].settleState); //节点线条类名
        }
      });
      return realData;
    },
    // 处理类名
    dealNodeImg(val) {
      let type = "success";
      switch (val) {
        case ("1", "3"):
          type = "success";
          break;
        case ("2", "4", "5", "7"):
          type = "fail";
          break;
        case "6":
          type = "afoot";
          break;
        default:
          break;
      }
      return type;
    },
  },
};
</script>

<style scoped lang="scss">
.info {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 48rpx 0;
  font-size: 22rpx;
  font-family: DINAlternate-Bold, DINAlternate;
  color: #999999;
  &--money {
    color: #191919;
    font-weight: bold;
    margin: 16rpx 0 10rpx;
    .unit {
      font-size: 40rpx;
      font-weight: 400;
      line-height: 34rpx;
    }
    .price {
      font-size: 72rpx;
      font-family: DINAlternate-Bold, DINAlternate;
      line-height: 80rpx;
    }
  }
  .phone {
    margin-left: 6rpx;
  }
}
.schedule-line {
  margin: 0 16rpx;
  padding: 52rpx 32rpx 48rpx 40rpx;
  background: #ffffff;
  border-radius: 24rpx;
  /deep/ .u-time-axis::before {
    display: none;
  }
  /deep/ .u-time-axis-node {
    left: -32rpx;
    background-color: rgba(255, 255, 255, 0) !important;
  }
  &-item {
    /deep/ .u-time-axis-item {
      margin: 0;
      padding: 0 0 46rpx 0;
    }
    /deep/ .u-time-axis-item::before {
      content: " ";
      position: absolute;
      left: -32rpx;
      top: 16rpx;
      width: 1px;
      height: 100%;
      bottom: 0;
      border-left: 1px solid #00bb8a;
    }
  }
  &-item:last-child {
    /deep/ .u-time-axis-item::before {
      display: none;
    }
    /deep/ .u-time-axis-item {
      padding: 0;
    }
  }
  .node {
    width: 32rpx;
    height: 32rpx;
  }
  .title {
    font-size: 32rpx;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #191919;
    line-height: 40rpx;
  }

  .desc,
  .time {
    margin-top: 8rpx;
    font-size: 22rpx;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #999999;
    line-height: 34rpx;
  }
  .time {
    margin-right: 6rpx;
  }
  //失败
  .fail {
    color: #ff450c;
  }
  //进行中
  .afoot {
    /deep/ .u-time-axis-item::before {
      border-left: 1px dashed #00bb8a;
    }
  }
  //异常
  .abnormal {
    /deep/ .u-time-axis-item::before {
      border-left: 1px dashed #c3c3c3;
    }
  }
}
</style>

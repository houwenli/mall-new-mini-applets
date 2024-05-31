<template>
  <view class="extractRecords-list" v-if="list && list.length">
    <view
      v-for="(item, index) in list"
      :key="index"
      class="extractRecords-item"
      @click="operate(item)"
    >
      <view class="extractRecords-item__top flex">
        <text class="name">
          <text>{{ item.bankName }}</text>
          <text>( {{ item._bankCard }} )</text>
        </text>
        <text class="money"> {{ item._amount }}元 </text>
      </view>
      <view class="extractRecords-item__bottom flex">
        <text class="time">{{ item.withdrawTime }}</text>
        <text
          class="type"
          :class="
            typeMap[item.status].col ? `type--${typeMap[item.status].col}` : ''
          "
        >
          {{ typeMap[item.status].val }}
        </text>
      </view>
    </view>
    <u-loadmore
      margin-top="20"
      ref="backTop"
      :loadText="loadText"
      bg-color="#f3f3f3"
      color="#999"
      font-size="22"
      :status="loadStatus"
    ></u-loadmore>
  </view>
</template>

<script>
export default {
  props: {
    list: {
      type: Array,
      default: [],
    },
    loadText: {
      type: Object,
      default() {
        return {
          loadmore: "上拉加载更多",
          loading: "努力加载中",
          nomore: "已经全部加载完毕",
        };
      },
    },
    loadStatus: {
      type: String,
      default: "loadmore",
    },
  },
  data() {
    return {
      typeMap: {
        1: {
          val: "待审核",
          col: "orange",
        },
        2: {
          val: "冻结",
        },
        3: {
          val: "审核通过",
          col: "green",
        },
        4: {
          val: "审核失败(冻结)",
        },
        5: {
          val: "审核失败",
        },
        6: {
          val: "提现成功",
          col: "green",
        },
        7: {
          val: "提现失败",
        },
      },
    };
  },
  methods: {
    operate(item) {
      this.$emit("operate", item);
    },
  },
};
</script>

<style scoped lang="scss">
.flex {
  display: flex;
  align-items: center;
  align-content: center;
}
.extractRecords-list {
  padding: 18rpx 16rpx 16rpx;
  padding-bottom: calc(constant(safe-area-inset-bottom) + 30rpx);
  padding-bottom: calc(env(safe-area-inset-bottom) + 30rpx);
}
.extractRecords {
  &-item {
    margin-top: 16rpx;
    padding: 40rpx 24rpx;
    background: #ffffff;
    border-radius: 24rpx;
    &:first-child {
      margin-top: 0;
    }
  }
  &-item__top {
    justify-content: space-between;
    color: #191919;
    .name {
      font-size: 32rpx;
      font-weight: 600;
      line-height: 40rpx;
    }
    .money {
      font-size: 32rpx;
      font-weight: 600;
      color: #191919;
      line-height: 40rpx;
    }
  }
  &-item__bottom {
    justify-content: space-between;
    margin-top: 20rpx;
    font-size: 26rpx;
    font-weight: 400;
    color: #999999;
    line-height: 34rpx;
    .time {
      overflow: hidden; //溢出内容隐藏
      text-overflow: ellipsis; //文本溢出部分用省略号表示
      display: -webkit-box; //特别显示模式
      -webkit-line-clamp: 2; //行数
      line-clamp: 2;
      -webkit-box-orient: vertical; //盒子中内容竖直排列
    }
    .type {
      font-size: 26rpx;
      font-weight: 400;
      line-height: 34rpx;
      color: #FE3040;
    }
    .type--orange {
      color: #FF8011;
    }
    .type--green {
      color: #00BB8A;
    }
  }
}
</style>

<template>
  <view class="wrap">
    <!-- 头部 -->
    <smartNavBar title="提现记录" />
    <!-- 内容 -->
    <view class="records">
      <!-- 加载页 -->
      <smartTransition v-if="isPageLoading" />
      <view v-else class="records__content">
        <extractRecordsList
          v-if="list && list.length > 0"
          :list="list"
          :loadStatus="loadStatus"
          @operate="operate"
        />
        <!-- 缺省页 -->
        <smartTransition
          v-else
          :topHight="442"
          :typeName="emptyMap[emptyType].type"
          :text="emptyMap[emptyType].text"
        />
      </view>
    </view>
  </view>
</template>

<script>
// 公共组件
import smartTransition from "@/components/smart/smart-transition/smart-transition.vue";
import smartNavBar from "@/components/smart/smart-nav-bar/smart-nav-bar.vue";
// 内部组件
import extractRecordsList from "./comm/extractRecordsList.vue";
// 接口
import { FundWithdrawList } from "@/common/smart-api/userCenterApi";
// 公共方法
import { fenToYuan, interceptNum } from "@/common/utils.js";
export default {
  components: { smartTransition, extractRecordsList, smartNavBar },
  data() {
    return {
      smartImg: this.$smartImg, //智慧生活公共图片路径
      loadStatus: "loadmore", // 加载更多样式效果
      isLoading: false, // 是否正在加载(分页)
      isPageLoading: true, // 是否正在加载(主页)
      hasMore: true, // 是否拥有更多
      queryForm: {
        currentPageNum: 0, //当前页数
        pageSize: 10, //每页数量
      },
      tabs: [
        {
          name: "全部",
        },
        {
          name: "仅收入",
        },
        {
          name: "仅支出",
        },
      ],
      list: [],
      emptyType: 1, //过度页类型 0 无网络 1 为空
      emptyMap: {
        0: {
          type: "noNetwork",
          text: "暂无网络",
        },
        1: {
          type: "noHistory",
          text: "暂无提现记录",
        },
      },
    };
  },
  onShow() {
    this.reset();
  },
  onPullDownRefresh() {
    this.reset();
  },
  onReachBottom() {
    this.getFundWithdrawList();
  },
  methods: {
    // 数据初始化
    reset() {
      this.loadStatus = "loadmore";
      this.hasMore = true;
      this.isPageLoading = true;
      this.isLoading = false;
      this.queryForm = {
        currentPageNum: 0,
        pageSize: 10,
      };
      this.list = [];
      this.getFundWithdrawList();
    },
    // 操作
    operate(item) {
      this.$smart.go("smartExtractRecordsDetails", item);
    },
    // 获取提现记录
    getFundWithdrawList() {
      if (this.isLoading || !this.hasMore) return;
      this.isLoading = true;
      this.loadStatus = "loading";
      this.emptyType = 1;

      FundWithdrawList(this.queryForm)
        .then((res) => {
          //下拉刷新页面
          uni.stopPullDownRefresh();
          this.isPageLoading = false;
          this.isLoading = false;
          this.loadStatus = "loadmore";
          // 数据处理
          let dealData = this.dealData(res.data);
          this.list = this.list.concat(dealData);
          this.queryForm.currentPageNum++;
          this.hasMore = res.data.length === 10;
          this.loadStatus = res.data.length === 10 ? "loadmore" : "nomore";
        })
        .catch((err) => {
          if (this.queryForm.currentPageNum === 0) {
            this.isPageLoading = false;
            this.emptyType = 0;
          }
        });
    },
    // 处理余额明细列表数据
    dealData(data) {
      if (!data || data.length == 0) return [];
      let realData = this.$u.deepClone(data);
      realData.forEach((item) => {
        item._amount = fenToYuan(item.amount, false); // 金额处理 分转元 处理
        item._bankCard = interceptNum(item.bankCard); // 银行卡号 尾号4位 处理
      });
      return realData;
    },
  },
};
</script>

<style scoped lang="scss">
.content {
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}
.records {
  height: calc(100vh - 168rpx);
  &__content {
    height: 100%;
  }
}
</style>

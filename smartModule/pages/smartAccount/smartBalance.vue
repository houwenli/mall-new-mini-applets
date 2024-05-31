<template>
  <view class="wrap">
    <view class="header">
      <!-- 头部 -->
      <smartNavBar title="余额明细" />
      <u-tabs
        :list="tabs"
        :is-scroll="false"
        :current="queryForm.incomeType"
        active-color="#191919"
        inactive-color="#6e6e6e"
        font-size="26"
        class="tabs"
        bar-width="60"
        :bar-style="tabStyle"
        @change="onChange"
      ></u-tabs>
    </view>
    <view class="balance">
      <!-- 加载中 -->
      <smartTransition v-if="isLoading" />
      <view v-else class="balance__content">
        <balanceList
          v-if="list && list.length > 0"
          :list="list"
          :loadStatus="loadStatus"
        />
        <!-- 缺省页 -->
        <smartTransition
          v-else
          :topHight="362"
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
import balanceList from "./comm/balanceList.vue";
// 接口
import { AccountFlow } from "@/common/smart-api/userCenterApi";
// 公共方法
import { fenToYuan } from "@/common/utils.js";
export default {
  components: { smartTransition, balanceList, smartNavBar },
  data() {
    return {
      smartImg: this.$smartImg,
      loadStatus: "loadmore", // 加载更多样式效果
      isLoading: false, // 是否正在加载
      isPageLoading: true, // 是否正在加载(主页)
      hasMore: true, // 是否拥有更多
      queryForm: {
        incomeType: 0, // 当前tab
        currentPageNum: 1, //当前页数
        pageSize: 10, //每页数据
      },
      list: [],
      //tab数据
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
      //tab类型对应值
      tabTypeMap: {
        0: "ALL",
        1: "ONLY_IN",
        2: "ONLY_OUT",
      },
      //tab样式
      tabStyle: {
        height: "12rpx",
        bottom: "10rpx",
        backgroundColor: "#ffbe0c",
        opacity: "0.5",
        zIndex: "2",
      },
      emptyType: 1, //过度页类型 0 无网络 1 为空
      emptyMap: {
        0: {
          type: "noNetwork",
          text: "暂无网络",
        },
        1: {
          type: "noHistory",
          text: "暂无余额明细",
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
    this.getAddressDetails();
  },
  methods: {
    reset() {
      this.loadStatus = "loadmore";
      this.hasMore = true;
      this.isPageLoading = true;
      this.isLoading = false;
      this.queryForm = {
        incomeType: this.queryForm.incomeType,
        currentPageNum: 1,
        pageSize: 10,
      };
      this.list = [];
      this.getAddressDetails();
    },
    //tab切换
    onChange(val) {
      console.log(val);
      this.queryForm.incomeType = val;
      this.reset();
    },
    //操作
    operate(type, item) {
      this.$smart.go("smartEditAddress", {
        addressId: item?.addressId,
        addressType: type,
      });
    },
    //获取地址
    getAddressDetails() {
      if (this.isLoading || !this.hasMore) return;
      this.isLoading = true;
      this.loadStatus = "loading";
      this.emptyType = 1;
      //入参
      let param = {
        ...this.queryForm,
        incomeType: this.tabTypeMap[this.queryForm.incomeType * 1] || "",
      };
      AccountFlow(param).then((res) => {
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
      });
    },
    // 处理余额明细列表数据
    dealData(data) {
      if (!data || data.length == 0) return [];
      let realData = this.$u.deepClone(data);
      realData.forEach((item) => {
        item._amount =
          (item.signedType == 1 ? "+" : "-") + fenToYuan(item.amount);
      });
      return realData;
    },
    change(index) {
      this.queryForm.incomeType = index;
      if (this.queryForm.currentPageNum === 1) {
        this.isPageLoading = false;
        this.emptyType = 0;
      }
    },
  },
};
</script>

<style scoped lang="scss">
.header {
  position: fixed;
  top: 0;
  z-index: 2;
}
.tabs {
  height: 80rpx;
  /deep/ .u-tabs {
    box-shadow: 0 12rpx 14rpx 0 rgba(0, 0, 0, 0.03);
  }
  /deep/ .u-tab-item {
    z-index: 3;
  }
}
.balance {
  height: 100vh;
  padding-top: 262rpx;
  &__content {
    height: 100%;
  }
}
</style>

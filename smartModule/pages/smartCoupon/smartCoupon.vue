<template>
  <view class="wrap">
    <!-- 头部 -->
    <smartNavBar :title="title" />
    <!-- 内容 -->
    <view class="smartcoupon">
      <!-- 加载页 -->
      <smartTransition v-if="isPageLoading" />
      <view class="smartcoupon__content" v-else>
        <!-- 列表 -->
        <couponList
          v-if="list && list.length && list.length > 0"
          :list="list"
          :loadStatus="loadStatus"
          @toIndex="toIndex"
        />
        <!-- 缺省页 -->
        <smartTransition
          v-else
          topHight="442"
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
import couponList from "./comm/couponList.vue";
// 公共方法
import { fenToYuan } from "@/common/utils.js";
// 接口
import { QueryUserCouponList } from "@/common/smart-api/userCenterApi";

export default {
  components: { smartTransition, couponList, couponList, smartNavBar },
  data() {
    return {
      loadStatus: "loadmore", // 加载更多样式效果
      isLoading: false, // 是否正在加载(分页)
      isPageLoading: true, // 是否正在加载(主页)
      hasMore: true, // 是否拥有更多
      queryForm: {
        //页码配置
        pageNum: 0,
        pageSize: 10,
      },
      list: [], //优惠券列表
      total: 0, //优惠券总数
      emptyType: 1, //过度页类型 0 无网络 1 为空
      emptyMap: {
        0: {
          type: "noNetwork",
          text: "暂无网络",
        },
        1: {
          type: "noPreferential",
          text: "暂无优惠",
        },
      },
    };
  },
  computed: {
    title() {
      return `优惠券(${this.total || 0})`;
    },
  },
  onShow() {
    this.reset();
  },
  onPullDownRefresh() {
    this.reset();
  },
  onReachBottom() {
    this.getList();
  },
  methods: {
    // 数据初始化
    reset() {
      this.loadStatus = "loadmore";
      this.hasMore = true;
      this.isPageLoading = true;
      this.isLoading = false;
      this.queryForm = {
        pageNum: 0,
        pageSize: 10,
      };
      this.list = [];
      this.getList();
    },
    //获取优惠券列表
    getList() {
      if (this.isLoading || !this.hasMore) return;
      this.isLoading = true;
      this.loadStatus = "loading";
      this.emptyType = 1;

      QueryUserCouponList(this.queryForm)
        .then((res) => {
          uni.stopPullDownRefresh();
          this.isPageLoading = false;
          this.isLoading = false;
          this.loadStatus = "loadmore";
          // 处理数据
          let dealData = this.dealData(res.data);
          this.list = this.list.concat(dealData);
          this.total = res.total || 0;
          this.queryForm.pageNum++;
          this.hasMore = res.data.length === 10;
          this.loadStatus = res.data.length === 10 ? "loadmore" : "nomore";
        })
        .catch((err) => {
          if (this.queryForm.pageNum === 0) {
            this.isPageLoading = false;
            this.emptyType = 0;
          }
        });
    },
    // 处理优惠券列表数据
    dealData(data) {
      if (!data || data.length == 0) return [];
      let realData = this.$u.deepClone(data);
      realData.forEach((item) => {
        item._condition = this.dealCondition(item); // 使用条件处理
        item._time = this.dealTime(item); // 时间格式处理
        item._faceValue = fenToYuan(item.faceValue, false); // 价格折扣处理
      });
      return realData;
    },
    // 使用条件
    dealCondition(val) {
      let type = val.couponsType || "";
      if (!type) return "";
      // 1 满减  2 折扣  3立减
      let price = type == 1 ? val.amountLimitation : val.faceValue;
      let text = "";
      switch (type) {
        case (1, 3):
          text = `满${fenToYuan(price, true)}元可用`;
          break;
        case 2:
          text = `无门槛`;
          break;
        default:
          break;
      }
      return text;
    },
    // 时间格式处理
    dealTime(val) {
      let start = val.effectiveStartTime || "";
      let end = val.effectiveEndTime || "";
      if (!val || !start || !end) return "";
      return (
        start.split(" ")[0].replaceAll("-", ".") +
        "-" +
        end.split(" ")[0].replaceAll("-", ".")
      );
    },
    // 页面跳转
    toIndex(name, val) {
      this.$smart.go(name, val);
    },
  },
};
</script>

<style scoped lang="scss">
.flex {
  display: flex;
  align-items: center;
}
.smartcoupon {
  height: calc(100vh - 168rpx);
  &__content {
    height: 100%;
  }
}
</style>

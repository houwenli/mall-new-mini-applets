<template>
  <div class="header-top">
    <back-top
      :topSearch="topSearch"
      :isShare="isShare"
    ></back-top>
    <view
      class="header-tabs-wrap"
      :style="{ top: showHeader ? barHeight : '-1000rpx' }"
      id="tabsBox"
      ref="tabsBox"
    >
      <view class="header-tabs">
        <block v-for="(item, index) in tabList" :key="index">
          <view
            class="tabs"
            :class="{ active: tabIndex == item.id }"
            @click="changeTab(item)"
          >
            <span>{{ item.name }}</span>
            <img
              v-if="tabIndex == item.id"
              src="https://wsjc-web.wsecar.com/wsf-mall/skuDetail/icon-subscript.png"
              alt=""
            />
          </view>
        </block>
      </view>
    </view>
  </div>
</template>

<script>
import backTop from "@/components/backTop.vue";
export default {
  name: "headerTop",
  components: {
    backTop,
  },
  props: {
    topSearch: {
      type: Boolean,
      default: false,
    },
    showHeader: {
      type: Boolean,
      default: false,
    },
    tabIndex: {
      type: Number,
      default: 0,
    },
    isShare: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      barHeight: "0px",
      tabList: [
        {
          id: 0,
          name: "商品",
          mark: "product",
        },
        {
          id: 1,
          name: "详情",
          mark: "detailBox",
        },
        {
          id: 2,
          name: "评论",
          mark: "commentBox",
        },
      ],
    };
  },
  created() {
    let { height, top } = getApp().globalData.capsule;
    let { statusBarHeight } = uni.getSystemInfoSync();
    this.barHeight = top * 2 - statusBarHeight + height + "px";
  },
  methods: {
    // 切换分类
    changeTab(item) {
      this.$emit("changeTab", item);
    },
  },
};
</script>

<style lang="scss" scoped>
.header-top {
  .header-tabs-wrap {
    z-index: 98;
    position: fixed;
    top: -1000rpx;
    left: 0;
    right: 0;
    height: 76rpx;
    background-color: #fff;
    width: 100%;
    box-shadow: 0rpx 8rpx 20rpx 0rpx rgba(217, 217, 217, 0.15);
    .header-tabs {
      width: 100%;
      display: flex;
      height: 76rpx;
      padding: 0 68rpx;
      padding-top: 12rpx;
      justify-content: space-between;
      .tabs {
        font-size: 26rpx;
        color: #444444;
        display: flex;
        flex-direction: column;
        align-items: center;
        &.active {
          font-weight: bold;
          color: #191919;
        }
        img {
          width: 54rpx;
          height: 8rpx;
          padding-top: 8rpx;
        }
      }
    }
  }
}
</style>

<template>
  <view class="table-u">
    <view class="specification">
      <img
        src="https://wsjc-web.wsecar.com/wsf-mall/skuDetail/icon-specification.png"
        alt=""
      />
      <span>车型参数</span>
    </view>
    <view class="view-table">
      <view class="tr" v-for="(attribute, index) in paramList" :key="index">
        <view class="td-1">{{ attribute.attributeName || '' }}</view>
        <view class="td-2">{{ attribute.attributeValue || '' }}</view>
      </view>
    </view>
    <!-- <view class="tip-title" v-if="isExpand">提示</view>
    <view class="tip-content" v-if="isExpand">
      *续航里程数值因测试环境不同会有较大差异。理论续航是该产品在骑行者体重70kg，环境温度25°C，时速25km/h等实验室环境下的测试数据。*续航里程数值因测试环境不同会有较大差异。理论续航是该产品在骑行者体重70kg，环境温度25°C，时速25km/h等实验室环境下的测试数据。*续航里程数值因测试环境不同会有较大差异。理论续航是该产品在骑行者体重70kg，环境温度25°C，时速25km/h等实验室环境下的测试数据。*续航里程数值因测试环境不同会有较大差异。理论续航是该产品在骑行者体重70kg，环境温度25°C，时速25km/h等实验室环境下的测试数据。
    </view> -->
    <view
      class="btn"
      v-if="skuData.spuAttributeValues && skuData.spuAttributeValues.length > 5"
      @click="changeExpand"
    >
      <img
        :src="`https://wsjc-web.wsecar.com/wsf-mall/skuDetail/icon-${
          !isExpand ? 'btn-btom' : 'btn-top'
        }.png`"
        alt=""
      />
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      expandIcon: "arrow-down",
      isExpand: false,
      showList: [],
      attrList: [
        {
          label: "使用推荐",
          value: "坚实骨架更安全",
        },
        {
          label: "最高时速",
          value: "25km/h及以下",
        },
        {
          label: "整车重量",
          value: "55kg",
        },
        {
          label: "使用推荐",
          value: "坚实骨架更安全",
        },
        {
          label: "使用推荐",
          value: "坚实骨架更安全",
        },
        {
          label: "使用推荐",
          value: "坚实骨架更安全",
        },
      ],
    };
  },
  props: {
    skuData: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  computed: {
    paramList() {       
      let list = this.skuData.spuAttributeValues;
      if (list && list.length > 5 && !this.isExpand) {
        list = list.slice(0, 5);
      }
      return list;
    },
  },
  methods: {
    changeExpand() {
      if (this.isExpand) {
        this.expandIcon = "arrow-down";
      } else {
        this.expandIcon = "arrow-up";
      }
      this.isExpand = !this.isExpand;
    },
  },
};
</script>

<style scoped lang="scss">
.table-u {
  margin: 20rpx 24rpx;
  padding: 30rpx 24rpx 24rpx 24rpx;
  background: #ffffff;
  border-radius: 24rpx;
  .specification {
    display: flex;
    align-items: center;
    padding-bottom: 24rpx;
    img {
      width: 32rpx;
      height: 34rpx;
    }
    span {
      padding-left: 8rpx;
      font-size: 26rpx;
      color: #191919;
    }
  }
  .tip-title {
    color: #999;
    font-size: 22rpx;
    line-height: 30px;
    font-weight: bold;
    margin-top: 24rpx;
  }
  .tip-content {
    color: #999;
    font-size: 22rpx;
    line-height: 30px;
    margin-top: 4rpx;
    text-align: justify;
  }
}
.view-table {
  border: 1px solid #eeeeee;
  .tr {
    display: flex;
    border-bottom: 1px solid #eeeeee;
    .td-1 {
      width: 176rpx;
      flex-shrink: 0;
      padding: 22rpx 16rpx 20rpx 16rpx;
      font-size: 22rpx;
      color: #999999;
    }
    .td-2 {
      width: 100%;
      padding: 22rpx 16rpx 20rpx 16rpx;
      font-size: 22rpx;
      color: #999999;
      border-left: 1px solid #eeeeee;
    }
  }
  .tr:last-child {
    border-bottom: none;
  }
}
.btn {
  width: 122rpx;
  height: 32rpx;
  border-radius: 16rpx;
  margin: 0 auto;
  margin-top: 24rpx;
  img {
    width: 121rpx;
    height: 31rpx;
    display: block;
  }
}
</style>

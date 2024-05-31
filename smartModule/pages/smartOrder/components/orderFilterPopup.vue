<template>
  <u-popup
    v-model="modelShow"
    mode="top"
    class="u-date-popup"
    :border-radius="24"
    :mask-close-able="true"
    :mask-custom-style="{ backgroundColor: 'rgba(0, 13, 29, 0.6)' }"
    z-index="99"
    @close="closeDatePopup"
  >
    <!-- <view :style="{ paddingTop: filterTop}" class="filter-box"> -->
    <view class="filter-box" :style="{ paddingTop: filterTop }">
      <view
        class="filter-box-item"
        v-for="(ele, filterIndex) in filterList"
        :key="filterIndex"
      >
        <view class="filter-box-item-title">
          {{ ele.moduleName }}
        </view>
        <view class="filter-box-item-option">
          <view
            v-for="(item, index) in ele.labels"
            :key="index"
            @click="optionSelected(item.labelCode, ele.moduleType)"
            class="filter-box-item-option-item"
            :class="{
              'filter-item-selected': selectObj[ele.moduleType] === item.labelCode,
            }"
          >
            {{ item.desc }}
          </view>
        </view>
      </view>
      <view class="filter-box-btn">
        <view
          class="filter-box-btn-item filter-box-btn-reset"
          @click="resetting()"
          >重置</view
        >
        <view
          class="filter-box-btn-item filter-box-btn-confirm"
          @click="confirm()"
          >确定</view
        >
      </view>
    </view>
  </u-popup>
</template>

<script>
import { queryLabel } from '@/common/smart-api/orderApi';
export default {
  name: 'orderFilterPopup',
  data() {
    return {
      selectObj: {},
      filterList: [],
      modelShow: false,
    };
  },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    headerboxTop: {
      type: String,
      default: 0,
    },
  },
  computed: {
    filterTop() {
      // return Number(this.headerboxTop) + 40 + 'px'
      return this.headerboxTop + 'px';
    },
  },
  watch: {
    show() {
      this.modelShow = this.show
    }
  },
  created() {
    this.init()
  },
  methods: {
    // 初始化
    init() {
      this.queryLabel()
    },
    // 查询处理筛选条件
    queryLabel() {
      queryLabel().then((ret) => {
        this.filterList = ret.data || []
      });
    },
    // 关闭筛选弹窗
    closeDatePopup() {
      this.$emit('closeDatePopup');
    },
    // 重置属性选择
    resetting() {
      this.selectObj = {};
    },
    confirm() {
      console.log(this.selectObj, 'this.selectObj');
      // 把对象转换成数组
      let selectArr = []
      for (let moduleType in this.selectObj) {
        selectArr.push({
          moduleType,
          labelCode: this.selectObj[moduleType]
        })
      }
      this.$emit('confirmFilter', selectArr);
    },
    // 属性选择
    optionSelected(labelCode, moduleType) {
      this.$set(this.selectObj, [moduleType], labelCode)
    },
  },
};
</script>

<style lang="scss" scoped>
.filter-box {
  position: relative;
  background: #f6f6f6;
  padding-left: 24rpx;
  padding-right: 24rpx;
  padding-bottom: 28rpx;
  &-item {
    margin-top: 34rpx;
    &-title {
      font-size: 32rpx;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #191919;
    }
    &-option {
      display: flex;
      flex-wrap: wrap;
      margin-top: 20rpx;

      .filter-box-item-option-item {
        display: flex;
        align-items: center;
        justify-content: center;
        width: calc((100% - 36rpx) / 3);
        height: 74rpx;
        background: #ffffff;
        border-radius: 36rpx;
        margin-right: 18rpx;
      }
      .filter-box-item-option-item:nth-child(3n) {
        margin-right: 0;
      }
    }
    .filter-item-selected {
      background: rgba(254,48,64,0.06);
      font-weight: 600;
      border: 1rpx solid $wsf-color-new-red;
      color: #FF0A35;
    }
  }
  &-btn {
    display: flex;
    justify-content: space-between;
    margin-top: 40rpx;
    &-item {
      text-align: center;
      width: calc(50% - 12rpx);
      height: 80rpx;
      line-height: 80rpx;
      border-radius: 40rpx;
      font-size: 32rpx;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
    }
    &-reset {
      border: 1rpx solid #c3c3c3;
      color: #6e6e6e;
      margin-right: 24rpx;
    }
    &-confirm {
      background: $wsf-linear-bg;
      color: #fff;
      font-weight: 600;
    }
  }
}
</style>

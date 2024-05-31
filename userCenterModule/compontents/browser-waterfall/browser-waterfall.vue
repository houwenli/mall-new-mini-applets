<template>
  <view class="container">
    <view class="contnet">
      <view class="content-left">
        <browser-cell
          :item="item"
          @clickSku="clickSku"
          v-for="(item, index) in leftList"
          :key="index"
          :isEdit="isEdit"
          @goSkuDetail="goSkuDetail"
        ></browser-cell>
      </view>
      <view class="content-right">
        <browser-cell
          :item="item"
          @clickSku="clickSku"
          v-for="(item, index) in rightList"
          :key="index"
          :isEdit="isEdit"
           @goSkuDetail="goSkuDetail"
        ></browser-cell>
      </view>
    </view>
  </view>
</template>

<script>
import BrowserCell from "./browser-cell .vue";

export default {
  components: { BrowserCell },
  props: {
    list: {
      type: Array,
      default: [],
    },
    isEdit: {
      type: Boolean,
      default: [],
    },
  },
  data() {
    return {
      leftList: [],
      rightList: [],
      checkedList: [],
    };
  },
  computed: {},
  watch: {
    // 数据处理
    list: {
      handler() {
        let data = this.list;
        let i = 0;
        this.leftList = [];
        this.rightList = [];
        while (i < data.length) {
          this.leftList.push(data[i++]);
          if (i < data.length) {
            this.rightList.push(data[i++]);
          }
        }
      },
      deep: true,
      immediate: true,
    },
  },
  created() {},
  mounted() {},
  methods: {
    // 勾选操作
    clickSku(item) {
      this.$emit("clickSku", item);
    },
    // 详情
    goSkuDetail(item) {
      this.$emit("goSkuDetail", item);
    },
  },
};
</script>

<style scoped lang="scss">
.contnet{
  display: flex;
}
.content-left {
  width: 50%;
  padding-right: 11rpx;
}
.content-right {
  width: 50%;
  padding-left: 11rpx;
}
</style>

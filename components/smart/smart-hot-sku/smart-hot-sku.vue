<template>
  <view v-if="flowList.length > 0">
    <!-- 热销商品模块 -->
    <view class="applet-template-recommend">
      <view class="header">
        <image :src="hotImg" mode="heightFix" />
      </view>
      <wsf-smart-goods-list
        v-if="flowList.length > 0"
        :list="flowList"
        :loadStatus="loadStatus"
        loadMoreBgColor="#f8f8f8"
        @goodsClick="goodsClick($event)"
      ></wsf-smart-goods-list>
    </view>
  </view>
</template>

<script>
// 公共组件
import wsfSmartGoodsList from "@/components/wsf-smart-goods-list/wsf-smart-goods-list.vue";

export default {
  components: {
    wsfSmartGoodsList
  },
  props: {
    // 请求热销商品的类型
    pageType: {
      type: Number,
			default: 0
    },
    // 请求热销商品的方法
    getHotSkuFn: {
      type: Function,
      default: null
    },
    // 处理热销商品数据
    dealHotSkuFn: {
      type: Function,
      default: null
    },
    loadSignal: {
      type: [Number, Symbol],
      default: 0
    }
  },
  data() {
    return {
      // 图片
      hotImg: `${this.$smartImg}/home/smart_hot_goods.png`,

      flowList: [], // 瀑布流商品列表
      loadStatus: "loadmore", // 加载更多样式效果
      isLoading: false, // 是否正在加载
      hasMore: true, // 是否拥有更多
			queryForm: {
        // 页码页容量
        pageType: 4,
        pageNum: 0,
        pageSize: 10,
      },
		};
  },
  computed: {
    
  },
  watch: {
    loadSignal() {
      this.getCommList()
    },
  },
	created() {
    this.getCommList()
	},
  methods: {
		/* 获取热销商品 */
    getCommList() {
      let getHotSku = this.getHotSkuFn && this.getHotSkuFn()
      let dealHotSku = this.dealHotSkuFn && this.dealHotSkuFn()
      // 如果没有请求方法就就直接返回
      if(typeof getHotSku !== 'function') {
        return
      }
      if (this.isLoading || !this.hasMore) return;
      this.isLoading = true;
      this.loadStatus = "loading";
      getHotSku(this.queryForm).then((res) => {
        this.isLoading = false;
        this.loadStatus = "loadmore";
        if (res.code === 200) {
          let data = res.data || []
          if (typeof dealHotSku === 'function') {
            data = dealHotSku(res.data) || []
          }
          this.flowList = this.flowList.concat(data);
          this.queryForm.pageNum++;
          this.hasMore = res.data.length === this.queryForm.pageSize;
          this.loadStatus = res.data.length === this.queryForm.pageSize ? "loadmore" : "nomore";
        }
      });
    },
    // 商品跳转
    goodsClick(e) {
      console.log("e", e);
      // this.$smart.go("SkuDetail", { skuId: e.id });
      if (e.goodsSource == 4) {
        this.$smart.go("ToMotor", { skuId: e.id });
      } else {
        this.$smart.go("SkuDetail", { skuId: e.id });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.applet-template-recommend {
  background: #f8f8f8;
  padding: 0 16rpx;
  .header {
    padding: 40rpx 0 20rpx;
    display: flex;
    justify-content: center;
    image {
      height: 32rpx;
      width: 498rpx;
    }
  }
}
</style>

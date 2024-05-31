<template>
  <view class="applet-search-wrap">
    <header-search :topSearch="true" enterType="search" @toSearch="toSearch" @navBarInfo="getNavBarInfo"></header-search>
    <!-- 内容区域 -->
    <!-- 未初始化 -->
    <view class="conten-box" :style="[wraperStyle]" v-if="!isInit">
      <view class="applet-order-list-isEmpty u-flex flex-column">
        <image style="height: 320rpx;width: 320rpx;" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/order/history_no.png" mode=""></image>
        <view class="u-padding-top-20rpx" style="color: #999;padding-bottom: 64rpx;font-size: 30rpx;">您还没有相关订单～</view>
      </view>
    </view>
    <view class="conten-box" :style="[wraperStyle]" v-else>				
      <view v-if="orderList.length === 0 && !isEmpty">
        <loaddingPage></loaddingPage>
      </view>
      <!-- 缺省 -->
      <view class="applet-order-list-isEmpty u-flex flex-column" v-if="isEmpty">
        <image style="height: 320rpx;width: 320rpx;" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/order/history_no.png" mode=""></image>
        <view class="u-padding-top-20rpx" style="color: #999;padding-bottom: 64rpx;font-size: 30rpx;">您还没有相关订单～</view>
      </view>
      <!-- 内容区 -->
      <view class="order-wraper" v-if="!isEmpty && orderList.length > 0">
        <view class="order-item" v-for="(item, index) in orderList" :key="index">
          <!-- 订单卡片 -->
          <orderListItem :orderItem="item" @reload="confirmResearch"></orderListItem>
        </view>
        <u-loadmore :status="loadmore" margin-top="36" bg-color="#F3F3F3" color="#c3c3c3" font-size="22" :load-text="loadText" />
      </view>
    </view>  
  </view>
</template>

<script>
// 组件
import headerSearch from "./components/headerSearch.vue";
import orderListItem from './components/orderList/orderListItem.vue';
import loaddingPage from './components/loaddingPage.vue'

// 方法 接口
import { ORDER_STATUS_LIST, ORDER_STATUS } from '@/common/constants/order'
import { priceFilter } from '@/common/wsfFilter.js';
import { queryOrderByUserId } from '@/common/smart-api/orderApi'

export default {
  components: {
    headerSearch,
    orderListItem,
    loaddingPage
  },
  data() {
    return {
      // 常量
      orderStatusList: ORDER_STATUS_LIST, // 订单列表
      isInit: false,

      // navinfo信息
      navHeight: 0,

      // 列表请求状态
      isEmpty: false, // 缺省状态
			hasMore: true, // 是否还有更多
			isLoading: false, // 正在加载

      // 订单状态，后台反馈退款/售后在另一张表，只有当status为退款/售后状态时这个字段才有效，此时搜索也只搜索退款/售后
      status: '-1',
      orderList: [], // 订单列表
      // 列表参数
      queryForm: {
				nextPageTime: '',
				pageSize: 10,
        waresName: ''
			},

      loadText: {
				loadmore: '上拉加载更多',
				loading: '努力加载中',
				nomore: '我也是有底线的～'
			},
    };
  },
  mounted(){
  
  },
  computed: { 
    loadmore() {
			if (this.isLoading) {
				return 'loading';
			} else {
				return this.hasMore ? 'loadmore' : 'nomore';
			}
		},
    wraperStyle() {
			return {
				paddingTop: `${this.navHeight}px`
			}
		}
  },
  watch: {
    
  },
  onLoad(options) {
    let { status } = options || {}
    this.status = status
  },
  onShow() {    
    
  },
  onReachBottom() {
		console.log('我到页面最底部了~');
		// 获取订单列表
    this.loadOrderList();
	},
  methods: {
    // 获取订单列表
		loadOrderList() {
      // 只要有请求
      this.isInit = true

			if (this.isEmpty || !this.hasMore || this.isLoading) return;
			this.isLoading = true;
			let { nextPageTime } = this.queryForm
			let params = {
				...this.queryForm
			};
			if (this.status == ORDER_STATUS.refund) {
				params.status = this.status
			}
			queryOrderByUserId(params)
				.then(res => {
					this.isLoading = false;
					uni.stopPullDownRefresh();
					if(nextPageTime === '') {
						this.orderList = []
					}
					if (nextPageTime === '' && res.data.length === 0) {
						this.isEmpty = true;
						this.showRecommend = true
						this.RecommendHasMore = true
						// this.loadRecommend();
					} else {
						this.orderList = this.orderList.concat(
							res.data.map(el => {
								el.status = Number(el.status);
								return el;
							})
						);
						// 设置新的nextPageTime，值为最后一个订单的nextPageTime，分页需要
						let lastOrder = this.orderList[this.orderList.length - 1]
						this.queryForm.nextPageTime = lastOrder.nextPageTime || ''
						this.hasMore = res.data.length === this.queryForm.pageSize;

						if(!this.hasMore) {
							this.showRecommend = true
							this.RecommendHasMore = true
							// this.loadRecommend();
						}
						console.log(this.orderList, 'this.orderListthis.orderListthis.orderList');
					}
				})
				.catch(err => {
					this.isLoading = false;
				});
		},

    // 重置搜索条件
		resetQueryForm() {
			this.isEmpty = false;
			this.hasMore = true;
			this.isLoading = false
			this.queryForm.nextPageTime = '';
			this.orderList = []
		},

    confirmResearch() {
			this.resetQueryForm();
			this.loadOrderList();
		},

    // 顶部搜索
    toSearch(keyword) {
      this.resetQueryForm();
      this.queryForm.waresName = keyword;
			this.loadOrderList();
    },

    // 获取navbar信息
    getNavBarInfo(data) {
      this.navHeight = data.navHeight || 0
    },
  },
};
</script>
<style lang="scss">
  .applet-order-list-isEmpty {
    flex-direction: column;
    padding-top: 300rpx;
  }
  .order-item{
    margin-top: 16rpx;
  }
</style>

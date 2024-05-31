<template>
  <view class="contentBox">
    <view class="headerbox" :style="{ paddingTop: headerboxTop + 'px' }">
      <header-search :topSearch="true" title="我的订单"></header-search>      
    </view>
    <view :style="{ height: searchTop + 'px'}"></view>
    <view class="searchBox" @click="toSearch" :style="{ top: searchTop + 'px' }">     
      <view class="inputBox">      
        <slot name="left">
          <image class="left" src="https://wsjc-web.wsecar.com/wsf-mall/home/search.png" mode="widthFix"> </image>
        </slot>
        <input         
          v-model.trim="queryForm.queryString"
          class="searchinput"
          type="text"                   
          :placeholder="placeholder"                                        
        />
      </view>           
    </view>  
    <!-- 轮播图 -->
    <view class="swiper-box" v-if="swipeContent && swipeContent.list && swipeContent.list.length > 0" :style="{ paddingTop: searchListTop + 10 + 'px' }">     
      <swipe :isShowIndicatorDots="false" class="swipe-item" :config="swipeContent"></swipe>
    </view>

   
    <view class="loading-area" v-if="isLoading && isFirst">
      <image class="loading-img" :src="'https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/home/loading.gif'" />
      <view class="loading-text">加载中…</view>
      
    </view>

    <view v-else :style="{ paddingTop: swipeContent && swipeContent.list && swipeContent.list.length > 0 ? 0 : searchListTop + 'px' }">
      <!-- 无列表数据 -->
      <view class="nodatabox" v-if="isEmpty">
        <image src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/order/history_no.png" alt="" />
        <view>您暂时没有相关订单～</view>
        <view class="nodata-btn" @click="goToGoods">去选购相关商品</view>
      </view>

      <!-- 订单列表 -->
      <view class="applet-order-list-body" v-if="orderList.length > 0">
        <view class="applet-order-list-order">
          <template v-for="(item, index) in orderList">         
            <orderListItem :orderItem="item" :key="index" @orderOperation="orderOperation"></orderListItem>
          </template>
        </view>
      </view>
    <u-loadmore v-if="!isEmpty" :status="loadmore" margin-top="20" bg-color="#F3F3F3" :load-text="loadText" />   
	</view>    

	<!-- 热销商品模块 -->
	<view v-if="showRecommend" class="applet-template-recommend">
		<wsf-goods-list title="hot" ref="recommedList" :list="flowList" :loadStatus="loadStatus" @goodsClick="goodsClick($event)"></wsf-goods-list>
	</view>
	<orderSecondConfirm ref="orderSecondConfirm" @confirmResearch="confirmResearch"></orderSecondConfirm>
  </view>
</template>

<script>
  import headerSearch from "./headerSearch.vue";
  import swipe from '@/pages/index/components/swipe/index.vue';
  import orderListItem from '../../components/orderList/orderListItem.vue';
  import orderSecondConfirm from '@/components/orderSecondConfirm.vue';
  import { priceFilter } from '@/common/wsfFilter.js';
  // import { queryOrderList } from '@/api/orderlist'

  export default {
    name: 'searchPath',
    components: {  
      headerSearch,
      swipe,    
      orderListItem,
      orderSecondConfirm
    },
    data() {
      return {                       
        iStatusBarHeight: 0,
        headerIconHeight: 0,    
        swipeContent: null,// 轮播图信息
        orderList: [], // 订单列表
        isEmpty: false, // 缺省状态
        hasMore: true, // 是否还有更多
        isLoading: false, // 正在加载
		priceFilter,
        queryForm: {
          pageType: 6,
          pageNum: 0,
          pageSize: 10,
          status: -1, // 订单状态
          queryString: '',
        },
        loadText: {
          loadmore: '上拉加载更多',
          // loading: '努力加载中',
          loading: '',
          nomore: '没有更多数据'
        },
        isFirst: true,
		showRecommend: false, // 显示热销商品
		RecommendHasMore: false,
		flowList: [], // 推荐商品瀑布流
		RecommendQueryForm: {
			pageType: 6,
			pageNum: 0,
			pageSize: 10,
		},
      }
    },   
    mounted() {   
      let { height, top } = getApp().globalData.capsule;
      let { statusBarHeight } = uni.getSystemInfoSync()
      this.iStatusBarHeight = statusBarHeight;
      this.headerIconHeight = (top - this.iStatusBarHeight) * 2 + height;
    },
    computed: { 
      loadmore() {
        if (this.isLoading) {
          return 'loading';
        } else {
          return this.hasMore ? 'loadmore' : 'nomore';
        }
      },  
      searchTop() {    
        return  this.headerIconHeight + this.iStatusBarHeight
      },
	  searchListTop() {    
        return this.headerIconHeight + 8
      },
    },
    onLoad(options) {   
		this.queryPersonConfigTemp()        
		this.queryForm.queryString = options.queryString || "";
		if(options.status) {
			this.queryForm.status = options.status;
		}			            
		this.orderList = [];
		// this.isEmpty = true; 
		this.loadOrderList();
    },
   
    onPullDownRefresh() {     
      this.orderList = [];
      this.loadOrderList();
    },
    onReachBottom() {    
      	// 获取订单列表	 
		if (this.showRecommend) {
			// 加载推荐列表
			this.loadRecommend();
		} else {
			// 获取订单列表
			this.loadOrderList();
		}      
    },
    methods: {
		// 商品跳转
		goodsClick(e) {
			console.log('e', e);
			// this.$wsf.go('SkuDetail', { skuId: e.id });
			if(e.goodsSource == 4){
				this.$wsf.go('ToMotor',{skuId: e.id});
			} else {
				this.$wsf.go('SkuDetail', { skuId: e.id });
			}
		},  
		// 获取推荐商品列表
		loadRecommend() {
			let that = this;
			if (this.isLoading || !this.RecommendHasMore) return;
			this.isLoading = true;
			this.loadStatus = 'loading';
			this.$u.api.QueryRecommendCommodity(this.RecommendQueryForm).then(res => {
				this.isLoading = false;
				this.loadStatus = 'loadmore';
				console.log('res', res);
				if (res.code === 200) {
					this.flowList = this.flowList.concat(
						res.data.map(item => {
							item.price = this.priceFilter(item.price);
							return item;
						})
					);
					this.RecommendQueryForm.pageNum++;
					this.RecommendHasMore = res.data.length === 10;
					this.loadStatus = res.data.length === 10 ? 'loadmore' : 'nomore';
				}
			});
		},  
		// 查询轮播
		queryPersonConfigTemp() {
			this.$u.api.queryPersonConfigTemp(104).then(res => {
			if(res.code === 200) {
				let swipeConfigswipeConfig  = JSON.parse(res.data.content) || {}
				this.swipeContent = swipeConfigswipeConfig.contentList[0] || null

				// 过滤掉没有图片的轮播
				if(this.swipeContent && this.swipeContent.list && this.swipeContent.list.length > 0) {
					this.swipeContent.list = this.swipeContent.list.filter(item => {
						return item.url
					})
				}      
			}
			})	
		},
		// 重置搜索条件
		resetQueryForm() {
			this.isEmpty = false;
			this.hasMore = true;
			this.queryForm.pageNum = 0;
		},
		// 获取订单列表
		loadOrderList() {
			let that = this;
			if (this.isEmpty || !this.hasMore || this.isLoading) return;
			this.isLoading = true;
			this.$u.api
			.QueryCustomerOrders(this.queryForm)
			.then(res => {
				this.isLoading = false;
				this.isFirst = false
				uni.stopPullDownRefresh();
				if (this.queryForm.pageNum === 0 && res.data.list.length === 0) {
					this.isEmpty = true;    
					this.showRecommend = true  
					this.RecommendHasMore = true  
					this.loadRecommend();                         
				} else {
					this.orderList = this.orderList.concat(
						res.data.list.map(el => {
							el.status = Number(el.status);
							return el;
						})
					);
					this.queryForm.pageNum++;
					this.hasMore = res.data.list.length === 10;     
					if(!this.hasMore) {
						this.showRecommend = true
						this.RecommendHasMore = true
						this.loadRecommend();
					}       
				}
			})
			.catch(err => {
				this.isLoading = false;
				this.isFirst = true
				this.isEmpty = true
			});
		},      
		goToGoods(){      
			this.$wsf.go("SpuList", { queryString: this.queryForm.queryString }, "redirectTo");
		},
		toSearch(){
			// this.$wsf.go("orderSearch",{ placeholderText: this.queryForm.queryString },"redirectTo");            
			this.$wsf.go("orderSearch",{ searchValue: this.queryForm.queryString },"redirectTo");
		},                
		toBack() {                
			this.$router.go(-1)       
		},

		orderOperation(item, type) {
			this.$refs.orderSecondConfirm.orderOperation(item, type)
		},

		confirmResearch() {
			this.resetQueryForm();
			this.orderList = [];
			this.loadOrderList();
		},           		  
    },
    
  }
</script>

<style scoped lang="less">
.contentBox {
	background: #F6F6F6;
	height: 100vh;
	.searchBox {    
		width: 100%;
		padding-left: 24rpx;
		padding-right: 24rpx;  
		padding-top: 12rpx; 
		display: flex;   
		// align-items: center;
		background: #FFFFFF;
		height: 88rpx;   
		position: fixed;
		z-index: 2;
		.inputBox {
			height: 32px;
			font-size: 28rpx;
			border-radius: 36rpx;
			width: 100%;     
			padding-left: 16rpx;		
			// background: url('https://wsjc-web.wsecar.com/wsf-mall/home/search.png') no-repeat 16px center #f2f2f2;
			// background-size: 48px;
			display: flex;
			align-items: center;   
			background: #F2F2F2;     
			.left {
				width: 32rpx;
				height: 32rpx;
				display: block;   
				margin-right: 16rpx;    
			}
			.searchinput {
				width: calc(100% - 80rpx);        
				text-align: left;
				color: #111111;                  
				height: 100%;
				background-color: #f2f2f2;
				border: none;
				font-size: 28rpx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #000;
				&::-webkit-input-placeholder {
					color: #999;
				}
			}
		}
		input.searchinput {
			caret-color: rgba(255, 15, 54, 1);
		}
		.searchIcon {
			width: 108rpx;
			text-align: center;
			height: 56rpx;
			line-height: 56rpx;
			margin: 12rpx 0;      
			font-size: 28rpx;
			font-family: PingFangSC-Regular, PingFang SC;
			color: #FFFFFF;
			font-weight: 400;
			background: linear-gradient(90deg, #FF6B4E 0%, #FF0A35 100%);
			border-radius: 38rpx;
		}
	}
	
	.nodatabox {
		margin-top: 64rpx;
		margin-bottom: 104rpx;
		text-align: center;
		image {
			width: 320rpx;
			height: 320rpx;
			margin-bottom: 16rpx;
		}
		p {
			color: #444444;
			font-size: 26rpx;
		}
		.nodata-btn{
			width: 320rpx;
			height: 80rpx;
			background: linear-gradient(90deg, #FF5F2E 0%, #FF0A35 100%);
			border-radius: 40rpx;
			font-size: 32rpx;
			font-family: PingFangSC-Medium, PingFang SC;
			font-weight: 500;
			color: #FFF9E9;
			line-height: 80rpx;
			margin: 20rpx auto;
		}
	}
	.loading-area {
		flex: 1;
		border-radius: 32rpx 32rpx 0 0;
		background-color: #f5f5f5;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-items: center;
		padding-top: 370rpx;
		overflow: hidden;
		.loading-img {
			width: 160rpx;
			height: 80rpx;
		}

		.loading-text {
			font-size: 20rpx;
			color: #90969e;
			line-height: 28rpx;
			color: #90969e;
			margin-top: 8rpx;
		}
	}

}
.fqz-confirm-dialog {
	text-align: center;
	padding-top: 40rpx;
	.fqz-column {
		font-size: 28rpx;
		line-height: 32rpx;
		color: #666;
		.light {
			color: #e60113;
		}
	}
}
/deep/.wsf-mode-footer{
	height: auto !important;
}
.applet-template-recommend {
	padding: 0 24rpx;
}
.swiper-box {
	position: relative;   
	padding-top: 20rpx;
	/deep/ .wrap{
		padding: 0 16rpx;
		image{
			border-radius: 24rpx;
		}
	}
}
</style>

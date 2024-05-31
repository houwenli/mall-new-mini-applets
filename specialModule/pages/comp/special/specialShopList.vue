<template>
<view class="special-shopList">	
	<view v-if="pageList.length <= 0" class="applet-empty u-flex flex-column">
		<image src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/main-packages/isEmpty-icon/cart.png" style="width:180rpx;height: 180rpx;" mode=""></image>
		<view class="applet-empty-tips">暂无活动商品~</view>
	</view>
	<template v-else>
		<view v-for="(item, index) in pageList" :key="item.id" class="sku-list-item" :style="[bgStyle(index)]">
			<!-- <image :src="index>3 ?bgImage[3] :bgImage[index]" alt=""></image> -->
			<view class="top-icon" :style="{'background-image': `url(${index>3 ?bgImage[3] :bgImage[index]})`}">
				<text>TOP{{ index + 1 }}</text>
			</view>
			
			<view class="shop-info-evaluate">
				<view class="comment" v-if="item.skuLable">
					<block v-if="item.skuLable.baseLabel.comment">						
						<text>{{item.skuLable.baseLabel.comment | saleNumCount}}评论</text> 
					</block>
					<block v-if="item.skuLable.baseLabel.applauseRate != '0'">						
						<text>{{item.skuLable.baseLabel.applauseRate}}%好评</text> 
					</block>
					<block v-if="item.skuLable.baseLabel.salesVolume">
						<text>
							热销{{item.skuLable.baseLabel.salesVolume | saleNumCount}}
						</text>
					</block>
				</view>
			</view>
			<specialProductList :item="item" @tap="goSkuDetail(item)"></specialProductList>			
		</view>
	</template>
	<!-- <u-loadmore v-if="pageList.length > 0" ref="backTop" bg-color="transparent" font-size="22" color="#c3c3c3" margin-bottom="40" margin-top="40" :loadText="loadText" :status="loadStatus"></u-loadmore>    -->
</view>
</template>

<script>

import specialProductList from './specialProductList.vue'

export default {
    components: { 
		specialProductList,
	
	},
	props: {
		moduleData: {
			type: Object,
			default: {},
		},
		tabInfo: {
			type: Object,
			default: {},
		},
		config: {
			type: Object,
			default: {},
		}
	},
    data() {
		return {
			queryForm: {
				pageNum: 0, // 设置起始页码
				pageSize: 10, //返回每页数据的个数
			},
			loadText: {
				loadmore: '上拉加载更多',
				loading: '努力加载中',
				nomore: '我也是有底线的~'
			},
			pageList: [], //放置返回数据的数组
			loadStatus: 'loadmore', // 加载更多样式效果
			isLoading: false, // 是否正在加载
			hasMore: true, // 是否拥有更多
					
			bgColor: {
				0: "linear-gradient(111deg, #615042 0%, #B7966E 100%)",
				1: "linear-gradient(111deg, #413F40 0%, #828699 100%)",
				2: "linear-gradient(111deg, #27211A 0%, #81624F 100%)",
				3: "linear-gradient(111deg, #282828 0%, #2A2827 100%)"
			},
			bgImage: {
				0: this.$oss + 'wsf-mall/paihangbang/tags1.png',
				1: this.$oss + 'wsf-mall/paihangbang/tags2.png',
				2: this.$oss + 'wsf-mall/paihangbang/tags3.png',
				3: this.$oss + 'wsf-mall/paihangbang/tags4.png'
			}
		}
    },
	filters: {     
      saleNumCount(val) {
        if (val && Number(val) > 999) {
          return '999+'
        } else if(val && Number(val) > 99) {
          return parseInt(Number(val) / 100) + '00+'
        } else {
          return val
        }
      }
	},

	watch: {
		tabInfo: {
			handler: function () {
				// 是否有更多标识初始化
				this.hasMore = true;
				this.queryForm = Object.assign({}, this.queryForm, {
					id: this.moduleData.id,
					secondCateId: this.tabInfo.id || '',
					topRule: parseInt(this.config.topRule),
					pageNum: 0, // 页码初始化
				})
				this.loadUserCollectionList();
			},
			immediate: true
		}
	},

	mounted(){
	},
	onReachBottom() {
		this.loadUserCollectionList();
	},
    methods: {
		loadUserCollectionList() {	
			if (this.isLoading || !this.hasMore) return;
			this.isLoading = true;
			this.loadStatus = 'loading';
			let data = this.queryForm
			this.$u.api.selectSubjectRanking(data).then(res => {
				this.isLoading = false;
				this.loadStatus = 'loadmore';
				if (res.code == 200) {
					let data = res.data || [];
					data.map((item, index) => {
						data[index].show = false
					})
					// 第一页赋值
					if (this.queryForm.pageNum == 0) {
						this.pageList = data;
						// 选取主推商品
						this.dealRecoSkuList();
					} else {
						this.pageList = this.pageList.concat(data);
					}
					this.queryForm.pageNum++;
					this.hasMore = data.length === 10;
					this.loadStatus = data.length === 10 ? 'loadmore' : 'nomore';
					console.log(res,"商品收藏数据");
				}
			});
		},
		// 处理主推商品
		dealRecoSkuList() {
			const {
				topSpuNum
			} = this.config

			this.$emit('altRecoSkuList', this.pageList.slice(0, topSpuNum))
		},
		bgStyle(index){
			if(index>3){
				return {
					'background-image': this.bgColor[3],				
					'background-repeat': 'no-repeat',
					'background-size': 'cover',
				}
			} else {
				return {
					'background-image': this.bgColor[index],				
					'background-repeat': 'no-repeat',
					'background-size': 'cover',
				}
			}
		},	
		
		goSkuDetail(item) {
			this.$wsf.go('SkuDetail', { skuId: item.id });
		}
		
		
	}		
}
</script>

<style scoped lang="less">
.special-shopList{
	.applet-empty{
		justify-content: center;
		padding-top: 0;
	}
	.sku-list-item{
		margin-top: 53rpx;
		border-radius: 18rpx;
		padding: 77rpx 10rpx 10rpx;
		position: relative;		
		>.top-icon{
			position: absolute;
			z-index: 88;
			padding-top: 17rpx;
			width: 213.6rpx;
			height: 88.6rpx;
			top: -23rpx;
			left: -7rpx;
			background-size: 100% 100%;
			text-align: center;
			>text{
				
				// left: 56rpx;
				font-size: 34rpx;
				font-family: Arial;
				font-weight: bold;
				color: #251811;
			}
		}
		
		// 评价
		.shop-info-evaluate {
			position: absolute;
			z-index: 99;
			top: 24rpx;
			left: 213rpx;
			display: flex;
			overflow: hidden;
			// width: 100%;
			font-size: 22rpx;
			color: #999999;
			.comment{
				text{
					display: inline-block;
					background: rgba(253, 246, 238, .1);
					padding: 0 10rpx;
					height: 32rpx;
					line-height: 32rpx;
					border-radius: 16rpx;
					margin-right: 10rpx;
					font-size: 20rpx;
					font-family: PingFang SC;
					font-weight: 400;
					color: #FFFFFF;
				}
			}
		}
	}
	.u-load-more-wrap, .u-more-text{
		background: transparent !important;
	}
}
</style>

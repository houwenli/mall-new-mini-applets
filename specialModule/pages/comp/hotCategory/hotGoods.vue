<template>
	<view class="hot-goods">	
		<!-- 背景图、规则 -->
		<view class="hot-goods-box" @click="toDetails" :style="{ backgroundImage : 'url(' + advBgImg + ')' }">
		</view>

		<view class="hot-goods-contaier-panel" :style="{
			backgroundImage: 'url(' + mainBgImg + ')',
			backgroundColor: mainBgColor
		}">
			<hotCarousel :config="config"></hotCarousel>

			<!-- 楼层 -->
			<view class="hot-goods-contaier" v-for="(item, index) in shopList" :key="index">
				<view class="hot-goods-contaier-header">
					<text class="text">{{ item.floorTitle }}</text>
				</view>
				<hotShopList v-if="index % 2 == 0" :floorSpuIds="item.floorSpuIds" :index="index" showStyle="column"></hotShopList>
				<hotShopList v-if="index % 2 !== 0" :floorSpuIds="item.floorSpuIds" :index="index"></hotShopList>								
			</view>
		</view>
		
	</view>
</template>

<script>
// import oddHotShopList from './oddHotShopList.vue'
// import evenHotShopList from './evenHotShopList.vue'
import hotShopList from './hotShopList.vue'
import hotCarousel from './hotCarousel.vue'
export default {
    components: { hotShopList, hotCarousel },
    data() {
		return {
			active: 0,
		}
    },
	props: {
		moduleData: {
			type: Object,
			default: {},
		},
		config: {
			type: Object,
			default: {},
		},
	},
	computed: {
		shopList () {
			let {
				floorContents = []
			} = this.config;
			// 处理楼层信息
			return floorContents.sort((pre, next) => {
				return pre.floorNum - next.floorNum
			})
		},
		// 取背景图片
        advBgImg () {
            return this.config && this.config.advAndrankImgUrl || 'https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/paihangbang/bg.png'
        },
		// 取背景样式
		mainBgImg() {
			return this.config.backImgUrl ? `url(${this.config.backImgUrl})` : '';
		},
		mainBgColor() {
			return this.config.backColorValue || '';
		}
	},
    methods: {
		// tabClick(name,title){		
		// 	this.active = name							
		// },
		//详情
		toDetails() {
			let id = this.config.link || ''
			if (id !== 0 && !id) {
				return
			} else {
				this.$wsf.go('SkuDetail',{skuId: id})
			}
		},
    },
}
</script>

<style scoped lang="less">
.hot-goods{	
	height: 100%;
	width: 100%;
	&-box{
		height: 450rpx;
		background: url('https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/paihangbang/bg.png')  no-repeat;
      	background-size: 100% 100%;
	}
	&-tab{
		padding: 38rpx 24rpx 0;			
		display: flex;
		box-sizing: border-box;		
		&-item{
			flex: 1;
			font-size: 30rpx;
			font-family: PingFang SC;
			font-weight: 300;
			color: #FFFFFF;
			text-align: center;
			padding: 22rpx 0;										
		}	
		&-active{
			font-weight: bold;
			position: relative;
			border-radius: 36rpx;
			border: 1rpx solid #FFFFFF;
		}		
	}
	.hot-goods-contaier-panel {
		padding: 40rpx 0 58rpx 0;
	}
	.hot-goods-contaier{
		padding: 50rpx 0 0;
	}

	/deep/ .van-tabs{
		>view{
			padding: 38rpx 24rpx 0;	
		}
		.van-tab{
			font-size: 30rpx;
			font-family: PingFang SC;
			font-weight: 300;
			color: #FFFFFF;		
			padding: 22rpx 0;
		}
		.van-tabs__wrap{
			height: auto;
		}
		.van-tabs__nav{
			background: transparent;
		}
		.van-tabs__content{
			padding-top: 0;
		}
		.van-tabs__line{
			background-color: transparent;
			.van-tabs__wrap{
				height: auto;
			}
		}
		.van-tab--active{
			font-weight: bold;
			border-radius: 36rpx;
			border: 1rpx solid #FFFFFF;
		}
		.van-tabs__nav--line{
			padding-bottom: 0;
			height: auto;
		}

	}
	&-contaier{
		padding: 68rpx 24rpx 0;
		&-header{
			display: flex;
			align-items: center;
			justify-content: center;
			margin-bottom: 30rpx;
			.text{
				font-size: 36rpx;
				font-family: Source Han Sans CN;
				font-weight: bold;
				color: #FFFFFF;	
			}

		}		
	}
	&-contaier:not(:first-child){
		padding-top: 30rpx;
	}	
}
</style>

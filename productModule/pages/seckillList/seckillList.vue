<template>
	<view class="seckill-list">
		<wsf-nav-bar :placeholder="true" :image="imageInfo" @onBackBtnClick="onBackBtnClick" :fixed="true" :hasBack="true" :status-bar="true" :shadow="false" bgColor="linear-gradient(90deg, #EB465F 0%, #EB482C 100%)">
		</wsf-nav-bar>
		<view class="bg"></view>
		<view class="bg-img u-margin-bottom-24">
			<view class="images">
				<image :src="mobilePic"></image>
			</view>
		</view>
			<u-sticky :offset-top="statusBarHeight">
				<view class="seckill-time" :style="{background:isStyle?'#fff':'#f5f5f5'}">
					<view class="img">
						<image src="../../../static/img/Spike_b.png"></image>
					</view>
					<view class="time-list">
						<view class="item" v-for="(item,index) in secenesList" :key="index">
							<view style="width: 100rpx;" @click="switchFun(index,item)">
								<view :class="['time-item', styleIndex===index?'time-item-style':'']">
									{{item.time}}
								</view>
								<view :class="['label-item', styleIndex===index?'label-item-style':'']">
									{{item.label}}
								</view>
							</view>
						</view>
					</view>
				</view>
			</u-sticky>
		<!-- 抢购商品列表 -->
		<view class="product-list" v-if="seckillsceneList.length">
			<view class="item u-margin-bottom-24" v-for="(item,index) in seckillsceneList" :key="index" @click="goSkuDetail(item)">
				<view class="left-img">
					<image v-if="item.url" :src="item.url" mode=""></image>
					<image v-else src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/prev-icon-list/Avatar_default.png" mode=""></image>
				</view>
				<view class="right">
					<view class="title u-line-2">
						{{item.name}}
					</view>
					<!-- <view class="progress">
						 <template v-if="styleIndex===0&&styleLabel==='抢购中'">
						 	<view class="line-progress">
						 		<u-line-progress :height="20" :show-percent="false" style="width: 180rpx;" :inactive-color="item.progress==100?'#F2F2F2':'#F8D8C9'" :active-color="item.progress==100?'#F2F2F2':'#FFA000'" :percent="item.progress"></u-line-progress>
						 	</view>
						 	<text class="line-progress-txt" :style="item.progress==100?'#BABABA':'#E60113'">已抢{{item.progress == 100 ? '完': item.progress+'%'}}</text>
						 </template>
					</view> -->
					<view class="price">
						<view class="price-left">
							<text class="txt-1">￥</text>
							<text class="txt-2">{{item.seckillPrice}}</text>
							<text v-if="String(priceFilter(item.seckillPrice)).length<7" class="txt-3">￥{{priceFilter(item.price)}}</text>
						</view>
						<view v-if="styleIndex===0&&styleLabel==='抢购中'" :class="item.progress != 100?'price-btn':'price-btn-item'" @click.stop="goSkuDetail(item)">
							{{item.progress==100?'已售罄':'去抢购'}}
						</view>
					</view>
				</view>
			</view>
		</view>
		<view v-else style="text-align: center; margin-top: 50rpx;color: #999;">暂无数据</view>
	</view>
</template>

<script>
	import wsfNavBar from '@/components/wsf-nav-bar/wsf-nav-bar.vue';
	import { priceFilter } from '@/common/wsfValidate'
	import {visit} from '@/common/visit.js'
	export default {
		components: {
			wsfNavBar,
		},
		data() {
			return {
				choseSeckillTime:null,
				seckillParams:{
					seckillSceneId:null,
					pageNum:0,
					pageSize:10
				},
				imageInfo:{
					url:'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com///c1378c6448cf828e1027ccbe0bb89922.png',
					width:'192rpx',
					height:'44rpx',
				},
				statusBarHeight: getApp().globalData.statusBarHeight*2+80, // 当前手机顶部状态栏高度,单位px
				styleIndex:0,
				styleLabel:'即将开始',
				isStyle:false,
				mobilePic:null,
				secenesList:[],
				seckillsceneList:[],
				priceFilter,
			}
		},

		onPageScroll(e) {
			if(this.statusBarHeight < e.scrollTop){
				this.isStyle=true
			}else {
				this.isStyle = false
			}
		},
		onReachBottom() {
			this.seckillParams.pageNum++
			this.panicBuySeckillscene()
			console.log("到底了");
		},
		onShow(){
			console.log("我来秒杀页了-----");
			 visit(this,"秒杀页")
			this.queryseckilldetail()
		},
		methods: {
			// 秒杀场次列表数据
			queryseckilldetail(){
				this.$u.api.Queryseckilldetail().then(res => {
					this.secenesList = []
					this.mobilePic = res.data.mobilePic
					let data = this.$u.deepClone(res.data.secenes)
					this.seckillParams.seckillSceneId = data[0].seckillSceneId
					let label = null,secen = null,seckillTime=null,m=null,d=null
					for(let i = 0; i < data.length; i++){
						secen = data[i].secen
						secen = parseInt(secen.split(":")[0])
						// 转化成时间戳
						seckillTime = new Date(data[i].seckillTime.replace(/-/g,"/")).getTime()
						m = this.$u.timeFormat(seckillTime,"m") //月
						d = this.$u.timeFormat(seckillTime,"d") //日
						// 格式化时间
						seckillTime = this.$u.timeFormat(seckillTime,"m.dd")
						if(new Date().getHours() === secen && m == (new Date().getMonth()+1) && d == new Date().getDate()){
							label = '抢购中'
						}else if(m == (new Date().getMonth()+1) && d == new Date().getDate()){
							label = '即将开始'
						}else {
							label = `${seckillTime}日抢`
						}
						this.secenesList.push({label,time:data[i].secen,seckillSceneId:data[i].seckillSceneId,seckillTime:data[i].seckillTime})
					}
					let redundant = []
					let that = this
					if(this.secenesList.length === 6){
						redundant = this.secenesList.splice(5)
					}
					let end_time = (new Date().getTime()-new Date(this.secenesList[0].seckillTime.replace(/-/g, "/")).getTime())
					// if(end_time > 0){
						end_time = Math.abs(3600*1000 - end_time)
						let st = setTimeout(function(){
							that.secenesList.splice(0,1)
							that.secenesList[0].label = '抢购中'
							if(redundant.length){
								that.secenesList.pop(redundant[0])
							}
							that.seckillParams.seckillSceneId = that.secenesList[0].seckillSceneId
							let seckillObj = {
								seckillSceneId:that.seckillParams.seckillSceneId,
								seckillTime:this.secenesList[0].seckillTime,
								seckillLabel:that.secenesList[0].label
							}
							that.switchFun(0,seckillObj)
							clearTimeout(st)
						},end_time)
					// }

					console.log((new Date().getTime()-new Date(this.secenesList[0].seckillTime.replace(/-/g, "/")).getTime()),end_time,'redundant');
					this.seckillParams.seckillSceneId = this.secenesList[0].seckillSceneId
					this.switchFun(0,{seckillSceneId:this.seckillParams.seckillSceneId,seckillTime:this.secenesList[0].seckillTime,seckillLabel:that.secenesList[0].label})
				})
			},
			// 查询秒杀商品列表
			panicBuySeckillscene(){
				this.$u.api.PanicBuySeckillscene(this.seckillParams).then(res => {
					console.log(res,"查询秒杀商品列表");
					if(!res.data&&this.seckillParams.pageNum==0){
						this.seckillsceneList = []
						return
					}
					if(res.data == null&&this.seckillParams.pageNum!==0) return false
					let list = this.$u.deepClone(res.data.list)
					for(let i = 0; i < list.length; i++){
						list[i].progress = (((list[i].originalStockSum-list[i].stock) / list[i].originalStockSum)*100).toFixed(0)
						if(list[i].progress < 0) list[i].progress = 0
						if(list[i].stock == 0) list[i].progress = 100
						this.seckillsceneList.push(list[i])
					}

				})
			},
			goSkuDetail(item){
				// if(item.progress == 100) return false
				this.$wsf.go('SkuDetail',{startTime:this.choseSeckillTime,skuId: item.skuId,active:13})
			},
			onBackBtnClick(){
				// uni.navigateBack()
				console.log("我点击了返回---+++");
				this.$wsf.go('Index')
			},
			switchFun(index,data){
				this.choseSeckillTime = data.seckillTime
				console.log(data,'this.choseSeckillTime');
				this.styleIndex = index
				this.styleLabel = data.seckillLabel
				this.seckillParams.seckillSceneId = data.seckillSceneId
				this.seckillsceneList = []
				this.seckillParams.pageNum = 0
				this.panicBuySeckillscene()

			}
		}
	}
</script>

<style scoped lang="scss">
.seckill-list{
	// background: #F5F5F5;
	height: 100%;
	.nav-search-bar-img {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 44px;
	}
	.bg{
		z-index: -1;
		position: absolute;
		width: 100%;
		height: 220rpx;
		background: linear-gradient(90deg, #EB465F 0%, #EB482C 100%);
		border-radius: 0px 0px 10px 10px;
	}
	.bg-img{
		margin-top: 30rpx;
		padding: 0 24rpx;
		.images,image {
			width: 100%;
			height: 280rpx;
			border-radius: 20rpx;
		}
		.images {
			background-image: url('https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/prev-icon-list/Avatar_default.png');
			background-repeat: no-repeat;
			background-size: 100% 100%;
			margin-right: 24rpx;
		}
	}
	.seckill-time {
		width: 100%;
		height: 96rpx;
		padding: 0rpx 24rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		background: #F5F5F5;
		.img {
			width: 68rpx;
			margin-right: 44rpx;
			image {
				width: 68rpx;
				height: 68rpx;
			}
		}
		.time-list{
			width: 100%;
			display: flex;
			// justify-content: space-between;
			align-items: center;
			text-align: center;
			.item{
				margin-right: 10rpx;
			}
			.label-item {
				font-size: 22rpx;
				font-weight: 400;
				color: #666666;
			}
			.time-item {
				padding-bottom: 5rpx;
				font-size: 32rpx;
				font-weight: 600;
				color: #000000;
			}
			.label-item-style{
				color: #FFFFFF;
				width: 100rpx;
				height: 32rpx;
				line-height: 32rpx;
				background: #E60113;
				border-radius: 16rpx;
			}
			.time-item-style{
				color: #E60113;
			}
		}
	}
	.product-list {
		margin-top: 24rpx;
		padding: 24rpx;
		padding-top: 0;
		width: 100%;
		.item {
			width: 100%;
			display: flex;
			background-color: #FFFFFF;
			border-radius: 20rpx;
			padding: 24rpx;
			.left-img {
				width: 224rpx;
				height: 224rpx;
				margin-right: 24rpx;
				image{
					width: 224rpx;
					height: 224rpx;
				}
			}
			.right {
				flex: 1;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				.progress {
					display: flex;
					align-items: center;
					.line-progress-txt {
						font-size: 20rpx;
					}
					.line-progress{
						width: 180rpx;
						margin-right: 10rpx;
					}
				}
				.price {
					display: flex;
					justify-content: space-between;
					align-items: center;
					.price-left {
						.txt-1{
							font-size: 24rpx;
							font-weight: 400;
							color: #E60113;
						}
						.txt-2{
							font-size: 40rpx;
							font-weight: 500;
							color: #E60113;
						}
						.txt-3 {
							margin-left: 10rpx;
							text-decoration: line-through;
							font-size: 22rpx;
							font-weight: 400;
							color: #999999;
						}
					}
					.price-btn {
						width: 150rpx;
						height: 56rpx;
						background: #E60113;
						border-radius: 28rpx;
						line-height: 56rpx;
						text-align: center;
						font-size: 26rpx;
						font-weight: 500;
						color: #FFFFFF;
					}
					.price-btn-item {
						width: 150rpx;
						height: 56rpx;
						border-radius: 28rpx;
						line-height: 56rpx;
						text-align: center;
						font-size: 26rpx;
						font-weight: 500;
						background:#f2f2f2;
						color:#BABABA;
					}
				}
			}
		}
	}

}
</style>

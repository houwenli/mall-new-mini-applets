<!-- 智慧生活sku属性弹窗 -->
<template>
	<u-popup :value="show" mode="bottom" border-radius="24" :safe-area-inset-bottom="true" @close="close" :mask-custom-style="maskCustomStyle">
		<view class="popup">
			<image src="@/static/img/icon/close-icon.png" class="popup-close-icon" @click="close()"></image>
			<view class="sku-info">
				<image
					class="sku-img"
					:src="skuImg"
					@click="goodsimgShow()"
				></image>
				<view class="sku-text" v-if="skuDetail.id">
					<view class="txt_item">
						<!-- 添加福气值逻辑 -->
						<view class="fqz-price" v-if="skuDetail.integralPoint > 0">
							<text>
								<text class="special">
									{{ skuDetail.integralPoint }}
								</text>
								福气值+
								<text>
									{{ skuDetail.deductionAfterPrice | fenToYuan }}
								</text>
								元
							</text>
						</view>
						<template v-else>
							<text class="txt_1">￥</text>
							<text class="txt_2">{{skuDetail.priceInt}}</text>
							<text class="txt_1">{{'.' + skuDetail.priceDecimal}}</text>
						</template>
					</view>
					<view class="performate-point" v-if="skuDetail.performanceScore && skuDetail.performanceScore > 0">
						<span class="performate-point-label">绩效分:</span><span class="performate-point-num">{{ skuDetail.performanceScore }}</span>
					</view>
					<view class="select-prop">{{ selectProp }}</view>
				</view>
			</view>
			<scroll-view scroll-y="true" class="sku">
				<view class="sku-item" v-for="(prop, index) in propList" :key="index">
					<view class="sku-name">{{ prop.k }}</view>
					<view class="sku-val">
						<view
							v-for="(propVal, index_v) in prop.items"
							:class="['sku-val-item', selectedSku.indexOf(propVal.id) >= 0 ? 'pitch-on' : '', propVal.disabled ? 'disable' : '']"
							@click="pitchOnFun(propVal)"
							:key="index_v"
						>
							<view class="u-line-1">{{ propVal.name }}</view>
						</view>
					</view>
				</view>
			</scroll-view>
			<view class="btn-content">
				<view class="btn-item" @click="skuConfirm">确定</view>
			</view>
		</view>
	</u-popup>
</template>
<script>
import { getSplitPrice, fenToYuan } from '@/common/utils.js';
export default {
	props:{
		show:{
			type: Boolean,
			default: false
		},
		skuData: {
			type: Object,
			default: {}
		},
	},
	data() {
		return {
			// 页面数据
			activeImg: '', // 选择属性时的商品图片，兜底从skuList中获取
			propList: [], // 规格属性数组 二维数组，属性名和属性值
			skuList: [], // sku商品列表
			selectedSku: [], // 选中的属性数据
			initialSku: {}, // 初始化数据
			initialSkuArr: [], // 选中属性数组
			skuDetail: {}, // 当前选中sku
		}
	},
	computed: {
		maskCustomStyle() {
			return {
				backgroundColor: 'rgba(0, 13, 29, 0.6)'
			}
		},
		// 商品图片
		skuImg() {
			return this.activeImg
				? this.activeImg
				: ((this.skuList[0] || {}).imgUrl || '')
		},
		// 获取已选属性
		selectProp() {
			let str = ''
			if(this.skuDetail && this.skuDetail.name) {
				str = `已选${this.skuDetail.name}`
			}
			return str
		}
	},
	watch: {
		skuData() {
			this.dealSkuData()
		},
		// 根据选中信息做一些处理
		selectedSku() {
			// 获取当前sku
			this.skuDetail = this.getSkuBySelectedSku() || {}

			// 获取图片
			this.activeImg = this.skuDetail.imgUrl

			// 计算各属性是否可选
			this.calcSkuDisabled()
		},
	},
	created() {
		this.dealSkuData()
	},
	filters: {
		fenToYuan
	},
	methods: {
		goodsimgShow() {
			this.$emit("goodsImgShow", this.skuImg)
		},
		// 拆分数据，重新赋值
		dealSkuData() {
			let skuData = this.$u.deepClone(this.skuData)

			this.propList = skuData.skuitems || []
			this.selectedSku = (skuData.initialSku || '').split(',')
			this.skuList = (skuData.skuList || []).map(item => {
				// 不相信后台数据，返回从小到大的组合字符串，后续匹配效率更高
				let skuIdsArr = (item.skuIds || '').split(',') || []
				let dealSkuIds = skuIdsArr.sort((a, b) => a - b).join(',')

				// 处理价格
				item._price = fenToYuan(item.price)
				let priceObj = getSplitPrice(item._price) || {}

				return {
					...item,
					hasStock: item.stock_num > 0, // 库存信息
					dealSkuIds, // 处理之后的属性字符串
					priceInt: priceObj.int,
					priceDecimal: priceObj.decimal,
				}
			})
		},

		// 根据当前各个属性选择，判断当前属性值是否可选
		// 判断条件是是否有库存
		calcSkuDisabled() {
			this.propList.forEach(prop => {
				prop.items.forEach(propVal => {
					propVal.disabled = !this.judgeValid(propVal.id)
				})
			})
		},

		// 根据selectedSku获取匹配的sku
		// 支持传入属性id查询
		getSkuBySelectedSku(propId) {
			// 深拷贝的原因是防止运算时，触发监听
			let selectedSku = this.$u.deepClone(this.selectedSku)
			if (propId) {
				selectedSku = this.altSelectedSku(propId)
			}
			let skuIds = selectedSku.sort((a, b) => a - b).join(',')
			return this.skuList.find(item => item.dealSkuIds == skuIds)
		},

		// 判断是否有效
		judgeValid(propId) {
			let sku = this.getSkuBySelectedSku(propId) || {}
			return sku.hasStock
		},

		// 修改selectedSku，这一步比较麻烦，首先需要剔除所有同规格下的属性，然后把当前属性加入selectedSku
		altSelectedSku(propId) {
			let selectedSku = this.$u.deepClone(this.selectedSku)

			// 找到所属规格
			let prop = this.propList.find(eachProp => {
				let eachPropArr = eachProp.items || []
				return eachPropArr.find(propVal => {
					return propVal.id == propId
				})
			})

			// 遍历所属规格属性，删除
			if (prop) {
				prop.items.forEach(propVal => {
					let index = selectedSku.indexOf(propVal.id)
					if (index >= 0) {
						selectedSku.splice(index, 1)
					}
				})
			}
			// 把新属性添加进去
			selectedSku.push(propId)
			return selectedSku
		},

		// 属性选中
		pitchOnFun(propVal) {
			// 无法选中直接中断
			if (propVal.disabled) {
				return
			}
			// 修改selectedSku
			this.selectedSku = this.altSelectedSku(propVal.id)
		},
		skuConfirm(){
			this.$emit("skuConfirm", {
				skuId: this.skuDetail.id
			})
		},
		close(){
			this.$emit('update:show',false)
		}
	}
}
</script>
<style lang="scss">
.popup {
	color: #000000;
	position: relative;
	background-color: #fff;
	padding: 30rpx 0rpx 96rpx 0rpx;
	padding-bottom: calc(96rpx + constant(safe-area-inset-bottom));
	padding-bottom: calc(96rpx + env(safe-area-inset-bottom));
	.popup-close-icon {
		width: 54rpx;
		height: 40rpx;
		position:absolute;
		right: 24rpx;
		top: 30rpx;
	}
	.sku-info {
		display: flex;
		padding: 0rpx 24rpx;
		.sku-img {
			width: 204rpx;
			height: 204rpx;
			border-radius: 16rpx;
			margin-right: 16rpx;
		}
		.sku-text {
			flex: 1;
		}
		.txt_item {
			display: flex;
			align-items: flex-end;
			color: #fe3040;
		}
		.txt_1 {
			font-size: 32rpx;
			font-family: DINAlternate-Bold, DINAlternate;
			font-weight: bold;
			line-height: 40rpx;
		}
		.txt_2 {
			font-size: 60rpx;
			font-family: DINAlternate-Bold, DINAlternate;
			font-weight: bold;
			line-height: 58rpx;
		}
		.select-prop {
			font-size: 26rpx;
			color: #999999;
			line-height: 34rpx;
			margin-top: 8rpx;
		}
		.fqz-price {
			display: inline-block;
			font-size: 32rpx;
			font-weight: 600;
			color: #FE3040;
			.special {
				font-size: 60rpx;
			}
		}
	}
	.sku {
		margin-top: 32rpx;
		height: 504rpx;
		box-sizing: border-box;
		.sku-item{
			margin: 0rpx 24rpx;
		}
		.sku-name{
			font-size: 26rpx;
			font-weight: 500;
			color: #191919;
			line-height: 34rpx;
			padding-bottom: 16rpx;
		}
		.sku-val {
			display: flex;
			flex-wrap: wrap;
			align-items: center;
			&-item {
				display: flex;
				align-items: center;
				justify-content: center;
				box-sizing: border-box;
				padding: 0 24rpx;
				margin-right: 24rpx;
				height: 56rpx;
				min-width: 126rpx;
				background: #f6f6f6;
				border-radius: 28rpx;
				margin-bottom: 16rpx;
				border: 1rpx solid #f6f6f6;
				.u-line-1 {
					font-weight: 400;
					font-size: 26rpx;
					line-height: 26rpx;
					color: #191919;
				}
			}
		}
		.pitch-on {
			border: 1rpx solid #fe3040;
			background: rgba(254,48,64,0.06);
			.u-line-1 {
				color: #fe3040;
			}
		}
		.disable {
			background-color: #f2f2f2;
			border: 1px solid #f2f2f2;
			color: #bababa;
		}
	}
	.btn-content {
		width: 100%;
		padding: 8rpx 0rpx;
		background: #FFFFFF;
		box-shadow: 0rpx -4rpx 20rpx 0rpx rgba(189,194,204,0.2);
		position: fixed;
		bottom:constant(safe-area-inset-bottom);
		bottom:env(safe-area-inset-bottom);;
		left: 0;
		.btn-item{
			width: 702rpx;
			height: 80rpx;
			line-height: 80rpx;
			text-align: center;
			background: $wsf-linear-bg;
			border-radius: 40rpx;
			font-size: 32rpx;
			font-weight: 500;
			color: #fff;
			margin: auto;
		}
		.exchange-goods-hint-text {
			font-size: 22rpx;
			color: #999999;
			line-height: 30rpx;
			margin: 4rpx 0rpx 12rpx 0rpx;
			text-align: center;
		}
	}
}

.performate-point {
	display: inline-block;
	border-radius: 8rpx;
	background: linear-gradient(90deg, #ECFFFC 0%, #F4FAFF 100%);
	font-size: 22rpx;
	font-family: PingFangSC-Regular, PingFang SC;
	color: #008864;
	line-height: 28rpx;
  margin: 8rpx 0rpx 14rpx 0rpx;
	.performate-point-label {
		background: url('https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/prev-icon-list/jixiao.png') left center no-repeat;
		padding-left: 28rpx;
		background-size: 28rpx;
	}
	.performate-point-num {
		font-size: 20rpx;
		font-family: ArialMT;
	}
}
</style>
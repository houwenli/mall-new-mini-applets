<template>
	<u-popup v-model="baseShow" mode="bottom" border-radius="24" :safe-area-inset-bottom="true" @close="close"
		:mask-custom-style="{ backgroundColor: 'rgba(0, 13, 29, 0.6)' }">
		<view class="popup">
			<image src="@/static/img/icon/close-icon.png" class="popup-close-icon" @click="close()"></image>
			<view class="sku-info">
				<image class="sku-img" :src="activeImg" @click="goodsimgShow()"></image>
				<view class="sku-text">
					<!-- <view class="performance-part" v-if="specPerformanceScore">
							绩效分{{specPerformanceScore}}
						</view> -->
					<view class="spu-price">
						<view class="txt_item">
							<text class="txt_1">￥</text>
							<!-- <text class="txt_2">{{ skuDetail.price }}</text> -->
							<text class="txt_2">{{ skuPriceInt(skuDetail.price) }}</text>
							<text class="txt_1">{{ '.' + skuPriceFloat(skuDetail.price) }}</text>
						</view>

						<!-- 划线价格 -->

						<div v-if="skuDetail.oldPrice != skuDetail.price && !skuDetail.afterCouponPrice"
							class="active-price" style="position: relative">
							<span class="line"></span>
							<span class="spu_price_btn_icon">¥</span>
							<span class="spu_price_btn_pre_price">{{ skuPriceInt(skuDetail.oldPrice) }}</span>
							<span class="spu_price_btn_dian_price">.{{ skuPriceFloat(skuDetail.oldPrice) }}</span>
						</div>


						<!-- 券后价格 -->
						<view class="spu_price_btn" v-if="skuData.afterCouponPrice && skuData.afterCouponPrice > 0">
							<text class="spu_price_btn_text">券后</text>
							<text class="spu_price_btn_icon">¥</text>
							<text class="spu_price_btn_pre_price">{{ skuPriceInt(skuData.afterCouponPrice) }}</text>
							<text class="spu_price_btn_dian_price">.{{ skuPriceFloat(skuData.afterCouponPrice) }}</text>
						</view>
					</view>

					<view class="performate-point" v-if="skuData.performanceScore > 0">
						<span class="performate-point-label">绩效分:</span><span class="performate-point-num">{{
							skuData.performanceScore }}</span>
					</view>


					<!-- <view class="performance-mark" v-if="skuDetail.performanceScore && skuDetail.performanceScore > 0">绩效分{{ skuDetail.performanceScore }}</view> -->
					<!-- <view class="no">
							<text>编号：{{ skuDetail.id }}</text>
						</view> -->
					<view class="select-prop">{{ selectPropFn(selectProItem[0]) }}</view>
				</view>
			</view>
			<scroll-view scroll-y="true" class="sku">
				<view class="sku-item" v-for="(treeItem, index) in tree" :key="index">
					<view class="sku-name">{{ treeItem.k }}</view>
					<view class="sku-val">
						<view v-for="(v, index_v) in treeItem.v"
							:class="['sku-val-item', initialSkuArr.indexOf(v.id) >= 0 ? 'pitch-on' : '', v.disabled && !isExchangeGoods ? 'disable' : '']"
							@click="pitchOnFun(v, treeItem)" :key="index_v">
							<!-- <image v-if="v.imgUrl" style="margin-top: -8rpx;vertical-align: middle;;width:44rpx;height:44rpx" :src="v.imgUrl" mode=""></image> -->
							<view class="u-line-1">{{ v.name }}</view>
						</view>
					</view>
				</view>

				<view
					class="u-flex u-row-between u-padding-top-14 u-padding-bottom-20 u-padding-left-32 u-padding-right-32">
					<b style="font-weight: bold">数量</b>

					<view class="wsf-number-box">

						<view class="minus" @click="minusFun()">
							<u-icon name="minus" :color="addNum !== 1 ? '#000' : addNum == 1 ? '#d8d8d8' : '#000'
								"></u-icon>
						</view>
						<view class="num">
							<input type="number" v-model="addNum" @input="minusInput($event)" @blur="minusBlur($event)" />
						</view>
						<view class="plus" @click="plusFun()">
							<u-icon class="add_icon" name="plus" :color="addNum < limitAddNum && addNum !== limitAddNum
								? '#000'
								: addNum == limitAddNum
									? '#d8d8d8'
									: '#bababa'
								"></u-icon>
						</view>
					</view>
				</view>
			</scroll-view>

			<view class="spec-btn">
				<!---start 不是虚拟商品不显示加入购物车 skuDetail.isVirtual == 0-->
				<view class="common-btn add-cart" :class="{ 'btn-grey': skuDetail.sellOut || skuDetail.isGift == 1 }" v-if="openType === 1" @click="skuConfirm">加入购物车</view>
				<!--end 不是虚拟商品不显示加入购物车-->
				<view class="common-btn bug-now" :class="{ 'btn-grey': skuDetail.sellOut || skuDetail.isGift == 1 }" v-if="openType === 2" @click="skuConfirm">
					立即购买
				</view>
			</view>

		</view>
	</u-popup>
</template>

<script>
export default {
	props: {
		show: {
			type: Boolean,
			default: false
		},
		skuData: {
			type: Object
		},
		ShopNum: {
			type: Number,
			default: 1
		},
		nowSourceType: {
			type: [String,Number],
			default: 1
		},

		openType: {
			type: Number,
			default: 1
		}
	},
	data() {
		return {
			specPerformanceScore: null,
			sku_data: {},
			skuId: '',
			skuName: '',
			skuDetail: {},
			initialSku: {},// 条件属性
			initialSkuArr: [], // 条件属性数组
			filterList: [], // 依据条件过滤的sku数组
			tree: [], // 选项列表
			activeImg: '',
			selectProItem: [], // 已选数组
			addNum: 1
		};
	},
	created() {
		// this.init()
	},
	watch: {
		skuData: {
			handler(newVal, oldVal) {
				this.sku_data = this.$u.deepClone(newVal)
				this.init(this.resetInitSku)
				this.resetInitSku = false
			},
			deep: true
		},
		initialSku: {
			handler(n, o) {
				this.initialSkuArr = []
				for (let i in n) {
					if (n[i]) {
						this.initialSkuArr.push(n[i]); //属性
					}
				}
			},
			deep: true
		}
	},


	computed: {

		baseShow: {
			get() {
				return this.show
			},
			set(val) {
				this.resetInitSku = true
				this.$emit('update:show', val)
			}
		},
		marketingVos({ skuData }) {
			let marketingVos = []

			if (skuData.marketingVos && skuData.marketingVos.length > 0) {
				marketingVos = skuData.marketingVos
			}

			return marketingVos
		},


		limitAddNum() {
			let limitAddNum = 10000000
			if (!this.filterList.length &&
				!this.marketingVos.length) {
				return limitAddNum
			}
			if (this.marketingVos.length && this.marketingVos[0].type == "13") {
				if (

					this.filterList[0].stock_num >
					this.marketingVos[0].panicBuy.limitNum &&
					this.marketingVos[0].iSeckill
				) {
					if (this.marketingVos[0].panicBuy.limitNum != -1) {
						limitAddNum = this.marketingVos[0].panicBuy.limitNum;
					}
				}
			} else if (
				this.marketingVos.length &&
				this.marketingVos[0].type == "16" &&
				this.marketingVos[0].specialArea.limitNum <
				this.filterList[0].stock_num
			) {
				if (this.marketingVos[0].specialArea.limitNum != -1) {
					limitAddNum = this.marketingVos[0].specialArea.limitNum;
				}
			} else {
				limitAddNum = this.filterList[0].stock_num;
			}
			return limitAddNum
		}
	},

	methods: {
		goodsimgShow(data) {
			let tmp = this.activeImg ? this.activeImg : (this.skuDetail.sku.tree[0].v[0].imgUrl ? this.skuDetail.sku.tree[0].v[0].imgUrl : this.skuDetail.images[0])
			this.$emit("goodsImgShow", tmp)
		},
		init(resetInitSku = true) {
			this.skuDetail = this.sku_data;
			this.tree = this.sku_data.sku.tree.map(el => {
				el.v = el.v.map(eel => {
					eel.disabled = false
					return eel
				})
				return el
			})
			this.tree.forEach((item, index) => {
				if (index != 0) {
					item.v.forEach((temp, i) => {
						temp.imgUrl = ''
						// temp.previewImgUrl = temp.imgUrl
					})
				} else {
					item.v.forEach((temp, i) => {
						temp.previewImgUrl = temp.imgUrl
					})
				}
			})
			resetInitSku && (this.initialSku = this.sku_data.sku.initialSku);
			this.calcSkuDisabled()
		},
		// 按钮点击
		pitchOnFun(v, treeItem) {
			// 替换条件参数
			if (v.disabled) return
			let arrid = this.skuDetail.sku.tree[0].v.map(item => {
				return item.id
			})

			if (arrid.indexOf(v.id) != -1) {
				this.activeImg = v.imgUrl
			}
			this.choseFullSku = false;
			// this.activeImg = v.imgUrl
			this.initialSku[treeItem.k_s] == v.id ? this.initialSku[treeItem.k_s] = null : this.initialSku[treeItem.k_s] = v.id,

			this.calcSkuDisabled()
			this.$emit('updateSku', { skuId: this.skuId })
		},
		// 计算Sku选择属性是否可选
		calcSkuDisabled() {
			this.tree.forEach(treeItem => {
				treeItem.v.forEach(vItem => {
					vItem.disabled = this.filterSku(treeItem.k_s, vItem.id)
				})
			})
		},
		// 过滤当前规格选项
		filterSku(s, sId) {
			console.log('----filterSku---');
			this.filterList = this.skuDetail.list.filter(el => {
				let filterResult = true
				let filterInitialSku = this.$u.deepClone(this.initialSku)
				filterInitialSku[s] = sId
				for (let i in filterInitialSku) {
					if (filterInitialSku[i] && filterInitialSku[i] !== el[i]) {
						filterResult = false
					}
				}
				return filterResult === true
			})

			let hasStock = false
			this.filterList.forEach(filEl => {
				if (filEl.stock_num > 0) {
					hasStock = true
				}
			})
			if (this.filterList.length === 1 && this.initialSku[s] == sId) {
				console.log('找到唯一的skuId了', this.filterList[0]);
				this.skuId = this.filterList[0].id
				this.skuName = this.filterList[0].name

				this.specPerformanceScore = this.filterList[0].performanceScore
				this.choseFullSku = true

				this.selectProItem = this.skuDetail.list.filter(item => {
					return item.id === this.skuId
				})
			}
			this.selectPropFn(this.filterList[0])
			this.activeImg = this.selectProItem[0] ? this.selectProItem[0].imgUrl : ''
			return !hasStock
		},
		skuPriceInt(data) {
			let price = 0;
			if (data) {
				price = Number(data).toFixed(2);
			} else {
				return
			}
			price = price.split('.')[0];
			return price;
		},
		skuPriceFloat(data) {
			let price = '00';
			if (data) {
				price = Number(data).toFixed(2);
			} else {
				return
			}
			price = price.split('.')[1];
			return price;
		},

		// 规格弹窗已选内容
		selectPropFn(filterList) {
			if(filterList) {
                return `已选${filterList.name},${this.addNum}个`
			} else {
                return '请选择'
            }
		},
		close() {
			this.$emit('update:show', false)
		},

		// 步进器 -
		minusFun() {
			if (this.addNum > 1) {
				this.addNum = parseInt(this.addNum) - 1;
			}
		},
		// 步进器 +
		plusFun() {
			if (this.addNum <= this.limitAddNum) {
				this.addNum = parseInt(this.addNum) + 1;
			}
		},
		// 步进器输入框输入时执行
		minusInput(e) {
			this.addNum = e.detail.value;
			if (e.detail.value > this.limitAddNum) {
				this.$nextTick(() => {
					this.addNum = this.limitAddNum
				})
			}
		},
		// 失焦时执行
		minusBlur(e) {
			if (
				e.detail.value !== null &&
				e.detail.value !== "" &&
				e.detail.value > 1
			) {
				if (e.detail.value <= this.limitAddNum) {
					this.addNum = e.detail.value;
				} else if (!this.marketingVos.map((item) => item.type).includes("16")) {
					this.$u.toast(`购买数量不能超过库存数量`);
					this.addNum = this.limitAddNum;
					return;
				} else {
					this.addNum = this.limitAddNum;
				}
			} else {
				this.addNum = 1;
			}
		},

		async checkSeckillLimit(data) {
			let verify = true;
			let obj = {
				isIgnoreCartNum: this.openType === 1,
				buyNowRequestList: [data],
			};
			let res = await this.$u.api.CheckSkuPanicBuyLimitNum(obj);
			if (res.data && res.data.limitNum) {
				if (res.data.hasBoughtNum) {
					// this.addNum = res.data.limitNum - res.data.hasBoughtNum;
					this.$u.toast(
						`限购${res.data.limitNum}件,你已购买过${res.data.hasBoughtNum}件了`
					);
				} else {
					// this.addNum = res.data.limitNum;
					this.$u.toast(`抱歉，该商品限购${res.data.limitNum}件`);
					verify = fasle;
				}
				return;
			}

			return verify
		},

		async skuConfirm() {
			if (this.skuDetail.sellOut == 1 || this.skuDetail.isGift == 1) {
				return
			}
			if (!this.choseFullSku) {
				this.$u.toast('请选择完整的商品规格')
				return
			}
			let data = {
				num: this.addNum,
				skuId: this.skuDetail.id,
				sourceType: this.nowSourceType,
				storeId: this.skuDetail.storeId
			}

			let verify = await this.checkSeckillLimit(data)
			if (!verify) return
			
			this.$emit('skuConfirm', data)
		}
	}
};
</script>

<style lang="scss" scoped>
.popup {
	color: #000000;
	position: relative;
	background-color: #fff;
	padding-top: 30rpx;

	.popup-close-icon {
		width: 54rpx;
		height: 40rpx;
		position: absolute;
		right: 24rpx;
		top: 30rpx;
	}

	.sku-info {
		display: flex;
		// align-items: flex-end;
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

		.spu-price {
			display: flex;
			align-items: flex-end;
		}

		.txt_item {
			display: flex;
			align-items: flex-end;
		}

		.txt_1 {
			font-size: 32rpx;
			font-family: DINAlternate-Bold, DINAlternate;
			font-weight: bold;
			color: #FF0A35;
			line-height: 40rpx;
		}

		.txt_2 {
			font-size: 60rpx;
			font-family: DINAlternate-Bold, DINAlternate;
			font-weight: bold;
			color: #FF0A35;
			line-height: 58rpx;
		}

		.select-prop {
			padding-top: 16rpx;
			font-size: 26rpx;
			color: #999999;
			line-height: 34rpx;
		}
	}

	.sku {
		padding-top: 4rpx;
		margin-top: 24rpx;
		height: 504rpx;
		box-sizing: border-box;

		.sku-item {
			margin: 0rpx 32rpx;
		}

		.sku-name {
			font-size: 26rpx;
			font-weight: 500;
			color: #191919;
			line-height: 34rpx;
			padding: 16rpx 0rpx;

		}

		.sku-val {
			display: flex;
			flex-wrap: wrap;
			align-items: center;

			&-item {
				display: flex;
				align-items: center;
				box-sizing: border-box;
				text-align: center;
				padding: 0 32rpx;
				margin-right: 24rpx;
				height: 56rpx;
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
			border: 1rpx solid #FF0A35;
			background: rgba(255, 231, 235, 0.5);
			;

			.u-line-1 {
				color: #FF0A35;
			}
		}

		.disable {
			background-color: #f2f2f2;
			border: 1px solid #f2f2f2;
			.u-line-1 {
				color: #bababa;
			}
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

.spu_price_btn {
	margin-left: 4px;
	padding: 2px 8px;
	color: #fff;
	font-weight: normal;
	width: fit-content;
	height: 28px;
	line-height: 24px;
	background: linear-gradient(90deg, #ff5f2e 0%, #ff0a35 100%);
	border-radius: 15px 15px 15px 2px;

	.spu_price_btn_text {
		font-size: 11px;
		font-weight: bold;
		color: #ffffff;
	}

	.spu_price_btn_icon {
		font-size: 13px;
		font-family: AlternateBold;
		font-weight: bold;
		color: #ffffff;
	}

	.spu_price_btn_pre_price {
		font-size: 20px;
		font-family: AlternateBold;
		font-weight: bold;
		color: #ffffff;
	}

	.spu_price_btn_dian_price {
		font-size: 13px;
		font-family: AlternateBold;
		font-weight: bold;
		color: #ffffff;
	}
}

.active-price {
	display: flex;
	align-items: baseline;
	height: 20px;
	line-height: 20px;
	margin-top: 8px;
	margin-left: 3px;

	.spu_price_btn_icon {
		font-size: 11px;
		font-family: AlternateBold;
		font-weight: bold;
		color: #c3c3c3;
	}

	.spu_price_btn_pre_price {
		font-size: 16px;
		font-family: AlternateBold;
		font-weight: bold;
		color: #c3c3c3;
	}

	.spu_price_btn_dian_price {
		font-size: 11px;
		font-family: AlternateBold;
		font-weight: bold;
		color: #c3c3c3;
	}

	.line {
		width: 100%;
		height: 1px;
		background-color: #999999;
		position: absolute;
		top: 50%;
	}
}

.wsf-number-box {
	display: flex;
	align-items: center;

	.minus {
		display: flex;
		// justify-content: left;
		align-items: center;
		width: 50rpx;
		height: 50rpx;
	}

	.num {
		width: 80rpx;
		height: 44rpx;
		line-height: 44rpx;
		text-align: center;
		font-size: 24rpx;
		font-weight: 500;
		color: #333333;
		background: #f5f5f5;
		border-radius: 8rpx;

		input {
			height: 100%;
			min-height: 100%;
		}

		// margin: 0 16rpx;
	}

	.plus {
		display: flex;
		justify-content: flex-end;
		align-items: center;
		width: 50rpx;
		height: 50rpx;
	}
}

.spec-btn {
	display: flex;
	justify-content: space-between;
	align-items: center;
	width: 92%;
	margin: 8rpx auto;

	.common-btn {
		flex: 1;
		border-radius: 40rpx;
		height: 80rpx;
		text-align: center;
		line-height: 80rpx;
		font-size: 28rpx;

		&:nth-child(2) {
			margin-left: 24rpx;
		}
	}

	.add-cart {
		background-color: #FFBE0C;
		color: #fff;
	}

	.bug-now {
		background: linear-gradient(90deg, #FF5F2E 0%, #FF0A35 100%);
		color: #fff;
	}
	.btn-grey {
    	background: #f2f2f2;
    	color: #bababa;
  	}
}
</style>

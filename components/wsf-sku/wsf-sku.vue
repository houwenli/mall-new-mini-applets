<template>
	<u-popup v-model="show" mode="bottom" border-radius="24" :safe-area-inset-bottom="true" @close="close" :mask-custom-style="{backgroundColor:'rgba(0, 13, 29, 0.6)'}">
		<view class="popup" :style="{paddingBottom:isExchangeGoods? '' : '96rpx' }">
            <image src="@/static/img/icon/close-icon.png" class="popup-close-icon" @click="close()"></image>
			<view class="sku-info">
                <image
                    class="sku-img"
                    :src="
                    activeImg
                    ? activeImg
                    : skuDetail.sku.tree[0].v[0].imgUrl
                    ? skuDetail.sku.tree[0].v[0].imgUrl
                    : skuDetail.images[0]
                    "
                    @click="goodsimgShow()"
                ></image>
					<view class="sku-text">
						<!-- <view class="performance-part" v-if="specPerformanceScore">
							绩效分{{specPerformanceScore}}
						</view> -->
						<view class="txt_item">
							<!-- 添加福气值逻辑 -->
							<view style="display:inline-block" class="fqz-price" v-if="skuDetail.integralPoint > 0">
								<text>
									<text class="special">
										{{ skuDetail.integralPoint }}
									</text>
									福气值+
									<text>
										{{ skuDetail.deductionAfterPrice }}
									</text>
									元
								</text>
							</view>
							<template v-else>
								<text class="txt_1">￥</text>
								<!-- <text class="txt_2">{{ skuDetail.price }}</text> -->
								<text class="txt_2">{{skuPriceInt(skuDetail.price)}}</text>
                <text class="txt_1">{{'.' + skuPriceFloat(skuDetail.price)}}</text>
							</template>
							
						</view>

						<view class="performate-point" v-if="skuDetail.performanceScore && skuDetail.performanceScore > 0">
							<span class="performate-point-label">绩效分:</span><span class="performate-point-num">{{ skuDetail.performanceScore }}</span>
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
							<view
								v-for="(v, index_v) in treeItem.v"
								:class="['sku-val-item', initialSkuArr.indexOf(v.id) >= 0 ? 'pitch-on' : '', v.disabled&&!isExchangeGoods ? 'disable' : '']"
								@click="pitchOnFun(v,treeItem)"
								:key="index_v"
							>
								<!-- <image v-if="v.imgUrl" style="margin-top: -8rpx;vertical-align: middle;;width:44rpx;height:44rpx" :src="v.imgUrl" mode=""></image> -->
								<view class="u-line-1">{{ v.name }}</view>
							</view>
						</view>
					</view>
				</scroll-view>
            <view class="btn-content">
                <view class="exchange-goods-hint-text" v-if="isExchangeGoods">
				    商品更换结果请以商家审核后实际确认为准
			    </view>
			    <view class="btn-item" @click="skuConfirm">确定</view>
            </view>
		
		</view>
	</u-popup>
</template>

<script>
export default {
	props:{
        show:{
            type:Boolean,
            default:false
        },
		skuData: {
			type: Object
		},
		isExchangeGoods: {
			type: Boolean,
			default: false
		},
		ShopNum:{
			type: Number,
			default: 1
		}
	},
	data() {
		return {
			specPerformanceScore:null,
			sku_data:{},
			skuId: '',
			skuName: '',
			skuDetail: {},
			initialSku: {} ,// 条件属性
			initialSkuArr: [], // 条件属性数组
			filterList: [], // 依据条件过滤的sku数组
			tree: [], // 选项列表
			activeImg:'',
			selectProItem: [] // 已选数组
		};
	},
	created() {
		// this.init()
	},
	watch: {
		skuData: {
			handler(newVal, oldVal) {
				this.sku_data = this.$u.deepClone(newVal)
				this.init()
				// console.log(newVal,"newVal");
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
	methods: {
		goodsimgShow(data) {
		 let tmp =	this.activeImg?this.activeImg:(this.skuDetail.sku.tree[0].v[0].imgUrl?this.skuDetail.sku.tree[0].v[0].imgUrl:this.skuDetail.images[0])
			this.$emit("goodsImgShow",tmp)
		},
		init() {
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
			console.log(this.tree,'this.tree---+++')
			this.initialSku = this.sku_data.sku.initialSku;
			this.calcSkuDisabled()
		},
		// 按钮点击
		pitchOnFun(v,treeItem) {
			console.log('v',v);
			console.log('treeItem',treeItem);
			console.log('this.skuDetail.sku.tree[0]',this.skuDetail.sku.tree[0]);
			// 替换条件参数
			if (v.disabled&&!this.isExchangeGoods) return
			let arrid = this.skuDetail.sku.tree[0].v.map(item => {
				return item.id
			})
			console.log(arrid,'arrid++++')
			if (arrid.indexOf(v.id) != -1) {
				this.activeImg = v.imgUrl
			}			
			// this.activeImg = v.imgUrl
			this.initialSku[treeItem.k_s] == v.id ? this.initialSku[treeItem.k_s] = null : this.initialSku[treeItem.k_s] = v.id,
			// this.skuDetail.list.forEach(item => {
			// 	if(item.name == v.name){
			// 		this.skuId = item.id
			// 		this.skuDetail.id = item.id
			// 		this.skuDetail.price = (item.price / 100).toFixed(2)
			// 	}
			// })
			this.calcSkuDisabled()
		},
		// 计算Sku选择属性是否可选
		calcSkuDisabled() {
			this.tree.forEach(treeItem => {
				treeItem.v.forEach(vItem => {
					vItem.disabled = this.filterSku(treeItem.k_s,vItem.id)
				})
			})
		},
		// 过滤当前规格选项
		filterSku(s,sId){
			// console.log('s',s);
			// console.log('sId',sId);
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
			// console.log('filterList',this.filterList);
			// this.filterList.findIndex(el => {
			// 	return el.stock > 0
			// })
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
				this.skuDetail.id = this.filterList[0].id
				this.skuDetail.price = (this.filterList[0].price / 100).toFixed(2)
				this.skuDetail.integralPoint = this.filterList[0].integralPoint
				this.skuDetail.deductionAfterPrice = this.filterList[0].deductionAfterPrice

				this.specPerformanceScore = this.filterList[0].performanceScore

				this.selectProItem = this.skuDetail.list.filter(item=>{
					return item.id === this.skuId
				})
			}
			this.selectPropFn(this.filterList[0])	
						
			this.activeImg = this.selectProItem[0] ? this.selectProItem[0].imgUrl : ''
			return !hasStock
		},
		skuConfirm(){
			console.log(this.skuId,"skuIdskuId");
			this.$emit("skuConfirm", {skuId:this.skuId, skuName: this.skuName})
		},
		skuPriceInt(data) {
			let price = 0;
			if (data) {
				price = data;
			} else {
				return
			}
			price = price.split('.')[0];
			return price;
		},
		skuPriceFloat(data) {
			let price = '00';
			if (data) {
				price = data;
			} else {
				return
			}
			price = price.split('.')[1];
			return price;
		},

		// 规格弹窗已选内容
		selectPropFn(filterList) {
			if(filterList) {
                return `已选${filterList.name},${this.ShopNum}个`
			} else {
                return '请选择'
            }
		},
        close(){
            this.$emit('update:show',false)
        }
	}
};
</script>

<style lang="scss">
.popup {
	color: #000000;
	position: relative;
	background-color: #fff;
    padding: 30rpx 0rpx 96rpx 0rpx;
    padding-bottom: calc(96rpx + constant(safe-area-inset-bottom));
    padding-bottom: calc(96rpx + env(safe-area-inset-bottom));
    .popup-close-icon{
        width: 54rpx;
        height: 40rpx;
        position:absolute;
        right: 24rpx;
        top: 30rpx;
    }
    .sku-info{
        display: flex;
        padding: 0rpx 24rpx;
        .sku-img{
            width: 204rpx;
            height: 204rpx;
            border-radius: 16rpx;
            margin-right: 16rpx;
        }
        .sku-text{
            flex: 1;
        }
        .txt_item{
            display: flex;
            align-items: flex-end;
        }
        .txt_1{
            font-size: 32rpx;
            font-family: DINAlternate-Bold, DINAlternate;
            font-weight: bold;
            color: #FF0A35;
            line-height: 40rpx;
        }
        .txt_2{
            font-size: 60rpx;
            font-family: DINAlternate-Bold, DINAlternate;
            font-weight: bold;
            color: #FF0A35;
            line-height: 58rpx;
        }
        .select-prop{
            font-size: 26rpx;
            color: #999999;
            line-height: 34rpx;
        }
				.fqz-price {
					font-size: 32rpx;
					font-weight: 600;
					color: #FE3040;
					.special {
						font-size: 60rpx;
					}
				}
    }
    .sku{
        padding-top: 4rpx;
        margin-top: 24rpx;
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
						background: rgba(255,231,235,0.5);;
						.u-line-1 {
							color: #FF0A35;
						}
					}
					.disable {
						background-color: #f2f2f2;
						border: 1px solid #f2f2f2;
						color: #bababa;
					}
    }
    .btn-content{
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
            background: linear-gradient(90deg, #FF5F2E 0%, #FF0A35 100%);
            border-radius: 40rpx;
            font-size: 32rpx;
            font-weight: 500;
            color: #FFF9E9;
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

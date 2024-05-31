<template>
	<view>
		<u-cell-group v-if="false">
			<u-cell-item
				:title-width="92"
				title="已选"
				:arrow="false"
				:value="specName"
				:title-style="{ 'font-weight': 'bold', color: '#000' }"
				:value-style="{ 'text-align': 'left', color: '#000' }"
				v-if="skuData.sellOut == 1 || skuData.stock == 0 || skuData.shelvesStatus == 0 || skuData.shelvesStatus == 2 || skuData.isGift == '1'"
			>
				<u-icon slot="right-icon" size="24" name="arrow-right" color="#999"></u-icon>
			</u-cell-item>
			<u-cell-item
				:title-width="92"
				title="已选"
				:arrow="false"
				:value="specName"
				:title-style="{ 'font-weight': 'bold', color: '#000' }"
				:value-style="{ 'text-align': 'left', color: '#000' }"
				@click="openSkuModal(0)"
				v-else
			>
				<u-icon slot="right-icon" size="24" name="arrow-right" color="#999"></u-icon>
			</u-cell-item>
			<u-cell-item
				:title-width="92"
				title="送至"
				:arrow="false"
				:title-style="{ 'font-weight': 'bold', color: '#000' }"
				:value-style="{ 'text-align': 'left', color: '#000' }"
				@click="showAddressModal = true"
			>
				<u-icon slot="right-icon" size="24" name="arrow-right" color="#999"></u-icon>
        <!-- 定位图标 -->
				<u-icon class="location-icon" size="32" name="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/prev-icon-list/region%402x.png"></u-icon>
				<span class="u-margin-left-14">{{ addressInfo.addressName }}</span>
			</u-cell-item>
			<u-cell-item
				:title-width="92"
				title="运费"
				:value="freightFee"
				:title-style="{ 'font-weight': 'bold', color: '#000' }"
				:value-style="{ 'text-align': 'left', color: '#000' }"
				:arrow="false"
			></u-cell-item>
			<u-cell-item
				v-if="skuData.spuServiceSupports && skuData.spuServiceSupports.length > 0"
				:title-width="92"
				title="服务"
				:title-style="{ 'font-weight': 'bold', color: '#000' }"
				:value-style="{ 'text-align': 'left', color: '#000' }"
				:arrow="false"
			>
				<span>{{ serviceName }}</span>
			</u-cell-item>
		</u-cell-group>
		<view class="service">
			<view class="service-time" v-if="
			skuData.sellOut == 1 ||
			skuData.stock == 0 ||
			skuData.shelvesStatus == 0 ||
			skuData.shelvesStatus == 2 ||
			skuData.isGift == '1'
			">
				<view class="flex-time">
					<span>已选</span>
				    <view class="selects">{{specName}}</view>
				</view>
				<img :src="`${smartImg}/detail/icon-right.png`" alt="">
			</view>
			<view class="service-time" v-else @click="openSkuModal(0)">
				<view class="flex-time">
					<span>已选</span>
				    <view class="selects">{{specName}}</view>
				</view>
				<img :src="`${smartImg}/detail/icon-right.png`" alt="">
			</view>
			<view class="service-time">
				<view class="flex-time" @click="showAddressModal = true">
					<span>送至</span>
					<img v-if="addressList&&addressList.length || addressInfo.addressName" class="icon-adrs"  :src="`${smartImg}/detail/2023-09-25/address.png`"  alt="">
				    <view v-if="addressList&&addressList.length || addressInfo.addressName" class="selects address_">{{addressInfo.addressName}}</view>
					<view v-if="!addressList.length && !addressInfo.addressName" class="colors_">请选择您的收货地址</view>
				</view>
				<img src="https://wsjc-web.wsecar.com/wsf-mall/skuDetail/icon-right.png" alt="">
			</view>
			<view class="service-time">
				<view class="flex-time">
					<span>运费</span>
				    <view class="selects">{{freightFee}}</view>
				</view>
			</view>
		</view>
		<view class="serve" v-if="skuData.spuServiceSupports&&skuData.spuServiceSupports.length">
			<view class="serve-name" :class="{'packUp': serveShow}">
				<view class="flex-name" v-for="(item, index) in skuData.spuServiceSupports" :key="index">
					<img src="https://wsjc-web.wsecar.com/wsf-mall/skuDetail/icon-serve.png" alt="">
					<span>{{item.serviceSupport.name}}</span>
				</view>
			</view>
			<view class="btn" v-if="serveNameHeight" @click="isServeShow">
				<img :src="`https://wsjc-web.wsecar.com/wsf-mall/skuDetail/icon-${serveShow?'btn-btom':'btn-top'}.png`" alt="">
			</view>
		</view>
		<u-popup v-model="specSelectModel" mode="bottom" border-radius="20" height="880rpx" @close="updateSku">
			<view class="select-model-close" @click="closeSkuModal"></view>
			<view class="popup">

				<view class="sku-info">
					<view class="img">
						<image :src="activeImg ? activeImg : skuDetail.sku.tree[0].v[0].imgUrl ? skuDetail.sku.tree[0].v[0].imgUrl : skuDetail.images[0]" @click="goodsimgShow()"></image>
					</view>
					<view class="info">
						<view class="txt_item">
							<!-- 添加福气值逻辑 -->
							<view class="fqz-price" v-if="skuData.integralPoint > 0">
								<text>
									<text class="special">
										{{ skuData.integralPoint }}
									</text>
									福气值+
									<text>
										{{ skuData.deductionAfterPrice }}
									</text>
									元
								</text>
							</view>
							<template v-else>
								<view>
									<text class="txt_1">￥</text>
                		<view class="txt_2"><span>{{ skuPriceInt(skuPrice) }}</span><span class="float">{{ "." + skuPriceFloat(skuPrice) }}</span></view>
								</view>
							</template>
                			
							<view class="spu_price_btn" v-if="skuData.afterCouponPrice && skuData.afterCouponPrice>0">
              					<text class="spu_price_btn_text">券后</text>
              					<text class="spu_price_btn_icon">¥</text>
              					<text class="spu_price_btn_pre_price">{{ skuPriceInt(skuData.afterCouponPrice.toFixed(2)) }}</text><span class="spu_price_btn_dian_price">.{{ skuPriceFloat(skuData.afterCouponPrice.toFixed(2)) }}</span>
           					</view>
              			</view>
						<view class="price">
							<view class="performance-part" v-if="skuData.skuLable&& skuData.skuLable.performanceScoreLabel && skuData.skuLable.performanceScoreLabel.performanceScore">
								<image src="https://wsjc-web.wsecar.com/wsf-mall/skuDetail/icon-performance.png" class="performance-part-img" alt="">
								<text>绩效分:<text class="performance-part-scope">{{ skuData.skuLable.performanceScoreLabel.performanceScore | performanceCount }}</text></text>
							</view>
              			<view class="no">
							<text class="select-prop">{{ selectPropFn(selectProItem[0]) }}</text>
              			</view>
            		</view>
          </view>
        </view>
        <view class="sku">
          <scroll-view scroll-y="true" class="scroll-Y">
            <view
              class="sku-item"
              v-for="(treeItem, index) in tree"
              :key="index"
            >
              <view class="sku-name">{{ treeItem.k }}</view>
              <view class="sku-val">
                <view
                  v-for="(v, index_v) in treeItem.v"
                  class="u-line-1"
                  :class="[
                    'sku-val-item',
                    initialSkuArr.indexOf(v.id) >= 0 ? 'pitch-on' : '',
                    v.disabled ? 'disable' : '',
                  ]"
                  @click="pitchOnFun(v, treeItem,index_v)"
                  :key="index_v"
                >
									<text>{{ v.name }}</text>
								</view>
							</view>
						</view>
						<view class="u-flex u-row-between u-padding-top-14 u-padding-bottom-40" style="margin-right: 12rpx;">
							<b style="font-weight: bold">数量</b>
							<view class="wsf-number-box">
								<text class="skill-txt" v-if="marketingVos.length && marketingVos[0].type == '13' && timestamp.label == '距结束还剩'">
									限购{{ marketingVos[0].panicBuy.limitNum }}件
								</text>
								<text
									class="skill-txt"
									v-if="
										marketingVos &&
											marketingVos.length &&
											marketingVos.map(item => item.type).includes('16') &&
											marketingVos.filter(item => item.type == '16')[0].specialArea.limitNum > 0
									"
								>
									限购{{ marketingVos.filter(item => item.type == '16')[0].specialArea.limitNum }}件
								</text>
								<view class="minus" @click="minusFun()"><u-icon name="minus" :color="addNum !== 1 ? '#000' : addNum == 1 ? '#d8d8d8' : '#000'"></u-icon></view>
								<view class="num"><input type="number" v-model="addNum" @input="minusInput($event)" @blur="minusBlur($event)" /></view>
								<view class="plus" @click="plusFun()">
									<u-icon name="plus" :color="addNum < limitAddNum && addNum !== limitAddNum ? '#000' : addNum == limitAddNum ? '#d8d8d8' : '#bababa'"></u-icon>
								</view>
							</view>
						</view>
					</scroll-view>
				</view>
				<view class="fixed-column">
					<p v-if="bestCoupon && bestCoupon.type == 1">
						当前商品可使用
						<span>满{{ bestCoupon.couponFull.fullPrice }}减{{ bestCoupon.couponFull.price }}</span>
						店铺优惠券
					</p>
					<view class="spec-btn">
						<!---start 不是虚拟商品不显示加入购物车 skuDetail.isVirtual == 0-->
						<!-- <view
              class="common-btn"
              :class="{ 'add-cart': canAddCart, 'btn-grey': !canAddCart }"
              v-if="openType != 1 && skuDetail.isVirtual == 0 && !recommendToken"
              @click="handleAddCart"
              >加入购物车</view
            > -->
						<!--end 不是虚拟商品不显示加入购物车-->
						<view class="common-btn" :class="{ 'bug-now': canBuyNow, 'btn-grey': !canBuyNow }" v-if="openType != 2" @click="handleBugNow">
							{{ bestCoupon && bestCoupon.isReceive == 0 ? '领券' : '立即' }}购买
						</view>
					</view>
				</view>
			</view>
		</u-popup>
		<wsf-city-select v-model="show" @city-change="chooseArea" :defaultRegion="defaultRegion"></wsf-city-select>
		<popup-address v-model="showAddressModal" @showCitySelect="showCitySelect" @selectedCity="selectedCity" @getressList="getressList"></popup-address>
		<u-mask :show="goodsImgShow" @click="goodsImgShow = false" z-index="99999">
			<view style="width:100%;height:100%;position:relative">
				<view class="rect" @tap.stop @click="goodsImgShow = false">
					<u-image :src="activeImg ? activeImg : skuDetail.sku.tree[0].v[0].imgUrl ? skuDetail.sku.tree[0].v[0].imgUrl : skuDetail.images[0]" mode="widthFix"></u-image>
				</view>
			</view>
		</u-mask>

	</view>
</template>

<script>
import wsfCitySelect from '@/components/wsf-city-select/wsf-city-select.vue';
import popupAddress from './popupAddress.vue';
import { priceFilter } from '@/common/wsfValidate.js';

export default {
	components: {
		wsfCitySelect,
		popupAddress,
	},
	filters: {
		performanceCount(val) {
			if(val && Number(val) >= 10000) {
        		return (parseInt((val / 10000) * 10)/10) + '万分'
      		} else if(val && Number(val) >= 1000) {
					return parseInt(Number(val) / 1000) + '000+分'
				} else if(val && Number(val) >= 100) {
					return parseInt(Number(val) / 100) + '00+分'
				} else {
        		return val + '分'
      		}
		},
	},
	data() {
		return {
			smartImg:this.$smartImg,
			isNeedBottomSpace: getApp().globalData.isNeedBottomSpace,
			realPrice: 0,
			bestCoupon: null,
			// specPerformanceScore: 0,
			skuPrice: 0,
			canAddCart: true,
			canBuyNow: true,
			specName: '',
			selectSkuId: '',
			limitAddNum: 100000000,
			addNum: 1,
			choseFullSku: false, //是否选择规格
			freight: 0,
			openType: 0, //商品规格入口, 0:商品规格栏, 1:立即购买, 2:加入购物车
			isFirstOpen: true, //是否第一次进入
			isLoading: false,
			specSelectModel: false,
			show: false,
			defaultRegion: ['广东', '深圳市', '宝安区'],
			addressInfo: {
				addressName: '',
				address: '',
				provinceId: '',
				cityId: 200,
				countryId: ''
			},
			skuDetail: {},
			initialSku: {}, // 条件属性
			initialSkuArr: [], // 条件属性数组
			filterList: [], // 依据条件过滤的sku数组
			tree: [], // 选项列表
			firstOrderSkuId: '', // 保存skuId
			saveLimitNum: 1,
			// showActiveType:[],
			goodsImgShow: false,
			activeImg: '', // 选中属性对应的图片
			showAddressModal: false,
			isEmpty: false, // 是否有收货地址
			addressList: [], // 收货地址列表
			serveShow: false,
			serveNameHeight: false,
			selectProp: '', // 规格弹窗已选择
			selectProItem: [] // 已选数组
		};
	},
	props: {
		//设置倒计时间，单位为秒
		timestamp: {
			type: Object,
			default() {
				return {
					seconds: 3600,
					label: '',
					startTime: null,
					discount: 0
				};
			}
		},
		sourceType: {
			type: String,
			default() {
				return 1;
			}
		},
		recommendToken: {
			type: String,
			default() {
				return '';
			}
		},
		skuData: {
			type: Object,
			default() {
				return {};
			}
		},
		promoteInfo: {
			type: Object,
			default() {
				return {};
			}
		},
		skuId: {
			type: String,
			default() {
				return null;
			}
		},
		// 秒杀数据
		marketingVos: {
			type: Array,
			default() {
				return [];
			}
		},
		couponList: {
			type: Array,
			default() {
				return [];
			}
		},
		// saveLimitNum: {
		//   type: Number,
		//   default: 1
		// },
		sendActiveImg: {
			type: String,
			default () {
				return '';
			},
		}
	},
	watch: {
		initialSku: {
			handler(n, o) {
				this.initialSkuArr = [];
				for (let i in n) {
					if (n[i]) {
						console.log(n[i], '/-/-/-/-/-/---------------');
						this.initialSkuArr.push(n[i]); //属性
					}
				}
			},
			deep: true
		},
		'skuData.spuServiceSupports': {
			handler(val, oal) {
				console.log(this.skuData, '=====//')
				if (!val.length) {
						return
					}
				setTimeout(() => {
					let info = uni.createSelectorQuery().in(this).select(".serve-name");
					let that = this
					info.boundingClientRect(function(data) {
						if (data.height > 52) {
							that.serveNameHeight = true
							that.serveShow = true
						}
					}).exec(function(res){
					})
				}, 500);
			},
			deep: true,
		},
		sendActiveImg(newVal){
			if(newVal){
				this.activeImg = newVal
			}
		}
	},
	computed: {
		freightFee() {
			let num;
			if (this.freight > 0) {
				num = this.freight + '元';
			} else {
				num = '免运费';
			}
			return num;
		},
		serviceName() {
			let name = '',
				nameList = [];
			if (this.skuData.spuServiceSupports && this.skuData.spuServiceSupports.length > 0) {
				nameList = this.skuData.spuServiceSupports.map(item => {
					if (item.serviceSupport && item.serviceSupport.name) {
						return item.serviceSupport.name;
					}
				});
				if (nameList.length > 1) {
					name = nameList.join(' · ');
				} else {
					name = nameList[0];
				}
			}
			return name;
		},
	},
	methods: {
		getressList(e) {
			let {list} = e
			this.isEmpty = !list.length;
			if (list.length) {
				let {address,provinceId,cityId,countryId} = list[0]
				this.addressInfo.addressName = address;
				this.addressInfo.address = address;
				this.addressInfo.provinceId = provinceId;
				this.addressInfo.cityId = cityId;
				this.addressInfo.countryId = countryId;
				// this.calculateFreight();
			}
			},
		filterGoods() {
			console.log(this.skuData, 'skuData--skuData');
			let url;
			let once = false;
			if (this.skuData.skuList && this.skuData.skuList.length > 0) {
				this.skuData.skuList.map((item, index) => {
					if (item.stock != 0 && !once) {
						once = true;						
						// return this.activeImg?this.activeImg:(this.skuDetail.sku.tree[0].v[index].imgUrl?this.skuDetail.sku.tree[0].v[index].imgUrl:this.skuDetail.images[0])
						url = this.skuData.sku.tree[0].v[index].imgUrl ? this.skuData.sku.tree[0].v[index].imgUrl : this.skuData.images[0];
					}
				});
			}
			console.log(url, 'url');
			return url;
		},
		goodsimgShow() {
			this.goodsImgShow = true;
		},
		skuPriceInt(data) {
			let price = 0;
			if (data) {
				price = data.split('.')[0];
			}
			return price;
		},
		skuPriceFloat(data) {
			let price = '00';
			if (data) {
				price = data.split('.')[1];
			}
			return price;
		},
		updateSku() {
			if (this.selectSkuId) {
				this.$emit('updateSku', this.selectSkuId);
			}
		},
		// 校验是否超过平台秒杀限制数
		CheckSkuPanicBuyLimitNum(data, limitNum, inputNum) {
			if (inputNum > limitNum) {
				this.$u.toast(`购买数量不能超过库存数量`);
			}
			this.$u.api.CheckSkuPanicBuyLimitNum(data).then(res => {
				if (res.data && res.data.limitNum) {
					if (res.data.hasBoughtNum) {
						this.addNum = this.saveLimitNum;
						this.$u.toast(`限购${res.data.limitNum}件,你已购买过${res.data.hasBoughtNum}件了`);
					} else {
						this.addNum = this.saveLimitNum;
						this.$u.toast(`抱歉，该商品限购${res.data.limitNum}件`);
					}
				} else {
					this.saveLimitNum = inputNum;
				}
			});
		},
		// 步进器 -
		minusFun() {
			if (this.addNum > 1) {
				this.addNum = parseInt(this.addNum) - 1;
				let isIgnore = this.openType == 2 ? false : true;
				let params = {
					num: this.addNum,
					skuId: this.selectSkuId,
					isIgnore: isIgnore
				};
				this.$emit('minus', params, this.limitAddNum);
			}
		},
		// 步进器 +
		plusFun() {
			console.log(this.addNum, '--', this.limitAddNum);
			if (this.addNum < this.limitAddNum && this.addNum !== this.limitAddNum) {
				this.addNum = parseInt(this.addNum) + 1;
				let params = {
					isIgnoreCartNum: this.openType == 2 ? false : true,
					buyNowRequestList: [
						{
							num: this.addNum,
							skuId: this.selectSkuId,
							sourceType: this.sourceType,
							storeId: this.skuData.storeId
						}
					]
				};
				let inputNum = this.addNum;
				this.CheckSkuPanicBuyLimitNum(params, this.limitAddNum, inputNum);
			}
		},
		// 步进器输入框输入时执行
		minusInput(e) {
			if (e.detail.value !== null && e.detail.value !== '') {
				let params = {
					isIgnoreCartNum: this.openType == 2 ? false : true,
					buyNowRequestList: [
						{
							num: e.detail.value,
							skuId: this.selectSkuId,
							sourceType: this.sourceType,
							storeId: this.skuData.storeId
						}
					]
				};
				let inputNum = e.detail.value;
				this.CheckSkuPanicBuyLimitNum(params, this.limitAddNum, inputNum);
			} else {
				this.addNum = e.detail.value;
			}
		},
		// 失焦时执行
		minusBlur(e) {
			if (e.detail.value !== null && e.detail.value !== '' && e.detail.value > 1) {
				console.log('失焦', e);
				console.log('marketingVos----------', this.marketingVos);
				if (e.detail.value <= this.limitAddNum) {
					this.addNum = e.detail.value;
				} else if (!this.marketingVos.map(item => item.type).includes('16')) {
					this.$u.toast(`购买数量不能超过库存数量`);
					this.addNum = this.limitAddNum;
					return;
				} else {
					this.addNum = this.limitAddNum;
				}
				if (this.marketingVos.length && this.marketingVos[0].iSeckill) {
					this.$emit('minusBlur', {
						num: e.detail.value,
						skuId: this.selectSkuId
					});
				}
			} else {
				this.addNum = 1;
			}
		},
		initData() {
			// 重新初始化addNum，去登录页面回来时没有重置addNum
			this.addNum = 1;
			this.calculateFreight();
			this.init();
		},
		showToastError(errMsg, duration = 2500) {
			uni.showToast({
				title: errMsg,
				icon: 'none',
				mask: true,
				duration: duration
			});
		},
		navigateTo(sceneName, params) {
			// this.$wsf.go('Login')
			this.$wsf.go(sceneName, params);
		},
		//加购
		async handleAddCart() {
			// console.log(this.loading, 'asdadasdasdasds');
			// if (this.loading) return;
			// this.loading = true;
			if (this.marketingVos.length && this.marketingVos[0].iSeckill) {
				let verify = true;
				let obj = {
					buyNowRequestList: [
						{
							num: this.addNum,
							skuId: this.selectSkuId,
							sourceType: this.sourceType,
							storeId: this.skuData.storeId
						}
					]
				};
				await this.$u.api.CheckSkuPanicBuyLimitNum(obj).then(res => {
					if (res.data && res.data.limitNum) {
						if (res.data.hasBoughtNum) {
							this.$u.toast(`限购${res.data.limitNum}件,你已购买过${res.data.hasBoughtNum}件了`);
						} else {
							this.$u.toast(`抱歉，该商品限购${res.data.limitNum}件`);
						}
						verify = false;
					} else {
						verify = true;
					}
				});
				if (!verify) {
					return false;
				}
			}

			// let routes = getCurrentPages()
			// let curRoute = routes[routes.length - 1].route
			// let curParam = routes[routes.length - 1].options ? routes[routes.length - 1].options : ''
			// console.log("当前页地址curRoute-------------",curRoute)
			// console.log("url参数curParam---------",curParam)
			// return;

			// if (!app.globalData.isLink) {
			// 	this.navigateTo('QuickLogin');
			// 	return;
			// }
			if (!this.choseFullSku) {
				this.showToastError('请选择完整的商品规格');
				return false;
			}
			let data = {
				num: this.addNum,
				skuId: this.selectSkuId,
				sourceType: this.sourceType,
				storeId: this.skuData.storeId
			};
			console.log('添加购物车提交数据data', data);
			this.$u.api
				.AddShoppingCart(data)
				.then(res => {
					if (res.code == 200) {
						console.log('添加购物车---------', res);

						// this.showToastError('添加购物车成功');
						this.$u.toast('添加购物车成功');

						setTimeout(() => {
							this.$emit('loadCartCount');
							this.specSelectModel = false;
							// this.loading = false;
						}, 1000);

						// if (app.globalData.isLink) {
						// 	this.$u.api.QueryShoppingCartCount().then(res => {
						// 		console.log("gouwuche数量------",res)
						// 		this.shoppingCartCount = res.data;
						// 	});
						// } else {
						// 	this.shoppingCartCount = 0;
						// }
					}
				})
				.catch(() => {
					// this.loading = false;
				});
		},
		/* // 校验是否超过平台秒杀限制数
		async CheckSkuPanicBuyLimitNum(data){
			let verify = true
			await this.$u.api.CheckSkuPanicBuyLimitNum(data).then(res => {
				console.log(res,'校验是否超过平台秒杀限制数');
				if(res.data){
					this.$u.toast(`限购${res.data}件`)
					verify = false
				}else {
					verify = true
				}
			})
		}, */
		//立即购买
		async handleBugNow() {
			// if (this.marketingVos.length && this.marketingVos[0].iSeckill) {
			uni.showLoading();
			var verify = true;
			console.log('购买数量---------', this.addNum);
			let obj = {
				isIgnoreCartNum: true,
				buyNowRequestList: [
					{
						num: this.addNum,
						skuId: this.selectSkuId,
						sourceType: this.sourceType,
						storeId: this.skuData.storeId
					}
				]
			};
			await this.$u.api.CheckSkuPanicBuyLimitNum(obj).then(res => {
				if (res.data && res.data.limitNum) {
					if (res.data.hasBoughtNum) {
						// this.addNum = res.data.limitNum - res.data.hasBoughtNum;
						this.$u.toast(`限购${res.data.limitNum}件,你已购买过${res.data.hasBoughtNum}件了`);
					} else {
						// this.addNum = res.data.limitNum;
						this.$u.toast(`抱歉，该商品限购${res.data.limitNum}件`);
						verify = fasle;
					}
					return;
				}
			}).catch(err => {
				console.log('err分小', err.data);
				if(err.data.code == 4107) {
					setTimeout(() => {
						that.showToastError(err.data.msg);						
						setTimeout(() => {
							uni.navigateBack({
								delta: 1
							});
						}, 3000);
					},500)
				
					return
				} else {
					that.showToastError('获取结算信息失败');
				}
			});
			// }
			if (!verify) return;
			if (!this.choseFullSku) {
				this.showToastError('请选择完整的商品规格');
				return;
			}
			// if (!app.globalData.isLink) {
			// 	this.navigateTo('QuickLogin');
			// 	return;
			// }
			let isPass;
			await this.$parent.checkPermission().then(res => {
				isPass = res;
			});
			if (!isPass) return;
			let distributionCode;
			let param = {
				spuId: this.skuData.spuId,
				recommendUserType: this.promoteInfo.promoteType,
				phone: this.promoteInfo.phone,
				customerId: this.promoteInfo.promoteId
			};
			await this.$u.api.ShareForDistribution(param).then(res => {
				distributionCode = res.data.data;
			});

			let gotCouponNum = -1;
			this.specSelectModel = false;
			let buyNowRequestList = [];
			let skuObj = {
				skuId: this.selectSkuId,
				recommendToken: distributionCode,
				num: this.addNum,
				sourceType: this.sourceType,
				storeId: this.skuData.storeId
			};
			buyNowRequestList.push(skuObj);
			buyNowRequestList = JSON.stringify(buyNowRequestList);
			console.log('立即购买传递数据buyNowRequestList', buyNowRequestList);
			if (this.bestCoupon && this.bestCoupon.isReceive == 0) {
				let list = [];
				list.push(this.bestCoupon.id);
				let data = {
					couponIdList: list
				};

				this.$u.api.ReceiveCoupons(data).then(res => {
					gotCouponNum = list.length;
					this.navigateTo('Settlement', {
						buyNowRequestList,
						gotCouponNum
					});
				});
			} else {
				this.navigateTo('Settlement', {
					buyNowRequestList,
					gotCouponNum
				});
			}
			uni.hideLoading();
		},
		// 选择地区
		chooseArea(e) {
			// this.addressInfo.defaultRegion = address.split(',');
			this.addressInfo.addressName = `${e.province.name}${e.city.name}${e.area.name}`;
			this.addressInfo.address = `${e.province.name},${e.city.name},${e.area.name}`;
			this.addressInfo.provinceId = e.province.id;
			this.addressInfo.cityId = e.city.id;
			this.addressInfo.countryId = e.area.id;
			this.calculateFreight();
		},
		//计算运费
		calculateFreight() {
			// console.log(this.skuId,"this.skuId---------")
			let data = {
				skuId: this.skuId,
				storeId: this.skuData.storeId,
				num: 1,
				cityId: this.addressInfo.cityId
			};
			this.$u.api.CalculateFreight(data).then(res => {
				this.freight = res.code == 200 ? res.data.toFixed(2) : '0.00';
			});
		},
		//打开规格弹窗
		openSkuModal(type) {
			this.openType = type;
			if (this.skuData.sellOut == 1 || this.skuData.isGift == 1) {
				this.canAddCart = false;
				this.canBuyNow = false;
			}
			// console.log("marketingVos",this.marketingVos)
			// if (this.skuData.marketingVos) {
			// 	let istypeShow = this.skuData.marketingVos.map((temp) => {
			// 		if (temp.type == 1 || temp.type == 13 || temp.type == 16) {
			// 			return true
			// 		} else {
			// 			return false
			// 		}
			// 	})
			// 	this.showActiveType = istypeShow
			// 	console.log('showActiveType', this.showActiveType)
			// }
			this.specSelectModel = true;
		},
		//商品规格相关-起
		init() {
			console.log(this.skuData, 'this.skuData1111111111');
			this.skuDetail = this.skuData;
			this.tree = this.skuDetail.sku.tree.map(el => {
				el.v = el.v.map(eel => {
					eel.disabled = false;
					return eel;
				});
				return el;
			});
			this.skuData.sku.tree.forEach((item, index) => {
				if (index != 0) {
					item.v.forEach((temp, i) => {
						temp.imgUrl = '';
						// temp.previewImgUrl = temp.imgUrl
					});
				} else {
					item.v.forEach((temp, i) => {
						temp.previewImgUrl = temp.imgUrl;
					});
				}
			});
			// console.log(this.skuData.sku.tree, 'this.skuData.sku.tree---+++');
			this.initialSku = this.skuDetail.sku.initialSku;
			this.calcSkuDisabled();
		},
		// 按钮点击
		pitchOnFun(v, treeItem, v_i) {			
			//重置数量
			this.addNum = 1;

			// 替换条件参数
			if (v.disabled) return;
			this.choseFullSku = false;

			this.initialSku[treeItem.k_s] == v.id ? (this.initialSku[treeItem.k_s] = null) : (this.initialSku[treeItem.k_s] = v.id);

			let arrid = this.skuDetail.sku.tree[0].v.map(item => {
				return item.id;
			});
			console.log(arrid, 'arrid++++');
			// if (arrid.indexOf(v.id) != -1) {
			// 	this.activeImg = v.imgUrl;
			// }

			this.calcSkuDisabled();
			this.$emit('restDetails', this.firstOrderSkuId);
		},
		// 计算Sku选择属性是否可选
		calcSkuDisabled() {
			// console.log('计算可选');
			this.tree.forEach(treeItem => {
				treeItem.v.forEach(vItem => {
					vItem.disabled = this.filterSku(treeItem.k_s, vItem.id);
				});
			});
		},
		selectPropFn(filterList) {
			if(filterList) {
                return `已选${filterList.name},${this.addNum}个`
			} else {
                return '请选择'
            }
		},
		// 过滤当前规格选项
		filterSku(s, sId) {
			this.filterList = this.skuDetail.list.filter(el => {
				let filterResult = true;
				let filterInitialSku = this.$u.deepClone(this.initialSku);
				filterInitialSku[s] = sId;
				for (let i in filterInitialSku) {
					if (filterInitialSku[i] && filterInitialSku[i] !== el[i]) {
						filterResult = false;
					}
				}
				return filterResult === true;
			});
			let hasStock = false;
			this.filterList.forEach(filEl => {
				if (filEl.stock_num > 0) {
					hasStock = true;
				}
			});
			console.log('找到唯一的skuId了', this.filterList,this.initialSku[s] ,sId);
			if (this.filterList.length === 1 && this.initialSku[s] == sId) {			
				this.choseFullSku = true;
				// try {
				if (this.marketingVos.length && this.marketingVos[0].type == '13') {
					if (this.filterList[0].stock_num > this.marketingVos[0].panicBuy.limitNum && this.marketingVos.length && this.marketingVos[0].iSeckill) {
						if (this.marketingVos[0].panicBuy.limitNum != -1) {
							this.limitAddNum = this.marketingVos[0].panicBuy.limitNum;
						} else {
							this.limitAddNum = 10000000;
						}
					}
				} else if (this.marketingVos.length && this.marketingVos[0].type == '16' && this.marketingVos[0].specialArea.limitNum < this.filterList[0].stock_num) {
					if (this.marketingVos[0].specialArea.limitNum != -1) {
						this.limitAddNum = this.marketingVos[0].specialArea.limitNum;
					} else {
						this.limitAddNum = 10000000;
					}
				} else {
					this.limitAddNum = this.filterList[0].stock_num;
				}
				// if (
				//   this.filterList[0].stock_num >
				//     this.marketingVos[0].panicBuy.limitNum &&
				//   this.marketingVos.length &&
				//   this.marketingVos[0].iSeckill
				// ) {
				//   console.log("777777777777777777777777777777777777777777777777");

				//   this.limitAddNum = this.marketingVos[0].panicBuy.limitNum;
				// } else if (this.marketingVos[0].type == "16") {
				//   console.log("哈哈哈啊哈哈哈哈哈哈哈哈哈哈哈哈哈");
				//   this.limitAddNum = this.filterList[0].stock_num;
				// } else {
				//   console.log("6666666666666666666666666666666");

				//   this.limitAddNum = this.filterList[0].stock_num;
				// }
				// } catch (e) {
				//   //TODO handle the exception
				//   this.limitAddNum = this.filterList[0].stock_num;
				//   console.log("//TODO handle the exception");
				// }

				// this.addNum = 1
				let skuId = this.filterList[0].id;			
				this.firstOrderSkuId = skuId;
				this.selectSkuId = skuId;
				// this.specPerformanceScore = this.filterList[0].performanceScore;
				this.skuPrice = priceFilter(this.filterList[0].price / 100);
				this.selectProItem = this.skuDetail.list.filter(item=>{
					return item.id === skuId
				})
				this.specName = this.filterList[0].name + ', ' + this.addNum + '件';
				this.selectPropFn(this.filterList[0])				
				// this.selectPropFn(this.filterList[0])
				this.$nextTick(() => {
					this.getBestCoupon(skuId);
				});
			}
			let ele = this.skuDetail.list.filter(item=>{
				return item.id == this.firstOrderSkuId
			})				
			this.activeImg = ele[0] ? ele[0].imgUrl : ''
			return !hasStock;
		},
		//商品规格相关-止
		//选出最优惠的优惠券
		getBestCoupon(id) {
			let obj = {
				num: 1,
				skuId: id,
				sourceType: this.sourceType,
				storeId: this.skuData.storeId
			};
			let filterList = [];
			filterList.push(obj);
			this.$u.api
				.CartSummary({
					shoppingCartList: filterList
				})
				.then(res => {
					if (res.code == 200 && res.data.storeSummaryList && res.data.storeSummaryList.length > 0 && res.data.storeSummaryList[0].couponId) {
						this.bestCoupon = res.data.storeSummaryList[0].coupon;
						if (this.bestCoupon.type == 1) {
							this.realPrice = (this.skuPrice - this.bestCoupon.couponFull.price).toFixed(2);
						} else {
							this.realPrice = this.skuPrice;
						}
					} else {
						this.realPrice = this.skuPrice;
						this.bestCoupon = null;
					}
					this.$emit('commitBestCoupn', this.bestCoupon);
				});
		},
		showCitySelect() {
			this.showAddressModal = false;
			this.show = true;
		},
		selectedCity(data) {
			let { address, provinceId, cityId, countryId } = data.data;
			this.addressInfo.addressName = address;
			this.addressInfo.address = address;
			this.addressInfo.provinceId = provinceId;
			this.addressInfo.cityId = cityId;
			this.addressInfo.countryId = countryId;
			this.calculateFreight();
		},
		isServeShow() {
			this.serveShow = !this.serveShow
		},
		// 关闭规格弹窗
		closeSkuModal () {
			this.updateSku()
			this.specSelectModel = false;
		},
	}
};
</script>

<style scoped lang="scss">
.rect {
	position: absolute;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
	width: 100%;
}

.wsf-number-box {
	display: flex;
	align-items: center;
	justify-content: flex-end;
	flex: 0;
	.minus {
		display: flex;
		// justify-content: left;
		align-items: center;
		padding-right: 12rpx;
	}

	.skill-txt {
		margin-right: 40rpx;
		font-size: 24rpx;
		font-weight: 400;
		color: #FF0A35;
	}

	.num {
		width: 80rpx;
		padding: 0 8rpx;
		height: 44rpx;
		line-height: 44rpx;
		text-align: center;
		font-size: 24rpx;
		font-weight: 500;
		color: #191919;
		background: #f6f6f6;
		border-radius: 8rpx;
		input {
			height: 100%;
			min-height: 100%;
		}
	}

	.plus {
		display: flex;
		justify-content: flex-end;
		align-items: center;
		padding-left: 12rpx;
	}
}

.location-icon {
	vertical-align: text-bottom;
}

.select-model-close {
	width: 54rpx;
	height: 40rpx;
	background-size: 100% 100%;
	background-image: url(https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/address/address-close-2x.png);
	position: absolute;
	right: 24rpx;
	top: 24rpx;
}

.popup {
  background-color: #fff;
  .sku-info {
    box-sizing: border-box;
    width: 100%;
    display: flex;
    padding: 32rpx 24rpx 0rpx 24rpx;
	padding-bottom: 30rpx;
    .img {
      width: 200rpx;
      height: 200rpx;
      margin-right: 20rpx;
      image {
        width: 200rpx;
        height: 200rpx;
      }
    }
	.txt_item {
		display: flex;
		align-items: center;
        .txt_1,
        .txt_2 {
          color: $wsf-color-new-red;
		  font-family: DINAlternate-Bold, DINAlternate;
        }
        .txt_1 {
          font-size: 32rpx;
          font-weight: 500;
        }
        .txt_2 {
          font-size: 60rpx;
          font-weight: 600;
          display: inline-block;
          .float {
            font-size: 32rpx;
          }
        }
        .reduced-price {
          margin-left: 16rpx;
          font-weight: normal;
          vertical-align: text-bottom;
          height: 40rpx;
          background: linear-gradient(90deg, #ec5f2a 0%, #FF0A35 100%);
          border-radius: 200rpx;
          padding: 0 24rpx;
          display: inline-flex;
          color: #fff;
          font-size: 24rpx;
          justify-content: center;
          align-items: center;
          i {
            font-size: 32rpx;
            color: #fff;
          }
        }
    }
	.spu_price_btn {
      margin-left: 4rpx;
      padding: 4rpx 16rpx;
      color: #fff;
      font-weight: normal;
      width: fit-content;
      height: 56rpx;
      line-height: 48rpx;
      background: linear-gradient(90deg, #FF5F2E 0%, #FF0A35 100%);
      border-radius: 30rpx 30rpx 30rpx 4rpx;
      align-items: baseline;
      .spu_price_btn_text{
        font-size: 22rpx;
        font-weight: bold;
        color: #FFFFFF;
      }
      .spu_price_btn_icon{
        font-size: 26rpx;
        font-family: AlternateBold;
        font-weight: bold;
        color: #FFFFFF;
      }
      .spu_price_btn_pre_price{
        font-size: 40rpx;
        font-family: AlternateBold;
        font-weight: bold;
        color: #FFFFFF;
        // line-height: 26px;
      }
      .spu_price_btn_dian_price{
        font-size: 26rpx;
        font-family: AlternateBold;
        font-weight: bold;
        color: #FFFFFF;
      }
    }
    .info {
      width: 100%;
      display: flex;
	  flex-direction: column;
	//   justify-content: space-between;
    //   align-items: ;
      .price {
        .performance-part {
		  margin-top: 8rpx;
		  display: flex;
		  align-items: center;
		  color: #008864;
		  font-size: 22rpx;
		  .performance-part-img {
		  	width: 32rpx;
		  	height: 32rpx;
		  }
		  .performance-part-scope {
			font-size: 20rpx;
		  }
        }

        .performance-mark {
          	margin: 0 10rpx 30rpx 0;
	      	padding: 0 6rpx;
	      	display: inline-flex;
	      	align-items: center;
	      	height: 32rpx;
	      	border-radius: 8rpx;
			background-color: #ECFFFC;
	      	color: #008864;
	      	font-size: 22rpx;
			.num {
				font-size: 20rpx;
			}
	      }
				.reduced-price {
          margin-left: 16rpx;
          height: 48rpx;
           background: #FF0A35;
          border-radius: 28rpx;
          padding: 0 16rpx;
          margin: 4rpx 0 10rpx;
          display: inline-flex;
          color: #fff;
          font-size: 28rpx;
          justify-content: center;
          align-items: center;
          font-weight: 500;
          line-height: 36rpx;
        }
        .no {
		  margin-top: 6rpx;
          text {
            font-size: 26rpx;
            font-weight: 400;
            color: #999999;
          }
        }
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
  }
  .sku {
    // box-sizing: border-box;
    // padding: 0 36rpx 0 36rpx;
		width: 94vw;
		overflow-x: hidden;

		.scroll-Y {
			box-sizing: border-box;
			padding: 0 48rpx 0 48rpx;
			width: 101vw;
			height: 474rpx;

			::-webkit-scrollbar {
				width: 0;
				height: 0;
				color: transparent;
			}

			.sku-item {
				.sku-name {
					// padding-top: 48rpx;
					// padding-bottom: 36rpx;
					padding-top: 14rpx;
					padding-bottom: 16rpx;
					font-weight: bold;
				}

				.sku-val {
					display: flex;
					flex-wrap: wrap;
					.sku-val-item {
						// min-width: 80rpx;
						display: flex;
						align-items: center;
						box-sizing: border-box;
						text-align: center;
						padding: 0 32rpx;
						margin-right: 24rpx;
						height: 56rpx;
						background: #F6F6F6;
						border-radius: 28rpx;
						margin-bottom: 16rpx;
						border: 1px solid #F6F6F6;

						text {
							font-weight: 400;
							font-size: 26rpx;
							line-height: 26rpx;
							color: #191919;
						}
					}

					.pitch-on {
						border: 1px solid $wsf-color-new-red;
						background: rgba(255,231,235,0.5);
						text {
							color: $wsf-color-new-red;
						}
					}

					.disable {
						background-color: #f2f2f2;
						border: 1px solid #f2f2f2;
						color: #bababa;
					}
				}
			}
		}
	}

	.fixed-column {
		border-top: 1px solid #f5f5f5;
		width: 100%;
		position: absolute;
		bottom: 0;
		left: 0;
		// padding: 10rpx 36rpx;
		box-sizing: content-box;
        padding-bottom: env(safe-area-inset-bottom);

		p {
			line-height: 24rpx;
			padding: 2rpx 0 12rpx;
			text-align: center;
			color: #999;
			font-size: 24rpx;

			span {
				color: $wsf-color-red;
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
				background-color: $wsf-color-red;
				color: #fff;
			}

			.bug-now {
				background: linear-gradient(90deg, #FF8011 0%, #FE3040 100%);
				color: #fff;
			}

			.btn-grey {
				background: #f2f2f2;
				color: #bababa;
			}
		}
	}
}
.service {
	margin: 0 24rpx;
	.service-time {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		padding: 19rpx 0;
		.flex-time {
			display: flex;
			align-items: center;
			span {
				flex-shrink: 0;
				font-size: 26rpx;
				color: #C3C3C3;
				width: 76rpx;
			}
			.icon-adrs {
				width: 32rpx;
				height: 32rpx;
				display: block;
				padding-right: 4rpx;
			}
			.selects {
				font-size: 26rpx;
				color: #191919;
				// line-height: 34rpx;
			}
			.colors_ {
				font-size: 26rpx;
				color: #C3C3C3;
			}
			.address_ {
				width: 480rpx;
				overflow: hidden;  //超出隐藏
				white-space: nowrap; //不折行
				text-overflow: ellipsis; //溢出显示省略号
			}
		}
		img {
			width: 32rpx;
			height: 32rpx;
			display: block;
		}
	}
}
.serve {
	background-color: rgba(246, 246, 246, 0.5);
	border-radius: 0 0 16rpx 16rpx;
	padding: 20rpx 24rpx 24rpx 24rpx;
	.serve-name {
		display: flex;
		flex-wrap: wrap;
		.flex-name {
			display: flex;
			align-items: center;
			padding-right: 16rpx;
			padding-bottom: 8rpx;
			img {
				width: 24rpx;
				height: 26rpx;
				display: block;
				flex-shrink: 0;
				padding-right: 4rpx;
			}
			span {
				font-size: 26rpx;
				font-weight: 400;
				color: #999999;
			}
		}
	}
	.packUp {
		height: 80rpx;
		overflow: hidden;
	}
	.btn {
		width: 122rpx;
		height: 32rpx;
		border-radius: 16rpx;
		margin: 0 auto;
		margin-top: 20rpx;
		img {
			width: 121rpx;
			height: 31rpx;
			display: block;
		}
	}
}
</style>

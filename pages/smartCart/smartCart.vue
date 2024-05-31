<template>
	<view class="cart-wraper" :style="[cartWraperStyle]">
		<!-- 顶部导航 -->
		<cartNav :canEdit="canEdit" @navBarInfo="getNavBarInfo" @emitEdit="emitEdit"></cartNav>

		<!-- 实际内容区域 -->
		<view class="cart-content-wraper"  :style="[cartContentStyle]">
			<!-- loading组件 -->
			<pageLoading v-if="pageLoading"></pageLoading>
			<!-- 页面加载完后才走这里的判断 -->
			<block v-else class="cart-content">
				<!-- 缺省页 -->
				<cartEmpty :height="cartEmptyHeight" :noNetwork="noNetwork" :noData="noData" :isLogin="isLink" @reload="reload"></cartEmpty>
				<!-- 加购商品列表 -->
				<view v-for="item in validList" :key="item.businessType">
					<!-- 电商业务 -->
					<block v-if="item.businessType == BUSINESS_TYPE.mall">
						<!-- 电商商品 -->
						<skuList
							v-if="item.stores && item.stores.length > 0"
							:configData="item.configData"
							:carts="item.stores"
							:isEdit="isEdit"
							@reload="getCartList"></skuList>
					</block>
				</view>
				<!-- 失效宝贝 -->
				<loseEffect :carts="invalidSkus" v-if="invalidSkus.length > 0" @reload="getCartList"></loseEffect>
			</block>
			<!-- 热销商品 -->
			<smartHotSku :pageType="4" :getHotSkuFn="getHotSkuFn" :dealHotSkuFn="dealHotSkuFn" :loadSignal="loadHotSkuSignal"></smartHotSku>
		</view>
		
		<!-- 底部导航栏 -->
		<smartTabBar @tabBarInfo="getTabBarInfo"></smartTabBar>
	</view>
</template>

<script>

// 公共组件
import smartTabBar from '@/components/smart/smart-tab-bar/smart-tab-bar';
import pageLoading from '@/common/components/page-loading';
import smartHotSku from '@/components/smart/smart-hot-sku/smart-hot-sku';
// 内部组件
import cartEmpty from './components/cart-empty/index';
import skuList from './components/sku-list/index';
import loseEffect from './components/lose-effect/index';
import cartNav from './components/cart-nav/index';

// 获取接口
import { shoppingCartList } from '@/common/smart-api/cartApi'
import { GetRecommendCommodity } from "@/common/smart-api/homeApi";

// 获取工具方法，常量等等
import { BUSINESS_TYPE } from '@/common/constants/order'
import { priceFilter } from "@/common/wsfFilter.js";
import { fenToYuan } from "@/common/utils.js";

export default {
	components: { 
		smartTabBar,
		smartHotSku,
		pageLoading,
		cartEmpty,
		skuList,
		loseEffect,
		cartNav
	},
	data() {
		return {
			// 页面常量
			BUSINESS_TYPE,

			// 头部几何数据
			navHeight: 0,
			tabbarHeight: 0,
			isEdit: false, // 由头部控制，所有业务线都可编辑

			isLink: false, // 是否登录
			noNetwork: false, // 无网络，主接口报错
			noData: false, // 无数据
			pageLoading: true, // 页面loading，主接口渲染成功置为false

			// 购物车数据，现在只有电商商品
			validList: [], // 所有业务线下的有效商品
			invalidSkus: [], // 目前这个只有电商商品才有失效商品

			// 加载热销商品信号
			loadHotSkuSignal: 0
		}
	},
	computed: {
		cartWraperStyle() {
			return {
				paddingTop: `${this.navHeight}px`,
				paddingBottom: `${this.tabbarHeight}px`,
			}
		},
		cartContentStyle() {
			// 13是上面一丢丢的margin
			return {
				minHeight: `calc(100vh - ${this.navHeight + this.tabbarHeight + 13}px)`
			}
		},
		cartEmptyHeight() {
			// 比上面多一点点防止出现滚动条
			return `calc(100vh - ${this.navHeight + this.tabbarHeight + 15}px)`
		},
		canEdit() {
			return this.validList.length > 0
		}
	},
	onLoad: function(option) {
		
	},
	onShow: function() {
		// 初始化
		this.initData()
	},
	onReachBottom() {
		this.reachBottom()
  },
	methods: {
		// 初始化
		async initData() {
			// 重置页面状态
			this.initPageStatus()
			// 判断是否登录
			this.isLink = !!uni.getStorageSync('newToken')
			if(!this.isLink) {
				this.pageLoading = false
				return
			}
			// 主接口
			this.getCartList().then(ret => {
				this.pageLoading = false
				let { validList, invalidSkus} = ret || {}
				if (validList.length == 0 && invalidSkus.length == 0 ) {
					this.noData = true
				}
			}).catch(err => {
				this.pageLoading = false
				this.noNetwork = true
			})

		},
		// 重置页面状态
		initPageStatus() {
			this.isLink = false // 是否登录
			this.noNetwork = false // 无网络，主接口报错
			this.noData = false // 无数据
			this.pageLoading = true // 页面loading，主接口渲染成功置为false

			this.validList = [] // 所有业务线下的有效商品
			this.invalidSkus = [] // 失效商品
		},
		// 重新渲染页面
		reload() {
			this.initData()
		},
		
		// 获取购物车数据
		getCartList() {
			// resolve的作用是返回主接口
			return new Promise((resolve, reject) => {
				let params = {
				}
				// this.$u.api.QueryShoppingCarts().then(res => {
				shoppingCartList(params).then((res = {}) => {
					let data = res.data || {}
					resolve(data)
					this.dealCartDataFn(data)
				}).catch(err => {
					// 接口报错
					reject(false)
				});
			})
			
		},
		// 处理接口中购物车数据
		dealCartDataFn (data) {
			let realData = this.$u.deepClone(data || {})
			// 处理后台数据
			let validList = realData.validList || []
			validList.forEach(item => {
				// 抽离配置文件传入组件
				let {
					businessType,
					businessTypeName,
					businessIconUrl
				} = item;
				item.configData = {
					businessType,
					businessTypeName,
					businessIconUrl
				};
				// 循环处理数据
				// 1、重置checked
				(item.stores || []).forEach(store => {
					(store.validSpus || []).forEach(spu => {
						spu.checked = false
						item.actionShow = false
						spu._oldPrice = fenToYuan(spu.oldPrice)
						spu._afterCouponPrice = fenToYuan(spu.afterCouponPrice)
					})
				})
			});
			this.validList = validList

			// 重置checked
			let invalidSkus = realData.invalidSkus || []
			invalidSkus.forEach(item => {
				item.checked = false
				item.actionShow = false
				item._oldPrice = fenToYuan(item.oldPrice)
				item._afterCouponPrice = fenToYuan(item.afterCouponPrice)
			})
			this.invalidSkus = invalidSkus
			console.log(this.validList, this.invalidSkus, 'this.carts');
		},
		// 获取顶部导航栏信息
		getNavBarInfo(data) {
			this.navHeight = data.navHeight || 0
		},
		// 获取底部tabbar信息
		getTabBarInfo(data) {
			this.tabbarHeight = data.tabbarHeight || 0
		},
		// 去首页
		goIndex() {
			this.$smart.go('Index')
		},
		// 去登录页
		goLogin() {
			this.$smart.go('QuickLogin', { cartRoute: 'pages/smartCart/smartCart' })
		},

		// 获取热销商品方法
		getHotSkuFn() {
			return GetRecommendCommodity
		},

		// 处理热销商品数据的方法
		dealHotSkuFn() {
			return (data) => {
				return data.map((item) => {
					return item;
				})
			}
		},

		// 编辑购物车
		emitEdit(data) {
			this.isEdit = data
		},

		// scrollview 到达底部
		reachBottom() {
			this.loadHotSkuSignal = Math.random()
		}
	},
}
</script>

<style scoped lang="scss">
.cart-wraper {
	background-color: #fff;
}
.cart-content-wraper {
	background-color: #f6f6f6;
	border-radius: 24rpx 24rpx 0 0;
	margin-top: 26rpx;
	padding: 1rpx 0;
}

/deep/ .applet-template-recommend {
	background-color: #f6f6f6!important;
	.u-load-more-wrap {
		background-color: transparent!important;
	}
}

</style>

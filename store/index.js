import Vue from 'vue'
import Vuex from 'vuex'
import SETTINGS from './settings/index'
import AFTER_SALES_CONFIG from './afterSales/index'
Vue.use(Vuex)
const store = new Vuex.Store({
	state: {
		isShowCouponDialog: false,
		isShowThematicPost: false,
		isDistribution: false,
		intoSource: 3, //来源：2万顺福H5 3万顺福小程序 4万顺福公众号（微信浏览器）5万顺叫车app车主端 6万顺叫车app乘客端
    	channelCode: 5,
		orderLastTotalPriceCopy:0,// 确认订单页结算金额
		refresh: false, // 是否刷新首页热销商品列表数据
		gifTime: false, // 是否显示gif图
		timeOut: null,
		bannerCurrent: ''
	},
	mutations: {
		REFRESH(state,data) {
			state.refresh = data
		},
		GIFTIME(state,data) {
			state.gifTime = true
			if (state.timeOut){
        clearTimeout(state.timeOut)
      }
      state.timeOut = setTimeout(() => {
        // console.log('-------------------20秒')
        state.gifTime = false
      }, 2000);
		},
		ORDER_LAST_TOTAL_PRICE_COPY (state, data){
			state.orderLastTotalPriceCopy = data
		  },
		SET_INDEXCOUPONOPEN(state, data) {
			state.isShowCouponDialog = data
		},
		SET_DISTRIBUTION(state, data) {
			state.isDistribution = data
		},
		SET_INTO_SOURCE(state, data) {
			state.intoSource = data
		},
		SET_INTO_CHANNEL_CODE(state, data) {
			state.channelCode = data
		},
		SET_THEMATICPOST(state, data) {
			state.isShowThematicPost = data
		},
		SET_BANNERCURRENT(state, data) {
			state.bannerCurrent = data
		}
	},
	actions: {
		refreshFn({commit},data){
			commit('REFRESH',data)
		},
		gifTimeFn({commit},data){
			commit('GIFTIME',data)
		},
		orderLastTotalPriceCopy({commit},data){
			commit('ORDER_LAST_TOTAL_PRICE_COPY',data)
		  },
		distributionData({
			commit
		}, data) {
			commit("SET_DISTRIBUTION", data)
		},
		intoSourceData({
			commit
		}, data) {
			commit("SET_INTO_SOURCE", data)
		},
		channelCodeData({
			commit
		}, data) {
			commit("SET_INTO_CHANNEL_CODE", data)
		},
		// 设置展示专题海报
		setThematicPost({
			commit
		}, data) {
			commit('SET_THEMATICPOST', data)
		}
	},
	getters: {
		getRefresh (state) {
			return state.refresh
		},
		getGifTime (state) {
			return state.gifTime
		},
		orderLastTotalPriceCopy (state) {
			return state.orderLastTotalPriceCopy
		},
		getDistribution(state) {
			return state.isDistribution
		},
		getIntoSource(state) {
			return state.intoSource
		},
		getIntoChannelCode(state) {
			return state.channelCode
		},
		getThematicPost(state) {
			return state.isShowThematicPost
		},
		getShowCouponDialog(state) {
			return state.isShowCouponDialog
		},
		getBannerCurrent: state => state.bannerCurrent,
	},
	modules: {
		SETTINGS,
		AFTER_SALES_CONFIG
	}
})
export default store

import Vue from "vue";
const vm = Vue.prototype;
const state = {
	exchangeSkuCanUseFlag: false,
};
const getters = {
	exchangeSkuCanUseFlag: (state) => state.exchangeSkuCanUseFlag,
};
const mutations = {
	CHECK_EXCHANGE_SKU_OR_SPU: (state, data) => {
		state.exchangeSkuCanUseFlag = data
	},
};

const actions = {
	// 换货申请时校验商品
	checkExchangeSkuOrSpu({
		commit
	}, data) {
		return new Promise((resolve, reject) => {
			let flag = false
			vm.$u.api.checkSpuOrSku(data).then(res => {
				if (res.data == 1) {
					flag = true
				} else {
					flag = false
				}
				commit('CHECK_EXCHANGE_SKU_OR_SPU', flag)
				resolve(res)
			}).catch(error => {
				reject(error)
			})
		})
	}

};

export default {
	namespaced: true,
	state,
	getters,
	mutations,
	actions,
};

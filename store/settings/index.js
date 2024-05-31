import Vue from "vue";
const vm = Vue.prototype;
const state = {
  wsfFloors: [],
  wsfLayout: {},
  floatBtnData: {},
  headerData: {},
  pageNavData: {},
  // 分销
  distributionWsfFloors: [],
  distributionWsfLayout: {},
  distributionFloatBtnData: {},
  distributionHeaderData: {},
  hiddenPost: true,
};
const getters = {
  headerData: (state) => state.headerData,
  wsfFloors: (state) => state.wsfFloors,
  wsfLayout: (state) => state.wsfLayout,
  floatBtnData: (state) => state.floatBtnData,
  hiddenPost: (state) => state.hiddenPost,
  pageNavData: (state) => state.pageNavData,
  // 分销
  distributionWsfFloors: (state) => state.distributionWsfFloors,
  distributionWsfLayout: (state) => state.distributionWsfLayout,
  distributionFloatBtnData: (state) => state.distributionFloatBtnData,
  distributionHeaderData: (state) => state.distributionHeaderData,
};
const mutations = {
  HIDDEN_POST: (state,data) => {
    state.hiddenPost = data
  },
  CHANGE_WSFFLOORS: (state, data) => {
    state.wsfFloors = data;
  },
  CHANGE_FLOATBTNDATA: (state, data) => {
    state.floatBtnData = data;
  },
  CHANGE_WSFLAYOUT: (state, data) => {
    state.wsfLayout = data;
  },
  CHANGE_HEADERDATA: (state, data) => {
    state.headerData = data;
  },
  CHANGE_PAGENAVDATA: (state, data) => {
    state.pageNavData = data;
  },
  // 分销
  CHANGE_DISTRIBUTION_WSFFLOORS: (state, data) => {
    state.distributionWsfFloors = data;
  },
  CHANGE_DISTRIBUTION_FLOATBTNDATA: (state, data) => {
    state.distributionFloatBtnData = data;
  },
  CHANGE_DISTRIBUTION_WSFLAYOUT: (state, data) => {
    state.distributionWsfLayout = data;
  },
  CHANGE_DISTRIBUTION_HEADERDATA: (state, data) => {
    state.distributionHeaderData = data;
  },
  FLOAT_BTN_IS_SHOW: (state, bool) => {
	  state.floatBtnData.showConfig = bool
  },
  DISTRIBUTION_FLOAT_BTN_IS_SHOW: (state, bool) => {
	state.distributionFloatBtnData.showConfig = bool
},
};

const actions = {
  hiddenPostFn({commit},bool){
    commit('HIDDEN_POST',bool)
  },
	floatBtnIsShow({commit}, bool){
		commit('FLOAT_BTN_IS_SHOW',bool)
	},
	distributionFloatBtnIsShow({commit}, bool){
		commit('DISTRIBUTION_FLOAT_BTN_IS_SHOW',bool)
	},
  /* 获取模板数据 */
  queryIndexTemplate({ commit }, isDistribution) {
    let that = this;
    let apiName = isDistribution ? "DistributionIndex" : "AppletIndex";
    console.log(apiName,'apiName');
    vm.$u.api[apiName]({ storeId: 0 }).then((res) => {
      let dataJson = JSON.parse(res.data.contentJson);
      if (res.code === 200) {
        // uni.setStorageSync('_wsf_template', JSON.stringify(res.data));
        if (dataJson) {
          let y = isDistribution;
          commit(
            y ? "CHANGE_DISTRIBUTION_HEADERDATA" : "CHANGE_HEADERDATA",
            dataJson.headerData
          ); // 页面背景模块
          commit(
            y ? "CHANGE_DISTRIBUTION_WSFFLOORS" : "CHANGE_WSFFLOORS",
            dataJson.contentList
          ); // 页面配置模块
          commit(
            y ? "CHANGE_DISTRIBUTION_FLOATBTNDATA" : "CHANGE_FLOATBTNDATA",
            dataJson.floatBtnData
          ); // 页面浮动模块
          commit(
            y ? "CHANGE_DISTRIBUTION_WSFLAYOUT" : "CHANGE_WSFLAYOUT",
            dataJson.tabData
          ); // 页面底部tabs模块
          commit( 
            y ? "" : "CHANGE_PAGENAVDATA",
            dataJson.pageNavData
          ); // 页面nav导航模块
        }
      }
    });
  },
  advertVisitRequest({common}, params){
    // vm.$u.api.advertVisit(params)
  },
  shareVisitRequest({common}, params){
    vm.$u.api.shareVisit(params)
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};

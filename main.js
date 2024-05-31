import Vue from 'vue'
import App from './App'
// 从1.6.9 升级到下面的1.8.6最新版本
// import uView from "uview-ui"
import uView from 'uview-v1_1.8.6'

import wsfRoute from './common/wsfRoute.js'
import smartRoute from './common/smartRoute.js'
import mixins from './mixins/mixins.js'
import share from './mixins/share.js'
import './common/localstorage.js'
import {mallImg, smartImg, appVersion} from "@/common/config.js";
Vue.config.productionTip = false

Vue.use(uView)
Vue.mixin(mixins)
Vue.mixin(share)

//引入vuex
import store from './store'
//把vuex定义成全局组件
Vue.prototype.$store = store
Vue.prototype.$mallImg = mallImg
Vue.prototype.$smartImg = smartImg
Vue.prototype.$appVersion = appVersion

Vue.prototype.$bus = new Vue()

App.mpType = 'app'

const app = new Vue({
    ...App,
		 store
})

// http拦截器，此为需要加入的内容，如果不是写在common目录，请自行修改引入路径

// 注册过滤器
import * as filter from './common/wsfFilter.js'

Object.keys(filter).forEach(key => {
  Vue.filter(key, filter[key])
})
// 注册字典过滤器
import * as dict from './common/dict.js'
Object.keys(dict).forEach(key => {
  console.log(key)
  Vue.filter(key, function(value) {
    const idx = dict[key].findIndex(item => item.value == value)
    return idx >= 0 ? dict[key][idx].label : ''
  })
})

import httpInterceptor from './common/http.interceptor.js'
// 这里需要写在最后，是为了等Vue创建对象完成，引入"app"对象(也即页面的"this"实例)
Vue.use(httpInterceptor, app)
let wsf = {
	go: wsfRoute
}
Vue.prototype.$wsf = wsf

// 注册智慧生活跳转
let smart = {
	go: smartRoute
}
Vue.prototype.$smart = smart
//全局注册oss
Vue.prototype.$oss = httpInterceptor.ossUrl
// http接口API集中管理引入部分
import httpApi from './common/http.api.js'
Vue.use(httpApi, app)

// 智慧生活接口
import { initHttp } from './common/smart-api/http.interceptor.js'
initHttp(Vue, app)

app.$mount()

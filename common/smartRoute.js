// 路由映射
import routeMapping from './routerMapping.js'
import { getUrlParam, getRoute } from './utils.js'

import Vue from 'vue'
import pagesJson from '@/pages.json'

// 获取tabbar，判断跳转页面是否属于tabbar页面
function isTabBarPage(sceneName) {
	let tabBar = (pagesJson.tabBar || {}).list || []
	let tabBarMap = tabBar.map(item => {
		return getRoute(item.pagePath)
	})

	// 如果是简写map
	if (tabBarMap.indexOf(sceneName) !== -1) {
		return true
	}
	// 如果是原生链接
	// 对原始链接做处理
	let { path: urlPath } = dealUrl(sceneName)
	let tab = tabBar.find(item => {
		return item.pagePath == urlPath || '/' + item.pagePath == urlPath
	})
	if (tab) {
		return true
	}
	return false
}

// 构造链接
function createUrl(url, params) {
	if (params && Object.keys(params).length !== 0) {
		let queryData = []
		for (var key in params) {
			queryData.push(`${key}=${params[key]}`)
		}
		let query = queryData.join('&')
		url += url.indexOf('?') > -1 ? `&${query}` : `?${query}`
	}
	return url
}

// 针对带参数的链接做处理
function dealUrl(url = '') {
	let urlArr = url.split('?')
	let path = urlArr[0] || ''
	let params = getUrlParam(url)
	return {
		path,
		params
	}
}

// 路由跳转
export default function(sceneName, params, method) {
	let pages = getCurrentPages();
	let jumpMethod = 'navigateTo';

	// 当超出页面栈时使用redirectTo 关闭当前页面，跳转到应用内的某个页面。
	if (pages.length >= 9) {
		jumpMethod = 'redirectTo'
	}

	// 判断是否为tabBar导航栏页面,如果是 使用 switchTab 跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面。
	// tabbar不支持传参
	// const TabBarList = ['Index', 'Cart', 'UserCenter', 'Classify', 'Distribution']
	if (isTabBarPage(sceneName)) {
		jumpMethod = 'switchTab'
		params = {}
	}

	// 如果指定了跳转模式,则为最高优先级
	if (method && pages.length < 10) {
		jumpMethod = method
	}

	/******************* 这个位置处理特殊跳转 start **********************/

	// 判断是否为直播链接
	if(sceneName.indexOf('plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin') !== -1){
		uni[jumpMethod]({url:sceneName})
		return
	}
	// 判断是否为外部链接地址(https),是外部链接则跳转到指定的web-view组件页面
	if(sceneName.indexOf('https://') !== -1){
		console.log('https跳转模式🚗🚗🚗');
		let httpsUrl = '',
			options = '',
			url='',
			token=uni.getStorageSync('newToken')
		if(sceneName.indexOf('?') !== -1){
			httpsUrl = sceneName.split('?')[0]
			options = '?'+sceneName.split('?')[1]
			if(token) {
				options += `&token=${token}`
			}
			// 避免在链接中带有中文字符，在 iOS 中会有打开白屏的问题，建议加一下 encodeURIComponent
			url = routeMapping.httpsWebView.path+'?url='+encodeURIComponent(httpsUrl+options)
		}else {
			httpsUrl = sceneName
			if(token) {
				httpsUrl += `?token=${token}`
			}
			// 避免在链接中带有中文字符，在 iOS 中会有打开白屏的问题，建议加一下 encodeURIComponent
			url = routeMapping.httpsWebView.path+'?url='+encodeURIComponent(httpsUrl)
		}

		console.log(url, '最终链接');
		uni[jumpMethod]({url})
		return
	}
	// 判断是否为原始页面路由链接
	// 如果是原始链接这里做个转换，便于权限控制，比如是是否需要登录
	if (sceneName.indexOf('pages/') !== -1 || sceneName.indexOf('/pages/') !== -1) {
		// 对原始链接做处理
		let {params: urlParams, path: urlPath} = dealUrl(sceneName)
		let route = getRoute(urlPath)
		// 没命中路由就直接跳走
		if (!route) {
			let path = '/'+sceneName
			let url = createUrl(path, params)
			uni[jumpMethod]({
				url
			});
			return
		} else {
			sceneName = route
			params = Object.assign({}, urlParams, params)
		}
	}

	/******************* 这个位置处理特殊跳转 end **********************/

	// 路由地址
	if (!routeMapping[sceneName]) {
		console.error(`找不到该路由地址,请确保该路由地址 { ${sceneName} }填写正确`)
		return
	}
	let url = routeMapping[sceneName].path
	url = createUrl(url, params)
	console.log('正在跳转页面', url)
	// console.log("returnUrl", encodeURIComponent(url))
	// console.log('routeMapping[sceneName]', routeMapping[sceneName]);
	// console.log('页面是否需要登录权限', routeMapping[sceneName].Auth);

	// 需要登录 并且没有登录 则跳转到登录页面
	if (routeMapping[sceneName].Auth && !Vue.prototype.$globalData.isLink) {
		// console.log('需要登录');
		uni[jumpMethod]({
			url: routeMapping.QuickLogin.path + '?returnUrl=' + encodeURIComponent(url)
		})
	} else {
		// 不需要登录 直接跳转
		uni[jumpMethod]({
			url
		})
	}
}
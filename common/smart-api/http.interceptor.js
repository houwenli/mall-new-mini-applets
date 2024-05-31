import createHttp from "../request/index";
import { smartBaseUrl } from "../request/config";
import {
  BIZLINE,
  SYSPLATFORM,
  SYSPLATFORMMAP,
} from "@/common/constants/userinfo";

let http = new createHttp();

// 这里的Vue为Vue对象(非创建出来的实例)，vm为main.js中“Vue.use(smartHttpInterceptor, app)”这一句的第二个参数
// 这里因为要用到实例中的数据

// 初始化http
let initHttp = (Vue, vm) => {
  http.setConfig({
    baseUrl: smartBaseUrl,
    originalData: true, // 是否在拦截器中返回服务端的原始数据
    /**
		 * uview中http支持的配置参数，可以按需求修改
		 * 
			baseUrl, // 请求的本域名
			method: "POST",
			// 设置为json，返回后会对数据进行一次JSON.parse()
			dataType: "json",
			showLoading: true, // 是否显示请求中的loading
			loadingText: "请求中...", // 请求loading中的文字提示
			loadingTime: 800, // 在此时间内，请求还没回来的话，就显示加载中动画，单位ms
			originalData: true, // 是否在拦截器中返回服务端的原始数据
			loadingMask: true, // 展示loading的时候，是否给一个透明的蒙层，防止触摸穿透
			// 配置请求头信息
			header: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + (uni.getStorageSync('token') || '')
			},
		*/
  });

  // 请求拦截部分，如配置，每次请求前都会执行
  http.interceptor.request = (config) => {
    // 引用token
    // 方式一，存放在vuex的token，假设使用了uView封装的vuex方式
    // 见：https://uviewui.com/components/globalVariable.html
    // config.header.token = vm.token;

    // 方式二，如果没有使用uView封装的vuex方法，那么需要使用$store.state获取
    // config.header.token = vm.$store.state.token;

    // 方式三，如果token放在了globalData，通过getApp().globalData获取
    // config.header.token = getApp().globalData.username;

    // 方式四，如果token放在了Storage本地存储中，拦截是每次请求都执行的
    // 所以哪怕您重新登录修改了Storage，下一次的请求将会是最新值
    // const token = uni.getStorageSync('token');
    // config.header.token = token;
    // config.header.Token = 'xxxxxx';

    // 可以对某个url进行特别处理，此url参数为this.$u.get(url)中的url值
    // if (config.url == '/user/login') config.header.noToken = true;

    let source = vm.$store.state.intoSource;
    // 配置请求头信息
    config.header = {
      Accept: "application/json",
      "Content-Type": "application/json",
      "CHANNEL-SOURCE": source,
      "X-Version": Vue.prototype.$appVersion,
    };
    if (uni.getStorageSync("newToken")) {
      config.header.Authorization = "Bearer " + uni.getStorageSync("newToken");
      config.header["X-Token"] = "Bearer " + uni.getStorageSync("newToken");
    }
    // 根据场景切换业务线(配合后端架构)
    let bizLine = config.data.bizLine || BIZLINE.smartLife
    delete config.data.bizLine
  
    // 增加公参
    config.data =  {
      token: uni.getStorageSync("newToken"),
      agentType: SYSPLATFORMMAP[SYSPLATFORM.xcx],
      bizLine,
      version: Vue.prototype.$appVersion,
      data: config.data
    }
    // app间连支付跳转不登录小程序需要可以支付，固此处加上token
    if(config.url.includes('/api/app/order/service/orderPay')){
      config.header.Authorization = "Bearer " + config.data.data.token;
      config.header["X-Token"] = "Bearer " +  config.data.data.token;
      config.data.token =  "Bearer " +  config.data.data.token
    }    
    // 最后需要将config进行return  
    return config;
  };

  // 响应拦截，如配置，每次请求结束都会执行本方法
  http.interceptor.response = (res) => {
    if (res.statusCode == 200) {
      // res为服务端返回值，可能有code，result等字段
      // 这里对res.data进行返回，将会在this.$u.post(url).then(res => {})的then回调中的res的到
      // 如果配置了originalData为true，请留意这里的返回值
      if (res.data.code == 200) {
        return res.data;
      } else if (res.data.code == 2023) {
        //登录接口账号异常处理
        vm.$wsf.go("LoginError", null, "reLaunch");
        return false;
      } else {
        return false;
      }
    } else if (res.statusCode == 201) {
      return res.data;
    } else if (res.data.code == 401) {
      getApp().globalData.isLink = false;
      getApp().globalData.newToken = null;
      uni.removeStorageSync("newToken");
      uni.removeStorageSync("userInfo");
      let routes = getCurrentPages();
      let curRoute = routes[routes.length - 1].route;
      let curParam = routes[routes.length - 1].options
        ? routes[routes.length - 1].options
        : "";
      console.log("当前页地址curRoute-------------", curRoute);
      // console.log("url参数curParam---------",curParam)

      let params = JSON.stringify(curParam);
      // console.log("url参数curParam---------",params)

      let id = setTimeout(function () {
        vm.$u.route(
          "/pages/quickLogin/quickLogin?backUrlParams=" +
            params +
            "&curRoute=" +
            curRoute
        );
        clearTimeout(id);
      }, 1000);
      return res.data;
    } else {
      console.log("接口层面的错误,与业务无关系");
      // 如果返回false，则会调用Promise的reject回调，
      // 并将进入this.$u.post(url).then().catch(res=>{})的catch回调中，res为服务端的返回值
      console.log("res.data.path", res);
      if (!res.data.path || res.data.path.indexOf("baseinfoset") == -1) {
        if (res.data.description != "商品不存在") {
          // vm.$u.toast(res.data.description ? res.data.description : "请求失败");
          uni.showToast({
            title: res.data.description ? res.data.description : "请求失败",
            icon: "none",
            duration: 3000,
          });
        }
      }

      return false;
    }
  };
};

export { http, initHttp };

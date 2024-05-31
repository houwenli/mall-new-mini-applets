import { http } from "./http.interceptor";
// 获取热销列表
export function GetRecommendCommodity(params = {}) {
  return http.post("/api/app/order/service/recommend/recommendCommodity", params);
}
// 获取搜索列表
export function GetSearchProduct(params = {}) {
  return http.post("/api/app/order/service/search/searchProduct", params);
}

// 获取智慧生活首页模板
export function GetHomeTemplate(params = {}) {
  return http.post("/user/service/app/pageModel/getPage", params);
}

// 获取智慧生活首页城市列表
export function GetHomeCityList(params = {}) {
  return http.post("/user/service/app/pageModel/getCityList", params);
}

// 获取智慧生活首页推荐列表
export function GetHometemList(params = {}) {
  return http.post("/user/service/app/pageModel/getItemList", params);
}

// 获取智慧生活tab配置
export function getPageNavigation(params = {}) {
  return http.post("/user/service/app/pageModel/getPageNavigation", params);
}
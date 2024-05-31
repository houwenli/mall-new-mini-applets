import { http } from './http.interceptor';

// 获取购物车列表
export function shoppingCartList (params = {}) {
  return http.post('api/app/order/service/cart/shoppingCartList', params);
}

// 购物车勾选变更
export function shoppingCarCheckUpCount (params = {}) {
  return http.post('api/app/order/service/cart/shoppingCarCheckUpCount', params);
}

// 修改购物车商品数量
export function shoppingCarUpdateCount (params = {}) {
  return http.post('api/app/order/service/cart/shoppingCarUpdateCount', params);
}

// 删除购物车商品
export function shoppingCarDelete (params = {}) {
  return http.post('api/app/order/service/cart/shoppingCarDelete', params);
}

// 修改商品规格
export function initialSkuUpdate (params = {}) {
  return http.post('api/app/order/service/cart/initialSkuUpdate', params);
}

// 商品规格列表
export function selectinitialSkuList (params = {}) {
  return http.post('api/app/order/service/cart/selectinitialSkuList', params);
}
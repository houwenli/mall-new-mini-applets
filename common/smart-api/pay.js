import { http } from './http.interceptor';

// 获取收银台配置支付方式
export function getPayList(params = {}) {
  return http.post('/api/app/pay/service/cashDesk', params);
}

// 收银台支付
export function orderPay(params = {}) {
  return http.post('/api/app/order/service/orderPay', params);
}

// 支付状态查询
export function payQuery(params = {}) {
  return http.post('/api/app/pay/service/payQuery', params);
}


// 真.支付状态查询
export function orderPayCheck(params = {}) {
  return http.post('/api/app/order/service/orderPayCheck', params);
}

/** @description 查询用户福气值及福气值抵扣配置 */
export function getIntegralAccountAndCfg(params = {}) {
  return http.post('/user/service/app/integral/getIntegralAccountAndCfg', params)
}

// 订单相关的接口
import { http } from './http.interceptor';

// 查询订单列表
export function queryOrderByUserId (params = {}) {
  return http.post('/api/app/order/service/queryOrderByUserId', params);
}

// 查询筛选标签
export function queryLabel(params = {}) {
  return http.post('/api/app/order/service/queryLabel', params);
}

// 处理按钮事件
export function orderListButtonInfo(params = {}) {
  return http.post('/api/app/order/service/orderListButtonInfo', params);
}
import { http } from './http.interceptor';

// 发送验证码
export function getcodeSmart(params = {}) {
  return http.post('/api/app/finance/service/sms/code/send', params);
}

/**
 * 免密登录升级版本-智慧生活
 */
export function unAuthLoginSmart(params = {}) {
  return http.post('/user/service/user/unAuthLogin', params);
}

/**
 * 登录升级版本-智慧生活
 */
export function signInSignUpApp(params = {}) {
  return http.post('/user/service/user/signInSignUpApp', params);
}

/**
 * 登录升级版本-智慧生活
 */
export function bindAccountWithNoAuth(params = {}) {
  return http.post('/user/service/user/bindAccountWithNoAuth', params);
}

/**
 * 一键登录-智慧生活
 */
export function oneClickLogin(params = {}) {
  return http.post('/user/service/user/oneKeyLogin', params);
}

/**
 * 通过 openid 查找 mobile 绑定关系
 */
export function oneKeyLoginQueryBindingByOpenid(params = {}) {
  return http.post('/user/service/user/oneKeyLoginQueryBindingByOpenid', params);
}

/**
 * 传递 openid 和 mobile 2个字段都是明文传递
 */
export function oneKeyLoginWithMobileOpenid(params = {}) {
  return http.post('/user/service/user/oneKeyLoginWithMobileOpenid', params);
}
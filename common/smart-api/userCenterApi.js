import { http } from "./http.interceptor";
/*------------ 公共接口----------------- */
//发送短信验证码
export function Send(params = {}) {
  return http.post("/api/app/finance/service/sms/code/send", params);
}
// 登出
export function logoutApp(params = {}) {
  return http.post("/user/service/user/logoutApp", params);
}

/*------------ 个人中心首页（我的）模块----------------- */
// 获取【我的】信息
export function Userminequery(params = {}) {
  return http.post("/user/service/app/mine/userminequery", params);
}
// 获取订单数量
export function QueryOrderByUserIdCount(params = {}) {
  return http.post("/api/app/order/service/queryOrderByUserIdCount", params);
}
// 福气值流水查询
export function GetFqzStream(params = {}) {
  return http.post("/user/service/app/integral/getIntegralStreamPageList", params);
}

// 新福气值流水查询
export function GetNewFqzStream(params = {}) {
  return http.post("/user/service/app/integral/getIntegralStreamPageList", params);
}

// 用户福气值查询
export function GetCustomerFqz(params = {}) {
  return http.post("/user/service/app/integral/getIntegralAccountAndCfg", params);
}
// 优惠券列表
export function QueryUserCouponList(params = {}) {
  return http.post("/user/service/app/coupon/queryUserCouponList", params);
}

/*------------ 常用联系人模块----------------- */

// 添加常用联系人
export function AddCustomerCommonPhone(params = {}) {
  return http.post("/user/service/app/phone/addCustomerCommonPhone", params);
}
// 删除常用联系人
export function DeleteCustomerCommonPhone(params = {}) {
  return http.post("/user/service/app/phone/deleteCustomerCommonPhone", params);
}
// 常用联系人详情
export function SelectCustomerCommonPhoneById(params = {}) {
  return http.post(
    "/user/service/app/phone/selectCustomerCommonPhoneById",
    params
  );
}
// 查常用联系人（如果没有,添加本人注册手机号）
export function SelectCustomerCommonPhoneListAndAdd(params = {}) {
  return http.post(
    "/user/service/app/phone/selectCustomerCommonPhoneListAndAdd",
    params
  );
}
// 修改常用联系人
export function UpdateCustomerCommonPhone(params = {}) {
  return http.post("/user/service/app/phone/updateCustomerCommonPhone", params);
}
// 查询充值手机号归属地
export function GetMobileArea(params = {}) {
  return http.post("/user/service/app/customer/getMobileArea", params);
}

/*------------ 地址修改模块----------------- */

// 新增用户收货地址
export function AddAddress(params = {}) {
  return http.post("/user/service/app/address/addAddress", params);
}
// 删除地址
export function DeleteAddressById(params = {}) {
  return http.post("/user/service/app/address/deleteAddressById", params);
}
// 根据收货地址id查询收货地址
export function QueryAddressById(params = {}) {
  return http.post("/user/service/app/address/queryAddressById", params);
}
// 查询用户收货地址
export function QueryCustomerAddress(params = {}) {
  return http.post("/user/service/app/address/queryCustomerAddress", params);
}
// 修改收货地址
export function UpdateAddress(params = {}) {
  return http.post("/user/service/app/address/updateAddress", params);
}
//获取省市区树
export function AreaTree(params = {}) {
  return http.post("/user/service/app/local/areaTree", params);
}

/*------------ 我的账号模块----------------- */

// 获取账户列表
export function AccountList(params = {}) {
  return http.post("/api/app/finance/service/fund/account/list", params);
}
// 账户总资产查询(余额查询)
export function AccountAsset(params = {}) {
  return http.post("/api/app/finance/service/fund/account/asset", params);
}
// 账户流水(余额明细)
export function AccountFlow(params = {}) {
  return http.post("/api/app/finance/service/fund/account/flow", params);
}
// 新增银行卡
export function AddBankCard(params = {}) {
  return http.post("/api/app/finance/service/fund/add/bank/card", params);
}
// 获取银行卡列表
export function BankCardList(params = {}) {
  return http.post("/api/app/finance/service/fund/bank/card/list", params);
}
// 通过银行卡号获取银行名称
export function ToCardName(params = {}) {
  return http.post(
    "/api/app/finance/service/fund/bank/card/to/bank/name",
    params
  );
}
// 解除绑定
export function UnbindBankCard(params = {}) {
  return http.post("/api/app/finance/service/fund/unbind/bank/card", params);
}
// 提现 -- 需要修改请求头中的业务线
export function FundWithdraw(params = {}) {
  return http.post("/api/app/finance/service/fund/withdraw", params);
}
// 推广订单列表
export function findPromoteOrders(params = {}) {
  return http.post("/api/app/finance/service/order/toPromoteOrder", params);
}
// 提现前校验-是否可以提现 -- 需要修改请求头中的业务线
export function FundWithdrawCheck(params = {}) {
  return http.post("/api/app/finance/service/fund/withdraw/check", params);
}
// 确认提现-展示提现数据 -- 需要修改请求头中的业务线
export function FundWithdrawConfirm(params = {}) {
  return http.post("/api/app/finance/service/fund/withdraw/confirm", params);
}
// 提现详情
export function FundWithdrawDetail(params = {}) {
  return http.post("/api/app/finance/service/fund/withdraw/detail", params);
}
// 提现列表
export function FundWithdrawList(params = {}) {
  return http.post("/api/app/finance/service/fund/withdraw/list", params);
}

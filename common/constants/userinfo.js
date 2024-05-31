// 业务线
export const BIZLINE = {
  smartLife: 'SMART_LIFE', // 智慧生活
  wsfMall: 'WSF_MALL', // 万顺福电商
  mobileRecharge: 'MOBILE_RECHARGE', // 话费充值
}

// 系统平台
export const SYSPLATFORM = {
  android: 1, // 安卓
  ios: 2, // ios
  h5: 3, // h5
  xcx: 5, // 小程序
}
export const SYSPLATFORMMAP = {
  [SYSPLATFORM.android]: 'ANDROID',
  [SYSPLATFORM.ios]: 'IOS',
  [SYSPLATFORM.h5]: 'HTML',
  [SYSPLATFORM.xcx]: 'WX_SMALL_PROGRAM',
}

// 登录类型
// PASSWORD(1, "密码"), SMS(2, "短信验证码"), TOKEN(3, "令牌"), UNAUTH(4, "免密登录")
export const SIGNINTYPE = {
  messAuth: 'SMS'
}

// 验证码类型
// 可用值:SIGN_IN,SIGN_OUT,BIND_BANK_CARD,WITHDRAW,MODIFY_PHONE
export const SMSCODETYPE = {
  signIn: 'SIGN_IN',
  bindBankCard: 'BIND_BANK_CARD', //添加银行卡
  modifyPhone: 'MODIFY_PHONE', // 修改手机号
  withdraw: 'WITHDRAW' // 提现
}
// 路由映射

// 注释后方有路由参数问题, 带*的为必填项,其他为选填项
module.exports = {
  Index: {
    path: "/pages/index/index",
    Auth: false,
  }, // 首页
  // webview: {
  //   path: "/pages/index/webview",
  //   Auth: false,
  // }, // webview - 活动弹窗跳转页
  Cart: {
    path: "/pages/cart/cart",
    Auth: false,
  }, // 购物车模块
  Classify: {
    path: "/pages/classify/classify",
    Auth: false,
  }, // 分类模块
  Distribution: {
    path: "/pages/distributionIndex/distributionIndex",
    Auth: false,
  }, //分销
  UserCenter: {
    path: "/pages/usercenter/usercenter",
    Auth: false,
  }, // 个人中心
  Login: {
    path: "/pages/login/login",
    Auth: false,
  }, // 登录
  TextLogin: {
    path: "/pages/textLogin/textLogin",
    Auth: false,
  }, // 登录
  QuickLogin: {
    path: "/pages/quickLogin/quickLogin",
    Auth: false,
  }, // 一键登录(登录万顺福商城)
  Register: {
    path: "/pages/register/register",
    Auth: false,
  }, //注册并关联
  ForgetPwd: {
    path: "/pages/forgetPwd/forgetPwd",
    Auth: false,
  }, //忘记密码
  Authorization: {
    path: "/pages/authorization/authorization",
    Auth: false,
  }, //授权页
  WxAuthorize: {
    path: "/pages/wxAuthorize/wxAuthorize",
    Auth: false,
  }, //授权页

  // 商品模块相关
  // ------------------------------------------------------------------------------------------------------------------
  /**
   * @evaluation 查询商品评论
   * @params skuId: 商品skuId
   */
  evaluation: {
    path: "/productModule/pages/evaluation/evaluation",
    Auth: false,
  },
  /**
   * @EvaluationCenter 评价中心
   */
  EvaluationCenter: {
    path: "/productModule/pages/evaluation/evaluationCenter",
    Auth: true,
  },
  /**
   * @Comment 评价模块
   * @params skuId: 商品Id *
   * @params orderId: 订单Id *
   * @params storeId: 店铺Id *
   * @params storeName: 店铺名称 *
   * @params skuImage: 商品图片 *
   */
  Comment: {
    path: "/productModule/pages/evaluation/comment",
    Auth: true,
  },
  /**
   * @StoreIndex 店铺首页
   * @params storeId: 店铺Id
   * @params storeName: 店铺名称
   */
  StoreIndex: {
    path: "/productModule/pages/store/storeIndex",
    Auth: true,
  }, // 店铺首页

  StoreCategory: {
    path: "/productModule/pages/store/storeCategory",
    Auth: false,
  }, // 店铺分类

  /**
   * @Settlement 确认订单
   * @params skuInfo: 'skuid,num' eg: '173271366312,1' skuId跟数量用逗号隔开传入 用于 单商品结算
   * @params ids: [购物车id] eg: [['352','312']]  用于保存在购物车的id,数组方式传入 用于 多商品结算
   * @params isGroup: 0 eg: 0  是否是组合商品
   * @params groupId: 0 eg: 0  组合商品Id
   */
  Settlement: {
    path: "/productModule/pages/settlement/settlement",
    Auth: true,
  },
  /**
   * @Pay 收银台支付页
   * @params orderCode: '订单Id' eg: '766594953014018048'
   * @params orderMoney: '订单金额' eg: 100
   */
  Pay: {
    path: "/productModule/pages/pay/pay",
    Auth: true,
  },
  /**
   * @CheckOrderPay 检查订单支付状态
   * @params orderCode: 订单Id
   * @params orderType: 订单状态
   */
  CheckOrderPay: {
    path: "/productModule/pages/pay/checkOrderPay",
    Auth: true,
  },
  /**
   * @SpuList 搜索结果商品列表
   * @params queryString: 搜索关键字
   * @params storeId: 店铺Id 如果是店铺搜索进来的话
   * @params cateId: 分类Id
   */
  SpuList: {
    path: "/productModule/pages/spuList/spuList",
    Auth: false,
  }, //
  // 分销列表搜索结果
  DistributionSpuList: {
    path: "/distributionModule/pages/distributionSpuList/distributionSpuList",
    Auth: false,
  },
  Search: {
    path: "/productModule/pages/search/search",
    Auth: false,
  }, // 搜索页

  /**
   * @SkuDetail 商品详情
   * @params skuId: 商品skuId
   */
  SkuDetail: {
    path: "/productModule/pages/skuDetail/skuDetail",
    Auth: false,
  }, // 商品详情
  NoticePage: {
    path: "/productModule/pages/skuDetail/noticePage",
    Auth: true,
  }, // 到货通知
  SimilarPage: {
    path: "/productModule/pages/skuDetail/similarPage",
    Auth: false,
  }, // 像似商品

  seckillList: {
    path: "/productModule/pages/seckillList/seckillList",
    Auth: false,
  }, // 限时秒杀列表

  ThematicActivity: {
    path: "/productModule/pages/thematicActivity/thematicActivity",
    Auth: false,
  }, // 手机专区

  firstOrder: {
    path: "/productModule/pages/firstOrder/firstOrder",
    Auth: false,
  }, // 手机专区

  WomensDay: {
    path: "/productModule/pages/thematicActivity/womensDay/womensDay",
    Auth: false,
  }, // 妇女节

//2023女神节答题活动
  GameLandingPage: {
    path: "/activesModule/pages/answerGame/landingPage/landingPage",
    Auth: false,
  },//落地页
  answerGame:{
    path:'/activesModule/pages/answerGame/homePage/homePage',
    Auth: false,
  },//游戏首页
  answer:{
    path:'/activesModule/pages/answerGame/answer/answer',
    Auth: false,
  },//答题页
  notActivity:{
    path:'/activesModule/pages/answerGame/notActivity/notActivity',
    Auth: false,
  },//答题页
  /**
   * @param orderId 订单id
   */
  OrderList: {
    path: "/orderModule/pages/orderList/orderList",
    Auth: true,
  }, // 订单列表页
  PendingPayment: {
    path: "/orderModule/pages/pendingPayment/pendingPayment",
    Auth: true,
  }, // 待付款
  Ordereditaddress: {
    path: "/orderModule/pages/ordereditaddress/ordereditaddress",
    Auth: true,
  }, // 订单详情修改地址
  BackOrderList: {
    path: "/orderModule/pages/backOrderList/backOrderList",
    Auth: true,
  },
  ServiceOrderDetail: {
    path: "/orderModule/pages/serviceOrderDetail/serviceOrderDetail",
    Auth: true,
  }, //服务单详情(退货)
  RefundServiceDetail: {
    path: "/orderModule/pages/serviceOrderDetail/refundServiceDetail",
    Auth: true,
  }, //服务单详情(退款)
  ExchangeServiceDetail: {
    path: "/orderModule/pages/serviceOrderDetail/exchangeServiceDetail",
    Auth: true,
  }, //服务单详情(换货)
  choseAfterSalesService: {
    path: "/orderModule/pages/serviceOrderDetail/choseAfterSalesService/choseAfterSalesService",
    Auth: true,
  }, //选择售后服务
  submitServiceOrderSuccess: {
    path: "/orderModule/pages/serviceOrderDetail/submitServiceOrderSuccess/submitServiceOrderSuccess",
    Auth: true,
  }, //提交售后服务单成功
  SalesReturn: {
    path: "/orderModule/pages/serviceOrderDetail/salesReturn/salesReturn",
    Auth: true,
  }, //退货
  ExchangeGoods: {
    path: "/orderModule/pages/serviceOrderDetail/exchangeGoods/exchangeGoods",
    Auth: true,
  }, //换货
  deliveryForm: {
    path: "/orderModule/pages/serviceOrderDetail/deliveryForm/deliveryForm",
    Auth: true,
  }, //退货发货单
  progressDate: {
    path: "/orderModule/pages/serviceOrderDetail/progressDate/progressDate",
    Auth: true,
  }, //退货进度
  logisticsForm: {
    path: "/orderModule/pages/serviceOrderDetail/logisticsForm/logisticsForm",
    Auth: true,
  }, //退货发货单选择物流
  /**
   * @Refund 申请退款
   * @params orderId: 订单Id
   * @params receiptType: 退款类型 0 - 未发货  1 - 已发货未收货 2 - 已发货已收货
   */
  Refund: {
    path: "/orderModule/pages/refund/refund",
    Auth: false,
  },
  /**
   * @trackingCells 订单追踪
   * ----- 所有都是必填项 -----
   * @params expressCode: 快递公司编号
   * @params expressCompany: 快递公司名字
   * @params orderCode: 订单编号
   * @params logisticCode: 快递编号
   * @params customerName: 客户手机号后4位 - 部分快递需求
   */
  trackingCells: {
    path: "/orderModule/pages/trackingCells/trackingCells",
    Auth: true,
  },

  /**
   * @RefundDetail 取消/退款进度查询
   * ----- 所有都是必填项 -----
   * @params orderId: 订单Id
   * @params orderCode: 订单编号
   * @params cancelTime: 取消时间
   */
  RefundDetail: {
    path: "/orderModule/pages/trackingCells/refundDetail",
    Auth: true,
  },
  /**
   * @invoice 发票详情
   * ----- 所有都是必填项 -----
   * @params orderId: 订单Id
   * @params price: 订单编号
   */
  orderInvoice: {
    path: "/orderModule/pages/serviceOrderDetail/invoice/invoice",
    Auth: false,
  },

  // 用户中心模块相关
  // ------------------------------------------------------------------------------------------------------------------

  UserBrowser: {
    path: "/userCenterModule/pages/userBrowser/userBrowser",
    Auth: true,
  }, // 浏览记录
  Message: {
    path: "/userCenterModule/pages/message/message",
    Auth: true,
  }, // 消息记录
  newsLogistics: {
    path: "/userCenterModule/pages/newsLogistics/newsLogistics",
    Auth: true,
  }, // 交易物流
  newsServer: {
    path: "/userCenterModule/pages/newsServer/newsServer",
    Auth: true,
  }, // 服务通知
  newsPromotion: {
    path: "/userCenterModule/pages/newsPromotion/newsPromotion",
    Auth: true,
  }, // 优惠促销
  newsAccount: {
    path: "/userCenterModule/pages/newsAccount/newsAccount",
    Auth: true,
  }, // 账户通知

  userWallet: {
    path: "/userCenterModule/pages/userWallet/userWallet",
    Auth: true,
  }, // 用户钱包
  UserCollection: {
    path: "/userCenterModule/pages/userCollection/userCollection",
    Auth: true,
  }, //商品收藏
  UserCollectionStore: {
    path: "/userCenterModule/pages/userCollectionStore/userCollectionStore",
    Auth: true,
  }, //店铺收藏
  UserCoupon: {
    path: "/userCenterModule/pages/userCoupon/userCoupon",
    Auth: true,
  }, //用户优惠券
  newCoupon: {
    path: "/userCenterModule/pages/userCoupon/newCoupon",
    Auth: true,
  }, //优惠券
  CopunRecordList: {
    path: "/userCenterModule/pages/userCoupon/CopunRecordList",
    Auth: true,
  }, //优惠券使用记录
  GiftCard: {
    path: "/userCenterModule/pages/giftCard/giftCard",
    Auth: true,
  }, // 我的礼品卡
  BindNewGiftCards: {
    path: "/userCenterModule/pages/bindNewGiftCards/bindNewGiftCards",
    Auth: true,
  }, // 绑定礼品卡
  couponCenter: {
    path: "/userCenterModule/pages/userCoupon/couponCenter",
    Auth: true,
  }, //领券中心
  costCoupon: {
    path: "/userCenterModule/pages/userCoupon/costCoupon",
    Auth: true,
  }, //优惠券
  GoodFortuneValue: {
    path: "/userCenterModule/pages/goodFortuneValue/goodFortuneValue",
    Auth: true,
  }, //福气值流水
  UserFollowStore: {
    path: "/userCenterModule/pages/userFollowStore/userFollowStore",
    Auth: true,
  }, //关注店铺
  MyStore: {
    path: "/userCenterModule/pages/myStore/myStore",
    Auth: true,
  },
  // 设置模块相关
  // ------------------------------------------------------------------------------------------------------------------

  Account: {
    path: "/settingsModule/pages/account/account",
    Auth: true,
  }, //用户信息
  AccountName: {
    path: "/settingsModule/pages/account/accountName/accountName",
    Auth: true,
  }, // 用户昵称
  AddressList: {
    path: "/settingsModule/pages/addressList/addressList",
    Auth: true,
  }, // 地址管理
  EditAddress: {
    path: "/settingsModule/pages/addressList/editAddress",
    Auth: true,
  }, // 地址新增或编辑
  UpdatePwd: {
    path: "/settingsModule/pages/account/updatePwd/updatePwd",
    Auth: true,
  }, // 忘记密码
  UpdatePayPwd: {
    path: "/settingsModule/pages/account/payPassword/payPassword",
    Auth: true,
  }, // 忘记支付密码
  BindNewMobile: {
    path: "/settingsModule/pages/account/phoneValid/phoneValid",
    Auth: true,
  }, // 绑定手机号
  LoginError: {
    path: "/settingsModule/pages/loginError/loginError",
  }, // 登录出错页面

  // 客服模块
  // ------------------------------------------------------------------------------------------------------------------
  ToService: {
    path: "/serviceModule/pages/serviceJump/serviceJump",
    Auth: true,
  }, // 客服中转页面
  livePlayer: {
    path: "/serviceModule/pages/livePlayer/livePlayer",
    Auth: false,
  }, // 直播页面

  // 分销模块
  // ------------------------------------------------------------------------------------------------------------------
  PromotionRegister: {
    path: "/distributionModule/pages/promotionRegister/promotionRegister",
    Auth: true,
  }, //分销商城推广员注册
  distriburionSearch: {
    path: "/distributionModule/pages/distributionIndex/distriburionSearch",
    Auth: true,
  }, //分销商城搜索页
  distributionList: {
    path: "/distributionModule/pages/distributionIndex/distributionList",
    Auth: true,
  }, //分销商城列表页

  distributionMine: {
    path: "/distributionModule/pages/distributionMine/distributionMine",
    Auth: true,
  }, //分销数据

  distributionData: {
    path: "/distributionModule/pages/distributionData/distributionData",
    Auth: true,
  }, //分销数据

  RulesDescription: {
    path: "/distributionModule/pages/rulesDescription/rulesDescription",
    Auth: true,
  }, //规则说明

  commissionParticulars: {
    path: "/distributionModule/pages/commissionParticulars/commissionParticulars",
    Auth: true,
  },

  distributionSkuDetail: {
    path: "/distributionModule/pages/distributionSkuDetail/distributionSkuDetail",
    Auth: false,
  }, //分销商品详情

  DistributionOrder: {
    path: "/distributionModule/pages/distributionOrder/distributionOrder",
    Auth: true,
  }, //分销订单列表

  DistributionOrderDetail: {
    path: "/distributionModule/pages/distributionOrderDetail/distributionOrderDetail",
    Auth: true,
  }, //分销订单列表

  distributionSpuShare: {
    path: "/distributionModule/pages/distributionSpuShare/distributionSpuShare",
    Auth: true,
  }, //分销商品分享

  promoteOrderlist: {
    path: "/distributionModule/pages/promotionOrder/list",
    Auth: true,
  }, // 推广订单列表
  promoteOrderDetail: {
    path: "/distributionModule/pages/promotionOrder/detail",
    Auth: true,
  }, // 推广订单详情
  bindingAlipay: {
    path: "/distributionModule/pages/distributionAlipay/bindingAlipay",
    Auth: true,
  }, // 绑定支付宝账号
  modifyAlipay: {
    path: "/distributionModule/pages/distributionAlipay/modifyAlipay",
    Auth: true,
  }, // 修改支付宝账号
  withdrawAlipay: {
    path: "/distributionModule/pages/distributionAlipay/withdrawAlipay",
    Auth: true,
  }, // 余额提现

  Withdraw: {
    path: "/distributionModule/pages/withdraw/withdraw",
    Auth: true,
  }, //提现
  Balance: {
    path: "/distributionModule/pages/withdraw/balance",
    Auth: true,
  }, //余额提现
  WithdrawRecord: {
    path: "/distributionModule/pages/withdraw/withdrawRecord",
    Auth: true,
  }, //提现记录

  bankCard: {
    path: "/distributionModule/pages/bankCard/bankCard",
    Auth: true,
  }, //银行卡

  bankCardOperation: {
    path: "/distributionModule/pages/bankCard/bankCardOperation",
    Auth: true,
  }, //银行卡操作

  shareRecord: {
    path: "/distributionModule/pages/shareRecord/shareRecord",
    Auth: true,
  }, //分享记录

  // web-view 页面
  httpsWebView: {
    path: "/httpsWebView/pages/webView/webView",
  },
  // 答题页
  specialModule:{
    path:'/specialModule/pages/ranking',
    Auth: false,
  },
  ToMotor: { path: "/motorModule/pages/motorCarDetail/detail", Auth: true, }, // 两轮车详情页面
  motorOrderDetail: { path: "/orderModule/pages/motorCarDetail/motorOrderDetail", Auth: true, }, // 两轮车订单列表页面
  Licensing: { path: "/orderModule/pages/motorCarDetail/licensing", Auth: true, }, // 两轮车上牌指引
  motorHome: { path: "/motorModule/pages/motorCarDetail/motorHome", Auth: true, }, // 万顺电动车首页
  MobieChange: { path: "/motorModule/pages/motorCarDetail/MobieChange", Auth: true, }, // 更改呼叫号码

  orderSearch: { path: "/orderModule/pages/orderSearch/index", Auth: true, }, // 订单搜索
  orderSearchList: { path: "/orderModule/pages/orderSearch/orderSearchList", Auth: true, }, // 订单搜索列表
  
  // 话费充值
  phoneCharge: { path:'/phoneChargeModule/pages/homePage/homePage', Auth: false },
  payConfirm: { path:'/phoneChargeModule/pages/payConfirm/payConfirm', Auth: false },
  rechargRecord: { path:'/phoneChargeModule/pages/rechargRecord/rechargRecord', Auth: false },
  rechargSuccess: { path:'/phoneChargeModule/pages/rechargSuccess/rechargSuccess', Auth: false },
  recordDetails: { path:'/phoneChargeModule/pages/recordDetails/recordDetails', Auth: false },
  warmReminder: { path:'/phoneChargeModule/pages/warmReminder/warmReminder', Auth: false },
  oftenPhone: { path:'/phoneChargeModule/pages/oftenPhone/oftenPhone', Auth: false },
  editPhone: { path:'/phoneChargeModule/pages/editPhone/editPhone', Auth: false },
  yplPay: {
    path: "/pages/yplPay/yplPay",
    Auth: true,
  }, // 易票联支付

  // 智慧生活首页
  SmartIndex: {
    path: "/pages/smartIndex/smartIndex",
    Auth: false,
  },
  // 智慧生活购物车
  SmartCart: {
    path: "/pages/smartCart/smartCart",
    Auth: false,
  },
  // 智慧个人中心
  SmartUCenter: {
    path: "/pages/smartUCenter/smartUCenter",
    Auth: false,
  },
  // 智慧生活获取定位
  smartPositon: { path:'/smartModule/pages/smartPositon/smartPositon', Auth: false },
  smartCoupon: { path:'/smartModule/pages/smartCoupon/smartCoupon', Auth: false }, //智慧生活优惠券
  smartFuqizhi: { path:'/smartModule/pages/smartFuqizhi/smartFuqizhi', Auth: false }, //智慧生活福气值
  smartSetUp: { path:'/smartModule/pages/smartSetUp/smartSetUp', Auth: false },//智慧生活设置
  smartAddress: { path:'/smartModule/pages/smartAddress/smartAddress', Auth: false },//智慧生活收货地址列表
  smartEditAddress: { path:'/smartModule/pages/smartAddress/smartEditAddress', Auth: false },//智慧生活收货地址编辑
  smartContacts: { path:'/smartModule/pages/smartContacts/smartContacts', Auth: false },//智慧生活常用联系人
  smartEditContacts: { path:'/smartModule/pages/smartContacts/smartEditContacts', Auth: false }, //智慧生活编辑联系人
  smartSearch: { path: "/smartModule/pages/smartSearch/smartSearch", Auth: false }, // 智慧生活搜索页
  smartSpuList: { path: "/smartModule/pages/smartSpuList/smartSpuList", Auth: false }, // 智慧生活搜索页
  smartAccount: { path: "/smartModule/pages/smartAccount/smartAccount", Auth: false }, //智慧生活我的账户
  smartBalance: { path: "/smartModule/pages/smartAccount/smartBalance", Auth: false }, //智慧生活余额明细
  smartExtract: { path: "/smartModule/pages/smartAccount/smartExtract", Auth: false }, //智慧生活提现
  smartExtractRecords: { path: "/smartModule/pages/smartAccount/smartExtractRecords", Auth: false }, //智慧生活提现记录
  smartExtractRecordsDetails: { path: "/smartModule/pages/smartAccount/smartExtractRecordsDetails", Auth: false }, //智慧生活提现详情
  smartBankCard: { path: "/smartModule/pages/smartAccount/smartBankCard", Auth: false }, //智慧生活银行卡
  smartEditBankCard: { path: "/smartModule/pages/smartAccount/smartEditBankCard", Auth: false }, //智慧生活银行卡编辑
  smartPay: { path: "/smartModule/pages/smartPay/smartPay", Auth: false }, // 智慧生活支付页
  smarCheckOrderPay: { path: "/smartModule/pages/smartPay/checkOrderPay", Auth: false }, // 智慧生活支付结果
  smartOrder: { path: "/smartModule/pages/smartOrder/smartOrder", Auth: false }, // 智慧生活订单列表页
  smartOrderSearch: { path: "/smartModule/pages/smartOrder/smartOrderSearch", Auth: false }, // 智慧生活订单列表页
  // 电商集采  
  collectionIndex: { path:'/collectionModule/pages/index/index', Auth: false },
  collectionDetail: { path:'/collectionModule/pages/skuDetail/skuDetail', Auth: false },


  collectionIndex: { path:'/collectionModule/pages/index/index', Auth: false },//集采列表
  collectionDetail: { path:'/collectionModule/pages/skuDetail/skuDetail', Auth: false },//集采详情
  
  // 404: {path: '/pages/skudetail/404', Auth: false},
  // Thematic: {path: '/pages/thematic/thematic', Auth: false},
  // StoreList: {path: '/pages/store/searchStoreList', Auth: false},
  // PointMall: {path: '/pages/pointmall/pointmall', Auth: false},
  // PointSkuDetail: {path: '/pages/pointskudetail/pointskudetail', Auth: false},
  // PointSkuSubmitOrder: {path: '/pages/pointskusubmitorder/pointskusubmitorder', Auth: true},
  // PointOrderNoPaySuccess: {path: '/pages/order/PointOrderNoPaySuccess', Auth: true},
  // PointOrderList: {path: '/pages/order/pointOrderList', Auth: true},
  // PointOrderDetail: {path: '/pages/order/pointOrderDetail', Auth: true},
  // LivePlayerRoomList: {path: '/pages/live/livePlayerRoomList', Auth: false},
  // StorePanicMarketing: {path: '/pages/marketing/storepanicMarketing', Auth: false},
  // GroupMarketingRule: {path: '/pages/skudetail/groupMarketingRule', Auth: false},
  // GroupMarketing: {path: '/pages/marketing/groupMarketing', Auth: false},
  // MySpread: {path: '/pages/usercenter/myspread', Auth: true},
  // MySpreadCash: {path: '/pages/usercenter/myspreadcash', Auth: true},
  // MySpreadCode: {path: '/pages/usercenter/myspreadcode', Auth: true},
  // MySpreadRecord: {path: '/pages/usercenter/myspreadrecord', Auth: true},
  // SkuDetailAddress: {path: '/pages/skudetail/address', Auth: false},
  // SkuDetailCoupon: {path: '/pages/skudetail/coupon', Auth: false},
  // SkuDetailPreSaleRule: {path: '/pages/skudetail/preSaleRule', Auth: false},
  // Coupon: {path: '/pages/marketing/coupon', Auth: false},
  // Redenvelope: {path: '/pages/marketing/redenvelope', Auth: false},
  // PanicMarketing: {path: '/pages/marketing/panicMarketing', Auth: false},
  // SettlementAddress: {path: '/pages/settlement/addressList', Auth: true},
  // SettlementCoupon: {path: '/pages/settlement/settlementCoupon', Auth: true},
  // SettlementRedEnvelope: {path: '/pages/settlement/settlementRedEnvelope', Auth: true},
  // SettlementInvoice: {path: '/pages/settlement/settlementInvoice', Auth: true},
  // SettlementSkus: {path: '/pages/settlement/settlementSkus', Auth: true},
  // OrderNoPaySuccess: {path: '/pages/order/orderNoPaySuccess', Auth: true},
  // PresaleMarketing: {path: '/pages/marketing/presaleMarketing', Auth: false},
  // Authorization: {path: '/pages/authorization/authorization', Auth: false},
  // CancelOrder: {path: '/pages/order/cancelOrder', Auth: true},
  // OrderDetail: {path: '/pages/order/orderDetails', Auth: true},
  // CheckLogistics: {path: '/pages/order/checkLogistics', Auth: true},
  // FilterMask: {path: '/pages/spu/filterMask', Auth: false},
  // FilterMaskCheck: {path: '/pages/spu/filterMaskCheck', Auth: false},
  // UserPoints: {path: '/pages/usercenter/userPoints', Auth: true},
  // PaySuccess: {path: '/pages/order/orderPaySuccess', Auth: true},
  // UserRedenvelope: {path: '/pages/usercenter/userRedenvelope', Auth: true},
  // RedenvelopeDetail: {path: '/pages/usercenter/redenvelopeDetail', Auth: true},
  // UserSign: {path: '/pages/usercenter/userSign', Auth: true},
  // SignRule: {path: '/pages/usercenter/signRule', Auth: true},
  // ApplyRefund: {path: '/pages/order/applyRefund', Auth: true},
  // ApplyReturn: {path: '/pages/order/applyReturn', Auth: true},
  // ViewEvaluation: {path: '/pages/order/viewEvaluation', Auth: true},
  // ToEvaluation: {path: '/pages/order/toEvaluation', Auth: true},
  // InvoiceDetail: {path: '/pages/order/invoiceDetail', Auth: true},
  // FillLogistics: {path: '/pages/order/fillLogistics', Auth: true},
  // BackOrderDetail: {path: '/pages/order/backOrderDetail', Auth: true},
  // CouponDetail: {path: '/pages/usercenter/couponDetail', Auth: true},
  // CouponCode: {path: '/pages/usercenter/couponCode', Auth: true},
};

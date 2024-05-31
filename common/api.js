export default {
  // 获取分类的地址
  CatalogList: "querymobilecates",
  // 获取消息的地址
  MessageList: "querymessages",
  // 更新用户消息阅读状态的地址
  UpdateMessageIsRead: "updatemessageisread",
  //小程序获取登录信息
  GetLoginInfo: "getlogininfo",
  // 小程序一键登录
  OneKeyLogin: "oneKeyLogin",
  //解析用户信息
  DealUserInfo: "dealuserinfo",
  //绑定用户
  BindAccount: "bindaccount",
  //查找网站基础信息
  // GetBaseInfoSet: "querybaseinfoset",
  //校验手机是否存在
  CheckMobileExist: "checkmobileexist",
  //注册发送验证码
  RegisterSendCode: "sendmobilecode",
  //注册
  Register: "register",
  //获得用户基本信息
  CustomerDetail: "customerdetail",
  //更新用户信息
  UpdateCustomerInfo: "customer/updatepersonalinfo",
  // 修改用户名
  EditCustomerUserName: "customer/editCustomerUserName",
  //上传至又拍云
  UploadToUpYun: "uploadToQqOSSYun",
  //解绑用户
  UnBindAccount: "unbindaccount",
  //忘记密码-发送验证码
  ForgetPwdSendCode: "forgetpwd/sendcode",
  //忘记密码-修改密码
  ForgetPwdUpdatePwd: "forgetpwd/update",
  //修改密码-发送验证码
  UpdatePwdSendCode: "updatepwd/sendcode",
  //修改密码-更新用户登录密码
  UpdatePwdUpdate: "updatepwd/update",
  //修改支付密码-发送验证码
  UpdatePayPwdSendCode: "updatepaypwd/sendcode",
  //修改支付密码-更新用户支付密码
  UpdatePayPwdUpdate: "updatepaypwd/update",
  //绑定新手机-给旧手机号发送验证码
  BindNewMobileSendOldCode: "bindnewmobile/sendoldcode",
  //绑定新手机-校验旧手机号验证码
  BindNewMobileValidateOldCode: "bindnewmobile/validateoldcode",
  //绑定新手机-给新手机号发送验证码
  BindNewMobileSendNewCode: "bindnewmobile/sendnewcode",
  //绑定新手机-绑定
  BindNewMobileUpdate: "bindnewmobile/update",
  //查询用户收货地址
  QueryCustomerAddress: "querycustomeraddress",
  //根据收货地址id查询收货地址
  QueryCustomerAddressById: "querycustomeraddressbyid",
  //新增用户收货地址
  AddAddress: "addaddress",
  //修改收货地址
  UpdateAddress: "updateaddress",
  //删除地址
  DeleteCustomerAddressById: "deletecustomeraddress",
  //查询所有省信息
  QueryAllProvinces: "queryallprovinces",
  //根据省份id查询下面的市
  QueryCityByProvinceId: "querycitybyprovinceid",
  //根据市id查询下面的区县
  QueryDistrictByCityId: "querydistrictbycityid",
  //我的优惠券列表
  UserCouponList: "coupons",
  //根据优惠券码领券
  GetCouponByCode: "receivecouponbycode",
  //查询用户订单信息
  QueryCustomerOrders: "orderSummary",
  //取消订单
  CancelOrder: "cancelorder",
  //确认收货订单
  ConfirmReceipt: "receiptorder",
  //获取查看物流url
  GetCheckLogisticsUrl: "getchecklogisticsurl",
  //订单统计
  QueryOrderMessageCount: "order/count",
  //订单详情
  // OrderDetail: 'orderdetail',
  OrderDetail: "order/detail",
  //注册协议地址
  RegisterProtocol: "registerprotocol",
  //分页查询用户退单信息
  BackOrderList: "backorderlist",
  //分页查询用户福气值记录
  Points: "points",
  //查询用户总福气值
  TotalPoint: "points/total",
  //获取微信支付参数
  WechatAppletPayParams: "wechatappletpayparams",
  //查询用户预存款总额
  QueryPreDepositCount: "customer/querypredepositcount",
  //预存款支付
  Prepay: "toprepay",
  //消息统计
  QueryMessageCount: "message/total",
  //分页查询我的红包列表
  UserRedenvelopeList: "getmyredenvelopelist",
  //查找签到福气值规则
  Querypointsignrule: "querypointsignrule",
  //查找签到记录
  Customersignlist: "customersignlist",
  //判断今天是否签到
  Istodaysign: "istodaysign",
  //签到
  Signin: "signin",
  //查询用户预存款总额
  TotalPredeposit: "predeposit/total",
  //查询用户预存款记录
  Predeposits: "predeposits",
  //申请退款
  ApplyRefund: "applyrefund",
  //申请退货
  ApplyReturn: "applyreturn",
  //查询订单详情(退货用)
  QueryOrderForReturn: "queryorderforreturn",
  //查询订单评价详情
  QueryEvaluationDetail: "evaluationdetail",
  //评价页查询订单详情
  Queryorderforevaluation: "queryorderforevaluation",
  //添加订单评论
  Addorderevaluation: "addorderevaluation",
  //退单填写物流信息
  FillTheLogistics: "fillthelogistics",
  //查询退单详情
  QueryBackDetail: "querybackdetail",
  //查询用户收藏的单品信息
  Queryattentions: "attention/queryAttentionSku",
  //查询用户浏览记录
  Querybrowserecords: "getBrowseRecords",
  //查询浏览记录(未登录状态下)
  Querybrowserecordbyskuids: "querybrowserecordbyskuids",
  //清空用户浏览记录
  Emptybrowserecords: "browserecord",
  //商品推荐
  RecommendSku: "recommend",
  //查询浏览纪录的单品类型
  QueryBrowseSkuType: "querybrowseskutype",
  //查询商品
  // SearchSpu: 'searchspu',
  SearchSpu: "searchSpuAndStore",
  //查询聚合值
  SearchAggregations: "searchaggregations",
  //查询用户购物车信息
  QueryShoppingCarts: "shoppingcart/carts",
  //查询单品的促销信息
  QueryMarketingsBySkuId: "shoppingcart/marketings",
  //更新购物车促销信息
  UpdateCartMarketing: "shoppingcart/updatecartmarketing",
  //删除购物车信息
  DeleteCart: "shoppingcart/deletecart",
  //更新购物车数量
  UpdateCartNum: "shoppingcart/cartnum",
  //查询用户购物车总数
  QueryShoppingCartCount: "shoppingcart/count",
  //分页查询优惠券
  Getcouponlist: "getcouponlist",
  //领取优惠券
  Receivecoupon: "receivecoupon",
  //分页查询红包
  Getredenvelopelist: "getredenvelopelist",
  //领取红包
  Receiveredenvelope: "receiveredenvelope",
  //获取结算信息
  Settlement: "settlement",
  //提交订单
  SubmitOrder: "submitorder",
  //查询营销设置
  Querymarketingsetting: "querymarketingsetting",
  //查询商品的评论概括
  Querycommentsummarize: "querycommentsummarize",
  //查询单品评论
  Queryskucomments: "queryskucomments",
  //查看商品详情
  QuerySpuDetail: "queryspudetail",
  // 校验当前账号是否开启小程序服务号通知
  QueryNoticeRecord: "notice/record",
  NoticeAllow:"notice/allow", // 允许通知开启小程序服务号通知
  //查询商品的规格信息
  QuerySpuSpecs: "queryspuspecs",
  //查询商品下所有单品的规格信息
  QuerySkuSpecs: "queryskuspecs",
  //查询商品的评论概括
  QueryCommentSummarize: "querycommentsummarize",
  //查询商品组合
  QueryCombination: "querycombination",
  //计算运费
  CalculateFreight: "calculatefreight",
  //添加浏览记录
  AddBrowseRecord: "addbrowserecord",
  //查询限时折扣促销
  QueryPanicBuyMarketing: "querypanicbuymarketing",
  //添加商品关注
  AddSkuAttention: "attention/addSkuAttention",
  //取消商品关注
  CancelSkuAttention: "attention/cancelSkuAttention",
  //添加购物车
  AddShoppingCart: "shoppingcart/addshoppingcart",
  //applet 首页
  // AppletIndex: "appletindex",
  AppletIndex: "home/template/queryIndexHomeTemplate",
  // 分销页面配置数据
  DistributionIndex: "home/template/queryDistributionHomeTemplate",
  //applet 专题
  AppletThematic: "appletthematic",
  // 搜索店铺列表
  StoreList: "store/searchstore",
  // 查询店铺信息
  StoreInfo: "store/querystoreinfo",
  // 查询店铺的分类信息
  StoreCategory: "store/queryallstorecategory",
  // 获取分享微信小程序码
  AppletShareCode: "getwechatappletcode",
  // 分页查询福气值商品信息
  QueryPointSkuList: "querypointskulist",
  // 查询所有福气值商品分类
  QueryAllPointCates: "querypointtype",
  // 查询福气值商品信息详情
  QueryPointSkuDetail: "querypointskudetail",
  // 查询推荐的福气值商品列表
  QueryHotPointSkuList: "queryhotpointskulist",
  // 提交福气值商城订单
  SubmitPointMallOrder: "submitpointmallorder",
  // 分页查询用户福气值商城订单列表
  QueryCustomerPointMallOrders: "querypointmallorderlist",
  // 福气值商城订单确认收货
  ConfirmReceiptPointMallOrder: "confirmreceiptpointmallorder",
  // 查询福气值商城订单详情
  QueryPointMallOrderDetail: "querypointmallorderdetail",
  // 获取小程序直播房间列表
  QueryLivePlayerRoomList: "queryliveplayerroomlist",
  // 分页查询秒杀活动列表
  QuerySeckillList: "queryseckills",
  // 查询秒杀场次
  QuerySeckillSceneDetail: "queryseckilldetail",
  // 查询秒杀促销图片信息
  QueryPanicBuyPic: "querypanicbuypic",
  // 分页查询店铺秒杀活动列表
  QueryStorePanicBuyList: "querystorepanicbuylist",
  // 查询拼团订单
  QueryGroupOrdersForSpuDetail: "spudetail/grouporders",
  // 检查是否在团购中
  CheckIsInGroup: "checkisingroup",
  // 查询拼团促销图片信息
  QueryGroupPic: "querygrouppic",
  // 查询拼团促销分类列表
  QueryGroupCateList: "querygroupcatelist",
  // 分页查询拼团促销列表
  QueryGroupMarketingList: "querygroupmarketinglist",
  // 分页查询预售促销图片
  QueryPreSalePic: "querypresalepic",
  // 查询预售促销的分类
  QueryPreSaleCates: "querypresalecates",
  // 分页查询预售促销
  QueryPreSales: "querypresales",
  // 查询预售规则
  QueryPreSaleRule: "querypresalerule",
  // 查询分销下级用户数量
  QuerySpreadCustomerByCustomerIdCount: "queryspreadcustomerbycustomeridcount",
  // 分页查询分销单品
  QuerySpreadSkuList: "queryspreadskulist",
  // 分页查询用户分销订单信息
  QuerySpreadOrders: "queryspreadorders",
  // 绑定推荐码
  BindRecommendCode: "bindrecommendcode",
  // 分页查询用户佣金记录
  QueryCommissionRecords: "querycommissionrecords",
  // 分页查询用户提现记录
  QueryWithdrawRecords: "querywithdrawrecords",
  // 申请提现
  AddWithdrawRecord: "addwithdrawrecord",
  // 创建二维码
  CreateQrCode: "createqrcode",
  // 个人中心热销商品
  GetRecommendList: "recommend/spus",
  // 新算法-热销商品列表
  QueryRecommendCommodity: "individualization/recommend/recommendCommodity",
  // 获取个人中心记录
  GetCustomerStatistics: "customer/customerStatistics",
  // GetCustomerStatistics: 'http://wthrcdn.etouch.cn/weather_mini?city=%E6%B2%88%E9%98%B3',
  // 获取店铺收藏列表
  QueryattentionStore: "attention/queryAttentionStore",
  // 店铺新品/商品列表
  QueryStoreSpus: "queryStoreSpus",
  //关注店铺
  AddStoreAttention: "attention/addStoreAttention",
  // 取消关注店铺
  CancelStoreAttention: "attention/cancelStoreAttention",
  // 忘记密码,获取验证码时对手机号的判断
  UpdatepwdCheckmobileexist: "updatepwd/checkmobileexist",
  // 通过订单编号查询订单详情
  OrderdetailByorderCode: "orderdetailByorderCode",
  // 更新购物车规格
  ShoppingcartSpec: "shoppingcart/spec",
  // 查询用户待评论的商品列表
  Unevaluated: "/unevaluated",
  // 查询用户已评论列表
  CustomerComment: "/comment/customer",
  // 添加评论
  AddOrderSkuEvaluation: "/orderSku/evaluation",
  // 删除订单
  DeleteOrder: "/order",
  // 申请退款
  ApplyRefundNew: "/applyrefundNew",
   // 申请退款(商品)
  ApplySkuRefundNew: "/applySkuRefundNew",
  // 获取商城基础信息
  GetBaseInfoSet: "/baseinfoset",
  // 查询物流 - 新
  GetExpress: "/express",
  // 查询单个商品物流 - 新
  GetSingleExpress: "/order/sku/logistics",
  //个人中心-查询用户的优惠券总数
  QueryCouponCount: "coupon/user/count",
  //个人中心-查询已领取未使用的优惠券列表
  QueryUserCoupons: "coupon/user/queryUserCoupons",
  //个人中心-查询已过期/已使用的优惠券列表
  QuerypageUserCoupons: "coupon/user/pageUserCoupons",
  // 店铺优惠券列表
  // QueryCouponList: "coupon/store/couponList",
  // 店铺优惠券列表
	QueryCouponList: "userActivity/getCouponList",
  // 批量领取优惠券
  ReceiveCoupons: "coupon/store/receiveCoupons",
  // 购物车选择商品后，计算价格以及最划算的优惠券
  CartSummary: "shoppingcart/storeshoppingcart/summary",
  // 免密登录
  UnAuthLogin: "bindAccountWithNoAuth",
  // H5拉起微信小程序免密登录
  AppletsUnAuthLogin: "unAuthLogin",
  // 查询用户是否有分销权限
  queryIsAllowDistribution: "queryIsAllowDistribution",
  //发起退货申请页面返回详情
  queryorderforreturn: "queryorderforreturn",
  //发起退货申请
  applyreturn: "applyreturn",
  //修改申请
  updateApplyreturn: "afterSale/update",
  //取消申请
  cancelReturn: "afterSale/cancel",
  //售后申请详情
  backorderdetail: "backorderdetail",
  //用户填写物流单号
  fillthelogistics: "fillthelogistics",
  //售后申请列表（订单列表）
  pageAfterSaleOrder: "afterSale/pageAfterSaleOrder",
  //售后申请列表（处理中/申请记录）
  afterSalePage: "afterSale/afterSalePage",
  //查询所有快递公司
  queryAllLogisCompanyName: "queryAllLogisCompanyName",
  //修改物流单号
  updateLogistics: "updateLogistics",
  //48小时退货申请中商家端未审批的服务单，自动通过
  dealApplyOverDue: "dealApplyOverDue",
  // 7*24小时 商家已同意退货，客户未填写订单号的退货服务单，自动关闭
  dealFillLogisticsOverDue: "dealFillLogisticsOverDue",
  //解决售后服务单
  userConfirmationCompleted: "backOrder/userConfirmationCompleted",
  //删除服务单
  deleteBackOrder: "deleteBackOrder",
  // 查询取消订单进度
  QueryBackOrderLog: "backOrder/log/list",

	// 短信登录时获取验证码
	getVerificationCode: "get/verification/code",
	// 手机号+验证码登录（不存在的手机号将会自动注册，默认密码123456）
	verificationCodeLogin: "verification/code/login",

	// 用户申请退款超过1天未申请自动通过并退款
	ApplyRefundPass: "backOrder/ApplyRefundPass",

  // 获取售后原因
  GetReasonList: "backOrder/getReasonList",

	// 首页查询秒杀的四条sku
	SeckillsceneSku: "seckillscene/sku",
	// 查询秒杀场次列表
	Queryseckilldetail: "queryseckilldetail",
	// 查询秒杀商品列表
	PanicBuySeckillscene: "panicBuy/seckillscene",
	// 查询秒杀商品详情
	QueryspuSeckillsceneDetail: "queryspu/seckillscene/detail",
	// 校验是否超过平台秒杀限制数
	CheckSkuPanicBuyLimitNum: "shoppingcart/checkSkuLimitNum",
	// 结算前校验所选商品是否达到秒杀限制数
	CheckLimitNumBeforeSettlement: "checkMarketingLimitBeforeSettlement",

	// 分销首页商品查询
	// getDistributionList: 'searchspu',
	getDistributionList: "searchspufordistribution", //  临时替换列表方案
	// 分销个人收益统计
	queryEarningsData: "queryDistributionOrderStatistics",
	// 分销收益规则
	queryDistributionRule: "queryDistributionRule",

	// 分销推广订单列表
	QueryDistributionOrder: "distributionOrder/page",
	// 分销推广订单详情
	QueryDistributionOrderDetail: "distributionOrder/detail",
	//分享商品详情
	queryDistributionSku: "distributionSpu/queryDetail",
	//分销信息查询
	getRulesList: "queryDistributionRule",
	//分享
	shareForDistribution: "distributionSpu/shareForDistribution",
	//获取小程序二维码
	getShareCode: "share/code",
	//提现记录列表
	QueryWithdrawalRecords: "queryWithdrawalRecords",
	//结算日志列表
	QueryAllPayWithdrawalRecords: "queryAllPayWithdrawalRecords",
	//佣金明细记录
	QueryDistributionOrdersByMonth: "queryDistributionOrdersByMonth",
	// 绑定/修改支付宝账号和姓名
	UpdateAccountNameByUserId: "updateAccountNameByUserId",
	//提现时查询金额
	QueryDistributionUserPayInfoByUserId: "queryDistributionUserPayInfoByUserId",
	//分销员发起提现申请
	AddWithdrawalRecord: "addWithdrawalRecord",
	// 获取绑定支付宝的验证码
	UpdateAccountSendcode: "updateAccountSendcode",
	// 确认分销商品能否分销
	judgeStatus: "distributionSpu/judgeStatus",
	//获取手机专区商品信息
	selectPerformanceSkuBySpuId: "selectPerformanceSkuBySpuId",
	//获取首单活动专区商品列表
	getSpuSpeicalAreaList: "specialArea/getSpuSpeicalAreaList",
	//获取首单活动专区商品信息
	getMarketingById: "specialArea/getMarketingById",
	//查询是否显示首页活动弹窗
	// queryPerformanceFlag: "queryPerformanceFlag",
  queryPerformanceFlag: "popup/window/config/selectListPopupWindowConfig",
	// 浏览量、访客量
	visit: "visit",
  // 详情浏览埋点 
  detailsVisit: 'spu/click',
  // 搜索页搜索词埋点
  searchWordsVisit: 'spu/searchSpu',
	//添加银行卡
	addBankCard: "addBankCard",
	//检验银行卡号合法性，并返回对应银行的中文名
	checkBankCard: "checkBankCard",
	//修改银行卡
	updateBankCard: "updateBankCard",
	//分享记录数据统计
	getShareRecord: "distributionShare/page",
	//分销订单数据统计
	getDistributionOrderCount: "distributionOrder/count",

	//条件分页查询个人中心平台优惠券
	pagePlatformCoupon: "platformCouponCode/selectPage",
	//查询用户活动
	getUserActivity: "userActivity/getUserActivity",
	//领取优惠券
	receiveCoupon: "platformCouponCode/receive",
	//根据券码id查询券详情
	getCouponDetail: "platformCouponCode/getDetail",
	//查询用户活动自动发放到券包的优惠券
	getDeliered: "platformCouponCode/getDeliered",
	//结算时，用户切换店铺券，自动重新将平台券分类
	checkPlatformCoupon: "checkPlatformCoupon",
	//检查订单
	checkOrder: "order/checkOrder",
	//批量取消子订单
	cancelOrderBatch: "cancelOrderBatch",
	//支付成功，根据code查询订单金额、发放的优惠券
	queryPayInfo: "order/queryPayInfo",
  // 删除浏览记录
	DeleteBrowseRecordById:"deleteBrowseRecords",
  // 修改订单收货信息
	updateReceiptInfo: "updateReceiptInfo",

	// 站内信列表
	queryStationList:"station/letter/queryStationLettersByCustomerId",
	// 站内信查未读数
	queryUnreadCount:"station/letter/queryUnreadCountByGroup",
	// 更新阅读状态
	updateStationNews:"station/letter/updateStationLettersIsRead",
	// 单个删除站内信
	deleteStationNews:"station/letter/deleteStationLetter",
	// 按分组清空站内信
	cleanStationNews:"station/letter/cleanStationLetter",

	// 分页查看礼卡列表
	ValueCardCodeSelectPage: "valueCardCode/selectPage",
	// 礼卡使用记录
	giftUsageLog: "valueCardCode/selectRecordByCodeId",
	// 查询礼卡统计信息
	valueCardCodeCount: "valueCardCode/count",
	// 绑定卡密
	valueCardCodeBanding: "valueCardCode/banding",
	//分销首页弹窗
	selectListDistributionPopupWindowConfig: "popup/window/config/selectListDistributionPopupWindowConfig",

	//申请换货时校验商品
	checkSpuOrSku: "afterSale/checkSpuOrSku",
	//用户确认是否收到货
	auditReceipt: "backOrder/auditReceipt",
	//根据订单号或售后单号查询物流
	getLogisticsById: "getLogisticsById",
  advertVisit:"advertVisit",
  shareVisit:"shareVisit",
	// 获取版本号
	getVersion: "getVersion",
  // 直播列表接口
  mallLiveGetLiveInfos: "mallLive/getLiveInfos",


	// 查询授权接口
	SelectOneByCondition: "empower/selectOneByCondition",
	// 用户授权
	AddCustomerEmpower: "empower/addCustomerEmpower",
	// 查询万顺用户余额
	QueryUserAsset: "queryUserAsset",
	// 修改授权
	UpdateCustomerEmpower: "empower/updateCustomerEmpower",

	// 微信或者混合支付
	WechatMixedPay: "wechatMixedPay",
	// 万顺宝余额查询
	QueryUserAsset: "queryUserAsset",
	// 万顺宝余额支付
	BalancePay: "balancePay",
  //统一支付接口
  ToPay: "toPay",
  // 查询分类接口
	Categorybyparentid: "categorybyparentid",
  // 支付合并订单查询接口
  SelectWsOrderInfoByOrderId: "selectWsOrderInfoByOrderId",
  // 实体店==>商品列表
  PageAgencyStore: "agencystore/spuList",
  // 实体店==>商品详情页
  AgencystoreDetails: "agencystore/goodsDetails",
  // 实体店==>获取店铺信息
  QueryAgencyStore: "agencystore/queryAgencyStoreByIdNumber",
  // 用户福气值查询
  getCustomerFqzApplets: "fqz/stream/getCustomerFqzApplets",
  // 福气值流水
  getFqzStreamApplets: "fqz/stream/getFqzStreamApplets",
  // 福气值换算接口
  getFqzPrice: "getFqzPrice",
  // 福气值比列接口
  getFqzPriceConfig: "getFqzPriceConfig",
  // 新用户推广员注册
  PromoteRegister: "distributionRegister/promoteRegister",
  // 商城用户ID查询是否为分销员
  QueryIsDistribution: "distributionRegister/isDistribution",
  // 名称查询实体店列表
  QuerySelectOrgByCondition: "distributionRegister/selectOrgByCondition",
  // 根据推广员id查询推广员基本信息（手机号，身份类型）
  QueryUserBasicInfoById: "distributionUser/queryUserBasicInfoById",
  // 用户端查询商品列表
  QueryDistributionSpuList: "querySpuList",
  // 分销订单列表
  QueryDistributionOrderNew: "distributionOrder/myPage",
  // 获取推广码
  ShareForDistribution: "distributionSpu/shareForDistributionForAppletsNew",

  // 获取热销广告、销售榜单
  QueryAdvertSet: "home/template/queryAdvertSet",

  // 获取佣金统计卡
  QueryUserCommission: "distributionUser/queryUserCommission",
  // 判断是否分销员(个人中心用)
  IsDistributionCheck: "distributionRegister/isDistributionCheck",
  // 生成单个商品海报
  CreateShareCode: "share/createShareCode",
  // 生成商品列表海报
  CreateSpuListShareCode: "share/createSpuListShareCode",

  // 我的小店信息
  GetMyStores: 'agencystore/stores',
  // 用户关注实体店列表
  FocusList: 'agencystore/focusList',
  // 是否关注实体店 0关注 1 未关注
  FocusStoreState: 'agencystore/focusStoreState',
  // 取关
  UnFocusStore: 'agencystore/unfocus',
  // 关注实体店
  FocusStore: 'agencystore/focus',
  // 店铺分享码
  StoreCode: 'agencystore/code',
  //判断是否有退款中的
  JudgeRefund: "judgeRefund",
  // 查询活动商品的价格和skuId
  selectActivityCustomized: "selectActivityCustomized",
  //查询发票详情
  queryOrderAttr:"queryOrderAttr",
  //查询用户优惠券列表
  QueryUserCouponList: "queryUserCouponList",
  //商品优惠券列表查询
  GetUserCoupons: "spuDiscount/userCoupons",
  //查询优惠列表
  queryDiscounts: "spuDiscount/queryDiscounts",
  //商品列表-优惠信息查询
  QuerySpuDiscountList: "spuDiscount/List",
  //购物车商品估价
  cartDiscountSummary: "spuDiscount/cartSummary",
  //首页搜索热词
  QueryKeyword: "queryKeyword",
  //查询分类模板
  HomeTemplateById: "homeTemplateById",
  //查询电动车上牌指引
  QueryLicence: "/agencystore/guidances",
  //查询电动车附近门店
  QueryStore: "/agencystore/nearStation",
  // 查询电动车首页
  QueryMotorHome: "/agencystore/elecSpus",
  // 查询电动车首页-智慧生活
  QueryEleCar: "/electricMotorcycle/appQueryPage",
  // 查询电动车详情-智慧生活
  QueryEleCarDetail:'/electricMotorcycle/appQueryDetail',
  // 查询附近门店-智慧生活
  QueryNearbyStores: '/electricMotorcycle/queryNearbyStores',
  // 实时查询当前距离购买电动车门店信息
  QueryMotorDeliveryGoods : "/agencystore/deliveryGoods",
  // 电动车更换手机号
  QueryMotorUpdateBindPhone: '/agencystore/updateBindPhone',
  // 电动车拨打电话
  QueryMotorBindPhone: '/agencystore/bindPhone',

  //首次进入新建用户参与游戏记录在游戏首页调用一次
  gameRecord:'/bargainGame/user',
  // 用户参与游戏记录 一共调用3次 
  addRecord:'/bargainGame/addRecord',
  //查询游戏题目
  getQuestionsList:'/bargainGame/randomQuestion',
  //查询优惠券，返回的id为null表示活动失效
  getCouponList:'/bargainGame/getCouponList',
  //领取优惠券
  addCouponDistribute:'/addCouponDistribute',
  //查询我的优惠券
  getMyCouponList:'/bargainGame/myCouponList',
  //查询排行榜
  rankedList:'/bargainGame/rankedList',
  //点赞
  giveALike:'/bargainGame/giveALike',
  //取消点赞
  cancelLike:'/bargainGame/cancelLike',
  //查询个人中心待付款和待收货轮播信息
  queryOrderRotographList:'/order/queryOrderRotographList',
  //查询个人中心配置
  queryPersonConfigTemp:'/order/queryPersonConfigTemp',
  // 根据专题id查专题详情
  selectSubjectById: '/subject/selectSubjectById',
  // 排行专题-查询二级分类
  selectRankingSecondCate: '/subject/ranking/selectRankingSecondCate',
  // 排行专题-查询专题内商品排行
  selectSubjectRanking: '/subject/ranking/selectSubjectRanking',
  // 品类热销-根据spuids查详情
  selectSpuDeleteBySpuIds: '/subject/categoryHot/selectSpuDeleteBySpuIds',
  getCustomPageSpuList: 'subject/customPageSpuAnalysis',
  // 万顺福-单页商品查询
  getsiglePageSpuList: 'subject/simplePageSpuAnalysis',


  // 商品skuNo反查skuId
  querySkuIdBySkuNo: '/querySkuIdBySkuNo',

  //提交订单服务消息推送
  uniformMessageSend: '/uniformMessageSend',

    //物流确认是否已签收
    checkOrderTraces:'/backOrder/checkOrderTraces',
    //售后单查询物流
    queryOrderTraces:'/backOrder/queryOrderTraces',
    //换货查询商品详情-无校验
    querySwapSpuDetail:'/querySwapSpuDetail',
  // 根据手机号获取归属地
  getMobileArea: '/api/app/applet/service/customer/getMobileArea',
  // 创建充值话费订单
  createOrder: '/api/app/applet/service/rechargeOrder/phoneFee/createOrder',
  // 查询电话费配置
  queryPhoneFeeConfig: '/api/app/applet/service/rechargeOrder/phoneFee/queryPhoneFeeConfig',
  // 查询订单状态
  queryOrderStatus: '/api/app/applet/service/rechargeOrder/phoneFee/queryOrderStatus',
  // 查询充值订单记录
  queryRechargeOrderList: '/api/app/applet/service/rechargeOrder/phoneFee/queryRechargeOrderList',
  // 查询充值订单详情
  queryRechargeOrderDetail: '/api/app/applet/service/rechargeOrder/phoneFee/queryRechargeOrderDetail',
  // 删除充值订单
  deleteRechargeOrder: '/api/app/applet/service/rechargeOrder/phoneFee/deleteRechargeOrder',
  // 查询服务说明
  queryRechargeDescription: '/api/app/applet/service/rechargeOrder/phoneFee/queryRechargeDescription',
  // 查常用联系人（如果没有,添加本人注册手机号）
  selectCustomerCommonPhoneListAndAdd: '/rechargeOrder/commonPhone/selectCustomerCommonPhoneListAndAdd',
  // 常用联系人详情
  selectCustomerCommonPhoneById: '/rechargeOrder/commonPhone/selectCustomerCommonPhoneById',
  // 添加常用联系人
  addCustomerCommonPhone: '/rechargeOrder/commonPhone/addCustomerCommonPhone',
  // 修改常用联系人
  updateCustomerCommonPhone: '/rechargeOrder/commonPhone/updateCustomerCommonPhone',
  // 删除常用联系人
  deleteCustomerCommonPhone: '/rechargeOrder/commonPhone/deleteCustomerCommonPhone',
  

  // 集采商品列表
  enterPriseGoodsList: '/enterPriseGoods/list',
  // 集采商品详情
  enterPriseGoodsDetail: '/enterPriseGoods/detail',
  // 集采商品评论
  enterPriseGoodsComment: '/enterPriseGoods/comment',
  // 集采商品品论数量   
  enterPriseGoodsCount: '/enterPriseGoods/commentTypeCount',
  // 获取集采分享的参数
  getTokenData: '/enterPriseGoods/getTokenData',
  // 集采列表分享码   
  enterPriseGoodsCode: '/enterPriseGoods/share/codeSum',
};

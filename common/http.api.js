import url from "./api.js";
import { http } from './smart-api/http.interceptor.js';
// 此处第二个参数vm，就是我们在页面使用的this，你可以通过vm获取vuex等操作，更多内容详见uView对拦截器的介绍部分：
// https://uviewui.com/js/http.html#%E4%BD%95%E8%B0%93%E8%AF%B7%E6%B1%82%E6%8B%A6%E6%88%AA%EF%BC%9F
const install = (Vue, vm) => {
	const GetLoginInfo = (params = {}) => vm.$u.get(url.GetLoginInfo, params);
	const CustomerDetail = (params = {}) => vm.$u.get(url.CustomerDetail, params);
	const QueryMessageCount = (params = {}) =>
		vm.$u.get(url.QueryMessageCount, params);
	const QueryOrderMessageCount = (params = {}) =>
		vm.$u.get(url.QueryOrderMessageCount, params);
	const GetCustomerStatistics = (params = {}) =>
		vm.$u.get(url.GetCustomerStatistics, params);
	const DealUserInfo = (params = {}) => vm.$u.get(url.DealUserInfo, params);
	const BindAccount = (params = {}) => vm.$u.post(url.BindAccount, params);
	const CheckMobileExist = (params = {}) =>
		vm.$u.get(url.CheckMobileExist, params);
	const ForgetPwdSendCode = (params = {}) =>
		vm.$u.get(url.ForgetPwdSendCode, params);
	const RegisterSendCode = (params = {}) =>
		vm.$u.get(url.RegisterSendCode, params);
	const Registers = (params = {}) => vm.$u.post(url.Register, params);
	const ForgetPwdUpdatePwd = (params = {}) =>
		vm.$u.post(url.ForgetPwdUpdatePwd, params);
	const GetRecommendList = (params = {}) =>
		vm.$u.post(url.GetRecommendList, params);
	const QueryRecommendCommodity = (params = {}) =>
		vm.$u.post(url.QueryRecommendCommodity, params);
	const UpdateMessageIsRead = (params = {}) =>
		vm.$u.get(url.UpdateMessageIsRead, params);

	const AppletIndex = (params = {}) => vm.$u.get(url.AppletIndex, params);
	const DistributionIndex = (params = {}) => vm.$u.get(url.DistributionIndex,params)
	const MessageList = (params = {}) => vm.$u.get(url.MessageList, params);
	const UnBindAccount = (params = {}) => vm.$u.get(url.UnBindAccount);

	const Querybrowserecords = (params = {}) =>
		vm.$u.get(url.Querybrowserecords, params);
	const Queryattentions = (params = {}) =>
		vm.$u.get(url.Queryattentions, params);
	const QueryattentionStore = (params = {}) =>
		vm.$u.post(url.QueryattentionStore, params);
	const Emptybrowserecords = (params = {}) =>
		vm.$u.get(url.Emptybrowserecords, params);

	const TotalPredeposit = (params = {}) =>
		vm.$u.get(url.TotalPredeposit, params);
	const Predeposits = (params = {}) => vm.$u.get(url.Predeposits, params);
	const UpdateCustomerInfo = (params = {}) =>
		vm.$u.post(url.UpdateCustomerInfo, params);
	const EditCustomerUserName = (params = {}) =>
		vm.$u.put(url.EditCustomerUserName, params);

	const QueryCustomerAddress = (params = {}) =>
		vm.$u.get(url.QueryCustomerAddress, params);
	const QueryCustomerAddressById = (params = {}) =>
		vm.$u.get(url.QueryCustomerAddressById, params);
	const QueryAllProvinces = (params = {}) =>
		vm.$u.get(url.QueryAllProvinces, params);
	const QueryCityByProvinceId = (params = {}) =>
		vm.$u.get(url.QueryCityByProvinceId, params);
	const QueryDistrictByCityId = (params = {}) =>
		vm.$u.get(url.QueryDistrictByCityId, params);
	const DeleteCustomerAddressById = (params = {}) =>
		vm.$u.get(url.DeleteCustomerAddressById, params);
	const AddAddress = (params = {}) => vm.$u.post(url.AddAddress, params);
	const UpdateAddress = (params = {}) => vm.$u.post(url.UpdateAddress, params);
	const UpdatePwdSendCode = (params = {}) =>
		vm.$u.get(url.UpdatePwdSendCode, params);
	const UpdatePwdUpdate = (params = {}) =>
		vm.$u.get(url.UpdatePwdUpdate, params);
	const BindNewMobileSendOldCode = (params = {}) =>
		vm.$u.get(url.BindNewMobileSendOldCode, params);
	const BindNewMobileValidateOldCode = (params = {}) =>
		vm.$u.get(url.BindNewMobileValidateOldCode, params);
	const BindNewMobileUpdate = (params = {}) =>
		vm.$u.get(url.BindNewMobileUpdate, params);
	const UpdatePayPwdSendCode = (params = {}) =>
		vm.$u.get(url.UpdatePayPwdSendCode, params);
	const UpdatePayPwdUpdate = (params = {}) =>
		vm.$u.get(url.UpdatePayPwdUpdate, params);
	const SearchSpu = (params = {}) => vm.$u.post(url.SearchSpu, params);
	const UpdatepwdCheckmobileexist = (params = {}) =>
		vm.$u.get(url.UpdatepwdCheckmobileexist, params);

	const Querycommentsummarize = (params = {}) =>
		vm.$u.get(url.Querycommentsummarize, params);
	const Queryskucomments = (params = {}) =>
		vm.$u.get(url.Queryskucomments, params);
	const StoreInfo = (params = {}) => vm.$u.get(url.StoreInfo, params);
	const CancelStoreAttention = (params = {}) =>
		vm.$u.post(url.CancelStoreAttention, params);
	const AddStoreAttention = (params = {}) =>
		vm.$u.post(url.AddStoreAttention, params);
	const QueryStoreSpus = (params = {}) =>
		vm.$u.post(url.QueryStoreSpus, params);
	const SubmitOrder = (params = {}) => vm.$u.post(url.SubmitOrder, params);
	const Settlement = (params = {}) => vm.$u.post(url.Settlement, params);
	const QuerySpuDetail = (params = {}) => vm.$u.get(url.QuerySpuDetail, params);
	const QueryNoticeRecord = (params = {}) => vm.$u.post(url.QueryNoticeRecord, params);
	const NoticeAllow = (params = {}) => vm.$u.post(url.NoticeAllow, params);
	const AddBrowseRecord = (params = {}) =>
		vm.$u.post(url.AddBrowseRecord, params);

	const QueryPreDepositCount = (params = {}) =>
		vm.$u.get(url.QueryPreDepositCount, params);
	const QueryShoppingCarts = (params = {}) =>
		vm.$u.get(url.QueryShoppingCarts, params);
	const AddShoppingCart = (params = {}) =>
		vm.$u.get(url.AddShoppingCart, params);
	const DeleteCart = (params = {}) => vm.$u.get(url.DeleteCart, params);
	const UpdateCartNum = (params = {}) => vm.$u.post(url.UpdateCartNum, params);

	const WechatAppletPayParams = (params = {}) =>
		vm.$u.get(url.WechatAppletPayParams, params);
	const Prepay = (params = {}) => vm.$u.get(url.Prepay, params);

	const CancelSkuAttention = (params = {}) =>
		vm.$u.post(url.CancelSkuAttention, params);
	const AddSkuAttention = (params = {}) =>
		vm.$u.post(url.AddSkuAttention, params);
	const QuerySpuSpecs = (params = {}) => vm.$u.get(url.QuerySpuSpecs, params);
	const OrderdetailByorderCode = (params = {}) =>
		vm.$u.get(url.OrderdetailByorderCode, params);
	const QueryCustomerOrders = (params = {}) =>
		vm.$u.get(url.QueryCustomerOrders, params);
	const CalculateFreight = (params = {}) =>
		vm.$u.get(url.CalculateFreight, params);
	const QueryShoppingCartCount = (params = {}) =>
		vm.$u.get(url.QueryShoppingCartCount, params);
	const OrderDetail = (params = {}) => vm.$u.get(url.OrderDetail, params);
	const ApplyRefund = (params = {}) => vm.$u.post(url.ApplyRefund, params);
	/**
	 * 更新购物车规格
	 * @param {id} 购物车id
	 * @param {skuId} 商品id
	 */
	const ShoppingcartSpec = (params = {}) =>
		vm.$u.post(url.ShoppingcartSpec, params);

	const SearchAggregations = (params = {}) =>
		vm.$u.post(url.SearchAggregations, params);

	const Unevaluated = (params = {}) => vm.$u.get(url.Unevaluated, params);
	const CustomerComment = (params = {}) =>
		vm.$u.get(url.CustomerComment, params);
	const AddOrderSkuEvaluation = (params = {}) =>
		vm.$u.post(url.AddOrderSkuEvaluation, params);
	const CancelOrder = (params = {}) => vm.$u.post(url.CancelOrder, params);
	const DeleteOrder = (params = {}) => vm.$u.get(url.DeleteOrder, params);
	const ConfirmReceipt = (params = {}) => vm.$u.get(url.ConfirmReceipt, params);
	const ApplyRefundNew = (params = {}) => vm.$u.post(url.ApplyRefundNew, params);
	const ApplySkuRefundNew = (params = {}) => vm.$u.post(url.ApplySkuRefundNew, params);
	const BackOrderList = (params = {}) => vm.$u.get(url.BackOrderList, params);
	const GetBaseInfoSet = (params = {}) => vm.$u.get(url.GetBaseInfoSet, params);
	const GetExpress = (params = {}) => vm.$u.get(url.GetExpress, params);
	const GetSingleExpress = (params = {}) =>
		vm.$u.post(url.GetSingleExpress, params);

	const QueryCouponCount = (params = {}) =>
		vm.$u.get(url.QueryCouponCount, params);
	const QueryUserCoupons = (params = {}) =>
		vm.$u.get(url.QueryUserCoupons, params);
	const QuerypageUserCoupons = (params = {}) =>
		vm.$u.get(url.QuerypageUserCoupons, params);
	const QueryCouponList = (params = {}) =>
		vm.$u.get(url.QueryCouponList, params);
	const ReceiveCoupons = (params = {}) =>
		vm.$u.post(url.ReceiveCoupons, params);
	// const CartSummary = (params = {}) => vm.$u.post(url.CartSummary, params);
    // 2023/06/12-万顺福商城重构二期(下单)项目-后端刘欢让废弃删除此接口
	const CartSummary = () => new Promise((resolver, reject) => {});

	const UnAuthLogin = (params = {}) => vm.$u.post(url.UnAuthLogin, params);
	const AppletsUnAuthLogin = (params = {}) =>
		vm.$u.post(url.AppletsUnAuthLogin, params); // H5免密登录
	const QueryIsAllowDistribution = (params = {}) =>
		vm.$u.get(url.queryIsAllowDistribution, params); // H5免密登录
	const OneKeyLogin = (params = {}) => vm.$u.post(url.OneKeyLogin, params);
	const StoreCategory = (params = {}) => vm.$u.get(url.StoreCategory, params);

	const queryorderforreturn = (params = {}) =>
		vm.$u.get(url.queryorderforreturn, params);
	const applyreturn = (params = {}) => vm.$u.post(url.applyreturn, params);
	const cancelReturn = (params = {}) => vm.$u.get(url.cancelReturn, params);
	const backorderdetail = (params = {}) =>
		vm.$u.get(url.backorderdetail, params);
	const fillthelogistics = (params = {}) =>
		vm.$u.post(url.fillthelogistics, params);
	const pageAfterSaleOrder = (params = {}) =>
		vm.$u.get(url.pageAfterSaleOrder, params);
	const afterSalePage = (params = {}) => vm.$u.get(url.afterSalePage, params);
	const queryAllLogisCompanyName = (params = {}) =>
		vm.$u.get(url.queryAllLogisCompanyName, params);
	const BindNewMobileSendNewCode = (params = {}) =>
		vm.$u.get(url.BindNewMobileSendNewCode, params);
	const updateLogistics = (params = {}) =>
		vm.$u.post(url.updateLogistics, params);
	const dealApplyOverDue = (params = {}) =>
		vm.$u.get(url.dealApplyOverDue, params);
	const dealFillLogisticsOverDue = (params = {}) =>
		vm.$u.get(url.dealFillLogisticsOverDue, params);
	const updateApplyreturn = (params = {}) =>
		vm.$u.post(url.updateApplyreturn, params);
	const QueryBackOrderLog = (params = {}) =>
		vm.$u.get(url.QueryBackOrderLog, params);
	const getVerificationCode = (params = {}) =>
		vm.$u.post(url.getVerificationCode, params);
	const deleteBackOrder = (params = {}) =>
		vm.$u.post(url.deleteBackOrder, params);
	const ApplyRefundPass = (params = {}) =>
		vm.$u.get(url.ApplyRefundPass, params);
	const userConfirmationCompleted = (params = {}) =>
		vm.$u.post(url.userConfirmationCompleted, params);
	const SelectPerformanceSkuBySpuId = (params = {}) =>
		vm.$u.post(url.selectPerformanceSkuBySpuId, params);
	const getSpuSpeicalAreaList = (params = {}) =>
		vm.$u.get(url.getSpuSpeicalAreaList, params);
	const getMarketingById = (params = {}) =>
		vm.$u.get(url.getMarketingById, params);
	const QueryPerformanceFlag = (params = {}) =>
		vm.$u.get(url.queryPerformanceFlag, params);
	const getReasonList = (params = {}) => 
		vm.$u.post(url.GetReasonList, params);

	// 分销模块
	const getDistributionList = (params = {}) =>
		vm.$u.post(url.getDistributionList, params);
	const queryEarningsData = (params = {}) =>
		vm.$u.get(url.queryEarningsData, params);
	const queryDistributionRule = (params = {}) =>
		vm.$u.get(url.queryDistributionRule, params);

	const queryDistributionSku = (params = {}) =>
		vm.$u.get(url.queryDistributionSku, params);
	const getRulesList = (params = {}) => vm.$u.get(url.getRulesList, params);
	const shareForDistribution = (params = {}) =>
		vm.$u.get(url.shareForDistribution, params);
	/**
	 * 绑定/修改支付宝账号和姓名
	 * @param {string} realName 姓名
	 * @param {string} accountName 支付宝账号
	 * @param {string} code  验证码
	 */
	const UpdateAccountNameByUserId = (params = {}) =>
		vm.$u.put(url.UpdateAccountNameByUserId, params);
	const getShareCode = (params = {}) => vm.$u.post(url.getShareCode, params);
	/**
	 * 获取绑定支付宝的验证码
	 */
	const UpdateAccountSendcode = (params = {}) =>
		vm.$u.post(url.UpdateAccountSendcode, params);

	/**
	 * @param {string} code  验证码
	 * @param {string}  mobilePhone 手机号
	 * @param {number} loginSource 登录来源
	 */
	const verificationCodeLogin = (params = {}) =>
		vm.$u.post(url.verificationCodeLogin, params);
	const SeckillsceneSku = (params = {}) =>
		vm.$u.get(url.SeckillsceneSku, params);
	const Queryseckilldetail = (params = {}) =>
		vm.$u.post(url.Queryseckilldetail, params);
	const PanicBuySeckillscene = (params = {}) =>
		vm.$u.get(url.PanicBuySeckillscene, params);
	const QueryspuSeckillsceneDetail = (params = {}) =>
		vm.$u.get(url.QueryspuSeckillsceneDetail, params);
	const CheckSkuPanicBuyLimitNum = (params = {}) =>
		vm.$u.post(url.CheckSkuPanicBuyLimitNum, params);
	const CheckLimitNumBeforeSettlement = (params = {}) =>
		vm.$u.post(url.CheckLimitNumBeforeSettlement, params);
	const QueryDistributionOrder = (params = {}) =>
		vm.$u.post(url.QueryDistributionOrder, params);
	const QueryDistributionOrderDetail = (params = {}) =>
		vm.$u.post(url.QueryDistributionOrderDetail, params);
	const getDistributionOrderCount = (params = {}) =>
		vm.$u.post(url.getDistributionOrderCount, params);

	//提现记录
	const QueryWithdrawalRecords = (params = {}) =>
		vm.$u.get(url.QueryWithdrawalRecords, params);
	const QueryAllPayWithdrawalRecords = (params = {}) =>
		vm.$u.get(url.QueryAllPayWithdrawalRecords, params);
	const QueryDistributionOrdersByMonth = (params = {}) =>
		vm.$u.get(url.QueryDistributionOrdersByMonth, params);
	const QueryDistributionUserPayInfoByUserId = (params = {}) =>
		vm.$u.get(url.QueryDistributionUserPayInfoByUserId, params);
	const AddWithdrawalRecord = (params = {}) =>
		vm.$u.post(url.AddWithdrawalRecord, params);
	const judgeStatus = (params = {}) => vm.$u.get(url.judgeStatus, params);
	const Visit = (params = {}) => vm.$u.get(url.visit, params);
	const detailsVisit = (params = {}) => vm.$u.post(url.detailsVisit, params);
	const searchWordsVisit = (params = {}) => vm.$u.post(url.searchWordsVisit, params);
	const addBankCard = (params = {}) => vm.$u.post(url.addBankCard, params);
	const checkBankCard = (params = {}) => vm.$u.get(url.checkBankCard, params);
	const updateBankCard = (params = {}) => vm.$u.post(url.updateBankCard, params);
	const getShareRecord = (params = {}) => vm.$u.post(url.getShareRecord, params);
	const DeleteBrowseRecordById = (params = {}) => vm.$u.post(url.DeleteBrowseRecordById, params);

	const pagePlatformCoupon = (params = {}) => vm.$u.get(url.pagePlatformCoupon, params);
	const getUserActivity = (params = {}) => vm.$u.post(url.getUserActivity, params);
	const receiveCoupon = (params = {}) => vm.$u.get(url.receiveCoupon + "/" + params);
	const getCouponDetail = (params = {}) => vm.$u.get(url.getCouponDetail + "/" + params);
	const getDeliered = (params = {}) => vm.$u.get(url.getDeliered + "/" + params);
	const checkPlatformCoupon = (params = {}) => vm.$u.post(url.checkPlatformCoupon, params);
	const checkOrder = (params = {}) => vm.$u.get(url.checkOrder + "/" + params);
	const cancelOrderBatch = (params = {}) => vm.$u.post(url.cancelOrderBatch, params);
	const queryPayInfo = (params = {}) => vm.$u.get(url.queryPayInfo + "/" + params);
	const updateReceiptInfo = (params = {}) => vm.$u.post(url.updateReceiptInfo, params);
	
	// 站内信列表
	const queryNews = (params = {}) => vm.$u.post(url.queryStationList, params);
	// 站内信查未读数
	const queryNewsReadNums = (params = {}) => vm.$u.get(url.queryUnreadCount, params);
	// 更新阅读状态
	const updataNews = (params = {}) => vm.$u.get(url.updateStationNews, params);
	// 单个删除站内信
	const deleteStationNews = (params = {}) => vm.$u.get(url.deleteStationNews, params);
	// 按分组清空站内信
	const cleanStationNews = (params = {}) => vm.$u.get(url.cleanStationNews, params);
	const ValueCardCodeSelectPage = (params = {}) => vm.$u.get(url.ValueCardCodeSelectPage+"/"+params);
	const giftUsageLog = (params = {}) => vm.$u.get(url.giftUsageLog+"/"+ params);
	const valueCardCodeCount = (params = {}) => vm.$u.get(url.valueCardCodeCount, params);
	const valueCardCodeBanding = (params = {}) => vm.$u.get(url.valueCardCodeBanding, params);
	const selectListDistributionPopupWindowConfig = (params = {}) => vm.$u.get(url.selectListDistributionPopupWindowConfig, params);
	const advertVisit = (params = {}) => vm.$u.get(url.advertVisit, params);
	const shareVisit = (params = {}) => vm.$u.get(url.shareVisit, params);
	
	//根据订单号或售后单号查询物流
	const getLogisticsById = (params = {}) => vm.$u.get(url.getLogisticsById, params);
	//用户确认是否收到货
	const auditReceipt = (params = {}) => vm.$u.get(url.auditReceipt, params);
	//申请换货时校验商品
	const checkSpuOrSku = (params) => vm.$u.get(url.checkSpuOrSku, params);
	//获取版本号
	const getVersion = (params) => vm.$u.get(url.getVersion, params);
	// 直播
	const mallLiveGetLiveInfos = (params) => vm.$u.post(url.mallLiveGetLiveInfos, params);
	
	// 查询授权接口
	const SelectOneByCondition = (params) => vm.$u.post(url.SelectOneByCondition, params);
	// 查询授权接口
	const AddCustomerEmpower = (params) => vm.$u.post(url.AddCustomerEmpower, params);
	// 修改授权
	const UpdateCustomerEmpower = (params) => vm.$u.post(url.UpdateCustomerEmpower, params);
	// 查询万顺用户余额接口
	const QueryUserAsset = (params) => vm.$u.get(url.QueryUserAsset, params);
	// 微信或者混合支付
	const WechatMixedPay = (params) => vm.$u.post(url.WechatMixedPay, params);
	// 万顺宝余额支付
	const BalancePay = (params) => vm.$u.post(url.BalancePay, params);
	// 统一支付接口
	const ToPay = (params) => vm.$u.post(url.ToPay, params);
	// 查询分类接口
	const Categorybyparentid = (params) => vm.$u.get(url.Categorybyparentid, params);
	// 支付合并订单查询接口
	const SelectWsOrderInfoByOrderId = (params) => vm.$u.get(url.SelectWsOrderInfoByOrderId, params);
	// 实体店==>商品列表
	const PageAgencyStore = (params) => vm.$u.post(url.PageAgencyStore, params);
	// 实体店==>商品列表
	const AgencystoreDetails = (params) => vm.$u.post(url.AgencystoreDetails, params);
	// 实体店==>获取店铺信息
	const QueryAgencyStore = (params) => vm.$u.post(url.QueryAgencyStore, params);
	// 福气值流水
	const GetFqzStreamApplets = (params) => vm.$u.post(url.getFqzStreamApplets, params);
	// 福气值流水
	const GetFqzPrice = (params) => vm.$u.post(url.getFqzPrice, params);
	// 福气值比例接口
	const GetFqzPriceConfig = (params) => vm.$u.get(url.getFqzPriceConfig, params);
	// 新用户推广员注册
	const PromoteRegister = (params) => vm.$u.post(url.PromoteRegister, params);
	// 商城用户ID查询是否为分销员
	const QueryIsDistribution = (params) => vm.$u.post(url.QueryIsDistribution, params);
	// 名称查询实体店列表
	const QuerySelectOrgByCondition = (params) => vm.$u.post(url.QuerySelectOrgByCondition, params);
	// 用户端查询商品列表
	const QueryDistributionSpuList = (params) => vm.$u.post(url.QueryDistributionSpuList, params);	
	// 分销订单列表
	const QueryDistributionOrderNew = (params) => vm.$u.post(url.QueryDistributionOrderNew, params);
	// 获取推广码
	const ShareForDistribution = (params) => vm.$u.post(url.ShareForDistribution, params);
	// 根据推广员id查询推广员基本信息（手机号，身份类型）
	const QueryUserBasicInfoById = (params) => vm.$u.post(url.QueryUserBasicInfoById, params);
	// 获取热销广告、销售榜单
	const QueryAdvertSet = (params) => vm.$u.post(url.QueryAdvertSet, params);

	// 获取佣金统计卡
	const QueryUserCommission = (params) => vm.$u.post(url.QueryUserCommission, params);
	// 判断是否分销员(个人中心用)
	const IsDistributionCheck = (params) => vm.$u.post(url.IsDistributionCheck, params);
	// 生成单个商品海报
	const CreateShareCode = (params) => vm.$u.post(url.CreateShareCode, params);
	// 生成商品列表海报
	const CreateSpuListShareCode = (params) => vm.$u.post(url.CreateSpuListShareCode, params);

	// 我的店铺
	const GetMyStores = (params) => vm.$u.post(url.GetMyStores, params);
	// 关注店铺列表
	const FocusList = (params) => vm.$u.post(url.FocusList, params);
	// 是否关注店铺
	const FocusStoreState = (params) => vm.$u.post(url.FocusStoreState, params);
	// 关注实体店
	const FocusStore = (params) => vm.$u.post(url.FocusStore, params);
	// 取消关注实体店
	const UnFocusStore = (params) => vm.$u.post(url.UnFocusStore, params);
	// 店铺分享码
	const StoreCode = (params) => vm.$u.post(url.StoreCode, params);
	// 判断是否有退款中的
	const JudgeRefund = (params) => vm.$u.post(url.JudgeRefund, params);
	// 查询商品的SKU和价格
	const selectActivityCustomized = (params) => vm.$u.post(url.selectActivityCustomized, params)
	//查询发票详情
	const queryOrderAttr = (params) => vm.$u.get(url.queryOrderAttr, params)
	// 查询优惠券列表
	const QueryUserCouponList = (params) => vm.$u.post(url.QueryUserCouponList, params);
	// 商品优惠券列表查询
	const GetUserCoupons = (params) => vm.$u.post(url.GetUserCoupons, params);
	// 查询优惠列表
	const queryDiscounts = (params) => vm.$u.post(url.queryDiscounts, params);
	// 商品列表-优惠信息查询
	// const QuerySpuDiscountList = (params) => vm.$u.post(url.QuerySpuDiscountList, params)
      // 2023/06/12-万顺福商城重构二期(下单)项目-后端刘欢让废弃删除此接口
	const QuerySpuDiscountList = () => new Promise((resolver, reject) => {});

	// 购物车商品估价
	const cartDiscountSummary = (params) => vm.$u.post(url.cartDiscountSummary, params)
	// 首页搜索热词
	const QueryKeyword = (params) => vm.$u.post(url.QueryKeyword, params)
	// 查询分类模板
	const HomeTemplateById = (params) => vm.$u.get(url.HomeTemplateById, params)
	// 查询上牌指引
	const QueryLicence = (params = {}) => vm.$u.post(url.QueryLicence, params);
	// 查询附近门店
	const QueryStore = (params = {}) => vm.$u.post(url.QueryStore, params);
	// 查询电动车首页
	const QueryMotorHome = (params = {}) => vm.$u.post(url.QueryMotorHome, params);
	// 查询电动车首页-智慧生活
	const QueryEleCar = (params = {}) => vm.$u.post(url.QueryEleCar, params);
	// 查询电动车详情-智慧生活
	const QueryEleCarDetail = (params = {}) => vm.$u.post(url.QueryEleCarDetail, params);
	// 查询附近店铺-智慧生活
	const QueryNearbyStores = (params = {}) => vm.$u.post(url.QueryNearbyStores, params);
  	// 实时查询当前距离购买电动车门店信息
	const QueryMotorDeliveryGoods = (params = {}) => vm.$u.post(url.QueryMotorDeliveryGoods, params);
	// 电动车更换手机号
	const QueryMotorUpdateBindPhone = (params = {}) => vm.$u.post(url.QueryMotorUpdateBindPhone, params);
	// 电动车拨打电话
	const QueryMotorBindPhone = (params = {}) => vm.$u.post(url.QueryMotorBindPhone, params);		

    //2023三八女神节答题活动
    // 首次进入新建用户参与游戏记录在游戏首页调用一次
    const gameRecord = (params) => vm.$u.post(url.gameRecord, params)
    /**
     * 用户参与游戏记录 一共调用3次 
     * 1.进入游戏首页调用一次claimNum：0
     * 2.点击开始游戏的时候调用 claimNum: 0,id:取2中返回的data作为id,
     * 3.确认领券的时候调用 claimNum: 取领取优惠券的sendNumber,id跟2一样
     */
    const addRecord = (params) => vm.$u.post(url.addRecord, params)
    //查询游戏题目
    const getQuestionsList = (params) => vm.$u.get(url.getQuestionsList, params)
    //查询优惠券，返回的id威null表示活动失效
    const getCouponList = (params) => vm.$u.get(url.getCouponList, params)
    //领取优惠券
    const addCouponDistribute = (params) => vm.$u.post(url.addCouponDistribute, params)
    //查询我的优惠券
    const getMyCouponList = (params) => vm.$u.post(url.getMyCouponList, params)
    //查询排行榜
    const rankedList = (params) => vm.$u.get(url.rankedList, params)
    //点赞
    const giveALike = (params) => vm.$u.get(url.giveALike, params)
    //取消点赞
    const cancelLike = (params) => vm.$u.get(url.cancelLike, params)
		// 查询个人中心待付款和待收货轮播信息
	  const queryOrderRotographList = (params) => vm.$u.get(url.queryOrderRotographList, params);
		/**
		 *  查询个人中心配置
		 * @param {*} templateCode 
		 * 103个人中心配置、104订单列表配置
		 * @returns 
		 */
		const queryPersonConfigTemp= (templateCode) => vm.$u.post(url.queryPersonConfigTemp, {templateCode});
	// 根据专题id查专题详情
	const selectSubjectById = (params) => vm.$u.post(url.selectSubjectById, params);
	// 排行专题-查询二级分类
	const selectRankingSecondCate = (params) => vm.$u.post(url.selectRankingSecondCate, params);
	// 排行专题-查询专题内商品排行
	const selectSubjectRanking = (params) => vm.$u.post(url.selectSubjectRanking, params);
	// 品类热销-根据spuids查详情
	const selectSpuDeleteBySpuIds = (params) => vm.$u.post(url.selectSpuDeleteBySpuIds, params);
	// 专题自定义模板查询自定义商品
	const getCustomPageSpuList = (params) => vm.$u.post(url.getCustomPageSpuList, params);
	const getsiglePageSpuList = (params) => vm.$u.post(url.getsiglePageSpuList, params);
	
	// skuNo反查skuId
	const querySkuIdBySkuNo = (params) => vm.$u.post(url.querySkuIdBySkuNo, params);

    //提交订单服务消息推送 
    const uniformMessageSend = (params) => vm.$u.post(url.uniformMessageSend, params);

    //物流确认是否已签收
	const checkOrderTraces = (params = {}) => vm.$u.post(url.checkOrderTraces, params);
     // 售后单查询物溜
	const queryOrderTraces = (params = {}) => vm.$u.post(url.queryOrderTraces, params);
    // 换货查询商品详情-无校验
    const querySwapSpuDetail = (params = {}) => vm.$u.post(url.querySwapSpuDetail, params);
    
	//根据手机号获取归属地
	const getMobileArea = (params) => http.post(url.getMobileArea, params);
	//创建充值话费订单 
    const createOrder = (params) => http.post(url.createOrder, params); 
	//查询电话费配置 
    const queryPhoneFeeConfig = (params) => http.post(url.queryPhoneFeeConfig, params); 
	// 查询订单状态
    const queryOrderStatus = (params) => http.post(url.queryOrderStatus, params);
	// 查询充值订单记录
    const queryRechargeOrderList = (params) => http.post(url.queryRechargeOrderList, params); 
	// 查询充值订单详情
    const queryRechargeOrderDetail = (params) => http.post(url.queryRechargeOrderDetail, params); 
	// 删除充值订单
    const deleteRechargeOrder = (params) => http.post(url.deleteRechargeOrder, params); 
	// 查询服务说明
	const queryRechargeDescription = (params) => http.post(url.queryRechargeDescription, params); 
  // 查常用联系人（如果没有,添加本人注册手机号）
  const selectCustomerCommonPhoneListAndAdd = (params) =>
  vm.$u.post(url.selectCustomerCommonPhoneListAndAdd, params);
  // 常用联系人详情
  const selectCustomerCommonPhoneById = (params) =>
  vm.$u.post(url.selectCustomerCommonPhoneById, params);
  // 添加常用联系人
  const addCustomerCommonPhone = (params) =>
  vm.$u.post(url.addCustomerCommonPhone, params);
  // 修改常用联系人
  const updateCustomerCommonPhone = (params) =>
  vm.$u.post(url.updateCustomerCommonPhone, params);
  // 删除常用联系人
  const deleteCustomerCommonPhone = (params) =>
  vm.$u.post(url.deleteCustomerCommonPhone, params);

  // 集采商品列表
  const enterPriseGoodsList = (params) => vm.$u.post(url.enterPriseGoodsList, params); 
  // 集采商品详情
  const enterPriseGoodsDetail = (params) => vm.$u.post(url.enterPriseGoodsDetail, params); 
  // 集采评论列表
  const enterPriseGoodsComment = (params) => vm.$u.post(url.enterPriseGoodsComment, params); 
  // 集采评论数量
  const enterPriseGoodsCount = (params) => vm.$u.post(url.enterPriseGoodsCount, params); 
  // 获取集采分享的参数
  const getTokenData = (params) => vm.$u.post(url.getTokenData, params); 
  // 集采列表分享码
  const enterPriseGoodsCode = (params) => vm.$u.post(url.enterPriseGoodsCode, params); 
  
     

	// 将各个定义的接口名称，统一放进对象挂载到vm.$u.api(因为vm就是this，也即this.$u.api)下
	vm.$u.api = {
		mallLiveGetLiveInfos,
		valueCardCodeBanding,
		valueCardCodeCount,
		giftUsageLog,
		ValueCardCodeSelectPage,
		Visit,
		detailsVisit,
		searchWordsVisit,
		CheckLimitNumBeforeSettlement,
		CheckSkuPanicBuyLimitNum,
		QueryspuSeckillsceneDetail,
		PanicBuySeckillscene,
		Queryseckilldetail,
		SeckillsceneSku,
		UpdateAccountSendcode,
		UpdateAccountNameByUserId,
		verificationCodeLogin,
		getVerificationCode,
		GetLoginInfo,
		CustomerDetail,
		QueryMessageCount,
		QueryOrderMessageCount,
		GetCustomerStatistics,
		DealUserInfo,
		BindAccount,
		CheckMobileExist,
		ForgetPwdSendCode,
		RegisterSendCode,
		Registers,
		ForgetPwdUpdatePwd,
		GetRecommendList,
		QueryRecommendCommodity,
		AppletIndex,
		DistributionIndex,
		MessageList,
		UpdateMessageIsRead,
		UnBindAccount,
		Querybrowserecords,
		Queryattentions,
		QueryattentionStore,
		Emptybrowserecords,
		TotalPredeposit,
		Predeposits,
		UpdateCustomerInfo,
		EditCustomerUserName,
		QueryCustomerAddress,
		QueryCustomerAddressById,
		QueryAllProvinces,
		QueryCityByProvinceId,
		QueryDistrictByCityId,
		DeleteCustomerAddressById,
		AddAddress,
		UpdateAddress,
		UpdatePwdSendCode,
		UpdatePwdUpdate,
		BindNewMobileSendOldCode,
		BindNewMobileValidateOldCode,
		BindNewMobileUpdate,
		UpdatePayPwdSendCode,
		UpdatePayPwdUpdate,
		SearchSpu,
		QueryCustomerAddress,
		UpdatepwdCheckmobileexist,
		QueryCustomerAddressById,
		Querycommentsummarize,
		Queryskucomments,
		StoreInfo,
		CancelStoreAttention,
		AddStoreAttention,
		QueryStoreSpus,
		SubmitOrder,
		Settlement,
		QuerySpuDetail,
		QueryNoticeRecord,
		NoticeAllow,
		AddBrowseRecord,
		QueryShoppingCarts,
		AddShoppingCart,
		CancelSkuAttention,
		AddSkuAttention,
		QuerySpuSpecs,
		QueryPreDepositCount,
		DeleteCart,
		WechatAppletPayParams,
		Prepay,
		OrderdetailByorderCode,
		QueryCustomerOrders,
		UpdateCartNum,
		SearchAggregations,
		CalculateFreight,
		QueryShoppingCartCount,
		ShoppingcartSpec,
		OrderDetail,
		ApplyRefund,
		Unevaluated,
		CustomerComment,
		AddOrderSkuEvaluation,
		CancelOrder,
		DeleteOrder,
		ConfirmReceipt,
		ApplyRefundNew,
		ApplySkuRefundNew,
		BackOrderList,
		GetBaseInfoSet,
		GetExpress,
		GetSingleExpress,
		QueryCouponCount,
		QueryUserCoupons,
		QuerypageUserCoupons,
		QueryCouponList,
		ReceiveCoupons,
		CartSummary,
		UnAuthLogin,
		OneKeyLogin,
		StoreCategory,
		queryorderforreturn,
		applyreturn,
		cancelReturn,
		backorderdetail,
		getReasonList,
		fillthelogistics,
		pageAfterSaleOrder,
		afterSalePage,
		queryAllLogisCompanyName,
		BindNewMobileSendNewCode,
		updateLogistics,
		dealApplyOverDue,
		dealFillLogisticsOverDue,
		updateApplyreturn,
		QueryBackOrderLog,
		deleteBackOrder,
		ApplyRefundPass,
		userConfirmationCompleted,
		queryEarningsData,
		QueryDistributionOrder,
		QueryDistributionOrderDetail,
		queryDistributionSku,
		getDistributionList, //  分销首页列表
		getRulesList,
		getShareCode,
		shareForDistribution,
		QueryWithdrawalRecords,
		QueryAllPayWithdrawalRecords,
		QueryDistributionOrdersByMonth,
		QueryDistributionUserPayInfoByUserId,
		AddWithdrawalRecord,
		queryDistributionRule,
		AppletsUnAuthLogin,
		QueryIsAllowDistribution,
		judgeStatus,
		SelectPerformanceSkuBySpuId,
		getSpuSpeicalAreaList,
		getMarketingById,
		QueryPerformanceFlag,
		addBankCard,
		checkBankCard,
		updateBankCard,
		getShareRecord,
		getDistributionOrderCount,
		DeleteBrowseRecordById,
		pagePlatformCoupon,
		getUserActivity,
		receiveCoupon,
		getCouponDetail,
		getDeliered,
		checkPlatformCoupon,
		checkOrder,
		updateReceiptInfo,
		cancelOrderBatch,
		queryPayInfo,
		queryNews,
		queryNewsReadNums,
		updataNews,
		deleteStationNews,
		cleanStationNews,
		selectListDistributionPopupWindowConfig,
		getLogisticsById,
		auditReceipt,
		checkSpuOrSku,
		advertVisit,
		shareVisit,
		getVersion,
		SelectOneByCondition,
		AddCustomerEmpower,
		QueryUserAsset,
		UpdateCustomerEmpower,
		WechatMixedPay,
		QueryUserAsset,
		BalancePay,
		ToPay,
		Categorybyparentid,
		SelectWsOrderInfoByOrderId,
		PageAgencyStore,
		AgencystoreDetails,
		QueryAgencyStore,
		GetFqzStreamApplets,
		GetFqzPrice,
		GetFqzPriceConfig,
		PromoteRegister,
		QueryDistributionSpuList,
		QueryDistributionOrderNew,
		ShareForDistribution,
		QueryIsDistribution,
		QuerySelectOrgByCondition,
		QueryUserBasicInfoById,
		QueryAdvertSet,
		QueryUserCommission,
		IsDistributionCheck,
		CreateShareCode,
		CreateSpuListShareCode,

		GetMyStores,
		FocusList,
		FocusStoreState,
		FocusStore,
		UnFocusStore,
		StoreCode,

		JudgeRefund,
		selectActivityCustomized,
		queryOrderAttr,
		QueryUserCouponList,
		GetUserCoupons,
		queryDiscounts,
		QuerySpuDiscountList,
		cartDiscountSummary,
		QueryKeyword,
		HomeTemplateById,
		QueryLicence,
		QueryStore,
		QueryMotorHome,
		QueryEleCar,
		QueryEleCarDetail,
		QueryNearbyStores,
		QueryMotorDeliveryGoods,
		QueryMotorUpdateBindPhone,
		QueryMotorBindPhone,

        gameRecord,
        addRecord,
        getQuestionsList,
        getCouponList,
        addCouponDistribute,
        getMyCouponList,
        rankedList,
        giveALike,
        cancelLike,
				
		queryOrderRotographList,
		queryPersonConfigTemp,

		selectSubjectById,
		selectRankingSecondCate,
		selectSubjectRanking,
		selectSpuDeleteBySpuIds,
		getCustomPageSpuList,
		getsiglePageSpuList,
		querySkuIdBySkuNo,

        uniformMessageSend,
        queryOrderTraces,
        checkOrderTraces,
        querySwapSpuDetail,
		getMobileArea,
		createOrder,
		queryPhoneFeeConfig,
		queryOrderStatus,
		queryRechargeOrderList,
		queryRechargeOrderDetail,
		deleteRechargeOrder,
		queryRechargeDescription,
    selectCustomerCommonPhoneListAndAdd,
		selectCustomerCommonPhoneById,
		addCustomerCommonPhone,
		updateCustomerCommonPhone,
		deleteCustomerCommonPhone,
        enterPriseGoodsList,
        enterPriseGoodsDetail,
        enterPriseGoodsComment,
        getTokenData,
        enterPriseGoodsCount,
        enterPriseGoodsCode
	};
};

export default {
	install,
};

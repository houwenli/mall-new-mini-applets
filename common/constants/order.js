// 业务线类型
// 查询单个业务线必传 100电商，200充值
export const BUSINESS_TYPE = {
  mall: 100, // 电商
  recharge: 200, // 充值
}

export const ORDER_STATUS = {
	all: -1, // 全部
	waitPay: 10, // 待付款
	waitReceive: 20, // 待收货
	waitUse: 30, // 待使用
	waitEval: 40, // 待评价
	// complete: 50, // 已完成
	// afterSale: 60, // 已过售后
	// cancel: 70, // 已取消
	refund: 80, // 退款/售后
}

export const ORDER_STATUS_MAP = {
	[ORDER_STATUS.all]: '全部',
	[ORDER_STATUS.waitPay]: '待付款',
	[ORDER_STATUS.waitReceive]: '待收货',
	[ORDER_STATUS.waitUse]: '待使用',
	[ORDER_STATUS.waitEval]: '待评价',
	[ORDER_STATUS.complete]: '已完成',
	[ORDER_STATUS.refund]: '退款/售后',
	[ORDER_STATUS.cancel]: '已取消',
	[ORDER_STATUS.afterSale]: '售后',
}

// 拼装订单类型列表
let orderStatusList = []
for(let statu in ORDER_STATUS) {
	orderStatusList.push({
		name: ORDER_STATUS_MAP[ORDER_STATUS[statu]],
		status: ORDER_STATUS[statu]
	})
}

// 订单类型
export const ORDER_STATUS_LIST = orderStatusList


// 按钮
export const BTN_ID = {
	buyAgain: 10, // 再来一单
	receiveSure: 30, // 确认收货
	pay: 50, // 支付
	cancel: 70, // 取消
	evaluat: 80, // 晒单评价
}
export const BTN_LIST = {
	// 再来一单
	[BTN_ID.buyAgain]: {
		text: '再来一单',
		style: 'red'
	},
	// 确认收货
	[BTN_ID.receiveSure]: {
		text: '确认收货',
	},
	// 支付
	[BTN_ID.pay]: {
		text: '去支付',
		style: 'red'
	},
	// 取消
	[BTN_ID.cancel]: {
		text: '取消订单',
	},
	// 取消
	[BTN_ID.evaluat]: {
		text: '评价晒单',
	}
}
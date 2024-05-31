export const invoiceRules = {
	// 发票抬头
	title: [{
		required: true,
		message: '请输入发票抬头',
		// 可以单个或者同时写两个触发验证方式
		trigger: ['change']
	}],
	// 纳税人识别号
	taxId: [{
		min: 5,
		message: '请输入纳税人识别号',
		trigger: 'change'
	}],
	// 收票人联系电话
	invoicePhone: [{
		len: 11,
		validator: (rule, value, callback) => {
			// 上面有说，返回true表示校验通过，返回false表示不通过
			// this.$u.test.mobile()就是返回true或者false的
			return this.$u.test.mobile(value);
		},
		message: '请输入正确的手机号码',
		trigger: 'change'
	}]
}

export const orderStatusList = [
	{
		name: '全部',
		status: -1
	}, 
	{
		name: '待付款',
		status: 1,
		badgeKey: 'toPayCount'
	}, 
	{
		name: '待收货',
		status: 2,
		badgeKey: 'toReceiptAndDeliverCount'
	},
	{
		name: '待评价',
		status: 5,
		badgeKey: 'toEvaluateCount'
	},
	{
		name: '退款/售后',
		status: 7,	
	},
]
export const evaluationCenterStatusList = [
	{
		name: '待评价',
		status: 1
	},
	
	{
		name: '已评价',
		status: 2
	}
]

export const backOrderStatusList = [
	{
		name: '售后申请',
		status: 1
	},
	
	{
		name: '处理中',
		status: 2
	},
	
	{
		name: '申请记录',
		status: 3  
	}
]

export const couponStatusList = [
	{
		name: '已使用',
		status: 2
	}, 
	{
		name: '已过期',
		status: 3,
	},
]
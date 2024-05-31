// 退单状态字典
export const logStatusDict = [
  {
    label: '[退款处理中]',
    value: 1
  },
  {
    label: '退款申请已通过',
    value: 2
  },
  {
    label: '退款申请已拒绝',
    value: 3
  },
  // {
  //   label: '退款成功',
  //   value: 2
  // },
  // {
  //   label: '退款拒绝',
  //   value: 3
  // },
  {
    label: '退货申请',
    value: 4
  },
  {
    label: '退货拒绝',
    value: 5
  },
  {
    label: '退货审核通过等待用户填写物流',
    value: 6
  },
  {
    label: '待收货',
    value: 7
  },
  {
    label: '退货完成',
    value: 8
  },
  {
    label: '退货失败',
    value: 9
  },
  {
    label: '发放金额',
    value: 10
  },
  {
    label: '用户取消申请',
    value: 11
  },
  {
    label: '用户修改申请',
    value: 12
  },
	{
	  label: '退款申请已通过',
	  value: 31
	}
]

// 支付方式字典
export const payChannelDict = [
  {
    label: '万顺宝余额支付',
    value: 0
  },
  {
    label: '钱包支付',
    value: 1
  },
  {
    label: '微信支付',
    value: 2
  },
  {
    label: '支付宝支付',
    value: 3
  },
  {
    label: '银联支付',
    value: 4
  },
	{
	  label: '平台代付',
	  value: 5
	},
  {
	  label: '礼品卡支付',
	  value: 6
	},
  {
	  label: '微信+万顺宝余额支付',
	  value: 7
	},
  {
	  label: '支付宝+万顺宝余额支付',
	  value: 8
	},
  {
	  label: '福气值支付',
	  value: 9
	},
  {
	  label: '福气值+万顺宝余额支付',
	  value: 10
	},
  {
	  label: '福气值+支付宝支付',
	  value: 11
	},
  {
	  label: '福气值+微信支付',
	  value: 12
	},
  {
	  label: '福气值+万顺宝余额+支付宝支付',
	  value: 13
	},
  {
	  label: '福气值+万顺宝余额+微信支付',
	  value: 14
	},
]

// 推广订单类型字典
export const promotionDict = [
  {
    label: '全部',
		name: '全部',
		distributionStatus: '',
    value: 1
  },
  {
    label: '已下单',
		distributionStatus: 1,
		name: '已下单',
    value: 2
  },
  {
    label: '已签收',
		name: '已签收',
		distributionStatus: 2,
    value: 3
  },
  {
    label: '已结算',
		name: '已结算',
		distributionStatus: 3,
    value: 4
  },
  {
    label: '已失效',
		distributionStatus: 0,
		name: '已失效',
    value: 5
  },
]

// 分销订单状态类型字典
export const distributionStatusDict = [
  {
    label: '已下单',
		icon: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com///d6126e4fb73b820d05eb58e117a02713.png',
    value: 1
  },
  {
    label: '已签收',
		icon: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com///b2ff92aef0786b5692cf43669f55c4ce.png',
    value: 2
  },
  {
    label: '已结算',
		icon: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com///c6d7033350fee1d6e2e6878ef50f9606.png',
    value: 3
  },
  {
    label: '已失效',
		icon: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com///4228bf680d16220c03479418ccd34df0.png',
    value: 0
  },
]

// 订单状态类型字典
export const orderStatusDict = {
  1:"待付款",  
  2:"待发货", 
  3:"待收货", 
  4:"已完成", 
  5:"取消订单",
  6:"退款通过", 
  7:"退货通过"
}